import { isValidObjectId } from "mongoose";
import { ProjectDetails } from "../../../../domain/dto/projectDTO/marketPlaceDTO";
import { IAdminProjectRepo } from "../../../../domain/interfaces/admin/adminProjectRepoI";
import ProjectModel from "../../../../domain/models/Projects";
import UserModel from "../../../../domain/models/User";

export class AdminProjectRepo implements IAdminProjectRepo {
   async findProjectsByStatus(
    status: string,
    page: number,
    limit: number
  ): Promise<any> {
    try {
      const result = await ProjectModel.find({ status })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      const totalCount = await ProjectModel.countDocuments({ status });
      const totalPages = Math.ceil(totalCount / limit);

      return { result, totalPage: totalPages };
    } catch (error) {
      console.error(`find${status}Project error`, error);
      throw new Error(`Fetching ${status} Project Error`);
    }
  }

  async findActiveProject(page: number, limit: number) : Promise<any>{
    return this.findProjectsByStatus("in-progress", page, limit);
  }

  async findPostedProject(page: number, limit: number): Promise<any> {
    return this.findProjectsByStatus("posted", page, limit);
  }

  async findCompletedProject(page: number, limit: number): Promise<any> {
    return this.findProjectsByStatus("completed", page, limit);
  }
  async findProjectDetails(jobId: string): Promise<any> {
    if (!isValidObjectId(jobId)) {
      throw new Error("Invalid Job ID format");
    }

    try {
      const project = await ProjectModel.findById(jobId);
      const client = await UserModel.findById(project?.clientId);

      const result: ProjectDetails = {
        title: project?.title,
        description: project?.description,
        stack: project?.stack,
        time: project?.time,
        reference: project?.reference,
        requiredFeatures: project?.requiredFeatures,
        budgetType: project?.budgetType,
        budget: project?.budget,
        experienceLevel: project?.experienceLevel,
        clientId: {
          fullName: client?.fullName,
          email: client?.email,
        },
      };
      return result;
    } catch (error) {
      console.error("Project Details Db Error", error);
      throw new Error("Project Details Db Error");
    }
  }
}
