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
  ) : Promise<any>;
  updateNameAndEmail(userId: string, fullName: string, email: string): Promise<any>;
  profileDetails(userId: string | unknown): Promise<any>;
  clientUseCase(page: number, limit: number) : Promise<any>;
  freelancerTicketUseCase(userId:string,page: number, limit: number): Promise<any>;
  totalcountUseCase(userId: string): Promise<any>;
  freelancerTicketUseCase(userId:string,page: number, limit: number): Promise<any>;
  totalcountUseCase(userId: string): Promise<any>;
  totalEarningsUseCase(userId: string) : Promise<any>;
  dashboardProjectUseCase(userId: string): Promise<any>;
}