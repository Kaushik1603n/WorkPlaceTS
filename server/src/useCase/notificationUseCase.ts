import { INotificationRepo } from "../domain/interfaces/INotificationRepo";

export class NotificationUseCase {
  constructor(private notify: INotificationRepo) {
    this.notify = notify;
  }

  async getNotifications(userId: string) {
    if (!userId) {
      return;
    }

    const result = await this.notify.findNotification(userId);
    return result;
  }

  async markNotificationsAsRead(userId:string) {
    if (!userId) {
      return;
    }

     await this.notify.readNofification(userId);
  }
}
