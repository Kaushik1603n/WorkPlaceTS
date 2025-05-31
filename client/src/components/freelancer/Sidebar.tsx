import { Link, useLocation } from "react-router-dom";
import {
    Briefcase,
    FileText,
    User,
    MessageSquare,
    Bell,
    ChevronRight,
    Calendar,
    Shield,
    Captions,
} from "lucide-react";
import type { JSX } from "react";

type SidebarItem = {
    icon: JSX.Element;
    label: string;
    path: string;
};

const sidebarItems: SidebarItem[] = [
    { icon: <Briefcase size={18} />, label: "Projects", path: "/freelancer-dashboard" },
    { icon: <FileText size={18} />, label: "Payments", path: "/freelancer-dashboard/payments" },
    { icon: <User size={18} />, label: "Profile", path: "/freelancer-dashboard/profile" },
    { icon: <MessageSquare size={18} />, label: "Message", path: "/freelancer-dashboard/message" },
    { icon: <Bell size={18} />, label: "Notification", path: "/freelancer-dashboard/notification" },
    { icon: <ChevronRight size={18} />, label: "Calender", path: "/freelancer-dashboard/Calender" },
    { icon: <User size={18} />, label: "Client", path: "/freelancer-dashboard/client" },
    { icon: <Calendar size={18} />, label: "Interview Scheduling", path: "/freelancer-dashboard/interview" },
    { icon: <Captions size={18} />, label: "Bids/Proposals", path: "/freelancer-dashboard/proposals" },
    { icon: <Shield size={18} />, label: "Dispute Resolution", path: "/freelancer-dashboard/dispute" },
  ];

const Sidebar = () => {
    const location = useLocation();
    const pathname = location.pathname;


    return (
        <aside className="w-55 bg-color-light p-4">
            {sidebarItems.map((item) => {
                const isActive =
                    item.path === "/freelancer-dashboard"
                        ? pathname === item.path
                        : pathname === item.path || pathname.startsWith(item.path + "/");

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`w-full flex items-center p-3 my-3 rounded-md text-sm border border-color ${isActive
                                ? "bg-color-first text-white"
                                : "text-gray-900 bg-white hover:bg-green-100"
                            }`}
                    >
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </aside>
    );
};

export default Sidebar;
