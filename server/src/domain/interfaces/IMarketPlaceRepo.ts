import { freelancerProject } from "../../infrastructure/repositories/implementations/marketPlace/marketPlaceRepo";
import { ReturnAllProjectsInfoDTO } from "../dto/projectDTO/getProjectAllInformationDTO";
import {
  BidRequest,
  JobProposalResponse,
} from "../dto/projectDTO/jobProposalDTO";
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
  createNewJobProposal(
    proposalData: BidRequest,
    userId: string
  ): Promise<JobProposalResponse>;
  findProposalDetails(jobId: string): Promise<any>;
  findFreelancerData(userId: string): Promise<any>;
  findProposalById(proposalId: string): Promise<any>;
  findFreelancerById(proposalId: string): Promise<any>;
  findActiveProject(userId: string): Promise<freelancerProject>;
  getProjectAllInformation(jobId: string): Promise<ReturnAllProjectsInfoDTO>;
  ProposalAllInfo(proposal_id: string): Promise<any>;
}
