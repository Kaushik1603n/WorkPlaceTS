import { AlertCircle, Clock, User, Calendar } from 'lucide-react';
import type{ Ticket } from './types';

interface StatsSectionProps {
  tickets: Ticket[];
}

const StatsSection = ({ tickets }: StatsSectionProps) => {
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const activeClients = new Set(tickets.map(t => t.client.id)).size;
  const avgResponseTime = '2.4h'; // This would be calculated from your data

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-green-400 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Tickets</p>
            <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-green-400 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Open Tickets</p>
            <p className="text-2xl font-bold text-red-600">{openTickets}</p>
          </div>
          <Clock className="h-8 w-8 text-red-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-green-400 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Clients</p>
            <p className="text-2xl font-bold text-green-600">{activeClients}</p>
          </div>
          <User className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-green-400 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
            <p className="text-2xl font-bold text-purple-600">{avgResponseTime}</p>
          </div>
          <Calendar className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );
};

export default StatsSection;