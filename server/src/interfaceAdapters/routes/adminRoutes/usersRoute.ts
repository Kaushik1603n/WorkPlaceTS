import express from "express";
import { UserDataController } from "../../controllers/adminControllers/userDataController";
import adminAuthenticate from "../../../middleware/adminMiddleware";

const userData = new UserDataController();
const userRoutes = express.Router();

userRoutes.get(
  "/get-freelancer-profile",
  adminAuthenticate,
  userData.getFreelancerData
);
userRoutes.get("/get-client-profile", adminAuthenticate, userData.getClientData);
userRoutes.get("/get-user-profile", adminAuthenticate, userData.getUsersData);
userRoutes.put("/user-action", adminAuthenticate, userData.userAction);
userRoutes.get(
  "/get-client-details/:userId",
  adminAuthenticate,
  userData.clientDetails
);
userRoutes.get(
  "/get-freelancer-details/:userId",
  adminAuthenticate,
  userData.freelancerDetails
);
userRoutes.put(
  "/user-verification/:userId",
  adminAuthenticate,
  userData.userVerification
);

userRoutes.get("/tickets", adminAuthenticate, userData.AllReport);
userRoutes.patch("/tickets/:ticketId", adminAuthenticate, userData.TicketStatus);
userRoutes.post(
  "/tickets/:ticketId/comments",
  adminAuthenticate,
  userData.TicketStatusComment
);

userRoutes.get("/usergrowthdata", adminAuthenticate, userData.UserGrowthData);
userRoutes.get("/topfreelancer", adminAuthenticate, userData.TopFreelancer);
userRoutes.get("/alljobcount", adminAuthenticate, userData.AllJobcount);
userRoutes.get("/alljobdetails", adminAuthenticate, userData.AllJobDetails);
userRoutes.get("/revenuedata", adminAuthenticate, userData.RevenueData);

userRoutes.get("/payments", adminAuthenticate, userData.Payments);

export default userRoutes;
