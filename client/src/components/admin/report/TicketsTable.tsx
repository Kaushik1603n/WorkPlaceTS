import { Eye,  User } from 'lucide-react';
import type { Ticket, Status } from './types';

interface TicketsTableProps {
    tickets: Ticket[];
    onViewTicket: (ticket: Ticket) => void;
}

const getStatusColor = (status: Status) => {
    const colors = {
        open: 'bg-red-100 text-red-800 border-red-200',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        resolved: 'bg-green-100 text-green-800 border-green-200',
        closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status];
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const TicketsTable = ({ tickets, onViewTicket }: TicketsTableProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-green-400 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Tickets</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ticket Info
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tittle
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Description </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                            <tr key={ticket._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                                        <div className="text-xs text-gray-400 mt-1">ID: {ticket._id.slice(-8)}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm text-gray-500 truncate max-w-35">{ticket.description}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">{ticket.client.email}</div>
                                            <div className="text-xs text-gray-500">ID: {ticket.client.id.slice(-8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(ticket.status)}`}>
                                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(ticket.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => onViewTicket(ticket)}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        {/* <button className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50" title="Edit">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" title="Delete">
                                            <Trash2 className="h-4 w-4" />
                                        </button> */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TicketsTable;