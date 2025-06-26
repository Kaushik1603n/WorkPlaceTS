import { ClientProfileType, FreelancerResultType } from "../types/ClientProfile";

export interface clientRepoI {
  findOneAndUpdate(
    userId: string | unknown,
    companyName: string,
    description: string,
    location: string,
    website: string,
    coverResult: { secure_url: string },
    profileResult: { secure_url: string }
  ): Promise<ClientProfileType>;
  findOne(userId: string | unknown):Promise<ClientProfileType>
  findFreelancer(page: number, limit: number):Promise<FreelancerResultType[]>
  findProjectByUserId(userId: string):Promise<any>
  findFinancialByUserId(userId: string):Promise<any>
}
