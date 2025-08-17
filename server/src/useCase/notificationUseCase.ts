import { INotificationRepo } from "../domain/interfaces/INotificationRepo";
import { NotificationTypes } from "../domain/types/NotificationTypes";

export class NotificationUseCase {
  constructor(private notify: INotificationRepo) {
    this.notify = notify;
  }

  async getNotifications(userId: string):Promise<NotificationTypes[] | undefined> {
    if (!userId) {
      return;
    }

    const result = await this.notify.findNotification(userId);
    return result;
  }

  async markNotificationsAsRead(userId:string): Promise<void> {
    if (!userId) {
      return;
    }

     await this.notify.readNofification(userId);
  }
}
