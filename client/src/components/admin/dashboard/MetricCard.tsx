import React from 'react';
import type{ MetricCardProps } from './types';
// import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  // change, 
  icon: Icon, 
  format = 'number' 
}) => {
  // const isPositive = change > 0;
  
  const formatValue = (val: number): string => {
    if (format === 'currency') return `$${val.toLocaleString()}`;
    if (format === 'percentage') return `${val}%`;
    return val.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatValue(value)}</p>
          {/* <div className="flex items-center mt-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change)}% from last month
            </span>
          </div> */}
        </div>
        <div className="bg-blue-100 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;