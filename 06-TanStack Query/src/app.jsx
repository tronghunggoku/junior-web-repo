import { useState } from 'react';
import { UseQueryMigrationDemo } from './exercise-1-use-query-migration/use-query-migration-demo.jsx';
import { LargeListDemo } from './exercise-2-large-list-pagination/large-list-demo.jsx';
import { RequestLogPanel } from './shared/components/request-log-panel.jsx';

const TABS = [
  { id: 'migration', label: 'Bài 1 · useQuery migration', Component: UseQueryMigrationDemo },
  { id: 'large-list', label: 'Bài 2 · Phân trang / Infinite', Component: LargeListDemo },
];

export function App() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const { Component } = TABS.find((tab) => tab.id === activeTab);

  return (
    <main className="container">
      <h1>06 — TanStack Query</h1>
      <nav className="tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeTab}
            className={tab.id === activeTab ? '' : 'ghost'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="page-layout">
        <Component />
        <RequestLogPanel />
      </div>
    </main>
  );
}
