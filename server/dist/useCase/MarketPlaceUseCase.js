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
exports.MarketPlaceUseCase = void 0;
const Projects_1 = __importDefault(require("../domain/models/Projects"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../domain/models/User"));
const Notification_1 = __importDefault(require("../domain/models/Notification"));
class MarketPlaceUseCase {
    constructor(market) {
        Object.defineProperty(this, "market", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: market
        });
        this.market = market;
    }
    getAllProjectDetails(_a) {
        return __awaiter(this, arguments, void 0, function* ({ search = "", minPrice = 0, maxPrice = 10000, jobTypes = "", skills = "", experienceLevel = "", page = 1, limit = 5, }) {
            try {
                const query = {};
                const andConditions = [];
                if (search) {
                    andConditions.push({
                        $or: [
                            { title: { $regex: search, $options: "i" } },
                            { description: { $regex: search, $options: "i" } },
                        ],
                    });
                }
                query.budget = {
                    $gte: parseInt(minPrice),
                    $lte: parseInt(maxPrice),
                };
                if (skills) {
                    const skillsArray = skills.toLowerCase().split(",");
                    andConditions.push({
                        $or: skillsArray.map((skill) => ({
                            skills: { $regex: skill.trim(), $options: "i" },
                        })),
                    });
                }
                if (jobTypes) {
                    const typesArray = jobTypes.toLowerCase().split(",");
                    andConditions.push({
                        budgetType: { $in: typesArray },
                    });
                }
                if (experienceLevel) {
                    const levelsArray = experienceLevel.split(",");
                    andConditions.push({
                        $or: levelsArray.map((level) => ({
                            experienceLevel: { $regex: level.trim(), $options: "i" },
                        })),
                    });
                }
                andConditions.push({ status: "posted" });
                if (andConditions.length > 0) {
                    query.$and = andConditions;
                }
                return yield this.market.findAllProjects(query, page, limit);
            }
            catch (error) {
                console.error("MarketPlace Usecase error:", error);
                throw error;
            }
        });
    }
    getProjectDetails(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!jobId || typeof jobId !== "string") {
                throw new Error("Invalid Job ID");
            }
            try {
                const result = yield this.market.findProjectDetails(jobId);
                if (!result) {
                    throw new Error("Job not found");
                }
                return result;
            }
            catch (error) {
                console.error(`[getProjectDetails] Error fetching job ${jobId}:`, error);
                throw error;
            }
        });
    }
    getActiveProjectUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.market.findClientActiveProject(userId);
                if (!result) {
                    throw new Error("Jobs not found");
                }
                return result;
            }
            catch (error) {
                console.error("getActiveProjectUseCase ", error);
                throw error;
            }
        });
    }
    getPendingProjectUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.market.findClientPendingProject(userId);
                if (!result) {
                    throw new Error("Jobs not found");
                }
                return result;
            }
            catch (error) {
                console.error("find Client Pending Project ", error);
                throw error;
            }
        });
    }
    getCompletedProjectUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.market.findClientCompletedProject(userId);
                if (!result) {
                    throw new Error("Jobs not found");
                }
                return result;
            }
            catch (error) {
                console.error("getActiveProjectUseCase ", error);
                throw error;
            }
        });
    }
    jobProposalUseCase(proposalData, userId, io, connectedUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.market.createNewJobProposal(proposalData, userId);
                if (!result) {
                    throw new Error("Proposal Faild");
                }
                const job = yield this.market.findProposalDetails(proposalData.jobId);
                const freelancer = yield this.market.findFreelancerData(userId);
                if (job && (job === null || job === void 0 ? void 0 : job.clientId)) {
                    const clientSocketId = connectedUsers[job.clientId.toString()];
                    if (clientSocketId) {
                        io.to(clientSocketId).emit("notification", {
                            _id: result.proposalId,
                            userId: job.clientId.toString(),
                            type: "proposal",
                            title: "New Job Proposal",
                            message: `A new proposal has been submitted for your job by freelancer ${freelancer === null || freelancer === void 0 ? void 0 : freelancer.fullName}.`,
                            content: `Proposal ID: ${result.proposalId}`,
                            isRead: false,
                            actionLink: `/client-dashboard/jobs/${result.proposalId}/proposals`,
                            metadata: {
                                jobId: proposalData.jobId,
                                proposalId: result.proposalId,
                                freelancerId: userId,
                            },
                            createdAt: new Date().toISOString(),
                        });
                        console.log(`Notification sent to client ${job.clientId}`);
                    }
                    else {
                        console.log(`Client ${job.clientId} is not connected`);
                    }
                }
                return result;
            }
            catch (error) {
                console.error(`creating proposal usecase error`, error);
                throw error;
            }
        });
    }
    getProposalDetailsUseCase(userId, proposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!userId && !proposalId) {
                    throw new Error("Credensial missing");
                }
                const proposalDetails = yield this.market.findProposalById(proposalId);
                if (!proposalId) {
                    throw new Error("Proposal details not found");
                }
                if (((_a = proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.clientId) === null || _a === void 0 ? void 0 : _a.toString()) !== userId) {
                    throw new Error("You Can not access this page");
                }
                const freelancer = yield this.market.findFreelancerById(proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.freelancerId);
                const proposal = Object.assign(Object.assign({}, proposalDetails), { profile: (freelancer === null || freelancer === void 0 ? void 0 : freelancer.profilePic) || "", skills: (freelancer === null || freelancer === void 0 ? void 0 : freelancer.skills) || [] });
                return proposal;
            }
            catch (error) {
                console.error(`creating proposal usecase error`, error);
                throw error;
            }
        });
    }
    getAllJobDetailsUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    throw new Error("Credensial missing");
                }
                const findProject = yield this.market.findActiveProject(userId);
                return findProject;
            }
            catch (error) {
                console.error(`creating proposal usecase error`, error);
                throw error;
            }
        });
    }
    getProjectAllInformationUseCase(jobId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!jobId || typeof jobId !== "string") {
                throw new Error("Invalid Job ID");
            }
            try {
                const result = yield this.market.getProjectAllInformation(jobId);
                if (!result) {
                    throw new Error("Job not found");
                }
                if (((_a = result.hiredFreelancer) === null || _a === void 0 ? void 0 : _a.toString()) !== userId.toString()) {
                    throw new Error("You cannot access this data");
                }
                const proposal = yield this.market.ProposalAllInfo(result.hiredProposalId);
                return {
                    jobDetails: result,
                    proposalDetails: proposal,
                };
            }
            catch (error) {
                console.error(`[getProjectDetails] Error fetching job ${jobId}:`, error);
                throw error;
            }
        });
    }
    submitMilestoneUseCase(jobId, userId, milestoneId, comments, links, io, connectedUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                if (!jobId || typeof jobId !== "string") {
                    throw new Error("Invalid Job ID");
                }
                const result = yield this.market.submitMilestoneRepo(jobId, userId, milestoneId, comments, links, session);
                if (!result) {
                    throw new Error("Job not found");
                }
                const job = yield Projects_1.default.findById(jobId).session(session);
                const freelancer = yield User_1.default.findById(userId).session(session);
                if (!job || !freelancer) {
                    throw new Error("Job or freelancer not found");
                }
                const milestone = result.milestones.find((m) => m._id.toString() === milestoneId);
                if (!milestone) {
                    throw new Error("Milestone not found in proposal");
                }
                yield Notification_1.default.create([
                    {
                        userId: job.clientId,
                        type: "milestone",
                        title: "Milestone Submitted",
                        message: `Freelancer ${freelancer.fullName} has submitted a milestone for the job "${job.title}".`,
                        content: `Milestone ID: ${milestoneId}`,
                        isRead: false,
                        actionLink: `/client-dashboard/active-project/${jobId}`,
                        metadata: {
                            jobId: jobId,
                            milestoneId: milestoneId,
                            freelancerId: userId,
                            proposalId: result._id,
                        },
                        createdAt: new Date(),
                    },
                ], { session });
                const clientSocketId = connectedUsers[job.clientId.toString()];
                if (clientSocketId) {
                    io.to(clientSocketId).emit("notification", {
                        _id: milestoneId,
                        userId: job.clientId.toString(),
                        type: "milestone",
                        title: "Milestone Submitted",
                        message: `Freelancer ${freelancer.fullName} has submitted a milestone for the job "${job.title}".`,
                        content: `Milestone ID: ${milestoneId}`,
                        isRead: false,
                        actionLink: `/client-dashboard/active-project/${jobId}`,
                        metadata: {
                            jobId: jobId,
                            milestoneId: milestoneId,
                            freelancerId: userId,
                            proposalId: result._id,
                        },
                        createdAt: new Date().toISOString(),
                    });
                    console.log(`Notification sent to client ${job.clientId}`);
                }
                else {
                    console.log(`Client ${job.clientId} is not connected`);
                }
                yield session.commitTransaction();
                return {
                    jobDetails: result,
                };
            }
            catch (error) {
                yield session.abortTransaction();
                console.error(`[submitMilestoneUseCase] Error submitting milestone for job ${jobId}:`, error);
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    submitFeedbackCase(feedbackData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { jobId, toUser, feedbackType } = feedbackData;
            if (!jobId || typeof jobId !== "string") {
                throw new Error("Invalid Job ID");
            }
            if (!toUser || typeof toUser !== "string") {
                throw new Error("Invalid toUser ID");
            }
            try {
                const result = yield this.market.submitFeedbackRepo(feedbackData);
                if (!result) {
                    throw new Error("Job not found");
                }
                const feedbacks = yield this.market.findFeedbackRepo(toUser, feedbackType);
                let totalRating = 0;
                let qualityTotal = 0;
                let deadlinesTotal = 0;
                let professionalismTotal = 0;
                let clarityTotal = 0;
                let paymentTotal = 0;
                let communicationTotal = 0;
                feedbacks.forEach((fb) => {
                    totalRating += fb.overallRating;
                    // For client-to-freelancer feedback
                    if (fb.feedbackType === "client-to-freelancer") {
                        qualityTotal += fb.ratings.quality || 0;
                        deadlinesTotal += fb.ratings.deadlines || 0;
                        professionalismTotal += fb.ratings.professionalism || 0;
                    }
                    // For freelancer-to-client feedback
                    else {
                        clarityTotal += fb.ratings.clarity || 0;
                        paymentTotal += fb.ratings.payment || 0;
                        communicationTotal += fb.ratings.communication || 0;
                    }
                });
                const feedbackCount = feedbacks.length;
                const avgOverallRating = totalRating / feedbackCount;
                const updateData = {
                    avgRating: avgOverallRating,
                    feedbackCount,
                };
                // Add specific averages based on feedback type
                if (feedbackType === "client-to-freelancer") {
                    updateData.freelancerRatings = {
                        avgQuality: qualityTotal / feedbackCount,
                        avgDeadlines: deadlinesTotal / feedbackCount,
                        avgProfessionalism: professionalismTotal / feedbackCount,
                    };
                }
                else {
                    updateData.clientRatings = {
                        avgClarity: clarityTotal / feedbackCount,
                        avgPayment: paymentTotal / feedbackCount,
                        avgCommunication: communicationTotal / feedbackCount,
                    };
                }
                yield this.market.findUserAndUpdateFeedback(toUser, updateData);
                return result;
            }
            catch (error) {
                console.error("Error submitting feedback:", error);
                throw new Error("Failed to submit feedback");
            }
        });
    }
    submitFreelacerReportUseCase(reportData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.market.submitFreelacerReportRepo(reportData);
                return result;
            }
            catch (error) {
                console.error("Error submitting feedback:", error);
                throw new Error("Failed to submit feedback");
            }
        });
    }
}
exports.MarketPlaceUseCase = MarketPlaceUseCase;
//# sourceMappingURL=MarketPlaceUseCase.js.map