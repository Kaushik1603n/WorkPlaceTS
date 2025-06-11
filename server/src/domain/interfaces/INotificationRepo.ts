export interface INotificationRepo {
  findNotification(userId: string): Promise<any>;
  readNofification(userId: string): Promise<any>;

}