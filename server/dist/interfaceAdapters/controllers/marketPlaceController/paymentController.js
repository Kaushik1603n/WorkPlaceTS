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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const paymentUseCase_1 = require("../../../useCase/paymentUseCase");
const paymentRepo_1 = require("../../../infrastructure/repositories/implementations/marketPlace/paymentRepo");
const appError_1 = require("../../../shared/utils/appError");
const payment = new paymentRepo_1.PaymentRepo();
const paymentlCase = new paymentUseCase_1.PaymentUseCase(payment);
class PaymentController {
    constructor() {
        Object.defineProperty(this, "milestonePayment", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        throw new appError_1.AppError("User Not Authenticated", 401);
                    }
                    const { paymentRequestId, milestoneId, amount, receipt } = req.body;
                    const order = yield paymentlCase.createPaymentUseCase(paymentRequestId, amount, receipt, milestoneId, userId);
                    res.status(200).json({
                        message: "Proposals fetched successfully",
                        data: order,
                    });
                }
                catch (error) {
                    // res.status(500).json({
                    //   success: false,
                    //   error:
                    //     error instanceof Error ? error.message : "Failed to get proposal",
                    // });
                    throw error;
                }
            })
        });
        Object.defineProperty(this, "verifyPayment", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        // throw new Error("User Not Authenticated");
                        throw new appError_1.AppError("User Not Authenticated", 401);
                    }
                    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
                    const result = yield paymentlCase.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
                    res.status(200).json({
                        message: "Verifyed Payment successfully",
                        data: result,
                    });
                }
                catch (error) {
                    throw error;
                    // res.status(500).json({
                    //   success: false,
                    //   error:
                    //     error instanceof Error ? error.message : "Failed to get proposal",
                    // });
                }
            })
        });
        Object.defineProperty(this, "getPayments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.user;
                    const userId = user.userId;
                    if (!userId) {
                        // throw new Error("User Not Authenticated");
                        throw new appError_1.AppError("User Not Authenticated", 401);
                    }
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 5;
                    const { wallet, payment, totalPages, totalAmount, netAmount, platformFee, pendingAmount, totalCount, } = yield paymentlCase.getPaymentsUseCase(userId, page, limit);
                    res.status(200).json({
                        message: "Payment fetched successfully",
                        data: wallet,
                        payment,
                        totalPages,
                        totalAmount,
                        netAmount,
                        platformFee,
                        pendingAmount,
                        totalCount,
                    });
                }
                catch (error) {
                    // console.error(error);
                    throw error;
                    // res.status(500).json({
                    //   success: false,
                    //   error:
                    //     error instanceof Error ? error.message : "Failed to get proposal",
                    // });
                }
            })
        });
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=paymentController.js.map