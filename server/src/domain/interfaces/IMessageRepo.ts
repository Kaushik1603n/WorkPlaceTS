export interface IMessageRepo {
  saveMessage(message: IMessage): Promise<IMessage>;
  saveMedia(message: IMedia): Promise<IMedia>;
  getMessages(senderId: string, contactId: string): Promise<IMessage[]>;
  getUnreadMessages(userId: string): Promise<IMessage[]>;
  markMessagesRead(userId: string, contactId: string): Promise<void>;
  toggleMessageLike(messageId: string, userId: string): Promise<any>;
  findAndDelete(msgId: string): Promise<void>;
  getMessageById(msgId: string): Promise<any>;
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
