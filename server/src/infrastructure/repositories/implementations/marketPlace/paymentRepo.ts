import { ClientSession, Types } from "mongoose";
import { IpamentRepo } from "../../../../domain/interfaces/IpamentRepo";
import PaymentModel from "../../../../domain/models/PaymentModel";
import PaymentRequestModel from "../../../../domain/models/PaymentRequest";
import ProposalModel from "../../../../domain/models/Proposal";
import ProjectModel from "../../../../domain/models/Projects";
import WalletModel from "../../../../domain/models/Wallet";

export class PaymentRepo implements IpamentRepo {
  async findProposal(milestoneId: string) {
    const proposal = await ProposalModel.findOne(
      { "milestones._id": milestoneId },
      {
        jobId: 1,
        job_Id: 1,
        freelancerId: 1,
        milestones: { $elemMatch: { _id: milestoneId } },
      }
    ).lean();
    return proposal;
  }
  async findPaymentRequest(paymentRequestId: string, clientId: string) {
    const paymentRequest = await PaymentRequestModel.findOne({
      _id: paymentRequestId,
      clientId,
      status: "pending",
    })
      .populate("proposalId")
      .lean();
    return paymentRequest;
  }
  async createPayment(paymentData: object) {
    const pay = await PaymentModel.create(paymentData);

    return pay;
  }

  async findPayment(razorpay_order_id: string) {
    const payment = await PaymentModel.findOne({
      paymentGatewayId: razorpay_order_id,
    });
    return payment;
  }

  async findPaymentAndUpdate(
    id: string,
    status: string,
    session: ClientSession
  ) {
    const payment = await PaymentModel.findByIdAndUpdate(
      id,
      {
        $set: { status: status },
      },
      { session }
    );
    return payment;
  }

  async updatePaymentRequest(
    milestoneId: Types.ObjectId,
    proposalId: Types.ObjectId,
    session: ClientSession
  ) {
    const paymentRequest = await PaymentRequestModel.findOneAndUpdate(
      {
        milestoneId: milestoneId,
        proposalId: proposalId,
      },
      {
        $set: {
          status: "paid",
        },
      },
      { session }
    );
    return paymentRequest;
  }

  async findByIdAndUpdateProposal(
    milestoneId: Types.ObjectId,
    paymentId: string,
    session: ClientSession
  ) {
    const proposal = await ProposalModel.findOneAndUpdate(
      {
        "milestones._id": milestoneId,
      },
      {
        $set: {
          "milestones.$.status": "paid",
          "milestones.$.paymentId": paymentId,
        },
        $push: {
          payments: paymentId,
        },
      },
      { new: true, session }
    );

    return proposal;
  }

  async findJobById(jobId: Types.ObjectId, session: ClientSession) {
    const job = await ProjectModel.findById(jobId).session(session);
    return job;
  }

  async totalPaidPayment(jobId: string, session: ClientSession) {
    const totalPaid = await PaymentModel.aggregate([
      { $match: { jobId: jobId, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).session(session);

    return totalPaid[0]?.total;
  }

  async updatePaymentStatus(
    jobId: string,
    paymentStatus: string,
    session: ClientSession
  ) {
    const job = await ProjectModel.findByIdAndUpdate(
      jobId,
      {
        paymentStatus: paymentStatus,
      },
      { session }
    );

    return job;
  }
  async updateFreelancerWallet(
    freelancerId: Types.ObjectId,
    netAmount: number,
    paymentId: string,
    title: string,
    session: ClientSession
  ) {
    const freelancerWallet = await WalletModel.findOneAndUpdate(
      { userId: freelancerId },
      {
        $inc: { balance: netAmount * 80 },
        $push: {
          transactions: {
            type: "credit",
            amount: netAmount * 80,
            description: `Payment for milestone: ${title}`,
            paymentId: paymentId,
          },
        },
      },
      { upsert: true, new: true, session } // Create wallet if it doesn't exist
    );
    return freelancerWallet;
  }
  async updateAdminWallet(
    platformFee: number,
    paymentId: string,
    title: string,
    session: ClientSession
  ) {
    const freelancerWallet = await WalletModel.findOneAndUpdate(
      { userId: "admin" },
      {
        $inc: { balance: platformFee * 80 },
        $push: {
          transactions: {
            type: "credit",
            amount: platformFee * 80,
            description: `Payment for milestone: ${title}`,
            paymentId: paymentId,
          },
        },
      },
      { upsert: true, new: true, session }
    );
    return freelancerWallet;
  }

  async findPaymentByUserId(userId: string) {
    const wallet = await WalletModel.findOne({
      userId: new Types.ObjectId(userId),
    }).lean<IWallet | null>();
    const payment = await PaymentRequestModel.find({
      freelancerId: new Types.ObjectId(userId),
    }).sort({createdAt:-1}).lean();

    

    return {wallet,payment};
  }
}

interface IWalletTransaction {
  type: "credit" | "debit"; 
  amount: number;
  description: string; 
  paymentId?: Types.ObjectId; 
  createdAt: Date;
}

export interface IWallet  {
  _id: Types.ObjectId;
  userId: Types.ObjectId | "admin"; 
  balance: number;
  currency: string; 
  transactions: IWalletTransaction[]; 
  createdAt: Date;
  updatedAt: Date;
}
