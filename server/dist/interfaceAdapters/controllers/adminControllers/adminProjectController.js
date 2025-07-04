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
exports.AdminProjectController = void 0;
const adminProjectRepo_1 = require("../../../infrastructure/repositories/implementations/adminRepos/adminProjectRepo");
const adminProjectUseCase_1 = require("../../../useCase/admin/adminProjectUseCase");
const projectRepo = new adminProjectRepo_1.AdminProjectRepo();
const adminProject = new adminProjectUseCase_1.AdminProjectUseCase(projectRepo);
class AdminProjectController {
    constructor() {
        Object.defineProperty(this, "getActiveProject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 6;
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res.status(401).json({ success: false, error: "Unauthorized" });
                        return;
                    }
                    const { result, totalPage } = yield adminProject.getAciveProjectUseCase(page, limit);
                    res
                        .status(200)
                        .json({ success: true, message: "success", data: result, totalPage });
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
        Object.defineProperty(this, "getPostedProject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 6;
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res.status(401).json({ success: false, error: "Unauthorized" });
                        return;
                    }
                    const { result, totalPage } = yield adminProject.getPostedProjectUseCase(page, limit);
                    res
                        .status(200)
                        .json({ success: true, message: "success", data: result, totalPage });
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
        Object.defineProperty(this, "getCompletedProject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 6;
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res.status(401).json({ success: false, error: "Unauthorized" });
                        return;
                    }
                    const { result, totalPage } = yield adminProject.getCompletedProjectUseCase(page, limit);
                    res
                        .status(200)
                        .json({ success: true, message: "success", data: result, totalPage });
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
        Object.defineProperty(this, "ProjectDetails", {
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
                    const { jobId } = req.params;
                    if (!jobId) {
                        res.status(400).json({
                            success: false,
                            error: "Job ID is required",
                        });
                        return;
                    }
                    const result = yield adminProject.ProjectDetailsUseCase(jobId);
                    res.status(200).json({ success: true, message: "success", data: result });
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
exports.AdminProjectController = AdminProjectController;
//# sourceMappingURL=adminProjectController.js.map