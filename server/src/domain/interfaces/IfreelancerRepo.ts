import {
  FreelancerProfileTypes,
  PaginatedClientResult,
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
  findOne(userId: string | unknown): Promise<FreelancerProfileTypes>;
  findFreelancer(page: number, limit: number): Promise<PaginatedClientResult>;
  findCounts(userId: string): Promise<any>;
  findTotalEarnings(userId: string): Promise<any>;
}
