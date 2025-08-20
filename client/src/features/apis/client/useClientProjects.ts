import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import type { AxiosError } from "axios";

 interface FreelancerProject {
  _id: string;
  job_Id: string;
  clientId: string;
  title: string;
  description: string;
  requiredFeatures?: string;
  stack: string;
  skills: string[];
  budgetType:string;
  budget: number;
  time: string;
  experienceLevel?: "entry" | "intermediate" | "expert";
  status:
    | "draft"
    | "posted"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "De-active";
  proposals?: string[];
  visibility?: "public" | "private";
  reference?: string;
  Attachments?: string[];
  hiredFreelancer?: string;
  hiredProposalId?: string;
  contractId: string;
  paymentStatus?: "unpaid" | "partially-paid" | "fully-paid";
  createdAt: Date;
  updatedAt: Date;
}

export function useClientProjects(limit: number = 6) {
  const [allProjects, setAllProjects] = useState<FreelancerProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.get("client/project/get-project", {
          params: { page: currentPage, limit },
        });

        setAllProjects(res.data.data);
        setTotalPage(res.data.totalPage);
        setTotalCount(res.data.totalCount);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Failed to fetch projects:", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage, limit]);

  return {
    allProjects,
    loading,
    error,
    currentPage,
    totalPage,
    totalCount,
    setCurrentPage,
    refetch: () => setCurrentPage((p) => p),
  };
}
