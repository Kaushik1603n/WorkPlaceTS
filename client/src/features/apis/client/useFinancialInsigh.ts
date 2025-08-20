import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import type { AxiosError } from "axios";

interface WeeklyFinancialData {
  week: string;
  spent: number;
  avgCost: number;
}

interface CostPerProject {
  avgCostPerProject: number;
  totalProjects: number;
}

export function useFinancialInsights() {
  const [financialData, setFinancialData] = useState<WeeklyFinancialData[]>([]);
  const [totalSpent, setTotalSpend] = useState<number>(0);
  const [CostPerProject, setCostPerProject] = useState<CostPerProject>({
    avgCostPerProject: 0,
    totalProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosClient.get("client/financialdata");
        setFinancialData(res.data.weeklySpending);
        setTotalSpend(res.data.totalSpent);
        setCostPerProject(res.data.avgCostPerProject);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { financialData, totalSpent, CostPerProject, loading };
}


