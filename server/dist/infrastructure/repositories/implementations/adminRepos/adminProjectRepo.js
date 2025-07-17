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
exports.AdminProjectRepo = void 0;
const mongoose_1 = require("mongoose");
const Projects_1 = __importDefault(require("../../../../domain/models/Projects"));
const User_1 = __importDefault(require("../../../../domain/models/User"));
class AdminProjectRepo {
    findProjectsByStatus(status, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Projects_1.default.find({ status })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCount = yield Projects_1.default.countDocuments({ status });
                const totalPages = Math.ceil(totalCount / limit);
                return { result, totalPage: totalPages };
            }
            catch (error) {
                console.error(`find${status}Project error`, error);
                throw new Error(`Fetching ${status} Project Error`);
            }
        });
    }
    findActiveProject(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findProjectsByStatus("in-progress", page, limit);
        });
    }
    findPostedProject(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findProjectsByStatus("posted", page, limit);
        });
    }
    findCompletedProject(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findProjectsByStatus("completed", page, limit);
        });
    }
    findProjectDetails(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(jobId)) {
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
                console.error("Project Details Db Error", error);
                throw new Error("Project Details Db Error");
            }
        });
    }
}
exports.AdminProjectRepo = AdminProjectRepo;
//# sourceMappingURL=adminProjectRepo.js.map