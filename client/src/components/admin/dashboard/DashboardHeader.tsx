import React from 'react';

interface DashboardHeaderProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive platform insights and metrics</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;