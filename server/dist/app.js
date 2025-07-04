"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./infrastructure/database/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
require("./infrastructure/passport/passport");
const passport_1 = __importDefault(require("passport"));
const authRoute_1 = __importDefault(require("./interfaceAdapters/routes/authRoute"));
const profileRoute_1 = __importDefault(require("./interfaceAdapters/routes/clientRoutes/profileRoute"));
const freelancerProfile_1 = __importDefault(require("./interfaceAdapters/routes/freelancerRoutes/freelancerProfile"));
const usersRoute_1 = __importDefault(require("./interfaceAdapters/routes/adminRoutes/usersRoute"));
const projectRoute_1 = __importDefault(require("./interfaceAdapters/routes/clientRoutes/projectRoute"));
const marketPlaceRoute_1 = __importDefault(require("./interfaceAdapters/routes/marketPlace/marketPlaceRoute"));
const notification_1 = __importDefault(require("./interfaceAdapters/routes/notification"));
const proposalRoute_1 = __importDefault(require("./interfaceAdapters/routes/marketPlace/proposalRoute"));
const paymentRoute_1 = __importDefault(require("./interfaceAdapters/routes/marketPlace/paymentRoute"));
const messageRoute_1 = __importDefault(require("./interfaceAdapters/routes/messageRoute"));
const messageRepo_1 = require("./infrastructure/repositories/implementations/messageRepo");
const messageUseCase_1 = require("./useCase/messageUseCase");
const adminProjectRoute_1 = __importDefault(require("./interfaceAdapters/routes/adminRoutes/adminProjectRoute"));
const errorHandler_1 = require("./middleware/errorHandler");
class App {
    constructor() {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "httpServer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "io", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.app = (0, express_1.default)();
        this.httpServer = (0, http_1.createServer)(this.app);
        this.io = new socket_io_1.Server(this.httpServer, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandler();
        this.setupSocketIO();
    }
    setupMiddlewares() {
        this.app.use(express_1.default.json({ limit: "300mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, cors_1.default)({
            origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost", "http://127.0.0.1"],
            credentials: true,
        }));
        this.app.use(passport_1.default.initialize());
    }
    setupRoutes() {
        this.app.use("/api/auth", authRoute_1.default);
        this.app.use("/api/client", profileRoute_1.default);
        this.app.use("/api/freelancer", freelancerProfile_1.default);
        this.app.use("/api", notification_1.default);
        this.app.use("/api/client/project", projectRoute_1.default);
        this.app.use("/api/jobs", marketPlaceRoute_1.default);
        this.app.use("/api/proposal", proposalRoute_1.default);
        this.app.use("/api/payments", paymentRoute_1.default);
        this.app.use("/api/message", messageRoute_1.default);
        this.app.use("/api/admin", usersRoute_1.default);
        this.app.use("/api/admin/project", adminProjectRoute_1.default);
    }
    setupErrorHandler() {
        this.app.use(errorHandler_1.errorHandler); // Register error handler
    }
    setupSocketIO() {
        const messageRepo = new messageRepo_1.MessageRepo();
        const messageUseCase = new messageUseCase_1.MessageUseCase(messageRepo);
        const connectedUsers = {};
        this.io.on("connection", (socket) => {
            console.log("Client connected:", socket.id);
            socket.on("register", (userId) => {
                connectedUsers[userId] = socket.id;
                console.log(`User ${userId} registered with socket ${socket.id}`);
            });
            socket.on("sendMessage", (message) => __awaiter(this, void 0, void 0, function* () {
                if (!message.senderId || !message.contactId) {
                    console.log("Error: Invalid message format", message);
                    return;
                }
                try {
                    const savedMessage = yield messageUseCase.sendMessageUseCase(Object.assign(Object.assign({}, message), { timestamp: message.timestamp || new Date().toISOString(), isRead: false }));
                    const recipientSocketId = connectedUsers[message.contactId];
                    if (recipientSocketId) {
                        this.io.to(recipientSocketId).emit("message", savedMessage);
                    }
                    this.io.to(socket.id).emit("message", Object.assign(Object.assign({}, savedMessage), { isRead: true }));
                }
                catch (error) {
                    console.error("Error saving message:", error);
                }
            }));
            socket.on("sendMedia", (message) => __awaiter(this, void 0, void 0, function* () {
                if (!message.senderId || !message.contactId) {
                    console.log("Error: Invalid message format", message);
                    return;
                }
                try {
                    const savedMessage = yield messageUseCase.sendMediaUseCase(Object.assign(Object.assign({}, message), { timestamp: message.timestamp || new Date().toISOString(), isRead: false }));
                    const recipientSocketId = connectedUsers[message.contactId];
                    if (recipientSocketId) {
                        this.io.to(recipientSocketId).emit("message", savedMessage);
                    }
                    this.io.to(socket.id).emit("message", Object.assign(Object.assign({}, savedMessage), { isRead: true }));
                }
                catch (error) {
                    console.error("Error saving message:", error);
                }
            }));
            socket.on("markMessagesRead", (_a) => __awaiter(this, [_a], void 0, function* ({ userId, contactId, }) {
                try {
                    yield messageUseCase.markMessagesReadUseCase(userId, contactId);
                    const recipientSocketId = connectedUsers[userId];
                    const senderSocketId = connectedUsers[contactId];
                    if (recipientSocketId) {
                        this.io.to(recipientSocketId).emit("messagesRead", { contactId });
                    }
                    if (senderSocketId) {
                        this.io
                            .to(senderSocketId)
                            .emit("messagesRead", { contactId: userId });
                    }
                }
                catch (error) {
                    console.error("Error marking messages as read:", error);
                }
            }));
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
    listen(port) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.default)();
            this.httpServer.listen(port, () => {
                console.log(`Server started on port ${port}`);
            });
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map