import { DealStage, TaskStatus, EmailStatus, User, Deal, Task, Email, Activity } from './types';

export const currentUser: User = {
  id: 'u1',
  name: 'Alex Mercer',
  email: 'alex@maildash.io',
  avatar: 'https://picsum.photos/100/100?random=1',
};

const mockUsers: User[] = [
  { id: 'c1', name: 'Sarah Jenkins', email: 'sarah.j@acmecorp.com', avatar: 'https://picsum.photos/100/100?random=2' },
  { id: 'c2', name: 'Michael Chen', email: 'm.chen@techflow.io', avatar: 'https://picsum.photos/100/100?random=3' },
  { id: 'c3', name: 'Emma Watson', email: 'emma@studiocreative.net', avatar: 'https://picsum.photos/100/100?random=4' },
  { id: 'c4', name: 'David Rodriguez', email: 'david.r@globallogistics.com', avatar: 'https://picsum.photos/100/100?random=5' },
  { id: 'c5', name: 'Jessica Alba', email: 'jessica@horizonventures.com', avatar: 'https://picsum.photos/100/100?random=6' },
  { id: 'c6', name: 'Tom Hardy', email: 'tom.h@nexusindustries.com', avatar: 'https://picsum.photos/100/100?random=7' },
];

export const initialDeals: Deal[] = [
  { id: 'd1', title: 'Acme Corp Enterprise License', value: 45000, stage: DealStage.NEGOTIATION, ownerId: 'u1', closeDate: '2023-11-15', notes: 'Waiting on legal review of the standard contract. Sarah seems positive.' },
  { id: 'd2', title: 'TechFlow Team Plan Upgrade', value: 12000, stage: DealStage.LEAD, ownerId: 'u1', closeDate: '2023-12-01', notes: 'Initial call went well, need to send over case studies.' },
  { id: 'd3', title: 'Studio Creative Q4 Campaign', value: 8500, stage: DealStage.CLOSED_WON, ownerId: 'u1', closeDate: '2023-10-20', notes: 'Deal closed successfully. Handed off to onboarding.' },
  { id: 'd4', title: 'Horizon Ventures Seed Tools', value: 25000, stage: DealStage.LEAD, ownerId: 'u1', closeDate: '2023-12-15', notes: 'Jessica wants a full demo for her partners next week.' },
  { id: 'd5', title: 'Nexus Industries Pilot', value: 5000, stage: DealStage.CLOSED_LOST, ownerId: 'u1', closeDate: '2023-10-05', notes: 'Went with a competitor due to budget constraints.' },
];

export const initialTasks: Task[] = [
  { id: 't1', title: 'Follow up on legal review', dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), assigneeId: 'u1', status: TaskStatus.PENDING, relatedDealId: 'd1' },
  { id: 't2', title: 'Send case studies to Michael', dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), assigneeId: 'u1', status: TaskStatus.OVERDUE, relatedDealId: 'd2' },
  { id: 't3', title: 'Prepare demo deck for Horizon', dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(), assigneeId: 'u1', status: TaskStatus.PENDING, relatedDealId: 'd4' },
  { id: 't4', title: 'Send onboarding welcome gift', dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), assigneeId: 'u1', status: TaskStatus.COMPLETED, relatedDealId: 'd3' },
  { id: 't5', title: 'Quarterly check-in with David', dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), assigneeId: 'u1', status: TaskStatus.PENDING },
];

