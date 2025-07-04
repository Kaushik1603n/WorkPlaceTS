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
exports.MessageUseCase = void 0;
class MessageUseCase {
    constructor(message) {
        Object.defineProperty(this, "message", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: message
        });
        this.message = message;
    }
    sendMessageUseCase(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.message.saveMessage(message);
        });
    }
    sendMediaUseCase(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.message.saveMedia(message);
        });
    }
    getMessageUseCase(senderId, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.message.getMessages(senderId, contactId);
        });
    }
    getUnreadMessagesUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.message.getUnreadMessages(userId);
        });
    }
    getLatestMessagedUsersUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.message.getLatestMessagedUsers(userId);
        });
    }
    getUserUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.message.getUsers(userId);
        });
    }
    markMessagesReadUseCase(userId, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.message.markMessagesRead(userId, contactId);
        });
    }
    deleteMsg(msgId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.message.findAndDelete(msgId);
        });
    }
    getMessageById(msgId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.message.getMessageById(msgId);
        });
    }
}
exports.MessageUseCase = MessageUseCase;
//# sourceMappingURL=messageUseCase.js.map