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
const jwt_1 = require("../shared/utils/jwt");
const User_1 = __importDefault(require("../domain/models/User"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const accessToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
        ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
    if (!accessToken) {
        res.status(401).json({ success: false, message: "Access denied" });
        return;
    }
    try {
        const decoded = (0, jwt_1.verifyAccessToken)(accessToken);
        req.user = decoded;
        const userData = yield User_1.default.findById(decoded.userId);
        if ((userData === null || userData === void 0 ? void 0 : userData.status) === "block") {
            res
                .status(403)
                .json({
                success: false,
                message: "Your account has been blocked. Please contact support.",
            });
            return;
        }
        next();
    }
    catch (error) {
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
});
exports.default = authenticate;
//# sourceMappingURL=authMiddleware.js.map