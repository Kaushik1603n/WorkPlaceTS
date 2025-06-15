import { RequestHandler } from "express";
import { verifyAccessToken } from "../shared/utils/jwt";
// import UserModel from "../domain/models/User";


interface DecodedToken {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
const authenticate: RequestHandler = async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    res.status(401).json({ success: false, message: "Access denied" });
    return;
  }

  try {
    console.log("auth");
    
    const decoded = verifyAccessToken(accessToken) as DecodedToken;
    req.user = decoded;

    // const userData = await UserModel.findById(decoded.userId);

    // if (!userData) {
    //   console.log("not user");
      
    //   res.status(401).json({ success: false, message: "User not found" });
    //   return;
    // }
    
  

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
