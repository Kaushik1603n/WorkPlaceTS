import mongoose, { ClientSession, Types } from "mongoose";
import { IpamentRepo } from "../../../../domain/interfaces/IpamentRepo";
import PaymentModel from "../../../../domain/models/PaymentModel";
import PaymentRequestModel from "../../../../domain/models/PaymentRequest";
import ProposalModel from "../../../../domain/models/Proposal";
import ProjectModel from "../../../../domain/models/Projects";
import WalletModel from "../../../../domain/models/Wallet";
import {
  IUserWallet,
  PaymentJobResponse,
  PaymentProposalResponse,
  PaymentResponseType,
  UpdatePaymentProposalResponse,
} from "../../../../domain/types/paymentTypes";

export class PaymentRepo implements IpamentRepo {
  async findProposal(
    milestoneId: string
  ): Promise<PaymentProposalResponse | null> {
    const proposal = await ProposalModel.findOne(
      { "milestones._id": milestoneId },
      {
        jobId: 1,
        job_Id: 1,
        freelancerId: 1,
        milestones: { $elemMatch: { _id: milestoneId } },
      }
    ).lean();

    if (!proposal) return null;

    return {
      jobId: proposal.jobId.toString(),
      job_Id: proposal.job_Id,
      freelancerId: proposal.freelancerId.toString(),
      milestones: proposal.milestones.map((m: any) => ({
        _id: m._id.toString(),
        title: m.title,
        description: m.description,
        amount: m.amount,
        dueDate: m.dueDate,
        status: m.status,
        paymentId: m.paymentId?.toString(),
        paymentRequestId: m.paymentRequestId?.toString(),
        deliverables: m.deliverables
          ? {
              links: m.deliverables.links,
              comments: m.deliverables.comments,
              submittedAt: m.deliverables.submittedAt,
              feedback: m.deliverables.feedback,
            }
          : undefined,
      })),
    };
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

  async createPayment(paymentData: object): Promise<void> {
    await PaymentModel.create(paymentData);
    return;
  }

  async findPayment(
    razorpay_order_id: string
  ): Promise<PaymentResponseType | null> {
    const payment = await PaymentModel.findOne({
      paymentGatewayId: razorpay_order_id,
    });

    return payment
      ? {
          _id: payment._id.toString(),
          jobId: payment.jobId,
          proposalId: payment.proposalId,
          milestoneId: payment.milestoneId,
          amount: payment.amount,
          platformFee: payment.platformFee,
          netAmount: payment.netAmount,
          status: payment.status,
          paymentGatewayId: payment.paymentGatewayId,
          clientId: payment.clientId.toString(),
          freelancerId: payment.freelancerId,
          paymentMethod: payment.paymentMethod,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        }
      : null;
  }

  async findPaymentAndUpdate(
    id: string,
    status: string,
    session: ClientSession
  ): Promise<void> {
    await PaymentModel.findByIdAndUpdate(
      id,
      {
        $set: { status: status },
      },
      { session }
    );
  }

  async updatePaymentRequest(
    milestoneId: Types.ObjectId,
    proposalId: Types.ObjectId,
    session: ClientSession
  ): Promise<void> {
    await PaymentRequestModel.findOneAndUpdate(
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
  }

  async findByIdAndUpdateProposal(
    milestoneId: Types.ObjectId,
    paymentId: string,
    session: ClientSession
  ): Promise<UpdatePaymentProposalResponse | null> {
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

    if (!proposal) return null;

    return {
      _id: proposal._id.toString(),
      freelancerId: proposal.freelancerId.toString(),
      jobId: proposal.jobId.toString(),
      job_Id: proposal.job_Id,
      coverLetter: proposal.coverLetter,
      budgetType: proposal.budgetType,
      bidAmount: proposal.bidAmount,
      estimatedTime: proposal.estimatedTime,
      workSamples: proposal.workSamples,
      PortfolioAttachments: proposal.PortfolioAttachments ?? [],
      milestones: proposal.milestones.map((m: any) => ({
        _id: m._id.toString(),
        title: m.title,
        description: m.description,
        amount: m.amount,
        dueDate: m.dueDate,
        status: m.status,
        paymentId: m.paymentId?.toString(),
        paymentRequestId: m.paymentRequestId?.toString(),
        deliverables: m.deliverables
          ? {
              links: m.deliverables.links ?? [],
              comments: m.deliverables.comments,
              submittedAt: m.deliverables.submittedAt,
              feedback: m.deliverables.feedback,
            }
          : undefined,
      })),
      payments: proposal.payments.map((p: any) => p.toString()),
      status: proposal.status,
      contractId: proposal.contractId?.toString(),
      agreeNDA: proposal.agreeNDA,
      agreeVideoCall: proposal.agreeVideoCall,
      createdAt: proposal.createdAt,
      updatedAt: proposal.updatedAt,
    };
  }

  async findJobById(
    jobId: Types.ObjectId,
    session: ClientSession
  ): Promise<PaymentJobResponse | null> {
    const job = await ProjectModel.findById(jobId).session(session).lean();
    if (!job) return null;

    return {
      _id: job._id.toString(),
      job_Id: job.job_Id,
      clientId: job.clientId.toString(),
      title: job.title,
      description: job.description,
    };
  }

  async totalPaidPayment(jobId: string, session: ClientSession): Promise<any> {    
    const totalPaid = await PaymentModel.aggregate([
      { $match: { jobId: new Types.ObjectId(jobId), status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).session(session);
   
    return totalPaid[0]?.total;
  }

  async updatePaymentStatus(
    jobId: string,
    paymentStatus: string,
    status: string,
    session: ClientSession
  ): Promise<void> {
    await ProjectModel.findByIdAndUpdate(
      jobId,
      {
        paymentStatus: paymentStatus,
        status,
      },
      { session }
    );
  }

  async updateFreelancerWallet(
    freelancerId: Types.ObjectId,
    netAmount: number,
    paymentId: string,
    title: string,
    session: ClientSession
  ): Promise<void> {
    await WalletModel.findOneAndUpdate(
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
      { upsert: true, new: true, session }
    );
  }

  async updateAdminWallet(
    platformFee: number,
    paymentId: string,
    title: string,
    session: ClientSession
  ): Promise<void> {
    await WalletModel.findOneAndUpdate(
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
  }

  async findPaymentByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<any> {
    const wallet = await WalletModel.findOne({
      userId: new Types.ObjectId(userId),
    }).lean<IUserWallet | null>();

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
