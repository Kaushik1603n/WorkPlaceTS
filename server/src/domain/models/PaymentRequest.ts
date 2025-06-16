import mongoose, { Document, Schema, Types } from "mongoose";

interface IPaymentRequest extends Document {
  jobId: Types.ObjectId;
  proposalId: Types.ObjectId;
  milestoneId: Types.ObjectId;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  clientId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentRequestSchema: Schema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    proposalId: {
      type: Schema.Types.ObjectId,
      ref: "Proposal",
      required: true,
    },
    milestoneId: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    freelancerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const PaymentRequestModel = mongoose.model<IPaymentRequest>(
  "PaymentRequest",
  PaymentRequestSchema
);
export default PaymentRequestModel;
