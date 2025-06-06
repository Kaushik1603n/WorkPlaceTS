import express from "express";
import authenticate from "../../middleware/authMiddleware";
import { NotificationController } from "../controllers/notificationController";

const notify =new NotificationController()
const notificationRout = express.Router();


notificationRout.get("/notifications",authenticate, notify.getNotifications);
notificationRout.patch("/notifications/mark-read",authenticate, notify.markNotificationsAsRead);


export default notificationRout;
