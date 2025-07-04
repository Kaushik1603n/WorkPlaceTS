import { Link, useLocation } from "react-router-dom";
import {
    Briefcase,
    FileText,
    User,
    MessageSquare,
    Bell,
    ChevronRight,
    // Calendar,
    Shield,
    Captions,
    Menu,
    X
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

type SidebarItem = {
    icon: JSX.Element;
    label: string;
    path: string;
};

const sidebarItems: SidebarItem[] = [
    { icon: <Briefcase size={18} />, label: "Dashboard", path: "/freelancer-dashboard" },
    { icon: <ChevronRight size={18} />, label: "Project", path: "/freelancer-dashboard/project" },
    { icon: <FileText size={18} />, label: "Payments", path: "/freelancer-dashboard/payments" },
    { icon: <User size={18} />, label: "Profile", path: "/freelancer-dashboard/profile" },
    { icon: <MessageSquare size={18} />, label: "Message", path: "/freelancer-dashboard/message" },
    { icon: <Bell size={18} />, label: "Notification", path: "/freelancer-dashboard/notification" },
    { icon: <User size={18} />, label: "Client", path: "/freelancer-dashboard/client" },
    // { icon: <Calendar size={18} />, label: "Interview Scheduling", path: "/freelancer-dashboard/interview" },
    { icon: <Captions size={18} />, label: "Bids/Proposals", path: "/freelancer-dashboard/proposals" },
    { icon: <Shield size={18} />, label: "Dispute Resolution", path: "/freelancer-dashboard/dispute" },
];



const Sidebar = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile toggle button */}
            <button
                className="lg:hidden fixed top-20 left-4 z-50 p-2  rounded-md shadow-md"
                onClick={toggleSidebar}
            >
                {!isOpen && <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed lg:static top-0 left-0 h-full lg:h-auto z-40
                w-64 bg-[#EFFFF6] p-4 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex items-center justify-between mb-6 lg:mb-4">
                    <h2 className="text-lg font-semibold lg:hidden">Menu</h2>
                    <button className="lg:hidden" onClick={toggleSidebar}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex flex-col space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive =
                            item.path === "/freelancer-dashboard"
                                ? pathname === item.path
                                : pathname === item.path || pathname.startsWith(item.path + "/");

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`w-full flex items-center p-3 my-1 rounded-md text-sm border border-[#27AE60] ${
                                    isActive
                                        ?  "bg-[#2ECC71] text-white"
                                        : "text-gray-900 bg-white border-[#27AE60] hover:bg-green-100"
                                }`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Overlay for mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};

export default Sidebar;