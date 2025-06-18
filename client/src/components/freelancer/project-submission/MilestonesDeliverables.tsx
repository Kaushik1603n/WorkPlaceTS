import React from 'react';
import { format } from 'date-fns';

interface Milestone {
  _id: string;
  title: string;
  description?: string;
  amount: number;
  dueDate: string | Date;
  status: "submitted"
  | "interviewing"
  | "rejected"
  | "accepted"
  | "cancelled"
  | "active"
  | "completed"
  | "pending"
  | "paid"
}

interface MilestonesDeliverablesProps {
  milestones: Milestone[];
  onSubmitWork: (milestoneId: string) => void;
}

export const MilestonesDeliverables: React.FC<MilestonesDeliverablesProps> = ({
  milestones,
  onSubmitWork
}) => {
  const getStatusColor = (status: string) => {
    console.log(status);

    switch (status) {
      case 'interviewing': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-green-200 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending':
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'interviewing': return 'In Progress';
      case 'submitted': return 'Submitted for Review';
      case 'approved': return 'accepted';
      case 'paid': return 'Paid';
      case 'rejected': return 'Rejected - Needs Revision';
      case 'pending':
      default: return 'Pending';
    }
  };

  // Filter out empty milestones (your data has an empty object)
  const validMilestones = milestones.filter(m => m._id);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Milestones & Deliverables</h2>
        {validMilestones.some(m => m.status === 'interviewing') && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1 rounded transition-colors"
            onClick={() => {
              const inProgressMilestone = validMilestones.find(m => m.status === 'interviewing');
              if (inProgressMilestone) onSubmitWork(inProgressMilestone._id);
            }}
          >
            Submit Work
          </button>
        )}
      </div>

      {validMilestones.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No milestones have been added yet.</p>
      ) : (
        <div className="space-y-4">
          {validMilestones.map((milestone, index) => (
            <div key={milestone._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">Milestone {index + 1}: {milestone.title}</h3>
                  <p className="text-sm text-gray-500">
                    Due: {format(new Date(milestone.dueDate), 'MMM dd, yyyy')}
                  </p>
                  {milestone.description && (
                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                  {getStatusText(milestone.status)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">${milestone.amount.toFixed(2)}</span>
                {milestone.status === 'interviewing' || milestone.status === 'active' || milestone.status === 'rejected' ? (
                  <button
                    className="border border-green-500 text-green-600 hover:bg-green-50 text-sm font-medium px-3 py-1 rounded transition-colors"
                    onClick={() => onSubmitWork(milestone._id)}
                  >
                    Submit for Review
                  </button>
                ) : (
                  milestone.status !== 'accepted' &&
                    milestone.status !== 'paid' &&
                    milestone.status !== 'completed' ? (
                    <button
                      className="border border-gray-300 text-gray-400 text-sm font-medium px-3 py-1 rounded cursor-not-allowed"
                      disabled
                      title={`Cannot submit: Milestone is ${milestone.status}`}
                    >
                      Submit for Review
                    </button>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};