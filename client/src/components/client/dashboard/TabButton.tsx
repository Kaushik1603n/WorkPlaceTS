import React from 'react';

interface TabButtonProps {
  id: string;
  label: string;
  active: boolean;
  onClick: (id: string) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-6 py-3 rounded-lg font-medium transition-all ${
      active
        ? 'bg-[#2bd773] text-white shadow-lg'
        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
    }`}
  >
    {label}
  </button>
);

export default TabButton;