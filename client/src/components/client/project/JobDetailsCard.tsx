import React from "react";
import {
  Briefcase,
  Timer,
  Award,
  ExternalLink,
  User,
  Mail,
  Target,
} from "lucide-react";

interface JobDetails {
  title: string;
  description: string;
  stack: string;
  time: string;
  reference: string;
  requiredFeatures: string[];
  budgetType: string;
  budget: string;
  experienceLevel: string;
  clientId: {
    fullName: string;
    email: string;
  };
}

interface JobDetailsCardProps {
  job: JobDetails;
}

const getBudgetIcon = (budgetType: string) => {
  return budgetType?.toLowerCase() === "fixed" ? Target : Timer;
};

export const JobDetailsCard: React.FC<JobDetailsCardProps> = ({ job }) => {
  const BudgetIcon = getBudgetIcon(job?.budgetType || "");

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-[#2bd773] overflow-hidden">
        <div className="bg-gradient-to-r from-[#2ECC71] to-[#2bd773] p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Job Details</h2>
          <p className="text-emerald-100">Complete project overview and requirements</p>
        </div>

        <div className="p-8 space-y-8">
          <div className="border-l-4 border-emerald-500 pl-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              Project Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{job?.description}</p>
          </div>

          <div className="bg-[#EFFFF6] rounded-xl p-6 border border-[#2bd773]">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Tech Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              {job?.stack?.split(",").map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#EFFFF6] rounded-xl p-6 border border-[#2bd773]">
              <div className="flex items-center gap-3 mb-2">
                <Timer className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Timeline</h3>
              </div>
              <p className="text-gray-700 font-medium">{job?.time} only</p>
            </div>

            <div className="bg-[#EFFFF6] rounded-xl p-6 border border-[#2bd773]">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Experience Level</h3>
              </div>
              <p className="text-gray-700 font-medium">{job?.experienceLevel}</p>
            </div>
          </div>

          <div className="bg-[#EFFFF6] rounded-xl p-6 border border-[#2bd773]">
            <div className="flex items-center gap-3 mb-4">
              <BudgetIcon className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Budget Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Budget Type</p>
                <p className="font-bold text-gray-900">{job?.budgetType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Amount</p>
                <p className="font-bold text-gray-900">{job?.budget}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Required Features / Pages
            </h3>
            <div className="bg-[#EFFFF6] rounded-xl p-6 border border-[#2bd773]">
              <p className="text-gray-700">{job?.requiredFeatures}</p>
            </div>
          </div>

          {job?.reference && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Reference</h3>
              <a
                href={job.reference}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
                View Reference
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-[#2bd773] p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          Posted by
        </h3>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {job?.clientId?.fullName?.[0] || "C"}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{job?.clientId?.fullName}</h4>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{job?.clientId?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};