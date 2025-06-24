import express from "express";
import { ProjectController } from "../../controllers/clientController/projectController";
import authenticate from "../../../middleware/authMiddleware";

const project =new ProjectController()
const clientProject = express.Router();

clientProject.post("/new-project",authenticate, project.newProject);
clientProject.get("/get-project",authenticate, project.getAllProject);

clientProject.get("/tickets",authenticate, project.getAllTickets);
clientProject.post("/tickets/:ticketId/comments",authenticate, project.TicketComment);

export default clientProject;
