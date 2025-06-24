import { userDataRepoI } from "../../../../domain/interfaces/admin/userDataRepoI";
import UserModel from "../../../../domain/models/User";
import clientModal from "../../../../domain/models/ClientProfile";
import FreelancerProfile from "../../../../domain/models/FreelancerProfile";
import ReportModal from "../../../../domain/models/ReportModel";
import FeedbackModel from "../../../../domain/models/feedbackSchema";
import ProjectModel from "../../../../domain/models/Projects";
import PaymentRequestModel from "../../../../domain/models/PaymentRequest";
import PaymentModel from "../../../../domain/models/PaymentModel";
import WalletModel from "../../../../domain/models/Wallet";

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
  async findUserGrowthData() {
    try {
      const result = await UserModel.aggregate([
        {
          $project: {
            role: 1,
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
            createdAt: 1,
          },
        },
        {
          $group: {
            _id: {
              year: "$year",
              week: "$week",
              role: "$role",
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              year: "$_id.year",
              week: "$_id.week",
            },
            roles: {
              $push: {
                role: "$_id.role",
                count: "$count",
              },
            },
          },
        },
        {
          $project: {
            week: {
              $concat: [
                "Week ",
                { $toString: "$_id.week" },
                ", ",
                { $toString: "$_id.year" },
              ],
            },
            freelancers: {
              $ifNull: [
                {
                  $let: {
                    vars: {
                      freelancer: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$roles",
                              as: "r",
                              cond: { $eq: ["$$r.role", "freelancer"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$freelancer.count",
                  },
                },
                0,
              ],
            },
            clients: {
              $ifNull: [
                {
                  $let: {
                    vars: {
                      client: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$roles",
                              as: "r",
                              cond: { $eq: ["$$r.role", "client"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$client.count",
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.week": 1 },
        },
        {
          $project: { _id: 0 },
        },
      ]);
      const totalUsers = await UserModel.countDocuments();
      return { result, totalUsers };
    } catch (error) {
      throw new Error("Failed to Load DB Data");
    }
  }
  async findTopFreelancer() {
    try {
      const feedbacks = await FeedbackModel.find();

      // Group feedback by freelancerId and calculate averages
      const userRatingsMap = new Map<
        string,
        {
          count: number;
          totalRating: number;
          quality: number;
          deadlines: number;
          professionalism: number;
        }
      >();

      feedbacks.forEach((feedback) => {
        const freelancerId = feedback.freelancerId.toString();
        const current = userRatingsMap.get(freelancerId) || {
          count: 0,
          totalRating: 0,
          quality: 0,
          deadlines: 0,
          professionalism: 0,
        };

        userRatingsMap.set(freelancerId, {
          count: current.count + 1,
          totalRating: current.totalRating + feedback.overallRating,
          quality: current.quality + feedback.ratings.quality,
          deadlines: current.deadlines + feedback.ratings.deadlines,
          professionalism:
            current.professionalism + feedback.ratings.professionalism,
        });
      });

      // Convert map to array of user rating summaries
      const userRatingSummaries = Array.from(userRatingsMap.entries()).map(
        ([freelancerId, stats]) => ({
          freelancerId,
          averageRating: stats.totalRating / stats.count,
          averageQuality: stats.quality / stats.count,
          averageDeadlines: stats.deadlines / stats.count,
          averageProfessionalism: stats.professionalism / stats.count,
          feedbackCount: stats.count,
        })
      );

      // Sort by average rating (descending)
      userRatingSummaries.sort((a, b) => b.averageRating - a.averageRating);

      // Get top 3 users
      const topUserIds = userRatingSummaries
        .slice(0, 5)
        .map((user) => user.freelancerId);

      const topUsers = await UserModel.find({
        _id: { $in: topUserIds },
        role: "freelancer",
      });

      // Combine user details with their rating stats
      const result = topUserIds.map((freelancerId) => {
        const user = topUsers.find((u) => u._id.toString() === freelancerId);
        const ratingSummary = userRatingSummaries.find(
          (r) => r.freelancerId === freelancerId
        );

        return {
          userId: freelancerId,
          fullName: user?.fullName || "Unknown",
          email: user?.email || "",
          averageRating: ratingSummary?.averageRating || 0,
          averageQuality: ratingSummary?.averageQuality || 0,
          averageDeadlines: ratingSummary?.averageDeadlines || 0,
          averageProfessionalism: ratingSummary?.averageProfessionalism || 0,
          feedbackCount: ratingSummary?.feedbackCount || 0,
        };
      });

      return result;
    } catch (error) {
      throw new Error("Failed to Load DB Data");
    }
  }
  async findAllJobcountUseCase() {
    try {
      const result = await ProjectModel.aggregate([
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

      return result;
    } catch (error) {
      throw new Error("Failed to Load DB Data");
    }
  }
  async findAllJobDetails() {
    try {
      const totalJobs = await ProjectModel.countDocuments();
      const completedJobs = await ProjectModel.countDocuments({
        status: "completed",
      });
      const successRate = (completedJobs / totalJobs) * 100;

      const avgBudget = await ProjectModel.aggregate([
        {
          $group: {
            _id: null,
            avgBudget: { $avg: "$budget" },
          },
        },
      ]);

      const activeJob = await ProjectModel.countDocuments({
        status: "in-progress",
      });
      return {
        successRate: successRate.toFixed(2),
        avgBudget: avgBudget[0].avgBudget * 80 || 0,
        completedJob: completedJobs,
        totalJob: totalJobs,
        activeJob,
      };
    } catch (error) {
      throw new Error("Failed to Load DB Data");
    }
  }
  async findRevenueData() {
    try {
      const revenueData = await PaymentRequestModel.aggregate([
        {
          $match: {
            status: "paid",
          },
        },
        {
          $project: {
            year: { $isoWeekYear: "$createdAt" }, // ISO year (better for weeks)
            week: { $isoWeek: "$createdAt" }, // ISO week (1-53)
            platformFee: 1,
            createdAt: 1,
          },
        },
        {
          $group: {
            _id: {
              year: "$year",
              week: "$week",
            },
            platformFee: { $sum: "$platformFee" },
            // Get the first date in this week for display
            startDate: { $min: "$createdAt" },
          },
        },
        {
          $project: {
            _id: 0,
            // Format as "Week YYYY-WW" (e.g., "Week 2025-25")
            week: {
              $concat: [
                "Week ",
                ",",
                {
                  $toString: {
                    $cond: [
                      { $lt: ["$_id.week", 10] },
                      { $concat: ["0", { $toString: "$_id.week" }] },
                      { $toString: "$_id.week" },
                    ],
                  },
                },
                ",",
                { $toString: "$_id.year" },
              ],
            },
            platformFee: 1,
            dateRange: {
              $concat: [
                { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
                " to ",
                {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: {
                      $dateAdd: {
                        startDate: "$startDate",
                        unit: "day",
                        amount: 6,
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.week": 1,
          },
        },
      ]);

      const revenue = await PaymentModel.aggregate([
        {
          $group: {
            _id: null,
            revenue: { $sum: "$platformFee" },
          },
        },
      ]);
      const pending = await PaymentRequestModel.aggregate([
        {
          $match: {
            status: "pending",
          },
        },
        {
          $group: {
            _id: null,
            pending: { $sum: "$platformFee" },
          },
        },
      ]);

      const wallet = await WalletModel.findOne(
        { userId: "admin" },
        { balance: 1 }
      );

      return {
        revenueData,
        revenueDetails: {
          revenue: revenue[0]?.revenue,
          pending: pending[0]?.pending | 0,
          wallet: wallet?.balance,
        },
      };
    } catch (error) {
      throw new Error("Failed to Load DB Data");
    }
  }
}
