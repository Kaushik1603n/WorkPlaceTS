import { RequestHandler } from "express";
import { PaymentUseCase } from "../../../useCase/paymentUseCase";
import { PaymentRepo } from "../../../infrastructure/repositories/implementations/marketPlace/paymentRepo";

const payment = new PaymentRepo();
const paymentlCase = new PaymentUseCase(payment);

export class PaymentController {
  milestonePayment: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!userId) {
        throw new Error("User Not Authenticated");
      }
      const { paymentRequestId, milestoneId, amount, receipt } = req.body;

      const order = await paymentlCase.createPaymentUseCase(
        paymentRequestId,
        amount,
        receipt,
        milestoneId,
        userId
      );

      res.status(200).json({
        message: "Proposals fetched successfully",
        data: order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get proposal",
      });
    }
  };
  verifyPayment: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!userId) {
        throw new Error("User Not Authenticated");
      }
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      const result = await paymentlCase.verifyPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      res.status(200).json({
        message: "Verifyed Payment successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get proposal",
      });
    }
  };
  getPayments: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      const {wallet,payment} = await paymentlCase.getPaymentsUseCase(userId);

      res.status(200).json({
        message: "Payment fetched successfully",
        data: wallet,
        payment
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get proposal",
      });
    }
  };
}
