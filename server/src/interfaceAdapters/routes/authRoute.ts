import express from "express";
import { AuthControllers } from "../controllers/authControllers";
import passport from "passport";
import authenticate from "../../middleware/authMiddleware";

const authouter = express.Router();
const auth = new AuthControllers();

authouter.post("/register", auth.register);
authouter.post("/verify-otp", auth.verifyOtp);
authouter.post("/resend-otp", auth.resendOtp);
authouter.post("/login", auth.login);
authouter.post("/refresh", auth.refresh);

authouter.post("/forgot-password", auth.forgotPass);
authouter.post("/verify-reset-otp", auth.resetPassVerifyOtp);
// authouter.get("/resend-otp", auth.resendOtp);
authouter.post("/reset-password", auth.changePassword);

authouter.post("/logout", auth.logout);

authouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

authouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  auth.googleCallback
);
authouter.get("/user", passport.authenticate("jwt", { session: false }), auth.getUser);
authouter.get("/get-user-details",authenticate,  auth.getUserDetails);
authouter.post("/set-role",authenticate,  auth.userRole);

export default authouter;
