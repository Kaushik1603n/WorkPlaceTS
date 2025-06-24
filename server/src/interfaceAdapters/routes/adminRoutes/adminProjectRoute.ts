import express from "express";
import authenticate from "../../../middleware/authMiddleware";
import { AdminProjectController } from "../../controllers/adminControllers/adminProjectController";

const adminProject = new AdminProjectController();
const adminProjectRoute = express.Router();

adminProjectRoute.get("/active-projects", authenticate, adminProject.getActiveProject);
adminProjectRoute.get("/posted-projects", authenticate, adminProject.getPostedProject);
adminProjectRoute.get("/completed-projects", authenticate, adminProject.getCompletedProject);
adminProjectRoute.get("/project-details/:jobId", authenticate, adminProject.ProjectDetails);

export default adminProjectRoute;
