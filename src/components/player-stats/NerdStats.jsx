import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Info, Maximize, Minimize } from 'lucide-react';

const TooltipInfo = ({ content }) => (
  <div className="group relative inline-block">
    <Info className="w-4 h-4 text-gray-400 cursor-help" />
    <div
      className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-gray-900 rounded-lg 
                    -translate-x-1/2 left-1/2 shadow-lg"
    >
      {content}
    </div>
  </div>
);

const MetricCard = ({
  title,
  value,
  tooltip,
  trend = null,
  className = '',
}) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow ${className}`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </span>
        {tooltip && <TooltipInfo content={tooltip} />}
      </div>
      {trend && (
        <span
          className={`text-xs font-medium ${
            trend > 0
              ? 'text-green-500'
              : trend < 0
                ? 'text-red-500'
                : 'text-gray-500'
          }`}
        >
          {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white">
      {value}
    </div>
  </div>
);

const ExpandableSection = ({ title, children, tooltip = null }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          {tooltip && <TooltipInfo content={tooltip} />}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {isExpanded ? (
            <Minimize className="w-5 h-5" />
          ) : (
            <Maximize className="w-5 h-5" />
          )}
        </button>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'} overflow-hidden`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const ZoneStartsChart = ({ data }) => {
  // Colors for different zone starts
  const COLORS = ['#0ea5e9', '#22c55e', '#ef4444'];

  return (
    <div className="h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{ background: '#1f2937', border: 'none' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const ShotMetricsChart = ({ data }) => (
  <div className="h-64">
    <ResponsiveContainer>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          contentStyle={{ background: '#1f2937', border: 'none' }}
          itemStyle={{ color: '#fff' }}
        />
        <Legend />
        <Bar dataKey="expected" fill="#0ea5e9" name="Expected" />
        <Bar dataKey="actual" fill="#22c55e" name="Actual" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const NerdStats = ({ playerData }) => {
  // Calculate advanced metrics
  const calculateAdvancedMetrics = () => {
    // These would normally come from an API or be calculated from raw data
    return {
      zoneStarts: [
        { name: 'Offensive Zone', value: 35 },
        { name: 'Neutral Zone', value: 30 },
        { name: 'Defensive Zone', value: 35 },
      ],
      shotMetrics: [
        { name: 'Goals', expected: 4.2, actual: 3 },
        { name: 'Shots', expected: 45.8, actual: 42 },
        { name: 'Shot Attempts', expected: 89.3, actual: 85 },
      ],
      corsi: 52.8,
      fenwick: 53.2,
      pdo: 100.5,
      gameScore: 68.5,
      qualityOfCompetition: 2.8,
      relativeCorsi: 3.5,
    };
  };

  const metrics = calculateAdvancedMetrics();

  return (
    <div className="space-y-6">
      {/* Top Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Corsi For %"
          value={`${metrics.corsi}%`}
          tooltip="Percentage of shot attempts (on goal, missed, or blocked) taken by the team while the player is on ice"
          trend={2.5}
        />
        <MetricCard
          title="PDO"
          value={metrics.pdo}
          tooltip="Sum of on-ice shooting percentage and on-ice save percentage multiplied by 100"
          trend={-0.8}
        />
        <MetricCard
          title="Game Score"
          value={metrics.gameScore}
          tooltip="Single number to represent player performance incorporating various statistics"
          trend={1.2}
        />
      </div>

      {/* Zone Starts */}
      <ExpandableSection
        title="Zone Start Distribution"
        tooltip="Where on the ice the player starts their shifts"
      >
        <ZoneStartsChart data={metrics.zoneStarts} />
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Off. Zone%
            </div>
            <div className="font-semibold dark:text-white">
              {metrics.zoneStarts[0].value}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Neutral%
            </div>
            <div className="font-semibold dark:text-white">
              {metrics.zoneStarts[1].value}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Def. Zone%
            </div>
            <div className="font-semibold dark:text-white">
              {metrics.zoneStarts[2].value}%
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* Shot Metrics */}
      <ExpandableSection
        title="Expected vs Actual Metrics"
        tooltip="Comparison of expected statistics based on shot quality vs actual results"
      >
        <ShotMetricsChart data={metrics.shotMetrics} />
      </ExpandableSection>

      {/* Additional Advanced Stats */}
      <ExpandableSection title="Additional Metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Quality of Competition
              </span>
              <TooltipInfo content="Average time on ice percentage of opposing players faced" />
            </div>
            <div className="text-lg font-semibold dark:text-white">
              {metrics.qualityOfCompetition}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Relative Corsi For%
              </span>
              <TooltipInfo content="Team's Corsi For% with player on ice vs off ice" />
            </div>
            <div className="text-lg font-semibold dark:text-white">
              {metrics.relativeCorsi > 0 ? '+' : ''}
              {metrics.relativeCorsi}%
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default NerdStats;
