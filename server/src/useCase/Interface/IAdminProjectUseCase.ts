import { AdminPaginatedProjects } from "../../domain/types/adminType"

export interface IAdminProjectUseCase{
    getAciveProjectUseCase(page:number,limit:number):Promise<AdminPaginatedProjects>
    getPostedProjectUseCase(page:number,limit:number):Promise<AdminPaginatedProjects>
    getCompletedProjectUseCase(page:number,limit:number):Promise<AdminPaginatedProjects>
    ProjectDetailsUseCase(jobId:string):Promise<any>
}