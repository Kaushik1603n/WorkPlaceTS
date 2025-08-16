import express from "express";
import authenticate from "../../middleware/authMiddleware";
import { createNotificationDependencies } from "../dependencies/notificationDependencies";

const notify =createNotificationDependencies()
const notificationRout = express.Router();


notificationRout.get("/notifications",authenticate, notify.getNotifications);
notificationRout.patch("/notifications/mark-read",authenticate, notify.markNotificationsAsRead);


export default notificationRout;
