import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
interface TimelineItem {
  id: number;
  title: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  type: 'started' | 'deadline' | 'milestone' | 'delivery';
}

export const Timeline: React.FC = () => {
  const [timelineItems] = useState<TimelineItem[]>([
      { id: 1, title: 'Project Started', date: 'May 5, 2025', status: 'completed', type: 'started' },
      { id: 2, title: 'First Draft Deadline', date: 'May 10, 2025', status: 'current', type: 'deadline' },
      { id: 3, title: 'Development Milestone', date: 'May 20, 2025', status: 'upcoming', type: 'milestone' },
      { id: 4, title: 'Final Delivery', date: 'May 30, 2025', status: 'upcoming', type: 'delivery' }
    ]);
  
  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'current') return <Clock className="w-4 h-4 text-blue-500" />;
    return <AlertCircle className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline & Deadlines</h2>
      
      <div className="space-y-4">
        {timelineItems.map((item) => (
          <div key={item.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(item.status)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                item.status === 'completed' ? 'text-green-700' : 
                item.status === 'current' ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {item.title}
              </p>
              <p className="text-xs text-gray-500">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="w-full mt-4 border border-orange-300 text-orange-600 hover:bg-orange-50 font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Request Deadline Extension
      </button>
    </div>
  );
};