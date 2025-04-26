import React from 'react';
import { Card } from '../components/ui/Card';

/**
 * Translations page with simplified interface
 */
const ModernTranslations: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg"></div>
        <div className="relative p-6">
          <h1 className="text-3xl font-bold mb-2 transition-all duration-300 ease-in-out">
            Translations
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl transition-all duration-300 ease-in-out">
            Manage your translation projects and compliance checks.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Translation Workspace</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Source Text</h3>
              <textarea 
                className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                placeholder="Enter text to translate..."
              ></textarea>
              <div className="mt-2 flex justify-between">
                <div>
                  <span className="text-sm text-gray-500">Source Language: </span>
                  <select className="text-sm border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-800">
                    <option>English</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Spanish</option>
                  </select>
                </div>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  Translate
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Translation</h3>
              <div className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-400 italic">Translation will appear here...</p>
              </div>
              <div className="mt-2 flex justify-between">
                <div>
                  <span className="text-sm text-gray-500">Target Language: </span>
                  <select className="text-sm border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-800">
                    <option>French</option>
                    <option>German</option>
                    <option>Spanish</option>
                    <option>Italian</option>
                  </select>
                </div>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Translations</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">English to French</p>
                  <p className="text-sm text-gray-500">450 words • March 15, 2023</p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mr-2">
                    GDPR Compliant
                  </span>
                  <button className="text-primary-500 hover:text-primary-600">
                    View
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">English to German</p>
                  <p className="text-sm text-gray-500">320 words • March 14, 2023</p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 mr-2">
                    Not Compliant
                  </span>
                  <button className="text-primary-500 hover:text-primary-600">
                    View
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">English to Spanish</p>
                  <p className="text-sm text-gray-500">560 words • March 12, 2023</p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mr-2">
                    GDPR Compliant
                  </span>
                  <button className="text-primary-500 hover:text-primary-600">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ModernTranslations; 