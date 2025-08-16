import {
  FreelacerTotalEarningsResponse,
  FreelancerCounts,
  FreelancerProfileTypes,
  FreelancerTicketWithPagination,
  PaginatedClientResult,
  TotalProjectResponse,
} from "../types/FreelancerProfileTypes";

export interface IfreelancerRepo {
  findOneAndUpdate(
    userId: string,
    availability: string,
    experience: number,
    education: string,
    hourlyRate: number,
    skills: string[],
    location: string,
    reference: string,
    bio: string,
    coverResult: { secure_url: string },
    profileResult: { secure_url: string }
  ): Promise<FreelancerProfileTypes>;
  findOne(userId: string | unknown): Promise<FreelancerProfileTypes| null>;
  findFreelancer(page: number, limit: number): Promise<PaginatedClientResult>;
  findFreelancerTicket(
    userId: string,
    page: number,
    limit: number
  ): Promise<FreelancerTicketWithPagination> 
  findCounts(userId: string): Promise<FreelancerCounts>;
  findTotalEarnings(userId: string): Promise<FreelacerTotalEarningsResponse>;
  findTotalProject(userId: string): Promise<TotalProjectResponse>
}
