import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import { RootState } from '../store';
import { User } from '../types';

// We'll keep the activity log mock data for now since there's no API endpoint for it yet
const MOCK_ACTIVITY = [
  {
    id: 1,
    action: 'Login',
    timestamp: '2023-03-01T08:30:00Z',
    details: 'Logged in from 192.168.1.1 (Istanbul, Turkey)',
    ip: '192.168.1.1'
  },
  {
    id: 2,
    action: 'Translation',
    timestamp: '2023-03-01T09:15:00Z',
    details: 'Translated document "Privacy Policy v2" from English to Turkish',
    documentId: 'doc_456'
  },
  {
    id: 3,
    action: 'Compliance Check',
    timestamp: '2023-03-01T09:20:00Z',
    details: 'Ran GDPR compliance check on "Privacy Policy v2"',
    documentId: 'doc_456',
    result: 'Passed'
  },
  {
    id: 4,
    action: 'Settings',
    timestamp: '2023-02-28T16:45:00Z',
    details: 'Updated notification preferences',
  },
  {
    id: 5,
    action: 'API',
    timestamp: '2023-02-28T14:30:00Z',
    details: 'Generated new API key',
    apiKeyId: 'key_789'
  }
];

interface UserProfileProps {
  onUpdateProfile?: (userData: any) => void;
  onChangePassword?: (oldPassword: string, newPassword: string) => void;
  onToggleTwoFactor?: (enabled: boolean) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  onUpdateProfile,
  onChangePassword,
  onToggleTwoFactor
}) => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  const { subscription } = useSelector((state: RootState) => state.subscription);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState<User | null>(user);
  const [activity] = useState(MOCK_ACTIVITY);
  
  // Update local state when user data changes in Redux
  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);
  
  // Form state for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (userData) {
      setUserData(prev => ({
        ...prev!,
        [name]: value
      }));
    }
  };
  
  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle profile save
  const handleProfileSave = () => {
    if (onUpdateProfile && userData) {
      onUpdateProfile(userData);
      // Update user in Redux store
      dispatch(setUser(userData));
    }
    setEditMode(false);
  };
  
  // Handle password save
  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (onChangePassword) {
      onChangePassword(passwordData.currentPassword, passwordData.newPassword);
    }
    
    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <div className="text-center p-5">Loading user profile...</div>;
  }

  if (error) {
    return <div className="alert alert-danger m-3">Error loading profile: {error}</div>;
  }

  if (!user || !userData) {
    return <div className="alert alert-warning m-3">Please log in to view your profile</div>;
  }
  
  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email)}&background=0D8ABC&color=fff`}
              alt={user.full_name || user.email} 
              className="rounded-circle mb-3" 
              width="120" 
              height="120"
            />
            <h5 className="card-title">{user.full_name || user.email}</h5>
            <p className="text-muted">{user.role}</p>
            <p className="text-muted">{user.company_name || 'No company'}</p>
            
            <div className="d-flex justify-content-center mt-3">
              <span className="badge bg-primary me-2">{user.role}</span>
              {subscription && (
                <span className="badge bg-success">{subscription.tier}</span>
              )}
            </div>
          </div>
          
          <div className="list-group list-group-flush">
            <button 
              className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user me-2"></i> Profile
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="fas fa-shield-alt me-2"></i> Security
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <i className="fas fa-history me-2"></i> Activity Log
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeTab === 'subscription' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscription')}
            >
              <i className="fas fa-credit-card me-2"></i> Subscription
            </button>
          </div>
        </div>
      </div>
      
      <div className="col-md-8">
        <div className="card shadow-sm">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Profile Information</h5>
                <button 
                  className={`btn btn-sm ${editMode ? 'btn-success' : 'btn-primary'}`}
                  onClick={() => editMode ? handleProfileSave() : setEditMode(true)}
                >
                  <i className={`fas ${editMode ? 'fa-save' : 'fa-edit'} me-1`}></i>
                  {editMode ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="card-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="full_name"
                        value={userData.full_name || ''}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email"
                        value={userData.email}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Company</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="company_name"
                        value={userData.company_name || ''}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={userData.role}
                        disabled={true}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <>
              <div className="card-header bg-white">
                <h5 className="mb-0">Security Settings</h5>
              </div>
              <div className="card-body">
                <h6 className="mb-3">Change Password</h6>
                <form onSubmit={handlePasswordSave}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update Password
                  </button>
                </form>
                
                <hr className="my-4" />
                
                <h6 className="mb-3">Two-Factor Authentication</h6>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="twoFactorToggle"
                    checked={false} // We don't have this info in the User type yet
                    onChange={(e) => onToggleTwoFactor && onToggleTwoFactor(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="twoFactorToggle">
                    Enable Two-Factor Authentication
                  </label>
                </div>
                <p className="text-muted mt-2">
                  <small>Protect your account with an extra layer of security. When enabled, you'll need to enter a code from your authenticator app when logging in.</small>
                </p>
              </div>
            </>
          )}
          
          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <>
              <div className="card-header bg-white">
                <h5 className="mb-0">Activity Log</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Details</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activity.map(item => (
                        <tr key={item.id}>
                          <td>
                            <span className={`badge ${
                              item.action === 'Login' ? 'bg-info' :
                              item.action === 'Translation' ? 'bg-primary' :
                              item.action === 'Compliance Check' ? 'bg-success' :
                              item.action === 'Settings' ? 'bg-secondary' :
                              'bg-warning text-dark'
                            }`}>
                              {item.action}
                            </span>
                          </td>
                          <td>{item.details}</td>
                          <td>{formatDate(item.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          
          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <>
              <div className="card-header bg-white">
                <h5 className="mb-0">Subscription Details</h5>
              </div>
              <div className="card-body">
                {subscription ? (
                  <>
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <h6>Current Plan</h6>
                        <h5 className="text-primary">{subscription.tier}</h5>
                      </div>
                      <div className="col-md-6">
                        <h6>Status</h6>
                        <span className={`badge ${subscription.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                          {subscription.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <h6>Monthly Request Limit</h6>
                        <p>{subscription.monthly_requests_limit || 'Unlimited'}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>Current Usage</h6>
                        <p>{subscription.current_requests_count} requests</p>
                      </div>
                    </div>
                    
                    <div className="progress mb-3">
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ 
                          width: `${subscription.monthly_requests_limit ? 
                            (subscription.current_requests_count / subscription.monthly_requests_limit) * 100 : 0}%` 
                        }}
                        aria-valuenow={subscription.current_requests_count} 
                        aria-valuemin={0} 
                        aria-valuemax={subscription.monthly_requests_limit || 100}
                      ></div>
                    </div>
                    
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                      <button className="btn btn-outline-primary">
                        <i className="fas fa-arrow-up me-1"></i> Upgrade Plan
                      </button>
                      <button className="btn btn-outline-secondary">
                        <i className="fas fa-file-invoice-dollar me-1"></i> Billing History
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="alert alert-info">
                    No subscription information available. Please contact support.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 