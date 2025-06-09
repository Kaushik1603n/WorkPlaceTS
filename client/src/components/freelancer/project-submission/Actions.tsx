import React from 'react';
import { DollarSign, Clock, AlertCircle } from 'lucide-react';

interface ActionsProps {
  currentMilestone?: number;
  onRequestPayment: () => void;
  onSubmitWork: () => void;
  onRequestExtension: () => void;
  onReportIssue: () => void;
}

export const Actions: React.FC<ActionsProps> = ({
  currentMilestone = 1,
  onRequestPayment,
  onSubmitWork,
  onRequestExtension,
  onReportIssue
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
    
    <div className="space-y-3">
      <button 
        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        onClick={onSubmitWork}
      >
        Submit Work for Milestone {currentMilestone}
      </button>
      
      <button 
        className="w-full border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        onClick={onRequestPayment}
      >
        <DollarSign className="w-4 h-4" />
        <span>Request Milestone Payment</span>
      </button>
      
      <button 
        className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        onClick={onRequestExtension}
      >
        <Clock className="w-4 h-4" />
        <span>Extend Deadline</span>
      </button>
      
      <button 
        className="w-full border border-red-300 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        onClick={onReportIssue}
      >
        <AlertCircle className="w-4 h-4" />
        <span>Report Issue</span>
      </button>
    </div>
  </div>
);