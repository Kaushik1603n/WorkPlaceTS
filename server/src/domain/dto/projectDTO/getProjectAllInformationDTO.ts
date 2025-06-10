export interface allProjectsInfoDTO {
  _id: string;
  clientId: string;
  title: string;
  description: string;
  requiredFeatures?: string;
  hiredProposalId?: string;
  stack: string;
  skills: string[];
  budgetType: "fixed" | "hourly";
  budget?: number;
  time?: string;
  experienceLevel?: "entry" | "intermediate" | "expert";
  status?: "draft" | "posted" | "in-progress" | "completed" | "cancelled";
  proposals?: string[];
  visibility?: "public" | "private";
  reference?: string;
  Attachments?: string[];
  hiredFreelancer?: string;
  contractId?: string;
  paymentStatus?: "unpaid" | "partially-paid" | "fully-paid";
  createdAt: Date;
  updatedAt: Date;
}

export interface ReturnAllProjectsInfoDTO {
  title?: string;
  description?: string;
  stack?: string;
  jobId?: string;
  time?: string;
  reference?: string;
  hiredFreelancer?: string;
  requiredFeatures?: string;
  hiredProposalId?: string;
  budgetType?: string;
  budget?: string | number;
  clientId?: string;
  clientEmail?: string;
  clientFullName?: string;
}
