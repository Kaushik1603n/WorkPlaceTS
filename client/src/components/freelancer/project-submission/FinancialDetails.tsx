import React from 'react';
// import { DollarSign } from 'lucide-react';

interface FinancialDetailsProps {
  agreedPrice: number;
  paymentStatus: string;
  platformFee: number;
  freelancerReceives: number;
}

export const FinancialDetails: React.FC<FinancialDetailsProps> = ({
  agreedPrice,
  paymentStatus,
  platformFee,
  freelancerReceives
}) => {
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'complete': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Agreed Price:</span>
          <span className="font-semibold text-gray-900">${agreedPrice.toFixed(2)} (Fixed Price)</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Payment Status:</span>
          <span className={`${getPaymentStatusColor(paymentStatus)} px-2 py-1 rounded-full text-xs font-medium capitalize`}>
            {paymentStatus}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Platform Fee:</span>
          <span className="text-gray-900">10% (${platformFee.toFixed(2)})</span>
        </div>
        
        <hr className="border-gray-200" />
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">You'll Receive:</span>
          <span className="text-lg font-bold text-gray-900">${freelancerReceives.toFixed(2)}</span>
        </div>
        
        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Request Milestone Payment
        </button>
        
        <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
          Download Invoice
        </button>
      </div>
    </div>
  );
};