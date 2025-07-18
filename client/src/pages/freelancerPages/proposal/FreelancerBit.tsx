import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import ProposalContractModal from "./ProposalContractModal";
import axiosClient from "../../../utils/axiosClient";
import FreelancerBitSkeleton from "./FreelancerBitSkeleton";

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

function FreelancerBit() {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProposal, setSelectedProposal] = useState<Proposal | undefined>();

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                setIsLoading(true);

                const response = await axiosClient.get("/proposal/get-freelacer-proposal");
                setProposals(response.data.data);                
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || "Failed to load proposal details");
                } else {
                    toast.error("Failed to load proposal details");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProposals();
    }, []);

    const handleViewContract = useCallback((proposal: Proposal) => {
        setSelectedProposal(proposal);
        setOpenModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setOpenModal(false);
    }, []);

    if (isLoading) {
        return <FreelancerBitSkeleton />;
    }
    return (
        <div className="container mx-auto px-4 pb-8 ">
            <main className="flex-1">
                <div className="space-y-6">
                    {Array.isArray(proposals) &&
                        proposals.map((proposal) => (
                            <div
                                key={proposal?._id}
                                className="border border-[#27AE60] rounded-lg p-6 bg-[#EFFFF6] relative shadow-sm"
                            >
                                <h2 className="text-xl font-semibold mb-2">{proposal?.jobId?.title}</h2>
                                <p className="text-gray-600 mb-3">
                                    Bid: ₹{proposal?.bidAmount} • Budget: ₹{proposal?.jobId?.budget} • Type:{" "}
                                    {proposal?.budgetType}
                                </p>
                                <p className="text-gray-500 mb-2">
                                    Estimated Time: {proposal?.estimatedTime} week(s)
                                </p>
                                {(proposal?.contractId) && (
                                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                        {proposal?.status === "accepted" && (
                                            <div className="bg-green-200 text-green-800 px-3 py-1 rounded-md text-sm">
                                                Accepted
                                            </div>
                                        )}
                                        {proposal?.status === "submitted" && (
                                            <div className=" bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">
                                                Submitted
                                            </div>
                                        )}
                                        {proposal?.status === "rejected" && (
                                            <div className=" bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm">
                                                Rejected
                                            </div>
                                        )}
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 flex items-center"
                                            onClick={() => handleViewContract(proposal)}
                                        >
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                ></path>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                ></path>
                                            </svg>
                                            View Contract
                                        </button>
                                    </div>
                                )}
                               
                            </div>
                        ))}
                </div>
                <ProposalContractModal
                    isOpen={openModal}
                    contractId={selectedProposal?.contractId || ""}
                    onClose={handleCloseModal}
                />
            </main>
        </div>
    );
}

export default FreelancerBit;