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
exports.NotificationService = void 0;
const Notification_1 = __importDefault(require("../domain/models/Notification"));
const Projects_1 = __importDefault(require("../domain/models/Projects"));
class NotificationService {
    constructor(socketService) {
        Object.defineProperty(this, "socketService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: socketService
        });
    }
    notifyProposalSubmission(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Get job details
                const job = yield Projects_1.default.findById(params.jobId);
                if (!job)
                    throw new Error("Job not found");
                const clientId = job.clientId.toString();
                // 2. Create persistent notification
                const notification = yield Notification_1.default.create({
                    recipientId: clientId,
                    senderId: params.freelancerId,
                    type: "NEW_PROPOSAL",
                    content: `New proposal received for your job "${job.title}"`,
                    metadata: {
                        jobId: params.jobId,
                        proposalId: params.proposalId,
                    },
                });
                // 3. Send real-time notification
                this.socketService.sendToUser(clientId, "new_notification", {
                    _id: notification._id,
                    type: notification.type,
                    content: notification.content,
                    metadata: notification.metadata,
                    createdAt: notification.createdAt,
                });
            }
            catch (error) {
                console.error("Notification failed:", error);
                throw error;
            }
        });
    }
}
exports.NotificationService = NotificationService;
// export const notificationService = new NotificationService(socketService);
//# sourceMappingURL=notification.service.js.map