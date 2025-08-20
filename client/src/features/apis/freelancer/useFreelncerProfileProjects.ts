import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

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

export function useFreelancerProfileProjects() {
  const [projects, setProjects] = useState<FreelancerProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<number>(0);
  const [inProgress, setInProgress] = useState<number>(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.get("jobs/get-all-freelancer-jobs");
        const data: FreelancerProject[] = res.data.data;

        setProjects(data);

        setInProgress(data.filter(p => p.status === "in-progress").length);
        setCompleted(data.filter(p => p.status === "completed").length);

      } catch (err) {
        const error = err as AxiosError;
        setError(error.message || "Failed to fetch projects");
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { allProjects:projects, loading, error, completePrg:completed, pendingPrg:inProgress };
}
