import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";

export interface ClientRatingStats {
  avgClarity: number;
  avgPayment: number;
  avgCommunication: number;
}

export interface ClientResult {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profilePic?: string;
  description?: string;
  location?: string;
  hourlyRate?: number;
  avgRating?: number;
  feedbackCount: number;
  clientRatings?: ClientRatingStats;
}


export function useClientsProfile(currentPage: number, limit: number = 8) {
  const [clients, setClients] = useState<ClientResult[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/freelancer/client", {
        params: { page: currentPage, limit },
      });

      setClients(res.data?.clients || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [currentPage, limit]);

  return { clients, totalPages, loading, error, refetch: fetchClients };
}
