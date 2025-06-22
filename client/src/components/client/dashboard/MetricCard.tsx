import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {change}
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-green-100' : 'bg-blue-100'}`}>
        <Icon className={`w-6 h-6 ${trend === 'up' ? 'text-green-600' : 'text-blue-600'}`} />
      </div>
    </div>
  </div>
);

export default MetricCard;