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
} from "lucide-react";
import type { JSX } from "react";

type SidebarItem = {
    icon: JSX.Element;
    label: string;
    path: string;
};

const sidebarItems: SidebarItem[] = [
    { icon: <Briefcase size={18} />, label: "Projects", path: "/client-dashboard" },
    { icon: <FileText size={18} />, label: "Payments", path: "/client-dashboard/payments" },
    { icon: <User size={18} />, label: "Profile", path: "/client-dashboard/profile" },
    { icon: <MessageSquare size={18} />, label: "Message", path: "/client-dashboard/message" },
    { icon: <Bell size={18} />, label: "Notification", path: "/client-dashboard/notification" },
    { icon: <ChevronRight size={18} />, label: "Project Posting", path: "/client-dashboard/posting" },
    { icon: <Briefcase size={18} />, label: "Active Projects", path: "/client-dashboard/active-project" },
    { icon: <User size={18} />, label: "Freelancer", path: "/client-dashboard/freelancer" },
    { icon: <Calendar size={18} />, label: "Interview Scheduling", path: "/client-dashboard/interview" },
    { icon: <Shield size={18} />, label: "Dispute Resolution", path: "/client-dashboard/dispute" },
];
const Sidebar = () => {
    const location = useLocation();
    const pathname = location.pathname;


    return (
        <aside className="w-55 bg-color-light p-4">
            {sidebarItems.map((item) => {
                const isActive =
                    item.path === "/client-dashboard"
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
