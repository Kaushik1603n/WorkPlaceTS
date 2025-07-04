"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileController_1 = require("../../controllers/freelancerController/profileController");
const authMiddleware_1 = __importDefault(require("../../../middleware/authMiddleware"));
const profile = new profileController_1.freelancerProfileControllers();
const freelancerProfileRoute = express_1.default.Router();
freelancerProfileRoute.post("/edit-profile", authMiddleware_1.default, profile.profileEdit);
freelancerProfileRoute.get("/get-profile", authMiddleware_1.default, profile.profileDetails);
freelancerProfileRoute.get("/client", authMiddleware_1.default, profile.client);
// ticket
freelancerProfileRoute.get("/tickets", authMiddleware_1.default, profile.getTickets);
freelancerProfileRoute.get("/totalCount", authMiddleware_1.default, profile.totalcount);
freelancerProfileRoute.get("/totalearnings", authMiddleware_1.default, profile.totalEarnings);
freelancerProfileRoute.get("/dashboardproject", authMiddleware_1.default, profile.dashboardProject);
exports.default = freelancerProfileRoute;
//# sourceMappingURL=freelancerProfile.js.map