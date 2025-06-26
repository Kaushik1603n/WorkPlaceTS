export interface IAdminProjectRepo {
  findProjectsByStatus(
    status: string,
    page: number,
    limit: number
  ): Promise<any>;
  findActiveProject(page: number, limit: number): Promise<any>;
  findPostedProject(page: number, limit: number): Promise<any>;
  findCompletedProject(page: number, limit: number): Promise<any>;
  findProjectDetails(jobId: string): Promise<any>;
}
