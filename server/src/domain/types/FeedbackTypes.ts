import { Types } from "mongoose";

export interface FeedbackTypes  {
  clientId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  jobId: Types.ObjectId;
  ratings: {
    quality: number;
    deadlines: number;
    professionalism: number;
  };
  overallRating: number;
  feedback: string;
  createdAt: Date;
}

export interface FeedbackArguments {
  ratings: {
    quality: number;
    deadlines: number;
    professionalism: number;
  };
  feedback: string;
  overallRating: number;
  jobId: string;
  freelancerId: string;
  userId: string;
}

export interface ReportDataArgument {
  clientId: string;
  clientEmail: string;
  title: string;
  description: string;
  userId: string;
  jobId: string;
}
