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
        {/* <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select> */}
      </div>
    </div>
  );
};

export default DashboardHeader;