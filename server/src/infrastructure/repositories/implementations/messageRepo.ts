import { MessageModel } from "../../../domain/models/MessageSchema";

export class MessageRepo  {
     async saveMessage(message: IMessage): Promise<IMessage> {
    const newMessage = new MessageModel(message);
    return await newMessage.save();
  }

  async getMessages(senderId: string, contactId: string): Promise<IMessage[]> {
    return await MessageModel.find({
      $or: [
        { senderId, contactId },
        { senderId: contactId, contactId: senderId },
      ],
    }).sort({ timestamp: 1 });
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