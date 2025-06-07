
interface ProposalHeaderProps {
  profile?: string;
  freelancerName?: string;
  bidStatus: string;
  setBidStatus: (status: string) => void;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({ 
  profile, 
  freelancerName, 
  bidStatus, 
  setBidStatus 
}) => (
  <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center">
    <div className="flex items-center gap-4">
      <img
        src={profile}
        alt="Freelancer Profile"
        className="w-16 h-16 rounded-full object-cover border-2 border-[#27AE60]"
      />
      <div>
        <h1 className="text-xl font-semibold">{freelancerName}</h1>
        <div className="text-yellow-500 font-semibold">★★★★☆ 4.7</div>
        <div className="inline-flex items-center bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full mt-1">
          <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
          Online Now
        </div>
      </div>
    </div>

    <div className="mt-4 md:mt-0 w-full md:w-auto">
      <div className="bg-[#EFFFF6] rounded-full p-1 flex">
        {["New", "Shortlisted", "Rejected"].map((status) => (
          <button
            key={status}
            className={`px-3 py-2 text-sm rounded-full ${
              bidStatus === status
                ? "bg-white shadow text-gray-800 font-semibold"
                : "bg-transparent text-gray-500"
            }`}
            onClick={() => setBidStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default ProposalHeader