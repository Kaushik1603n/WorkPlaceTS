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
exports.NotificationController = void 0;
const notificationRepo_1 = require("../../infrastructure/repositories/implementations/notificationRepo");
const notificationUseCase_1 = require("../../useCase/notificationUseCase");
const notificationRepo = new notificationRepo_1.NotificationRepo();
const notificationUseCase = new notificationUseCase_1.NotificationUseCase(notificationRepo);
class NotificationController {
    constructor() {
        Object.defineProperty(this, "getNotifications", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res
                            .status(401)
                            .json({ success: false, error: "User not authenticated" });
                        return;
                    }
                    const notifications = yield notificationUseCase.getNotifications(userId);
                    res.status(200).json({ success: true, data: notifications });
                }
                catch (error) {
                    console.error("Error fetching notifications:", error);
                    res
                        .status(500)
                        .json({ success: false, error: "Failed to fetch notifications" });
                }
            })
        });
        // Mark all notifications as read for the authenticated user
        Object.defineProperty(this, "markNotificationsAsRead", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        res
                            .status(401)
                            .json({ success: false, error: "User not authenticated" });
                        return;
                    }
                    yield notificationUseCase.markNotificationsAsRead(userId);
                    res
                        .status(200)
                        .json({ success: true, message: "All notifications marked as read" });
                }
                catch (error) {
                    console.error("Error marking notifications as read:", error);
                    res.status(500).json({
                        success: false,
                        error: "Failed to mark notifications as read",
                    });
                }
            })
        });
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notificationController.js.map