import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProposalHeader from "./ProposalHeader";
import ProposalSummary from "./ProposalSummary";
import ProposalMainContent from "./ProposalMainContent";
import ProposalSidebar from "./ProposalSidebar";
import ProposalDetailsSkeleton from "./ProposalDetailsSkeleton";
import axiosClient from "../../../utils/axiosClient";

interface Milestone {
    _id: string;
    title: string;
    dueDate: string;
    description: string;
    amount: number;
}

interface ProposalDetail {
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

const ProposalDetails: React.FC = () => {
    const { proposalId } = useParams<{ proposalId: string }>();
    const [proposalDetail, setProposalDetail] = useState<ProposalDetail>({});
    const [bidStatus, setBidStatus] = useState<string>("New");
    const [loading, setLoading] = useState<boolean>(true);



    const fetchProposalDetails = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get(`/jobs/get-proposal-details/${proposalId}`)
            setProposalDetail(res.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "Failed to load proposal details"
                );
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposalDetails();
    }, []);

    if (loading || !proposalDetail) {
        return <ProposalDetailsSkeleton />;
    }

    const handleHire = async () => {
        try {            
            await axiosClient.put(`/proposal/hire-request/${proposalDetail?.proposal_id}`)
            fetchProposalDetails();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.error || "Failed to hire request"
                );
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };

    return (
        <div className="p-2 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden border border-[#27AE60]">
                <ProposalHeader
                    profile={proposalDetail.profile}
                    freelancerName={proposalDetail.freelancerName}
                    bidStatus={bidStatus}
                    setBidStatus={setBidStatus}
                />

                <ProposalSummary
                    bidAmount={proposalDetail.bidAmount}
                    bidType={proposalDetail.bidType}
                    timeline={proposalDetail.timeline}
                    submittedAt={proposalDetail.submittedAt}
                />

                <div className="flex flex-col md:flex-row">
                    <ProposalMainContent
                        coverLetter={proposalDetail.coverLetter}
                        milestones={proposalDetail.milestones}
                    />

                    <ProposalSidebar
                        skills={proposalDetail.skills}
                        status={proposalDetail.status}
                        onHire={handleHire}
                    />
                </div>
            </div>
        </div>
    );
};


export default ProposalDetails;