import { ClientProjectType, TicketType } from "../types/ClientJobType";

export interface IProjectRepo {
  creteNewProject(
    userId: string,
    job_Id: string,
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
  findProjects(userId: string): Promise<ClientProjectType[]>;
  findAllTicket(userId: string): Promise<TicketType[]>;
  updateTicketComment(text: string, ticketId: string, userId: string):Promise<any>
}
