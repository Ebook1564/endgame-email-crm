import csv
import os
import time
import re
import json
import base64
import pandas as pd
import sys
from datetime import datetime
from email.utils import parsedate_tz
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
CSV_FILE = 'email_dashboard.csv'
JSON_FILE = 'email_dashboard.json'
BLACKLIST_FILE = 'blacklist_updated.csv'
RUN_ONCE = '--once' in sys.argv

def authenticate_gmail():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return build('gmail', 'v1', credentials=creds)

def read_blacklist(csv_file):
    blacklist = set()
    if os.path.exists(csv_file):
        with open(csv_file, newline='', encoding='utf-8') as file:
            reader = csv.reader(file)
            for row in reader:
                if row:
                    blacklist.add(row[0].strip().lower())
    return blacklist

def format_date_for_excel(date_str):
    """Convert Gmail format to Excel MM/DD/YYYY HH:MM"""
    if not date_str:
        return ""
    dt = parsedate_tz(date_str)
    if dt is None:
        return date_str
    dt_obj = datetime(*dt[:6])
    return dt_obj.strftime("%m/%d/%Y %H:%M")

def extract_thread_last_message(thread):
    messages = thread.get('messages', [])
    if not messages:
        return None, None, None, None, None
    last_message = max(messages, key=lambda m: int(m['internalDate']))
    headers = last_message.get('payload', {}).get('headers', [])
    sender = subject = date = body = None
    for header in headers:
        if header['name'] == 'From':
            sender = header['value']
        elif header['name'] == 'Subject':
            subject = header['value']
        elif header['name'] == 'Date':
            date = format_date_for_excel(header['value'])
    body = extract_message_body(last_message.get('payload', {}))
    return sender, subject, date, body, last_message['id']

def truncate_last_reply(body):
    if not body:
        return ""
    lines = body.split('\n')
    new_reply = []
    for line in lines:
        if re.match(r'^[>|\s]*$', line.strip()):
            continue
        if re.match(r'^On.*wrote:$', line.strip()):
            continue
        if re.match(r'^[>].*', line.strip()):
            continue
        new_reply.append(line.strip())
    cleaned = ' '.join(new_reply).strip()
    return cleaned[:1000] + '...' if len(cleaned) > 1000 else cleaned

def extract_message_body(payload):
    plain_text = ""
    html_text = ""
    def recurse_payload(p):
        nonlocal plain_text, html_text
        if 'body' in p and p['body'].get('data'):
            data = p['body']['data']
            decoded = base64.urlsafe_b64decode(data.encode('UTF-8')).decode('utf-8', errors='replace')
            if p.get('mimeType') == 'text/plain':
                plain_text = decoded
            elif p.get('mimeType') == 'text/html':
                html_text = decoded
        elif 'parts' in p:
            for part in p['parts']:
                recurse_payload(part)
    recurse_payload(payload)
    return plain_text or html_text or ""

def get_full_thread_body(thread):
    full_body = []
    messages = thread.get('messages', [])
    for message in sorted(messages, key=lambda m: int(m['internalDate'])):
        payload = message.get('payload', {})
        msg_body = extract_message_body(payload)
        if msg_body:
            full_body.append(f"--- Message {message['id'][:8]} ---\n{msg_body}\n")
    return '\n'.join(full_body)

def get_unanswered_emails(service, blacklist):
    """Fetch unanswered emails with exact column structure"""
    query = 'in:inbox is:unread -in:sent after:2023/09/01'
    results = []
    
    try:
        response = service.users().threads().list(userId='me', q=query, maxResults=50).execute()
        threads = response.get('threads', [])
        
        for thread_meta in threads:
            thread_id = thread_meta['id']
            thread = service.users().threads().get(userId='me', id=thread_id).execute()
            
            sender, subject, date, body, msg_id = extract_thread_last_message(thread)
            if sender:
                sender_email = sender.split('<')[-1].strip('> ').lower() if '<' in sender else sender.lower()
                if sender_email not in blacklist:
                    results.append({
                        'ThreadID': thread_id,
                        'ThreadLink': f"https://mail.google.com/mail/u/0/#inbox/{thread_id}",
                        'LastSender': sender_email,
                        'Date_Excel': date,
                        'LastReply': truncate_last_reply(body),
                        'Response': '',
                        'Notes': '',
                        'FullThreadBody': get_full_thread_body(thread)
                    })
    except HttpError as e:
        if e.resp.status == 429:
            time.sleep(60)
        print(f"API Error: {e}")
    
    return results

