import { Clock, DollarSign, User, FileText, Calendar, CreditCard } from 'lucide-react';

const PendingPaymentListing = () => {
  // Sample data based on the provided structure
  const paymentData = {
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
    updatedAt: '2025-06-16T15:33:56.804Z'
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status:string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Details</h1>
        <p className="text-gray-600">Comprehensive view of payment information</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-white" />
              <h2 className="text-xl font-semibold text-white">Payment ID: {paymentData._id.slice(-8)}</h2>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(paymentData.status)}`}>
              <Clock className="w-4 h-4 inline mr-1" />
              {paymentData.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Payment Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Amount</p>
                  <p className="text-2xl font-bold text-green-800">${paymentData.amount}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Platform Fee</p>
                  <p className="text-2xl font-bold text-red-800">${paymentData.platformFee}</p>
                </div>
                <div className="text-red-600 font-semibold">-</div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Net Amount</p>
                  <p className="text-2xl font-bold text-blue-800">${paymentData.netAmount}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Reference Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Job ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {paymentData.jobId.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Proposal ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {paymentData.proposalId.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Milestone ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {paymentData.milestoneId.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Parties Involved
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Freelancer ID:</span>
                    <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded">
                      {paymentData.freelancerId.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Client ID:</span>
                    <span className="font-mono text-sm bg-purple-100 px-2 py-1 rounded">
                      {paymentData.clientId.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-sm text-gray-800">
                      {formatDate(paymentData.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-sm text-gray-800">
                      {formatDate(paymentData.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Breakdown</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Amount:</span>
                      <span className="font-semibold">${paymentData.amount}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Platform Fee ({((paymentData.platformFee / paymentData.amount) * 100).toFixed(0)}%):</span>
                      <span>-${paymentData.platformFee}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Net Amount:</span>
                        <span className="text-green-600">${paymentData.netAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Payment record version:
            </p>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Process Payment
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingPaymentListing;