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
exports.UserDataController = void 0;
const userUseCase_1 = require("../../../useCase/admin/userUseCase");
const userDataRepo_1 = require("../../../infrastructure/repositories/implementations/adminRepos/userDataRepo");
const userRepo = new userDataRepo_1.UserDataRepo();
const userData = new userUseCase_1.UserUseCase(userRepo);
class UserDataController {
    constructor() {
        Object.defineProperty(this, "getFreelancerData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 5;
                    const search = req.query.search || "";
                    const data = yield userData.getFreelancerData(page, limit, search);
                    res.status(200).json({ success: true, message: "success", data });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "getClientData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 5;
                    const search = req.query.search || "";
                    const data = yield userData.getClientData(page, limit, search);
                    res.status(200).json({ success: true, message: "success", data });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "getUsersData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 5;
                    const search = req.query.search || "";
                    const data = yield userData.getUsersData(page, limit, search);
                    res.status(200).json({ success: true, message: "success", data });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "userAction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { userId, status } = req.body;
                yield userData.userAction(userId, status);
                res.status(200).json({ success: true, message: "success" });
            })
        });
        Object.defineProperty(this, "clientDetails", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const userId = req.params.userId;
                    if (!userId) {
                        throw new Error("UserId not Found");
                    }
                    const clientDetails = yield userData.clientDetails(userId);
                    res.status(200).json({ data: clientDetails });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "freelancerDetails", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const userId = req.params.userId;
                    if (!userId) {
                        throw new Error("UserId not Found");
                    }
                    const freelancerDetails = yield userData.freelancerDetails(userId);
                    res.status(200).json({ data: freelancerDetails });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "userVerification", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const userId = req.params.userId;
                    const { status } = req.body;
                    if (!userId) {
                        throw new Error("UserId not Found");
                    }
                    if (!status) {
                        throw new Error("Status not Found");
                    }
                    yield userData.userVerification(userId, status);
                    res
                        .status(200)
                        .json({ success: true, message: "Update Verification Status", status });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "User Verification faild" });
                    }
                }
            })
        });
        Object.defineProperty(this, "AllReport", {
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
                    const limit = parseInt(req.query.limit) || 5;
                    const { result, totalPages } = yield userData.AllReportUseCase(page, limit);
                    res.status(200).json({ data: result || [], totalPages });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "TicketStatus", {
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
                    const ticketId = req.params.ticketId;
                    const { status } = req.body;
                    const report = yield userData.TicketStatusUseCase(status, ticketId, userId);
                    res.status(200).json({ data: report || [] });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "TicketStatusComment", {
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
                    const ticketId = req.params.ticketId;
                    const { text } = req.body;
                    const report = yield userData.TicketStatusCommentUseCase(text, ticketId, userId);
                    res.status(200).json({ data: report || [] });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "UserGrowthData", {
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
                    const { result, totalUsers } = yield userData.UserGrowthDataUseCase();
                    res.status(200).json({ success: true, data: result || [], totalUsers });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "TopFreelancer", {
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
                    const result = yield userData.TopFreelancerUseCase();
                    res.status(200).json({ success: true, data: result || [] });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "AllJobcount", {
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
                    const result = yield userData.AllJobcountUseCase();
                    res.status(200).json({ success: true, data: result || [] });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "AllJobDetails", {
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
                    const result = yield userData.AllJobDetailsUseCase();
                    res.status(200).json({ success: true, data: result || [] });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "RevenueData", {
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
                    const { revenueData, revenueDetails } = yield userData.RevenueDataUseCase();
                    res
                        .status(200)
                        .json({ success: true, data: revenueData || [], revenueDetails });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
        Object.defineProperty(this, "Payments", {
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
                    const limit = parseInt(req.query.limit) || 5;
                    const payment = yield userData.PaymentsUseCase(page, limit);
                    res
                        .status(200)
                        .json({ success: true, payment: payment || [] });
                }
                catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
            })
        });
    }
}
exports.UserDataController = UserDataController;
//# sourceMappingURL=userDataController.js.map