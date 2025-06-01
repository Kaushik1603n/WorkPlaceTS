import express from "express";
import { freelancerProfileControllers } from "../../controllers/freelancerController/profileController"; 
import authenticate from "../../../middleware/authMiddleware";

const profile =new freelancerProfileControllers()
const freelancerProfileRoute = express.Router();

freelancerProfileRoute.post("/edit-profile",authenticate, profile.profileEdit);
freelancerProfileRoute.get("/get-profile",authenticate, profile.profileDetails);


export default freelancerProfileRoute;
