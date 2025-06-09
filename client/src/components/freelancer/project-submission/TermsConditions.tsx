import React from 'react';

interface TermsConditionsProps {
  revisionPolicy: string;
  cancellationPolicy: string;
  intellectualProperty: string;
}

export const TermsConditions: React.FC<TermsConditionsProps> = ({
  revisionPolicy,
  cancellationPolicy,
  intellectualProperty
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h2>
    
    <div className="space-y-4 text-sm text-gray-600">
      <div>
        <h3 className="font-medium text-gray-700 mb-1">Revision Policy</h3>
        <p>{revisionPolicy}</p>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-700 mb-1">Cancellation Policy</h3>
        <p>{cancellationPolicy}</p>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-700 mb-1">Intellectual Property</h3>
        <p>{intellectualProperty}</p>
      </div>
    </div>
  </div>
);