// types/proposalTypes.ts
export interface Milestone {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  amount: string;
}

export interface ProposalFormValues {
  coverLetter: string;
  bidAmount: string;
  timeline: string;
  workSamples: string;
}

export interface ProposalPayload {
   coverLetter: string;
  bidAmount: string;
  timeline: string;
  workSamples: string;
  milestones: Milestone[];
  bidType: "fixed" | "hourly";
  agreeVideoCall: boolean;
  agreeNDA: boolean;
  jobId: string ;
}

export interface ProposalResponse {
  success: boolean;
  message: string;
}