export interface IPaymentUseCase {
  createPaymentUseCase(
    paymentRequestId: string,
    amount: number,
    receipt: string,
    milestoneId: string,
    userId: string
  ): Promise<any>;
  verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
  ): Promise<void>;
  getPaymentsUseCase(userId: string, page: number, limit: number): Promise<any>;
}
