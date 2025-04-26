import React, { useState } from 'react';
import { Card } from '../components/ui/Card';

/**
 * Subscription page with simplified interface
 */
const ModernSubscription: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'usage' | 'invoices'>('plans');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Subscription tiers
  const subscriptionTiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      features: [
        '50,000 words/month',
        'Basic compliance rules',
        'Email support',
        'API access',
      ],
    },
    // Modern/advanced subscription features are commented out for MVP focus. Uncomment for future versions.
    // {
    //   id: 'professional',
    //   name: 'Professional',
    //   price: 99,
    //   features: [
    //     '200,000 words/month',
    //     'Advanced compliance rules',
    //     'Priority support',
    //     'API access',
    //     'Custom templates',
    //   ],
    //   isPopular: true,
    // },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Unlimited words',
        'All compliance rules',
        'Dedicated support',
        'API access',
        'Custom templates',
        'SLA guarantees',
      ],
    },
  ];

  // Usage data
  const usageData = {
    translations: { current: 35000, limit: 50000 },
    compliance: { current: 28, limit: 50 },
    apiCalls: { current: 1250, limit: 2000 },
  };

  // Invoice data
  const invoices = [
    { id: 'INV-001', date: '2023-03-01', amount: '$99.00', status: 'Paid' },
    { id: 'INV-002', date: '2023-02-01', amount: '$99.00', status: 'Paid' },
    { id: 'INV-003', date: '2023-01-01', amount: '$99.00', status: 'Paid' },
  ];

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleConfirmUpgrade = () => {
    // In a real app, this would call an API to upgrade the subscription
    alert(`Subscription upgraded to ${selectedTier}`);
    setShowConfirmation(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg"></div>
        <div className="relative p-6">
          <h1 className="text-3xl font-bold mb-2 transition-all duration-300 ease-in-out">
            Subscription
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl transition-all duration-300 ease-in-out">
            Manage your subscription, view usage, and access billing history.
          </p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'plans'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('plans')}
        >
          Plans
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'usage'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('usage')}
        >
          Usage
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'invoices'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('invoices')}
        >
          Invoices
        </button>
      </div>

      {/* Plans tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {subscriptionTiers.map((tier) => (
            <Card key={tier.id} className="p-6 relative">
              {tier.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                </div>
              )}
              <h3 className="text-xl font-bold mb-2 text-center">{tier.name}</h3>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {typeof tier.price === 'number' ? `$${tier.price}` : tier.price}
                  </span>
                  {typeof tier.price === 'number' && (
                    <span className="text-gray-500 ml-1">/month</span>
                  )}
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <button
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 
                    ${tier.id === 'professional' 
                      ? 'bg-gradient-primary text-white' 
                      : 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}
                  onClick={() => handleSelectTier(tier.id)}
                >
                  {tier.id === 'professional' ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Usage tab */}
      {activeTab === 'usage' && (
        <div className="mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Words Translated</span>
                  <span className="text-sm font-medium">
                    {usageData.translations.current} / {usageData.translations.limit}
                  </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${(usageData.translations.current / usageData.translations.limit) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Next reset: April 1, 2023</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Compliance Checks</span>
                  <span className="text-sm font-medium">
                    {usageData.compliance.current} / {usageData.compliance.limit}
                  </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500" 
                    style={{ width: `${(usageData.compliance.current / usageData.compliance.limit) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">5 templates available on your plan</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">API Calls</span>
                  <span className="text-sm font-medium">
                    {usageData.apiCalls.current} / {usageData.apiCalls.limit}
                  </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${(usageData.apiCalls.current / usageData.apiCalls.limit) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  API documentation available <a href="#" className="text-primary-500 hover:underline">here</a>
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Invoices tab */}
      {activeTab === 'invoices' && (
        <div className="mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Billing History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {invoice.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {invoice.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button className="text-primary-500 hover:text-primary-600">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Confirmation dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Subscription Change</h3>
            <p className="mb-6">
              Are you sure you want to change your subscription to the{' '}
              <span className="font-semibold">
                {subscriptionTiers.find((tier) => tier.id === selectedTier)?.name}
              </span>{' '}
              plan?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={handleCloseConfirmation}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                onClick={handleConfirmUpgrade}
              >
                Confirm
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ModernSubscription; 