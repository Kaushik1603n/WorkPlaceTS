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
exports.ProjectRepo = void 0;
const Projects_1 = __importDefault(require("../../../../domain/models/Projects"));
const ReportModel_1 = __importDefault(require("../../../../domain/models/ReportModel"));
class ProjectRepo {
    creteNewProject(userId, job_Id, jobTitle, description, requiredFeatures, stack, skills, time, budgetType, budget, experienceLevel, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Projects_1.default.create({
                    clientId: userId,
                    job_Id: job_Id,
                    title: jobTitle,
                    description,
                    requiredFeatures,
                    stack,
                    skills,
                    time,
                    budgetType,
                    budget,
                    experienceLevel,
                    reference,
                });
            }
            catch (error) {
                console.error("Repository error:", error);
                throw new Error("Failed to create project in database");
            }
        });
    }
    findProjects(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield Projects_1.default.find({ clientId: userId })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCount = yield Projects_1.default.countDocuments({
                    clientId: userId,
                });
                const totalPage = Math.ceil(totalCount / limit);
                return { project, totalPage, totalCount };
            }
            catch (error) {
                console.error("Repository error:", error);
                throw new Error("Failed to create project in database");
            }
        });
    }
    findAllTicket(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield ReportModel_1.default.find({ "client.id": userId })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCount = yield ReportModel_1.default.countDocuments({
                    "client.id": userId
                });
                const totalPages = Math.ceil(totalCount / limit);
                return { result, totalPages };
            }
            catch (error) {
                console.error("Repository error:", error);
                throw new Error("Failed to create project in database");
            }
        });
    }
    updateTicketComment(text, ticketId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ReportModel_1.default.findByIdAndUpdate(ticketId, {
                    $push: {
                        comments: {
                            text,
                            user: "freelancer",
                            changedAt: new Date(),
                            createdBy: userId,
                        },
                    },
                    updatedAt: new Date(),
                }, { new: true });
            }
            catch (error) {
                throw new Error("Failed to update ticket");
            }
        });
    }
}
exports.ProjectRepo = ProjectRepo;
//# sourceMappingURL=clientProjectRepo.js.map