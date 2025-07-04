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
exports.ClientRepo = void 0;
// import UserModel from "../../../../domain/models/User";
const ClientProfile_1 = __importDefault(require("../../../../domain/models/ClientProfile"));
const User_1 = __importDefault(require("../../../../domain/models/User"));
const mongoose_1 = require("mongoose");
const Projects_1 = __importDefault(require("../../../../domain/models/Projects"));
const PaymentModel_1 = __importDefault(require("../../../../domain/models/PaymentModel"));
class ClientRepo {
    findOneAndUpdate(userId, companyName, description, location, website, coverResult, profileResult) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ClientProfile_1.default.findOneAndUpdate({ userId }, {
                profilePic: profileResult.secure_url,
                coverPic: coverResult.secure_url,
                companyName,
                location,
                website,
                description,
            }, {
                new: true,
                upsert: true,
            });
            return result;
        });
    }
    findOne(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ClientProfile_1.default.findOne({ userId });
            return result;
        });
    }
    findFreelancer(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const freelancers = yield User_1.default.aggregate([
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
                        avgRating: 1,
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
            const totalCount = yield User_1.default.countDocuments({ role: "freelancer" });
            const totalPages = Math.ceil(totalCount / limit);
            console.log(freelancers === null || freelancers === void 0 ? void 0 : freelancers[0]);
            return {
                freelancers,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                },
            };
        });
    }
    findProjectByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Projects_1.default.aggregate([
                {
                    $match: {
                        clientId: new mongoose_1.Types.ObjectId(userId),
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
            const projectCount = yield Projects_1.default.aggregate([
                {
                    $match: {
                        clientId: new mongoose_1.Types.ObjectId(userId),
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
        });
    }
    findFinancialByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const weeklySpending = yield PaymentModel_1.default.aggregate([
                {
                    $match: {
                        clientId: new mongoose_1.Types.ObjectId(userId),
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
            const totalSpentResult = yield PaymentModel_1.default.aggregate([
                {
                    $match: {
                        clientId: new mongoose_1.Types.ObjectId(userId),
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
            const totalSpent = ((_a = totalSpentResult[0]) === null || _a === void 0 ? void 0 : _a.totalSpent) || 0;
            const avgCostPerProjectResult = yield PaymentModel_1.default.aggregate([
                {
                    $match: {
                        clientId: new mongoose_1.Types.ObjectId(userId),
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
        });
    }
}
exports.ClientRepo = ClientRepo;
//# sourceMappingURL=clientProfileRepo.js.map