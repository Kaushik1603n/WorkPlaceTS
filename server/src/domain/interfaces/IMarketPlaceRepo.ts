import { ReturnAllProjectsInfoDTO } from "../dto/projectDTO/getProjectAllInformationDTO";
import { BidRequest } from "../dto/projectDTO/jobProposalDTO";
import { IUser } from "../types/authTypes";
import { FeedbackArguments, FeedbackTypes, ReportDataArgument } from "../types/FeedbackTypes";
import { JobProposalResponseTypes } from "../types/JobProposalTypes";

import {
  freelancerProjectType,
  MarketPlaceClientProjectTypes,
  PaginatedJobResponseTypes,
  ProjectDetailsTypes,
} from "../types/MarketPlaceTypes";

export interface IMarketPlace {
  findAllProjects(
    searchQuery: object,
    page: number,
    limit: number
  ): Promise<PaginatedJobResponseTypes>;
  findProjectDetails(jobId: string): Promise<ProjectDetailsTypes>;
  createNewJobProposal(
    proposalData: BidRequest,
    userId: string
  ): Promise<JobProposalResponseTypes>;
  findClientActiveProject(
    userId: string
  ): Promise<MarketPlaceClientProjectTypes>;
  findClientCompletedProject(
    userId: string
  ): Promise<MarketPlaceClientProjectTypes>;
  findProposalDetails(jobId: string): Promise<any>;
  findFreelancerData(userId: string): Promise<IUser>;
  findProposalById(proposalId: string): Promise<any>;
  findFreelancerById(proposalId: string): Promise<any>;
  findActiveProject(userId: string): Promise<freelancerProjectType>;
  getProjectAllInformation(jobId: string): Promise<ReturnAllProjectsInfoDTO>;
  ProposalAllInfo(proposal_id: string): Promise<any>;
  submitMilestoneRepo(
    jobId: string,
    userId: string,
    milestoneId: string,
    comments: string,
    links: string[]
  ): Promise<any>;
submitFeedbackRepo({
    ratings,
    feedback,
    overallRating,
    jobId,
    freelancerId,
    userId,
  }: FeedbackArguments): Promise<FeedbackTypes>;
  submitFreelacerReportRepo(reportData: ReportDataArgument):Promise<any>
}
