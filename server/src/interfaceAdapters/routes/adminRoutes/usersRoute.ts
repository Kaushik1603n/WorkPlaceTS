import express from "express";
import authenticate from "../../../middleware/authMiddleware";
import { UserDataController } from "../../controllers/adminControllers/userDataController";

const userData = new UserDataController();
const userRoutes = express.Router();

userRoutes.get(
  "/get-freelancer-profile",
  authenticate,
  userData.getFreelancerData
);
userRoutes.get("/get-client-profile", authenticate, userData.getClientData);
userRoutes.get("/get-user-profile", authenticate, userData.getUsersData);
userRoutes.put("/user-action", authenticate, userData.userAction);
userRoutes.get(
  "/get-client-details/:userId",
  authenticate,
  userData.clientDetails
);
userRoutes.get(
  "/get-freelancer-details/:userId",
  authenticate,
  userData.freelancerDetails
);
userRoutes.put(
  "/user-verification/:userId",
  authenticate,
  userData.userVerification
);

userRoutes.get("/tickets", authenticate, userData.AllReport);
userRoutes.patch("/tickets/:ticketId", authenticate, userData.TicketStatus);
userRoutes.post(
  "/tickets/:ticketId/comments",
  authenticate,
  userData.TicketStatusComment
);

userRoutes.get("/usergrowthdata", authenticate, userData.UserGrowthData);
userRoutes.get("/topfreelancer", authenticate, userData.TopFreelancer);
userRoutes.get("/alljobcount", authenticate, userData.AllJobcount);
userRoutes.get("/alljobdetails", authenticate, userData.AllJobDetails);
userRoutes.get("/revenuedata", authenticate, userData.RevenueData);

userRoutes.get("/payments", authenticate, userData.Payments);

export default userRoutes;
