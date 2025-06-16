import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for the Job document
export interface IJob extends Document {
  _id:string,
  job_Id:string,
  clientId: Types.ObjectId;
  title: string;
  description: string;
  requiredFeatures?: string;
  stack: string;
  skills: string[];
  budgetType: "fixed" | "hourly";
  budget?: number;
  time?: string;
  experienceLevel?: "entry" | "intermediate" | "expert";
  status?: "draft" | "posted" | "in-progress" | "completed" | "cancelled";
  proposals?: Types.ObjectId[];
  visibility?: "public" | "private";
  reference?: string;
  Attachments?: string[];
  hiredFreelancer?: Types.ObjectId;
  hiredProposalId?: Types.ObjectId;
  contractId?: Types.ObjectId;
  paymentStatus?: "unpaid" | "partially-paid" | "fully-paid";
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job_Id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredFeatures: { type: String },
    stack: { type: String },
    skills: {
      type: [String],
      default: [],
    },
    budgetType: { 
      type: String, 
      enum: ["fixed", "hourly"], 
      required: true 
    },
    budget: { type: Number },
    time: { type: String },
    experienceLevel: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
    },
    status: {
      type: String,
      enum: ["draft", "posted", "in-progress", "completed", "cancelled"],
      default: "posted",
    },
    proposals: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Proposal" 
    }],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    reference: { type: String },
    Attachments: [{ type: String }],
    hiredFreelancer: { 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    },
    hiredProposalId: { 
      type: Schema.Types.ObjectId, 
      ref: "Proposal" 
    },
    contractId: { 
      type: Schema.Types.ObjectId, 
      ref: "Contract" 
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partially-paid", "fully-paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

// Create the model
const ProjectModel: Model<IJob> = mongoose.model<IJob>("Job", JobSchema);

export default ProjectModel;