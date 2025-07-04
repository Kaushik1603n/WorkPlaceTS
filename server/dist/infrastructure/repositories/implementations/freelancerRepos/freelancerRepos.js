"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.FreelancerRepo = void 0;
const FreelancerProfile_1 = __importDefault(require("../../../../domain/models/FreelancerProfile"));
const mongoose_1 = __importStar(require("mongoose"));
const User_1 = __importDefault(require("../../../../domain/models/User"));
const Projects_1 = __importDefault(require("../../../../domain/models/Projects"));
const PaymentModel_1 = __importDefault(require("../../../../domain/models/PaymentModel"));
const Proposal_1 = __importDefault(require("../../../../domain/models/Proposal"));
const PaymentRequest_1 = __importDefault(require("../../../../domain/models/PaymentRequest"));
const ReportModel_1 = __importDefault(require("../../../../domain/models/ReportModel"));
class FreelancerRepo {
    findOneAndUpdate(userId, availability, experience, education, hourlyRate, skills, location, reference, bio, coverResult, profileResult) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || typeof userId !== "string") {
                throw new Error("Invalid user ID format");
            }
            const userIdObj = new mongoose_1.default.Types.ObjectId(userId);
            const result = yield FreelancerProfile_1.default.findOneAndUpdate({ userId: userIdObj }, {
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
            }, {
                new: true,
                upsert: true,
            });
            return result;
        });
    }
    findOne(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield FreelancerProfile_1.default.findOne({ userId });
            return result;
        });
    }
    findFreelancer(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const clients = yield User_1.default.aggregate([
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
            const totalCount = yield User_1.default.countDocuments({ role: "client" });
            const totalPages = Math.ceil(totalCount / limit);
            return {
                clients,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                },
            };
        });
    }
    findFreelancerTicket(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ReportModel_1.default.find({ reportedBy: userId })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });
            const totalCount = yield ReportModel_1.default.countDocuments({ reportedBy: userId });
            const totalPages = Math.ceil(totalCount / limit);
            return { result, totalPages };
        });
    }
    findCounts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalJob = yield Projects_1.default.countDocuments({
                hiredFreelancer: userId,
            });
            const completedJob = yield Projects_1.default.countDocuments({
                hiredFreelancer: userId,
                status: "completed",
            });
            const activeJob = yield Projects_1.default.countDocuments({
                hiredFreelancer: userId,
                status: "in-progress",
            });
            const Earnings = yield PaymentModel_1.default.aggregate([
                {
                    $match: {
                        freelancerId: new mongoose_1.Types.ObjectId(userId), // Ensure userId is ObjectId
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
            const totalProposal = yield Proposal_1.default.countDocuments({
                freelancerId: userId,
            });
            return { totalJob, completedJob, activeJob, avgEarnings, totalProposal };
        });
    }
    findTotalEarnings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Earnings = yield PaymentModel_1.default.aggregate([
                {
                    $match: {
                        freelancerId: new mongoose_1.Types.ObjectId(userId), // Ensure userId is ObjectId
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
            const pendingEarnings = yield PaymentRequest_1.default.aggregate([
                {
                    $match: {
                        freelancerId: new mongoose_1.Types.ObjectId(userId),
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
            const pendingPayments = pendingEarnings.length > 0 ? Earnings[0].totalPayments : 0;
            const weeklyPayments = yield PaymentModel_1.default.aggregate([
                {
                    $match: {
                        freelancerId: new mongoose_1.Types.ObjectId(userId),
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
            const monthlyPayments = yield PaymentModel_1.default.aggregate([
                {
                    $match: {
                        freelancerId: new mongoose_1.Types.ObjectId(userId),
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
        });
    }
    findTotalProject(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allProject = yield Projects_1.default.find({ hiredFreelancer: userId }, { _id: 1, title: 1, clientId: 1, budget: 1, status: 1, createdAt: 1 })
                .sort({ createdAt: -1 })
                .limit(5);
            const totalProject = yield Projects_1.default.countDocuments({
                hiredFreelancer: userId,
            });
            const completedProject = yield Projects_1.default.countDocuments({
                hiredFreelancer: userId,
                status: "completed",
            });
            const activeProject = yield Projects_1.default.countDocuments({
                hiredFreelancer: userId,
                status: "in-progress",
            });
            return {
                allProject: allProject || [],
                totalProject,
                completedProject,
                activeProject,
            };
        });
    }
}
exports.FreelancerRepo = FreelancerRepo;
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
//# sourceMappingURL=freelancerRepos.js.map