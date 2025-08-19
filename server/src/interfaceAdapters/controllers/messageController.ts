import { RequestHandler } from "express";
import { IMessageUseCase } from "../../useCase/Interface/IMessageUseCase";
import { HttpStatus } from "./statusCode";
import { Messages } from "./messages";

export class MessageController {
  private messageCase: IMessageUseCase;
  constructor(usecase: IMessageUseCase) {
    this.messageCase = usecase;
  }
  
  sendMessage: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { id, text, senderId, contactId, timestamp, isRead } = req.body;
      if (!id || !text || !senderId || !contactId) {
        res
          .status(HttpStatus.BAD_REQUEST)
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

      const savedMessage = await this.messageCase.sendMessageUseCase(message);
      res.status(HttpStatus.CREATED).json({
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };

  getMessage: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { senderId, contactId } = req.body;
      if (!senderId || !contactId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, error: "Invalid request format" });
        return;
      }

      const messages = await this.messageCase.getMessageUseCase(
        senderId,
        contactId
      );
      res.status(HttpStatus.OK).json({
        message: "Messages retrieved successfully",
        data: messages,
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };

  getLatestMessages: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: Messages.INVALID_USER_AUTHENTICATED });
        return;
      }

      const unreadMessages = await this.messageCase.getUnreadMessagesUseCase(
        userId
      );
      const latestMessagedUsers =
        await this.messageCase.getLatestMessagedUsersUseCase(userId);

      res.status(HttpStatus.OK).json({
        message: "Latest messages and users retrieved successfully",
        data: {
          unreadMessages,
          latestMessagedUsers,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };

  markMessagesRead: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { userId, contactId } = req.body;
      if (!userId || !contactId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, error: "Invalid request format" });
        return;
      }

      await this.messageCase.markMessagesReadUseCase(userId, contactId);
      res.status(HttpStatus.OK).json({
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : Messages.SERVER_ERROR,
      });
    }
  };

  DeleteMsg: RequestHandler = async (req, res): Promise<void> => {
    try {
      const msgId = req.params.id.trim().replace(/^:/, "");
      const io = req.app.get("io");
      const connectedUsers = req.app.get("connectedUsers");
      const message = await this.messageCase.getMessageById(msgId); // Assume you have a method to fetch message details
      if (message) {
        const { senderId, contactId } = message;

        const senderSocketId = connectedUsers[senderId];
        const recipientSocketId = connectedUsers[contactId];

        if (senderSocketId) {
          io.to(senderSocketId).emit("messageDeleted", { messageId: msgId });
        }
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("messageDeleted", { messageId: msgId });
        }
      }
      await this.messageCase.deleteMsg(msgId);
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error:
          error instanceof Error ? error.message : Messages.SERVER_ERROR,
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
