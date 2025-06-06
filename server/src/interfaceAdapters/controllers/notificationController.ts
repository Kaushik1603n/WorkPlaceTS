import { RequestHandler } from "express";
import { NotificationRepo } from "../../infrastructure/repositories/implementations/notificationRepo";
import { NotificationUseCase } from "../../useCase/notificationUseCase";

const notificationRepo = new NotificationRepo();
const notificationUseCase = new NotificationUseCase(notificationRepo);
export class NotificationController {
  getNotifications: RequestHandler = async (req, res) => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      
      if (!userId) {
        res
          .status(401)
          .json({ success: false, error: "User not authenticated" });
        return;
      }

      const notifications = await notificationUseCase.getNotifications(userId);
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch notifications" });
    }
  };

  // Mark all notifications as read for the authenticated user
  markNotificationsAsRead: RequestHandler = async (req, res) => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(401)
          .json({ success: false, error: "User not authenticated" });
        return;
      }

     
      await notificationUseCase.markNotificationsAsRead(userId);

      res
        .status(200)
        .json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      res.status(500).json({
        success: false,
        error: "Failed to mark notifications as read",
      });
    }
  };
}
