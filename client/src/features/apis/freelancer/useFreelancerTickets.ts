import { useState, useCallback, useEffect } from 'react';
import axiosClient from '../../../utils/axiosClient';
import type { Ticket } from '../../../components/client/ticket/types';

interface UseFreelancerTicketsReturn {
    tickets: Ticket[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPage: number;
    fetchTickets: (page?: number) => Promise<void>;
    setCurrentPage: (page: number) => void;
    refetch: () => Promise<void>;
}

const useFreelancerTickets = (): UseFreelancerTicketsReturn => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPageState] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);

    const fetchTickets = useCallback(async (page: number = currentPage) => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axiosClient.get("/freelancer/tickets", {
                params: { page, limit: 5 }
            });
            
            setTickets(res.data.data || []);
            setTotalPage(res.data.totalPages || 1);
            
        } catch (err) {
            const errorMessage =  'Failed to fetch tickets';
            setError(errorMessage);
            console.error('Failed to fetch tickets:', err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    const refetch = useCallback(async () => {
        await fetchTickets(currentPage);
    }, [fetchTickets, currentPage]);

    const setCurrentPage = useCallback((page: number) => {
        setCurrentPageState(page);
    }, []);

    useEffect(() => {
        fetchTickets(currentPage);
    }, [currentPage, fetchTickets]);

    return {
        tickets,
        isLoading,
        error,
        currentPage,
        totalPage,
        fetchTickets,
        setCurrentPage,
        refetch
    };
};

export default useFreelancerTickets;