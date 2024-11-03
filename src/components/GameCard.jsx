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
import ProbabilityBar from '../utils/probabilityBarUtils';

const GameCard = ({ game, userTimeZone, onCardClick, allGames = [] }) => {
  if (!game?.startTimeUTC) {
    return null; // Don't render invalid games
  }

  const isFuture = isGameInFuture(game.startTimeUTC);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showProbabilityDetails, setShowProbabilityDetails] = useState(false);
  const [probabilityDetails, setProbabilityDetails] = useState(null);

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
    }
  }, [game, allGames, isSharksHome]);

  const winProbability = Math.round(
    calculateAdvancedWinProbability(game, allGames || [], isSharksHome) * 100
  );

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
      `}
    >
      {/* Background Logos with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
              <span className="font-bold text-lg">{game.homeTeam.score}</span>
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
              <span className="font-bold text-lg">{game.awayTeam.score}</span>
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
      {probabilityDetails && (
        <div className="mt-4 relative">
          <button
            className="w-full relative"
            onClick={(e) => {
              e.stopPropagation();
              setShowProbabilityDetails(!showProbabilityDetails);
            }}
          >
            <ProbabilityBar
              probability={winProbability / 100}
              trend={probabilityDetails.recentForm.trend}
              showDetails={true}
              className="mb-2"
            />
          </button>

          {/* Probability Details Tooltip */}
          {showProbabilityDetails && (
            <div
              className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              {Object.entries(probabilityDetails).map(([key, detail]) => (
                <div key={key} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {detail.label}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round(detail.probability * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-teal-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${detail.probability * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Final Probability
                  </span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {winProbability}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameCard;
