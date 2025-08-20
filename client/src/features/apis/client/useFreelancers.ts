import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";

interface FreelancerRatingStats {
  avgQuality: number;
  avgDeadlines: number;
  avgProfessionalism: number;
}

export interface FreelancerResult {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profilePic?: string;
  bio?: string;
  location?: string;
  hourlyRate?: number;
  avgRating?: number;
  feedbackCount: number;
  freelancerRatings?: FreelancerRatingStats;
}


interface UseFreelancersResult {
  freelancers: FreelancerResult[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  refetch: () => Promise<void>;
}

export function useFreelancers(initialPage: number = 1, limit: number = 8): UseFreelancersResult {
  const [freelancers, setFreelancers] = useState<FreelancerResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosClient.get("/client/freelancer", {
        params: { page: currentPage, limit },
      });

      setFreelancers(res.data.freelancer || []);
      setTotalPages(res.data?.pagination.totalPages || 1);
    } catch (err) {
      console.error("Error fetching freelancers:", err);
      setError("Failed to load freelancers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, [currentPage, limit]);

  return {
    freelancers,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    refetch: fetchFreelancers,
  };
}
