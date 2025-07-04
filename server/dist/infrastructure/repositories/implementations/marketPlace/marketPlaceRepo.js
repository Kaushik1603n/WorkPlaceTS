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
exports.marketPlaceRepo = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Projects_1 = __importDefault(require("../../../../domain/models/Projects"));
const User_1 = __importDefault(require("../../../../domain/models/User"));
const Proposal_1 = __importDefault(require("../../../../domain/models/Proposal"));
const Notification_1 = __importDefault(require("../../../../domain/models/Notification"));
const FreelancerProfile_1 = __importDefault(require("../../../../domain/models/FreelancerProfile"));
const feedbackSchema_1 = __importDefault(require("../../../../domain/models/feedbackSchema"));
const ReportModel_1 = __importDefault(require("../../../../domain/models/ReportModel"));
class marketPlaceRepo {
    findAllProjects(searchQuery, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield Projects_1.default.countDocuments(searchQuery);
            const result = yield Projects_1.default.find(searchQuery, {
                _id: 1,
                job_Id: 1,
                title: 1,
                stack: 1,
                description: 1,
                skills: 1,
                budget: 1,
                proposals: 1,
                createdAt: 1,
            })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });
            const jobs = result.map((doc) => {
                var _a, _b;
                return ({
                    _id: doc._id.toString(),
                    job_Id: doc.job_Id.toString(),
                    title: doc.title,
                    stack: doc.stack,
                    description: doc.description,
                    skills: doc.skills,
                    budget: doc.budget,
                    proposals: (_b = (_a = doc.proposals) === null || _a === void 0 ? void 0 : _a.map(String)) !== null && _b !== void 0 ? _b : [],
                    createdAt: doc.createdAt.toISOString(),
                });
            });
            return {
                result: jobs,
                pagination: {
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    totalItems: total,
                },
            };
        });
    }
    findProjectDetails(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(jobId)) {
                // From mongoose or custom check
                throw new Error("Invalid Job ID format");
            }
            try {
                const project = yield Projects_1.default.findById(jobId);
                const client = yield User_1.default.findById(project === null || project === void 0 ? void 0 : project.clientId);
                const result = {
                    title: project === null || project === void 0 ? void 0 : project.title,
                    description: project === null || project === void 0 ? void 0 : project.description,
                    stack: project === null || project === void 0 ? void 0 : project.stack,
                    time: project === null || project === void 0 ? void 0 : project.time,
                    reference: project === null || project === void 0 ? void 0 : project.reference,
                    requiredFeatures: project === null || project === void 0 ? void 0 : project.requiredFeatures,
                    budgetType: project === null || project === void 0 ? void 0 : project.budgetType,
                    budget: project === null || project === void 0 ? void 0 : project.budget,
                    experienceLevel: project === null || project === void 0 ? void 0 : project.experienceLevel,
                    clientId: {
                        fullName: client === null || client === void 0 ? void 0 : client.fullName,
                        email: client === null || client === void 0 ? void 0 : client.email,
                    },
                };
                return result;
            }
            catch (error) {
                console.error(`[findProjectDetails] DB error for job ${jobId}:`, error);
                throw error;
            }
        });
    }
    findClientActiveProject(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allProjects = yield Projects_1.default.find({ clientId: userId, status: "in-progress" }, {
                contractId: 1,
                budget: 1,
                budgetType: 1,
                time: 1,
                status: 1,
                title: 1,
                description: 1,
            })
                .sort({ createdAt: -1 })
                .lean();
            return allProjects;
        });
    }
    findClientPendingProject(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allProjects = yield Projects_1.default.find({ clientId: userId, status: "posted" }, {
                contractId: 1,
                budget: 1,
                budgetType: 1,
                time: 1,
                status: 1,
                title: 1,
                description: 1,
            })
                .sort({ createdAt: -1 })
                .lean();
            return allProjects;
        });
    }
    findClientCompletedProject(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allProjects = yield Projects_1.default.find({ clientId: userId, status: "completed" }, {
                contractId: 1,
                budget: 1,
                budgetType: 1,
                time: 1,
                status: 1,
                title: 1,
                description: 1,
            })
                .sort({ createdAt: -1 })
                .lean();
            return allProjects;
        });
    }
    createNewJobProposal(proposalData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                // Check if job exists first
                const jobExists = yield Projects_1.default.findById({
                    _id: proposalData.jobId,
                });
                if (!jobExists) {
                    throw new Error("Job not found");
                }
                const clientId = jobExists === null || jobExists === void 0 ? void 0 : jobExists.clientId;
                const result = yield Proposal_1.default.create([
                    {
                        freelancerId: userId,
                        jobId: proposalData.jobId,
                        coverLetter: proposalData.coverLetter,
                        budgetType: proposalData.bidType,
                        bidAmount: proposalData.bidAmount,
                        estimatedTime: proposalData.timeline,
                        workSamples: proposalData.workSamples,
                        milestones: proposalData.milestones,
                        agreeVideoCall: proposalData.agreeVideoCall,
                        agreeNDA: proposalData.agreeNDA,
                    },
                ], { session });
                yield Projects_1.default.findByIdAndUpdate(proposalData.jobId, { $push: { proposals: result[0]._id } }, { session });
                const freelancer = yield User_1.default.findById(userId);
                yield Notification_1.default.create([
                    {
                        userId: clientId,
                        type: "proposal",
                        title: "New Job Proposal",
                        message: `A new proposal has been submitted for your job  by freelancer ${freelancer === null || freelancer === void 0 ? void 0 : freelancer.fullName}.`,
                        content: `Proposal ID: ${result[0]._id}`,
                        isRead: false,
                        actionLink: `/client-dashboard/jobs/${result[0]._id}/proposals`, // Adjust actionLink as needed
                        metadata: {
                            jobId: proposalData.jobId,
                            proposalId: result[0]._id,
                            freelancerId: userId,
                        },
                    },
                ], { session });
                yield session.commitTransaction();
                return {
                    success: true,
                    message: "Job proposal submitted successfully",
                    proposalId: result[0]._id,
                };
            }
            catch (error) {
                yield session.abortTransaction();
                console.error("Database operation failed:", error);
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    findProposalDetails(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposal = yield Projects_1.default.findById(jobId);
            return proposal;
        });
    }
    findFreelancerData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const freelancer = yield User_1.default.findById(userId);
            return freelancer;
        });
    }
    findProposalById(proposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const proposalDetails = yield Proposal_1.default.findById(proposalId)
                .select("status estimatedTime bidAmount budgetType coverLetter milestones freelancerId jobId createdAt")
                .populate({
                path: "freelancerId",
                select: "-password -refreshToken",
            })
                .populate({
                path: "jobId",
            })
                .lean();
            return {
                proposal_id: proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails._id,
                status: proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.status,
                timeline: proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.estimatedTime,
                bidAmount: proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.bidAmount,
                bidType: proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.budgetType,
                coverLetter: proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.coverLetter,
                milestones: (proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.milestones) || [],
                freelancerId: (_a = proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.freelancerId) === null || _a === void 0 ? void 0 : _a._id,
                freelancerName: (_b = proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.freelancerId) === null || _b === void 0 ? void 0 : _b.fullName,
                freelancerEmail: (_c = proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.freelancerId) === null || _c === void 0 ? void 0 : _c.email,
                jobTitle: (_d = proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.jobId) === null || _d === void 0 ? void 0 : _d.title,
                clientId: (_e = proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.jobId) === null || _e === void 0 ? void 0 : _e.clientId,
                submittedAt: proposalDetails === null || proposalDetails === void 0 ? void 0 : proposalDetails.createdAt,
            };
        });
    }
    findFreelancerById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const freelancerDetails = yield FreelancerProfile_1.default.findOne({
                userId: userId,
            }, { profilePic: 1, skills: 1 });
            return freelancerDetails;
        });
    }
    findActiveProject(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allProjects = yield Projects_1.default.find({ hiredFreelancer: userId }, {
                contractId: 1,
                budget: 1,
                budgetType: 1,
                time: 1,
                status: 1,
                title: 1,
                description: 1,
            }).lean();
            return allProjects;
        });
    }
    getProjectAllInformation(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(jobId)) {
                throw new Error("Invalid Job ID format");
            }
            try {
                const project = yield Projects_1.default.findById(jobId).lean();
                const client = yield User_1.default.findById(project === null || project === void 0 ? void 0 : project.clientId, {
                    fullName: 1,
                    email: 1,
                }).lean();
                const result = {
                    jobId: project === null || project === void 0 ? void 0 : project._id,
                    title: project === null || project === void 0 ? void 0 : project.title,
                    description: project === null || project === void 0 ? void 0 : project.description,
                    stack: project === null || project === void 0 ? void 0 : project.stack,
                    time: project === null || project === void 0 ? void 0 : project.time,
                    reference: project === null || project === void 0 ? void 0 : project.reference,
                    requiredFeatures: project === null || project === void 0 ? void 0 : project.requiredFeatures,
                    hiredFreelancer: project === null || project === void 0 ? void 0 : project.hiredFreelancer,
                    hiredProposalId: project === null || project === void 0 ? void 0 : project.hiredProposalId,
                    paymentStatus: project === null || project === void 0 ? void 0 : project.paymentStatus,
                    budgetType: project === null || project === void 0 ? void 0 : project.budgetType,
                    budget: project === null || project === void 0 ? void 0 : project.budget,
                    clientId: client === null || client === void 0 ? void 0 : client._id,
                    clientEmail: client === null || client === void 0 ? void 0 : client.email,
                    clientFullName: client === null || client === void 0 ? void 0 : client.fullName,
                };
                return result;
            }
            catch (error) {
                console.error(`[findProjectDetails] DB error for job ${jobId}:`, error);
                throw error;
            }
        });
    }
    ProposalAllInfo(proposal_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposal = yield Proposal_1.default.findById(proposal_id, {
                _id: 1,
                coverLetter: 1,
                milestones: 1,
                bidAmount: 1,
                budgetType: 1,
                estimatedTime: 1,
                status: 1,
                contractId: 1,
                payments: 1,
                createdAt: 1,
                updatedAt: 1,
            });
            return proposal;
        });
    }
    submitMilestoneRepo(jobId, userId, milestoneId, comments, links, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposal = yield Proposal_1.default.findOne({
                jobId,
                freelancerId: userId,
            }).session(session);
            if (!proposal) {
                throw new Error("Proposal not found");
            }
            const result = yield Proposal_1.default.findOneAndUpdate({ jobId, "milestones._id": milestoneId }, {
                $set: {
                    "milestones.$.deliverables": {
                        links: links || [],
                        comments: comments || "",
                        submittedAt: new Date(),
                    },
                    "milestones.$.status": "submitted",
                },
            }, { new: true, session });
            if (!result) {
                throw new Error("Milestone not found");
            }
            return result;
        });
    }
    submitFeedbackRepo(_a) {
        return __awaiter(this, arguments, void 0, function* ({ ratings, feedback, overallRating, jobId, toUser, fromUser, feedbackType, }) {
            const result = yield feedbackSchema_1.default.create({
                ratings: ratings,
                feedback,
                overallRating,
                jobId,
                toUser,
                fromUser,
                feedbackType,
            });
            return result;
        });
    }
    findFeedbackRepo(toUser, feedbackType) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedbacks = yield feedbackSchema_1.default.find({ toUser, feedbackType });
            return feedbacks;
        });
    }
    findUserAndUpdateFeedback(toUser, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedbacks = yield User_1.default.findByIdAndUpdate(toUser, {
                $set: Object.assign({}, updateData),
            });
            return feedbacks;
        });
    }
    submitFreelacerReportRepo(reportData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientId, clientEmail, title, description, userId, jobId } = reportData;
                const report = yield ReportModel_1.default.create({
                    client: {
                        id: clientId,
                        email: clientEmail,
                    },
                    title,
                    description,
                    reportedBy: userId,
                    status: "open",
                    jobId,
                });
                return report;
            }
            catch (error) {
                console.error("Error in submitFreelancerReport:", error);
                throw new Error("Failed to submit report");
            }
        });
    }
}
exports.marketPlaceRepo = marketPlaceRepo;
//# sourceMappingURL=marketPlaceRepo.js.map