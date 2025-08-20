import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosClient from "../../../utils/axiosClient";

interface Proposal {
    _id: string;
    jobId: {
        title: string;
        budget: number;
    };
    bidAmount: number;
    budgetType: string;
    estimatedTime: number;
    status:
    | "submitted"
    | "interviewing"
    | "rejected"
    | "accepted"
    | "cancelled"
    | "active"
    | "completed";
    contractId?: string;
}

interface UseFreelancerProposalsReturn {
    proposals: Proposal[];
    isLoading: boolean;
    error: string | null;
    fetchProposals: () => Promise<void>;
    refetch: () => Promise<void>;
}

const useFreelancerProposals = (): UseFreelancerProposalsReturn => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProposals = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await axiosClient.get("/proposal/get-freelacer-proposal");
            setProposals(response.data.data || []);
            
        } catch (err) {
            let errorMessage = "Failed to load proposal details";
            
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || errorMessage;
            }
            
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Failed to fetch proposals:", err);
            
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refetch = useCallback(async () => {
        await fetchProposals();
    }, [fetchProposals]);

    useEffect(() => {
        fetchProposals();
    }, [fetchProposals]);

    return {
        proposals,
        isLoading,
        error,
        fetchProposals,
        refetch
    };
};

export default useFreelancerProposals;