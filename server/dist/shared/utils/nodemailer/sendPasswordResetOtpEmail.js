"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendPasswordResetOtpEmail = (email, name, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: `"Work Place" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset OTP",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #2c3e50; text-align: center;">Password Reset Request</h2>
          <p style="font-size: 16px;">Hello ${name},</p>
          <p style="font-size: 16px;">We received a request to reset your password. Use the following OTP to proceed:</p>
          
          <div style="background: #f8f9fa; border-radius: 4px; padding: 15px; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0; color: #2c3e50; letter-spacing: 2px;">${otp}</h3>
          </div>
          
          <p style="font-size: 14px; color: #7f8c8d; text-align: center;">
            This OTP will expire in <strong>15 minutes</strong>.
          </p>
          
          <p style="font-size: 14px; color: #7f8c8d;">
            If you didn't request this, please secure your account by changing your password immediately.
          </p>
          
          </div>
          `,
        };
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error("Error sending password reset OTP email:", error);
        throw error;
    }
});
exports.sendPasswordResetOtpEmail = sendPasswordResetOtpEmail;
//# sourceMappingURL=sendPasswordResetOtpEmail.js.map