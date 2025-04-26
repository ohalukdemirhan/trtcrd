import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../components/ui/Button';
import { Alert, Skeleton } from '@mui/material';
import 'animate.css';
import { AppDispatch } from '../../store';
import { fetchDashboardStats, selectDashboardStats, selectDashboardLoading, selectDashboardError } from '../../store/slices/dashboardSlice';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const stats = useSelector(selectDashboardStats);
  const isLoading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const cards = [
    {
      title: 'Total Translations',
      value: stats?.totalTranslations ?? '---',
      description: 'Documents translated this month',
      link: '/translations'
    },
    {
      title: 'Compliance Score',
      value: stats?.complianceScore ? `${stats.complianceScore}%` : '---',
      description: 'Overall compliance rating',
      link: '/compliance'
    },
    {
      title: 'Subscription Status',
      value: stats?.subscriptionStatus ?? '---',
      description: 'Current plan status',
      link: '/subscription'
    },
    {
      title: 'Available Credits',
      value: stats?.availableCredits ?? '---',
      description: 'Translation credits remaining',
      link: '/credits'
    }
  ];

  const quickActions = [
    {
      title: 'New Translation',
      description: 'Start a new translation project',
      icon: '📝',
      link: '/translations/new'
    },
    {
      title: 'Compliance Check',
      description: 'Run a compliance check on your documents',
      icon: '✓',
      link: '/compliance/check'
    },
    {
      title: 'View Reports',
      description: 'Access your translation analytics',
      icon: '📊',
      link: '/reports'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4">
            <Alert severity="error">{error}</Alert>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8 animate__animated animate__fadeInDown">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">Here's an overview of your translation activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-all duration-300 animate__animated animate__fadeInUp animate__delay-${index}s`}
              onClick={() => navigate(card.link)}
            >
              <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
              {isLoading ? (
                <Skeleton variant="text" width={120} height={48} />
              ) : (
                <div className="mt-2 text-3xl font-bold text-blue-600">{card.value}</div>
              )}
              <p className="mt-2 text-sm text-gray-500">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={action.title}
                className={`flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-300 animate__animated animate__fadeInLeft animate__delay-${index}s`}
                onClick={() => navigate(action.link)}
              >
                <div className="text-2xl mr-4">{action.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {isLoading ? (
              Array(3).fill(null).map((_, index) => (
                <div key={index} className="p-4">
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                </div>
              ))
            ) : stats?.recentActivities?.length ? (
              stats.recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all duration-300 animate__animated animate__fadeIn animate__delay-${index}s`}
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-500">{activity.timestamp}</p>
                  </div>
                  <Button
                    onClick={() => navigate(`/${activity.type}/${activity.id}`)}
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-300"
                  >
                    View Details
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 