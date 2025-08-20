import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import { AxiosError } from "axios";

export interface ClientProject {
  _id: string;
  contractId: string;
  budget: number;
  budgetType: string;
  time: string;
  status: string;
  title: string;
  description: string;
}

export const useActiveClinetProject = () => {
  const [activeProjects, setActiveProjects] = useState<ClientProject[]>([]);
  const [pendingProjects, setPendingProjects] = useState<ClientProject[]>([]);
  const [completedProjects, setCompletedProjects] = useState<ClientProject[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("jobs/all");
      const { active, pending, completed } = res.data;

      setActiveProjects(active);
      setPendingProjects(pending);
      setCompletedProjects(completed);
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

  return {
    allActiveProject: activeProjects,
    allPendingProject: pendingProjects,
    allCompletedProject: completedProjects,
    loading,
    error,
    refetch: fetchProjects,
  };
};
