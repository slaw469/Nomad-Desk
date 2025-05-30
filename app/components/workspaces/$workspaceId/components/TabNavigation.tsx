// app/routes/workspaces/$workspaceId/components/TabNavigation.tsx

import styles from '../../workspace.module.css';

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
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onChange(tab.id)}
          id={tab.id === 'reviews' ? 'reviews' : undefined}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}