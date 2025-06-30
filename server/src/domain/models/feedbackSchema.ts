import mongoose, { Schema, Document, Model } from "mongoose";

interface IFeedback extends Document {
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  feedbackType: "client-to-freelancer" | "freelancer-to-client";
  ratings: {
    quality?: number;
    deadlines?: number;
    professionalism?: number;
    clarity?: number;
    payment?: number;
    communication?: number;
  };
  overallRating: number;
  feedback: string;
  createdAt: Date;
}

const feedbackSchema: Schema = new Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  feedbackType: {
    type: String,
    required: true,
    enum: ["client-to-freelancer", "freelancer-to-client"],
  },
  ratings: {
    quality: { type: Number, min: 1, max: 5 },
    deadlines: { type: Number, min: 1, max: 5 },
    professionalism: { type: Number, min: 1, max: 5 },
    clarity: { type: Number, min: 1, max: 5 },
    payment: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
  },
  overallRating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

const FeedbackModel: Model<IFeedback> = mongoose.model<IFeedback>(
  "Feedback",
  feedbackSchema
);

export default FeedbackModel;
