import express, { Application } from "express";
import connectDB from "./infrastructure/database/db";
import cookieParser from "cookie-parser";
import router from "./interfaceAdapters/routes/authRoute";
import cors from "cors";
import "./infrastructure/passport/passport";
import passport from "passport";

export class App {
  private app: Application;
  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }
  private setupRoutes() {
    this.app.use("/api/auth", router);
  }

  private setupMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: "http://localhost:5173", 
        credentials: true,
      })
    );
    this.app.use(passport.initialize());
  }
  public async listen(port: number) {
    await connectDB();
    this.app.listen(port, () => {
      console.log(`sever started on port ${port}`);
    });
  }
}
