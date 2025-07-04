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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connection.on("connected", () => {
        console.log("Mongoose connected to DB");
    });
    mongoose_1.default.connection.on("error", (err) => {
        console.error("Mongoose connection error:", err);
    });
    try {
        yield mongoose_1.default.connect(`${process.env.MONGO_URI}/WorkPlace`, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB Connected");
        process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.connection.close();
            console.log("Mongoose connection closed (app termination)");
            process.exit(0);
        }));
    }
    catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
});
exports.default = connectDB;
//# sourceMappingURL=db.js.map