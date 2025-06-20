// src/domain/entities/Job.ts
export interface Job {
  _id: string;
  job_Id: string;
  title: string;
  stack: string;
  description: string;
  skills: string[];
  budget?: number;
  proposals?: string[];
  createdAt: string;
}
