import mongoose, { Document, Schema, Types } from "mongoose";

interface IPayment extends Document {
  _id:string,
  jobId: Types.ObjectId;
  proposalId: Types.ObjectId;
  milestoneId: Types.ObjectId;
  amount: number;
  platformFee: number; // e.g., 10% of amount
  netAmount: number; // Amount after fees
  status: "pending" | "completed" | "failed" | "refunded";
  paymentGatewayId: string; // e.g., Stripe Payment Intent ID
  clientId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  paymentMethod: string; // e.g., "credit_card", "paypal"
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    proposalId: { type: Schema.Types.ObjectId, ref: "Proposal", required: true },
    milestoneId: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentGatewayId: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    freelancerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
export default PaymentModel;