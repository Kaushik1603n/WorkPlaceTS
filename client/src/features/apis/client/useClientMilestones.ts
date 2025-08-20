import { useEffect, useState, useCallback } from "react";
import axiosClient from "../../../utils/axiosClient";
import { toast } from "react-toastify";

interface Deliverable {
  links: string[];
  comments: string;
  submittedAt?: string | Date;
}

interface Milestone {
  _id: string;
  title: string;
  description: string;
  amount: number;
  dueDate?: string | Date;
  status: string;
  deliverables?: Deliverable;
}

interface FeedbackFormData {
  ratings: {
    quality: number;
    deadlines: number;
    professionalism: number;
  };
  feedback: string;
  overallRating: number;
}

export const useClientMilestones = (jobId: string) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobStatus, setJobStatus] = useState<string>("");
  const [freelancerId, setFreelancerId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmittedMilestones = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/proposal/${jobId}/milestones`);

        setMilestones(response.data.data.milestones);
        setJobStatus(response.data.data.jobStatus);
        setFreelancerId(response.data.data.freelancerId);
      } catch (err) {
        setError("Failed to load milestones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchSubmittedMilestones();
  }, [jobId]);

  const handleApprove = useCallback(async (milestoneId: string) => {
    try {
      await axiosClient.patch(`/proposal/milestones/${milestoneId}/approve`);
      setMilestones((prev) =>
        prev.map((m) => (m._id === milestoneId ? { ...m, status: "approved" } : m))
      );
      toast.success("Milestone approved");
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to approve milestone");
    }
  }, []);

  const handleRequestRevision = useCallback(async (milestoneId: string) => {
    try {
      await axiosClient.patch(`/proposal/milestones/${milestoneId}/rejected`);
      setMilestones((prev) =>
        prev.map((m) => (m._id === milestoneId ? { ...m, status: "rejected" } : m))
      );
      toast.success("Milestone rejected");
    } catch (error) {
      console.error("Revision request failed:", error);
      toast.error("Failed to reject milestone");
    }
  }, []);

  const handleSubmitFeedback = useCallback(
    async (data: FeedbackFormData) => {
      try {
        const res = await axiosClient.post("/jobs/feedback", {
          ...data,
          jobId,
          receverId: freelancerId,
          user: "client",
        });

        return {
          success: "Feedback submitted successfully",
          error: "",
          data: res.data,
        };
      } catch (error) {
        console.error(error);
        return {
          success: "",
          error: "Failed to submit feedback",
          data: {},
        };
      }
    },
    [jobId, freelancerId]
  );

  return {
    milestones,
    loading,
    jobStatus,
    freelancerId,
    error,
    handleApprove,
    handleRequestRevision,
    handleSubmitFeedback,
  };
};
