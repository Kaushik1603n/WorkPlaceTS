import { ChevronDown } from 'lucide-react';
import React, { useState,  } from 'react'
// import { useOnClickOutside } from 'usehooks-ts'; // Install via npm/yarn


interface User {
    _id?: string;
    fullName?: string;
    email?: string;
    role?: string;
    status?: string;
    createdAt?: string;
}

interface UsersTableProps {
    users: User[];
    onActionChange: (userId: string, action: string) => void;
}

function UsersTable({ users, onActionChange }: UsersTableProps) {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    // const ref = useRef<HTMLDivElement>(null);
    // useOnClickOutside(ref as RefObject<HTMLDivElement>, () => setOpenDropdownId(null))

    const toggleDropdown = (userId: string) => {
        setOpenDropdownId(prev => prev === userId ? null : userId);
    };

    return (
        <div  className="bg-white rounded-lg shadow-sm">
            <table  className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer Name</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">DOB</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
                    </tr>
                </thead>
                <tbody >
                    {users.map((user) => (
                        <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-6 font-medium text-gray-900">{user.fullName}</td>
                            <td className="py-4 px-6 text-gray-600">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }) : 'N/A'}
                            </td>
                            <td className="py-4 px-6 text-gray-600">{user.email}</td>
                            <td className="py-4 px-6">{user.role}</td>
                            <td className="py-4 px-6">
                                <div  className="relative">
                                    <button
                                        onClick={() => toggleDropdown(user._id as string)}
                                        className="flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200"
                                    >
                                        <span>{user.status}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {openDropdownId === user._id && (
                                        <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px] mt-1">
                                            <button
                                                onClick={() => onActionChange(user._id as string, 'active')}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 hover:text-purple-700 rounded-t-lg"
                                            >
                                                Active
                                            </button>
                                            <button
                                                onClick={() => onActionChange(user._id as string, 'block')}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 hover:text-red-700 rounded-b-lg"
                                            >
                                                Block
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default React.memo(UsersTable);