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
exports.MarketPlaceProjectController = void 0;
const MarketPlaceUseCase_1 = require("../../../useCase/MarketPlaceUseCase");
const marketPlaceRepo_1 = require("../../../infrastructure/repositories/implementations/marketPlace/marketPlaceRepo");
const marketRepo = new marketPlaceRepo_1.marketPlaceRepo();
const marketPlace = new MarketPlaceUseCase_1.MarketPlaceUseCase(marketRepo);
class MarketPlaceProjectController {
    constructor() {
        Object.defineProperty(this, "getAllMarketProjects", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { search = "", minPrice = 0, maxPrice = 10000, jobTypes = "", skills = "", experienceLevel = "", } = req.query;
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 5;
                    const { result, pagination } = yield marketPlace.getAllProjectDetails({
                        search,
                        minPrice,
                        maxPrice,
                        jobTypes,
                        skills,
                        experienceLevel,
                        page,
                        limit,
                    });
                    res.status(200).json({ success: true, data: result, pagination });
                }
                catch (error) {
                    console.error(error);
                    res
                        .status(500)
                        .json({ success: false, error: "Failed to fetch projects" });
                }
            })
        });
        Object.defineProperty(this, "activeClientProject", {
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
                    const result = yield marketPlace.getActiveProjectUseCase(userId);
                    if (!result) {
                        res.status(404).json({
                            success: false,
                            error: "Job not found",
                        });
                        return;
                    }
                    res.status(200).json({ success: true, data: result });
                }
                catch (error) {
                    console.error("Job details fetch error:", error);
                    const errorMessage = error instanceof Error ? error.message : "Failed to fetch job details";
                    res.status(500).json({
                        success: false,
                        error: errorMessage,
                    });
                }
            })
        });
        Object.defineProperty(this, "pendingClientProject", {
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
                    const result = yield marketPlace.getPendingProjectUseCase(userId);
                    if (!result) {
                        res.status(404).json({
                            success: false,
                            error: "Job not found",
                        });
                        return;
                    }
                    res.status(200).json({ success: true, data: result });
                }
                catch (error) {
                    console.error("Job details fetch error:", error);
                    const errorMessage = error instanceof Error ? error.message : "Failed to fetch job details";
                    res.status(500).json({
                        success: false,
                        error: errorMessage,
                    });
                }
            })
        });
        Object.defineProperty(this, "completedClientProject", {
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
                    const result = yield marketPlace.getCompletedProjectUseCase(userId);
                    if (!result) {
                        res.status(404).json({
                            success: false,
                            error: "Job not found",
                        });
                        return;
                    }
                    res.status(200).json({ success: true, data: result });
                }
                catch (error) {
                    console.error("Job details fetch error:", error);
                    const errorMessage = error instanceof Error ? error.message : "Failed to fetch job details";
                    res.status(500).json({
                        success: false,
                        error: errorMessage,
                    });
                }
            })
        });
        Object.defineProperty(this, "getProjectDetails", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { jobId } = req.params;
                    if (!jobId) {
                        res.status(400).json({
                            success: false,
                            error: "Job ID is required",
                        });
                        return;
                    }
                    const result = yield marketPlace.getProjectDetails(jobId);
                    if (!result) {
                        res.status(404).json({
                            success: false,
                            error: "Job not found",
                        });
                        return;
                    }
                    res.status(200).json({ success: true, data: result });
                }
                catch (error) {
                    console.error("Job details fetch error:", error);
                    const errorMessage = error instanceof Error ? error.message : "Failed to fetch job details";
                    res.status(500).json({
                        success: false,
                        error: errorMessage,
                    });
                }
            })
        });
        Object.defineProperty(this, "jobProposal", {
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
                    const proposalData = req.body;
                    if (!proposalData.agreeNDA ||
                        !proposalData.agreeVideoCall ||
                        !proposalData.coverLetter ||
                        !proposalData.bidAmount ||
                        !proposalData.timeline ||
                        !proposalData.workSamples ||
                        !proposalData.milestones ||
                        !proposalData.bidType ||
                        !proposalData.jobId) {
                        throw new Error("All Field are Require");
                    }
                    // Emit Socket.IO notification
                    const io = req.app.get("io");
                    const connectedUsers = req.app.get("connectedUsers");
                    const result = yield marketPlace.jobProposalUseCase(proposalData, userId, io, connectedUsers);
                    if (!result) {
                        res.status(404).json({
                            success: false,
                            error: "Job not found",
                        });
                        return;
                    }
                    res.status(200).json({ success: true, message: "Proposal submitted" });
                }
                catch (error) {
                    console.error("Proposal submission error:", error);
                    const statusCode = error instanceof Error && error.message.includes("not found")
                        ? 404
                        : 500;
                    const errorMessage = error instanceof Error ? error.message : "Proposal submission failed";
                    res.status(statusCode).json({
                        success: false,
                        error: errorMessage,
                    });
                    return;
                }
            })
        });
        Object.defineProperty(this, "getProposalDetails", {
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
                    const result = yield marketPlace.getProposalDetailsUseCase(userId, proposalId);
                    res
                        .status(200)
                        .json({ success: true, message: "Proposal submitted", data: result });
                }
                catch (error) {
                    console.error("Proposal submission error:", error);
                    const statusCode = error instanceof Error && error.message.includes("not found")
                        ? 404
                        : 500;
                    const errorMessage = error instanceof Error ? error.message : "Proposal submission failed";
                    res.status(statusCode).json({
                        success: false,
                        error: errorMessage,
                    });
                    return;
                }
            })
        });
        Object.defineProperty(this, "getAllFreelacerJobs", {
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
                    const result = yield marketPlace.getAllJobDetailsUseCase(userId);
                    res
                        .status(200)
                        .json({ success: true, message: "Project Details", data: result });
                }
                catch (error) {
                    console.error("Project Details error:", error);
                    const statusCode = error instanceof Error && error.message.includes("not found")
                        ? 404
                        : 500;
                    const errorMessage = error instanceof Error ? error.message : "Project Details failed";
                    res.status(statusCode).json({
                        success: false,
                        error: errorMessage,
                    });
                    return;
                }
            })
        });
        Object.defineProperty(this, "getProjectAllInformation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { jobId } = req.params;
                    const user = req.user;
                    const userId = user.userId;
                    if (!jobId) {
                        res.status(400).json({
                            success: false,
                            error: "Job ID is required",
                        });
                        return;
                    }
                    const data = yield marketPlace.getProjectAllInformationUseCase(jobId, userId);
                    if (!data) {
                        res.status(404).json({
                            success: false,
                            error: "Job not found",
                        });
                        return;
                    }
                    res.status(200).json({ success: true, data });
                }
                catch (error) {
                    console.error("Job details fetch error:", error);
                    const errorMessage = error instanceof Error ? error.message : "Failed to fetch job details";
                    res.status(500).json({
                        success: false,
                        error: errorMessage,
                    });
                }
            })
        });
        Object.defineProperty(this, "submitMilestone", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { jobId } = req.params;
                    const user = req.user;
                    const userId = user.userId;
                    const { milestoneId, comments, links } = req.body;
                    if (!userId) {
                        throw new Error("user not Authenticated");
                    }
                    const io = req.app.get("io");
                    const connectedUsers = req.app.get("connectedUsers");
                    const data = yield marketPlace.submitMilestoneUseCase(jobId, userId, milestoneId, comments, links, io, connectedUsers);
                    if (!data) {
                        res.status(404).json({
                            success: false,
                            error: "Milestone not found",
                        });
                        return;
                    }
                    res.status(200).json({ success: true, data: "" });
                }
                catch (error) {
                    console.error("Job details fetch error:", error);
                    const errorMessage = error instanceof Error ? error.message : "Failed to fetch job details";
                    res.status(500).json({
                        success: false,
                        error: errorMessage,
                    });
                }
            })
        });
        Object.defineProperty(this, "submitFeedback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const userData = req.user;
                    const userId = userData.userId;
                    if (!userId) {
                        throw new Error("user not Authenticated");
                    }
                    const { ratings, feedback, overallRating, jobId, receverId, user, } = req.body;
                    if (!ratings || !overallRating || !jobId || !receverId) {
                        throw new Error("Missing required fields");
                    }
                    const feedbackType = user === "client" ? "client-to-freelancer" : "freelancer-to-client";
                    const feedbackData = {
                        ratings,
                        feedback,
                        overallRating,
                        jobId,
                        fromUser: userId,
                        toUser: receverId,
                        feedbackType,
                    };
                    const data = yield marketPlace.submitFeedbackCase(feedbackData);
                    res.status(200).json({ success: true, data });
                }
                catch (error) {
                    console.error("Feedback submission error:", error);
                    res.status(500).json({
                        success: false,
                        error: "Failed to submit feedback",
                    });
                }
            })
        });
        Object.defineProperty(this, "freelacerReport", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        throw new Error("user not Authenticated");
                    }
                    const { clientId, clientEmail, title, description, jobId } = req.body;
                    const reportData = {
                        clientId,
                        clientEmail,
                        title,
                        description,
                        userId,
                        jobId,
                    };
                    const data = yield marketPlace.submitFreelacerReportUseCase(reportData);
                    res.status(200).json({ success: true, data });
                }
                catch (error) {
                    console.error("Report submission error:", error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to submit report",
                    });
                }
            })
        });
    }
}
exports.MarketPlaceProjectController = MarketPlaceProjectController;
//# sourceMappingURL=marketProjectController.js.map