import { ClientSession, Types } from "mongoose";
import {
  PaymentJobResponse,
  PaymentProposalResponse,
  PaymentResponseType,
  UpdatePaymentProposalResponse,
} from "../types/paymentTypes";

export interface IpamentRepo {
  findProposal(milestoneId: string): Promise<PaymentProposalResponse | null>;
  findPaymentRequest(paymentRequestId: string, clientId: string): Promise<any>;
  createPayment(paymentData: object): Promise<void>;
  findPayment(razorpay_order_id: string): Promise<PaymentResponseType | null>;
  findPaymentAndUpdate(
    id: string,
    status: string,
    session: ClientSession
  ): Promise<void>;
  updatePaymentRequest(
    milestoneId: Types.ObjectId,
    proposalId: Types.ObjectId,
    session: ClientSession
  ): Promise<void>;
  findByIdAndUpdateProposal(
    milestoneId: Types.ObjectId,
    paymentId: string,
    session: ClientSession
  ): Promise<UpdatePaymentProposalResponse | null>;
  findJobById(jobId: Types.ObjectId, session: ClientSession): Promise<PaymentJobResponse | null>;
  totalPaidPayment(jobId: string, session: ClientSession): Promise<any>;
  updatePaymentStatus(
    jobId: string,
    paymentStatus: string,
    status: string,
    session: ClientSession
  ): Promise<void>;
  updateFreelancerWallet(
    freelancerId: Types.ObjectId,
    netAmount: number,
    paymentId: string,
    title: string,
    session: ClientSession
  ): Promise<void>;
  updateAdminWallet(
    platformFee: number,
    paymentId: string,
    title: string,
    session: ClientSession
  ): Promise<void>;
  findPaymentByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<any>;
}

