export interface IClinetProjectUseCase {
  newProject(
    userId: string,
    jobTitle: string,
    description: string,
    requiredFeatures: string,
    stack: string,
    skills: string[],
    time: string,
    budgetType: "fixed" | "hourly",
    budget: string,
    experienceLevel: "entry" | "intermediate" | "expert",
    reference: string
  ): Promise<any>;
  getProjectUseCase(userId: string, page: number, limit: number): Promise<any>;
  getAllTicketUseCase(
    userId: string,
    page: number,
    limit: number
  ): Promise<any>;
  TicketStatusCommentUseCase(
    text: string,
    ticketId: string,
    userId: string
  ): Promise<any>;
}
