import { IProjectRepo } from "../../../../domain/interfaces/IProjectRepo";
import ProjectModel from "../../../../domain/models/Projects";

export class ProjectRepo implements IProjectRepo {
  async creteNewProject(
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
      await ProjectModel.create({
        clientId: userId,
        title: jobTitle,
        description,
        requiredFeatures,
        stack,
        skills,
        time,
        budgetType,
        budget,
        experienceLevel,
        reference,
      });
    } catch (error) {
      console.error("Repository error:", error);
      throw new Error("Failed to create project in database");
    }
  }
  async findProjects(
    userId: string,
  ) {
    try {
      return await ProjectModel.find({clientId:userId})
    } catch (error) {
      console.error("Repository error:", error);
      throw new Error("Failed to create project in database");
    }
  }
}
