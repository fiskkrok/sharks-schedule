import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const getConfidenceColor = (probability) => {
  // Color gradient from red (low confidence) to green (high confidence)
  if (probability < 0.4) return 'from-red-500 to-red-600';
  if (probability < 0.45) return 'from-orange-500 to-orange-600';
  if (probability < 0.55) return 'from-yellow-500 to-yellow-600';
  if (probability < 0.6) return 'from-lime-500 to-lime-600';
  return 'from-green-500 to-green-600';
};

const TrendIndicator = ({ trend }) => {
  if (Math.abs(trend) < 2) return null;

  const Icon = trend > 0 ? TrendingUp : TrendingDown;
  const color = trend > 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`flex items-center ${color} text-xs`}>
      <Icon className="w-4 h-4 mr-1" />
      <span>{Math.abs(trend).toFixed(1)}%</span>
    </div>
  );
};

const ProbabilityBar = ({
  probability,
  trend,
  label,
  showDetails = false,
  className = '',
}) => {
  const width = `${Math.round(probability * 100)}%`;
  const confidenceColor = getConfidenceColor(probability);

  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {label || 'Win Probability'}
        </span>
        {showDetails && <TrendIndicator trend={trend} />}
      </div>
      <div className="relative">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${confidenceColor} rounded-full transition-all duration-1000 ease-in-out`}
            style={{ width }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {Math.round(probability * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityBar;
