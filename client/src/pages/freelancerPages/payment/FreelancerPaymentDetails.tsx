import { Clock, IndianRupee, User, FileText, Calendar, CreditCard } from 'lucide-react';

interface PendingPaymentListingProps {
  paymentData: {
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
    createdAt:  string;
    updatedAt:  string;
  };
  onClose?: () => void;
}

const FreelancerPaymentDetailsModal = ({ paymentData, onClose }: PendingPaymentListingProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

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
                  <p className="text-2xl font-bold text-green-800">{paymentData.amount}</p>
                </div>
                <IndianRupee className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Platform Fee</p>
                  <p className="text-2xl font-bold text-red-800">{paymentData.platformFee}</p>
                </div>
                <div className="text-red-600 font-semibold">-</div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Net Amount</p>
                  <p className="text-2xl font-bold text-blue-800">{paymentData.netAmount}</p>
                </div>
                <IndianRupee className="w-8 h-8 text-blue-600" />
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
                      <span className="font-semibold">{paymentData.amount}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Platform Fee ({((paymentData.platformFee / paymentData.amount) * 100).toFixed(0)}%):</span>
                      <span>-{paymentData.platformFee}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Net Amount:</span>
                        <span className="text-green-600">{paymentData.netAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Payment record version: 1.0
            </p>
            {/* <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Process Payment
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                View History
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerPaymentDetailsModal;