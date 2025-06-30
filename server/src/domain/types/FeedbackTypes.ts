import { Types } from "mongoose";

export interface FeedbackTypes {
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  jobId: Types.ObjectId;
  ratings: {
    quality?: number;
    deadlines?: number;
    professionalism?: number;
    clarity?: number;
    payment?: number;
    communication?: number;
  };
  feedbackType: string;
  feedback: string;
  overallRating: number;
  createdAt: Date;
}

export interface FeedbackArguments {
  ratings: {
    quality?: number;
    deadlines?: number;
    professionalism?: number;
    clarity?: number;
    payment?: number;
    communication?: number;
  };
  feedback: string;
  overallRating: number;
  jobId: string;
  fromUser: string;
  toUser: string;
  feedbackType: string;
}

export interface ReportDataArgument {
  clientId: string;
  clientEmail: string;
  title: string;
  description: string;
  userId: string;
  jobId: string;
}
