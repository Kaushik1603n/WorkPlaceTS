
interface ProposalSummaryProps {
  bidAmount?: number;
  bidType?: string;
  timeline?: string;
  submittedAt?: string;
}

const ProposalSummary: React.FC<ProposalSummaryProps> = ({
  bidAmount,
  bidType,
  timeline,
  submittedAt
}) => (
  <div className="bg-[#EFFFF6] p-5 border border-[#27AE60] grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="md:border-r border-[#27AE60] md:pr-4">
      <h3 className="text-sm text-gray-500 uppercase font-semibold">Bid Amount</h3>
      <p className="text-xl font-semibold text-blue-600">
        ${bidAmount}
        <span className="text-xs text-yellow-600 font-normal">({bidType})</span>
      </p>
    </div>

    <div className="md:border-r border-[#27AE60] md:px-4">
      <h3 className="text-sm text-gray-500 uppercase font-semibold">Timeline</h3>
      <p className="text-lg font-semibold">{timeline} Week</p>
    </div>

    <div className="md:pl-4">
      <h3 className="text-sm text-gray-500 uppercase font-semibold">Proposal Date</h3>
      <p className="text-lg font-semibold">
        {submittedAt && new Date(submittedAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })}

      </p>

    </div>
  </div>
);


export default ProposalSummary