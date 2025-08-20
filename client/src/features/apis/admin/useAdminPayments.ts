import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import axios from "axios";
import { toast } from "react-toastify";

export interface IPayment {
  _id: string;
  jobId: string;
  proposalId: string;
  milestoneId: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: string;
  paymentGatewayId: string;
  clientId: string;
  freelancerId: string;
  paymentMethod: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const useAdminPayments = (page: number, limit: number = 5) => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPaymentsDetails = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/admin/payments", {
          params: { page, limit },
          signal: controller.signal,
        });
        setPayments(res.data.payment);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Fetch error:", err);
          setError("Failed to load payments.");
          toast.error("Failed to load payments.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentsDetails();
    return () => controller.abort();
  }, [page, limit]);

  return { payments, loading, error };
};
