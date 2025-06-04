import { PaginatedJobResponseDTO } from "../dto/projectDTO/marketPlaceDTO";

export interface IMarketPlace {
  findAllProjects(searchQuery: object, page: number, limit: number): Promise<PaginatedJobResponseDTO>;
}
