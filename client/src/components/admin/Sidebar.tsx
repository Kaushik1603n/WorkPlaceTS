import {
    Briefcase,
    FileText,
    User,
    Shield,
} from "lucide-react";
import type { JSX } from "react";
import { Link, useLocation } from "react-router-dom";


function Sidebar() {

    type SidebarItem = {
        icon: JSX.Element;
        label: string;
        path: string;
    };

    const sidebarItems: SidebarItem[] = [
        { icon: <Briefcase size={18} />, label: "Dashboard", path: "/admin-dashboard" },
        { icon: <FileText size={18} />, label: "Projects", path: "/admin-dashboard/projects" },
        { icon: <FileText size={18} />, label: "Payments", path: "/admin-dashboard/payments" },
        { icon: <Shield size={18} />, label: "Report Resolution", path: "/admin-dashboard/Report-Resolution" },
        { icon: <User size={18} />, label: "Freelancer", path: "/admin-dashboard/freelancer" },
        { icon: <User size={18} />, label: "Client", path: "/admin-dashboard/client" },
        { icon: <User size={18} />, label: "Users", path: "/admin-dashboard/users" },

    ];
    const location = useLocation();
    const pathname = location.pathname;


    return (
        <aside className="w-55 bg-color-light p-4">
            {sidebarItems.map((item) => {
                const isActive =
                    item.path === "/admin-dashboard"
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
}

export default Sidebar
