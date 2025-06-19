import { useEffect, useState } from 'react';
import { Clock, DollarSign, CreditCard, User, TrendingUp, TrendingDown, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axiosClient from '../../../utils/axiosClient';

interface IWalletTransaction {
    type: "credit" | "debit";
    amount: number;
    description: string;
    paymentId?: string;
    _id?: string;
    createdAt: Date | string;
}

interface IWallet {
    _id: string;
    userId: string | "admin";
    balance: number;
    currency: string;
    transactions: IWalletTransaction[];
    createdAt: Date | string;
    updatedAt: Date | string;
}

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

function WalletTransactions() {
    const [wallet, setWallet] = useState<IWallet | null>(null);
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

   
    const fetchPaymentsDetails = async () => {
        setLoading(true)
        try {
            const res = await axiosClient.get("/payments/get-payment")
            setWallet(res.data.data)
            setPayments(res.data.payment)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchPaymentsDetails()
    }, [])


    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number, currency: string = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency === 'INR' ? 'INR' : 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Payment statistics
    // const getTotalPayments = () => payments.reduce((sum, p) => sum + p.amount, 0);
    const getTotalNetAmount = () => payments.reduce((sum, p) => sum + p.netAmount*80, 0);
    const getTotalPlatformFees = () => payments.reduce((sum, p) => sum + p.platformFee*80, 0);
    // const getCompletedPayments = () => payments.filter(p => p.status === 'completed').length;
    // const getPendingPayments = () => payments.filter(p => p.status === 'pending').length;
    // const getFailedPayments = () => payments.filter(p => p.status === 'failed').length;

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
                    <p className="text-gray-600 font-medium">Loading wallet details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet & Payments Dashboard</h1>
                    <p className="text-gray-600">Track your wallet balance and payment transactions</p>
                </div>

                {/* Wallet Summary */}
                {wallet && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Wallet Balance</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(wallet.balance, wallet.currency)}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Earnings</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(getTotalNetAmount())}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Platform Fees</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatCurrency(getTotalPlatformFees())}
                                    </p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <TrendingDown className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Payments</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {payments.length}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Status Overview */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold text-green-600">{getCompletedPayments()}</p>
                        <p className="text-sm text-gray-600 mt-1">Successful payments</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <p className="text-3xl font-bold text-yellow-600">{getPendingPayments()}</p>
                        <p className="text-sm text-gray-600 mt-1">Awaiting completion</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Failed</h3>
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <p className="text-3xl font-bold text-red-600">{getFailedPayments()}</p>
                        <p className="text-sm text-gray-600 mt-1">Failed transactions</p>
                    </div>
                </div> */}

                {/* Payment Transactions Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Payment Transactions</h2>
                        <p className="text-gray-600 text-sm mt-1">All your payment history and details</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment ID
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
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Method
                                    </th> */}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Gateway ID
                                    </th> */}
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
                                            <div className="text-sm font-semibold text-gray-900">
                                                {payment.amount*80}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-green-600">
                                                {payment.netAmount*80}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-red-600">
                                                {payment.platformFee*80}
                                            </div>
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                {payment.paymentMethod}
                                            </span>
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(payment.status)}`}>
                                                {getStatusIcon(payment.status)}
                                                <span className="ml-1 capitalize">{payment.status}</span>
                                            </span>
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono text-gray-600">
                                                {payment.paymentGatewayId}
                                            </div>
                                        </td> */}
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
            </div>
        </div>
    );
}

export default WalletTransactions;