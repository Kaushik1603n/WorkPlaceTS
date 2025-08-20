import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";

interface JobDetails {
  title: string;
  description: string;
  stack: string;
  status: string;
  time: string;
  reference: string;
  requiredFeatures: string[];
  budgetType: string;
  budget: string;
  experienceLevel: string;
  clientId: {
    fullName: string;
    email: string;
  };
}

interface Proposal {
  proposal_id: string;
  freelancerName: string;
  freelancerEmail: string;
  jobTitle: string;
  status: string;
  submittedAt: string;
  bidAmount: string;
}

export function useJobWithProposals(jobId?: string) {
  const [job, setJob] = useState<JobDetails | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState({
    job: true,
    proposals: true,
  });
  const [error, setError] = useState({
    job: "",
    proposals: "",
  });

  useEffect(() => {
    if (!jobId) return;
    let isMounted = true;

    const fetchProjectsDetails = async () => {
      try {
        const res = await axiosClient.get(`jobs/job-details/${jobId}`);
        if (isMounted) setJob(res.data.data);
      } catch (err) {
        if (isMounted) setError((prev) => ({ ...prev, job: (err as Error).message }));
      } finally {
        if (isMounted) setLoading((prev) => ({ ...prev, job: false }));
      }
    };

    const fetchProposalDetails = async () => {
      try {
        const res = await axiosClient.get(`proposal/all-proposal/${jobId}`);
        if (isMounted) setProposals(res.data.data);
      } catch (err) {
        if (isMounted) setError((prev) => ({ ...prev, proposals: (err as Error).message }));
      } finally {
        if (isMounted) setLoading((prev) => ({ ...prev, proposals: false }));
      }
    };

    Promise.all([fetchProjectsDetails(), fetchProposalDetails()]);

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  return { job, proposals, loading, error };
}
