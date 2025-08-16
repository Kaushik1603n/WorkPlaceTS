import {
  AdminIPayment,
  AdminJobStats,
  AdminJobSummary,
  AdminRevenueReport,
  IAdminClinetWithPagination,
  IAdminFreelancerWithPagination,
  IAdminUser,
  IAdminUsersWithPagination,
  IReport,
  IReportWithPagination,
  ITopFreelancerRating,
  IUserFreelancerProfileResult,
  IUserProfileResult,
  IUserStatsResponse,
} from "../../domain/types/adminType";

export interface IAdminUserUseCase {
  getFreelancerData(
    page: number,
    limit: number,
    search: string
  ): Promise<IAdminFreelancerWithPagination>;
  getClientData(
    page: number,
    limit: number,
    search: string
  ): Promise<IAdminClinetWithPagination>;
  getUsersData(
    page: number,
    limit: number,
    search: string
  ): Promise<IAdminUsersWithPagination>;
  userAction(userId: string, status: string): Promise<IAdminUser | null>;
  clientDetails(userId: string): Promise<IUserProfileResult>;
  freelancerDetails(userId: string): Promise<IUserFreelancerProfileResult>;
  userVerification(userId: string, status: string): Promise<any>;
  AllReportUseCase(page: number, limit: number): Promise<IReportWithPagination>;
  TicketStatusUseCase(
    status: string,
    ticketId: string,
    userId: string
  ): Promise<IReport | null>;
  TicketStatusCommentUseCase(
    text: string,
    ticketId: string,
    userId: string
  ): Promise<IReport | null>;
  UserGrowthDataUseCase(): Promise<IUserStatsResponse>;
  TopFreelancerUseCase(): Promise<ITopFreelancerRating[]>;
  AllJobcountUseCase(): Promise<AdminJobStats[]>;
  AllJobDetailsUseCase(): Promise<AdminJobSummary>;
  RevenueDataUseCase(): Promise<AdminRevenueReport>;
  PaymentsUseCase(page: number, limit: number): Promise<AdminIPayment[]>;
}
