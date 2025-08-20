import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import type { AxiosError } from "axios";

export function useHiringProjects() {
  const [hiringData, setHiringData] = useState<ClientProjectStatsByMonth[]>([]);
  const [jobCount, setJobCount] = useState({ posted: "0", hired: "0" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosClient.get("client/hiringprojects");
        setHiringData(res.data.result);
        setJobCount(res.data.jobCount);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { hiringData, jobCount, loading };
}


export interface ClientProjectStatsByMonth {
  month: string;      
  jobsPosted: number;  
  hiresMade: number;  
}

export interface ClientProjectJobCount {
  posted: string;  
  hired: string;  
}

export interface ClientProjectStatsResponse {
  result: ClientProjectStatsByMonth[];
  jobCount: ClientProjectJobCount;
}