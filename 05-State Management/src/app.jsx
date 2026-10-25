import { useState } from 'react';
import { ZustandShopDemo } from './exercise-1-zustand-persist/zustand-shop-demo.jsx';
import { ReduxTodosDemo } from './exercise-2-redux-toolkit/redux-todos-demo.jsx';

const TABS = [
  { id: 'zustand', label: 'Bài 1 · Zustand + persist', Component: ZustandShopDemo },
  { id: 'redux', label: 'Bài 2 · Redux Toolkit slice', Component: ReduxTodosDemo },
];

export function App() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const { Component } = TABS.find((tab) => tab.id === activeTab);

  return (
    <main className="container">
      <h1>05 — State Management</h1>
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
      <Component />
    </main>
  );
}
