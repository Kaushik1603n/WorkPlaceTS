import { useState } from "react";

function RecentProject() {
    const [recentProjects] = useState([
        {
            id: 1,
            title:
                "Complete redesign of an Food delivery platform using React and Tailwind CSS",
            date: "Apr 2025",
            days: 14,
            status: "Completed",
        },
        {
            id: 2,
            title:
                "Complete redesign of an Food delivery platform using React and Tailwind CSS",
            date: "Apr 2025",
            days: 14,
            status: "In Progress",
        },
        {
            id: 3,
            title:
                "Complete redesign of an Food delivery platform using React and Tailwind CSS",
            date: "Apr 2025",
            days: 14,
            status: "In Progress",
        },
        {
            id: 4,
            title:
                "Complete redesign of an Food delivery platform using React and Tailwind CSS",
            date: "Apr 2025",
            days: 14,
            status: "Completed",
        },
    ]);

    return (
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 shadow-sm  ">
            {recentProjects.map((project) => (
                <div
                    key={project.id}
                    className=" border-gray-200 rounded-md p-4 hover:shadow-sm border border-color bg-color-light transition-shadow"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm">
                                {project.title}
                            </h4>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                                <span>{project.date}</span>
                                <span className="mx-2">•</span>
                                <span>{project.days} days</span>
                            </div>
                        </div>
                        <div>
                            <span
                                className={`px-3 py-1 text-xs rounded-full ${project.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                    }`}
                            >
                                {project.status}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RecentProject
