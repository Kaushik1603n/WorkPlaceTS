export interface Milestone {
  title: string;
  description: string;
  dueDate: string; 
  amount: string;
  id: number;
}

export interface BidRequest {
  coverLetter: string;
  bidAmount: string;
  timeline: string;
  workSamples: string;
  milestones: Milestone[];
  bidType: 'fixed' | 'hourly'; 
  agreeVideoCall: boolean;
  agreeNDA: boolean;
  jobId: string;
}


export interface JobProposalResponse {
  success: boolean;
  message: string;
  proposalId:string
}