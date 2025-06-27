import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import axiosClient from "../../utils/axiosClient";
import { useMemo } from "react";
import { Link } from "react-router-dom";

interface INotification {
    _id: string;
    userId: string;
    type: "message" | "proposal" | "payment" | "milestone" | "contract";
    title: string;
    message: string;
    content: string;
    isRead: boolean;
    actionLink?: string;
    metadata?: { [key: string]: string };
    createdAt: string;
}


function FreelancerNotification() {
    const { notifications: socketNotifications, clearNotifications } = useSocket();
    const [storedNotifications, setStoredNotifications] = useState<INotification[]>([]);
    const [allNotifications, setAllNotifications] = useState<INotification[]>([]);
    const [loading, setLoading] = useState(false);


    // useEffect(() => {
    //     setLoading(true)
    //     const fetchNotifications = async () => {
    //         try {
    //             const res = await axiosClient.get("/notifications");
    //             setStoredNotifications(res.data.data);
    //         } catch (error) {
    //             console.error("Error fetching notifications:", error);
    //             toast.error("Failed to fetch notifications");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     const markNotificationsAsRead = async () => {
    //         try {
    //             await axiosClient.patch("/notifications/mark-read");
    //             setStoredNotifications((prev) =>
    //                 prev.map((n) => ({ ...n, isRead: true }))
    //             );
    //         } catch (error) {
    //             console.error("Error marking notifications as read:", error);
    //             toast.error("Failed to mark notifications as read");
    //         }
    //     };

    //     fetchNotifications();
    //     markNotificationsAsRead();

    // return () => {
    //     if (clearNotifications) {
    //         clearNotifications();
    //     }
    // };
    // }, []);

    useEffect(() => {
        return () => {
            if (clearNotifications) {
                clearNotifications();
            }
        };
    }, [])
    useMemo(() => {
        const combinedNotifications = [
            ...storedNotifications,
            ...socketNotifications.filter(
                (sn) => !storedNotifications.some((n) => n._id === sn._id)
            ),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return setAllNotifications(combinedNotifications);
    }, [storedNotifications, socketNotifications]);


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            {loading ? (
                <p>Loading notifications...</p>
            ) : allNotifications.length === 0 ? (
                <p>No notifications available.</p>
            ) : (

                <div>
                    <div className="flex-1 p-8">
                        <div className="max-w-2x2 mx-auto">
                            <div className="bg-[#EFFFF6] rounded-2xl shadow-sm border border-[#27AE60] p-6">
                                <div className="space-y-4">
                                    {allNotifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            className={`flex items-center justify-between p-4 rounded-xl border border-[#27AE60] ${notification.isRead ? "bg-white" : "bg-blue-50"}`}
                                        >
                                            <div className="flex items-center space-x-4">

                                                {/* <div className="w-29 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                                                    <span className="text-yellow-600 font-semibold text-lg">👤</span>
                                                </div> */}

                                                {/* Content */}
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-semibold text-gray-900">{notification.title}</span>
                                                        <span className="text-sm text-gray-500">{notification.type}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {new Date(notification.createdAt).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Review Button */}
                                            {notification.actionLink && (
                                                <Link to={notification.actionLink} className="px-6 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors">
                                                    Review
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default FreelancerNotification
