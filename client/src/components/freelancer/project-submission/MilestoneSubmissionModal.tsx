import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

interface Milestone {
  _id: string;
  title: string;
  description?: string;
  amount: number;
  dueDate: string | Date;
  status: "submitted"
  | "interviewing"
  | "rejected"
  | "accepted"
  | "cancelled"
  | "active"
  | "completed"
  | "pending";
}


interface MilestoneSubmissionModalProps {
  milestone: Milestone;
  onSubmit: (milestoneId: string, deliverables: Deliverables) => void;
  onClose: () => void;
}

interface Deliverables {
  links: string[];
  comments: string;
}

export const MilestoneSubmissionModal: React.FC<MilestoneSubmissionModalProps> = ({
  milestone,
  onSubmit,
  onClose,
}) => {
  const [deliverables, setDeliverables] = useState<Deliverables>({
    links: [''],
    comments: '',
  });


  const handleLinkChange = (index: number, value: string) => {
    if(deliverables.links.includes(value)){
      toast.error("not duplicate links allowed")
      return "not duplicate links allowed"
    }
    const newLinks = [...deliverables.links];

    newLinks[index] = value;
    setDeliverables({ ...deliverables, links: newLinks });
  };

  const addLinkField = () => {
    setDeliverables({ ...deliverables, links: [...deliverables.links, ''] });
  };

  const handleSubmit = () => {
    onSubmit(milestone._id, deliverables);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Submit Milestone: {milestone.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Links (e.g., GitHub, Figma)</label>
            {deliverables.links.map((link, index) => (
              <input
                key={index}
                type="url"
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                placeholder="https://..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              />
            ))}
            <button
              onClick={addLinkField}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add another link
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Comments</label>
            <textarea
              value={deliverables.comments}
              onChange={(e) => setDeliverables({ ...deliverables, comments: e.target.value })}
              placeholder="Describe your deliverables or add notes for the client..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Submit Work
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};