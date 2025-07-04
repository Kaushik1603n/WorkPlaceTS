"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../../../middleware/authMiddleware"));
const adminProjectController_1 = require("../../controllers/adminControllers/adminProjectController");
const adminProject = new adminProjectController_1.AdminProjectController();
const adminProjectRoute = express_1.default.Router();
adminProjectRoute.get("/active-projects", authMiddleware_1.default, adminProject.getActiveProject);
adminProjectRoute.get("/posted-projects", authMiddleware_1.default, adminProject.getPostedProject);
adminProjectRoute.get("/completed-projects", authMiddleware_1.default, adminProject.getCompletedProject);
adminProjectRoute.get("/project-details/:jobId", authMiddleware_1.default, adminProject.ProjectDetails);
exports.default = adminProjectRoute;
//# sourceMappingURL=adminProjectRoute.js.map