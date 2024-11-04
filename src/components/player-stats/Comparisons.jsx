import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Search, Filter, RefreshCcw } from 'lucide-react';

const ComparisonSelect = ({ onSelect, type, currentValue }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = {
    team: [
      { label: 'Team Defensemen', value: 'team' },
      { label: 'League Average', value: 'league_avg' },
      { label: 'Top 10 Defensemen', value: 'top_10' },
    ],
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
      >
        <span className="text-sm text-gray-900 dark:text-white">
          {options[type].find((opt) => opt.value === currentValue)?.label}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          {options[type].map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const StatComparison = ({
  title,
  playerValue,
  comparisonValue,
  isHigherBetter = true,
}) => {
  const difference = playerValue - comparisonValue;
  const isPositive = isHigherBetter ? difference > 0 : difference < 0;

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <div className="mt-1 font-semibold text-gray-900 dark:text-white">
          {playerValue.toFixed(1)} vs {comparisonValue.toFixed(1)}
        </div>
      </div>
      <div
        className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}
      >
        {difference > 0 ? '+' : ''}
        {difference.toFixed(1)}
      </div>
    </div>
  );
};

const ComparisonChart = ({ data, metric }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={metric} fill="#0d9488" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const Comparisons = ({ playerData }) => {
  const [comparisonType, setComparisonType] = useState('team');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('points');

  const metrics = [
    { label: 'Points', value: 'points' },
    { label: 'Time on Ice', value: 'timeOnIce' },
    { label: 'Plus/Minus', value: 'plusMinus' },
    { label: 'Blocks', value: 'blocks' },
  ];

  useEffect(() => {
    const fetchComparisonData = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call
        // For now, using mock data
        const mockData = {
          team: {
            defensemen: [
              {
                name: 'Timothy Liljegren',
                points: 23,
                timeOnIce: 19.4,
                plusMinus: 3,
                blocks: 48,
              },
              {
                name: 'D-man 2',
                points: 18,
                timeOnIce: 18.2,
                plusMinus: -2,
                blocks: 52,
              },
              {
                name: 'D-man 3',
                points: 15,
                timeOnIce: 17.8,
                plusMinus: 1,
                blocks: 45,
              },
            ],
            average: {
              points: 18.7,
              timeOnIce: 18.5,
              plusMinus: 0.7,
              blocks: 48.3,
            },
          },
        };

        setComparisonData(mockData[comparisonType]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [comparisonType]);

  if (loading || !comparisonData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comparison Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <ComparisonSelect
            type="team"
            currentValue={comparisonType}
            onSelect={setComparisonType}
          />
        </div>
        <div className="flex-1">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
            {metrics.map((metric) => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Charts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          {metrics.find((m) => m.value === selectedMetric)?.label} Comparison
        </h3>
        <ComparisonChart
          data={comparisonData.defensemen}
          metric={selectedMetric}
        />
      </div>

      {/* Key Stats Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatComparison
          title="Points per Game"
          playerValue={
            playerData.featuredStats.regularSeason.subSeason.points /
            playerData.featuredStats.regularSeason.subSeason.gamesPlayed
          }
          comparisonValue={comparisonData.average.points}
        />
        <StatComparison
          title="Average TOI"
          playerValue={parseFloat(playerData.careerTotals.regularSeason.avgToi)}
          comparisonValue={comparisonData.average.timeOnIce}
        />
        <StatComparison
          title="Plus/Minus"
          playerValue={
            playerData.featuredStats.regularSeason.subSeason.plusMinus
          }
          comparisonValue={comparisonData.average.plusMinus}
        />
        <StatComparison
          title="Blocks per Game"
          playerValue={
            playerData.featuredStats.regularSeason.subSeason.blockedShots /
            playerData.featuredStats.regularSeason.subSeason.gamesPlayed
          }
          comparisonValue={
            comparisonData.average.blocks /
            playerData.featuredStats.regularSeason.subSeason.gamesPlayed
          }
        />
      </div>
    </div>
  );
};

export default Comparisons;
