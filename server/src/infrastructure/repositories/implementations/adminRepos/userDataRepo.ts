import { userDataRepoI } from "../../../../domain/interfaces/admin/userDataRepoI";
import UserModel from "../../../../domain/models/User";
import clientModal from "../../../../domain/models/ClientProfile";
import FreelancerProfile from "../../../../domain/models/FreelancerProfile";
import ReportModal from "../../../../domain/models/ReportModel";

export class UserDataRepo implements userDataRepoI {
  async findFreelancer(
    page: number,
    limit: number,
    search: string
  ): Promise<any> {
    const searchQuery = {
      $and: [
        { role: "freelancer" },
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };
    const result = await UserModel.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: 1 });
    const total = await UserModel.countDocuments(searchQuery);

    return {
      freelancer: result,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      },
    };
  }
  async findClient(page: number, limit: number, search: string): Promise<any> {
    const searchQuery = {
      $and: [
        { role: "client" },
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };
    const result = await UserModel.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: 1 });
    const total = await UserModel.countDocuments(searchQuery);

    return {
      client: result,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      },
    };
  }
  async find(page: number, limit: number, search: string): Promise<any> {
    const searchQuery = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const total = await UserModel.countDocuments(searchQuery);
    const result = await UserModel.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: 1 });
    return {
      users: result,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      },
    };
  }

  async findOneByIdAndUpdate(userId: string, status: string) {
    const result = await UserModel.findByIdAndUpdate(userId, { status });
    return result;
  }
  async findClientDetails(userId: string) {
    const client = await UserModel.findById(userId, {
      fullName: 1,
      email: 1,
      role: 1,
      status: 1,
      isVerification: 1,
      createdAt: 1,
      updatedAt: 1,
    });
    const profile = await clientModal.findOne({ userId });
    const result = {
      id: client?._id,
      name: client?.fullName,
      email: client?.email,
      isVerification: client?.isVerification,
      profile: profile?.profilePic,
      cover: profile?.coverPic,
      companyName: profile?.companyName,
      location: profile?.location,
      website: profile?.website,
      description: profile?.description,
      role: client?.role,
      status: client?.status,
      createdAt: client?.createdAt,
      updatedAt: profile?.updatedAt,
    };

    return result;
  }
  async findfreelancerDetails(userId: string) {
    const freelancer = await UserModel.findById(userId, {
      fullName: 1,
      email: 1,
      role: 1,
      status: 1,
      isVerification: 1,
      createdAt: 1,
      updatedAt: 1,
    });
    const profile = await FreelancerProfile.findOne({ userId });
    const result = {
      id: freelancer?._id,
      name: freelancer?.fullName,
      email: freelancer?.email,
      role: freelancer?.role,
      status: freelancer?.status,
      isVerification: freelancer?.isVerification,
      createdAt: freelancer?.createdAt,
      profile: profile?.profilePic,
      cover: profile?.coverPic,
      availability: profile?.availability,
      experienceLevel: profile?.experienceLevel,
      education: profile?.education,
      hourlyRate: profile?.hourlyRate,
      skills: profile?.skills,
      location: profile?.location,
      reference: profile?.reference,
      description: profile?.bio,
      updatedAt: profile?.updatedAt,
    };

    return result;
  }

  async findByIdAndUserVerification(userId: string, status: string) {
    await UserModel.findByIdAndUpdate(userId, { isVerification: status });
  }
  async findReport() {
    return await ReportModal.find().sort({ createdAt: -1 });
  }
  async updateTicketStatus(status: string, ticketId: string, userId: string) {
    try {
      return await ReportModal.findByIdAndUpdate(
        ticketId,
        {
          status,
          $push: {
            statusHistory: {
              status,
              changedAt: new Date(),
              changedBy: userId,
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
  async updateTicketComment(text: string, ticketId: string, userId: string) {
    try {
      return await ReportModal.findByIdAndUpdate(
        ticketId,
        {
          $push: {
            comments: {
              text,
              user: "admin",
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
