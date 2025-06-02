import { Search, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { getUserData } from '../../features/admin/users/usersSlice';

const customers = [
    {
        id: "1",
        name: 'Jane Cooper',
        dob: '12-2-1999',
        username: 'Mr-kid',
        email: 'jane@microsoft.com',
        status: 'Active',
        action: 'Active'
    },
    {
        id: "2",
        name: 'Floyd Miles',
        dob: '31-1-2003',
        username: 'iam_john',
        email: 'floyd@yahoo.com',
        status: 'Inactive',
        action: 'Block'
    }
];

function AllUsers() {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [customerData, setCustomerData] = useState(customers);

    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(getUserData()).unwrap().then((data) => {
            console.log(data);

        })

    }, [dispatch])

    const handleActionChange = (customerId: string, action: string) => {
        setCustomerData(prev => prev.map(customer => {
            if (customer.id === customerId) {
                return {
                    ...customer,
                    action: action,
                    status: action === 'Active' ? 'Active' : 'Inactive'
                };
            }
            return customer;
        }));
        setOpenDropdownId(null);
    };

    const toggleDropdown = (customerId: string) => {
        setOpenDropdownId(prev => prev === customerId ? null : customerId);
    };

    return (
        <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-12 pr-12 py-4 border-2 border-green-200 rounded-full focus:outline-none focus:border-green-500 text-gray-600"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Search className="text-green-500 w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm ">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer Name</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">DOB</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Username</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerData.map((customer) => (
                            <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-4 px-6 font-medium text-gray-900">{customer.name}</td>
                                <td className="py-4 px-6 text-gray-600">{customer.dob}</td>
                                <td className="py-4 px-6 text-gray-600">{customer.username}</td>
                                <td className="py-4 px-6 text-gray-600">{customer.email}</td>
                                <td className="py-4 px-6">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${customer.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {customer.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6">client</td>
                                <td className="py-4 px-6">
                                    <div className="relative">
                                        <button
                                            onClick={() => toggleDropdown(customer.id)}
                                            className={`flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium ${customer.action === 'Active'
                                                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                        >
                                            <span>{customer.action}</span>
                                            <ChevronDown className="w-4 h-4" />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {openDropdownId === customer.id && (
                                            <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px] mt-1">
                                                <button
                                                    onClick={() => handleActionChange(customer.id, 'Active')}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 hover:text-purple-700 rounded-t-lg"
                                                >
                                                    Active
                                                </button>
                                                <button
                                                    onClick={() => handleActionChange(customer.id, 'Block')}
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
        </div>
    );
}

export default AllUsers;