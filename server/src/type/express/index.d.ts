// src/types/express/index.d.ts
import { UserDocument } from "../../models/User";

interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
declare global {
  namespace Express {
    interface Request {
      user?:  JwtPayload | UserDocument;
    }
  }
}
