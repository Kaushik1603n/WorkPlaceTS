import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { actionChange, getClientData } from '../../features/admin/users/usersSlice';
import Pagination from '../../components/Pagination';
import { useSelector } from "react-redux";
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';
import UserVerifyTable from '../../components/admin/tables/UserVerifyTable';
import { useNavigate } from 'react-router-dom';
function Client() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const navigate = useNavigate();


    const dispatch = useDispatch<AppDispatch>()
    const { client, pagination } = useSelector((state: RootState) => state.userData) || { users: [], pagination: null };


    useEffect(() => {
        dispatch(getClientData({ page: currentPage, limit: 5, search: debouncedSearchTerm }));
    }, [dispatch, currentPage, debouncedSearchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleActionChange = (customerId: string, action: string) => {

        dispatch(actionChange({ userId: customerId, status: action }))
            .unwrap()
            .then(() => {
                dispatch(getClientData({ page: currentPage, limit: 5, search: debouncedSearchTerm }));
                toast.success("Updated user status")
            })
            .catch((error) => {
                // Handle error
                toast.error(error.error)
                console.error(error);
            });
    };

    const viewProfileDetails = (userId: string) => {
        navigate(`/admin-dashboard/client/${userId}`);

    }




    return (
        <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-12 pr-12 py-4 border-2 border-green-200 rounded-full focus:outline-none focus:border-green-500 text-gray-600"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Search className="text-green-500 w-5 h-5" />
                    </div>
                </div>
            </div>

            <UserVerifyTable users={client || []}
                onActionChange={handleActionChange} onVerify={viewProfileDetails} />


            <Pagination
                currentPage={pagination.currentPage || 1}
                totalPages={pagination.totalPages}
                onPageChange={(page) => {
                    setCurrentPage(page);
                }}
            />
        </div>

    );
}

export default Client;