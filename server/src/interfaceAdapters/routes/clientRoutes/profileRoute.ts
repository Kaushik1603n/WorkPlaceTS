import express from "express";
// import { profileCondroller } from "../../controllers/clientController/profileControllers";
import authenticate from "../../../middleware/authMiddleware";
import { createMarketplaceDependencies } from "../../dependencies/clientProfileDependencies";
const profile =createMarketplaceDependencies()
const profileRoute = express.Router();

profileRoute.put("/profile",authenticate, profile.profileEdit.bind(profile));
profileRoute.get("/profile",authenticate, profile.profileDetails.bind(profile));

profileRoute.get("/freelancer",authenticate, profile.freelancer.bind(profile));

// dashboard Route
profileRoute.get("/hiringprojects",authenticate, profile.HiringProjects.bind(profile));
profileRoute.get("/financialdata",authenticate, profile.financialData.bind(profile));

export default profileRoute;
