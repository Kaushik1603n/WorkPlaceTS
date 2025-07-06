import { useEffect, useState } from 'react';
import { Clock, IndianRupee, Eye, CreditCard, User, } from 'lucide-react';
import { loadRazorpay } from '../../../utils/razorpay';
import axiosClient from '../../../utils/axiosClient';
import { toast } from 'react-toastify';
import PaymentDetailsModal from './PaymentDetailsModal';
import Pagination from '../../../components/Pagination';

type PaymentStatus = 'pending' | 'completed' | 'failed';

interface IPaymentRequest {
  _id: string,
  jobId: string;
  proposalId: string;
  milestoneId: string;
  amount: number;
  netAmount: number;
  platformFee: number;
  status: PaymentStatus;
  freelancerId: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

const PaymentsTable = () => {
  const [payments, setPayments] = useState<IPaymentRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<IPaymentRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const fetchPendingPayments = async (currentPage:number) => {
    setLoading(true)
    try {
      const res = await axiosClient.get("/proposal/pending-paments", {
        params: { page: currentPage, limit: 5 }
      });
      setPayments(res.data.data)
      setTotalPage(res.data.totalPages)
      setTotalCount(res.data.totalCount)
      setTotalAmount(res.data.totalAmount)
      setNetAmount(res.data.netAmount)
      setPlatformFee(res.data.platformFee)
      setPendingAmount(res.data.pendingAmount)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchPendingPayments(currentPage)
  }, [currentPage])


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const getStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        icon: Clock
      },
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        icon: IndianRupee
      },
      failed: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        icon: Clock
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };


  const handleProcessPayment = async (paymentRequestId: string, milestoneId: string, amount: number) => {
    try {
      const { data } = await axiosClient.post("/payments/order", {
        paymentRequestId,
        milestoneId,
        amount,
        receipt: `receipt_${Date.now()}`
      });

      if (!data?.data?.id || !data?.data?.amount) {
        throw new Error("Invalid order response from server");
      }

      loadRazorpay(data.data.id, data.data.amount, "rzp_test_SnR7HoShJIhilD",
        () => {
          fetchPendingPayments(currentPage);
          toast.success("Payment completed successfully!");
        }
      )

    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const handleViewDetails = (paymentId: string) => {
    const payment = payments.find(p => p._id === paymentId);
    if (payment) {
      setSelectedPayment(payment);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading payment details...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Management</h1>
        <p className="text-gray-600">Manage and track all payment transactions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-xl font-semibold text-gray-800">{totalCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-semibold text-gray-800">
                {pendingAmount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-semibold text-gray-800">
                {totalAmount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Net Amount</p>
              <p className="text-xl font-semibold text-gray-800">
                {netAmount}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <IndianRupee className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Platform Fees</p>
              <p className="text-xl font-semibold text-gray-800">
                {platformFee}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"

                >
                  <div className="flex items-center">
                    Payment ID
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Amount
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Amount
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Status
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parties
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    Created
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment._id ? payment._id.slice(-8) : ""}
                    </div>
                    <div className="text-sm text-gray-500">
                      Job: {payment.jobId ? payment.jobId.slice(-6) : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {payment.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600">
                      -{payment.platformFee ? payment.platformFee : 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {payment.netAmount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status ? payment.status : "pending")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>F: {payment.freelancerId ? payment.freelancerId.slice(-6) : ""}</div>
                    <div>C: {payment.clientId ? payment.clientId.slice(-6) : ""}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.createdAt ? payment.createdAt : "")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => handleProcessPayment(payment._id, payment.milestoneId, payment.amount)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <CreditCard className="w-3 h-3 mr-1" />
                          Process
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(payment._id)}
                        className="bg-gray-600 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-700 transition-colors flex items-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isModalOpen && selectedPayment && (
          <div className="fixed inset-0  backdrop-blur-lg rounded-2xl bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              <PaymentDetailsModal paymentData={selectedPayment} onClose={closeModal} />
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>

    </div>
  );
};

export default PaymentsTable;