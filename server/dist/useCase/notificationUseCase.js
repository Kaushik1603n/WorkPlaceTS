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
exports.NotificationUseCase = void 0;
class NotificationUseCase {
    constructor(notify) {
        Object.defineProperty(this, "notify", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: notify
        });
        this.notify = notify;
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                return;
            }
            const result = yield this.notify.findNotification(userId);
            return result;
        });
    }
    markNotificationsAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                return;
            }
            yield this.notify.readNofification(userId);
        });
    }
}
exports.NotificationUseCase = NotificationUseCase;
//# sourceMappingURL=notificationUseCase.js.map