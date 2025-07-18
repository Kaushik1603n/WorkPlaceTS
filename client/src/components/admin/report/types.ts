export interface Client {
  id: string;
  email: string;
  name?: string;
}

export type Status = 'open' | 'pending' | 'resolved' | 'closed';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Ticket {
  _id: string;
  client: Client;
  createdAt: string;
  description: string;
  jobId: string;
  reportedBy: string;
  status: Status;
  title: string;
  updatedAt: string;
  priority?: Priority;
  category?: string;
  assignedTo?: string;
  statusHistory?: {
    status: Status;
    changedAt: string;
    changedBy: string;
  }[];
  comments?: {
    text: string;
    user: string;
    createdAt: string;
    createdBy: string;
  }[];
}