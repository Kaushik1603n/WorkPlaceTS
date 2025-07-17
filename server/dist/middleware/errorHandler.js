"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler = (err, _req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(", ");
    }
    if (err.code === "11000") {
        statusCode = 400;
        message = "Duplicate key error: Resource already exists";
    }
    console.error(`Error: ${message}, Status: ${statusCode}`);
    res.status(statusCode).json(Object.assign({ success: false, error: message }, (process.env.NODE_ENV === "development" && { stack: err.stack })));
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map