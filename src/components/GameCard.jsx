import { React, useRef, useState, useEffect } from 'react';
import {
  formatGameTime,
  formatGameDate,
  isGameInFuture,
} from '../utils/dateUtils';
import {
  calculateAdvancedWinProbability,
  getWinProbabilityDetails,
} from '../utils/probabilityUtils';
import ProbabilityBar from '../utils/probabilityBar';

const GameCard = ({ game, userTimeZone, onCardClick, allGames = [] }) => {
  if (!game?.startTimeUTC) {
    return null; // Don't render invalid games
  }

  const isFuture = isGameInFuture(game.startTimeUTC);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showProbabilityDetails, setShowProbabilityDetails] = useState(false);
  const [probabilityDetails, setProbabilityDetails] = useState(null);
  const [winProbability, setWinProbability] = useState(null);

  const isSharksHome = game?.homeTeam?.abbrev === 'SJS';
  const gameTime = formatGameTime(game.startTimeUTC, userTimeZone);
  const gameDate = formatGameDate(game.startTimeUTC, userTimeZone);

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

  useEffect(() => {
    if (game && allGames?.length > 0) {
      const details = getWinProbabilityDetails(game, allGames, isSharksHome);
      setProbabilityDetails(details);

      const probability = calculateAdvancedWinProbability(
        game,
        allGames,
        isSharksHome
      );
      setWinProbability(probability);
    }
  }, [game, allGames, isSharksHome]);

  if (!game?.homeTeam || !game?.awayTeam) {
    return null;
  }

  return (
    <div
      ref={cardRef}
      onClick={() => !isFuture && onCardClick?.(game)}
      className={`
        mx-4 p-6 rounded-lg 
        bg-white dark:bg-gray-800 
        shadow-md relative overflow-hidden 
        transition-all duration-700 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        ${!isFuture ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
        transform hover:scale-[1.02] hover:shadow-lg
        ${showProbabilityDetails ? 'shadow-xl' : ''}
      `}
    >
      {/* Background Logos with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none ">
        {/* Home team logo */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-1000 opacity-[0.03] transform 
            ${isVisible ? '-translate-x-1/4 scale-150' : '-translate-x-1/2 scale-100'}`}
          style={{
            width: '60%',
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
            width: '60%',
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
      <div className="flex justify-between items-center relative z-10">
        {/* Home team */}
        <div className="flex items-center gap-3">
          <img
            src={`https://cdn.nhle.com/logos/nhl/svg/${game.homeTeam.abbrev}_light.svg`}
            alt={game.homeTeam.teamName}
            className="w-12 h-10"
            loading="lazy"
          />
          <div className="flex flex-col">
            <span
              className={`font-medium ${
                game.homeTeam.abbrev === 'SJS'
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-black dark:text-white'
              }`}
            >
              {game.homeTeam.abbrev}
            </span>
            {!isFuture && typeof game.homeTeam.score === 'number' && (
              <span
                className={`font-bold text-lg ${
                  game.homeTeam.abbrev === 'SJS'
                    ? 'text-teal-600 dark:text-teal-400'
                    : 'text-black dark:text-white'
                }`}
              >
                {game.homeTeam.score}
              </span>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {gameDate}
          </div>
          <div className="font-bold text-lg text-gray-900 dark:text-white">
            {gameTime}
          </div>
        </div>

        {/* Away team */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span
              className={`font-medium ${
                game.awayTeam.abbrev === 'SJS'
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-black dark:text-white'
              }`}
            >
              {game.awayTeam.abbrev}
            </span>
            {!isFuture && typeof game.awayTeam.score === 'number' && (
              <span
                className={`font-bold text-lg ${
                  game.awayTeam.abbrev === 'SJS'
                    ? 'text-teal-600 dark:text-teal-400'
                    : 'text-black dark:text-white'
                }`}
              >
                {game.awayTeam.score}
              </span>
            )}
          </div>
          <img
            src={`https://cdn.nhle.com/logos/nhl/svg/${game.awayTeam.abbrev}_light.svg`}
            alt={game.awayTeam.teamName}
            className="w-12 h-10"
            loading="lazy"
          />
        </div>
      </div>

      {/* Win Probability Section */}
      {isFuture && probabilityDetails && winProbability && (
        <div
          className={`mt-6 transition-all duration-300 ease-in-out ${showProbabilityDetails ? 'mb-6' : ''}`}
        >
          <button
            className="w-full relative"
            onClick={(e) => {
              e.stopPropagation();
              setShowProbabilityDetails(!showProbabilityDetails);
            }}
          >
            <ProbabilityBar
              probability={winProbability.probability}
              trend={winProbability.trend}
              showDetails={true}
              className="mb-2"
            />
          </button>

          {/* Expanded Probability Details */}
          <div
            className={`
              grid grid-rows-[0fr] transition-all duration-300 ease-in-out
              ${showProbabilityDetails ? 'grid-rows-[1fr] mt-4' : ''}
            `}
          >
            <div className="overflow-hidden">
              <div className="min-h-0">
                {Object.entries(probabilityDetails).map(([key, detail]) => (
                  <div key={key} className="mb-3 px-2">
                    <ProbabilityBar
                      probability={detail.probability}
                      trend={detail.trend}
                      label={detail.label}
                      showDetails={true}
                      className="mb-2"
                    />
                  </div>
                ))}

                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 px-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Final Probability
                    </span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      {Math.round(winProbability.probability * 100)}%
                    </span>
                  </div>
                  {Math.abs(winProbability.trend) >= 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Trend: {winProbability.trend > 0 ? '+' : ''}
                      {Math.round(winProbability.trend)}% over last 5 games
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCard;
