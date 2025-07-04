"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
class SocketService {
    // constructor() {
    //   // Dummy initialization - will be properly initialized in `initialize()`
    //   this.io = new SocketIOServer(new HttpServer(), {} as ServerOptions);
    // }
    constructor(io) {
        Object.defineProperty(this, "io", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userSocketMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        }); // userId -> socketId
        this.io = io;
    }
    initialize(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:3000",
                methods: ["GET", "POST"],
            },
        });
        this.io.on("connection", (socket) => {
            console.log(`New socket connected: ${socket.id}`);
            // Assuming you send userId during connection
            const userId = socket.handshake.auth.userId || socket.handshake.query.userId;
            if (userId && typeof userId === "string") {
                this.userSocketMap.set(userId, socket.id);
            }
            socket.on("disconnect", () => {
                console.log(`Socket disconnected: ${socket.id}`);
                this.userSocketMap.delete(userId);
            });
        });
    }
    sendToUser(userId, event, payload) {
        const socketId = this.userSocketMap.get(userId);
        if (socketId) {
            this.io.to(socketId).emit(event, payload);
        }
        else {
            console.warn(`User ${userId} not connected via socket`);
        }
    }
}
exports.SocketService = SocketService;
// export const socketService = new SocketService();
//# sourceMappingURL=socket.service.js.map