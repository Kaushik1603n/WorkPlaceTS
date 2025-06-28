import { MessageRepo } from "../infrastructure/repositories/implementations/messageRepo";

export class MessageUseCase {
  constructor(private message: MessageRepo) {
    this.message = message;
  }

  async sendMessageUseCase(message: IMessage): Promise<IMessage> {
    return await this.message.saveMessage(message);
  }

  async getMessageUseCase(senderId: string, contactId: string): Promise<IMessage[]> {
    return await this.message.getMessages(senderId, contactId);
  }

  async getUnreadMessagesUseCase(userId: string): Promise<IMessage[]> {
    return await this.message.getUnreadMessages(userId);
  }

  async getLatestMessagedUsersUseCase(
    userId: string
  ): Promise<
    Array<{ user: any; latestMessage: IMessage | null; unreadCount: number }>
  > {
    return await this.message.getLatestMessagedUsers(userId);
  }

  async getUserUseCase(userId: string) {
    return await this.message.getUsers(userId);
  }

  async markMessagesReadUseCase(userId: string, contactId: string): Promise<void> {
    return await this.message.markMessagesRead(userId, contactId);
  }
  async deleteMsg(msgId: string): Promise<void> {
    
    return await this.message.findAndDelete(msgId);
  }
 async getMessageById(msgId: string): Promise<any> {
  return await this.message.getMessageById(msgId);
}
}

 interface IMessage {
  id: string;
  text: string;
  senderId: string;
  contactId: string;
  timestamp: string;
  isRead: boolean;
}