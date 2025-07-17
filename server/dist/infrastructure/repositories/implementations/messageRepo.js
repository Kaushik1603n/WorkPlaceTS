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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepo = void 0;
const MessageSchema_1 = require("../../../domain/models/MessageSchema");
const User_1 = __importDefault(require("../../../domain/models/User"));
class MessageRepo {
    saveMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new MessageSchema_1.MessageModel(message);
            return yield newMessage.save();
        });
    }
    saveMedia(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new MessageSchema_1.MessageModel(message);
            return yield newMessage.save();
        });
    }
    getMessages(senderId, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageSchema_1.MessageModel.find({
                $or: [
                    { senderId, contactId },
                    { senderId: contactId, contactId: senderId },
                ],
            })
                .lean()
                .sort({ id: 1 });
        });
    }
    getUnreadMessages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageSchema_1.MessageModel.find({
                contactId: userId,
                isRead: false,
            }).sort({ timestamp: -1 });
        });
    }
    markMessagesRead(userId, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MessageSchema_1.MessageModel.updateMany({ senderId: contactId, contactId: userId, isRead: false }, { $set: { isRead: true } });
        });
    }
    toggleMessageLike(messageId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield MessageSchema_1.MessageModel.findOne({ id: messageId });
            if (!message) {
                throw new Error("Message not found");
            }
            const hasLiked = message.likes.includes(userId);
            const update = hasLiked
                ? { $pull: { likes: userId } }
                : { $addToSet: { likes: userId } };
            const updatedMessage = yield MessageSchema_1.MessageModel.findOneAndUpdate({ id: messageId }, update, { new: true, runValidators: true });
            if (!updatedMessage) {
                throw new Error("Failed to update message likes");
            }
            return updatedMessage;
        });
    }
    findAndDelete(msgId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MessageSchema_1.MessageModel.deleteOne({ id: msgId });
        });
    }
    getMessageById(msgId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageSchema_1.MessageModel.findOne({ id: msgId });
        });
    }
    getLatestMessagedUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield MessageSchema_1.MessageModel.aggregate([
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
                const allUsers = yield User_1.default.find({
                    _id: { $ne: userId },
                    role: { $ne: "admin" },
                }).select("fullName role");
                const result = yield Promise.all(allUsers.map((user) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const otherUserId = user._id.toString();
                    const messageData = messages.find((msg) => msg._id === otherUserId);
                    const unreadCount = yield MessageSchema_1.MessageModel.countDocuments({
                        senderId: otherUserId,
                        contactId: userId,
                        isRead: false,
                    });
                    let sortTimestamp;
                    if (((_a = messageData === null || messageData === void 0 ? void 0 : messageData.latestMessage) === null || _a === void 0 ? void 0 : _a.timestamp) &&
                        !isNaN(new Date(messageData.latestMessage.timestamp).getTime())) {
                        sortTimestamp = new Date(messageData.latestMessage.timestamp);
                    }
                    else {
                        sortTimestamp = new Date(0);
                    }
                    return {
                        user: {
                            _id: otherUserId,
                            fullName: user.fullName || "Unknown User",
                            role: user.role || "unknown",
                        },
                        latestMessage: (messageData === null || messageData === void 0 ? void 0 : messageData.latestMessage) || null,
                        unreadCount,
                        sortTimestamp,
                    };
                })));
                result.sort((a, b) => {
                    return b.sortTimestamp.getTime() - a.sortTimestamp.getTime();
                });
                return result.map(({ user, latestMessage, unreadCount }) => ({
                    user,
                    latestMessage,
                    unreadCount,
                }));
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to fetch latest messaged users");
            }
        });
    }
    getUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.find({
                _id: { $ne: userId },
                role: { $ne: "admin" },
            }, {
                fullName: 1,
                _id: 1,
                email: 1,
                role: 1,
            });
        });
    }
}
exports.MessageRepo = MessageRepo;
//# sourceMappingURL=messageRepo.js.map