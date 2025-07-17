"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userDataController_1 = require("../../controllers/adminControllers/userDataController");
const adminMiddleware_1 = __importDefault(require("../../../middleware/adminMiddleware"));
const userData = new userDataController_1.UserDataController();
const userRoutes = express_1.default.Router();
userRoutes.get("/get-freelancer-profile", adminMiddleware_1.default, userData.getFreelancerData);
userRoutes.get("/get-client-profile", adminMiddleware_1.default, userData.getClientData);
userRoutes.get("/get-user-profile", adminMiddleware_1.default, userData.getUsersData);
userRoutes.put("/user-action", adminMiddleware_1.default, userData.userAction);
userRoutes.get("/get-client-details/:userId", adminMiddleware_1.default, userData.clientDetails);
userRoutes.get("/get-freelancer-details/:userId", adminMiddleware_1.default, userData.freelancerDetails);
userRoutes.put("/user-verification/:userId", adminMiddleware_1.default, userData.userVerification);
userRoutes.get("/tickets", adminMiddleware_1.default, userData.AllReport);
userRoutes.patch("/tickets/:ticketId", adminMiddleware_1.default, userData.TicketStatus);
userRoutes.post("/tickets/:ticketId/comments", adminMiddleware_1.default, userData.TicketStatusComment);
userRoutes.get("/usergrowthdata", adminMiddleware_1.default, userData.UserGrowthData);
userRoutes.get("/topfreelancer", adminMiddleware_1.default, userData.TopFreelancer);
userRoutes.get("/alljobcount", adminMiddleware_1.default, userData.AllJobcount);
userRoutes.get("/alljobdetails", adminMiddleware_1.default, userData.AllJobDetails);
userRoutes.get("/revenuedata", adminMiddleware_1.default, userData.RevenueData);
userRoutes.get("/payments", adminMiddleware_1.default, userData.Payments);
exports.default = userRoutes;
//# sourceMappingURL=usersRoute.js.map