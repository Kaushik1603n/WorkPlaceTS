import { useEffect, useState, useCallback } from "react";
import axiosClient from "../../../utils/axiosClient";

type PaymentStatus = "pending" | "completed" | "failed";

export interface IPaymentRequest {
  _id: string;
  jobId: string;
  proposalId: string;
  milestoneId: string;
  amount: number;
  netAmount: number;
  platformFee: number;
  status: PaymentStatus;
  freelancerId: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentsResponse {
  data: IPaymentRequest[];
  totalPages: number;
  totalCount: number;
  totalAmount: number;
  netAmount: number;
  platformFee: number;
  pendingAmount: number;
}

export function useClinetPayments(page: number, limit = 5) {
  const [payments, setPayments] = useState<IPaymentRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);

  const fetchClientPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get<PaymentsResponse>("/proposal/pending-paments", {
        params: { page, limit },
      });
      setPayments(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.totalCount);
      setTotalAmount(res.data.totalAmount);
      setNetAmount(res.data.netAmount);
      setPlatformFee(res.data.platformFee);
      setPendingAmount(res.data.pendingAmount);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchClientPayments();
  }, [fetchClientPayments]);

  return {
    payments,
    loading,
    totalPages,
    totalCount,
    totalAmount,
    netAmount,
    platformFee,
    pendingAmount,
    refetch: fetchClientPayments,
  };
}
