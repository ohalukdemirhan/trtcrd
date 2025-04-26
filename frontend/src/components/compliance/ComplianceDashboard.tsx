import React, { useEffect } from 'react';
import { Card } from '../ui/Card';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates, fetchGdprTemplate, fetchKvkkTemplate } from '../../store/slices/complianceSlice';
import { RootState } from '../../store';
import { ComplianceTemplate, ComplianceCheckResult } from '../../types';

interface ComplianceDashboardProps {
  // Optional override props
  overallScore?: number;
  checksPerformed?: number;
  passedChecks?: number;
  failedChecks?: number;
}

/**
 * Interactive compliance dashboard with charts and statistics
 */
export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({
  overallScore,
  checksPerformed,
  passedChecks,
  failedChecks,
}) => {
  const dispatch = useDispatch();
  const { templates, gdprTemplate, kvkkTemplate, checkResult, isLoading, error } = useSelector(
    (state: RootState) => state.compliance
  );

  useEffect(() => {
    // Fetch compliance templates when component mounts
    dispatch(fetchTemplates() as any);
    dispatch(fetchGdprTemplate() as any);
    dispatch(fetchKvkkTemplate() as any);
  }, [dispatch]);

  // Calculate values from props or state
  const calculatedOverallScore = overallScore ?? checkResult?.overallScore ?? 85;
  const calculatedChecksPerformed = checksPerformed ?? checkResult?.checksPerformed ?? 120;
  const calculatedPassedChecks = passedChecks ?? checkResult?.passedChecks ?? 102;
  const calculatedFailedChecks = failedChecks ?? checkResult?.failedChecks ?? 18;

  // Mock data for template compliance
  const complianceByTemplate = [
    { template: 'GDPR', passRate: 92 },
    { template: 'KVKK', passRate: 88 },
    { template: 'CCPA', passRate: 78 },
  ];

  if (isLoading) {
    return <div className="p-6 text-center">Loading compliance data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error loading compliance data: {error}</div>;
  }
  
  return (
    <div className="w-full animate-fade-in">
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="animate-slide-up">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Overall Score</h3>
            <div className="flex items-center">
              <div className="relative w-24 h-24">
                {/* Circular progress background */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary-500"
                    strokeWidth="10"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    style={{
                      strokeDasharray: '251.2',
                      strokeDashoffset: `${251.2 - (251.2 * calculatedOverallScore) / 100}`,
                      transition: 'stroke-dashoffset 1s ease-out'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{calculatedOverallScore}%</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Based on {calculatedChecksPerformed} checks
                </p>
                <div className="mt-2 flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 mr-3">
                    {calculatedPassedChecks} Passed
                  </span>
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {calculatedFailedChecks} Failed
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Compliance by template */}
        {complianceByTemplate.slice(0, 3).map((item, index) => (
          <div key={item.template} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-2">{item.template}</h3>
              <div className="flex items-center">
                <div className="w-16 h-16 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Circular progress background */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className={`${
                          item.passRate > 90
                            ? 'text-green-500'
                            : item.passRate > 75
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`}
                        strokeWidth="10"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        style={{
                          strokeDasharray: '251.2',
                          strokeDashoffset: `${251.2 - (251.2 * item.passRate) / 100}`,
                          transition: 'stroke-dashoffset 1s ease-out'
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{item.passRate}%</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pass Rate</p>
                  <p className="text-sm font-medium mt-1">
                    {item.passRate > 90
                      ? 'Excellent'
                      : item.passRate > 75
                      ? 'Good'
                      : 'Needs Improvement'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      
      {/* Recent checks */}
      <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <Card className="p-6">
          <h3 className="text-xl font-medium mb-4">Available Compliance Templates</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {templates.map((template: any) => (
                  <tr key={template.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {template.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {template.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {template.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          template.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {template.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}; 