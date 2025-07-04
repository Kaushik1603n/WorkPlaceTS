"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controllers/messageController");
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const messageRoute = express_1.default.Router();
const message = new messageController_1.MessageController();
messageRoute.post("/newMessage", authMiddleware_1.default, message.sendMessage);
messageRoute.post("/getMessage", authMiddleware_1.default, message.getMessage);
messageRoute.get("/getlatest", authMiddleware_1.default, message.getLatestMessages);
messageRoute.post("/markMessagesRead", authMiddleware_1.default, message.markMessagesRead);
messageRoute.delete("/deletemsg/:id", authMiddleware_1.default, message.DeleteMsg);
exports.default = messageRoute;
//# sourceMappingURL=messageRoute.js.map