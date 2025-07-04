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
const passport_jwt_1 = require("passport-jwt");
const User_1 = __importDefault(require("../../domain/models/User")); // Ensure this has TypeScript types
const cookieExtractor = (req) => {
    var _a;
    return ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || null;
};
const jwtStrategy = (passport) => {
    const opts = {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    };
    passport.use(new passport_jwt_1.Strategy(opts, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findById(payload.userId);
            if (user)
                done(null, user);
            else
                done(null, false);
        }
        catch (error) {
            done(error, false);
        }
    })));
};
exports.default = jwtStrategy;
//# sourceMappingURL=jwtStrategy.js.map