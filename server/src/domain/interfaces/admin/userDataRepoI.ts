import { AdminIPayment, AdminJobStats, AdminJobSummary, AdminRevenueReport, IAdminClinetWithPagination, IAdminFreelancerWithPagination, IAdminUser, IAdminUsersWithPagination, IReport, IReportWithPagination, ITopFreelancerRating, IUserFreelancerProfileResult, IUserProfileResult, IUserStatsResponse } from "../../types/adminType";

export interface userDataRepoI {
  findFreelancer(page: number, limit: number, search: string): Promise<IAdminFreelancerWithPagination>;
  findClient(page: number, limit: number, search: string): Promise<IAdminClinetWithPagination>;
  find(page: number, limit: number, search: string): Promise<IAdminUsersWithPagination>;
  findOneByIdAndUpdate(userId: string, status: string): Promise<IAdminUser | null>;
  findClientDetails(userId: string): Promise<IUserProfileResult>;
  findfreelancerDetails(userId: string): Promise<IUserFreelancerProfileResult>;
  findByIdAndUserVerification(userId: string, status: string): Promise<any>;
  findReport(page: number, limit: number): Promise<IReportWithPagination>;
  updateTicketStatus(
    status: string,
    ticketId: string,
    userId: string
  ): Promise<IReport | null>;
  updateTicketComment(
    text: string,
    ticketId: string,
    userId: string
  ): Promise<IReport | null>;
  findUserGrowthData(): Promise<IUserStatsResponse>;
  findTopFreelancer(): Promise<ITopFreelancerRating[]>;
  findAllJobcountUseCase(): Promise<AdminJobStats[]>;
  findAllJobDetails(): Promise<AdminJobSummary>;
  findRevenueData(): Promise<AdminRevenueReport>;
  getAllPayments(page: number, limit: number): Promise<AdminIPayment[]>;
}
