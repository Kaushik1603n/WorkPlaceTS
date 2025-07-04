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
exports.PaymentUseCase = void 0;
// import mongoose from "mongoose";
const mongoose_1 = __importDefault(require("mongoose"));
const razorpay_1 = require("../shared/utils/razorpay");
const crypto_1 = __importDefault(require("crypto"));
const appError_1 = require("../shared/utils/appError");
class PaymentUseCase {
    constructor(payment) {
        Object.defineProperty(this, "payment", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: payment
        });
        this.payment = payment;
    }
    createPaymentUseCase(paymentRequestId, amount, receipt, milestoneId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentRequest = yield this.payment.findPaymentRequest(paymentRequestId, userId);
            if (!paymentRequest) {
                throw new appError_1.AppError("Payment request not found or unauthorized", 404);
            }
            const paymentMilestoneId = paymentRequest.milestoneId;
            const paymentAmount = paymentRequest.amount;
            if (milestoneId.toString() !== paymentMilestoneId.toString()) {
                throw new appError_1.AppError("Milestone Payment not found", 404);
            }
            if (Number(amount) !== Number(paymentAmount)) {
                throw new appError_1.AppError("Amount Mismatch", 400);
            }
            const options = {
                amount: paymentRequest.amount * 100,
                currency: "INR",
                receipt: receipt,
                payment_capture: 1,
            };
            const order = yield (0, razorpay_1.createOrder)(options);
            const platformFee = paymentRequest.amount * 0.1; // 10% fee
            const netAmount = paymentRequest.amount - platformFee;
            const paymentData = {
                jobId: paymentRequest.jobId,
                proposalId: paymentRequest.proposalId,
                milestoneId: paymentRequest.milestoneId,
                amount: paymentRequest.amount,
                platformFee,
                netAmount,
                status: "pending",
                paymentGatewayId: order.id,
                clientId: userId,
                freelancerId: paymentRequest.freelancerId,
                paymentMethod: "razorpay",
            };
            yield this.payment.createPayment(paymentData);
            return order;
        });
    }
    verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const shasum = crypto_1.default
                    .createHmac("sha256", process.env.RAZORPAY_SECRET)
                    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                    .digest("hex");
                if (shasum !== razorpay_signature) {
                    throw new appError_1.AppError("Invalid payment signature", 400);
                }
                const payment = yield this.payment.findPayment(razorpay_order_id);
                if (!payment) {
                    throw new appError_1.AppError("Payment not found", 404);
                }
                yield this.payment.findPaymentAndUpdate(payment._id, "completed", session);
                yield this.payment.updatePaymentRequest(payment.milestoneId, payment.proposalId, session);
                const proposal = yield this.payment.findByIdAndUpdateProposal(payment.milestoneId, payment._id, session);
                if (!proposal) {
                    throw new appError_1.AppError("Proposal not found", 404);
                }
                const title = ((_a = proposal.milestones.find((mile) => mile._id.toString() === payment.milestoneId.toString())) === null || _a === void 0 ? void 0 : _a.title) || "";
                const totalMilestoneAmount = proposal.milestones.reduce((sum, m) => sum + m.amount, 0);
                const job = yield this.payment.findJobById(payment.jobId, session);
                if (!job) {
                    throw new appError_1.AppError("Job not found", 404);
                }
                const totalPaid = yield this.payment.totalPaidPayment(job._id, session);
                const paymentStatus = totalPaid >= totalMilestoneAmount ? "fully-paid" : "partially-paid";
                const status = totalPaid >= totalMilestoneAmount ? "completed" : "in-progress";
                yield this.payment.updatePaymentStatus(job._id, paymentStatus, status, session);
                yield this.payment.updateFreelancerWallet(payment.freelancerId, payment.netAmount, payment._id, title, session);
                yield this.payment.updateAdminWallet(payment.platformFee, payment._id, title, session);
                // console.log(freelancerWallet);
                // console.log(adminWallet);
                // Notify freelancer
                yield session.commitTransaction();
                session.endSession();
            }
            catch (err) {
                yield session.abortTransaction();
                session.endSession();
                throw err;
            }
        });
    }
    getPaymentsUseCase(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentList = yield this.payment.findPaymentByUserId(userId, page, limit);
            return paymentList;
        });
    }
}
exports.PaymentUseCase = PaymentUseCase;
//# sourceMappingURL=paymentUseCase.js.map