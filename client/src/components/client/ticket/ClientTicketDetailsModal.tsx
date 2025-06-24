import { Calendar, User } from 'lucide-react';
import { useState } from 'react';
import type { Ticket } from './types';

interface ClientTicketDetailsModalProps {
    ticket: Ticket;
    onClose: () => void;
    onAddComment: (ticketId: string, comment: string) => void;
}

const ClientTicketDetailsModal = ({ ticket, onClose, onAddComment }: ClientTicketDetailsModalProps) => {
    const [comment, setComment] = useState('');
    const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');

    const handleSubmitComment = () => {
        if (!comment.trim()) return;
        onAddComment(ticket._id, comment);
        setComment('');
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Ticket Details</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-xl font-semibold text-gray-900">{ticket.title}</h4>
                            <p className="text-gray-600 mt-1">Job ID: {ticket.jobId}</p>
                            <p className="text-gray-600 mt-1">Ticket ID: {ticket._id}</p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${ticket.status === 'open' ? 'bg-red-100 text-red-800 border-red-200' :
                                ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                    'bg-green-100 text-green-800 border-green-200'
                            }`}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                    </div>

                    <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Description</h5>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{ticket.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                Freelancer
                            </h5>
                            <p className="text-gray-700">{ticket.reportedBy || 'Unknown Freelancer'}</p>
                        </div>
                        <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Created At
                            </h5>
                            <p className="text-gray-700">
                                {new Date(ticket.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex mb-4">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                            >
                                Details
                            </button>
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`px-4 py-2 font-medium ${activeTab === 'comments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                            >
                                Comments ({ticket.comments?.length || 0})
                            </button>
                        </div>

                        {activeTab === 'comments' && (
                            <div className="space-y-4">
                                {ticket.comments?.length ? (
                                    ticket.comments.map((comment, index) => (
                                        <div key={index} className="border-b border-gray-100 pb-4">
                                            <div className="flex items-center mb-2">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                                    <User className="h-4 w-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {comment.user === "admin" ? comment.user : 'you'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 pl-10">{comment.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No comments yet</p>
                                )}

                                <div className="mt-6">
                                    <h5 className="text-sm font-medium text-gray-900 mb-2">Add Your Comment</h5>
                                    <div className="flex gap-3">
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Type your response..."
                                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                        />
                                        <button
                                            onClick={handleSubmitComment}
                                            disabled={!comment.trim()}
                                            className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientTicketDetailsModal;