import React from 'react';
import type{ Milestone } from '../../freelancer/project-submission/types/project';

interface MilestonesDeliverablesProps {
  milestones: Milestone[];
  onSubmitWork: (milestoneId: number) => void;
}

export const MilestonesDeliverables: React.FC<MilestonesDeliverablesProps> = ({
  milestones,
  onSubmitWork
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': 
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      case 'submitted': return 'Submitted for Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected - Needs Revision';
      case 'pending': 
      default: return 'Pending';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Milestones & Deliverables</h2>
        <button 
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1 rounded transition-colors"
          onClick={() => onSubmitWork(milestones.find(m => m.status === 'in-progress')?.id || 0)}
        >
          Submit Work
        </button>
      </div>
      
      <div className="space-y-4">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">Milestone {milestone.id}: {milestone.title}</h3>
                <p className="text-sm text-gray-500">Due: {milestone.dueDate}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                {getStatusText(milestone.status)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">${milestone.amount.toFixed(2)}</span>
              {milestone.status === 'in-progress' && (
                <button 
                  className="border border-green-500 text-green-600 hover:bg-green-50 text-sm font-medium px-3 py-1 rounded transition-colors"
                  onClick={() => onSubmitWork(milestone.id)}
                >
                  Submit for Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};