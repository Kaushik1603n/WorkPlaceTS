// hooks/usePayments.ts
import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";

interface IWalletTransaction {
  type: "credit" | "debit";
  amount: number;
  description: string;
  paymentId?: string;
  _id?: string;
  createdAt: Date | string;
}

interface IWallet {
  _id: string;
  userId: string | "admin";
  balance: number;
  currency: string;
  transactions: IWalletTransaction[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface IPayment {
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
  createdAt: string;
  updatedAt: string;
}

interface PaymentsResponse {
  wallet: IWallet | null;
  payments: IPayment[];
  totalPages: number;
  totalAmount: number;
  netAmount: number;
  platformFee: number;
  pendingAmount: number;
  totalCount: number;
}

export function useWalletTransactions(currentPage: number, limit: number = 5) {
  const [data, setData] = useState<PaymentsResponse>({
    wallet: null,
    payments: [],
    totalPages: 1,
    totalAmount: 0,
    netAmount: 0,
    platformFee: 0,
    pendingAmount: 0,
    totalCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentsDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosClient.get("/payments/get-payment", {
          params: { page: currentPage, limit },
        });

        setData({
          wallet: res.data?.data || null,
          payments: res.data?.payment || [],
          totalPages: res.data?.totalPages || 1,
          totalAmount: res.data?.totalAmount || 0,
          netAmount: res.data?.netAmount || 0,
          platformFee: res.data?.platformFee || 0,
          pendingAmount: res.data?.pendingAmount || 0,
          totalCount: res.data?.totalCount || 0,
        });
      } catch (err) {
        console.log(err);        
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentsDetails();
  }, [currentPage, limit]);

  return { ...data, loading, error };
}
