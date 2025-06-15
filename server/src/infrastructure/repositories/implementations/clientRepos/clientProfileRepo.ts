// import UserModel from "../../../../domain/models/User";
import clientModal from "../../../../domain/models/ClientProfile";
import { clientRepoI } from "../../../../domain/interfaces/IclientRepo";
import UserModel, { UserRole } from "../../../../domain/models/User";
import mongoose from "mongoose";

export class ClientRepo implements clientRepoI {
  async findOneAndUpdate(
    userId: string | unknown,
    companyName: string,
    description: string,
    location: string,
    website: string,
    coverResult: { secure_url: string },
    profileResult: { secure_url: string }
  ): Promise<any> {
    const result = await clientModal.findOneAndUpdate(
      { userId },
      {
        profilePic: profileResult.secure_url,
        coverPic: coverResult.secure_url,
        companyName,
        location,
        website,
        description,
      },
      {
        new: true,
        upsert: true,
      }
    );
    return result;
  }

  async findOne(userId: string | unknown) {
    const result = await clientModal.findOne({ userId });
    return result;
  }
  async findFreelancer(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const freelancers: FreelancerResult[] =
      await UserModel.aggregate<FreelancerResult>([
        {
          $match: {
            role: "freelancer",
          },
        },
        {
          $lookup: {
            from: "freelancerprofiles",
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
            bio: "$profile.bio",
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]);

    const totalCount = await UserModel.countDocuments({ role: "freelancer" });
    const totalPages = Math.ceil(totalCount / limit);
    console.log(freelancers);

    return {
      freelancers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
      },
    };
  }
}

interface FreelancerResult {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  role: UserRole.FREELANCER;
  profilePic?: string;
  bio?: string;
  location?: string;
  hourlyRate?: number;
}
