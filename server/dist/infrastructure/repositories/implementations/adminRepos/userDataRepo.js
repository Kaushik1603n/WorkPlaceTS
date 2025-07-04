"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDataRepo = void 0;
const User_1 = __importDefault(require("../../../../domain/models/User"));
const ClientProfile_1 = __importDefault(require("../../../../domain/models/ClientProfile"));
const FreelancerProfile_1 = __importDefault(require("../../../../domain/models/FreelancerProfile"));
const ReportModel_1 = __importDefault(require("../../../../domain/models/ReportModel"));
const feedbackSchema_1 = __importDefault(require("../../../../domain/models/feedbackSchema"));
const Projects_1 = __importDefault(require("../../../../domain/models/Projects"));
const PaymentRequest_1 = __importDefault(require("../../../../domain/models/PaymentRequest"));
const PaymentModel_1 = __importDefault(require("../../../../domain/models/PaymentModel"));
const Wallet_1 = __importDefault(require("../../../../domain/models/Wallet"));
class UserDataRepo {
    findFreelancer(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield User_1.default.find(searchQuery)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: 1 });
            const total = yield User_1.default.countDocuments(searchQuery);
            return {
                freelancer: result,
                pagination: {
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    totalItems: total,
                },
            };
        });
    }
    findClient(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield User_1.default.find(searchQuery)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: 1 });
            const total = yield User_1.default.countDocuments(searchQuery);
            return {
                client: result,
                pagination: {
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    totalItems: total,
                },
            };
        });
    }
    find(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchQuery = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            };
            const total = yield User_1.default.countDocuments(searchQuery);
            const result = yield User_1.default.find(searchQuery)
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
        });
    }
    findOneByIdAndUpdate(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield User_1.default.findByIdAndUpdate(userId, { status });
            return result;
        });
    }
    findClientDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield User_1.default.findById(userId, {
                fullName: 1,
                email: 1,
                role: 1,
                status: 1,
                isVerification: 1,
                createdAt: 1,
                updatedAt: 1,
            });
            const profile = yield ClientProfile_1.default.findOne({ userId });
            const result = {
                id: client === null || client === void 0 ? void 0 : client._id,
                name: client === null || client === void 0 ? void 0 : client.fullName,
                email: client === null || client === void 0 ? void 0 : client.email,
                isVerification: client === null || client === void 0 ? void 0 : client.isVerification,
                profile: profile === null || profile === void 0 ? void 0 : profile.profilePic,
                cover: profile === null || profile === void 0 ? void 0 : profile.coverPic,
                companyName: profile === null || profile === void 0 ? void 0 : profile.companyName,
                location: profile === null || profile === void 0 ? void 0 : profile.location,
                website: profile === null || profile === void 0 ? void 0 : profile.website,
                description: profile === null || profile === void 0 ? void 0 : profile.description,
                role: client === null || client === void 0 ? void 0 : client.role,
                status: client === null || client === void 0 ? void 0 : client.status,
                createdAt: client === null || client === void 0 ? void 0 : client.createdAt,
                updatedAt: profile === null || profile === void 0 ? void 0 : profile.updatedAt,
            };
            return result;
        });
    }
    findfreelancerDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const freelancer = yield User_1.default.findById(userId, {
                fullName: 1,
                email: 1,
                role: 1,
                status: 1,
                isVerification: 1,
                createdAt: 1,
                updatedAt: 1,
            });
            const profile = yield FreelancerProfile_1.default.findOne({ userId });
            const result = {
                id: freelancer === null || freelancer === void 0 ? void 0 : freelancer._id,
                name: freelancer === null || freelancer === void 0 ? void 0 : freelancer.fullName,
                email: freelancer === null || freelancer === void 0 ? void 0 : freelancer.email,
                role: freelancer === null || freelancer === void 0 ? void 0 : freelancer.role,
                status: freelancer === null || freelancer === void 0 ? void 0 : freelancer.status,
                isVerification: freelancer === null || freelancer === void 0 ? void 0 : freelancer.isVerification,
                createdAt: freelancer === null || freelancer === void 0 ? void 0 : freelancer.createdAt,
                profile: profile === null || profile === void 0 ? void 0 : profile.profilePic,
                cover: profile === null || profile === void 0 ? void 0 : profile.coverPic,
                availability: profile === null || profile === void 0 ? void 0 : profile.availability,
                experienceLevel: profile === null || profile === void 0 ? void 0 : profile.experienceLevel,
                education: profile === null || profile === void 0 ? void 0 : profile.education,
                hourlyRate: profile === null || profile === void 0 ? void 0 : profile.hourlyRate,
                skills: profile === null || profile === void 0 ? void 0 : profile.skills,
                location: profile === null || profile === void 0 ? void 0 : profile.location,
                reference: profile === null || profile === void 0 ? void 0 : profile.reference,
                description: profile === null || profile === void 0 ? void 0 : profile.bio,
                updatedAt: profile === null || profile === void 0 ? void 0 : profile.updatedAt,
            };
            return result;
        });
    }
    findByIdAndUserVerification(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User_1.default.findByIdAndUpdate(userId, { isVerification: status });
        });
    }
    findReport(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ReportModel_1.default.find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });
            const totalCount = yield ReportModel_1.default.countDocuments();
            const totalPages = Math.ceil(totalCount / limit);
            return { result, totalPages };
        });
    }
    updateTicketStatus(status, ticketId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ReportModel_1.default.findByIdAndUpdate(ticketId, {
                    status,
                    $push: {
                        statusHistory: {
                            status,
                            changedAt: new Date(),
                            changedBy: userId,
                        },
                    },
                    updatedAt: new Date(),
                }, { new: true });
            }
            catch (error) {
                throw new Error("Failed to update ticket");
            }
        });
    }
    updateTicketComment(text, ticketId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ReportModel_1.default.findByIdAndUpdate(ticketId, {
                    $push: {
                        comments: {
                            text,
                            user: "admin",
                            changedAt: new Date(),
                            createdBy: userId,
                        },
                    },
                    updatedAt: new Date(),
                }, { new: true });
            }
            catch (error) {
                throw new Error("Failed to update ticket");
            }
        });
    }
    findUserGrowthData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield User_1.default.aggregate([
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
                const totalUsers = yield User_1.default.countDocuments();
                return { result, totalUsers };
            }
            catch (error) {
                throw new Error("Failed to Load DB Data");
            }
        });
    }
    findTopFreelancer() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedbacks = yield feedbackSchema_1.default.find();
                // Group feedback by freelancerId and calculate averages
                const userRatingsMap = new Map();
                feedbacks.forEach((feedback) => {
                    const freelancerId = feedback.toUser.toString();
                    const current = userRatingsMap.get(freelancerId) || {
                        count: 0,
                        totalRating: 0,
                        quality: 0,
                        deadlines: 0,
                        professionalism: 0,
                    };
                    // Only process client-to-freelancer feedback for these stats
                    if (feedback.feedbackType === 'client-to-freelancer') {
                        userRatingsMap.set(freelancerId, {
                            count: current.count + 1,
                            totalRating: current.totalRating + feedback.overallRating,
                            quality: current.quality + (feedback.ratings.quality || 0),
                            deadlines: current.deadlines + (feedback.ratings.deadlines || 0),
                            professionalism: current.professionalism + (feedback.ratings.professionalism || 0),
                        });
                    }
                });
                // Convert map to array of user rating summaries
                const userRatingSummaries = Array.from(userRatingsMap.entries()).map(([freelancerId, stats]) => ({
                    freelancerId,
                    averageRating: stats.totalRating / stats.count,
                    averageQuality: stats.quality / stats.count,
                    averageDeadlines: stats.deadlines / stats.count,
                    averageProfessionalism: stats.professionalism / stats.count,
                    feedbackCount: stats.count,
                }));
                // Sort by average rating (descending)
                userRatingSummaries.sort((a, b) => b.averageRating - a.averageRating);
                // Get top 3 users
                const topUserIds = userRatingSummaries
                    .slice(0, 5)
                    .map((user) => user.freelancerId);
                const topUsers = yield User_1.default.find({
                    _id: { $in: topUserIds },
                    role: "freelancer",
                });
                // Combine user details with their rating stats
                const result = topUserIds.map((freelancerId) => {
                    const user = topUsers.find((u) => u._id.toString() === freelancerId);
                    const ratingSummary = userRatingSummaries.find((r) => r.freelancerId === freelancerId);
                    return {
                        userId: freelancerId,
                        fullName: (user === null || user === void 0 ? void 0 : user.fullName) || "Unknown",
                        email: (user === null || user === void 0 ? void 0 : user.email) || "",
                        averageRating: (ratingSummary === null || ratingSummary === void 0 ? void 0 : ratingSummary.averageRating) || 0,
                        averageQuality: (ratingSummary === null || ratingSummary === void 0 ? void 0 : ratingSummary.averageQuality) || 0,
                        averageDeadlines: (ratingSummary === null || ratingSummary === void 0 ? void 0 : ratingSummary.averageDeadlines) || 0,
                        averageProfessionalism: (ratingSummary === null || ratingSummary === void 0 ? void 0 : ratingSummary.averageProfessionalism) || 0,
                        feedbackCount: (ratingSummary === null || ratingSummary === void 0 ? void 0 : ratingSummary.feedbackCount) || 0,
                    };
                });
                return result;
            }
            catch (error) {
                throw new Error("Failed to Load DB Data");
            }
        });
    }
    findAllJobcountUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Projects_1.default.aggregate([
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
            }
            catch (error) {
                throw new Error("Failed to Load DB Data");
            }
        });
    }
    findAllJobDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalJobs = yield Projects_1.default.countDocuments();
                const completedJobs = yield Projects_1.default.countDocuments({
                    status: "completed",
                });
                const successRate = (completedJobs / totalJobs) * 100;
                const avgBudget = yield Projects_1.default.aggregate([
                    {
                        $group: {
                            _id: null,
                            avgBudget: { $avg: "$budget" },
                        },
                    },
                ]);
                const activeJob = yield Projects_1.default.countDocuments({
                    status: "in-progress",
                });
                return {
                    successRate: successRate.toFixed(2),
                    avgBudget: avgBudget[0].avgBudget * 80 || 0,
                    completedJob: completedJobs,
                    totalJob: totalJobs,
                    activeJob,
                };
            }
            catch (error) {
                throw new Error("Failed to Load DB Data");
            }
        });
    }
    findRevenueData() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const revenueData = yield PaymentRequest_1.default.aggregate([
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
                const revenue = yield PaymentModel_1.default.aggregate([
                    {
                        $group: {
                            _id: null,
                            revenue: { $sum: "$platformFee" },
                        },
                    },
                ]);
                const pending = yield PaymentRequest_1.default.aggregate([
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
                const wallet = yield Wallet_1.default.findOne({ userId: "admin" }, { balance: 1 });
                return {
                    revenueData,
                    revenueDetails: {
                        revenue: (_a = revenue[0]) === null || _a === void 0 ? void 0 : _a.revenue,
                        pending: ((_b = pending[0]) === null || _b === void 0 ? void 0 : _b.pending) | 0,
                        wallet: wallet === null || wallet === void 0 ? void 0 : wallet.balance,
                    },
                };
            }
            catch (error) {
                throw new Error("Failed to Load DB Data");
            }
        });
    }
    getAllPayments(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield PaymentModel_1.default.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort({ createdAt: -1 });
            }
            catch (error) {
                throw new Error("Failed to Load DB Data");
            }
        });
    }
}
exports.UserDataRepo = UserDataRepo;
//# sourceMappingURL=userDataRepo.js.map