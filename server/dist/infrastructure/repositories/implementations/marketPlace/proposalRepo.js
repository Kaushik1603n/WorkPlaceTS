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
exports.ProposalRepo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ContractModel_1 = __importDefault(require("../../../../domain/models/ContractModel"));
const Proposal_1 = __importDefault(require("../../../../domain/models/Proposal"));
const Projects_1 = __importDefault(require("../../../../domain/models/Projects"));
const PaymentRequest_1 = __importDefault(require("../../../../domain/models/PaymentRequest"));
class ProposalRepo {
    findProposalAndUpdateStatus(proposalId, contractId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Proposal_1.default.findByIdAndUpdate(proposalId, {
                    $set: { status: "accepted", contractId: contractId },
                }, { new: true, session }).lean();
            }
            catch (error) {
                console.error("Error updating proposal status:", error);
                throw new Error("Failed to update proposal status");
            }
        });
    }
    findProposalById(proposalId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                const getProposal = yield Proposal_1.default.findById(proposalId)
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
                    proposal_id: getProposal === null || getProposal === void 0 ? void 0 : getProposal._id,
                    status: getProposal === null || getProposal === void 0 ? void 0 : getProposal.status,
                    timeline: getProposal === null || getProposal === void 0 ? void 0 : getProposal.estimatedTime,
                    bidAmount: getProposal === null || getProposal === void 0 ? void 0 : getProposal.bidAmount,
                    bidType: getProposal === null || getProposal === void 0 ? void 0 : getProposal.budgetType,
                    coverLetter: getProposal === null || getProposal === void 0 ? void 0 : getProposal.coverLetter,
                    milestones: (getProposal === null || getProposal === void 0 ? void 0 : getProposal.milestones) || [],
                    freelancerId: (_a = getProposal === null || getProposal === void 0 ? void 0 : getProposal.freelancerId) === null || _a === void 0 ? void 0 : _a._id,
                    freelancerName: (_b = getProposal === null || getProposal === void 0 ? void 0 : getProposal.freelancerId) === null || _b === void 0 ? void 0 : _b.fullName,
                    freelancerEmail: (_c = getProposal === null || getProposal === void 0 ? void 0 : getProposal.freelancerId) === null || _c === void 0 ? void 0 : _c.email,
                    jobId: (_d = getProposal === null || getProposal === void 0 ? void 0 : getProposal.jobId) === null || _d === void 0 ? void 0 : _d._id,
                    job_Id: (_e = getProposal === null || getProposal === void 0 ? void 0 : getProposal.jobId) === null || _e === void 0 ? void 0 : _e.job_Id,
                    jobTitle: (_f = getProposal === null || getProposal === void 0 ? void 0 : getProposal.jobId) === null || _f === void 0 ? void 0 : _f.title,
                    clientId: (_g = getProposal === null || getProposal === void 0 ? void 0 : getProposal.jobId) === null || _g === void 0 ? void 0 : _g.clientId,
                    submittedAt: getProposal === null || getProposal === void 0 ? void 0 : getProposal.createdAt,
                };
            }
            catch (error) {
                console.error("Error finding proposal by ID:", error);
                throw new Error("Failed to find proposal");
            }
        });
    }
    createProposalContract(contract, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ContractModel_1.default.create([contract], { session });
            }
            catch (error) {
                console.error("Error creating contract:", error);
                throw new Error("Failed to create contract");
            }
        });
    }
    getProposalbyId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const proposals = yield Proposal_1.default.find({ freelancerId: userId })
                    .populate({
                    path: "jobId",
                    select: "title budgetType budget status",
                })
                    .sort({ createdAt: -1 })
                    .lean();
                return proposals;
            }
            catch (error) {
                console.error("Error creating contract:", error);
                throw new Error("Failed to create contract");
            }
        });
    }
    getProjectProposalbyId(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allProposals = yield Proposal_1.default.find({ jobId: jobId }, {
                    _id: 1,
                    freelancerId: 1,
                    status: 1,
                    createdAt: 1,
                    bidAmount: 1,
                    jobId: 1, // Make sure to include jobId in the projection
                })
                    .populate({
                    path: "freelancerId",
                    select: "fullName email",
                })
                    .populate({
                    path: "jobId",
                    select: "title stack",
                })
                    .sort({ createdAt: -1 })
                    .lean();
                const formattedProposals = allProposals.map((proposal) => {
                    var _a, _b, _c;
                    return ({
                        proposal_id: proposal._id.toString(),
                        freelancerName: (_a = proposal.freelancerId) === null || _a === void 0 ? void 0 : _a.fullName,
                        freelancerEmail: (_b = proposal.freelancerId) === null || _b === void 0 ? void 0 : _b.email,
                        jobTitle: (_c = proposal.jobId) === null || _c === void 0 ? void 0 : _c.title,
                        status: proposal.status,
                        bidAmount: proposal.bidAmount,
                        submittedAt: new Date(proposal.createdAt).toLocaleString(),
                    });
                });
                return formattedProposals;
            }
            catch (error) {
                console.error("Error creating contract:", error);
                throw new Error("Failed to create contract");
            }
        });
    }
    getContractDetailsNormal(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contractDetails = yield ContractModel_1.default.findById(contractId).lean();
                if (!contractDetails) {
                    throw new Error("Contract not found");
                }
                return contractDetails;
            }
            catch (error) {
                console.error("Error fetching contract details:", error);
                throw new Error("Failed to fetch contract details");
            }
        });
    }
    getContractDetails(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contractDetails = yield ContractModel_1.default.findById(contractId).lean();
                if (!contractDetails) {
                    throw new Error("Contract not found");
                }
                return contractDetails;
            }
            catch (error) {
                console.error("Error fetching contract details:", error);
                throw new Error("Failed to fetch contract details");
            }
        });
    }
    getContractDetailsWithSession(contractId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contractDetails = yield ContractModel_1.default.findById(contractId)
                    .session(session)
                    .lean();
                if (!contractDetails) {
                    throw new Error("Contract not found");
                }
                return contractDetails;
            }
            catch (error) {
                console.error("Error fetching contract details:", error);
                throw new Error("Failed to fetch contract details");
            }
        });
    }
    getJobStatus(jobId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield Projects_1.default.findById(jobId, { status: 1 })
                    .session(session)
                    .lean();
                if (!status) {
                    throw new Error("Job not found");
                }
                return status;
            }
            catch (error) {
                console.error("Error creating contract:", error);
                throw new Error("Failed to create contract");
            }
        });
    }
    acceptProposalContract(userId, jobId, proposal_id, contractId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield Projects_1.default.findByIdAndUpdate(jobId, {
                    hiredProposalId: proposal_id,
                    status: "in-progress",
                    hiredFreelancer: userId,
                    contractId: contractId,
                }, { new: true, session });
                if (!job) {
                    throw new Error("Job not found");
                }
                const contract = yield ContractModel_1.default.findByIdAndUpdate(contractId, {
                    status: "in-progress",
                }, { new: true, session });
                if (!contract) {
                    throw new Error("Contract not found");
                }
                const proposal = yield Proposal_1.default.findByIdAndUpdate(proposal_id, {
                    status: "interviewing",
                }, { new: true, session });
                if (!proposal) {
                    throw new Error("Proposal not found");
                }
                return contract;
            }
            catch (error) {
                console.error("Error update contract accept status:", error);
                throw new Error("Failed to contract accept status");
            }
        });
    }
    rejectProposalContract(proposal_id, contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const contract = yield ContractModel_1.default.findByIdAndUpdate(contractId, {
                    status: "reject",
                }, { new: true, session });
                if (!contract) {
                    throw new Error("Contract not found");
                }
                const proposal = yield Proposal_1.default.findByIdAndUpdate(proposal_id, {
                    status: "rejected",
                }, { new: true, session });
                if (!proposal) {
                    throw new Error("Proposal not found");
                }
                yield session.commitTransaction();
                return contract;
            }
            catch (error) {
                yield session.abortTransaction();
                console.error("Error creating contract:", error);
                throw new Error("Failed to create contract");
            }
            finally {
                session.endSession();
            }
        });
    }
    proposalMilestones(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposal = yield Projects_1.default.findById(jobId, {
                _id: 1,
                status: 1,
                hiredFreelancer: 1,
                hiredProposalId: 1,
            })
                .populate({
                path: "hiredProposalId",
                select: "_id freelancerId milestones",
            })
                .lean();
            if (!proposal) {
                throw new Error("Proposal not found");
            }
            if (!proposal.hiredProposalId) {
                throw new Error("No hired proposal found");
            }
            return {
                _id: proposal.hiredProposalId._id,
                jobStatus: proposal === null || proposal === void 0 ? void 0 : proposal.status,
                freelancerId: proposal.hiredProposalId.freelancerId,
                milestones: proposal.hiredProposalId.milestones,
            };
        });
    }
    proposalMilestonesApprove(milestoneId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Proposal_1.default.findOneAndUpdate({ "milestones._id": milestoneId }, { $set: { "milestones.$.status": "approved" } }, { new: true, session }).lean();
        });
    }
    findProposal(milestoneId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const proposal = yield Proposal_1.default.findOne({ "milestones._id": milestoneId }, {
                jobId: 1,
                job_Id: 1,
                freelancerId: 1,
                milestones: { $elemMatch: { _id: milestoneId } },
            })
                .session(session)
                .lean();
            if (!proposal || !((_a = proposal.milestones) === null || _a === void 0 ? void 0 : _a.length))
                return null;
            const milestone = proposal.milestones[0];
            return {
                _id: proposal._id,
                freelancerId: proposal.freelancerId,
                jobId: proposal.jobId,
                job_Id: proposal.job_Id,
                milestoneId: milestone._id,
                title: milestone.title,
                description: milestone.description,
                amount: milestone.amount,
                dueDate: milestone.dueDate,
                status: milestone.status,
                deliverables: milestone.deliverables,
            };
        });
    }
    paymentRequest(jobId, freelancerId, proposalId, milestoneId, amount, clientId, status, platformFee, netAmount, session) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PaymentRequest_1.default.create([
                {
                    jobId,
                    proposalId,
                    milestoneId,
                    amount,
                    platformFee,
                    netAmount,
                    status,
                    freelancerId,
                    clientId,
                },
            ], { session });
        });
    }
    updatePaymentID(milestoneId, paymentRequestId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Proposal_1.default.findOneAndUpdate({ "milestones._id": milestoneId }, { $set: { "milestones.$.paymentRequestId": paymentRequestId } }, { session });
        });
    }
    proposalMilestonesReject(milestoneId) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposal = yield Proposal_1.default.findOneAndUpdate({ "milestones._id": milestoneId }, { $set: { "milestones.$.status": "rejected" } }, { new: true });
            return proposal;
        });
    }
    findPayment(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const data = yield PaymentRequest_1.default.find({
                clientId: userId,
            })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();
            const totalCount = yield PaymentRequest_1.default.countDocuments({
                clientId: userId,
            });
            const totalPages = Math.ceil(totalCount / limit);
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            const totalAmount = yield PaymentRequest_1.default.aggregate([
                {
                    $match: {
                        clientId: objectId,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount" },
                    },
                },
            ]);
            const netAmount = yield PaymentRequest_1.default.aggregate([
                {
                    $match: {
                        clientId: objectId,
                    },
                },
                {
                    $group: {
                        _id: null,
                        netAmount: { $sum: "$netAmount" },
                    },
                },
            ]);
            const platformFee = yield PaymentRequest_1.default.aggregate([
                {
                    $match: {
                        clientId: objectId,
                    },
                },
                {
                    $group: {
                        _id: null,
                        platformFee: { $sum: "$platformFee" },
                    },
                },
            ]);
            const pendingAmount = yield PaymentRequest_1.default.aggregate([
                {
                    $match: {
                        clientId: objectId,
                        status: "pending"
                    },
                },
                {
                    $group: {
                        _id: null,
                        pendingAmount: { $sum: "$amount" },
                    },
                },
            ]);
            return {
                data,
                totalPages,
                totalCount,
                totalAmount: ((_a = totalAmount[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0,
                netAmount: ((_b = netAmount[0]) === null || _b === void 0 ? void 0 : _b.netAmount) || 0,
                platformFee: ((_c = platformFee[0]) === null || _c === void 0 ? void 0 : _c.platformFee) || 0,
                pendingAmount: ((_d = pendingAmount[0]) === null || _d === void 0 ? void 0 : _d.pendingAmount) || 0,
            };
        });
    }
}
exports.ProposalRepo = ProposalRepo;
//# sourceMappingURL=proposalRepo.js.map