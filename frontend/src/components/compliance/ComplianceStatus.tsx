import React from 'react';

interface ComplianceStatusProps {
  isCompliant: boolean;
  score?: number;
  template?: string;
  className?: string;
  suggestions?: string[];
}

/**
 * Displays the compliance status with animated indicators
 */
export const ComplianceStatus: React.FC<ComplianceStatusProps> = ({
  isCompliant,
  score = 0,
  template = 'GDPR',
  className = '',
  suggestions = [],
}) => {
  // Calculate color based on compliance status and score
  const getColor = () => {
    if (isCompliant) return 'bg-green-500';
    if (score > 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get status text
  const getStatusText = () => {
    if (isCompliant) return 'Compliant';
    if (score > 70) return 'Needs Review';
    return 'Non-Compliant';
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center mb-2">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${getColor()} animate-pulse`}
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{getStatusText()}</span>
          <span className="text-xs text-gray-500">{template} {score ? `(${score}%)` : ''}</span>
        </div>
      </div>
      {suggestions.length > 0 && (
        <ul className="mt-2 space-y-1">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
              • {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}; 