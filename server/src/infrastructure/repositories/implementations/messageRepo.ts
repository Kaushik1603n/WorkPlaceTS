import { IMessageRepo } from "../../../domain/interfaces/IMessageRepo";
import { MessageModel } from "../../../domain/models/MessageSchema";
import UserModel from "../../../domain/models/User";

export class MessageRepo implements IMessageRepo {
  async saveMessage(message: IMessage): Promise<any> {
    const newMessage = new MessageModel(message);
    return await newMessage.save();
  }
  async saveMedia(message: IMedia): Promise<IMedia> {
    const newMessage = new MessageModel(message);
    return await newMessage.save();
  }

  async getMessages(senderId: string, contactId: string): Promise<any[]> {
    return await MessageModel.find({
      $or: [
        { senderId, contactId },
        { senderId: contactId, contactId: senderId },
      ],
    })
      .lean()
      .sort({ id: 1 });
  }

  async getUnreadMessages(userId: string): Promise<any[]> {
    return await MessageModel.find({
      contactId: userId,
      isRead: false,
    }).sort({ timestamp: -1 });
  }

  async markMessagesRead(userId: string, contactId: string): Promise<void> {
    await MessageModel.updateMany(
      { senderId: contactId, contactId: userId, isRead: false },
      { $set: { isRead: true } }
    );
  }
  async findAndDelete(msgId: string): Promise<void> {
    await MessageModel.deleteOne({ id: msgId });
  }

  async getMessageById(msgId: string): Promise<any> {
    return await MessageModel.findOne({ id: msgId });
  }

  async getLatestMessagedUsers(userId: string): Promise<any> {
    try {
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
              $cond: [
                { $eq: ["$senderId", userId] },
                "$contactId",
                "$senderId",
              ],
            },
            latestMessage: { $first: "$$ROOT" },
          },
        },
      ]);

      const allUsers = await UserModel.find({
        _id: { $ne: userId },
        role: { $ne: "admin" },
      }).select("fullName role");

      const result = await Promise.all(
        allUsers.map(async (user) => {
          const otherUserId = user._id.toString();
          const messageData = messages.find((msg) => msg._id === otherUserId);

          const unreadCount = await MessageModel.countDocuments({
            senderId: otherUserId,
            contactId: userId,
            isRead: false,
          });

          let sortTimestamp: Date;
          if (
            messageData?.latestMessage?.timestamp &&
            !isNaN(new Date(messageData.latestMessage.timestamp).getTime())
          ) {
            sortTimestamp = new Date(messageData.latestMessage.timestamp);
          } else {
            sortTimestamp = new Date(0);
          }

          return {
            user: {
              _id: otherUserId,
              fullName: user.fullName || "Unknown User",
              role: user.role || "unknown",
            },
            latestMessage: messageData?.latestMessage || null,
            unreadCount,
            sortTimestamp,
          };
        })
      );

      result.sort((a, b) => {
        return b.sortTimestamp.getTime() - a.sortTimestamp.getTime();
      });

      return result.map(({ user, latestMessage, unreadCount }) => ({
        user,
        latestMessage,
        unreadCount,
      }));
    } catch (error) {
      console.log(error);

      throw new Error("Failed to fetch latest messaged users");
    }
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

interface IMessage {
  id: string;
  text?: string;
  senderId: string;
  contactId: string;
  timestamp: string;
  isRead: boolean;
}

// interface IMessageDTO {
//   id: string;
//   text?: string;
//   senderId: string;
//   contactId: string;
//   timestamp: string;
//   isRead: boolean;
//   media?: {
//     url: string;
//     type: "image" | "pdf";
//   };
// }

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
