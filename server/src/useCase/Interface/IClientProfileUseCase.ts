import { ClientProfileType, FinancialStatsResponse, FreelancerResultTypeWithPage, ProjectStatsResponse } from "../../domain/types/ClientProfile";

export interface IClinetProfileUseCase {
  clientProfileEdit(
    userId: string | unknown,
    companyName: string,
    description: string,
    location: string,
    website: string,
    coverPic: string,
    profilePic: string
  ): Promise<ClientProfileType | null>;
  updateNameAndEmail(
    userId: string | unknown,
    fullName: string,
    email: string
  ): Promise<any>;
  profileDetails(userId: string | unknown): Promise<ClientProfileType | null>;
  freelancerUseCase(page: number, limit: number): Promise<FreelancerResultTypeWithPage>;
  HiringProjectsUseCase(userId: string): Promise<ProjectStatsResponse>;
  FinancialDataUseCase(userId: string): Promise<FinancialStatsResponse>;
}
