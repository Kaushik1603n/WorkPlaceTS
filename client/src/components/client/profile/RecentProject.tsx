import { useState, useEffect } from "react";

interface freelancerProject {
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
    allProject: freelancerProject[];
}

function RecentProject({ allProject }: Props) {
    const [recentProjects, setRecentProjects] = useState<freelancerProject[]>(allProject || []);

    useEffect(() => {
        setRecentProjects(allProject || []);
    }, [allProject]);

    if (recentProjects.length === 0) {
        return <div className="text-gray-500 py-4">No recent projects found</div>;
    }

    return (
        <div className="space-y-4 max-h-90 overflow-y-auto pr-2 shadow-sm">
            {recentProjects.map((project) => (
                <div
                    key={project._id}
                    className="border-gray-200 rounded-md p-4 hover:shadow-sm border border-color bg-color-light transition-shadow"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm">
                                {project.title || "Untitled Project"}
                            </h4>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                                <span>Budget: {project.budget} {project.budgetType}</span>
                                <span className="mx-2">•</span>
                                <span>Time: {project.time}</span>
                            </div>
                        </div>
                        <div>
                            <span
                                className={`px-3 py-1 text-xs rounded-full border ${project.status === "completed"
                                    ? "bg-green-100 text-green-700 border-green-500"
                                    : project.status === "in-progress"
                                        ? "bg-blue-100 text-blue-700 border-blue-500"
                                        : project.status === "posted"
                                            ? "bg-yellow-100 text-yellow-700 border-yellow-500"
                                            : "bg-gray-50 text-gray-600 border-gray-200"
                                    }`}
                            >
                                {project.status}
                            </span>
                        </div>
                    </div>
                    {project.description && (
                        <p className="mt-2 text-xs text-gray-600 truncate">
                            {project.description}
                        </p>
                    )}
                </div>
            ))}

        </div>
    );
}

export default RecentProject;