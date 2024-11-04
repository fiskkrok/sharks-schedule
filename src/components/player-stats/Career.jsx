import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Trophy, Star, ArrowRight, Calendar } from 'lucide-react';

const MilestoneCard = ({ date, title, description, icon: Icon }) => (
  <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
        <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
      </div>
    </div>
    <div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(date).toLocaleDateString()}
      </div>
      <h4 className="font-medium text-gray-900 dark:text-white mt-1">
        {title}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
        {description}
      </p>
    </div>
  </div>
);

const SeasonProgressChart = ({ seasonData }) => {
  // Transform season data for visualization
  const chartData = seasonData.map((season) => ({
    season: `${season.season.toString().slice(0, 4)}-${season.season.toString().slice(4)}`,
    points: season.points || 0,
    games: season.gamesPlayed || 0,
    pointsPerGame: season.gamesPlayed
      ? (season.points / season.gamesPlayed).toFixed(2)
      : 0,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="season" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
            }}
          />
          <Area
            type="monotone"
            dataKey="points"
            stroke="#0d9488"
            fillOpacity={1}
            fill="url(#colorPoints)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const AchievementsList = ({ achievements }) => (
  <div className="space-y-4">
    {achievements.map((achievement, index) => (
      <div
        key={index}
        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
      >
        <div className="flex-shrink-0">
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <div className="font-medium dark:text-white">{achievement.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {achievement.date}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const StatProgressBar = ({ label, value, max, percentage }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <span className="font-medium text-gray-900 dark:text-white">
        {value} / {max}
      </span>
    </div>
    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-teal-500 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const Career = ({ playerData }) => {
  const [selectedView, setSelectedView] = useState('progression');

  // Filter NHL seasons
  const nhlSeasons = playerData.seasonTotals
    .filter((season) => season.leagueAbbrev === 'NHL')
    .sort((a, b) => b.season - a.season);

  // Create milestones array
  const milestones = [
    {
      date: playerData.draftDetails.year,
      title: 'NHL Draft',
      description: `Selected ${playerData.draftDetails.pickInRound}th overall by ${playerData.draftDetails.teamAbbrev}`,
      icon: Star,
    },
    // Could add first NHL game, first point, etc.
  ];

  // Calculate career achievements
  const achievements = [
    {
      title: '200 NHL Games Milestone',
      date: 'December 2023',
      icon: Trophy,
    },
    {
      title: 'Career High in Points',
      date: '2023-24 Season',
      icon: Star,
    },
  ];

  // Calculate career stats progress
  const careerStats = [
    {
      label: 'Games Played',
      value: playerData.careerTotals.regularSeason.gamesPlayed,
      max: 500,
      percentage:
        (playerData.careerTotals.regularSeason.gamesPlayed / 500) * 100,
    },
    {
      label: 'Career Points',
      value: playerData.careerTotals.regularSeason.points,
      max: 100,
      percentage: (playerData.careerTotals.regularSeason.points / 100) * 100,
    },
  ];

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        {['progression', 'milestones', 'achievements'].map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view)}
            className={`px-4 py-2 text-sm font-medium rounded-lg
              ${
                selectedView === view
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Career Progression View */}
      {selectedView === 'progression' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Season by Season Performance
            </h3>
            <SeasonProgressChart seasonData={nhlSeasons} />
          </div>

          <div className="grid gap-4">
            <h3 className="text-lg font-semibold dark:text-white">
              Career Progress
            </h3>
            {careerStats.map((stat, index) => (
              <StatProgressBar key={index} {...stat} />
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Career Average Stats
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {playerData.careerTotals.regularSeason.avgToi}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Avg. TOI
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(
                    playerData.careerTotals.regularSeason.points /
                    playerData.careerTotals.regularSeason.gamesPlayed
                  ).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Points/Game
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {playerData.careerTotals.regularSeason.plusMinus}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  +/-
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Milestones View */}
      {selectedView === 'milestones' && (
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <MilestoneCard key={index} {...milestone} />
          ))}
        </div>
      )}

      {/* Achievements View */}
      {selectedView === 'achievements' && (
        <div>
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            Career Achievements
          </h3>
          <AchievementsList achievements={achievements} />
        </div>
      )}
    </div>
  );
};

export default Career;
