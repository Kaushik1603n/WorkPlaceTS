import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import type { AxiosError } from "axios";

export interface FreelancerProject {
  _id: string;
  contractId: string;
  budget: number;
  budgetType: string;
  time: string;
  status: string;
  title: string;
  description: string;
}

interface UseFreelancerProjectsResult {
  allProjects: FreelancerProject[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFreelancerActiveProjects(): UseFreelancerProjectsResult {
  const [projects, setProjects] = useState<FreelancerProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosClient.get("jobs/get-all-freelancer-jobs");
      setProjects(res.data.data || []);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Failed to fetch projects:", error);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { allProjects:projects, loading, error, refetch: fetchProjects };
}
