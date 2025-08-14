export interface IMessageUseCase {
  sendMessageUseCase(message: IMessage): Promise<IMessage>;
  sendMediaUseCase(message: IMedia): Promise<IMedia>;
  getMessageUseCase(senderId: string, contactId: string): Promise<IMessage[]>;
  getUnreadMessagesUseCase(userId: string): Promise<IMessage[]>;
  getLatestMessagedUsersUseCase(
    userId: string
  ): Promise<
    Array<{ user: any; latestMessage: IMessage | null; unreadCount: number }>
  >;
  getUserUseCase(userId: string): Promise<any>;
  markMessagesReadUseCase(userId: string, contactId: string): Promise<void>;
  toggleMessageLikeUseCase(messageId: string, userId: string): Promise<any>;
  deleteMsg(msgId: string): Promise<void>;
  getMessageById(msgId: string): Promise<any>;
}
interface IMessage {
  id: string;
  text?: string;
  senderId: string;
  contactId: string;
  timestamp: string;
  isRead: boolean;
}
interface IMedia {
  id: string;
  media?: {
    url: string;
    type: "image" | "pdf";
  };
  senderId: string;
  contactId: string;
  timestamp: string;
  isRead: boolean;
}
