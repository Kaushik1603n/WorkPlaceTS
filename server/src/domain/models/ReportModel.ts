import mongoose, { Document, Schema, Types, Model } from "mongoose";

// Define status and priority enums
export enum ReportStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
  REJECTED = "rejected",
}

// interface ActionHistory {
//   action: string;
//   performedBy: Types.ObjectId | string; // User who performed the action
//   performedAt: Date;
//   comment?: string;
//   statusChange?: ReportStatus;
// }

interface Report extends Document {
  title: string;
  description: string;
  reportedBy: Types.ObjectId | string; // User who created the report
  client: {
    id: Types.ObjectId | string;
    email: string;
  };
  status: ReportStatus;
  jobId: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolutionDetails?: string;
}

const ReportSchema = new Schema<Report>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    client: {
      id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      email: { type: String, required: true },
    },
    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.OPEN,
    },
    jobId:{ type: String, required: true, trim: true },
    category: String,
    resolutionDetails: String,
    resolvedAt: Date,
  },
  { timestamps: true }
);

const ReportModal: Model<Report> = mongoose.model<Report>(
  "Report",
  ReportSchema
);

export default ReportModal;
