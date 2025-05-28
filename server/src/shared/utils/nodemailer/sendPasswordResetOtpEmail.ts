import nodemailer from "nodemailer";

export const sendPasswordResetOtpEmail = async (email: string, name: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
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
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
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

    await transporter.sendMail(mailOptions);
    console.log("Password reset OTP email sent successfully");
  } catch (error) {
    console.error("Error sending password reset OTP email:", error);
    throw error;
  }
};