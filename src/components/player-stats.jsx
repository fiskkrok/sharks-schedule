import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  TrendingUp,
  Timer,
  Shield,
  Award,
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, trend, size = 'normal' }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md ${size === 'large' ? 'col-span-2' : ''}`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      {Icon && <Icon className="w-4 h-4 text-teal-500" />}
    </div>
    <div className="flex items-end justify-between">
      <span
        className={`${size === 'large' ? 'text-3xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white`}
      >
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

const DraftInfo = ({ draftDetails }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
      Draft Details
    </h4>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Year</div>
        <div className="font-semibold dark:text-white">{draftDetails.year}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Round</div>
        <div className="font-semibold dark:text-white">
          {draftDetails.round} ({draftDetails.pickInRound})
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Overall Pick
        </div>
        <div className="font-semibold dark:text-white">
          {draftDetails.overallPick}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Team</div>
        <div className="font-semibold dark:text-white">
          {draftDetails.teamAbbrev}
        </div>
      </div>
    </div>
  </div>
);

const SeasonStats = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    <StatCard label="Games Played" value={stats.gamesPlayed} icon={Timer} />
    <StatCard label="Goals" value={stats.goals} />
    <StatCard label="Assists" value={stats.assists} />
    <StatCard label="Points" value={stats.points} icon={Award} />
    <StatCard label="Plus/Minus" value={stats.plusMinus} />
    <StatCard label="PIM" value={stats.pim} />
  </div>
);

const PowerplayStats = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    <StatCard label="PP Goals" value={stats.powerPlayGoals} />
    <StatCard label="PP Points" value={stats.powerPlayPoints} />
    <StatCard label="SH Goals" value={stats.shorthandedGoals} />
    <StatCard label="SH Points" value={stats.shorthandedPoints} />
    <StatCard label="GWG" value={stats.gameWinningGoals} />
    <StatCard label="Shots" value={stats.shots} />
  </div>
);

const PlayerBio = ({ playerData }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
    <div>
      <span className="text-gray-500 dark:text-gray-400">Height</span>
      <p className="font-medium dark:text-white">
        {(playerData.heightInCentimeters / 100).toFixed(2)}m
      </p>
    </div>
    <div>
      <span className="text-gray-500 dark:text-gray-400">Weight</span>
      <p className="font-medium dark:text-white">
        {playerData.weightInKilograms}kg
      </p>
    </div>
    <div>
      <span className="text-gray-500 dark:text-gray-400">Born</span>
      <p className="font-medium dark:text-white">
        {new Date(playerData.birthDate).toLocaleDateString()} (
        {playerData.birthCity.default})
      </p>
    </div>
    <div>
      <span className="text-gray-500 dark:text-gray-400">Position</span>
      <p className="font-medium dark:text-white">{playerData.position}</p>
    </div>
    <div>
      <span className="text-gray-500 dark:text-gray-400">Shoots</span>
      <p className="font-medium dark:text-white">{playerData.shootsCatches}</p>
    </div>
    <div>
      <span className="text-gray-500 dark:text-gray-400">Age</span>
      <p className="font-medium dark:text-white">
        {new Date().getFullYear() -
          new Date(playerData.birthDate).getFullYear()}
      </p>
    </div>
  </div>
);

const LastGames = ({ games }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 dark:text-gray-400">
          <th className="pb-2">Date</th>
          <th className="pb-2">VS</th>
          <th className="pb-2">TOI</th>
          <th className="pb-2">G</th>
          <th className="pb-2">A</th>
          <th className="pb-2">+/-</th>
        </tr>
      </thead>
      <tbody>
        {games.map((game, index) => (
          <tr
            key={index}
            className="border-t border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
          >
            <td className="py-2">
              {new Date(game.gameDate).toLocaleDateString()}
            </td>
            <td className="py-2">{game.opponentAbbrev}</td>
            <td className="py-2">{game.toi}</td>
            <td className="py-2">{game.goals}</td>
            <td className="py-2">{game.assists}</td>
            <td className="py-2">{game.plusMinus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CareerProgression = ({ seasonTotals }) => {
  // Filter only NHL seasons and sort by year
  const nhlSeasons = seasonTotals
    .filter((season) => season.leagueAbbrev === 'NHL')
    .sort((a, b) => b.season - a.season);

  return (
    <div className="space-y-4">
      {nhlSeasons.map((season, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold dark:text-white">
              {season.season.toString().slice(0, 4)}-
              {season.season.toString().slice(4)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {season.teamName?.default}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">GP</span>
              <p className="font-medium dark:text-white">
                {season.gamesPlayed}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">G</span>
              <p className="font-medium dark:text-white">{season.goals}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">A</span>
              <p className="font-medium dark:text-white">{season.assists}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">P</span>
              <p className="font-medium dark:text-white">{season.points}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const PlayerStats = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/player/8480043/landing`);
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

  const { seasonTotals, careerTotals, featuredStats } = playerData;
  const currentSeasonStats = featuredStats?.regularSeason?.subSeason;

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
            {['overview', 'career', 'bio', 'recent games'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors
                  ${
                    activeTab === tab
                      ? 'bg-teal-500 text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'overview' && (
            <>
              <section>
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                  Season Stats
                </h3>
                <SeasonStats stats={currentSeasonStats} />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                  Power Play & Special Teams
                </h3>
                <PowerplayStats stats={currentSeasonStats} />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                  Career Totals
                </h3>
                <SeasonStats stats={careerTotals.regularSeason} />
              </section>
            </>
          )}

          {activeTab === 'career' && (
            <>
              <section>
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                  NHL Career Progression
                </h3>
                <CareerProgression seasonTotals={seasonTotals} />
              </section>

              <section className="mt-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                  Draft Information
                </h3>
                <DraftInfo draftDetails={playerData.draftDetails} />
              </section>
            </>
          )}

          {activeTab === 'bio' && (
            <>
              <section>
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                  Personal Information
                </h3>
                <PlayerBio playerData={playerData} />
              </section>

              <section className="mt-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                  Career Milestones
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        NHL Debut
                      </div>
                      <div className="font-semibold dark:text-white">
                        {playerData.firstNHLGameDate
                          ? new Date(
                              playerData.firstNHLGameDate
                            ).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Total NHL Games
                      </div>
                      <div className="font-semibold dark:text-white">
                        {careerTotals.regularSeason.gamesPlayed}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'recent games' && (
            <section>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Last 5 Games
              </h3>
              <LastGames games={playerData.last5Games} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
