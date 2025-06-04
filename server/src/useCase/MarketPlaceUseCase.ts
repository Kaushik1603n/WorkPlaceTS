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
  duration?: string;
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
    duration,
  }: JobQueryParams) {
    console.log(
      minPrice,
      maxPrice,
      jobTypes,
      skills,
      experienceLevel,
      duration
    );

    const query: FilterQuery<typeof ProjectModel> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    query.budget = {
      $gte: parseInt(minPrice as string),
      $lte: parseInt(maxPrice as string),
    };

    if (skills) {
      //   const skillsArray = skills.toLowerCase().split(",");
      //   query.skills = { $in: skillsArray };
      const skillsArray = skills.toLowerCase().split(",");

      query.$or = skillsArray.map((skill) => ({
        skills: { $regex: skill.trim(), $options: "i" }, // case-insensitive partial match
      }));
    }

    if (experienceLevel) {
      const levelsArray = experienceLevel.split(",");
      query.experienceLevel = { $in: levelsArray };
    }

    if (duration) {
      const durationsArray = duration.split(",");
      query.duration = { $in: durationsArray };
    }

    // const searchQuery = search
    //   ? {
    //       $or: [
    //         { title: { $regex: search, $options: "i" } },
    //         { description: { $regex: search, $options: "i" } },
    //       ],
    //     }
    //   : {};

    return await this.martket.findAllProjects(query);
  }
}
