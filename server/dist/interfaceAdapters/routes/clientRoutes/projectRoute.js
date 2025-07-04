"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../../controllers/clientController/projectController");
const authMiddleware_1 = __importDefault(require("../../../middleware/authMiddleware"));
const project = new projectController_1.ProjectController();
const clientProject = express_1.default.Router();
clientProject.post("/new-project", authMiddleware_1.default, project.newProject);
clientProject.get("/get-project", authMiddleware_1.default, project.getAllProject);
clientProject.get("/tickets", authMiddleware_1.default, project.getAllTickets);
clientProject.post("/tickets/:ticketId/comments", authMiddleware_1.default, project.TicketComment);
exports.default = clientProject;
//# sourceMappingURL=projectRoute.js.map