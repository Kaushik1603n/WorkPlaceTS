export interface INotificationUseCase {
  getNotifications(userId: string): Promise<any>;
  markNotificationsAsRead(userId: string): Promise<any>;
}
