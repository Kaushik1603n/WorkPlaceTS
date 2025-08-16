import express from "express";
import authenticate from "../../../middleware/authMiddleware";
import { createFreelancerProfileDependencies } from "../../dependencies/freelancerProfileDependencies";

const profile =createFreelancerProfileDependencies()
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
