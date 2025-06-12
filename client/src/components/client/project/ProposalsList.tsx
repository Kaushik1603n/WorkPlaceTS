import React from "react";
import { Link } from "react-router-dom";
import { DollarSign, Clock, Briefcase } from "lucide-react";

interface Proposal {
  proposal_id: string;
  freelancerName: string;
  freelancerEmail: string;
  jobTitle: string;
  status: string;
  submittedAt: string;
  bidAmount: string;
}

interface ProposalsListProps {
  proposals: Proposal[];
  error?: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "accepted":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-[#2bd773]";
  }
};

export const ProposalsList: React.FC<ProposalsListProps> = ({ proposals, error }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#2bd773] sticky top-6">
      <div className="bg-gradient-to-r from-[#2ECC71] to-[#2bd773] p-6 text-white rounded-t-2xl">
        <h2 className="text-xl font-bold mb-1">Freelancer Proposals</h2>
        <p className="text-blue-100 text-sm">
          {proposals.length} {proposals.length === 1 ? "application" : "applications"} received
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            <p className="text-sm">Error loading proposals: {error}</p>
          </div>
        )}

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {proposals.length > 0 ? (
            proposals.map((proposal) => (
              <div
                key={proposal.proposal_id}
                className="border border-[#2bd773] rounded-xl p-4 hover:shadow-md transition-shadow bg-[#EFFFF6]"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {proposal.freelancerName[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {proposal.freelancerName}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {proposal.freelancerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      proposal.status
                    )}`}
                  >
                    {proposal.status}
                  </span>
                  <div className="flex items-center text-emerald-600 font-bold text-sm">
                    <DollarSign className="w-4 h-4" />
                    {proposal.bidAmount}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {proposal.submittedAt}
                  </div>
                  <Link
                    to={`/client-dashboard/jobs/${proposal.proposal_id}/proposals`}
                    className="px-3 py-1 text-xs bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors font-medium"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No proposals yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Freelancers will apply soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};