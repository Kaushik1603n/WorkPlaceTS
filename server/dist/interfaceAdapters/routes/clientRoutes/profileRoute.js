"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileControllers_1 = require("../../controllers/clientController/profileControllers");
const authMiddleware_1 = __importDefault(require("../../../middleware/authMiddleware"));
const profile = new profileControllers_1.profileCondroller();
const profileRoute = express_1.default.Router();
profileRoute.post("/edit-profile", authMiddleware_1.default, profile.profileEdit);
profileRoute.get("/get-profile", authMiddleware_1.default, profile.profileDetails);
profileRoute.get("/freelancer", authMiddleware_1.default, profile.freelancer);
// dashboard Route
profileRoute.get("/hiringprojects", authMiddleware_1.default, profile.HiringProjects);
profileRoute.get("/financialdata", authMiddleware_1.default, profile.financialData);
exports.default = profileRoute;
//# sourceMappingURL=profileRoute.js.map