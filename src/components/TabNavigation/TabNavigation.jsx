// components/TabNavigation/TabNavigation.jsx
import React from 'react';
import TabButton from './TabButton';
import { TABS } from './constants';

const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
    <div className="flex gap-2 overflow-x-auto">
      <TabButton
        active={activeTab === TABS.QUICK_VIEW}
        onClick={() => setActiveTab(TABS.QUICK_VIEW)}
      >
        Quick View
      </TabButton>
      <TabButton
        active={activeTab === TABS.DEEP_DIVE}
        onClick={() => setActiveTab(TABS.DEEP_DIVE)}
      >
        Deep Dive
      </TabButton>
      <TabButton
        active={activeTab === TABS.COMPARISONS}
        onClick={() => setActiveTab(TABS.COMPARISONS)}
      >
        Compare
      </TabButton>
      <TabButton
        active={activeTab === TABS.NERD_STATS}
        onClick={() => setActiveTab(TABS.NERD_STATS)}
        badge="New"
      >
        Nerd Stats
      </TabButton>
      <TabButton
        active={activeTab === TABS.CAREER}
        onClick={() => setActiveTab(TABS.CAREER)}
      >
        Career
      </TabButton>
    </div>
  </div>
);

export default TabNavigation;
