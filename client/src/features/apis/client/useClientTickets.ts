import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import { toast } from "react-toastify";
import type { Ticket } from "../../../components/client/ticket/types";

export const useClientTickets = (currentPage: number, limit: number = 5) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const res = await axiosClient.get("/client/project/tickets", {
          params: { page: currentPage, limit },
        });
        setTickets(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        toast.error("Failed to fetch tickets");
        console.error("Failed to fetch tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [currentPage, limit]);

  const addComment = async (ticketId: string, comment: string) => {
    try {
      const response = await axiosClient.post(
        `/client/project/tickets/${ticketId}/comments`,
        { text: comment }
      );
      const updatedTicket = response.data.data;
      setTickets((prevTickets) =>
        prevTickets.map((t) => (t._id === ticketId ? updatedTicket : t))
      );
      return updatedTicket;
    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Failed to add comment:", error);
      return null;
    }
  };

  return {
    tickets,
    isLoading,
    totalPages,
    setTickets,
    addComment,
  };
};
