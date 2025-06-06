import NotificationModel from "../../../domain/models/Notification";

export class NotificationRepo {
  async findNotification(userId: string) {
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
