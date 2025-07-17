"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminProjectController_1 = require("../../controllers/adminControllers/adminProjectController");
const adminMiddleware_1 = __importDefault(require("../../../middleware/adminMiddleware"));
const adminProject = new adminProjectController_1.AdminProjectController();
const adminProjectRoute = express_1.default.Router();
adminProjectRoute.get("/active-projects", adminMiddleware_1.default, adminProject.getActiveProject);
adminProjectRoute.get("/posted-projects", adminMiddleware_1.default, adminProject.getPostedProject);
adminProjectRoute.get("/completed-projects", adminMiddleware_1.default, adminProject.getCompletedProject);
adminProjectRoute.get("/project-details/:jobId", adminMiddleware_1.default, adminProject.ProjectDetails);
exports.default = adminProjectRoute;
//# sourceMappingURL=adminProjectRoute.js.map