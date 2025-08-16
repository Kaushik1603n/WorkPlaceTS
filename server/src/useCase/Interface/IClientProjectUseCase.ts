import {
  ClientProjectWithPaginationType,
  TicketType,
  TicketWithPageinationType,
} from "../../domain/types/ClientJobType";

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
  getProjectUseCase(
    userId: string,
    page: number,
    limit: number
  ): Promise<ClientProjectWithPaginationType>;
  getAllTicketUseCase(
    userId: string,
    page: number,
    limit: number
  ): Promise<TicketWithPageinationType>;
  TicketStatusCommentUseCase(
    text: string,
    ticketId: string,
    userId: string
  ): Promise<TicketType | null>;
}
