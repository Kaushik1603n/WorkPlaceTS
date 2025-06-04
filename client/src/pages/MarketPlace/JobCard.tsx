import { Link } from "react-router-dom";
import type { Job } from "./MarketPlace";

interface JobCardProps {
    job: Job;
}

function JobCard({ job }: JobCardProps) {
    return (
        <div
            key={job._id}
            className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition duration-150"
        >
            <div className="flex flex-col sm:flex-row justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {job.stack} Stack · Posted{" "}
                        {new Date(job.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className="mt-2 sm:mt-0">
                    <Link
                        to={`job-details/${job._id}`}
                        className="bg-green-100 text-green-600 hover:bg-green-200 px-4 py-2 rounded-md text-sm font-medium"
                    >
                        View Job
                    </Link>
                </div>
            </div>

            <p className="mt-3 text-gray-700 line-clamp-2">
                {job.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                    <span
                        key={index}
                        className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full"
                    >
                        {skill}
                    </span>
                ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-700">
                        ${job.budget}
                    </h3>
                </div>
                <div className="text-sm text-gray-600">
                    {job?.proposals?.length} proposals
                </div>
            </div>
        </div>
    );
}

export default JobCard;