export interface IClinetProfileUseCase {
  clientProfileEdit(
    userId: string | unknown,
    companyName: string,
    description: string,
    location: string,
    website: string,
    coverPic: string,
    profilePic: string
  ): Promise<any>;
  updateNameAndEmail(
    userId: string | unknown,
    fullName: string,
    email: string
  ): Promise<any>;
  profileDetails(userId: string | unknown): Promise<any>;
  freelancerUseCase(page: number, limit: number): Promise<any>;
  HiringProjectsUseCase(userId: string): Promise<any>;
  FinancialDataUseCase(userId: string): Promise<any>;
}
