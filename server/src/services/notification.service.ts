import Notification from "../domain/models/Notification";
// import { socketService } from "./socket.service";
import { SocketService } from "./socket.service";
import ProjectModel from "../domain/models/Projects";

export class NotificationService {
    constructor(private socketService: SocketService) {}

  async notifyProposalSubmission(params: {
    jobId: string;
    freelancerId: string;
    proposalId: string;
  }): Promise<void> {
    try {
      // 1. Get job details
      const job = await ProjectModel.findById(params.jobId);
      if (!job) throw new Error("Job not found");

      const clientId = job.clientId.toString();

      // 2. Create persistent notification
      const notification = await Notification.create({
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
    } catch (error) {
      console.error("Notification failed:", error);
      throw error;
    }
  }
}

// export const notificationService = new NotificationService(socketService);
