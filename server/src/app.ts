import express, { Application } from "express";
import connectDB from "./infrastructure/database/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import "./infrastructure/passport/passport";
import passport from "passport";
import authouter from "./interfaceAdapters/routes/authRoute";
import profileRoute from "./interfaceAdapters/routes/clientRoutes/profileRoute";
// import bodyParser from "body-parser";

export class App {
  private app: Application;
  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }
  private setupRoutes() {
    this.app.use("/api/auth", authouter);
    this.app.use("/api/client", profileRoute);
  }

  private setupMiddlewares() {
    this.app.use(express.json({ limit: "300mb" }));
 this.app.use(express.urlencoded({ extended: true }));
    // this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(morgan("dev"));

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
