// hooks/useAdminDashboardData.ts
import { useEffect, useState, useCallback } from "react";
import axiosClient from "../../../utils/axiosClient";
import type {
  UserGrowthData,
  RevenueData,
  TopFreelancer,
  JobData,
} from "../../../components/admin/dashboard/types";

interface RevenueDetails {
  revenue: number;
  pending: number;
  wallet: number;
}

interface JobDetails {
  successRate: number;
  avgBudget: number;
  completedJob: number;
  totalJob: number;
  activeJob: number;
}

export const useAdminDashboardData = () => {
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [topFreelancers, setTopFreelancer] = useState<TopFreelancer[]>([]);
  const [jobData, setJobData] = useState<JobData[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [revenueDetails, setRevenueDetails] = useState<RevenueDetails>({
    revenue: 0,
    pending: 0,
    wallet: 0,
  });
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    successRate: 100,
    avgBudget: 0,
    completedJob: 0,
    totalJob: 0,
    activeJob: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(false);
      const res = await   axiosClient.get("/admin/dashboard-data")
      setUserGrowthData(res.data.userGrowthRes);
      setTotalUsers(res.data.totalUsers);
      setTopFreelancer(res.data.freelancersRes);
      setJobData(res.data.jobGrowthRes);
      setJobDetails(res.data.jobDetailsRes);
      setRevenueData(res.data.revenueData);
      setRevenueDetails(res.data.revenueDetails);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    userGrowthData,
    topFreelancers,
    jobData,
    totalUsers,
    revenueData,
    revenueDetails,
    jobDetails,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
};
