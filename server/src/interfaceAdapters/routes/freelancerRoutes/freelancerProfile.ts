import express from "express";
import { freelancerProfileControllers } from "../../controllers/freelancerController/profileController"; 
import authenticate from "../../../middleware/authMiddleware";

const profile =new freelancerProfileControllers()
const freelancerProfileRoute = express.Router();

freelancerProfileRoute.put("/profile",authenticate, profile.profileEdit);
freelancerProfileRoute.get("/profile",authenticate, profile.profileDetails);

freelancerProfileRoute.get("/client",authenticate, profile.client);
// ticket
freelancerProfileRoute.get("/tickets",authenticate, profile.getTickets);

freelancerProfileRoute.get("/totalCount",authenticate, profile.totalcount);
freelancerProfileRoute.get("/totalearnings",authenticate, profile.totalEarnings);
freelancerProfileRoute.get("/dashboardproject",authenticate, profile.dashboardProject);
export default freelancerProfileRoute;
