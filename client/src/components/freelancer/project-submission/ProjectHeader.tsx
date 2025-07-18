import React from 'react';

interface ProjectHeaderProps {
  title: string;
  clientName: string;
  status: string;
  jobId: string;
  acceptedDate: string;
  progress: number;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  clientName,
  status,
  jobId,
  progress
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Client: <span className="text-blue-600 font-medium">{clientName}</span></span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">{status}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Job ID: {jobId} </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600 mb-1">Progress:</p>
        <p className="text-lg font-semibold text-gray-900">{progress.toFixed(2)}% Complete</p>
        <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-green-500 h-2 rounded-full" style={{width: `${progress}%`}}></div>
        </div>
      </div>
    </div>
  </div>
);