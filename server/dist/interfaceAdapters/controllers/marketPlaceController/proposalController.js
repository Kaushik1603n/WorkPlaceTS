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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalController = void 0;
const proposalUseCase_1 = require("../../../useCase/proposalUseCase");
const proposalRepo_1 = require("../../../infrastructure/repositories/implementations/marketPlace/proposalRepo");
const proposal = new proposalRepo_1.ProposalRepo();
const proposalCase = new proposalUseCase_1.ProposalUseCase(proposal);
class ProposalController {
    constructor() {
        Object.defineProperty(this, "hireRequest", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    const proposalId = req.params.proposalId;
                    if (!userId) {
                        res.status(401).json({ message: "user not authenticated" });
                        return;
                    }
                    if (!proposalId) {
                        res
                            .status(400)
                            .json({ success: false, message: "Proposal ID is required" });
                        return;
                    }
                    const io = req.app.get("io");
                    const connectedUsers = req.app.get("connectedUsers");
                    yield proposalCase.hireRequestUseCase(userId, proposalId, io, connectedUsers);
                    res.status(200).json({
                        success: true,
                        message: "Hire request processed successfully",
                    });
                }
                catch (error) {
                    console.error("Hire request error:", error);
                    const statusCode = error instanceof Error && error.message.includes("not found")
                        ? 404
                        : 500;
                    const errorMessage = error instanceof Error
                        ? error.message
                        : "Failed to process hire request";
                    res.status(statusCode).json({
                        success: false,
                        error: errorMessage,
                    });
                }
            })
        });
        Object.defineProperty(this, "getAllFreelancerProposals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res.status(401).json({ message: "user not authenticated" });
                        return;
                    }
                    const proposals = yield proposalCase.getAllFreelancerProposalsUseCase(userId);
                    res.status(200).json({
                        message: "Proposals fetched successfully",
                        data: proposals,
                    });
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to get proposal",
                    });
                }
            })
        });
        Object.defineProperty(this, "getAllPropjectProposals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    const jobId = req.params.id;
                    if (!jobId) {
                        res.status(401).json({ message: "jobId Require" });
                        return;
                    }
                    if (!userId) {
                        res.status(401).json({ message: "user not authenticated" });
                        return;
                    }
                    const proposals = yield proposalCase.getAllProjectProposalsUseCase(jobId);
                    res.status(200).json({
                        message: "Proposals fetched successfully",
                        data: proposals,
                    });
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to get proposal",
                    });
                }
            })
        });
        Object.defineProperty(this, "getContractDetails", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    const contractId = req.params.id;
                    if (!userId) {
                        res.status(401).json({ message: "user not authenticated" });
                        return;
                    }
                    const contractDetails = yield proposalCase.getContractDetailsUseCase(contractId);
                    res.status(200).json({
                        message: "Proposals fetched successfully",
                        data: contractDetails,
                    });
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to get proposal",
                    });
                }
            })
        });
        Object.defineProperty(this, "acceptProposalcontract", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    const contractId = req.params.id;
                    if (!userId) {
                        res.status(401).json({ message: "user not authenticated" });
                        return;
                    }
                    const io = req.app.get("io");
                    const connectedUsers = req.app.get("connectedUsers");
                    const contractDetails = yield proposalCase.acceptProposalUseCase(userId, contractId, io, connectedUsers);
                    res.status(200).json({
                        message: "Proposals fetched successfully",
                        data: contractDetails,
                    });
                }
                catch (error) {
                    console.error("Accept proposal contract error:", error);
                    const statusCode = error instanceof Error && error.message.includes("not found")
                        ? 404
                        : 500;
                    const errorMessage = error instanceof Error ? error.message : "Failed to get proposal";
                    res.status(statusCode).json({
                        success: false,
                        error: errorMessage,
                    });
                }
            })
        });
        Object.defineProperty(this, "rejectProposalcontract", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    const contractId = req.params.id;
                    const contractDetails = yield proposalCase.rejectProposalUseCase(userId, contractId);
                    res.status(200).json({
                        message: "Proposals fetched successfully",
                        data: contractDetails,
                    });
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to get proposal",
                    });
                }
            })
        });
        Object.defineProperty(this, "proposalMilestones", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    const jobId = req.params.jobId;
                    if (!userId) {
                        throw new Error("User Not Authenticated");
                    }
                    const data = yield proposalCase.proposalMilestonesUseCase(jobId);
                    res.status(200).json({
                        message: "Proposals fetched successfully",
                        data: data,
                    });
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to get proposal",
                    });
                }
            })
        });
        Object.defineProperty(this, "proposalMilestonesApprove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    const milestoneId = req.params.milestoneId;
                    if (!userId) {
                        throw new Error("User Not Authenticated");
                    }
                    const io = req.app.get("io");
                    const connectedUsers = req.app.get("connectedUsers");
                    const data = yield proposalCase.proposalMilestonesApproveUseCase(milestoneId, userId, io, connectedUsers);
                    res.status(200).json({
                        message: "Proposals fetched successfully",
                        data: data,
                    });
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to get proposal",
                    });
                }
            })
        });
        Object.defineProperty(this, "proposalMilestonesReject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    const milestoneId = req.params.milestoneId;
                    if (!userId) {
                        throw new Error("User Not Authenticated");
                    }
                    const data = yield proposalCase.proposalMilestonesRejectUseCase(milestoneId);
                    res.status(200).json({
                        message: "Proposals fetched successfully",
                        data: data,
                    });
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to get proposal",
                    });
                }
            })
        });
        Object.defineProperty(this, "pendingPaments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        throw new Error("User Not Authenticated");
                    }
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 5;
                    const { data, totalPages, totalCount, totalAmount, netAmount, platformFee, pendingAmount } = yield proposalCase.pendingPamentsUseCase(userId, page, limit);
                    res.status(200).json({
                        message: "Proposals fetched successfully",
                        data: data,
                        totalPages,
                        totalCount,
                        totalAmount,
                        netAmount,
                        platformFee,
                        pendingAmount
                    });
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to get proposal",
                    });
                }
            })
        });
        // milestonePayment: RequestHandler = async (req, res): Promise<void> => {
        //   try {
        //     const { amount, receipt } = req.body;
        //     const options = {
        //       amount: amount * 100, // Razorpay expects amount in paise (multiply by 100 for INR)
        //       currency: "INR",
        //       receipt: receipt,
        //       payment_capture: 1,
        //     };
        //     const order = await createOrder(options);
        //     // if (!userId) {
        //     //   throw new Error("User Not Authenticated");
        //     // }
        //     res.status(200).json({
        //       message: "Proposals fetched successfully",
        //       data: order
        //     });
        //   } catch (error) {
        //     console.error(error);
        //     res.status(500).json({
        //       success: false,
        //       error:
        //         error instanceof Error ? error.message : "Failed to get proposal",
        //     });
        //   }
        // };
    }
}
exports.ProposalController = ProposalController;
//# sourceMappingURL=proposalController.js.map