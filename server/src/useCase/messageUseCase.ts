import { MessageRepo } from "../infrastructure/repositories/implementations/messageRepo";

export class MessageUseCase {
  constructor(private message: MessageRepo) {
    this.message = message;
  }

  async sendMessageUseCase(message: IMessage): Promise<IMessage> {
    return await this.message.saveMessage(message);
  }

  async getMessageUseCase(
    senderId: string,
    contactId: string
  ): Promise<IMessage[]> {
    return await this.message.getMessages(senderId, contactId);
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
