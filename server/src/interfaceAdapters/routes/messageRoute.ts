import express from "express";
import { MessageController } from "../controllers/messageController";
import authenticate from "../../middleware/authMiddleware";
const messageRoute= express.Router();
const message =new MessageController()


messageRoute.post("/newMessage",authenticate,message.sendMessage);
messageRoute.post("/getMessage",authenticate,message.getMessage);
messageRoute.get('/getlatest', authenticate, message.getLatestMessages);


export default messageRoute

