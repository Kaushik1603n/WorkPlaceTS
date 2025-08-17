import { INotificationRepo } from "../../../domain/interfaces/INotificationRepo";
import NotificationModel from "../../../domain/models/Notification";
import { NotificationTypes } from "../../../domain/types/NotificationTypes";

export class NotificationRepo implements INotificationRepo {
  async findNotification(userId: string): Promise<NotificationTypes[]> {
    const notifications = await NotificationModel.find({ userId }).sort({
      createdAt: -1,
    });
    return notifications.map((n) => ({
      userId: n.userId.toString(), 
      type: n.type,
      title: n.title,
      message: n.message,
      isRead: n.isRead,
      actionLink: n.actionLink,
      content: n.content,
      metadata: n.metadata,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    }));
  }

  async readNofification(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
    return;
  }
}
