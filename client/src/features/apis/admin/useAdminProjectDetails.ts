import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";

export interface JobDetails {
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

export const useAdminProjectDetails = (jobId?: string) => {
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosClient.get(`admin/project/project-details/${jobId}`);
        setJob(res.data.data);
      } catch (err) {
        setError("Failed to load project details. Please try again later.");
        console.error("Error fetching project details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [jobId]);

  return { job, loading, error };
};
