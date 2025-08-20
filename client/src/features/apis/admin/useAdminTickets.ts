import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import type { Ticket, Status } from "../../../components/admin/report/types";

export function useAdminTickets(page: number, limit: number = 5) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.get("/admin/tickets", {
          params: { page, limit },
        });

        setTickets(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Failed to load tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [page, limit]);

  const updateTicketStatus = async (ticketId: string, newStatus: Status) => {
    try {
      const res = await axiosClient.patch(`/admin/tickets/${ticketId}`, {
        status: newStatus,
      });
      const updatedTicket = res.data.data;
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? updatedTicket : t))
      );
      return updatedTicket;
    } catch (err) {
      console.error("Failed to update ticket:", err);
      throw err;
    }
  };

  return { tickets, loading, error, totalPages, setTickets, updateTicketStatus };
}
