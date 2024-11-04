// components/TabNavigation/TabButton.jsx
import React from 'react';

const TabButton = ({ active, onClick, children, badge = null }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors relative
      ${
        active
          ? 'bg-teal-500 text-white'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      }
    `}
  >
    <div className="flex items-center gap-2">
      {children}
      {badge && (
        <span className="px-1.5 py-0.5 text-xs font-semibold bg-yellow-500 text-white rounded-full">
          {badge}
        </span>
      )}
    </div>
  </button>
);

export default TabButton;
