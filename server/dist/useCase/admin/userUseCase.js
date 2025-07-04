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
exports.UserUseCase = void 0;
class UserUseCase {
    constructor(user) {
        Object.defineProperty(this, "user", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: user
        });
        this.user = user;
    }
    getFreelancerData(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const freelancer = this.user.findFreelancer(page, limit, search);
            return freelancer;
        });
    }
    getClientData(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.user.findClient(page, limit, search);
            return client;
        });
    }
    getUsersData(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = this.user.find(page, limit, search);
            return users;
        });
    }
    userAction(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = this.user.findOneByIdAndUpdate(userId, status);
            return users;
        });
    }
    clientDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.user.findClientDetails(userId);
            return client;
        });
    }
    freelancerDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const freelancer = this.user.findfreelancerDetails(userId);
            return freelancer;
        });
    }
    userVerification(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            this.user.findByIdAndUserVerification(userId, status);
        });
    }
    AllReportUseCase(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.user.findReport(page, limit);
        });
    }
    TicketStatusUseCase(status, ticketId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.user.updateTicketStatus(status, ticketId, userId);
        });
    }
    TicketStatusCommentUseCase(text, ticketId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.user.updateTicketComment(text, ticketId, userId);
        });
    }
    UserGrowthDataUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.user.findUserGrowthData();
        });
    }
    TopFreelancerUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.user.findTopFreelancer();
        });
    }
    AllJobcountUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.user.findAllJobcountUseCase();
        });
    }
    AllJobDetailsUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.user.findAllJobDetails();
        });
    }
    RevenueDataUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.user.findRevenueData();
        });
    }
    PaymentsUseCase(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.user.getAllPayments(page, limit);
        });
    }
}
exports.UserUseCase = UserUseCase;
//# sourceMappingURL=userUseCase.js.map