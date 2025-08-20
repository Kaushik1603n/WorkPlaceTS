import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosClient from "../../../utils/axiosClient";

interface Contract {
  _id?: string;
  title?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  startDate?: string;
  totalAmount?: number;
  freelancerId?: string;
  jobId?: string;
  job_Id?: string;
  terms?: string;
  clientId?: string;
}

interface UseContractDetailsReturn {
  contract: Contract;
  loading: boolean;
  error: string | null;
  fetchContract: () => Promise<void>;
  acceptContract: () => Promise<void>;
  rejectContract: () => Promise<void>;
  isActionLoading: boolean;
}

const useContractDetails = (contractId: string): UseContractDetailsReturn => {
  const [contract, setContract] = useState<Contract>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContract = useCallback(async () => {
    if (!contractId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get(
        `/proposal/get-contract-details/${contractId}`
      );
      setContract(response.data.data || {});
    } catch (err) {
      let errorMessage = "Failed to load contract details";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }

      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Failed to fetch contract:", err);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  const acceptContract = useCallback(async () => {
    if (!contractId) return;

    setIsActionLoading(true);
    try {
      const response = await axiosClient.get(
        `/proposal/accept-contract/${contractId}`
      );
      setContract(response.data.data || {});
      toast.success("Contract accepted successfully!");
    } catch (err) {
      let errorMessage = "Cannot accept the contract";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
      console.error("Failed to accept contract:", err);
    } finally {
      setIsActionLoading(false);
    }
  }, [contractId]);

  const rejectContract = useCallback(async () => {
    if (!contractId) return;

    setIsActionLoading(true);
    try {
      const response = await axiosClient.get(
        `/proposal/reject-contract/${contractId}`
      );
      setContract(response.data.data || {});
      toast.success("Contract rejected successfully!");
    } catch (err) {
      let errorMessage = "Cannot reject the contract";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
      console.error("Failed to reject contract:", err);
      //   throw err;
    } finally {
      setIsActionLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  return {
    contract,
    loading,
    error,
    fetchContract,
    acceptContract,
    rejectContract,
    isActionLoading,
  };
};

export default useContractDetails;
