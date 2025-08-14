export interface IAdminUserUseCase {
  getFreelancerData(page: number, limit: number, search: string): Promise<any>;
  getClientData(page: number, limit: number, search: string): Promise<any>;
  getUsersData(page: number, limit: number, search: string): Promise<any>;
  userAction(userId: string, status: string): Promise<any>;
  clientDetails(userId: string): Promise<any>;
  freelancerDetails(userId: string): Promise<any>;
  userVerification(userId: string, status: string): Promise<any>;
  AllReportUseCase(page: number, limit: number): Promise<any>;
  TicketStatusUseCase(status: string, ticketId: string, userId: string): Promise<any>;
  TicketStatusCommentUseCase(
    text: string,
    ticketId: string,
    userId: string
  ): Promise<any>;
  UserGrowthDataUseCase(): Promise<any>;
  TopFreelancerUseCase(): Promise<any>;
  AllJobcountUseCase() : Promise<any>;
  AllJobDetailsUseCase(): Promise<any>;
  RevenueDataUseCase(): Promise<any>;
  PaymentsUseCase(page:number,limit:number): Promise<any>;
}
