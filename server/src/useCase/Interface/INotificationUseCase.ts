import { NotificationTypes } from "../../domain/types/NotificationTypes";

export interface INotificationUseCase {
  getNotifications(userId: string): Promise<NotificationTypes[] | undefined>;
  markNotificationsAsRead(userId: string): Promise<void>;
}
