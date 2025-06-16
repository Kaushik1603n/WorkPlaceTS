import { ProjectRepo } from "../infrastructure/repositories/implementations/clientRepos/clientProjectRepo";
import { v4 as uuidv4 } from "uuid";

export class ClientProjectUserCase {
  constructor(private project: ProjectRepo) {
    this.project = project;
  }

  async newProject(
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
  ) {
    try {
      const jobId: string = uuidv4();

      await this.project.creteNewProject(
        userId,
        jobId,
        jobTitle,
        description,
        requiredFeatures,
        stack,
        skills,
        time,
        budgetType,
        budget,
        experienceLevel,
        reference
      );
    } catch (error) {
      console.error("Use case error:", error);
      throw error;
    }
  }
  async getProjectUseCase(userId: string) {
    try {
      const result = await this.project.findProjects(userId);
      return result;
    } catch (error) {
      console.error("Use case error:", error);
      throw error;
    }
  }
}
