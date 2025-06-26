export interface IMessageRepo {
  saveMessage(message: IMessage): Promise<IMessage>;
  getMessages(senderId: string, contactId: string): Promise<IMessage[]>;
  getUnreadMessages(userId: string): Promise<IMessage[]>;
  markMessagesRead(userId: string, contactId: string): Promise<void>;
  getLatestMessagedUsers(userId: string): Promise<any>;
  getUsers(userId: string): Promise<any>;
}

interface IMessage {
  id: string;
  text: string;
  senderId: string;
  contactId: string;
  timestamp: string;
  isRead: boolean;
}
