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
exports.freelancerProfileControllers = void 0;
const freelancerProfileUseCase_1 = require("../../../useCase/freelancerProfileUseCase");
const userRepo_1 = require("../../../infrastructure/repositories/implementations/userRepo");
const freelancerRepos_1 = require("../../../infrastructure/repositories/implementations/freelancerRepos/freelancerRepos");
const user = new userRepo_1.UserRepo();
const freelancer = new freelancerRepos_1.FreelancerRepo();
const freelancerUseCase = new freelancerProfileUseCase_1.FreelancerProfileUseCase(freelancer, user);
class freelancerProfileControllers {
    constructor() {
        Object.defineProperty(this, "profileEdit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!req.user) {
                        res.status(401).json({ message: "user not authenticated" });
                        return;
                    }
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res.status(400).json({ message: "User ID not found" });
                        return;
                    }
                    const { fullName, email, availability, experience, education, hourlyRate, skills, location, reference, bio, coverPic, profilePic, } = req.body;
                    if (!fullName || !email) {
                        res.status(400).json({
                            success: false,
                            error: { message: "Full name and email are required" },
                        });
                        return;
                    }
                    const updatedUser = yield freelancerUseCase.updateNameAndEmail(userId, fullName, email);
                    const freelancer = yield freelancerUseCase.freelancerProfileEdit(userId, availability, experience, education, hourlyRate, skills, location, reference, bio, coverPic, profilePic);
                    res.status(200).json({
                        message: "Profile updated successfully",
                        user: updatedUser,
                        freelancer: freelancer,
                    });
                }
                catch (error) {
                    console.error("Error in profileEdit:", error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "profileDetails", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!req.user) {
                        res.status(401).json({ message: "user not authenticated" });
                        return;
                    }
                    // Get userId from authenticated user
                    const userId = "userId" in req.user ? req.user.userId : req.user;
                    if (!userId) {
                        res.status(400).json({ message: "User ID not found" });
                        return;
                    }
                    const freelancer = yield freelancerUseCase.profileDetails(userId);
                    res.status(200).json({
                        success: true,
                        freelancer: freelancer,
                    });
                }
                catch (error) {
                    console.error("Error in get client profile:", error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!req.user) {
                        res.status(401).json({ message: "user not authenticated" });
                        return;
                    }
                    const { page = "1", limit = "5" } = req.query;
                    const pageNum = parseInt(String(page), 10);
                    const limitNum = parseInt(String(limit), 10);
                    const { clients, pagination } = yield freelancerUseCase.clientUseCase(pageNum, limitNum);
                    res.status(200).json({
                        success: true,
                        clients: clients,
                        pagination,
                    });
                }
                catch (error) {
                    console.error("Error in get client profile:", error);
                    res.status(500).json({ error: "can not get clients" });
                }
            })
        });
        Object.defineProperty(this, "getTickets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res.status(401).json({ success: false, error: "Unauthorized" });
                        return;
                    }
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 6;
                    const { result, totalPages } = yield freelancerUseCase.freelancerTicketUseCase(userId, page, limit);
                    res.status(200).json({
                        success: true,
                        data: result,
                        totalPages,
                    });
                }
                catch (error) {
                    console.error("Error in get client profile:", error);
                    res.status(500).json({ error: "can not get client details" });
                }
            })
        });
        Object.defineProperty(this, "totalcount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res.status(401).json({ success: false, error: "Unauthorized" });
                        return;
                    }
                    const result = yield freelancerUseCase.totalcountUseCase(userId);
                    res.status(200).json({
                        success: true,
                        result,
                    });
                }
                catch (error) {
                    console.error("Error in get client profile:", error);
                    res.status(500).json({ error: "can not get clients" });
                }
            })
        });
        Object.defineProperty(this, "totalEarnings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res.status(401).json({ success: false, error: "Unauthorized" });
                        return;
                    }
                    const result = yield freelancerUseCase.totalEarningsUseCase(userId);
                    res.status(200).json({
                        success: true,
                        result,
                    });
                }
                catch (error) {
                    console.error("Error in get client profile:", error);
                    res.status(500).json({ error: "can not get clients" });
                }
            })
        });
        Object.defineProperty(this, "dashboardProject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res.status(401).json({ success: false, error: "Unauthorized" });
                        return;
                    }
                    const result = yield freelancerUseCase.dashboardProjectUseCase(userId);
                    res.status(200).json({
                        success: true,
                        result,
                    });
                }
                catch (error) {
                    console.error("Error in get client profile:", error);
                    res.status(500).json({ error: "can not get clients" });
                }
            })
        });
    }
}
exports.freelancerProfileControllers = freelancerProfileControllers;
//# sourceMappingURL=profileController.js.map