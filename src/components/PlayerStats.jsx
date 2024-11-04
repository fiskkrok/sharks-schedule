import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import QuickView from './player-stats/QuickView';
import DeepDive from './player-stats/DeepDive';
import Comparisons from './player-stats/Comparisons';
import NerdStats from './player-stats/NerdStats';
import Career from './player-stats/Career';

const TABS = {
  QUICK_VIEW: 'quick_view',
  DEEP_DIVE: 'deep_dive',
  COMPARISONS: 'comparisons',
  NERD_STATS: 'nerd_stats',
  CAREER: 'career',
};

const TabButton = ({ active, onClick, children, badge = null }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors
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

const PlayerStats = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(TABS.QUICK_VIEW);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/player/8480043/landing');
        if (!response.ok) throw new Error('Failed to fetch player data');
        const data = await response.json();
        setPlayerData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching player data:', err);
        setError('Failed to load player statistics');
        setLoading(false);
      }
    };

    if (isOpen) fetchPlayerData();
  }, [isOpen]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
            Loading stats...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case TABS.QUICK_VIEW:
        return <QuickView playerData={playerData} />;
      case TABS.DEEP_DIVE:
        return <DeepDive playerData={playerData} />;
      case TABS.COMPARISONS:
        return <Comparisons playerData={playerData} />;
      case TABS.NERD_STATS:
        return <NerdStats playerData={playerData} />;
      case TABS.CAREER:
        return <Career playerData={playerData} />;
      default:
        return <QuickView playerData={playerData} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <img
              src={playerData.headshot}
              alt={`${playerData.firstName.default} ${playerData.lastName.default}`}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold dark:text-white">
                {playerData.firstName.default} {playerData.lastName.default}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span>#{playerData.sweaterNumber}</span>
                <span>•</span>
                <span>{playerData.position}</span>
                <span>•</span>
                <span>{playerData.currentTeamAbbrev}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
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

        {/* Content */}
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default PlayerStats;
