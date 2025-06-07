
interface ProposalSidebarProps {
  skills?: string[];
  status?: string;
  onHire: () => void;
}

const ProposalSidebar = ({ skills, status, onHire }: ProposalSidebarProps) => {

  return (
    <div className="w-full md:w-1/3 p-5 bg-[#EFFFF6]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-[#27AE60]">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(skills) &&
            skills.map((skill) => (
              <span
                key={skill}
                className="bg-[#ffffff] border font-medium border-[#27AE60] text-[#27AE60] px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-[#27AE60]">
          Success Metrics
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-3 text-center">
            <h4 className="text-lg font-semibold">92%</h4>
            <p className="text-gray-500 text-sm">Job Success Rate</p>
          </div>
          <div className="bg-white rounded-lg shadow p-3 text-center">
            <h4 className="text-lg font-semibold">35</h4>
            <p className="text-gray-500 text-sm">Projects Completed</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-[#27AE60]">Actions</h2>
        <div className="grid grid-cols-2 gap-2">
          <button className="col-span-2 bg-blue-600 text-white rounded-lg py-2 flex items-center justify-center gap-2 font-semibold hover:bg-blue-700 transition">
            💬 Message Freelancer
          </button>
          {status === "accepted" ? (
            <button className="border border-green-600 text-green-600 rounded-lg py-2 flex items-center justify-center gap-2 font-semibold hover:bg-green-100 transition">
              Waiting for approval
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onHire();
              }}
              className={`bg-green-600 text-white rounded-lg py-2 flex items-center justify-center gap-2 font-semibold hover:bg-green-700 transition `}
            >
              Hire Now
            </button>
          )}

          <button className="bg-red-600 text-white rounded-lg py-2 flex items-center justify-center gap-2 font-semibold hover:bg-red-700 transition">
            Reject
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-[#27AE60]">
          Trust & Verification
        </h2>
        <div className="flex flex-col gap-2">
          {[
            { icon: "✓", text: "ID Verified" },
            { icon: "✓", text: "Payment Protected" },
            { icon: "✓", text: "Dispute Protection", link: true },
          ].map((badge, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-3 flex items-center gap-2">
              <span className="text-green-600">{badge.icon}</span>
              <p>
                {badge.link ? (
                  <a href="#" className="text-blue-600 no-underline">
                    {badge.text}
                  </a>
                ) : (
                  badge.text
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ProposalSidebar