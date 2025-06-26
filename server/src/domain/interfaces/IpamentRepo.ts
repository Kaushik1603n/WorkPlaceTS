import { ClientSession, Types } from "mongoose";

export interface IpamentRepo {
  findProposal(milestoneId: string): Promise<any>;
  findPaymentRequest(paymentRequestId: string, clientId: string): Promise<any>;
  createPayment(paymentData: object): Promise<any>;
  findPayment(razorpay_order_id: string): Promise<any>;
  findPaymentAndUpdate(
    id: string,
    status: string,
    session: ClientSession
  ): Promise<any>;
  updatePaymentRequest(
    milestoneId: Types.ObjectId,
    proposalId: Types.ObjectId,
    session: ClientSession
  ): Promise<any>;
  findByIdAndUpdateProposal(
    milestoneId: Types.ObjectId,
    paymentId: string,
    session: ClientSession
  ): Promise<any>;
  findJobById(jobId: Types.ObjectId, session: ClientSession): Promise<any>;
  totalPaidPayment(jobId: string, session: ClientSession): Promise<any>;
  updatePaymentStatus(
    jobId: string,
    paymentStatus: string,
    status: string,
    session: ClientSession
  ): Promise<any>;
  updateFreelancerWallet(
    freelancerId: Types.ObjectId,
    netAmount: number,
    paymentId: string,
    title: string,
    session: ClientSession
  ): Promise<any>;
  updateAdminWallet(
    platformFee: number,
    paymentId: string,
    title: string,
    session: ClientSession
  ): Promise<any>;
  findPaymentByUserId(userId: string,page:number,limit:number): Promise<any>;
}
