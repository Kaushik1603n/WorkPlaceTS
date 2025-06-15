import freelancerModal from "../../../../domain/models/FreelancerProfile";
import { IfreelancerRepo } from "../../../../domain/interfaces/IfreelancerRepo";
import mongoose from "mongoose";
import UserModel, { UserRole } from "../../../../domain/models/User";

export class FreelancerRepo implements IfreelancerRepo {
  async findOneAndUpdate(
    userId: string,
    availability: string,
    experience: number,
    education: string,
    hourlyRate: number,
    skills: string[],
    location: string,
    reference: string,
    bio: string,
    coverResult: { secure_url: string },
    profileResult: { secure_url: string }
  ): Promise<any> {
    // const data= await freelancerModal.find();

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid user ID format");
    }
      const userIdObj = new mongoose.Types.ObjectId(userId);

    const result = await freelancerModal.findOneAndUpdate(
      { userId:userIdObj },
      {
        availability,
        experienceLevel:experience,
        education,
        hourlyRate,
        skills,
        location,
        reference,
        bio,
        profilePic: profileResult.secure_url,
        coverPic: coverResult.secure_url,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return result;
  }

  async findOne(userId: string | unknown) {
    const result = await freelancerModal.findOne({ userId });    
    return result;
  }

  async findFreelancer(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const clients: ClientResult[] =
      await UserModel.aggregate<ClientResult>([
        {
          $match: {
            role: "client",
          },
        },
        {
          $lookup: {
            from: "clientprofiles",
            localField: "_id",
            foreignField: "userId",
            as: "profile",
          },
        },
        {
          $addFields: {
            profile: { $arrayElemAt: ["$profile", 0] },
          },
        },
        {
          $project: {
            fullName: 1,
            email: 1,
            role: 1,
            profilePic: "$profile.profilePic",
            hourlyRate: "$profile.hourlyRate",
            location: "$profile.location",
            description: "$profile.description",
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]);

    const totalCount = await UserModel.countDocuments({ role: "client" });
    const totalPages = Math.ceil(totalCount / limit);

    return {
      clients,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
      },
    };
  }
}

interface ClientResult {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  role: UserRole.CLIENT;
  profilePic?: string;
  description?: string;
  location?: string;
  hourlyRate?: number;
}
