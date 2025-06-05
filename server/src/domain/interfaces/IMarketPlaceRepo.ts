import { BidRequest, JobProposalResponse } from "../dto/projectDTO/jobProposalDTO";
import {
  PaginatedJobResponseDTO,
  ProjectDetails,
} from "../dto/projectDTO/marketPlaceDTO";

export interface IMarketPlace {
  findAllProjects(
    searchQuery: object,
    page: number,
    limit: number
  ): Promise<PaginatedJobResponseDTO>;
  findProjectDetails(jobId: string): Promise<ProjectDetails>;
  createNewJobProposal(proposalData: BidRequest, userId: string):Promise<JobProposalResponse>;
}
