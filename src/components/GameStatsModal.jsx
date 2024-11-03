import React, { useState } from 'react';
import { X } from 'lucide-react';
import PlayerStats from './player-stats';

const GameStatsModal = ({ game, isOpen, onClose }) => {
  const [showPlayerStats, setShowPlayerStats] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full absolute right-1 "
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <img
              src={`https://cdn.nhle.com/logos/nhl/svg/${game.homeTeam.abbrev}_light.svg`}
              alt={game.awayTeam.teamName}
              className="w-12 h-8 ml-4"
              loading="lazy"
            />
            <h2 className="text-xl font-semibold dark:text-white">
              {game.homeTeam.abbrev} vs {game.awayTeam.abbrev}
            </h2>
            <img
              src={`https://cdn.nhle.com/logos/nhl/svg/${game.awayTeam.abbrev}_light.svg`}
              alt={game.awayTeam.teamName}
              className="w-12 h-8 mr-4"
              loading="lazy"
            />
          </div>

          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold dark:text-white">
                  {game.homeTeam.score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {game.homeTeam.abbrev}
                </div>
              </div>
              <div className="text-center flex items-center justify-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Final
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold dark:text-white">
                  {game.awayTeam.score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {game.awayTeam.abbrev}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setShowPlayerStats(true)}
                className="flex items-center px-1 py-1 rounded-lg bg-teal-500 hover:bg-teal-600 transition-colors text-white"
              >
                <span className="text-sm font-bold">#37 </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <PlayerStats
        game={game}
        isOpen={showPlayerStats}
        onClose={() => setShowPlayerStats(false)}
        activeTab="game"
      />
    </>
  );
};

export default GameStatsModal;
