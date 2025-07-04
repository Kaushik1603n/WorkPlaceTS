"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const messageUseCase_1 = require("../../useCase/messageUseCase");
const messageRepo_1 = require("../../infrastructure/repositories/implementations/messageRepo");
const message = new messageRepo_1.MessageRepo();
const messageCase = new messageUseCase_1.MessageUseCase(message);
class MessageController {
    constructor() {
        Object.defineProperty(this, "sendMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { id, text, senderId, contactId, timestamp, isRead } = req.body;
                    if (!id || !text || !senderId || !contactId) {
                        res
                            .status(400)
                            .json({ success: false, error: "Invalid message format" });
                        return;
                    }
                    const message = {
                        id,
                        text,
                        senderId,
                        contactId,
                        timestamp: timestamp || new Date().toISOString(),
                        isRead: isRead || false,
                    };
                    const savedMessage = yield messageCase.sendMessageUseCase(message);
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
                    io.to(connectedUsers[senderId]).emit("message", Object.assign(Object.assign({}, savedMessage), { isRead: true }));
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : "Message sending failed",
                    });
                }
            })
        });
        Object.defineProperty(this, "getMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { senderId, contactId } = req.body;
                    if (!senderId || !contactId) {
                        res
                            .status(400)
                            .json({ success: false, error: "Invalid request format" });
                        return;
                    }
                    const messages = yield messageCase.getMessageUseCase(senderId, contactId);
                    res.status(200).json({
                        message: "Messages retrieved successfully",
                        data: messages,
                    });
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : "Message retrieval failed",
                    });
                }
            })
        });
        Object.defineProperty(this, "getLatestMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res.status(401).json({ success: false, error: "Unauthorized" });
                        return;
                    }
                    const unreadMessages = yield messageCase.getUnreadMessagesUseCase(userId);
                    const latestMessagedUsers = yield messageCase.getLatestMessagedUsersUseCase(userId);
                    res.status(200).json({
                        message: "Latest messages and users retrieved successfully",
                        data: {
                            unreadMessages,
                            latestMessagedUsers,
                        },
                    });
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error
                            ? error.message
                            : "Failed to retrieve latest messages",
                    });
                }
            })
        });
        Object.defineProperty(this, "markMessagesRead", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { userId, contactId } = req.body;
                    if (!userId || !contactId) {
                        res
                            .status(400)
                            .json({ success: false, error: "Invalid request format" });
                        return;
                    }
                    yield messageCase.markMessagesReadUseCase(userId, contactId);
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
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error
                            ? error.message
                            : "Failed to mark messages as read",
                    });
                }
            })
        });
        Object.defineProperty(this, "DeleteMsg", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const msgId = req.params.id.trim().replace(/^:/, "");
                    const io = req.app.get("io");
                    const connectedUsers = req.app.get("connectedUsers");
                    const message = yield messageCase.getMessageById(msgId); // Assume you have a method to fetch message details
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
                    yield messageCase.deleteMsg(msgId);
                    res.status(200).json({ success: true });
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to delete messages ",
                    });
                }
            })
        });
    }
}
exports.MessageController = MessageController;
//# sourceMappingURL=messageController.js.map