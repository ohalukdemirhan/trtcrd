import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTranslations: number;
  activeSubscriptions: {
    FREE: number;
    BASIC: number;
    PROFESSIONAL: number;
    ENTERPRISE: number;
  };
  recentTranslations: Array<{
    id: number;
    user_email: string;
    source_lang: string;
    target_lang: string;
    created_at: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/v1/admin/dashboard/stats');
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalUsers}</p>
          <p className="mt-1 text-green-600 text-sm">
            {stats.activeUsers} active users
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Translations</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalTranslations}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Active Subscriptions</h3>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Free</span>
              <span className="text-sm font-medium">{stats.activeSubscriptions.FREE}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Basic</span>
              <span className="text-sm font-medium">{stats.activeSubscriptions.BASIC}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Professional</span>
              <span className="text-sm font-medium">{stats.activeSubscriptions.PROFESSIONAL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Enterprise</span>
              <span className="text-sm font-medium">{stats.activeSubscriptions.ENTERPRISE}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Translations */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Translations</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentTranslations.map((translation) => (
            <div key={translation.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{translation.user_email}</p>
                  <p className="text-sm text-gray-500">
                    {translation.source_lang} → {translation.target_lang}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(translation.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 