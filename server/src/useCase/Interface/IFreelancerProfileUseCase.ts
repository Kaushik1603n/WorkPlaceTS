import { FreelacerTotalEarningsResponse, FreelancerCounts, FreelancerProfileTypes, FreelancerTicketWithPagination, PaginatedClientResult, TotalProjectResponse } from "../../domain/types/FreelancerProfileTypes";

export interface IFreelancerProfileUseCase {
  freelancerProfileEdit(
    userId: string,
    availability: string,
    experience: number,
    education: string,
    hourlyRate: number,
    skills: string[],
    location: string,
    reference: string,
    bio: string,
    coverPic: string,
    profilePic: string
  ) : Promise<FreelancerProfileTypes>;
  updateNameAndEmail(userId: string, fullName: string, email: string): Promise<any>;
  profileDetails(userId: string | unknown): Promise<FreelancerProfileTypes| null>;
  clientUseCase(page: number, limit: number) : Promise<PaginatedClientResult>;
  freelancerTicketUseCase(userId:string,page: number, limit: number): Promise<FreelancerTicketWithPagination>;
  totalcountUseCase(userId: string): Promise<FreelancerCounts>;
  totalEarningsUseCase(userId: string) : Promise<FreelacerTotalEarningsResponse>;
  dashboardProjectUseCase(userId: string): Promise<TotalProjectResponse>;
}