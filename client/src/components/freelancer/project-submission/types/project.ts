// types/project.ts
export interface Project {
  id: string;
  title: string;
  client: {
    id: string;
    name: string;
  };
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  jobId: string;
  acceptedDate: string;
  progress: number;
  brief: string;
  goals: string[];
  proposal: {
    deliverables: string[];
    startDate: string;
    deadline: string;
  };
  financials: {
    agreedPrice: number;
    paymentStatus: 'pending' | 'partial' | 'complete';
    platformFee: number;
    freelancerReceives: number;
  };
  milestones: Milestone[];
  timeline: TimelineItem[];
  terms: {
    revisionPolicy: string;
    cancellationPolicy: string;
    intellectualProperty: string;
  };
  files: FileItem[];
}

export interface Milestone {
  id: number;
  title: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'submitted' | 'approved' | 'rejected';
}

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  type: 'started' | 'deadline' | 'milestone' | 'delivery';
}

export interface FileItem {
  id: number;
  name: string;
  type: 'client' | 'freelancer';
  uploadDate?: string;
  url: string;
}