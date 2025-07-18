import { useState } from 'react';
import TabButton from './TabButton';
import HiringProjects from './HiringProjects';
import FinancialInsights from './FinancialInsights';

const ClientAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('hiring');



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Analytics Dashboard</h1>
          <p className="text-gray-600">Track your freelancing projects and metrics</p>
        </div>

        <div className="flex space-x-4 mb-8 overflow-x-auto">
          <TabButton id="hiring" label="Hiring & Projects" active={activeTab === 'hiring'} onClick={setActiveTab} />
          <TabButton id="financial" label="Financial Insights" active={activeTab === 'financial'} onClick={setActiveTab} />
        </div>

        {activeTab === 'hiring' && (
          <HiringProjects />
        )}

        {activeTab === 'financial' && (
          <FinancialInsights/>    
        )}
      </div>
    </div>
  );
};

export default ClientAnalyticsDashboard;