export const initialEmails: Email[] = [
  {
    id: 'e1',
    subject: 'Re: Enterprise License Contract - Final Review',
    sender: mockUsers[0],
    recipient: currentUser,
    snippet: 'Hi Alex, our legal team has reviewed the contract and we just have a few minor redlines...',
    body: `<p>Hi Alex,</p>
           <p>Our legal team has reviewed the standard contract you sent over last week.</p>
           <p>We just have a few minor redlines regarding the SLA uptime guarantees and the liability clauses. I've attached the document with tracked changes.</p>
           <p>If we can get these smoothed out by Wednesday, we should be good to sign by Friday.</p>
           <p>Best regards,<br/>Sarah</p>`,
    date: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    isRead: false,
    status: EmailStatus.INBOX,
    labels: ['Important', 'Contract'],
    dealId: 'd1',
    hasAttachment: true,
    sentiment: 'Positive'
  },
  {
    id: 'e5',
    subject: 'Demo Request: Horizon Ventures',
    sender: mockUsers[4],
    recipient: currentUser,
    snippet: 'Alex, could we schedule a deep dive demo for my partners next Tuesday?',
    body: `<p>Alex,</p>
           <p>Thanks for the quick chat earlier. I discussed the high-level features with my partners and they are very interested in the automation capabilities.</p>
           <p>Could we schedule a 45-minute deep dive demo for next Tuesday? We'd like to see how it integrates with our existing tech stack.</p>
           <p>Let me know your availability.</p>
           <p>Jessica</p>`,
    date: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    isRead: false,
    status: EmailStatus.INBOX,
    labels: ['Demo', 'Action Required'],
    dealId: 'd4',
    hasAttachment: false,
    sentiment: 'Positive'
  },
  {
    id: 'e2',
    subject: 'Checking in - Team Plan features',
    sender: mockUsers[1],
    recipient: currentUser,
    snippet: 'Hey Alex, quick question about the custom reporting features on the Team plan...',
    body: `<p>Hey Alex,</p>
           <p>Thanks for the demo yesterday. I was reviewing the pricing deck with my team.</p>
           <p>We had a quick question about the custom reporting features on the Team plan. Does it allow for scheduled PDF exports to external stakeholders?</p>
           <p>Let me know when you have a moment.</p>
           <p>Thanks,<br/>Michael</p>`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: true,
    status: EmailStatus.INBOX,
    labels: ['Question'],
    dealId: 'd2',
    hasAttachment: false,
    sentiment: 'Neutral'
  },
  {
    id: 'e6',
    subject: 'Decision on Pilot Program',
    sender: mockUsers[5],
    recipient: currentUser,
    snippet: 'Alex, after careful consideration, we have decided to go in another direction...',
    body: `<p>Hi Alex,</p>
           <p>I wanted to follow up on our pilot program discussions.</p>
           <p>After careful consideration and reviewing our Q4 budget constraints, we have decided to go in another direction for now. Your product is excellent, but the timing isn't right for us.</p>
           <p>We will keep you in mind for future initiatives.</p>
           <p>Best,<br/>Tom</p>`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    isRead: true,
    status: EmailStatus.INBOX,
    labels: ['Feedback'],
    dealId: 'd5',
    hasAttachment: false,
    sentiment: 'Negative'
  },
  {
    id: 'e3',
    subject: 'Onboarding completed!',
    sender: mockUsers[2],
    recipient: currentUser,
    snippet: 'Just wanted to say thanks for the smooth onboarding process. The team is already...',
    body: `<p>Hi Alex,</p>
           <p>Just wanted to say thanks for the smooth onboarding process. The team is already setting up their campaigns and finding the tool very intuitive.</p>
           <p>We'll reach out to support if we hit any snags, but so far so good!</p>
           <p>Cheers,<br/>Emma</p>`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    isRead: true,
    status: EmailStatus.INBOX,
    labels: ['Success'],
    dealId: 'd3',
    hasAttachment: false,
    sentiment: 'Positive'
  },
  {
    id: 'e7',
    subject: 'Draft: Q4 Strategy alignment',
    sender: currentUser,
    recipient: mockUsers[0],
    snippet: 'Here is the preliminary deck for our Q4 strategy alignment call...',
    body: `<p>Hi Sarah,</p><p>Here is the preliminary deck for our Q4 strategy alignment call.</p>`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    isRead: true,
    status: EmailStatus.DRAFT,
    labels: [],
    dealId: 'd1',
    hasAttachment: true,
    sentiment: 'Neutral'
  },
  {
    id: 'e4',
    subject: 'Pricing inquiry for Global Logistics',
    sender: mockUsers[3],
    recipient: currentUser,
    snippet: 'We are looking for a new CRM solution for our 50-person sales team and wanted to get a quote...',
    body: `<p>To Whom It May Concern,</p>
           <p>We are currently evaluating new CRM solutions for our 50-person global sales team.</p>
           <p>Could you please provide a ballpark quote for a deployment of this size, including implementation services?</p>
           <p>Regards,<br/>David Rodriguez<br/>Director of Sales Ops</p>`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    isRead: true,
    status: EmailStatus.INBOX,
    labels: ['New Lead'],
    hasAttachment: false,
    sentiment: 'Neutral'
  },
  {
    id: 'e8',
    subject: 'Follow-up on Acme Enterprise',
    sender: currentUser,
    recipient: mockUsers[0],
    snippet: 'Hi Sarah, just wanted to bump this to the top of your inbox...',
    body: `<p>Hi Sarah, just wanted to bump this to the top of your inbox.</p>`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    isRead: true,
    status: EmailStatus.SENT,
    labels: [],
    dealId: 'd1',
    hasAttachment: false,
    sentiment: 'Neutral'
  }
];

export const initialActivities: Activity[] = [
  { id: 'a1', type: 'email', description: 'Sarah Jenkins replied to Enterprise License', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), user: mockUsers[0], dealId: 'd1' },
  { id: 'a2', type: 'deal', description: 'Moved Studio Creative to Closed Won', timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(), user: currentUser, dealId: 'd3' },
  { id: 'a3', type: 'task', description: 'Completed task: Send onboarding welcome gift', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), user: currentUser },
  { id: 'a4', type: 'email', description: 'New Demo Request from Horizon Ventures', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), user: mockUsers[4], dealId: 'd4' },
  { id: 'a5', type: 'deal', description: 'Nexus Industries Pilot updated to Closed Lost', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), user: currentUser, dealId: 'd5' },
];
