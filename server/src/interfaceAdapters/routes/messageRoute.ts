import express from "express";
import authenticate from "../../middleware/authMiddleware";
import { createMessageDependencies } from "../dependencies/messageDependencies";

const messageRoute = express.Router();
const message = createMessageDependencies();

messageRoute.post("/newMessage", authenticate, message.sendMessage);
messageRoute.post("/getMessage", authenticate, message.getMessage);
messageRoute.get("/getlatest", authenticate, message.getLatestMessages);
messageRoute.post("/markMessagesRead", authenticate, message.markMessagesRead);
messageRoute.delete("/deletemsg/:id", authenticate, message.DeleteMsg);

export default messageRoute;