import React from 'react';
import type{ TabButtonProps } from './types';

const TabButton: React.FC<TabButtonProps> = ({ id, label, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-[#2ECC71] text-white shadow-lg' 
          : 'bg-gray-100 text-gray-600 hover:bg-[#EFFFF6]'
      }`}
    >
      {label}
    </button>
  );
};

export default TabButton;