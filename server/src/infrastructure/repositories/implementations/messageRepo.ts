import { MessageModel } from "../../../domain/models/MessageSchema";
import UserModel from "../../../domain/models/User";

export class MessageRepo {
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
    }).sort({ id: 1 });
  }

  async getUnreadMessages(userId: string): Promise<IMessage[]> {
    return await MessageModel.find({
      contactId: userId,
      isRead: false,
    }).sort({ timestamp: -1 });
  }

  async getLatestMessagedUsers(userId: string): Promise<any> {
    // Get all users the authenticated user has messaged
    const messages = await MessageModel.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { contactId: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$senderId", userId] }, "$contactId", "$senderId"],
          },
          latestMessage: { $first: "$$ROOT" },
        },
      },
    ]);
    // Fetch user details and unread message count
    const result = await Promise.all(
      messages.map(async (msg) => {
        const otherUserId = msg._id;
        const user = await UserModel.findById(otherUserId).select("fullName ");
        const unreadCount = await MessageModel.countDocuments({
          senderId: otherUserId,
          contactId: userId,
          isRead: false,
        });

        return {
          user: user || { _id: otherUserId, name: "Unknown User" },
          latestMessage: msg.latestMessage || null,
          unreadCount,
        };
      })
    );

    return result;
  }
  async getUsers(userId: string): Promise<any> {
    return await UserModel.find(
      {
        _id: { $ne: userId },
        role: { $ne: "admin" },
      },
      {
        fullName: 1,
        _id: 1,
        email: 1,
        role: 1,
      }
    );
  }
}

export interface IUser extends Document {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface IMessage {
  id: string;
  text: string;
  senderId: string;
  contactId: string;
  timestamp: string;
  isRead: boolean;
}
