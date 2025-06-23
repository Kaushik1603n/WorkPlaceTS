import mongoose, { Schema, Document, Model } from "mongoose";

interface IFeedback extends Document {
  clientId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  ratings: {
    quality: number;
    deadlines: number;
    professionalism: number;
  };
  overallRating: number;
  feedback: string;
  createdAt: Date;
}

const feedbackSchema: Schema = new Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  ratings: {
    quality: { type: Number, min: 1, max: 5 },
    deadlines: { type: Number, min: 1, max: 5 },
    professionalism: { type: Number, min: 1, max: 5 },
  },
  overallRating: { type: Number, min: 1, max: 5 },
  feedback: { type: String, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

const FeedbackModel: Model<IFeedback> = mongoose.model<IFeedback>(
  "Feedback",
  feedbackSchema
);

export default FeedbackModel;
