import React from 'react';
import { Email } from '../types';
import { EmailList } from './EmailList';

interface UnansweredDashboardProps {
  unansweredEmails: any[];
}

export const UnansweredDashboard: React.FC<UnansweredDashboardProps> = ({ unansweredEmails }) => {
  const transformedEmails: Email[] = unansweredEmails.map((ue: any) => ({
    id: ue.ThreadID,
    subject: ue.LastReply || "No Subject",
    sender: ue.LastSender || "Unknown Sender",
    recipient: "me@example.com", // Placeholder
    snippet: ue.LastReply || "No Snippet",
    body: ue.FullThreadBody || "No Body",
    date: ue.Date_Excel ? new Date(ue.Date_Excel).toISOString() : new Date().toISOString(),
    isRead: false,
    status: "Unanswered", // Assuming 'Unanswered' status
    labels: ["unanswered"],
    hasAttachment: false, // Default
    sentiment: "Neutral", // Default
    threadLink: ue.ThreadLink,
    response: ue.Response,
    notes: ue.Notes,
    fullThreadBody: ue.FullThreadBody,
  }));

  // Dummy functions for EmailList props
  const onSelectEmail = (id: string) => {
    console.log("Selected email:", id);
  };
  const sortState = { field: 'date', direction: 'desc' as const };
  const onSort = (field: keyof Email | 'dealValue') => {
    console.log("Sort by:", field);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative z-10">
      <div className="px-8 py-6 border-b border-white/5 glass flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            Unanswered Emails
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {unansweredEmails.length} unanswered emails.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <EmailList
          emails={transformedEmails}
          selectedEmailId={null} // No email selected by default
          onSelectEmail={onSelectEmail}
          sortState={sortState}
          onSort={onSort}
        />
      </div>
    </div>
  );
};
