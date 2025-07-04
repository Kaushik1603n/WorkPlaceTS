"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.PaymentRepo = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PaymentModel_1 = __importDefault(require("../../../../domain/models/PaymentModel"));
const PaymentRequest_1 = __importDefault(require("../../../../domain/models/PaymentRequest"));
const Proposal_1 = __importDefault(require("../../../../domain/models/Proposal"));
const Projects_1 = __importDefault(require("../../../../domain/models/Projects"));
const Wallet_1 = __importDefault(require("../../../../domain/models/Wallet"));
class PaymentRepo {
    findProposal(milestoneId) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposal = yield Proposal_1.default.findOne({ "milestones._id": milestoneId }, {
                jobId: 1,
                job_Id: 1,
                freelancerId: 1,
                milestones: { $elemMatch: { _id: milestoneId } },
            }).lean();
            return proposal;
        });
    }
    findPaymentRequest(paymentRequestId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentRequest = yield PaymentRequest_1.default.findOne({
                _id: paymentRequestId,
                clientId,
                status: "pending",
            })
                .populate("proposalId")
                .lean();
            return paymentRequest;
        });
    }
    createPayment(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pay = yield PaymentModel_1.default.create(paymentData);
            return pay;
        });
    }
    findPayment(razorpay_order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield PaymentModel_1.default.findOne({
                paymentGatewayId: razorpay_order_id,
            });
            return payment;
        });
    }
    findPaymentAndUpdate(id, status, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield PaymentModel_1.default.findByIdAndUpdate(id, {
                $set: { status: status },
            }, { session });
            return payment;
        });
    }
    updatePaymentRequest(milestoneId, proposalId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentRequest = yield PaymentRequest_1.default.findOneAndUpdate({
                milestoneId: milestoneId,
                proposalId: proposalId,
            }, {
                $set: {
                    status: "paid",
                },
            }, { session });
            return paymentRequest;
        });
    }
    findByIdAndUpdateProposal(milestoneId, paymentId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const proposal = yield Proposal_1.default.findOneAndUpdate({
                "milestones._id": milestoneId,
            }, {
                $set: {
                    "milestones.$.status": "paid",
                    "milestones.$.paymentId": paymentId,
                },
                $push: {
                    payments: paymentId,
                },
            }, { new: true, session });
            return proposal;
        });
    }
    findJobById(jobId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield Projects_1.default.findById(jobId).session(session);
            return job;
        });
    }
    totalPaidPayment(jobId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const totalPaid = yield PaymentModel_1.default.aggregate([
                { $match: { jobId: jobId, status: "completed" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]).session(session);
            return (_a = totalPaid[0]) === null || _a === void 0 ? void 0 : _a.total;
        });
    }
    updatePaymentStatus(jobId, paymentStatus, status, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield Projects_1.default.findByIdAndUpdate(jobId, {
                paymentStatus: paymentStatus,
                status,
            }, { session });
            return job;
        });
    }
    updateFreelancerWallet(freelancerId, netAmount, paymentId, title, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const freelancerWallet = yield Wallet_1.default.findOneAndUpdate({ userId: freelancerId }, {
                $inc: { balance: netAmount },
                $push: {
                    transactions: {
                        type: "credit",
                        amount: netAmount,
                        description: `Payment for milestone: ${title}`,
                        paymentId: paymentId,
                    },
                },
            }, { upsert: true, new: true, session } // Create wallet if it doesn't exist
            );
            return freelancerWallet;
        });
    }
    updateAdminWallet(platformFee, paymentId, title, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const freelancerWallet = yield Wallet_1.default.findOneAndUpdate({ userId: "admin" }, {
                $inc: { balance: platformFee },
                $push: {
                    transactions: {
                        type: "credit",
                        amount: platformFee,
                        description: `Payment for milestone: ${title}`,
                        paymentId: paymentId,
                    },
                },
            }, { upsert: true, new: true, session });
            return freelancerWallet;
        });
    }
    findPaymentByUserId(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const wallet = yield Wallet_1.default.findOne({
                userId: new mongoose_1.Types.ObjectId(userId),
            }).lean();
            const payment = yield PaymentRequest_1.default.find({
                freelancerId: new mongoose_1.Types.ObjectId(userId),
            })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();
            const totalCount = yield PaymentRequest_1.default.countDocuments({
                freelancerId: new mongoose_1.Types.ObjectId(userId),
            });
            const totalPages = Math.ceil(totalCount / limit);
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            const totalAmount = yield PaymentRequest_1.default.aggregate([
                {
                    $match: {
                        freelancerId: objectId,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount" },
                    },
                },
            ]);
            const netAmount = yield PaymentRequest_1.default.aggregate([
                {
                    $match: {
                        freelancerId: objectId,
                    },
                },
                {
                    $group: {
                        _id: null,
                        netAmount: { $sum: "$netAmount" },
                    },
                },
            ]);
            const platformFee = yield PaymentRequest_1.default.aggregate([
                {
                    $match: {
                        freelancerId: objectId,
                    },
                },
                {
                    $group: {
                        _id: null,
                        platformFee: { $sum: "$platformFee" },
                    },
                },
            ]);
            const pendingAmount = yield PaymentRequest_1.default.aggregate([
                {
                    $match: {
                        freelancerId: objectId,
                        status: "pending",
                    },
                },
                {
                    $group: {
                        _id: null,
                        pendingAmount: { $sum: "$amount" },
                    },
                },
            ]);
            return {
                wallet,
                payment,
                totalPages,
                totalCount,
                totalAmount: ((_a = totalAmount[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0,
                netAmount: ((_b = netAmount[0]) === null || _b === void 0 ? void 0 : _b.netAmount) || 0,
                platformFee: ((_c = platformFee[0]) === null || _c === void 0 ? void 0 : _c.platformFee) || 0,
                pendingAmount: ((_d = pendingAmount[0]) === null || _d === void 0 ? void 0 : _d.pendingAmount) || 0,
            };
        });
    }
}
exports.PaymentRepo = PaymentRepo;
//# sourceMappingURL=paymentRepo.js.map