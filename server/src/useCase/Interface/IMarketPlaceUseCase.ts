import { BidRequest } from "../../domain/dto/projectDTO/jobProposalDTO";
import { JobQueryParamsDTO } from "../../domain/dto/projectDTO/marketPlaceDTO";
import { Server } from "socket.io";
export interface IMarketPlaceUseCase {
  getAllProjectDetails(params: JobQueryParamsDTO): Promise<any>;
  getProjectDetails(jobId: string): Promise<any>;
  updateJobStatus(jobId: string, rawStatus:string): Promise<any>;
  getActiveProjectUseCase(userId: string): Promise<any>;
  getPendingProjectUseCase(userId: string): Promise<any>;
  getCompletedProjectUseCase(userId: string): Promise<any>;
  jobProposalUseCase(
      proposalData: BidRequest,
      userId: string,
      io: Server,
      connectedUsers: { [key: string]: string }
    ): Promise<any>;
  getProposalDetailsUseCase(userId: string, proposalId: string): Promise<any>;
  getAllJobDetailsUseCase(userId: string): Promise<any>;
  getProjectAllInformationUseCase(jobId: string, userId: string): Promise<any>;
  submitMilestoneUseCase(
    jobId: string,
    userId: string,
    milestoneId: string,
    comments: string,
    links: string[],
    io: Server,
    connectedUsers: { [key: string]: string }
  ): Promise<any>;
  submitFeedbackCase(feedbackData: Feedback): Promise<any>;
  submitFreelacerReportUseCase(reportData: IReportData): Promise<any>;
}

interface Feedback {
  ratings: {
    quality?: number;
    deadlines?: number;
    professionalism?: number;
    clarity?: number;
    payment?: number;
    communication?: number;
  };
  feedback: string;
  overallRating: number;
  jobId: string;
  fromUser: string;
  toUser: string;
  feedbackType: string;
}
interface IReportData {
  clientId: string;
  clientEmail: string;
  title: string;
  description: string;
  userId: string;
  jobId: string;
}
