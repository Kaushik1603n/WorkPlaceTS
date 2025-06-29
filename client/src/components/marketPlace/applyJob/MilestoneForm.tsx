import React from "react";

interface Milestone {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  amount: string;
}

// interface MilestoneErrors {
//   title?: string;
//   description?: string;
//   dueDate?: string;
//   amount?: string;
// }

interface MilestoneFormProps {
  newMilestone: Milestone;
//   milestoneErrors: MilestoneErrors;
  onMilestoneChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAddMilestone: () => void;
  milestones: Milestone[];
  onRemoveMilestone: (id: number) => void;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({
  newMilestone,
//   milestoneErrors,
  onMilestoneChange,
  onAddMilestone,
  milestones,
  onRemoveMilestone,
}) => {
  return (
    <div className="mb-6">
      <label className="block mb-2 font-medium">Milestones</label>
      <div className="border border-color rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={newMilestone.title}
              onChange={onMilestoneChange}
              className="w-full border border-color focus:outline-none  rounded-lg p-2"
              placeholder="Milestone title"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={newMilestone.dueDate}
              onChange={onMilestoneChange}
              className="w-full border border-color focus:outline-none  rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea
              name="description"
              value={newMilestone.description}
              onChange={onMilestoneChange}
              className="w-full border border-color focus:outline-none  rounded-lg p-2"
              placeholder="Brief description of this milestone"
              rows={2}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input
              type="text"
              name="amount"
              value={newMilestone.amount}
              onChange={onMilestoneChange}
              className="w-full border border-color focus:outline-none  rounded-lg p-2"
              placeholder="₹"
            />
          </div>
        </div>
        <button
          onClick={onAddMilestone}
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Add Milestone
        </button>
      </div>

      {milestones.length > 0 && (
        <div className="bg-color-light rounded-lg border border-color overflow-hidden">
          <h4 className="font-medium p-3 bg-color-secondary border-b border-color">
            Milestone Preview ({milestones.length})
          </h4>
          <div className="divide-y divide-gray-200">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-gray-800">{milestone.title}</span>
                    <span className="text-sm text-gray-500">{milestone.dueDate}</span>
                    <span className="font-medium text-green-600">${milestone.amount}</span>
                  </div>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </div>
                <button
                  onClick={() => milestone.id && onRemoveMilestone(milestone.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneForm;