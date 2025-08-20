import { useState } from 'react';
import StatsSection from '../../components/admin/report/StatsSection';
import TicketsTable from '../../components/admin/report/TicketsTable';
import TicketDetailsModal from '../../components/admin/report/TicketDetailsModal';
import type { Status, Ticket } from '../../components/admin/report/types';
import Pagination from '../../components/Pagination';
import { useAdminTickets } from '../../features/apis/admin/useAdminTickets';
import ErrorMessage from '../../components/ui/ErrorMessage';


const AdminTicketDashboard = () => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const {
        tickets,
        loading,
        error,
        totalPages,
        setTickets,
        updateTicketStatus,
    } = useAdminTickets(currentPage, 5);

    const handleViewTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
    };

    const handleStatusUpdate = async (ticketId: string, newStatus: Status) => {
        try {
            await updateTicketStatus(ticketId, newStatus);
            setSelectedTicket(null);
        } catch (error) {
            console.error("Failed to update ticket status", error);
        }
    };

    const closeModal = () => {
        setSelectedTicket(null);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return (
            <main className="flex-1 p-4">
                <ErrorMessage message={error} onRetry={() => window.location.reload()} />
            </main>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Ticket Management</h1>
                    <p className="text-gray-600">Manage and track all support tickets</p>
                </div>

                <StatsSection tickets={tickets} />
                <TicketsTable
                    tickets={tickets}
                    onViewTicket={handleViewTicket}
                />
                {selectedTicket && (
                    <TicketDetailsModal
                        ticket={selectedTicket}
                        setTicket={setTickets}
                        onClose={closeModal}
                        onStatusUpdate={handleStatusUpdate}
                    />
                )}
            </div>
            <div className="flex justify-center mt-2">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                    }}
                />
            </div>
        </div>
    );
};

export default AdminTicketDashboard;