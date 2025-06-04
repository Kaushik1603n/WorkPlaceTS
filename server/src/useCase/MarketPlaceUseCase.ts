import ProjectModel from "../domain/models/Projects";
import { marketPlaceRepo } from "../infrastructure/repositories/implementations/marketPlace/marketPlaceRepo";
import { FilterQuery } from "mongoose";

type JobQueryParams = {
  search?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  jobTypes?: string;
  skills?: string;
  experienceLevel?: string;
  page: number;
  limit: number;
};
export class MarketPlaceUseCase {
  constructor(private martket: marketPlaceRepo) {
    this.martket = martket;
  }
  async getAllProjectDetails({
    search,
    minPrice,
    maxPrice,
    jobTypes,
    skills,
    experienceLevel,
    page,
    limit,
  }: JobQueryParams) {
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

    return await this.martket.findAllProjects(query, page, limit);
  }
}
