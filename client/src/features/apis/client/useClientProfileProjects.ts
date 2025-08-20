import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import axiosClient from "../../../utils/axiosClient";
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

export function useClientProfileProjects() {
  const [projects, setProjects] = useState<FreelancerProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("client/project/get-project");
        setProjects(res.data.data);
      } catch (err) {
        const error = err as AxiosError;
        setError(error.message);
        toast.error("Failed to fetch projects");
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { allProjects:projects, loading, error };
}
