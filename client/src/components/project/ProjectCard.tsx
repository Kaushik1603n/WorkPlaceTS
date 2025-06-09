
interface freelancerProject  {
  _id: string;
  contractId: string;
  budget: number;
  budgetType: string;
  time: string;
  status: string;
  title: string;
  description: string;
}

interface Props {
    project: freelancerProject;
    onViewContract: (id: string) => void;
}

export default function ProjectCard({ project, onViewContract }: Props) {
    return (
        <div
            key={project._id}
            className="border border-[#27AE60] rounded-lg p-6 bg-[#EFFFF6] relative shadow-sm"
        >
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-3">
                Bid: ${project.budget} • Type:{" "}
                {project.budgetType}
            </p>
            <p className="text-gray-500 mb-2">
                Estimated Time: {project.time} week(s)
            </p>
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                    onClick={() => onViewContract(project._id)}
                    className="mt-2 text-green-500 border border-green-500 text-md rounded-full w-full p-2"
                >
                    Details
                </button>
            </div>
        </div>
    );
}
