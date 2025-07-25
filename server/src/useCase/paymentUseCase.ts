// import mongoose from "mongoose";
import mongoose from "mongoose";
import { PaymentRepo } from "../infrastructure/repositories/implementations/marketPlace/paymentRepo";
import { createOrder } from "../shared/utils/razorpay";
import crypto from "crypto";
import { AppError } from "../shared/utils/appError";

export class PaymentUseCase {
  constructor(private payment: PaymentRepo) {
    this.payment = payment;
  }

  async createPaymentUseCase(
    paymentRequestId: string,
    amount: number,
    receipt: string,
    milestoneId: string,
    userId: string
  ) {
    const paymentRequest = await this.payment.findPaymentRequest(
      paymentRequestId,
      userId
    );
    if (!paymentRequest) {
      throw new AppError("Payment request not found or unauthorized", 404);
    }

    const paymentMilestoneId = paymentRequest.milestoneId;
    const paymentAmount = paymentRequest.amount;

    if (milestoneId.toString() !== paymentMilestoneId.toString()) {
      throw new AppError("Milestone Payment not found", 404);
    }
    if (Number(amount) !== Number(paymentAmount)) {
      throw new AppError("Amount Mismatch", 400);
    }

    const options = {
      amount: paymentRequest.amount * 100,
      currency: "INR",
      receipt: receipt,
      payment_capture: 1,
    };
    const order = await createOrder(options);

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

    await this.payment.createPayment(paymentData);

    return order;
  }

  async verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const shasum = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (shasum !== razorpay_signature) {
        throw new AppError("Invalid payment signature",400);
      }

      const payment = await this.payment.findPayment(razorpay_order_id);
      if (!payment) {
        throw new AppError("Payment not found",404);
      }

      await this.payment.findPaymentAndUpdate(
        payment._id,
        "completed",
        session
      );

      await this.payment.updatePaymentRequest(
        payment.milestoneId,
        payment.proposalId,
        session
      );

      const proposal = await this.payment.findByIdAndUpdateProposal(
        payment.milestoneId,
        payment._id,
        session
      );

      if (!proposal) {
        throw new AppError("Proposal not found",404);
      }

      const title =
        proposal.milestones.find(
          (mile) => mile._id.toString() === payment.milestoneId.toString()
        )?.title || "";
      const totalMilestoneAmount = proposal!.milestones.reduce(
        (sum, m) => sum + m.amount,
        0
      );
      const job = await this.payment.findJobById(payment.jobId, session);

      if (!job) {
        throw new AppError("Job not found",404);
      }

      const totalPaid = await this.payment.totalPaidPayment(job._id, session);

      const paymentStatus =
        totalPaid >= totalMilestoneAmount ? "fully-paid" : "partially-paid";
      const status =
        totalPaid >= totalMilestoneAmount ? "completed" : "in-progress";

      await this.payment.updatePaymentStatus(
        job._id,
        paymentStatus,
        status,
        session
      );

      await this.payment.updateFreelancerWallet(
        payment.freelancerId,
        payment.netAmount,
        payment._id,
        title,
        session
      );
      await this.payment.updateAdminWallet(
        payment.platformFee,
        payment._id,
        title,
        session
      );

      // console.log(freelancerWallet);
      // console.log(adminWallet);

      // Notify freelancer

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  async getPaymentsUseCase(userId: string, page: number, limit: number) {
    const paymentList = await this.payment.findPaymentByUserId(
      userId,
      page,
      limit
    );
    return paymentList;
  }
}
