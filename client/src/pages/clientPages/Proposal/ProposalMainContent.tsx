interface Milestone {
    _id: string;
    title: string;
    dueDate: string;
    description: string;
    amount: number;
}
interface ProposalMainContentProps {
    coverLetter?: string;
    milestones?: Milestone[];
}


const ProposalMainContent: React.FC<ProposalMainContentProps> = ({
    coverLetter,
    milestones
}) => (
    <div className="flex-grow md:w-2/3 p-5 md:border-r border-[#27AE60]">
        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-[#27AE60]">
                Cover Letter
            </h2>
            <div className="bg-white p-4 rounded-lg shadow">{coverLetter}</div>
        </div>

        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-[#27AE60]">
                Milestones Breakdown
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#EFFFF6]">
                            <th className="text-left py-3 px-4 font-semibold text-gray-500">Deliverable</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-500">Due Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-500">Description</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-500">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(milestones) &&
                            milestones.map((milestone) => (
                                <tr key={milestone._id} className="border-b border-[#27AE60]">
                                    <td className="py-3 px-4">{milestone.title}</td>
                                    <td className="py-3 px-4">
                                        {new Date(milestone.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {milestone.description}
                                    </td>
                                    <td className="py-3 px-4">${milestone.amount}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default ProposalMainContent