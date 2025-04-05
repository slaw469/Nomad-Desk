// app/routes/workspaces/$workspaceId/components/TabNavigation.tsx
import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onChange }: TabNavigationProps) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
          id={tab.id === 'reviews' ? 'reviews' : undefined}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}