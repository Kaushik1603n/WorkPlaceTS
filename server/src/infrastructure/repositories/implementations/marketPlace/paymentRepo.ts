import mongoose, { ClientSession, Types } from "mongoose";
import { IpamentRepo } from "../../../../domain/interfaces/IpamentRepo";
import PaymentModel from "../../../../domain/models/PaymentModel";
import PaymentRequestModel from "../../../../domain/models/PaymentRequest";
import ProposalModel from "../../../../domain/models/Proposal";
import ProjectModel from "../../../../domain/models/Projects";
import WalletModel from "../../../../domain/models/Wallet";

export class PaymentRepo implements IpamentRepo {
  async findProposal(milestoneId: string): Promise<any> {
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
  async findPaymentRequest(
    paymentRequestId: string,
    clientId: string
  ): Promise<any> {
    const paymentRequest = await PaymentRequestModel.findOne({
      _id: paymentRequestId,
      clientId,
      status: "pending",
    })
      .populate("proposalId")
      .lean();
    return paymentRequest;
  }
  async createPayment(paymentData: object): Promise<any> {
    const pay = await PaymentModel.create(paymentData);

    return pay;
  }

  async findPayment(razorpay_order_id: string): Promise<any> {
    const payment = await PaymentModel.findOne({
      paymentGatewayId: razorpay_order_id,
    });
    return payment;
  }

  async findPaymentAndUpdate(
    id: string,
    status: string,
    session: ClientSession
  ): Promise<any> {
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
  ): Promise<any> {
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

  async findJobById(
    jobId: Types.ObjectId,
    session: ClientSession
  ): Promise<any> {
    const job = await ProjectModel.findById(jobId).session(session);
    return job;
  }

  async totalPaidPayment(jobId: string, session: ClientSession): Promise<any> {
    const totalPaid = await PaymentModel.aggregate([
      { $match: { jobId: jobId, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).session(session);

    return totalPaid[0]?.total;
  }

  async updatePaymentStatus(
    jobId: string,
    paymentStatus: string,
    status: string,
    session: ClientSession
  ): Promise<any> {
    const job = await ProjectModel.findByIdAndUpdate(
      jobId,
      {
        paymentStatus: paymentStatus,
        status,
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
  ): Promise<any> {
    const freelancerWallet = await WalletModel.findOneAndUpdate(
      { userId: freelancerId },
      {
        $inc: { balance: netAmount },
        $push: {
          transactions: {
            type: "credit",
            amount: netAmount,
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
  ): Promise<any> {
    const freelancerWallet = await WalletModel.findOneAndUpdate(
      { userId: "admin" },
      {
        $inc: { balance: platformFee },
        $push: {
          transactions: {
            type: "credit",
            amount: platformFee,
            description: `Payment for milestone: ${title}`,
            paymentId: paymentId,
          },
        },
      },
      { upsert: true, new: true, session }
    );
    return freelancerWallet;
  }

  async findPaymentByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<any> {
    const wallet = await WalletModel.findOne({
      userId: new Types.ObjectId(userId),
    }).lean<IWallet | null>();
    const payment = await PaymentRequestModel.find({
      freelancerId: new Types.ObjectId(userId),
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const totalCount = await PaymentRequestModel.countDocuments({
      freelancerId: new Types.ObjectId(userId),
    });
    const totalPages = Math.ceil(totalCount / limit);

    const objectId = new mongoose.Types.ObjectId(userId);
    const totalAmount = await PaymentRequestModel.aggregate([
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
    const netAmount = await PaymentRequestModel.aggregate([
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
    const platformFee = await PaymentRequestModel.aggregate([
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
    const pendingAmount = await PaymentRequestModel.aggregate([
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
      totalAmount: totalAmount[0]?.totalAmount || 0,
      netAmount: netAmount[0]?.netAmount || 0,
      platformFee: platformFee[0]?.platformFee || 0,
      pendingAmount: pendingAmount[0]?.pendingAmount || 0,
    };
  }
}

interface IWalletTransaction {
  type: "credit" | "debit";
  amount: number;
  description: string;
  paymentId?: Types.ObjectId;
  createdAt: Date;
}

export interface IWallet {
  _id: Types.ObjectId;
  userId: Types.ObjectId | "admin";
  balance: number;
  currency: string;
  transactions: IWalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}
