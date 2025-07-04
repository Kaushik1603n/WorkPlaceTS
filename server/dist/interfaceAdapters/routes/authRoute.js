"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const passport_1 = __importDefault(require("passport"));
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const authouter = express_1.default.Router();
const auth = new authControllers_1.AuthControllers();
authouter.post("/register", auth.register);
authouter.post("/verify-otp", auth.verifyOtp);
authouter.post("/resend-otp", auth.resendOtp);
authouter.post("/login", auth.login);
authouter.post("/refresh", auth.refresh);
authouter.post("/forgot-password", auth.forgotPass);
authouter.post("/verify-reset-otp", auth.resetPassVerifyOtp);
// authouter.get("/resend-otp", auth.resendOtp);
authouter.post("/reset-password", auth.resetPassword);
authouter.put("/changePass", authMiddleware_1.default, auth.changePassword);
authouter.put("/change-email", authMiddleware_1.default, auth.changeEmail);
authouter.put("/change-email/otp", authMiddleware_1.default, auth.emailVerificationOtp);
authouter.post("/logout", auth.logout);
authouter.get("/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
}));
authouter.get("/google/callback", passport_1.default.authenticate("google", {
    session: false,
}), auth.googleCallback);
authouter.get("/user", passport_1.default.authenticate("jwt", { session: false }), auth.getUser);
authouter.get("/get-user-details", authMiddleware_1.default, auth.getUserDetails);
authouter.post("/set-role", authMiddleware_1.default, auth.userRole);
exports.default = authouter;
//# sourceMappingURL=authRoute.js.map