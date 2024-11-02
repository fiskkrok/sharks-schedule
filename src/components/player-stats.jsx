import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PlayerStats = ({ game, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('game');
  const [stats, setStats] = useState(null);
  const [seasonStats, setSeasonStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch game stats if game is ongoing
        if (game?.hasStarted) {
          const gameResponse = await fetch(
            `/api/v1/players/8478408/stats?gameId=${game.id}`
          );
          if (!gameResponse.ok)
            throw new Error(`HTTP error! status: ${gameResponse.status}`);
          const gameData = await gameResponse.json();
          setStats(gameData);
        }

        // Fetch season stats
        const seasonResponse = await fetch(
          '/api/v1/players/8478408/stats/season'
        );
        if (!seasonResponse.ok)
          throw new Error(`HTTP error! status: ${seasonResponse.status}`);
        const seasonData = await seasonResponse.json();
        setSeasonStats(seasonData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load stats. Please try again later.');
        setLoading(false);
      }
    };

    if (isOpen) fetchStats();
  }, [game?.id, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="relative p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">
            Timothy Liljegren's Stats
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('game')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'game'
                  ? 'border-b-2 border-teal-500 text-teal-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Game Stats
            </button>
            <button
              onClick={() => setActiveTab('season')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'season'
                  ? 'border-b-2 border-teal-500 text-teal-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Season Stats
            </button>
          </nav>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center">Loading stats...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div>
              {activeTab === 'game' ? (
                !game?.hasStarted ? (
                  <div>The game has not yet started.</div>
                ) : (
                  <ul className="space-y-2">
                    <li>Goals: {stats?.goals}</li>
                    <li>Assists: {stats?.assists}</li>
                    <li>Points: {stats?.points}</li>
                    <li>Plus/Minus: {stats?.plusMinus}</li>
                    <li>Shots: {stats?.shots}</li>
                    <li>Hits: {stats?.hits}</li>
                    <li>Blocked Shots: {stats?.blockedShots}</li>
                  </ul>
                )
              ) : (
                <ul className="space-y-2">
                  <li>Games Played: {seasonStats?.gamesPlayed}</li>
                  <li>Goals: {seasonStats?.goals}</li>
                  <li>Assists: {seasonStats?.assists}</li>
                  <li>Points: {seasonStats?.points}</li>
                  <li>Plus/Minus: {seasonStats?.plusMinus}</li>
                  <li>Average TOI: {seasonStats?.avgTimeOnIce}</li>
                  <li>Shots: {seasonStats?.shots}</li>
                  <li>Shooting %: {seasonStats?.shootingPercentage}</li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
