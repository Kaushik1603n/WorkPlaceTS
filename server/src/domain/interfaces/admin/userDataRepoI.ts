export interface userDataRepoI {
  findFreelancer(page: number, limit: number, search: string): Promise<any>;
  findClient(page: number, limit: number, search: string): Promise<any>;
  find(page: number, limit: number, search: string): Promise<any>;
  findOneByIdAndUpdate(userId: string, status: string): Promise<any>;
  findClientDetails(userId: string): Promise<any>;
  findfreelancerDetails(userId: string): Promise<any>;
  findByIdAndUserVerification(userId: string, status: string): Promise<any>;
  findReport(): Promise<any>;
  updateTicketStatus(
    status: string,
    ticketId: string,
    userId: string
  ): Promise<any>;
  updateTicketComment(
    text: string,
    ticketId: string,
    userId: string
  ): Promise<any>;
  findUserGrowthData(): Promise<any>;
  findTopFreelancer(): Promise<any>;
  findAllJobcountUseCase(): Promise<any>;
  findAllJobDetails(): Promise<any>;
  findRevenueData(): Promise<any>;
  getAllPayments(page: number, limit: number): Promise<any>;
}
