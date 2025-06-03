import { ProjectRepo } from "../infrastructure/repositories/implementations/clientRepos/clientProjectRepo";

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
      await this.project.creteNewProject(
        userId,
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
}
