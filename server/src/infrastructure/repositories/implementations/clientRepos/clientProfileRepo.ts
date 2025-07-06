// import UserModel from "../../../../domain/models/User";
import clientModal from "../../../../domain/models/ClientProfile";
import { clientRepoI } from "../../../../domain/interfaces/IclientRepo";
import UserModel from "../../../../domain/models/User";
import { Types } from "mongoose";
import ProjectModel from "../../../../domain/models/Projects";
import PaymentModel from "../../../../domain/models/PaymentModel";
import { FreelancerResultType } from "../../../../domain/types/ClientProfile";

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

  async findOne(userId: string | unknown): Promise<any> {
    const result = await clientModal.findOne({ userId });
    return result;
  }
  async findFreelancer(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;

    const freelancers: FreelancerResultType[] =
      await UserModel.aggregate<FreelancerResultType>([
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
            avgRating:1,
            feedbackCount: 1,
            freelancerRatings: 1,
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

    return {
      freelancers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
      },
    };
  }

  async findProjectByUserId(userId: string): Promise<any> {
    const result = await ProjectModel.aggregate([
      {
        $match: {
          clientId: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          jobsPosted: { $sum: 1 },
          hiresMade: {
            $sum: {
              $cond: [{ $ifNull: ["$hiredFreelancer", false] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          month: {
            $arrayElemAt: [
              [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              "$_id.month",
            ],
          },
          jobsPosted: 1,
          hiresMade: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          month: 1,
        },
      },
    ]);

    const projectCount = await ProjectModel.aggregate([
      {
        $match: {
          clientId: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          posted: { $sum: 1 },
          hired: {
            $sum: {
              $cond: [{ $ifNull: ["$hiredFreelancer", false] }, 1, 0],
            },
          },
        },
      },
    ]);

    const jobCount = projectCount[0] || { posted: 0, hired: 0 };

    return { result, jobCount };
  }

  async findFinancialByUserId(userId: string): Promise<any> {
    const weeklySpending = await PaymentModel.aggregate([
      {
        $match: {
          clientId: new Types.ObjectId(userId),
          status: "completed",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            week: { $week: "$createdAt" },
          },
          spent: { $sum: "$amount" },
          paymentCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          week: {
            $concat: [
              {
                $switch: {
                  branches: [
                    { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
                    { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
                    { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
                    { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
                    { case: { $eq: ["$_id.month", 5] }, then: "May" },
                    { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
                    { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
                    { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
                    { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
                    { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
                    { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
                    { case: { $eq: ["$_id.month", 12] }, then: "Dec" },
                  ],
                  default: "Unknown",
                },
              },
              " ",
              { $toString: "$_id.year" },
              ", Week ",
              { $toString: "$_id.week" },
            ],
          },
          spent: 1,
          avgCost: { $divide: ["$spent", "$paymentCount"] },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.week": 1,
        },
      },
      {
        $limit: 6,
      },
    ]);

    const totalSpentResult = await PaymentModel.aggregate([
      {
        $match: {
          clientId: new Types.ObjectId(userId),
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);

    const totalSpent = totalSpentResult[0]?.totalSpent || 0;

    const avgCostPerProjectResult = await PaymentModel.aggregate([
      {
        $match: {
          clientId: new Types.ObjectId(userId),
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$jobId",
          projectSpent: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: null,
          avgCostPerProject: { $avg: "$projectSpent" },
          totalProjects: { $sum: 1 },
        },
      },
    ]);

    const avgCostPerProject = avgCostPerProjectResult[0] || {
      avgCostPerProject: 0,
      totalProjects: 0,
    };

    return { weeklySpending, avgCostPerProject, totalSpent };
  }
}
