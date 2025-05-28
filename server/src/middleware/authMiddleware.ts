import {  RequestHandler } from "express";
import { verifyAccessToken } from "../shared/utils/jwt";

const authenticate: RequestHandler = async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
console.log(1);

if (!accessToken) {
    console.log(2);
    res.status(401).json({ success: false, message: "Access denied" });
    return
  }
  
  try {
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;
    console.log(3);
    next();
  } catch (error: any) {
    console.log(4);
    if (error.name === "TokenExpiredError") {
       res.status(401).json({
        success: false,
        message: "Access token expired",
        shouldRefresh: true,
      });
      return
    }
     res.status(401).json({ success: false, message: "Invalid token" });
     return
  }
};

export default authenticate;
