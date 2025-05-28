import express from "express";
import { AuthControllers } from "../controllers/authControllers";
import passport from "passport";
import authenticate from "../../middleware/authMiddleware";

const router = express.Router();
const auth = new AuthControllers();

router.post("/register", auth.register);
router.post("/verify-otp", auth.verifyOtp);
router.post("/resend-otp", auth.resendOtp);
router.post("/login", auth.login);
router.post("/refresh", auth.refresh);

router.post("/forgot-password", auth.forgotPass);
router.post("/verify-reset-otp", auth.resetPassVerifyOtp);
// router.get("/resend-otp", auth.resendOtp);
router.post("/reset-password", auth.changePassword);

router.post("/logout", auth.logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  auth.googleCallback
);
router.get("/user", passport.authenticate("jwt", { session: false }), auth.getUser);
router.post("/set-role",authenticate,  auth.userRole);

export default router;
