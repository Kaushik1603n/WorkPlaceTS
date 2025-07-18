import { useEffect, useState } from 'react';
import StatsSection from '../../components/admin/report/StatsSection';
import TicketsTable from '../../components/admin/report/TicketsTable';
import TicketDetailsModal from '../../components/admin/report/TicketDetailsModal';
import type { Status, Ticket } from '../../components/admin/report/types';
import axiosClient from '../../utils/axiosClient';
import Pagination from '../../components/Pagination';


const AdminTicketDashboard = () => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [tickets, setTicket] = useState<Ticket[]>([
        {
            _id: "",
            client: {
                id: '',
                email: ''
            },
            createdAt: "",
            description: "",
            jobId: "",
            reportedBy: "",
            status: "open",
            title: "",
            updatedAt: "",
        }
    ]);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axiosClient.get("/admin/tickets", {
                    params: { page: currentPage, limit: 5 }
                });
                setTicket(res.data.data);
                setTotalPage(res.data.totalPages);
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchReport()
    }, [currentPage])


    const handleViewTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
    };

    const handleStatusUpdate = async (ticketId: string, newStatus: Status) => {
        try {
            const response = await axiosClient.patch(`/admin/tickets/${ticketId}`, { status: newStatus });
            const updatedTicket = response.data.data
            setTicket(tickets.map(t => t._id === ticketId ? updatedTicket : t));
            closeModal()
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const closeModal = () => {
        setSelectedTicket(null);
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
                        setTicket={setTicket} 
                        onClose={closeModal}
                        onStatusUpdate={handleStatusUpdate}
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

export default AdminTicketDashboard;