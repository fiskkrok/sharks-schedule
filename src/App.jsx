import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import GameCard from './components/GameCard';
import GameStatsModal from './components/GameStatsModal';
import { isGameInFuture } from './utils/dateUtils';

const GAMES_PER_PAGE = 10;

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [userTimeZone, setUserTimeZone] = useState('UTC');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleUpcomingGames, setVisibleUpcomingGames] =
    useState(GAMES_PER_PAGE);
  const [visiblePastGames, setVisiblePastGames] = useState(GAMES_PER_PAGE);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    setUserTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const currentDate = new Date();
      const year =
        currentDate.getMonth() < 7
          ? currentDate.getFullYear() - 1
          : currentDate.getFullYear();
      const season = `${year}${year + 1}`;

      const response = await fetch(
        `/api/v1/club-schedule-season/SJS/${season}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGames(data.games || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setError('Failed to load schedule. Please try again later.');
      setLoading(false);
    }
  };

  const handleGameCardClick = (game) => {
    setSelectedGame(game);
    setShowPlayerStats(true);
  };

  const loadMoreUpcomingGames = () => {
    setVisibleUpcomingGames((prev) => prev + GAMES_PER_PAGE);
  };

  const loadMorePastGames = () => {
    setVisiblePastGames((prev) => prev + GAMES_PER_PAGE);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-lg font-medium text-gray-900 dark:text-white">
          Loading schedule...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-lg font-medium text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  const upcomingGames = games.filter((game) =>
    isGameInFuture(game.startTimeUTC)
  );
  const pastGames = games.filter((game) => !isGameInFuture(game.startTimeUTC));

  return (
    <div
      className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Sharks Schedule
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Times shown in {userTimeZone}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPlayerStats(true)}
              className="flex items-center px-3 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 transition-colors text-white"
            >
              <span className="text-sm font-bold mr-1">#55</span>
              <span className="text-sm font-semibold">Lilly</span>
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 text-gray-200" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Upcoming Games section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Upcoming Games
          </h2>
          <div className="space-y-4">
            {upcomingGames.slice(0, visibleUpcomingGames).map((game) => (
              <GameCard
                key={game.id}
                game={game}
                userTimeZone={userTimeZone}
                onCardClick={handleGameCardClick}
              />
            ))}
          </div>
          {upcomingGames.length > visibleUpcomingGames && (
            <button
              onClick={loadMoreUpcomingGames}
              className="mt-4 w-full px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 transition-colors text-white font-medium"
            >
              Show More Upcoming Games
            </button>
          )}
        </div>

        {/* Past Games section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Past Games
          </h2>
          <div className="space-y-4">
            {pastGames.slice(0, visiblePastGames).map((game) => (
              <GameCard
                key={game.id}
                game={game}
                userTimeZone={userTimeZone}
                onCardClick={handleGameCardClick}
              />
            ))}
          </div>
          {pastGames.length > visiblePastGames && (
            <button
              onClick={loadMorePastGames}
              className="mt-4 w-full px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 transition-colors text-white font-medium"
            >
              Show More Past Games
            </button>
          )}
        </div>

        {/* Game Stats Modal */}
        {showPlayerStats && selectedGame && (
          <GameStatsModal
            game={selectedGame}
            isOpen={showPlayerStats}
            onClose={() => setShowPlayerStats(false)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
