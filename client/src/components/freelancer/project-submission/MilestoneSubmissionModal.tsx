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
  | "pending"
  | "paid";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLinkChange = (index: number, value: string) => {
    const trimmedValue = value.trim();
    const newLinks = [...deliverables.links];

    // Check for duplicates (excluding empty strings and the current field)
    if (trimmedValue) {
      const isDuplicate = deliverables.links.some(
        (link, i) => i !== index && link.trim() === trimmedValue
      );

      if (isDuplicate) {
        toast.error("Duplicate links are not allowed");
        return;
      }
    }

    newLinks[index] = value;
    setDeliverables({ ...deliverables, links: newLinks });
  };

  const addLinkField = () => {
    // Don't add new field if last link is empty
    if (deliverables.links[deliverables.links.length - 1].trim() === '') {
      toast.error("Please fill the current link before adding another");
      return;
    }
    setDeliverables({ ...deliverables, links: [...deliverables.links, ''] });
  };

  const removeLinkField = (index: number) => {
    if (deliverables.links.length <= 1) {
      toast.error("At least one link is required");
      return;
    }
    const newLinks = deliverables.links.filter((_, i) => i !== index);
    setDeliverables({ ...deliverables, links: newLinks });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Filter out empty links
    const nonEmptyLinks = deliverables.links.filter(link => link.trim() !== '');
    
    // Validate at least one link
    if (nonEmptyLinks.length === 0) {
      toast.error("Please provide at least one valid link");
      setIsSubmitting(false);
      return;
    }
    
    // Validate comments
    if (!deliverables.comments.trim()) {
      toast.error("Please add a description of your deliverables");
      setIsSubmitting(false);
      return;
    }

    // Validate each URL format (basic check)
    const invalidLinks = nonEmptyLinks.filter(link => {
      try {
        new URL(link);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidLinks.length > 0) {
      toast.error(`Please enter valid URLs: ${invalidLinks.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    onSubmit(milestone._id, {
      links: nonEmptyLinks,
      comments: deliverables.comments.trim()
    });
    setIsSubmitting(false);
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
              <div key={index} className="flex items-center mt-1">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  placeholder="https://..."
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  required
                />
                {deliverables.links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLinkField(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLinkField}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add another link
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={deliverables.comments}
              onChange={(e) => setDeliverables({ ...deliverables, comments: e.target.value })}
              placeholder="Describe your deliverables or add notes for the client..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Work'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};