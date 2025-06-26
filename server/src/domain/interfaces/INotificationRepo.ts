import { NotificationTypes } from "../types/NotificationTypes";

export interface INotificationRepo {
  findNotification(userId: string): Promise<NotificationTypes>;
  readNofification(userId: string): Promise<void>;

}