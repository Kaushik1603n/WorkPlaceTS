import { IProjectRepo } from "../../../../domain/interfaces/IProjectRepo";
import ProjectModel from "../../../../domain/models/Projects";
import ReportModel from "../../../../domain/models/ReportModel";
import {
  ClientProjectWithPaginationType,
  TicketType,
} from "../../../../domain/types/ClientJobType";

export class ProjectRepo implements IProjectRepo {
  async creteNewProject(
    userId: string,
    job_Id: string,
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
        job_Id: job_Id,
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
    page: number,
    limit: number
  ): Promise<ClientProjectWithPaginationType> {
    try {
      const project = await ProjectModel.find({ clientId: userId })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      const totalCount = await ProjectModel.countDocuments({
        clientId: userId,
      });
      const totalPage = Math.ceil(totalCount / limit);

      return { project, totalPage,totalCount };
    } catch (error) {
      console.error("Repository error:", error);
      throw new Error("Failed to create project in database");
    }
  }

  async findAllTicket(userId: string): Promise<TicketType[]> {
    try {
      return await ReportModel.find({ "client.id": userId }).sort({
        createdAt: -1,
      });
    } catch (error) {
      console.error("Repository error:", error);
      throw new Error("Failed to create project in database");
    }
  }
  async updateTicketComment(
    text: string,
    ticketId: string,
    userId: string
  ): Promise<any> {
    try {
      return await ReportModel.findByIdAndUpdate(
        ticketId,
        {
          $push: {
            comments: {
              text,
              user: "freelancer",
              changedAt: new Date(),
              createdBy: userId,
            },
          },
          updatedAt: new Date(),
        },
        { new: true }
      );
    } catch (error) {
      throw new Error("Failed to update ticket");
    }
  }
}
