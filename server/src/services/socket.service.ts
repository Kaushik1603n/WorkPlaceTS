import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket,  } from "socket.io";

export class SocketService {
  private io: SocketIOServer;
  private userSocketMap = new Map<string, string>(); // userId -> socketId

    // constructor() {
    //   // Dummy initialization - will be properly initialized in `initialize()`
    //   this.io = new SocketIOServer(new HttpServer(), {} as ServerOptions);
    // }

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  initialize(server: HttpServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log(`New socket connected: ${socket.id}`);

      // Assuming you send userId during connection
      const userId =
        socket.handshake.auth.userId || socket.handshake.query.userId;
      if (userId && typeof userId === "string") {
        this.userSocketMap.set(userId, socket.id);
      }

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        this.userSocketMap.delete(userId);
      });
    });
  }

  sendToUser(userId: string, event: string, payload: any): void {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, payload);
    } else {
      console.warn(`User ${userId} not connected via socket`);
    }
  }
}

// export const socketService = new SocketService();
