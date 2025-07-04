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
exports.AdminProjectUseCase = void 0;
class AdminProjectUseCase {
    constructor(project) {
        Object.defineProperty(this, "project", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: project
        });
        this.project = project;
    }
    getAciveProjectUseCase(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this.project.findActiveProject(page, limit);
            return result;
        });
    }
    getPostedProjectUseCase(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this.project.findPostedProject(page, limit);
            return result;
        });
    }
    getCompletedProjectUseCase(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this.project.findCompletedProject(page, limit);
            return result;
        });
    }
    ProjectDetailsUseCase(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this.project.findProjectDetails(jobId);
            return result;
        });
    }
}
exports.AdminProjectUseCase = AdminProjectUseCase;
//# sourceMappingURL=adminProjectUseCase.js.map