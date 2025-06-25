import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface INotification {
  _id: string;
  userId: string;
  type: "message" | "proposal" | "payment" | "milestone";
  title: string;
  message: string;
  content: string;
  isRead: boolean;
  actionLink?: string;
  metadata?: { [key: string]: string };
  createdAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  notifications: INotification[];
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  markMessageRead: (messageId: string, contactId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode; userId: string }> = ({
  children,
  userId,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io("http://localhost:5000", {
      reconnection: true,
      reconnectionAttempts: 5,
      auth: { token: localStorage.getItem("access_token") },
    });

    setSocket(newSocket);

    newSocket.emit("register", userId);

    // Listen for notifications
    newSocket.on("notification", (notification: INotification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    // Handle socket errors
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    // Cleanup on unmount
    return () => {
      newSocket.off("notification"); // Remove specific listener
      newSocket.disconnect();
      setSocket(null);
      setNotifications([]); // Optional: Clear notifications on disconnect
    };
  }, [userId]);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markMessageRead = (messageId: string, contactId: string) => {
    if (socket) {
      socket.emit("markMessageRead", { messageId, userId, contactId });
      // Optionally update local messages if needed
    }
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, markAllNotificationsRead, clearNotifications, markMessageRead, }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};