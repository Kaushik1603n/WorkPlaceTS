import  { useState } from 'react';
import { Clock, DollarSign, Eye, CreditCard, User, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const PendingPaymentsTable = () => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Sample data array (expanded from the single object)
  const paymentsData = [
    {
      _id: '68503964ba5d54f906a5b2ef',
      jobId: '684a708302f195cc7d0b6606',
      proposalId: '684a72a4bafd81e8d9345c8a',
      milestoneId: '684a72a4bafd81e8d9345c8c',
      amount: 50,
      platformFee: 5,
      netAmount: 45,
      status: 'pending',
      freelancerId: '68260956ec6ff5b5ef769b40',
      clientId: '682321f0ebe2e8dac2d7a54b',
      createdAt: '2025-06-16T15:33:56.804Z',
      updatedAt: '2025-06-16T15:33:56.804Z',
      __v: 0
    },
    {
      _id: '68503964ba5d54f906a5b2f0',
      jobId: '684a708302f195cc7d0b6607',
      proposalId: '684a72a4bafd81e8d9345c8b',
      milestoneId: '684a72a4bafd81e8d9345c8d',
      amount: 125,
      platformFee: 12.5,
      netAmount: 112.5,
      status: 'pending',
      freelancerId: '68260956ec6ff5b5ef769b41',
      clientId: '682321f0ebe2e8dac2d7a54c',
      createdAt: '2025-06-16T14:22:30.120Z',
      updatedAt: '2025-06-16T14:22:30.120Z',
      __v: 0
    },
    {
      _id: '68503964ba5d54f906a5b2f1',
      jobId: '684a708302f195cc7d0b6608',
      proposalId: '684a72a4bafd81e8d9345c8c',
      milestoneId: '684a72a4bafd81e8d9345c8e',
      amount: 200,
      platformFee: 20,
      netAmount: 180,
      status: 'completed',
      freelancerId: '68260956ec6ff5b5ef769b42',
      clientId: '682321f0ebe2e8dac2d7a54d',
      createdAt: '2025-06-16T13:15:45.890Z',
      updatedAt: '2025-06-16T16:20:12.456Z',
      __v: 0
    },
    {
      _id: '68503964ba5d54f906a5b2f2',
      jobId: '684a708302f195cc7d0b6609',
      proposalId: '684a72a4bafd81e8d9345c8d',
      milestoneId: '684a72a4bafd81e8d9345c8f',
      amount: 75,
      platformFee: 7.5,
      netAmount: 67.5,
      status: 'pending',
      freelancerId: '68260956ec6ff5b5ef769b43',
      clientId: '682321f0ebe2e8dac2d7a54e',
      createdAt: '2025-06-16T12:45:18.330Z',
      updatedAt: '2025-06-16T12:45:18.330Z',
      __v: 0
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status:string) => {
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPayments = [...paymentsData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleProcessPayment = (paymentId:string) => {
    alert(`Processing payment: ${paymentId}`);
    // Add your payment processing logic here
  };

  const handleViewDetails = (paymentId:string) => {
    alert(`Viewing details for payment: ${paymentId}`);
    // Add your navigation logic here
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

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
              <p className="text-xl font-semibold text-gray-800">{paymentsData.length}</p>
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
                {paymentsData.filter(p => p.status === 'pending').length}
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
                ${paymentsData.reduce((sum, p) => sum + p.amount, 0)}
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
                ${paymentsData.reduce((sum, p) => sum + p.netAmount, 0)}
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
                  onClick={() => handleSort('_id')}
                >
                  <div className="flex items-center">
                    Payment ID
                    <SortIcon field="_id" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    <SortIcon field="amount" />
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
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parties
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Created
                    <SortIcon field="createdAt" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment._id.slice(-8)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Job: {payment.jobId.slice(-6)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${payment.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600">
                      -${payment.platformFee}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      ${payment.netAmount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>F: {payment.freelancerId.slice(-6)}</div>
                    <div>C: {payment.clientId.slice(-6)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => handleProcessPayment(payment._id)}
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
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">{paymentsData.length}</span> of{' '}
              <span className="font-medium">{paymentsData.length}</span> results
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
      </div>
    </div>
  );
};

export default PendingPaymentsTable;