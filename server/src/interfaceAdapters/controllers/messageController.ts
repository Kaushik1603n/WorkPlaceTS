import { RequestHandler } from "express";
import { MessageUseCase } from "../../useCase/messageUseCase";
import { MessageRepo } from "../../infrastructure/repositories/implementations/messageRepo";

const message = new MessageRepo();
const messageCase = new MessageUseCase(message);

export class MessageController {
  sendMessage: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { id, text, senderId, contactId, timestamp, isRead } = req.body;
      if (!id || !text || !senderId || !contactId) {
        res
          .status(400)
          .json({ success: false, error: "Invalid message format" });
        return;
      }

      const message: IMessage = {
        id,
        text,
        senderId,
        contactId,
        timestamp: timestamp || new Date().toISOString(),
        isRead: isRead || false,
      };

      const savedMessage = await messageCase.sendMessageUseCase(message);
      res.status(200).json({
        message: "Message sent successfully",
        data: savedMessage,
      });

      const io = req.app.get("io");
      const connectedUsers = req.app.get("connectedUsers");
      const recipientSocketId = connectedUsers[contactId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("message", savedMessage);
      }
      io.to(connectedUsers[senderId]).emit("message", {
        ...savedMessage,
        isRead: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Message sending failed",
      });
    }
  };

  getMessage: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { senderId, contactId } = req.body;
      if (!senderId || !contactId) {
        res
          .status(400)
          .json({ success: false, error: "Invalid request format" });
        return;
      }

      const messages = await messageCase.getMessageUseCase(senderId, contactId);
      res.status(200).json({
        message: "Messages retrieved successfully",
        data: messages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Message retrieval failed",
      });
    }
  };

  getLatestMessages: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const unreadMessages = await messageCase.getUnreadMessagesUseCase(userId);
      const latestMessagedUsers =
        await messageCase.getLatestMessagedUsersUseCase(userId);

      res.status(200).json({
        message: "Latest messages and users retrieved successfully",
        data: {
          unreadMessages,
          latestMessagedUsers,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve latest messages",
      });
    }
  };

  markMessagesRead: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { userId, contactId } = req.body;
      if (!userId || !contactId) {
        res
          .status(400)
          .json({ success: false, error: "Invalid request format" });
        return;
      }

      await messageCase.markMessagesReadUseCase(userId, contactId);
      res.status(200).json({
        message: "Messages marked as read successfully",
      });

      const io = req.app.get("io");
      const connectedUsers = req.app.get("connectedUsers");
      const recipientSocketId = connectedUsers[userId];
      const senderSocketId = connectedUsers[contactId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("messagesRead", { contactId });
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", { contactId: userId });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark messages as read",
      });
    }
  };
}

interface IMessage {
  id: string;
  text: string;
  senderId: string;
  contactId: string;
  timestamp: string;
  isRead: boolean;
}
