import { RequestHandler } from "express";
import { AppError } from "../../../shared/utils/appError";
import { IPaymentUseCase } from "../../../useCase/Interface/IPaymentUseCase";

export class PaymentController {
  private paymentUseCase:IPaymentUseCase;
  constructor(usecase:IPaymentUseCase){
    this.paymentUseCase=usecase;
  }
  
  milestonePayment: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user = req.user as { userId: string; email: string };
      const userId = user.userId;

      if (!userId) {
        throw new AppError("User Not Authenticated", 401);
      }
      const { paymentRequestId, milestoneId, amount, receipt } = req.body;

      const order = await this.paymentUseCase.createPaymentUseCase(
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

      const result = await this.paymentUseCase.verifyPayment(
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
      } = await this.paymentUseCase.getPaymentsUseCase(userId, page, limit);

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
