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
exports.profileCondroller = void 0;
const clientProfileUseCase_1 = require("../../../useCase/clientProfileUseCase");
const userRepo_1 = require("../../../infrastructure/repositories/implementations/userRepo");
const clientProfileRepo_1 = require("../../../infrastructure/repositories/implementations/clientRepos/clientProfileRepo");
// import { AuthUseCase } from "../../../useCase/authUseCase";
const user = new userRepo_1.UserRepo();
const client = new clientProfileRepo_1.ClientRepo();
const clientUseCase = new clientProfileUseCase_1.ClientProfileUserCase(client, user);
// const useCase = new AuthUseCase(user);
class profileCondroller {
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
                    // Get userId from authenticated user
                    const userId = "userId" in req.user ? req.user.userId : req.user;
                    if (!userId) {
                        res.status(400).json({ message: "User ID not found" });
                        return;
                    }
                    const { companyName, description, email, fullName, location, website, coverPic, profilePic, } = req.body;
                    if (!fullName || !email) {
                        res.status(400).json({
                            success: false,
                            error: { message: "Full name and email are required" },
                        });
                        return;
                    }
                    // Update user name and email
                    const updatedUser = yield clientUseCase.updateNameAndEmail(userId, fullName, email);
                    // Update client profile
                    const updatedClient = yield clientUseCase.clientProfileEdit(userId, companyName, description, location, website, coverPic, profilePic);
                    // console.log(updatedClient);
                    res.status(200).json({
                        message: "Profile updated successfully",
                        user: updatedUser,
                        client: updatedClient,
                    });
                }
                catch (error) {
                    console.error("Error in profileEdit:", error);
                    res.status(500).json({ message: "Internal server error" });
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
                    const client = yield clientUseCase.profileDetails(userId);
                    res.status(200).json({
                        success: true,
                        client: client,
                    });
                }
                catch (error) {
                    console.error("Error in get client profile:", error);
                    res.status(500).json({ error: "can not get client details" });
                }
            })
        });
        Object.defineProperty(this, "freelancer", {
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
                    const { freelancers, pagination } = yield clientUseCase.freelancerUseCase(pageNum, limitNum);
                    res.status(200).json({
                        success: true,
                        freelancer: freelancers,
                        pagination,
                    });
                }
                catch (error) {
                    console.error("Error in get client profile:", error);
                    res.status(500).json({ error: "can not get client details" });
                }
            })
        });
        Object.defineProperty(this, "HiringProjects", {
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
                    const { result, jobCount } = yield clientUseCase.HiringProjectsUseCase(userId);
                    res.status(200).json({
                        success: true,
                        result: result,
                        jobCount,
                    });
                }
                catch (error) {
                    console.error("Error in get client profile:", error);
                    res.status(500).json({ error: "can not get client details" });
                }
            })
        });
        Object.defineProperty(this, "financialData", {
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
                    const { weeklySpending, avgCostPerProject, totalSpent } = yield clientUseCase.FinancialDataUseCase(userId);
                    res.status(200).json({
                        success: true,
                        weeklySpending,
                        avgCostPerProject,
                        totalSpent,
                    });
                }
                catch (error) {
                    console.error("Error in get client profile:", error);
                    res.status(500).json({ error: "can not get client details" });
                }
            })
        });
    }
}
exports.profileCondroller = profileCondroller;
//# sourceMappingURL=profileControllers.js.map