import {  Calendar,  IndianRupee, Eye, FileText, Star } from "lucide-react";

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


export default function ProjectCard({ project, onViewContract }:Props) {
  return (
    <div className="relative p-[2px] bg-gradient-to-r from-[#27AE60] via-[#27AE60] to-[#27AE60] rounded-2xl">
      <div className="bg-white rounded-2xl p-6 h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <FileText className="text-emerald-500" size={20} />
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              {project.budgetType} Project
            </span>
          </div>
          <Star className="text-yellow-400 fill-current" size={18} />
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {project.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1 text-emerald-600">
            <IndianRupee size={18} />
            <span className="text-lg font-bold">{project.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar size={16} />
            <span className="text-sm">{project.time} weeks</span>
          </div>
        </div>

        <button
          onClick={() => onViewContract(project._id)}
          className="w-full bg-gradient-to-r bg-[#2ECC71]  text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Eye size={16} />
          Explore Details
        </button>
      </div>
    </div>
  );
}


