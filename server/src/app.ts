import express, { Application } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import connectDB from "./infrastructure/database/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import "./infrastructure/passport/passport";
import passport from "passport";
import authouter from "./interfaceAdapters/routes/authRoute";
import profileRoute from "./interfaceAdapters/routes/clientRoutes/profileRoute";
import freelancerProfileRoute from "./interfaceAdapters/routes/freelancerRoutes/freelancerProfile";
import userRoutes from "./interfaceAdapters/routes/adminRoutes/usersRoute";
import clientProject from "./interfaceAdapters/routes/clientRoutes/projectRoute";
import marketPlaceRoute from "./interfaceAdapters/routes/marketPlace/marketPlaceRoute";
import notificationRout from "./interfaceAdapters/routes/notification";
import proposalRout from "./interfaceAdapters/routes/marketPlace/proposalRoute";
import paymentRoutes from "./interfaceAdapters/routes/marketPlace/paymentRoute";

export class App {
  private app: Application;
  private httpServer: any;
  private io: Server;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupSocketIO();
  }

  private setupMiddlewares() {
    this.app.use(express.json({ limit: "300mb" }));
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

  private setupRoutes() {
    this.app.use("/api/auth", authouter);
    this.app.use("/api/client", profileRoute);
    this.app.use("/api/client/project", clientProject);
    this.app.use("/api/freelancer", freelancerProfileRoute);
    this.app.use("/api", notificationRout);
    this.app.use("/api/jobs", marketPlaceRoute);
    this.app.use("/api/proposal", proposalRout);
    this.app.use("/api/payments", paymentRoutes);
    this.app.use("/api/admin", userRoutes);
  }

  private setupSocketIO() {
    const connectedUsers: { [key: string]: string } = {};

    this.io.on("connection", (socket: Socket) => {
      console.log("Client connected:", socket.id);

      socket.on("register", (userId: string) => {
        connectedUsers[userId] = socket.id;
        console.log(`User ${userId} registered with socket ${socket.id}`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        for (const userId in connectedUsers) {
          if (connectedUsers[userId] === socket.id) {
            delete connectedUsers[userId];
            break;
          }
        }
      });
    });

    // Make io accessible to routes
    this.app.set("io", this.io);
    this.app.set("connectedUsers", connectedUsers);
  }

  public async listen(port: number) {
    await connectDB();
    this.httpServer.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  }
}
