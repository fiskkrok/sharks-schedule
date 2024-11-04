import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const StatCategory = ({
  title,
  children,
  tooltip,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium dark:text-white">{title}</span>
          {tooltip && (
            <div className="group relative">
              <Info className="w-4 h-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-48 text-center">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const DefensiveMetrics = ({ seasonStats, careerStats }) => {
  // Normalize the stats for radar chart
  const maxValues = {
    blocks: 150,
    takeaways: 50,
    hits: 200,
    plusMinus: 40,
  };

  const normalizeValue = (value, max) => ((value || 0) / max) * 100;

  const radarData = [
    {
      metric: 'Blocks',
      value: normalizeValue(seasonStats.blockedShots, maxValues.blocks),
      fullValue: seasonStats.blockedShots,
    },
    {
      metric: 'Takeaways',
      value: normalizeValue(seasonStats.takeaways, maxValues.takeaways),
      fullValue: seasonStats.takeaways,
    },
    {
      metric: 'Hits',
      value: normalizeValue(seasonStats.hits, maxValues.hits),
      fullValue: seasonStats.hits,
    },
    {
      metric: '+/-',
      value: normalizeValue(seasonStats.plusMinus, maxValues.plusMinus),
      fullValue: seasonStats.plusMinus,
    },
  ];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Current Season"
            dataKey="value"
            stroke="#0d9488"
            fill="#0d9488"
            fillOpacity={0.6}
          />
          <Tooltip
            content={({ payload }) => {
              if (!payload?.length) return null;
              return (
                <div className="bg-white dark:bg-gray-800 p-2 rounded shadow">
                  <p className="text-gray-900 dark:text-white">
                    {payload[0].payload.metric}: {payload[0].payload.fullValue}
                  </p>
                </div>
              );
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TimeOnIceBreakdown = ({ seasonStats }) => {
  // Sample data - replace with actual TOI breakdowns
  const data = [
    { situation: 'Even Strength', minutes: 18.5 },
    { situation: 'Power Play', minutes: 2.3 },
    { situation: 'Penalty Kill', minutes: 1.8 },
  ];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="situation" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="minutes" fill="#0d9488" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const PointsProgression = ({ seasonStats, last20Games }) => {
  // Transform the last 20 games data for the chart
  const data = last20Games.map((game, index) => ({
    game: index + 1,
    points: game.points,
    cumulative: last20Games
      .slice(0, index + 1)
      .reduce((sum, g) => sum + g.points, 0),
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="game" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="points"
            stroke="#0d9488"
            name="Points per Game"
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#6366f1"
            name="Cumulative Points"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const DeepDive = ({ playerData }) => {
  const currentSeasonStats = playerData.featuredStats?.regularSeason?.subSeason;
  const careerStats = playerData.careerTotals?.regularSeason;

  return (
    <div className="space-y-6">
      <StatCategory
        title="Defensive Metrics"
        tooltip="Key defensive statistics visualized as a radar chart"
        defaultExpanded={true}
      >
        <DefensiveMetrics
          seasonStats={currentSeasonStats}
          careerStats={careerStats}
        />
      </StatCategory>

      <StatCategory
        title="Time on Ice Distribution"
        tooltip="Breakdown of average time spent in different game situations"
      >
        <TimeOnIceBreakdown seasonStats={currentSeasonStats} />
      </StatCategory>

      <StatCategory
        title="Points Progression"
        tooltip="Points accumulation over the last 20 games"
      >
        <PointsProgression
          seasonStats={currentSeasonStats}
          last20Games={playerData.last20Games || []}
        />
      </StatCategory>

      <StatCategory title="Advanced Metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Shot Suppression
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm dark:text-gray-300">
                  Blocks per 60
                </span>
                <span className="font-medium dark:text-white">
                  {(
                    (currentSeasonStats.blockedShots /
                      currentSeasonStats.gamesPlayed) *
                    60
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm dark:text-gray-300">Hits per 60</span>
                <span className="font-medium dark:text-white">
                  {(
                    (currentSeasonStats.hits / currentSeasonStats.gamesPlayed) *
                    60
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Puck Control
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm dark:text-gray-300">
                  Takeaways/Giveaways Ratio
                </span>
                <span className="font-medium dark:text-white">
                  {(
                    currentSeasonStats.takeaways /
                    (currentSeasonStats.giveaways || 1)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm dark:text-gray-300">
                  Possession Impact
                </span>
                <span className="font-medium dark:text-white">
                  {currentSeasonStats.plusMinus > 0 ? '+' : ''}
                  {currentSeasonStats.plusMinus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </StatCategory>
    </div>
  );
};

export default DeepDive;
