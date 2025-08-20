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

interface ProjectResponse {
  data: ClientProject[];
  totalPage: number;
}

interface LoadingState {
  active: boolean;
  posted: boolean;
  completed: boolean;
}

export const useAdminClientProjects = () => {
  const [allActiveProject, setAllActiveProject] = useState<ClientProject[]>([]);
  const [allPostedProject, setAllPostedProject] = useState<ClientProject[]>([]);
  const [allCompletedProject, setAllCompletedProject] = useState<ClientProject[]>([]);

  const [loading, setLoading] = useState<LoadingState>({
    active: true,
    posted: true,
    completed: true,
  });

  const [error, setError] = useState<string | null>(null);

  const [activeCurrentPage, setActiveCurrentPage] = useState(1);
  const [activeTotalPage, setActiveTotalPage] = useState(1);

  const [postedCurrentPage, setPostedCurrentPage] = useState(1);
  const [postedTotalPage, setPostedTotalPage] = useState(1);

  const [completedCurrentPage, setCompletedCurrentPage] = useState(1);
  const [completedTotalPage, setCompletedTotalPage] = useState(1);

  useEffect(() => {
    const fetchActiveProjects = async () => {
      try {
        setLoading((prev) => ({ ...prev, active: true }));
        setError(null);
        const res = await axiosClient.get<ProjectResponse>("admin/project/active-projects", {
          params: { page: activeCurrentPage, limit: 3 },
        });
        setAllActiveProject(res.data.data);
        setActiveTotalPage(res.data.totalPage);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Failed to fetch active projects:", error);
        setError("Failed to load active projects. Please try again later.");
      } finally {
        setLoading((prev) => ({ ...prev, active: false }));
      }
    };

    fetchActiveProjects();
  }, [activeCurrentPage]);

  useEffect(() => {
    const fetchPostedProjects = async () => {
      try {
        setLoading((prev) => ({ ...prev, posted: true }));
        setError(null);
        const res = await axiosClient.get<ProjectResponse>("admin/project/posted-projects", {
          params: { page: postedCurrentPage, limit: 3 },
        });
        setAllPostedProject(res.data.data);
        setPostedTotalPage(res.data.totalPage);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Failed to fetch posted projects:", error);
        setError("Failed to load posted projects. Please try again later.");
      } finally {
        setLoading((prev) => ({ ...prev, posted: false }));
      }
    };

    fetchPostedProjects();
  }, [postedCurrentPage]);

  useEffect(() => {
    const fetchCompletedProjects = async () => {
      try {
        setLoading((prev) => ({ ...prev, completed: true }));
        setError(null);
        const res = await axiosClient.get<ProjectResponse>("admin/project/completed-projects", {
          params: { page: completedCurrentPage, limit: 3 },
        });
        setAllCompletedProject(res.data.data);
        setCompletedTotalPage(res.data.totalPage);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Failed to fetch completed projects:", error);
        setError("Failed to load completed projects. Please try again later.");
      } finally {
        setLoading((prev) => ({ ...prev, completed: false }));
      }
    };

    fetchCompletedProjects();
  }, [completedCurrentPage]);

  return {
    allActiveProject,
    allPostedProject,
    allCompletedProject,
    loading,
    error,

    activeCurrentPage,
    setActiveCurrentPage,
    activeTotalPage,

    postedCurrentPage,
    setPostedCurrentPage,
    postedTotalPage,

    completedCurrentPage,
    setCompletedCurrentPage,
    completedTotalPage,
  };
};
