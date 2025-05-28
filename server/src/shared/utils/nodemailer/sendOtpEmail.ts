import nodemailer from "nodemailer";
export const sendOtpEmail = async (email: string, name: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${name},</h2>
          <p>Thank you for registering. Please use the following OTP to verify your account:</p>
          <h3 style="background: #f4f4f4; padding: 10px; display: inline-block;">${otp}</h3>
          <p>This OTP will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};
