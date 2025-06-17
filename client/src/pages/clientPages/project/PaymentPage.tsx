import { useEffect, useState } from 'react';
import { Clock, DollarSign, Eye, CreditCard, User, } from 'lucide-react';
import { loadRazorpay } from '../../../utils/razorpay';
import axiosClient from '../../../utils/axiosClient';
import { toast } from 'react-toastify';

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

// interface OrderResponse {
//   id: string;
//   currency: string;
//   amount: number;
// }
const PendingPaymentsTable = () => {
  const [payments, setPayments] = useState<IPaymentRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const fetchPendingPayments = async () => {
    setLoading(true)
    try {
      const res = await axiosClient.get("/proposal/pending-paments")
      setPayments(res.data.data)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchPendingPayments()
  }, [])


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
        icon: DollarSign
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

  //  const handleProcessPayment = async (paymentRequestId:string,milestoneId: string, amount: number) => {

  //   const { data } = await axiosClient.post("/payments/order", {
  //     paymentRequestId,
  //     milestoneId,
  //     amount,
  //     receipt: `receipt_${Date.now()}`
  //   });

  //   loadRazorpay(data.data.id, data.data.amount, "rzp_test_SnR7HoShJIhilD");
  // };

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
        fetchPendingPayments();
        toast.success("Payment completed successfully!");
      }
      )

    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const handleViewDetails = (paymentId: string) => {
    alert(`Viewing details for payment: ${paymentId}`);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-xl font-semibold text-gray-800">{payments.length}</p>
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
                {payments.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-semibold text-gray-800">
                ${payments.reduce((sum, p) => sum + (p.amount || 0), 0)}
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
                ${payments.reduce((sum, p) => sum + (p.netAmount || 0), 0)}
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
                      ${payment.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600">
                      -${payment.platformFee ? payment.platformFee : 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      ${payment.netAmount}
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
      </div>

      {/* Pagination */}
      {/* <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{payments.length}</span> of{' '}
              <span className="font-medium">{payments.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PendingPaymentsTable;