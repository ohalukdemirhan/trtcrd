import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  tier: 'FREE' | 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate: string;
  endDate: string;
}

const AdminSubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get('/api/v1/admin/subscriptions');
        setSubscriptions(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch subscriptions');
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleUpdateSubscription = async (id: string, status: string) => {
    try {
      await axios.patch(`/api/v1/admin/subscriptions/${id}`, { status });
      // Refresh subscriptions after update
      const response = await axios.get('/api/v1/admin/subscriptions');
      setSubscriptions(response.data);
    } catch (err) {
      setError('Failed to update subscription');
    }
  };

  if (loading) return <div className="p-4">Loading subscriptions...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Subscription Management</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <td className="px-6 py-4 whitespace-nowrap">{subscription.userEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {subscription.tier}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    subscription.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscription.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(subscription.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(subscription.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {subscription.status === 'ACTIVE' ? (
                    <button
                      onClick={() => handleUpdateSubscription(subscription.id, 'CANCELLED')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateSubscription(subscription.id, 'ACTIVE')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Reactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubscriptions; 