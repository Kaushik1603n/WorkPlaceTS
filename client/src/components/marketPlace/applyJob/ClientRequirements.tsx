// components/ClientRequirements.tsx
import React from "react";

interface ClientRequirementsProps {
  agreeVideoCall: boolean;
  onAgreeVideoCallChange: () => void;
  agreeNDA: boolean;
  onAgreeNDAChange: () => void;
}

const ClientRequirements: React.FC<ClientRequirementsProps> = ({
  agreeVideoCall,
  onAgreeVideoCallChange,
  agreeNDA,
  onAgreeNDAChange,
}) => {
  return (
    <div className="mb-8">
      <h3 className="font-medium mb-3">Client Requirements</h3>
      <label className="flex items-center mb-2">
        <input
          type="checkbox"
          className="h-4 w-4 text-green-500"
          checked={agreeVideoCall}
          onChange={onAgreeVideoCallChange}
        />
        <span className="ml-2 text-sm text-gray-600">
          I agree to a video call interview if selected
        </span>
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          className="h-4 w-4 text-green-500"
          checked={agreeNDA}
          onChange={onAgreeNDAChange}
        />
        <span className="ml-2 text-sm text-gray-600">
          I agree to the Non-Disclosure Agreement terms
        </span>
      </label>
    </div>
  );
};

export default ClientRequirements;