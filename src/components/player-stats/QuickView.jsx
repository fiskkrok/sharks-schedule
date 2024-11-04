import React from 'react';
import { Shield, Timer, TrendingUp, Award } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const QuickStat = ({ label, value, icon: Icon, trend, tooltip }) => (
  <div className="group relative">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </span>
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
    {tooltip && (
      <div
        className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full 
                    opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"
      >
        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 max-w-xs">
          {tooltip}
        </div>
      </div>
    )}
  </div>
);

const RecentPerformanceChart = ({ last5Games }) => {
  const data = last5Games.map((game) => ({
    date: new Date(game.gameDate).toLocaleDateString(),
    toi: parseInt(game.toi.split(':')[0]),
    points: (game.goals || 0) + (game.assists || 0),
    plusMinus: game.plusMinus,
  }));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="points" stroke="#0d9488" />
          <Line type="monotone" dataKey="plusMinus" stroke="#6366f1" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const LastGameSummary = ({ lastGame }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
      Last Game
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">VS</div>
        <div className="font-semibold dark:text-white">
          {lastGame.opponentAbbrev}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">TOI</div>
        <div className="font-semibold dark:text-white">{lastGame.toi}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Points</div>
        <div className="font-semibold dark:text-white">
          {(lastGame.goals || 0) + (lastGame.assists || 0)}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">+/-</div>
        <div className="font-semibold dark:text-white">
          {lastGame.plusMinus}
        </div>
      </div>
    </div>
  </div>
);

const QuickView = ({ playerData }) => {
  const currentSeasonStats = playerData.featuredStats?.regularSeason?.subSeason;
  const careerStats = playerData.careerTotals?.regularSeason;

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat
          label="Games Played"
          value={currentSeasonStats.gamesPlayed}
          icon={Timer}
          tooltip="Total games played this season"
        />
        <QuickStat
          label="Points"
          value={currentSeasonStats.points}
          icon={Award}
          trend={5}
          tooltip="Goals + Assists this season"
        />
        <QuickStat
          label="+/-"
          value={currentSeasonStats.plusMinus}
          icon={TrendingUp}
          tooltip="Plus/Minus rating this season"
        />
        <QuickStat
          label="TOI/Game"
          value={careerStats.avgToi}
          icon={Timer}
          tooltip="Average Time on Ice per game"
        />
      </div>

      {/* Recent Performance */}
      <div>
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          Recent Performance
        </h3>
        <RecentPerformanceChart last5Games={playerData.last5Games} />
      </div>

      {/* Last Game Summary */}
      <LastGameSummary lastGame={playerData.last5Games[0]} />
    </div>
  );
};

export default QuickView;
