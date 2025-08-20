import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import type { AxiosError } from "axios";

interface FreelancerCounts {
  totalJob: number;
  completedJob: number;
  activeJob: number;
  avgEarnings: number;
  totalProposal: number;
}

export function useFreelancerOverview() {
  const [counts, setCounts] = useState<FreelancerCounts>({
    totalJob: 0,
    completedJob: 0,
    activeJob: 0,
    avgEarnings: 0,
    totalProposal: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.get("freelancer/totalCount");
        setCounts(res.data.result);
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error("Failed to fetch freelancer overview:", axiosError);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return { counts, loading, error };
}
