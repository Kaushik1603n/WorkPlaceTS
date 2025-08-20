import React, { useState } from "react";
import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
import ProposalHeader from "./ProposalHeader";
import ProposalSummary from "./ProposalSummary";
import ProposalMainContent from "./ProposalMainContent";
import ProposalSidebar from "./ProposalSidebar";
import ProposalDetailsSkeleton from "./ProposalDetailsSkeleton";
import { useProposalDetails } from "../../../features/apis/client/useProposalDetails";


const ProposalDetails: React.FC = () => {
    const { proposalId } = useParams<{ proposalId: string }>();
    const { proposalDetail, loading, handleHire } = useProposalDetails(proposalId);
    const [bidStatus, setBidStatus] = useState<string>("New");

    if (loading || !proposalDetail) {
        return <ProposalDetailsSkeleton />;
    }
    
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