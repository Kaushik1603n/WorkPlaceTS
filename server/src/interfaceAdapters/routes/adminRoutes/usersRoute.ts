import express from "express";
import authenticate from "../../../middleware/authMiddleware";
import { UserDataController } from "../../controllers/adminControllers/userDataController";

const userData =new UserDataController()
const userRoutes = express.Router();

userRoutes.get("/get-freelancer-profile",authenticate, userData.getFreelancerData);
userRoutes.get("/get-client-profile",authenticate, userData.getClientData);
userRoutes.get("/get-user-profile",authenticate, userData.getUsersData);


export default userRoutes;
