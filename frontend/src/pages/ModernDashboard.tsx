import React from 'react';
import { Card } from '../components/ui/Card';

/**
 * Dashboard page with overview of key metrics
 */
const ModernDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg"></div>
        <div className="relative p-6">
          <h1 className="text-3xl font-bold mb-2 transition-all duration-300 ease-in-out">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl transition-all duration-300 ease-in-out">
            Welcome to TrtCrd. View your translation and compliance metrics at a glance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Translations</h2>
          <p className="text-gray-600 dark:text-gray-300">
            You have completed 24 translations this month.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Compliance</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your compliance score is 92%.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Subscription</h2>
          <p className="text-gray-600 dark:text-gray-300">
            You are on the Professional plan.
          </p>
        </Card>
      </div>

      <div className="mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="font-medium">English to French Translation</p>
              <p className="text-sm text-gray-500">Completed on March 1, 2023</p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="font-medium">GDPR Compliance Check</p>
              <p className="text-sm text-gray-500">Completed on February 28, 2023</p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="font-medium">German to English Translation</p>
              <p className="text-sm text-gray-500">Completed on February 25, 2023</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ModernDashboard; 