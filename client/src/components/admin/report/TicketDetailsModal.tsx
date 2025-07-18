import { Mail, Hash, Calendar, User, } from 'lucide-react';
import type { Ticket, Status } from './types';
import { useState } from 'react';
import axiosClient from '../../../utils/axiosClient';

interface TicketDetailsModalProps {
    ticket: Ticket;
    onClose: () => void;
    onStatusUpdate: (ticketId: string, newStatus: Status) => void;
    setTicket: React.Dispatch<React.SetStateAction<Ticket[]>>;
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

const TicketDetailsModal = ({ ticket, onClose, onStatusUpdate, setTicket }: TicketDetailsModalProps) => {
    const [comment, setComment] = useState('');
    const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');

    const handleAddComment = async () => {
        try {
            const response = await axiosClient.post(`/admin/tickets/${ticket._id}/comments`, { text: comment })
            setTicket(prevTickets => prevTickets.map(t =>
                t._id === ticket._id ? response.data.data : t
            ));
            setComment('');
            onClose()
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return (
        <div className="fixed inset-0  backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Ticket Details</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
                        title="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'comments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Comments ({ticket.comments?.length || 0})
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'details' ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">{ticket.title}</h4>
                                    <p className="text-gray-600 mt-1">Ticket ID: {ticket._id}</p>
                                </div>
                                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(ticket.status)}`}>
                                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                </span>
                            </div>

                            <div>
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Description</h5>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{ticket.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                            <Mail className="h-4 w-4 mr-1" />
                                            Client Information
                                        </h5>
                                        <div className="space-y-2 pl-5">
                                            <p className="text-gray-700">{ticket.client.email}</p>
                                            <p className="text-gray-700 font-mono text-sm">ID: {ticket.client.id}</p>
                                            {ticket.client.name && <p className="text-gray-700">{ticket.client.name}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                            <Hash className="h-4 w-4 mr-1" />
                                            Job Information
                                        </h5>
                                        <div className="space-y-2 pl-5">
                                            <p className="text-gray-700 font-mono text-sm">Job ID: {ticket.jobId}</p>
                                            <p className="text-gray-700 font-mono text-sm">Reported by: {ticket.reportedBy}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            Timestamps
                                        </h5>
                                        <div className="space-y-2 pl-5">
                                            <p className="text-gray-700">Created: {formatDate(ticket.createdAt)}</p>
                                            <p className="text-gray-700">Last Updated: {formatDate(ticket.updatedAt)}</p>
                                        </div>
                                    </div>

                                    {ticket.statusHistory && ticket.statusHistory.length > 0 && (
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-900 mb-2">Status History</h5>
                                            <div className="space-y-2 pl-5">
                                                {ticket.statusHistory.map((history, index) => (
                                                    <div key={index} className="flex items-center">
                                                        <div className={`h-2 w-2 rounded-full mr-2 ${history.status === 'resolved' ? 'bg-green-500' :
                                                            history.status === 'closed' ? 'bg-gray-500' : 'bg-blue-500'
                                                            }`} />
                                                        <span className="text-sm text-gray-700">
                                                            {history.status.toUpperCase()} - {formatDate(history.changedAt)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <h5 className="text-sm font-medium text-gray-900 mb-3">Ticket Actions</h5>
                                <div className="flex flex-wrap gap-3">
                                    {ticket.status !== 'pending' && (
                                        <button
                                            onClick={() => onStatusUpdate(ticket._id, 'pending')}
                                            className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
                                        >
                                            Mark as Pending
                                        </button>
                                    )}
                                    {ticket.status !== 'resolved' && (
                                        <button
                                            onClick={() => onStatusUpdate(ticket._id, 'resolved')}
                                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                        >
                                            Resolve Ticket
                                        </button>
                                    )}
                                    {ticket.status !== 'closed' && (
                                        <button
                                            onClick={() => onStatusUpdate(ticket._id, 'closed')}
                                            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            Close Ticket
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                {ticket.comments && ticket.comments.length > 0 ? (
                                    ticket.comments.map((comment, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                                            <div className="flex items-center mb-2">
                                                <User className="h-5 w-5 text-gray-500 mr-2" />
                                                <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 pl-7">{comment.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No comments yet</p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Add Comment</h5>
                                <div className="flex gap-3">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add your comment here..."
                                        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        disabled={!comment.trim()}
                                        className="self-end px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketDetailsModal;