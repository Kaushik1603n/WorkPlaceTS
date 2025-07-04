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
exports.ClientProjectUserCase = void 0;
const uuid_1 = require("uuid");
class ClientProjectUserCase {
    constructor(project) {
        Object.defineProperty(this, "project", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: project
        });
        this.project = project;
    }
    newProject(userId, jobTitle, description, requiredFeatures, stack, skills, time, budgetType, budget, experienceLevel, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = (0, uuid_1.v4)();
                yield this.project.creteNewProject(userId, jobId, jobTitle, description, requiredFeatures, stack, skills, time, budgetType, budget, experienceLevel, reference);
            }
            catch (error) {
                console.error("Use case error:", error);
                throw error;
            }
        });
    }
    getProjectUseCase(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.project.findProjects(userId, page, limit);
                return result;
            }
            catch (error) {
                console.error("Use case error:", error);
                throw error;
            }
        });
    }
    getAllTicketUseCase(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.project.findAllTicket(userId, page, limit);
                return result;
            }
            catch (error) {
                console.error("Use case error:", error);
                throw error;
            }
        });
    }
    TicketStatusCommentUseCase(text, ticketId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.project.updateTicketComment(text, ticketId, userId);
        });
    }
}
exports.ClientProjectUserCase = ClientProjectUserCase;
//# sourceMappingURL=clientProjectUseCase.js.map