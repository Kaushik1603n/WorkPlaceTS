import { RequestHandler } from "express";
import { PaymentUseCase } from "../../../useCase/paymentUseCase";
import { PaymentRepo } from "../../../infrastructure/repositories/implementations/marketPlace/paymentRepo";
import { AppError } from "../../../shared/utils/appError";

const payment = new PaymentRepo();
const paymentlCase = new PaymentUseCase(payment);

export class PaymentController {
  milestonePayment: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!userId) {
        throw new AppError("User Not Authenticated", 401);
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
      // res.status(500).json({
      //   success: false,
      //   error:
      //     error instanceof Error ? error.message : "Failed to get proposal",
      // });
      throw error;
    }
  };
  verifyPayment: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!userId) {
        // throw new Error("User Not Authenticated");
        throw new AppError("User Not Authenticated", 401);
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
      throw error;
      // res.status(500).json({
      //   success: false,
      //   error:
      //     error instanceof Error ? error.message : "Failed to get proposal",
      // });
    }
  };
  getPayments: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!userId) {
        // throw new Error("User Not Authenticated");
        throw new AppError("User Not Authenticated", 401);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const {
        wallet,
        payment,
        totalPages,
        totalAmount,
        netAmount,
        platformFee,
        pendingAmount,
        totalCount,
      } = await paymentlCase.getPaymentsUseCase(userId, page, limit);

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
    } catch (error) {
      // console.error(error);
      throw error;
      // res.status(500).json({
      //   success: false,
      //   error:
      //     error instanceof Error ? error.message : "Failed to get proposal",
      // });
    }
  };
}
