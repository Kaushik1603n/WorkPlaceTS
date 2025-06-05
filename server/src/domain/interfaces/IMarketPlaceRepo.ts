import { PaginatedJobResponseDTO, ProjectDetails } from "../dto/projectDTO/marketPlaceDTO";

export interface IMarketPlace {
  findAllProjects(searchQuery: object, page: number, limit: number): Promise<PaginatedJobResponseDTO>;
  findProjectDetails(jobId:string): Promise<ProjectDetails>;
}
