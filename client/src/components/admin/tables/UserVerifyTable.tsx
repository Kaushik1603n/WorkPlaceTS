import { ChevronDown } from 'lucide-react';
import React, { useState, } from 'react'
interface User {
    _id?: string;
    fullName?: string;
    email?: string;
    role?: string;
    status?: string;
    createdAt?: string;
}

interface UserVerifyTableProps {
    users: User[];
    onActionChange: (userId: string, action: string) => void;
    onVerify: (userId: string) => void;
}

function UserVerifyTable({ users, onActionChange, onVerify }: UserVerifyTableProps) {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const toggleDropdown = (userId: string) => {
        setOpenDropdownId(prev => prev === userId ? null : userId);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer Name</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">DOB</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">View</th>
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
                                <div className="relative">
                                    <button
                                        onClick={() => toggleDropdown(user._id as string)}
                                        className={`flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium ${user.status === 'active'
                                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
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
                            <td>
                                <button
                                    onClick={() => onVerify(user._id as string)}
                                    className="
                                         px-4 py-2 text-center text-sm 
                                        bg-white text-[#000] 
                                        border border-[#2ECC71] rounded-lg
                                        hover:bg-[#EFFFF6] hover:text-green-700 hover:border-[#2ECC71]
                                        transition-colors duration-200
                                        focus:outline-none focus:ring-2 focus:ring-[#EFFFF6] focus:ring-opacity-50
                                        active:bg-[#EFFFF6]
                                        shadow-sm
                                    "                                >
                                    Verify Profile
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default React.memo(UserVerifyTable);