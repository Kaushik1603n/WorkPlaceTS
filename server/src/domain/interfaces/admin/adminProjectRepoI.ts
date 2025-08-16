import { ProjectDetails } from "../../dto/projectDTO/marketPlaceDTO";
import { AdminPaginatedProjects } from "../../types/adminType";

export interface IAdminProjectRepo {
  findProjectsByStatus(
    status: string,
    page: number,
    limit: number
  ):Promise<AdminPaginatedProjects>;
  findActiveProject(page: number, limit: number):Promise<AdminPaginatedProjects>;
  findPostedProject(page: number, limit: number):Promise<AdminPaginatedProjects>;
  findCompletedProject(page: number, limit: number):Promise<AdminPaginatedProjects>;
  findProjectDetails(jobId: string): Promise<ProjectDetails>;
}
