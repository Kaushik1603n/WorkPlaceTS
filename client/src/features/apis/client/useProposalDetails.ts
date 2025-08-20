import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosClient from "../../../utils/axiosClient";

interface Milestone {
  _id: string;
  title: string;
  dueDate: string;
  description: string;
  amount: number;
}

export interface ProposalDetail {
  proposal_id?: string;
  profile?: string;
  freelancerName?: string;
  bidAmount?: number;
  bidType?: string;
  timeline?: string;
  submittedAt?: string;
  coverLetter?: string;
  milestones?: Milestone[];
  skills?: string[];
  status?: string;
}

export function useProposalDetails(proposalId?: string) {
  const [proposalDetail, setProposalDetail] = useState<ProposalDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProposalDetails = useCallback(async () => {
    if (!proposalId) return;
    try {
      setLoading(true);
      const res = await axiosClient.get(`/jobs/get-proposal-details/${proposalId}`);
      setProposalDetail(res.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to load proposal details");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [proposalId]);

  const handleHire = useCallback(async () => {
    if (!proposalDetail?.proposal_id) return;
    try {
      await axiosClient.put(`/proposal/hire-request/${proposalDetail.proposal_id}`);
      toast.success("Hire request sent successfully!");
      fetchProposalDetails(); 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to hire request");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }, [proposalDetail, fetchProposalDetails]);

  useEffect(() => {
    fetchProposalDetails();
  }, [fetchProposalDetails]);

  return { proposalDetail, loading, handleHire };
}
