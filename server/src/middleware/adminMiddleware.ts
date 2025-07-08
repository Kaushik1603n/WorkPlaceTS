import { RequestHandler } from "express";
import { verifyAccessToken } from "../shared/utils/jwt";
import UserModel from "../domain/models/User";

interface DecodedToken {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
const adminAuthenticate: RequestHandler = async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    res.status(401).json({ success: false, message: "Access denied" });
    return;
  }

  try {
    const decoded = verifyAccessToken(accessToken) as DecodedToken;
    req.user = decoded;

    const userData = await UserModel.findById(decoded.userId);

    if (userData?.status === "block") {
      res
        .status(403)
        .json({
          success: false,
          message: "Your account has been blocked. Please contact support.",
        });
      return;
    }
    if (userData?.role === "admin") {
      res
        .status(403)
        .json({
          success: false,
          message: "Your can not access this route only for admin.",
        });
      return;
    }

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Access token expired",
        shouldRefresh: true,
      });
      return;
    }
    res.status(401).json({ success: false, message: "Invalid token" });
    return;
  }
};

export default adminAuthenticate;
