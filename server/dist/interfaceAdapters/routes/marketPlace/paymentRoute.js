"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../../../middleware/authMiddleware"));
const paymentController_1 = require("../../controllers/marketPlaceController/paymentController");
const paymentRoutes = express_1.default.Router();
const payment = new paymentController_1.PaymentController();
paymentRoutes.post("/order", authMiddleware_1.default, payment.milestonePayment);
paymentRoutes.post("/verify", authMiddleware_1.default, payment.verifyPayment);
paymentRoutes.get("/get-payment", authMiddleware_1.default, payment.getPayments);
exports.default = paymentRoutes;
//# sourceMappingURL=paymentRoute.js.map