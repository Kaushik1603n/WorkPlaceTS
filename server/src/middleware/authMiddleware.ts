import { RequestHandler } from "express";
import { verifyAccessToken } from "../shared/utils/jwt";

const authenticate: RequestHandler = async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    res.status(401).json({ success: false, message: "Access denied" });
    return;
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;

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

export default authenticate;
