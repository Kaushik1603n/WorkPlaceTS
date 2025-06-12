export interface IProjectRepo {
  creteNewProject(
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
  ): Promise<any>;
  findProjects(userId: string): Promise<any>;
}
