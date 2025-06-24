import mongoose, { Document, Schema, Types, Model } from "mongoose";

// Define status and priority enums
export enum ReportStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
  REJECTED = "rejected",
}

interface IComment {
  text: string;
  user: string;
  createdAt: Date;
  createdBy: Types.ObjectId | string;
}

interface Report extends Document {
  title: string;
  description: string;
  reportedBy: Types.ObjectId | string;
  client: {
    id: Types.ObjectId | string;
    email: string;
  };
  comments: IComment[];
  status: ReportStatus;
  jobId: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolutionDetails?: string;
}

const CommentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  user: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const ReportSchema = new Schema<Report>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    client: {
      id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      email: { type: String, required: true },
    },
    comments: [CommentSchema],
    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.OPEN,
    },
    jobId: { type: String, required: true, trim: true },
    category: String,
    resolutionDetails: String,
    resolvedAt: Date,
  },
  { timestamps: true }
);

const ReportModel: Model<Report> = mongoose.model<Report>(
  "Report",
  ReportSchema
);

export default ReportModel;
