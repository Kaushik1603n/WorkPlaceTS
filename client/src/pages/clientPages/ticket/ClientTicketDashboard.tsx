import { useEffect, useState } from 'react';
import ClientTicketsTable from '../../../components/client/ticket/ClientTicketsTable';
import ClientTicketDetailsModal from '../../../components/client/ticket/ClientTicketDetailsModal';
import type { Ticket } from '../../../components/client/ticket/types';
import axiosClient from '../../../utils/axiosClient';
import { toast } from 'react-toastify';
import Pagination from '../../../components/Pagination';

const ClientTicketDashboard = () => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axiosClient.get("/client/project/tickets", {
                    params: { page: currentPage, limit: 5 }
                });
                setTickets(res.data.data);
                setTotalPage(res.data.totalPages);
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTickets();
    }, [currentPage]);

    const handleViewTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
    };

    const handleAddComment = async (ticketId: string, comment: string) => {
        try {
            const response = await axiosClient.post(`/client/project/tickets/${ticketId}/comments`, { text: comment });
            const updatedTicket = response.data.data;
            setTickets(tickets.map(t => t._id === ticketId ? updatedTicket : t));
            setSelectedTicket(updatedTicket);
        } catch (error) {
            toast.error("Failed to add comment")
            console.error('Failed to add comment:', error);
        }
    };

    const closeModal = () => {
        setSelectedTicket(null);
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading tickets...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Support Tickets</h1>
                    <p className="text-gray-600">Review and respond to tickets raised by freelancers</p>
                </div>

                <ClientTicketsTable
                    tickets={tickets}
                    onViewTicket={handleViewTicket}
                />

                {selectedTicket && (
                    <ClientTicketDetailsModal
                        ticket={selectedTicket}
                        onClose={closeModal}
                        onAddComment={handleAddComment}
                    />
                )}
            </div>
            <div className="flex justify-center mt-2">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPage}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                    }}
                />
            </div>
        </div>
    );
};

export default ClientTicketDashboard;