import express from "express";
import { MessageController } from "../controllers/messageController";
import authenticate from "../../middleware/authMiddleware";
const measseageRoute= express.Router();
const message =new MessageController()

console.log(message);

measseageRoute.post("/newMessage",authenticate,message.sendMessage);
measseageRoute.post("/getMessage",authenticate,message.getMessage);


export default measseageRoute

