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
exports.ProjectController = void 0;
const clientProjectUseCase_1 = require("../../../useCase/clientProjectUseCase");
const clientProjectRepo_1 = require("../../../infrastructure/repositories/implementations/clientRepos/clientProjectRepo");
const project = new clientProjectRepo_1.ProjectRepo();
const projectUserCase = new clientProjectUseCase_1.ClientProjectUserCase(project);
class ProjectController {
    constructor() {
        Object.defineProperty(this, "newProject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { jobTitle, description, requiredFeatures, stack, skills, time, budgetType, budget, experienceLevel, reference, } = req.body;
                const { userId } = req.user;
                try {
                    if (!userId) {
                        throw new Error("User Not Authenticated");
                    }
                    if (!jobTitle ||
                        !description ||
                        !requiredFeatures ||
                        !stack ||
                        !skills ||
                        !time ||
                        !budgetType ||
                        !budget ||
                        !experienceLevel ||
                        !reference) {
                        throw new Error("All Feild are require");
                    }
                    yield projectUserCase.newProject(userId, jobTitle, description, requiredFeatures, stack, skills, time, budgetType, budget, experienceLevel, reference);
                    res
                        .status(200)
                        .json({ success: true, message: "Project created successfully" });
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
        Object.defineProperty(this, "getAllProject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { userId } = req.user;
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 6;
                    const { project, totalPage, totalCount } = yield projectUserCase.getProjectUseCase(userId, page, limit);
                    res.status(200).json({
                        success: true,
                        message: "Project get successfully",
                        data: project,
                        totalPage,
                        totalCount,
                    });
                }
                catch (error) {
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "User Verification faild" });
                    }
                }
            })
        });
        Object.defineProperty(this, "getAllTickets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { userId } = req.user;
                    if (!userId) {
                        throw new Error("User Not Authenticated");
                    }
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 5;
                    const { result, totalPages } = yield projectUserCase.getAllTicketUseCase(userId, page, limit);
                    res.status(200).json({
                        success: true,
                        message: "Project get successfully",
                        data: result,
                        totalPages,
                    });
                }
                catch (error) {
                    if (error instanceof Error) {
                        res.status(400).json({ message: error.message });
                    }
                    else {
                        res.status(500).json({ message: "User Verification faild" });
                    }
                }
            })
        });
        Object.defineProperty(this, "TicketComment", {
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
                    const report = yield projectUserCase.TicketStatusCommentUseCase(text, ticketId, userId);
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
    }
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=projectController.js.map