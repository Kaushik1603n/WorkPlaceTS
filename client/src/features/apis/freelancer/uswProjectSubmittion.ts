import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import type { AxiosError } from "axios";

interface Milestones {
  _id: string;
  title: string;
  amount: number;
  dueDate: string | Date;
  description: string;
  status:
    | "submitted"
    | "interviewing"
    | "rejected"
    | "accepted"
    | "cancelled"
    | "active"
    | "completed"
    | "pending"
    | "paid";
}

interface ProposalDetails {
  _id: string;
  coverLetter: string;
  budgetType: "fixed" | "hourly";
  bidAmount: number;
  estimatedTime: number;
  milestones: Milestones[];
  status: "interviewing" | "hired" | "rejected" | "pending";
  payments: string[];
  createdAt: Date;
  updatedAt: Date;
  contractId: string;
}

interface JobDetails {
  jobId: string;
  job_Id: string;
  title: string;
  description: string;
  stack: string;
  time: string;
  reference: string;
  requiredFeatures: string;
  hiredFreelancer: string;
  hiredProposalId: string;
  budgetType: "fixed" | "hourly";
  budget: number;
  clientId: string;
  clientEmail: string;
  clientFullName: string;
  paymentStatus: string;
}

interface UseFetchProjectReturn {
  jobDetails: JobDetails | null;
  proposalDetails: ProposalDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetchProjectDetails = (jobId: string): UseFetchProjectReturn => {
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [proposalDetails, setProposalDetails] = useState<ProposalDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get(`/jobs/project-details/${jobId}`);
      setJobDetails(res.data.data?.jobDetails);
      setProposalDetails(res.data.data?.proposalDetails);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Failed to fetch projects:", error);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  return { jobDetails, proposalDetails, loading, error, refetch: fetchData };
};
