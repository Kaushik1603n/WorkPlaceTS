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
exports.ProposalUseCase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../domain/models/User"));
const Notification_1 = __importDefault(require("../domain/models/Notification"));
const Projects_1 = __importDefault(require("../domain/models/Projects"));
class ProposalUseCase {
    constructor(proposal) {
        Object.defineProperty(this, "proposal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: proposal
        });
        this.proposal = proposal;
    }
    hireRequestUseCase(userId, proposalId, io, connectedUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                if (!userId || !proposalId) {
                    throw new Error("Credentials missing");
                }
                const proposal = yield this.proposal.findProposalById(proposalId);
                if (!proposal) {
                    throw new Error("Proposal not found");
                }
                if (((_a = proposal === null || proposal === void 0 ? void 0 : proposal.clientId) === null || _a === void 0 ? void 0 : _a.toString()) !== userId.toString()) {
                    throw new Error("Not authorized to hire for this job");
                }
                if ((proposal === null || proposal === void 0 ? void 0 : proposal.status) !== "submitted" &&
                    (proposal === null || proposal === void 0 ? void 0 : proposal.status) !== "interviewing") {
                    throw new Error("Proposal cannot be hired in its current state");
                }
                const contract = {
                    jobId: proposal === null || proposal === void 0 ? void 0 : proposal.jobId,
                    job_Id: (proposal === null || proposal === void 0 ? void 0 : proposal.job_Id) || new Date(),
                    proposalId: proposalId,
                    clientId: userId,
                    freelancerId: proposal === null || proposal === void 0 ? void 0 : proposal.freelancerId,
                    terms: generateDefaultContractTerms(proposal),
                    title: proposal === null || proposal === void 0 ? void 0 : proposal.jobTitle,
                    startDate: new Date(),
                    totalAmount: proposal === null || proposal === void 0 ? void 0 : proposal.bidAmount,
                    paymentSchedule: (proposal === null || proposal === void 0 ? void 0 : proposal.milestones.length) > 0 ? "milestone" : "completion",
                };
                const contractDetails = yield this.proposal.createProposalContract(contract, session);
                if (!contractDetails[0]) {
                    throw new Error("Contract not generated");
                }
                yield this.proposal.findProposalAndUpdateStatus(proposalId, (_b = contractDetails[0]) === null || _b === void 0 ? void 0 : _b._id, session);
                const client = yield User_1.default.findById(userId).session(session);
                yield Notification_1.default.create([
                    {
                        userId: proposal.freelancerId,
                        type: "contract",
                        title: "Proposal Accepted",
                        message: `Your proposal for the job "${proposal.jobTitle}" has been accepted by ${client === null || client === void 0 ? void 0 : client.fullName}.`,
                        content: `Contract ID: ${contractDetails._id}`,
                        isRead: false,
                        actionLink: `/freelancer-dashboard/proposals`,
                        metadata: {
                            jobId: proposal.jobId,
                            proposalId: proposalId,
                            contractId: contractDetails._id,
                            clientId: userId,
                        },
                        createdAt: new Date(),
                    },
                ], { session });
                const freelancerSocketId = connectedUsers[proposal.freelancerId.toString()];
                if (freelancerSocketId) {
                    io.to(freelancerSocketId).emit("notification", {
                        _id: contractDetails._id,
                        userId: proposal.freelancerId.toString(),
                        type: "contract",
                        title: "Proposal Accepted",
                        message: `Your proposal for the job "${proposal.jobTitle}" has been accepted by ${client === null || client === void 0 ? void 0 : client.fullName}.`,
                        content: `Contract ID: ${contractDetails._id}`,
                        isRead: false,
                        actionLink: `/freelancer-dashboard/proposals`,
                        metadata: {
                            jobId: proposal.jobId,
                            proposalId: proposalId,
                            contractId: contractDetails._id,
                            clientId: userId,
                        },
                        createdAt: new Date().toISOString(),
                    });
                }
                else {
                    console.error(`Freelancer ${proposal.freelancerId} is not connected`);
                }
                yield session.commitTransaction();
                return;
            }
            catch (error) {
                yield session.abortTransaction();
                console.error(`creating proposal usecase error`, error);
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    getAllFreelancerProposalsUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllProposals = yield this.proposal.getProposalbyId(userId);
                // if (!getAllProposals || getAllProposals?.length) {
                //   return { message: "No proposals found" }
                // }
                return getAllProposals;
            }
            catch (error) {
                console.error(`proposal usecase error`, error);
                throw error;
            }
        });
    }
    getAllProjectProposalsUseCase(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllProposals = yield this.proposal.getProjectProposalbyId(jobId);
                return getAllProposals;
            }
            catch (error) {
                console.error(`proposal usecase error`, error);
                throw error;
            }
        });
    }
    getContractDetailsUseCase(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contractDetails = yield this.proposal.getContractDetailsNormal(contractId);
                return contractDetails;
            }
            catch (error) {
                console.error(`proposal usecase error`, error);
                throw error;
            }
        });
    }
    acceptProposalUseCase(userId, contractId, io, connectedUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const contractDetails = yield this.proposal.getContractDetailsWithSession(contractId, session);
                const proposal_id = (contractDetails === null || contractDetails === void 0 ? void 0 : contractDetails.proposalId)
                    ? contractDetails === null || contractDetails === void 0 ? void 0 : contractDetails.proposalId
                    : "";
                if ((contractDetails === null || contractDetails === void 0 ? void 0 : contractDetails.freelancerId.toString()) !== userId.toString() ||
                    (contractDetails === null || contractDetails === void 0 ? void 0 : contractDetails.status) === "reject") {
                    throw new Error("You cannot accept this proposal");
                }
                const jobId = (contractDetails === null || contractDetails === void 0 ? void 0 : contractDetails.jobId) ? contractDetails.jobId : "";
                const jobStatus = yield this.proposal.getJobStatus(jobId, session);
                if ((jobStatus === null || jobStatus === void 0 ? void 0 : jobStatus.status) !== "posted" && (jobStatus === null || jobStatus === void 0 ? void 0 : jobStatus.status) !== "draft") {
                    throw new Error("Cannot Accept this Contract");
                }
                const contract = yield this.proposal.acceptProposalContract(userId, jobId, proposal_id, contractId, session);
                // Fetch freelancer data for notification
                const freelancer = yield User_1.default.findById(userId).session(session);
                // Create notification in database
                yield Notification_1.default.create([
                    {
                        userId: contractDetails.clientId,
                        type: "contract",
                        title: "Contract Accepted",
                        message: `Freelancer ${freelancer === null || freelancer === void 0 ? void 0 : freelancer.fullName} has accepted the contract for your job "${contractDetails.title}".`,
                        content: `Contract ID: ${contractId}`,
                        isRead: false,
                        actionLink: `/client-dashboard/active-project`,
                        metadata: {
                            jobId: jobId,
                            proposalId: proposal_id,
                            contractId: contractId,
                            freelancerId: userId,
                        },
                        createdAt: new Date(),
                    },
                ], { session });
                // Emit real-time Socket.IO notification
                const clientSocketId = connectedUsers[contractDetails.clientId.toString()];
                if (clientSocketId) {
                    io.to(clientSocketId).emit("notification", {
                        _id: contractId,
                        userId: contractDetails.clientId.toString(),
                        type: "contract",
                        title: "Contract Accepted",
                        message: `Freelancer ${freelancer === null || freelancer === void 0 ? void 0 : freelancer.fullName} has accepted the contract for your job "${contractDetails.title}".`,
                        content: `Contract ID: ${contractId}`,
                        isRead: false,
                        actionLink: `/client-dashboard/active-project`,
                        metadata: {
                            jobId: jobId,
                            proposalId: proposal_id,
                            contractId: contractId,
                            freelancerId: userId,
                        },
                        createdAt: new Date().toISOString(),
                    });
                }
                else {
                    console.error(`Client ${contractDetails.clientId} is not connected`);
                }
                yield session.commitTransaction();
                return contract;
            }
            catch (error) {
                yield session.abortTransaction();
                console.error(`proposal usecase error`, error);
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    rejectProposalUseCase(userId, contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contractDetails = yield this.proposal.getContractDetails(contractId);
                const proposal_id = (contractDetails === null || contractDetails === void 0 ? void 0 : contractDetails.proposalId)
                    ? contractDetails === null || contractDetails === void 0 ? void 0 : contractDetails.proposalId
                    : "";
                if ((contractDetails === null || contractDetails === void 0 ? void 0 : contractDetails.freelancerId.toString()) !== userId.toString()) {
                    throw new Error("You cannot reject this proposal");
                }
                const contract = yield this.proposal.rejectProposalContract(proposal_id, contractId);
                return contract;
            }
            catch (error) {
                console.error(`proposal usecase error`, error);
                throw error;
            }
        });
    }
    proposalMilestonesUseCase(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.proposal.proposalMilestones(jobId);
                return data;
            }
            catch (error) {
                console.error(`proposal usecase error`, error);
                throw error;
            }
        });
    }
    proposalMilestonesApproveUseCase(milestoneId, userId, io, connectedUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const proposalApprove = yield this.proposal.proposalMilestonesApprove(milestoneId, session);
                if (!proposalApprove)
                    throw new Error("Milestone not found");
                const proposal = yield this.proposal.findProposal(milestoneId, session);
                if (!proposal)
                    throw new Error("Proposal not found");
                const platformFee = (proposal.amount / 100) * 10;
                const netAmount = proposal.amount - platformFee;
                const paymentRequest = yield this.proposal.paymentRequest(proposal.jobId, proposal.freelancerId, proposal._id, milestoneId, proposal.amount, userId, "pending", platformFee, netAmount, session);
                yield this.proposal.updatePaymentID(milestoneId, paymentRequest[0]._id, session);
                // Fetch job and client data for notification
                const job = yield Projects_1.default.findById(proposal.jobId).session(session);
                const client = yield User_1.default.findById(userId).session(session);
                if (!job || !client) {
                    throw new Error("Job or client not found");
                }
                // Create notification in database
                yield Notification_1.default.create([
                    {
                        userId: proposal.freelancerId,
                        type: "milestone",
                        title: "Milestone Approved",
                        message: `Client ${client.fullName} has approved your milestone for the job "${job.title}".`,
                        content: `Milestone ID: ${milestoneId}`,
                        isRead: false,
                        actionLink: `/freelancer-dashboard`,
                        metadata: {
                            jobId: proposal.jobId,
                            milestoneId: milestoneId,
                            proposalId: proposal._id,
                            clientId: userId,
                        },
                        createdAt: new Date(),
                    },
                ], { session });
                // Emit real-time Socket.IO notification
                const freelancerSocketId = connectedUsers[proposal.freelancerId.toString()];
                if (freelancerSocketId) {
                    io.to(freelancerSocketId).emit("notification", {
                        _id: milestoneId,
                        userId: proposal.freelancerId.toString(),
                        type: "milestone",
                        title: "Milestone Approved",
                        message: `Client ${client.fullName} has approved your milestone for the job "${job.title}".`,
                        content: `Milestone ID: ${milestoneId}`,
                        isRead: false,
                        actionLink: `/freelancer-dashboard`,
                        metadata: {
                            jobId: proposal.jobId,
                            milestoneId: milestoneId,
                            proposalId: proposal._id,
                            clientId: userId,
                        },
                        createdAt: new Date().toISOString(),
                    });
                }
                else {
                    console.error(`Freelancer ${proposal.freelancerId} is not connected`);
                }
                yield session.commitTransaction();
                return proposalApprove;
            }
            catch (error) {
                yield session.abortTransaction();
                session.endSession();
                console.error(`Proposal usecase error`, error);
                throw error;
            }
        });
    }
    proposalMilestonesRejectUseCase(milestoneId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const proposal = yield this.proposal.proposalMilestonesReject(milestoneId);
                if (!proposal) {
                    throw new Error("Milestone not found");
                }
                return proposal;
            }
            catch (error) {
                console.error(`proposal usecase error`, error);
                throw error;
            }
        });
    }
    pendingPamentsUseCase(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.proposal.findPayment(userId, page, limit);
            return data;
        });
    }
}
exports.ProposalUseCase = ProposalUseCase;
const generateDefaultContractTerms = (proposal) => {
    const terms = [
        `The freelancer will complete the work as described in proposal ${proposal === null || proposal === void 0 ? void 0 : proposal.proposal_id}`,
        `The total contract amount is ${proposal.bidAmount} ${(proposal === null || proposal === void 0 ? void 0 : proposal.bidType) === "hourly" ? "per hour" : ""}`,
        "All work will be completed to professional standards",
        "Any disputes will be resolved through the platform mediation process",
    ];
    if (proposal.milestones.length > 0) {
        terms.push("Payment will be released upon completion of each milestone:");
        proposal.milestones.forEach((milestone, index) => {
            terms.push(`${index + 1}. ${milestone === null || milestone === void 0 ? void 0 : milestone.title} - ${milestone === null || milestone === void 0 ? void 0 : milestone.amount}`);
        });
    }
    return terms.join("\n\n");
};
//# sourceMappingURL=proposalUseCase.js.map