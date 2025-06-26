import { INotificationRepo } from "../../../domain/interfaces/INotificationRepo";
import NotificationModel from "../../../domain/models/Notification";

export class NotificationRepo implements INotificationRepo {
  async findNotification(userId: string):Promise<any> {
    const notifications = await NotificationModel.find({ userId }).sort({
      createdAt: -1,
    });
    return notifications
  }
  async readNofification(userId: string) {
       await NotificationModel.updateMany(
          { userId, isRead: false },
          { $set: { isRead: true } }
        );
    return 
  }
}
