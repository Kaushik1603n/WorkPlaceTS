import { useEffect, useState } from 'react'
import axiosClient from '../../../utils/axiosClient';
import type { Ticket } from '../../../components/client/ticket/types';
import FreelancerTicketsTable from './FreelancerTicketsTable';
import Pagination from '../../../components/Pagination';


function FreelcancerTicket() {
    const [isLoading, setIsLoading] = useState(true);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axiosClient.get("/freelancer/tickets", {
                    params: { page: currentPage, limit: 5 }
                });
                setTickets(res.data.data);
                setTotalPage(res.data.totalPages);
                console.log(res.data);
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTickets();
    }, [currentPage]);




    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading tickets...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Support Tickets</h1>
                    <p className="text-gray-600">Review and respond to tickets raised by You</p>
                </div>

                <FreelancerTicketsTable
                    tickets={tickets}
                />


            </div>
            <div className="flex justify-center mt-6">
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
}

export default FreelcancerTicket
