import { Email, EmailStatus } from '../types';

export const mockUnansweredEmails: Email[] = [
  {
    id: 'unanswered-e1',
    subject: 'Follow-up: Project Phoenix Proposal',
    sender: 'project.phoenix@example.com',
    recipient: 'alex@maildash.io',
    snippet: 'We are still waiting on your feedback regarding the proposed changes to the Project Phoenix...',
    body: `<p>Hi Alex,</p>
           <p>We are still waiting on your feedback regarding the proposed changes to the Project Phoenix. We'd like to move forward by end of week.</p>
           <p>Please let us know your thoughts.</p>
           <p>Best,<br/>Phoenix Team</p>`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    isRead: false,
    status: EmailStatus.UNANSWERED,
    labels: ['Urgent', 'Project'],
    threadLink: 'https://mail.google.com/mail/u/0/#inbox/thread-id-phoenix',
    lastReply: 'We are still waiting on your feedback regarding the proposed changes to the Project Phoenix...',
    response: '',
    notes: 'Need to review the proposal changes and provide feedback by Friday.'
  },
  {
    id: 'unanswered-e2',
    subject: 'Question about the Q2 Marketing Report',
    sender: 'marketing.team@example.com',
    recipient: 'alex@maildash.io',
    snippet: 'Alex, could you clarify the numbers in section 3.2 of the Q2 Marketing Report?',
    body: `<p>Hi Alex,</p>
           <p>Hope you're doing well. We were going through the Q2 Marketing Report and had a quick question about section 3.2.</p>
           <p>Could you clarify the numbers regarding the social media engagement? It seems a bit higher than expected.</p>
           <p>Thanks,<br/>Marketing Team</p>`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    isRead: false,
    status: EmailStatus.UNANSWERED,
    labels: ['Question', 'Report'],
    threadLink: 'https://mail.google.com/mail/u/0/#inbox/thread-id-marketing',
    lastReply: 'Alex, could you clarify the numbers in section 3.2 of the Q2 Marketing Report?',
    response: '',
    notes: 'Check social media engagement data for Q2 report.'
  },
  {
    id: 'unanswered-e3',
    subject: 'Partnership Inquiry: Global Innovations',
    sender: 'partnerships@globalinnovations.com',
    recipient: 'alex@maildash.io',
    snippet: 'We are interested in exploring a potential partnership opportunity with Maildash CRM...',
    body: `<p>Dear Alex,</p>
           <p>Global Innovations is a leading technology firm specializing in enterprise solutions. We are interested in exploring a potential partnership opportunity with Maildash CRM to integrate our services.</p>
           <p>Please let us know if you are open to a brief introductory call.</p>
           <p>Sincerely,<br/>Partnership Team</p>`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    isRead: false,
    status: EmailStatus.UNANSWERED,
    labels: ['Partnership', 'New Lead'],
    threadLink: 'https://mail.google.com/mail/u/0/#inbox/thread-id-global',
    lastReply: 'We are interested in exploring a potential partnership opportunity with Maildash CRM...',
    response: '',
    notes: 'Research Global Innovations. Schedule intro call.'
  },
];
