"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../../../middleware/authMiddleware"));
const userDataController_1 = require("../../controllers/adminControllers/userDataController");
const userData = new userDataController_1.UserDataController();
const userRoutes = express_1.default.Router();
userRoutes.get("/get-freelancer-profile", authMiddleware_1.default, userData.getFreelancerData);
userRoutes.get("/get-client-profile", authMiddleware_1.default, userData.getClientData);
userRoutes.get("/get-user-profile", authMiddleware_1.default, userData.getUsersData);
userRoutes.put("/user-action", authMiddleware_1.default, userData.userAction);
userRoutes.get("/get-client-details/:userId", authMiddleware_1.default, userData.clientDetails);
userRoutes.get("/get-freelancer-details/:userId", authMiddleware_1.default, userData.freelancerDetails);
userRoutes.put("/user-verification/:userId", authMiddleware_1.default, userData.userVerification);
userRoutes.get("/tickets", authMiddleware_1.default, userData.AllReport);
userRoutes.patch("/tickets/:ticketId", authMiddleware_1.default, userData.TicketStatus);
userRoutes.post("/tickets/:ticketId/comments", authMiddleware_1.default, userData.TicketStatusComment);
userRoutes.get("/usergrowthdata", authMiddleware_1.default, userData.UserGrowthData);
userRoutes.get("/topfreelancer", authMiddleware_1.default, userData.TopFreelancer);
userRoutes.get("/alljobcount", authMiddleware_1.default, userData.AllJobcount);
userRoutes.get("/alljobdetails", authMiddleware_1.default, userData.AllJobDetails);
userRoutes.get("/revenuedata", authMiddleware_1.default, userData.RevenueData);
userRoutes.get("/payments", authMiddleware_1.default, userData.Payments);
exports.default = userRoutes;
//# sourceMappingURL=usersRoute.js.map