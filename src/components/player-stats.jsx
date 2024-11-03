import React, { useState, useEffect } from 'react';
import { X, ChevronRight, TrendingUp, Timer, Shield } from 'lucide-react';

const TIMOTHY_ID = '8480043';

const StatCard = ({ label, value, icon: Icon, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      {Icon && <Icon className="w-4 h-4 text-teal-500" />}
    </div>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </span>
      {trend && (
        <span
          className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}
        >
          {trend > 0 ? '+' : ''}
          {trend}%
        </span>
      )}
    </div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg
      ${
        active
          ? 'bg-teal-500 text-white'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      }`}
  >
    {children}
  </button>
);

const PlayerStats = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/player/${TIMOTHY_ID}/landing`);
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

  const { subSeason, career } = playerData?.featuredStats.regularSeason || {};
  const { regularSeason, playoffs } = playerData?.careerTotals || {};
  const currentSeasonStats = subSeason;
  const currentRegularSeasonStats = regularSeason;
  const playoffsStats = playoffs;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <img
              src={playerData?.headshot || ''}
              alt="Timothy Liljegren"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold dark:text-white">
                {playerData?.firstName?.default} {playerData?.lastName?.default}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span>#{playerData?.sweaterNumber}</span>
                <span>•</span>
                <span>{playerData?.position}</span>
                <span>•</span>
                <span>{playerData?.teamCommonName?.default}</span>
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
          <div className="flex gap-2">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </TabButton>
            <TabButton
              active={activeTab === 'career'}
              onClick={() => setActiveTab('career')}
            >
              Career Stats
            </TabButton>
            <TabButton
              active={activeTab === 'advanced'}
              onClick={() => setActiveTab('advanced')}
            >
              Advanced
            </TabButton>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Background on timothy */}

          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                  label="Games Played"
                  value={currentSeasonStats?.gamesPlayed || 0}
                  icon={Timer}
                />
                <StatCard
                  label="Points"
                  value={currentSeasonStats?.points || 0}
                  icon={TrendingUp}
                  trend={5}
                />
                <StatCard
                  label="Goals"
                  value={currentSeasonStats?.goals || 0}
                  trend={2}
                />
                <StatCard
                  label="Assists"
                  value={currentSeasonStats?.assists || 0}
                  trend={8}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">
                    Additional Stats
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Plus/Minus
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentSeasonStats?.plusMinus > 0 ? '+' : ''}
                        {currentSeasonStats?.plusMinus || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Shots
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentSeasonStats?.shots || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Shooting %
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentSeasonStats?.shootingPct || 0}%
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">
                    Time on Ice
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Average TOI
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentRegularSeasonStats?.avgToi || '0:00'}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Playoffs TOI
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {playoffsStats?.avgToi || '0:00'}
                      </div>
                    </div>
                    {/* <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        PP TOI/Game
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentSeasonStats?.powerPlayTimeOnIcePerGame ||
                          '0:00'}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        SH TOI/Game
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentSeasonStats?.shortHandedTimeOnIcePerGame ||
                          '0:00'}
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'career' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Career Totals
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="Games Played"
                  value={career?.gamesPlayed || 0}
                  icon={Timer}
                />
                <StatCard label="Goals" value={career?.goals || 0} />
                <StatCard label="Assists" value={career?.assists || 0} />
                <StatCard
                  label="Points"
                  value={career?.points || 0}
                  icon={TrendingUp}
                />
              </div>

              {/* Additional career stats */}
              <div className="mt-8">
                <h4 className="text-md font-semibold mb-4 dark:text-white">
                  Career Highlights
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        First NHL Game
                      </div>
                      <div className="text-md font-medium dark:text-white">
                        {playerData?.firstNHLGameDate || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Draft Info
                      </div>
                      <div className="text-md font-medium dark:text-white">
                        Round {playerData?.draftDetails?.round},{' '}
                        {playerData?.draftDetails?.year}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Advanced Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Blocks
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentSeasonStats?.blockedShots || 0}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Hits
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentSeasonStats?.hits || 0}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Takeaways
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentSeasonStats?.takeaways || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
