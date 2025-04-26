import React, { useEffect, useState } from 'react';

interface UsageChartProps {
  current: number;
  limit: number;
  label?: string;
  className?: string;
}

/**
 * Animated usage meter with progress bar
 */
export const UsageChart: React.FC<UsageChartProps> = ({
  current,
  limit,
  label = 'Usage',
  className = '',
}) => {
  const [percentage, setPercentage] = useState(0);
  
  // Calculate percentage
  useEffect(() => {
    const calculatedPercentage = Math.min(Math.round((current / limit) * 100), 100);
    setPercentage(calculatedPercentage);
  }, [current, limit]);
  
  // Determine color based on usage percentage
  const getColor = () => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className={`w-full ${className}`}>
      {/* Label and values */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">{current} / {limit}</span>
      </div>
      
      {/* Progress bar container */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Percentage indicator */}
      <div className="mt-1 text-right">
        <span
          className="text-xs font-medium opacity-100 transition-opacity duration-500 delay-500"
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
}; 