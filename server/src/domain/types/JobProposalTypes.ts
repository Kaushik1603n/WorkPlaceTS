export interface MilestoneTypes {
  title: string;
  description: string;
  dueDate: string; 
  amount: string;
  id: number;
}

export interface BidRequestTypes {
  coverLetter: string;
  bidAmount: string;
  timeline: string;
  workSamples: string;
  milestones: MilestoneTypes[];
  bidType: 'fixed' | 'hourly'; 
  agreeVideoCall: boolean;
  agreeNDA: boolean;
  jobId: string;
}


export interface JobProposalResponseTypes {
  success: boolean;
  message: string;
  proposalId:string
}