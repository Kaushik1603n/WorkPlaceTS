import { BidRequest } from "../domain/dto/projectDTO/jobProposalDTO";
import { JobQueryParamsDTO } from "../domain/dto/projectDTO/marketPlaceDTO";
import ProjectModel from "../domain/models/Projects";
import { marketPlaceRepo } from "../infrastructure/repositories/implementations/marketPlace/marketPlaceRepo";
import { FilterQuery } from "mongoose";

export class MarketPlaceUseCase {
  constructor(private market: marketPlaceRepo) {
    this.market = market;
  }
  async getAllProjectDetails({
    search = "",
    minPrice = 0,
    maxPrice = 10000,
    jobTypes = "",
    skills = "",
    experienceLevel = "",
    page = 1,
    limit = 5,
  }: JobQueryParamsDTO) {
    try {
      const query: FilterQuery<typeof ProjectModel> = {};
      const andConditions: any[] = [];

      if (search) {
        andConditions.push({
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        });
      }

      query.budget = {
        $gte: parseInt(minPrice as string),
        $lte: parseInt(maxPrice as string),
      };

      if (skills) {
        const skillsArray = skills.toLowerCase().split(",");
        andConditions.push({
          $or: skillsArray.map((skill) => ({
            skills: { $regex: skill.trim(), $options: "i" },
          })),
        });
      }

      if (jobTypes) {
        const typesArray = jobTypes.toLowerCase().split(",");
        andConditions.push({
          budgetType: { $in: typesArray },
        });
      }

      if (experienceLevel) {
        const levelsArray = experienceLevel.split(",");
        andConditions.push({
          $or: levelsArray.map((level) => ({
            experienceLevel: { $regex: level.trim(), $options: "i" },
          })),
        });
      }

      // Attach to query
      if (andConditions.length > 0) {
        query.$and = andConditions;
      }

      return await this.market.findAllProjects(query, page, limit);
    } catch (error) {
      console.error("MarketPlace Usecase error:", error);
      throw error;
    }
  }

  async getProjectDetails(jobId: string) {
    if (!jobId || typeof jobId !== "string") {
      throw new Error("Invalid Job ID");
    }
    try {
      const result = await this.market.findProjectDetails(jobId);

      if (!result) {
        throw new Error("Job not found");
      }

      return result;
    } catch (error) {
      console.error(`[getProjectDetails] Error fetching job ${jobId}:`, error);
      throw error;
    }
  }
  async jobProposalUseCase(proposalData: BidRequest, userId: string) {
    try {
      const result = await this.market.createNewJobProposal(proposalData,userId);

      if (!result) {
        throw new Error("Proposal Faild");
      }

      return result
    } catch (error) {
      console.error(`creating proposal usecase error`, error);
      throw error;
    }
  }
}
