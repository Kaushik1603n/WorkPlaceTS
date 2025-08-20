import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import type { AxiosError } from "axios";

interface WeeklyPayment {
  earnings: number;
  projects: number;
  week: string;
}

interface PaymentData {
  totalPayments: number;
  pendingPayments: number;
  monthlyStats: number;
}

export function useFreelancerEarnings() {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    totalPayments: 0,
    pendingPayments: 0,
    monthlyStats: 0,
  });

  const [allPayments, setAllPayments] = useState<WeeklyPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.get("freelancer/totalearnings");

        setPaymentData({
          totalPayments: res.data.result.totalPayments,
          pendingPayments: res.data.result.pendingPayments,
          monthlyStats: res.data.result.monthlyStats.totalMonthlyEarnings,
        });

        setAllPayments(res.data.result.weeklyPayments);
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error("Failed to fetch freelancer earnings:", axiosError);
        setError("Failed to load earnings data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  return { paymentData, allPayments, loading, error };
}
