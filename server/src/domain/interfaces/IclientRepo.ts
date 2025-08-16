import {
  ClientProfileType,
  FinancialStatsResponse,
  FreelancerResultTypeWithPage,
  ProjectStatsResponse,
} from "../types/ClientProfile";

export interface clientRepoI {
  findOneAndUpdate(
    userId: string | unknown,
    companyName: string,
    description: string,
    location: string,
    website: string,
    coverResult: { secure_url: string },
    profileResult: { secure_url: string }
  ): Promise<ClientProfileType | null>;
  findOne(userId: string | unknown): Promise<ClientProfileType | null>;
  findFreelancer(page: number, limit: number): Promise<FreelancerResultTypeWithPage>;
  findProjectByUserId(userId: string): Promise<ProjectStatsResponse>;
  findFinancialByUserId(userId: string): Promise<FinancialStatsResponse>;
}
