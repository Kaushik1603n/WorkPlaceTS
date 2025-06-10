import React from 'react';
import { format } from 'date-fns'; 

interface ProjectOverviewProps {
  brief: string;
  goals: string; 
  deliverables: string; 
  startDate: Date; 
  deadline: Date; 
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  brief,
  goals,
  deliverables,
  startDate,
  deadline
}) => {
  const parseFeatures = (features: string) => {
    return features.split(',').map(item => item.trim());
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h2>
      
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Client's Initial Brief</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{brief}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-blue-600 mb-3">Goals/Requirements:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {parseFeatures(goals).map((goal, index) => (
            <li key={index} className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              {goal}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Freelancer's Proposal Summary</h3>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-blue-600 mb-2">Scope of Work:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-medium mb-1">Deliverables:</p>
              <ul className="list-disc pl-5">
                {parseFeatures(deliverables).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Timeline:</p>
              <p><strong>Start Date:</strong> {format(new Date(startDate), 'MMM dd, yyyy')}</p>
              <p><strong>Deadline:</strong> {format(new Date(deadline), 'MMM dd, yyyy')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};