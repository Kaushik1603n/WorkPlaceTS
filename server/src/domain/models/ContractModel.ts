import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContract extends Document {
  _id:string,
  proposalId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  totalAmount: number;
  status: "active" | "completed" | "terminated";
  paymentMethod?: string;
  terms: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema: Schema = new Schema(
  {
    proposalId: {
      type: Schema.Types.ObjectId,
      ref: "Proposal",
      required: true,
    },
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: { 
      type: Schema.Types.ObjectId, 
      ref: "Job", 
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    startDate: { 
      type: Date 
    },
    endDate: { 
      type: Date 
    },
    totalAmount: { 
      type: Number, 
      required: true 
    },
    paymentMethod: { 
      type: String 
    },
    status: {
      type: String,
      enum: ["active", "completed", "terminated"],
      default: "active",
    },
    terms: [{ 
      type: String 
    }],
  },
  { timestamps: true }
);

const ContractModel: Model<IContract> = mongoose.model<IContract>("Contract", ContractSchema);
export default ContractModel;