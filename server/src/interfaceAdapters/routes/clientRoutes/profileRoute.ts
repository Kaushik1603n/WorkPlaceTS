import express from "express";
import { profileCondroller } from "../../controllers/clientController/profileControllers";
import authenticate from "../../../middleware/authMiddleware";

const profile =new profileCondroller()
const profileRoute = express.Router();

profileRoute.post("/edit-profile",authenticate, profile.profileEdit);
profileRoute.get("/get-profile",authenticate, profile.profileDetails);

profileRoute.get("/freelancer",authenticate, profile.freelancer);



export default profileRoute;