def smart_append_to_existing(service, blacklist):
    """Smart append: preserve human edits, add only new threads"""
    existing_threads = set()
    
    # Load existing CSV (preserve 8000+ rows with human edits)
    if os.path.exists(CSV_FILE):
        existing_df = pd.read_csv(CSV_FILE)
        existing_threads = set(existing_df['ThreadID'].astype(str))
        print(f"✅ Loaded {len(existing_threads)} existing threads")
    else:
        existing_df = pd.DataFrame()
    
    # Get new unanswered emails
    new_emails = get_unanswered_emails(service, blacklist)
    new_threads = set(email['ThreadID'] for email in new_emails)
    truly_new = [email for email in new_emails if email['ThreadID'] not in existing_threads]
    
    print(f"📧 Found {len(new_emails)} unanswered, {len(truly_new)} NEW")
    
    if not truly_new:
        print("✅ No new threads")
        return
    
    # Convert to DataFrame and append
    new_df = pd.DataFrame(truly_new)
    
    if not existing_df.empty:
        combined_df = pd.concat([existing_df, new_df], ignore_index=True)
        
        # FIXED: Safe date parsing and formatting
        combined_df['Date_Excel'] = pd.to_datetime(combined_df['Date_Excel'], errors='coerce')
        
        # Remove NaT rows or fill with current time before sorting
        mask = combined_df['Date_Excel'].notna()
        valid_df = combined_df[mask].copy()
        invalid_df = combined_df[~mask].copy()
        
        if not valid_df.empty:
            valid_df = valid_df.sort_values('Date_Excel', ascending=False)
        
        # Handle invalid dates - put at bottom with current timestamp
        if not invalid_df.empty:
            invalid_df['Date_Excel'] = pd.Timestamp.now()
            invalid_df = invalid_df.sort_values('Date_Excel', ascending=False)
        
        # Combine valid + invalid
        combined_df = pd.concat([valid_df, invalid_df], ignore_index=True)
        
        # Format dates safely (only valid datetime objects)
        combined_df['Date_Excel'] = combined_df['Date_Excel'].apply(
            lambda x: x.strftime('%m/%d/%Y %H:%M') if pd.notna(x) else '01/01/2025 00:00'
        )
    else:
        combined_df = new_df.sort_values('Date_Excel', ascending=False)
    
    # Save both CSV and JSON
    combined_df.to_csv(CSV_FILE, index=False)
    
    json_data = {
        'last_updated': datetime.now().isoformat(),
        'total_threads': len(combined_df),
        'new_threads_added': len(truly_new),
        'emails': combined_df.to_dict('records')
    }
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2)
    
    print(f"✅ Saved {len(combined_df)} total threads (+{len(truly_new)} new)")

def main():
    print("🚀 Gmail Unanswered Email Monitor Starting...")
    service = authenticate_gmail()
    blacklist = read_blacklist(BLACKLIST_FILE)
    
    smart_append_to_existing(service, blacklist)
    
    if RUN_ONCE:
        print("✅ One-time refresh complete")
        return
    
    # Continuous monitoring
    while True:
        try:
            time.sleep(60)
            smart_append_to_existing(service, blacklist)
        except KeyboardInterrupt:
            print("\n⏹️ Stopped by user")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            time.sleep(30)

if __name__ == '__main__':
    main()
