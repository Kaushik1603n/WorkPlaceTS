import React from "react";

interface BidTypeSelectorProps {
  bidType: "fixed" | "hourly";
  onBidTypeChange: (type: "fixed" | "hourly") => void;
}

const BidTypeSelector: React.FC<BidTypeSelectorProps> = ({ bidType, onBidTypeChange }) => {
  return (
    <div className="mb-6">
      <label className="block mb-2 font-medium">Bid Type</label>
      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="bidType"
            className="h-4 w-4 text-green-500"
            checked={bidType === "fixed"}
            onChange={() => onBidTypeChange("fixed")}
          />
          <span className="ml-2">Fixed Price</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="bidType"
            className="h-4 w-4 text-green-500"
            checked={bidType === "hourly"}
            onChange={() => onBidTypeChange("hourly")}
          />
          <span className="ml-2">Hourly Rate</span>
        </label>
      </div>
    </div>
  );
};

export default BidTypeSelector;