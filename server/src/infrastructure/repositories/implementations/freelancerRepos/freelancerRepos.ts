import freelancerModal from "../../../../domain/models/FreelancerProfile";
import { IfreelancerRepo } from "../../../../domain/interfaces/IfreelancerRepo";
import mongoose, { Types } from "mongoose";
import UserModel from "../../../../domain/models/User";
import ProjectModel from "../../../../domain/models/Projects";
import PaymentModel from "../../../../domain/models/PaymentModel";
import ProposalModel from "../../../../domain/models/Proposal";
import PaymentRequestModel from "../../../../domain/models/PaymentRequest";
import {
  ClientResultType,
  PaginatedClientResult,
} from "../../../../domain/types/FreelancerProfileTypes";
import ReportModel from "../../../../domain/models/ReportModel";

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
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid user ID format");
    }
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const result = await freelancerModal.findOneAndUpdate(
      { userId: userIdObj },
      {
        availability,
        experienceLevel: experience,
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

  async findOne(userId: string | unknown): Promise<any> {
    const result = await freelancerModal.findOne({ userId });
    return result;
  }

  async findFreelancer(
    page: number,
    limit: number
  ): Promise<PaginatedClientResult> {
    const skip = (page - 1) * limit;

    const clients: ClientResultType[] =
      await UserModel.aggregate<ClientResultType>([
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
            avgRating: 1,
            feedbackCount: 1,
            clientRatings: 1,
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
  async findFreelancerTicket(
    userId: string,
    page: number,
    limit: number
  ): Promise<any> {
    const result = await ReportModel.find({ reportedBy: userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCount = await ReportModel.countDocuments({ reportedBy: userId });
    const totalPages = Math.ceil(totalCount / limit);
    return { result, totalPages };
  }

  async findCounts(userId: string): Promise<any> {
    const totalJob = await ProjectModel.countDocuments({
      hiredFreelancer: userId,
    });
    const completedJob = await ProjectModel.countDocuments({
      hiredFreelancer: userId,
      status: "completed",
    });
    const activeJob = await ProjectModel.countDocuments({
      hiredFreelancer: userId,
      status: "in-progress",
    });

    const Earnings = await PaymentModel.aggregate([
      {
        $match: {
          freelancerId: new Types.ObjectId(userId), // Ensure userId is ObjectId
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          avgEarnings: { $avg: "$netAmount" },
          totalPayments: { $sum: 1 },
        },
      },
    ]);
    const avgEarnings = Earnings.length > 0 ? Earnings[0].avgEarnings : 0;

    const totalProposal = await ProposalModel.countDocuments({
      freelancerId: userId,
    });

    return { totalJob, completedJob, activeJob, avgEarnings, totalProposal };
  }

  async findTotalEarnings(userId: string): Promise<any> {
    const Earnings = await PaymentModel.aggregate([
      {
        $match: {
          freelancerId: new Types.ObjectId(userId), // Ensure userId is ObjectId
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          avgEarnings: { $avg: "$netAmount" },
          totalPayments: { $sum: "$netAmount" },
        },
      },
    ]);
    const totalPayments = Earnings.length > 0 ? Earnings[0].totalPayments : 0;

    const pendingEarnings = await PaymentRequestModel.aggregate([
      {
        $match: {
          freelancerId: new Types.ObjectId(userId),
          status: "pending",
        },
      },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: "$netAmount" },
        },
      },
    ]);
    const pendingPayments =
      pendingEarnings.length > 0 ? Earnings[0].totalPayments : 0;

    const weeklyPayments = await PaymentModel.aggregate([
      {
        $match: {
          freelancerId: new Types.ObjectId(userId),
          status: "completed",
        },
      },
      {
        $group: {
          _id: {
            week: { $week: "$createdAt" }, // Only group by week number
          },
          earnings: { $sum: "$netAmount" }, // Renamed from totalEarnings
          projects: { $sum: 1 }, // Renamed from paymentCount
        },
      },
      {
        $project: {
          _id: 0,
          week: { $toString: "$_id.week" }, // Convert week number to string
          earnings: 1,
          projects: 1,
        },
      },
      {
        $sort: { week: 1 }, // Sort by week number ascending
      },
    ]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const monthlyPayments = await PaymentModel.aggregate([
      {
        $match: {
          freelancerId: new Types.ObjectId(userId),
          status: "completed",
          createdAt: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lt: new Date(currentYear, currentMonth, 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalMonthlyEarnings: { $sum: "$netAmount" },
          paymentCount: { $sum: 1 },
        },
      },
    ]);

    const monthlyStats = monthlyPayments[0] || {
      totalMonthlyEarnings: 0,
      paymentCount: 0,
    };

    return { totalPayments, pendingPayments, weeklyPayments, monthlyStats };
  }
}

// interface ClientResult {
//   _id: mongoose.Types.ObjectId;
//   fullName: string;
//   email: string;
//   role: UserRole.CLIENT;
//   profilePic?: string;
//   description?: string;
//   location?: string;
//   hourlyRate?: number;
// }
