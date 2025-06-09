import { ObjectId } from "mongodb";

export interface JonContractDetails {
  _id: ObjectId;
  proposalId: ObjectId;
  freelancerId: ObjectId;
  clientId: ObjectId;
  jobId: ObjectId;
  title: string;
  startDate: Date;
  totalAmount: number;
  status: string;
  terms: string[]; 
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
