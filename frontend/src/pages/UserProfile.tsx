import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

/**
 * User profile page with account settings
 */
const UserProfile: React.FC = () => {
  // Mock user data
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Acme Inc.',
    role: 'Administrator',
    avatar: 'JD',
    preferences: {
      emailNotifications: true,
      darkMode: true,
      complianceAlerts: true,
    }
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to update the user profile
    alert('Profile updated successfully!');
  };

  // Toggle user preferences
  const handleTogglePreference = (key: keyof typeof user.preferences) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key]
      }
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg"></div>
        <div className="relative p-6">
          <h1 className="text-3xl font-bold mb-2 transition-all duration-300 ease-in-out">
            User Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl transition-all duration-300 ease-in-out">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={user.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={user.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Preferences */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <p className="text-xs text-gray-500">Receive email updates about your account</p>
                </div>
                <button
                  onClick={() => handleTogglePreference('emailNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    user.preferences.emailNotifications ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      user.preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Dark Mode</h3>
                  <p className="text-xs text-gray-500">Use dark theme for the interface</p>
                </div>
                <button
                  onClick={() => handleTogglePreference('darkMode')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    user.preferences.darkMode ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      user.preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Compliance Alerts</h3>
                  <p className="text-xs text-gray-500">Get notified about compliance issues</p>
                </div>
                <button
                  onClick={() => handleTogglePreference('complianceAlerts')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    user.preferences.complianceAlerts ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      user.preferences.complianceAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          <Card className="p-6 mt-6">
            <h2 className="text-xl font-semibold mb-6">Account</h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Change Password
              </button>
              <button className="w-full px-4 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Two-Factor Authentication
              </button>
              <button className="w-full px-4 py-2 text-left text-red-500 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Delete Account
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 