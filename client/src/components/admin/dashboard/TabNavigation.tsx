import React from 'react';
import TabButton from './TabButton';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'projects', label: 'Projects' },
    { id: 'finance', label: 'Finance' },
    { id: 'performance', label: 'Performance' }
  ];

  return (
    <div className="flex space-x-2 mb-6">
      {tabs.map(tab => (
        <TabButton
          key={tab.id}
          id={tab.id}
          label={tab.label}
          isActive={activeTab === tab.id}
          onClick={setActiveTab}
        />
      ))}
    </div>
  );
};

export default TabNavigation;