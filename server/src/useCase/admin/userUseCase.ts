// import { UserDataRepo } from "../../infrastructure/repositories/implementations/adminRepos/userDataRepo";
import { userDataRepoI } from "../../domain/interfaces/admin/userDataRepoI";
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
export class UserUseCase {
  constructor(private user: userDataRepoI) {
    this.user = user;
  }

  async getFreelancerData(
    page: number,
    limit: number,
    search: string
  ): Promise<IAdminFreelancerWithPagination> {
    const freelancer = this.user.findFreelancer(page, limit, search);
    return freelancer;
  }

  async getClientData(
    page: number,
    limit: number,
    search: string
  ): Promise<IAdminClinetWithPagination> {
    const client = this.user.findClient(page, limit, search);
    return client;
  }

  async getUsersData(
    page: number,
    limit: number,
    search: string
  ): Promise<IAdminUsersWithPagination> {
    const users = this.user.find(page, limit, search);
    return users;
  }

  async userAction(userId: string, status: string): Promise<IAdminUser | null> {
    const users = this.user.findOneByIdAndUpdate(userId, status);
    return users;
  }

  async clientDetails(userId: string): Promise<IUserProfileResult> {
    const client = this.user.findClientDetails(userId);
    return client;
  }

  async freelancerDetails(userId: string): Promise<IUserFreelancerProfileResult> {
    const freelancer = this.user.findfreelancerDetails(userId);
    return freelancer;
  }

  async userVerification(userId: string, status: string): Promise<any> {
    this.user.findByIdAndUserVerification(userId, status);
  }

  async AllReportUseCase(page: number, limit: number): Promise<IReportWithPagination> {
    return this.user.findReport(page, limit);
  }

  async TicketStatusUseCase(
    status: string,
    ticketId: string,
    userId: string
  ): Promise<IReport | null> {
    return this.user.updateTicketStatus(status, ticketId, userId);
  }

  async TicketStatusCommentUseCase(
    text: string,
    ticketId: string,
    userId: string
  ): Promise<IReport | null> {
    return this.user.updateTicketComment(text, ticketId, userId);
  }

  async UserGrowthDataUseCase(): Promise<IUserStatsResponse> {
    return this.user.findUserGrowthData();
  }

  async TopFreelancerUseCase(): Promise<ITopFreelancerRating[]> {
    return this.user.findTopFreelancer();
  }

  async AllJobcountUseCase(): Promise<AdminJobStats[]> {
    return this.user.findAllJobcountUseCase();
  }

  async AllJobDetailsUseCase(): Promise<AdminJobSummary> {
    return this.user.findAllJobDetails();
  }

  async RevenueDataUseCase(): Promise<AdminRevenueReport> {
    return this.user.findRevenueData();
  }
  
  async PaymentsUseCase(page: number, limit: number): Promise<AdminIPayment[]> {
    return this.user.getAllPayments(page, limit);
  }
}
