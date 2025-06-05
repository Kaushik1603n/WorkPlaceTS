import { isValidObjectId } from "mongoose";
import {
  PaginatedJobResponseDTO,
  ProjectDetails,
} from "../../../../domain/dto/projectDTO/marketPlaceDTO";
import { Job } from "../../../../domain/interfaces/entities/Job";
import { IMarketPlace } from "../../../../domain/interfaces/IMarketPlaceRepo";
import ProjectModel from "../../../../domain/models/Projects";
import UserModel from "../../../../domain/models/User";
export class marketPlaceRepo implements IMarketPlace {
  async findAllProjects(
    searchQuery: object,
    page: number,
    limit: number
  ): Promise<PaginatedJobResponseDTO> {
    const total = await ProjectModel.countDocuments(searchQuery);
    const result = await ProjectModel.find(searchQuery, {
      _id: 1,
      title: 1,
      stack: 1,
      description: 1,
      skills: 1,
      budget: 1,
      proposals: 1,
      createdAt: 1,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: 1 });

    const jobs: Job[] = result.map((doc) => ({
      _id: doc._id.toString(),
      title: doc.title,
      stack: doc.stack,
      description: doc.description,
      skills: doc.skills,
      budget: doc.budget,
      proposals: doc.proposals?.map(String) ?? [],
      createdAt: doc.createdAt.toISOString(),
    }));

    return {
      result: jobs,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      },
    };
  }

  async findProjectDetails(jobId: string): Promise<ProjectDetails> {
    if (!isValidObjectId(jobId)) {
      // From mongoose or custom check
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
      console.error(`[findProjectDetails] DB error for job ${jobId}:`, error);
      throw error;
    }
  }
}
