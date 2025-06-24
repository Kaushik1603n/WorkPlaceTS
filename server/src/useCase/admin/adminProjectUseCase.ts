import { AdminProjectRepo } from "../../infrastructure/repositories/implementations/adminRepos/adminProjectRepo";

export class AdminProjectUseCase {
  constructor(private project: AdminProjectRepo) {
    this.project = project;
  }

   async getAciveProjectUseCase(page:number,limit:number) {
    const result = this.project.findActiveProject(page,limit);
    return result;
  }
   async getPostedProjectUseCase(page:number,limit:number) {
    const result = this.project.findPostedProject(page,limit);
    return result;
  }
   async getCompletedProjectUseCase(page:number,limit:number) {
    const result = this.project.findCompletedProject(page,limit);
    return result;
  }
   async ProjectDetailsUseCase(jobId:string) {
    const result = this.project.findProjectDetails(jobId);
    return result;
  }
}
