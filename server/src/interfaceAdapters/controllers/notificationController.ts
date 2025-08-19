import { RequestHandler } from "express";
import { INotificationUseCase } from "../../useCase/Interface/INotificationUseCase";
import { HttpStatus } from "./statusCode";
import { Messages } from "./messages";

export class NotificationController {
  private notificationUseCase: INotificationUseCase;
  constructor(usecase: INotificationUseCase) {
    this.notificationUseCase = usecase;
  }

  getNotifications: RequestHandler = async (req, res) => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const notifications = await this.notificationUseCase.getNotifications(
        userId
      );
      res.status(HttpStatus.OK).json({ success: true, data: notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: Messages.SERVER_ERROR });
    }
  };

  markNotificationsAsRead: RequestHandler = async (req, res) => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      await this.notificationUseCase.markNotificationsAsRead(userId);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: Messages.SERVER_ERROR,
      });
    }
  };
}
