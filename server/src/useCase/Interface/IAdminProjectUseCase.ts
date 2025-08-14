export interface IAdminProjectUseCase{
    getAciveProjectUseCase(page:number,limit:number):Promise<any>
    getPostedProjectUseCase(page:number,limit:number):Promise<any>
    getCompletedProjectUseCase(page:number,limit:number):Promise<any>
    ProjectDetailsUseCase(jobId:string):Promise<any>
}