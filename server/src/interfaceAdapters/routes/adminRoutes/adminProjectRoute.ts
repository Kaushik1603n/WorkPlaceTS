import express from "express";
// import { AdminProjectController } from "../../controllers/adminControllers/adminProjectController";
import adminAuthenticate from "../../../middleware/adminMiddleware";
import { createAdminProjectDependencies } from "../../dependencies/adminProjectDependencies";

const adminProject = createAdminProjectDependencies();
const adminProjectRoute = express.Router();

adminProjectRoute.get("/active-projects", adminAuthenticate, adminProject.getActiveProject);
adminProjectRoute.get("/posted-projects", adminAuthenticate, adminProject.getPostedProject);
adminProjectRoute.get("/completed-projects", adminAuthenticate, adminProject.getCompletedProject);
adminProjectRoute.get("/project-details/:jobId", adminAuthenticate, adminProject.ProjectDetails);

export default adminProjectRoute;
