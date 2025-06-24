import { useEffect, useState } from 'react';
import { Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';
import Pagination from '../../components/Pagination';
import axios from 'axios';
import { toast } from 'react-toastify';

interface IPayment {
    _id: string;
    jobId: string;
    proposalId: string;
    milestoneId: string;
    amount: number;
    platformFee: number;
    netAmount: number;
    status: string;
    paymentGatewayId: string;
    clientId: string;
    freelancerId: string;
    paymentMethod: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

function PaymentLising() {
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const controller = new AbortController();

        const fetchPaymentsDetails = async () => {
            setLoading(true);
            try {
                const res = await axiosClient.get("/admin/payments", {
                    params: { page: currentPage, limit: 5 },
                    signal: controller.signal,
                });
                setPayments(res.data.payment);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error("Fetch error:", error);
                    toast.error("Failed to load payments.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentsDetails();
        return () => controller.abort();
    }, [currentPage]);

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'paid':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'failed':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            completed: 'bg-green-100 text-green-800 border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            failed: 'bg-red-100 text-red-800 border-red-200'
        };

        return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading Payments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-fit bg-gradient-to-br from-slate-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments Dashboard</h1>
                    <p className="text-gray-600">Track all payment transactions</p>
                </div>



                {/* Payment Transactions Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Payment Transactions</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        freelancerId
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ClientId
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Net Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Platform Fee
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono text-gray-900">
                                                ...{payment._id.slice(-8)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono text-gray-900">
                                                ...{payment.freelancerId.slice(-8)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono text-gray-900">
                                                ...{payment.clientId.slice(-8)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {payment.amount * 80}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-green-600">
                                                {payment.netAmount * 80}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-red-600">
                                                {payment.platformFee * 80}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(payment.status)}`}>
                                                {getStatusIcon(payment.status)}
                                                <span className="ml-1 capitalize">{payment.status}</span>
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(payment.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {payments.length === 0 && (
                    <div className="text-center py-12">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No payment transactions found</p>
                    </div>
                )}

                <div className="flex justify-center mt-3">
                    <Pagination
                        currentPage={currentPage || 1}
                        totalPages={2}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default PaymentLising
