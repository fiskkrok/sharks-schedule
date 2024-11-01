import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import PlayerStats from './components/PlayerStats';

// Utility functions remain the same
const formatGameTime = (dateStr, timeZone) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
    hour12: false,
  });
};

const formatGameDate = (dateStr, timeZone) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone,
  });
};

const isGameInFuture = (dateStr) => {
  return new Date(dateStr) > new Date();
};

const GameCard = ({ game, userTimeZone, onCardClick }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const isSharksHome = game.homeTeam.abbrev === 'SJS';
  const gameTime = formatGameTime(game.startTimeUTC, userTimeZone);
  const gameDate = formatGameDate(game.startTimeUTC, userTimeZone);

  const homeWinProbability = game.homeTeam.pointPct
    ? Math.round(game.homeTeam.pointPct * 100)
    : 50;
  const winProbability = isSharksHome
    ? homeWinProbability
    : 100 - homeWinProbability;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onCardClick(game)}
      className={`mb-4 mx-0 sm:mx-4 p-4 rounded-none sm:rounded-lg bg-white dark:bg-gray-800 shadow-md relative overflow-hidden transition-all duration-700 cursor-pointer hover:shadow-lg ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Background Logos with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Home team logo */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-1000 opacity-[0.03] transform 
            ${isVisible ? '-translate-x-1/4 scale-150' : '-translate-x-1/2 scale-100'}`}
          style={{
            width: '200%',
            aspectRatio: '1',
          }}
        >
          <img
            src={`https://cdn.nhle.com/logos/nhl/svg/${game.homeTeam.abbrev}_light.svg`}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        {/* Away team logo */}
        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-1000 opacity-[0.03] transform
            ${isVisible ? 'translate-x-1/4 scale-150' : 'translate-x-1/2 scale-100'}`}
          style={{
            width: '200%',
            aspectRatio: '1',
          }}
        >
          <img
            src={`https://cdn.nhle.com/logos/nhl/svg/${game.awayTeam.abbrev}_light.svg`}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src={`https://cdn.nhle.com/logos/nhl/svg/${game.homeTeam.abbrev}_light.svg`}
              alt={game.homeTeam.teamName}
              className="w-8 h-8"
              loading="lazy"
            />
            <span className="font-medium text-gray-900 dark:text-white">
              {game.homeTeam.teamName}
            </span>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {gameDate}
            </div>
            <div className="font-bold text-lg text-gray-900 dark:text-white">
              {gameTime}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-medium text-gray-900 dark:text-white">
              {game.awayTeam.teamName}
            </span>
            <img
              src={`https://cdn.nhle.com/logos/nhl/svg/${game.awayTeam.abbrev}_light.svg`}
              alt={game.awayTeam.teamName}
              className="w-8 h-8"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">
            Win Probability
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${winProbability}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [userTimeZone, setUserTimeZone] = useState('UTC');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    setUserTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

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

    fetchSchedule();
  }, []);

  const handleCardClick = (game) => {
    setSelectedGame(game);
    setShowPlayerStats(true);
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
      <div className="w-full px-0 sm:px-4 sm:max-w-2xl sm:mx-auto">
        <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sharks Schedule
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Times shown in {userTimeZone}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPlayerStats((prev) => !prev)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 transition-colors text-white"
            >
              <span className="hidden sm:inline">#55</span>
              <span>Timothy Liljegren</span>
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

        {showPlayerStats && (
          <PlayerStats game={selectedGame} />
        )}

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white px-4 sm:px-0">
            Upcoming Games
          </h2>
          {upcomingGames.map((game) => (
            <GameCard key={game.id} game={game} userTimeZone={userTimeZone} onCardClick={handleCardClick} />
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white px-4 sm:px-0">
            Past Games
          </h2>
          {pastGames.map((game) => (
            <GameCard key={game.id} game={game} userTimeZone={userTimeZone} onCardClick={handleCardClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
