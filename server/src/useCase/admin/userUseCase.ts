import { UserDataRepo } from "../../infrastructure/repositories/implementations/adminRepos/userDataRepo";

export class UserUseCase {
  constructor(private user: UserDataRepo) {
    this.user = user;
  }

  async getFreelancerData(page: number, limit: number, search: string) {
    const freelancer = this.user.findFreelancer(page, limit, search);
    return freelancer;
  }

  async getClientData(page: number, limit: number, search: string) {
    const client = this.user.findClient(page, limit, search);
    return client;
  }

  async getUsersData(page: number, limit: number, search: string) {
    const users = this.user.find(page, limit, search);
    return users;
  }
  async userAction(userId: string, status: string) {
    const users = this.user.findOneByIdAndUpdate(userId, status);
    return users;
  }

  async clientDetails(userId: string) {
    const client = this.user.findClientDetails(userId);
    return client;
  }
  async freelancerDetails(userId: string) {
    const freelancer = this.user.findfreelancerDetails(userId);
    return freelancer;
  }
  async userVerification(userId: string, status: string) {
    this.user.findByIdAndUserVerification(userId, status);
  }
  async AllReportUseCase(page: number, limit: number) {
    return this.user.findReport(page,limit);
  }
  async TicketStatusUseCase(status: string, ticketId: string, userId: string) {
    return this.user.updateTicketStatus(status, ticketId, userId);
  }
  async TicketStatusCommentUseCase(
    text: string,
    ticketId: string,
    userId: string
  ) {
    return this.user.updateTicketComment(text, ticketId, userId);
  }
  async UserGrowthDataUseCase() {
    return this.user.findUserGrowthData();
  }
  async TopFreelancerUseCase() {
    return this.user.findTopFreelancer();
  }
  async AllJobcountUseCase() {
    return this.user.findAllJobcountUseCase();
  }
  async AllJobDetailsUseCase() {
    return this.user.findAllJobDetails();
  }
  async RevenueDataUseCase() {
    return this.user.findRevenueData();
  }
  async PaymentsUseCase(page:number,limit:number) {
    return this.user.getAllPayments(page,limit);
  }
}
