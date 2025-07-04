"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const notificationController_1 = require("../controllers/notificationController");
const notify = new notificationController_1.NotificationController();
const notificationRout = express_1.default.Router();
notificationRout.get("/notifications", authMiddleware_1.default, notify.getNotifications);
notificationRout.patch("/notifications/mark-read", authMiddleware_1.default, notify.markNotificationsAsRead);
exports.default = notificationRout;
//# sourceMappingURL=notification.js.map