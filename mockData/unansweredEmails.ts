import { Email, EmailStatus, User } from '../types';

const currentUser: User = {
    id: 'u1',
    name: 'Alex Mercer',
    email: 'alex@maildash.io',
    avatar: 'https://picsum.photos/100/100?random=1',
};

export const unansweredEmails: Email[] = [
  {
    id: "unanswered-1",
    subject: "Re: Your thoughts on Q3 marketing budget",
    sender: "example1@google.com",
    recipient: currentUser,
    snippet: "Just wanted to follow up on this. Let me know your thoughts.",
    body: "This is the full thread body.",
    date: new Date("2026-02-27T10:00:00Z").toISOString(),
    isRead: false,
    status: EmailStatus.UNANSWERED,
    labels: ["Follow-up"],
    hasAttachment: false,
    sentiment: "Neutral",
    threadLink: "https://mail.google.com/mail/u/0/#inbox/1",
    lastReply: "This is the last reply from the sender.",
    response: "",
    notes: "",
    fullThreadBody: "This is the full thread body.",
  },
  {
    id: "unanswered-2",
    subject: "URGENT: Project Phoenix deadline approaching",
    sender: "example2@google.com",
    recipient: currentUser,
    snippet: "We need your approval on the latest designs by EOD.",
    body: "This is the full thread body of another thread.",
    date: new Date("2026-02-27T11:00:00Z").toISOString(),
    isRead: false,
    status: EmailStatus.UNANSWERED,
    labels: ["Urgent", "Action Required"],
    hasAttachment: true,
    sentiment: "Negative",
    threadLink: "https://mail.google.com/mail/u/0/#inbox/2",
    lastReply: "This is another last reply from the sender.",
    response: "",
    notes: "",
    fullThreadBody: "This is the full thread body of another thread.",
  },
];
