// src/pages/SettingsPage.js

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { authAPI } from '../services/api';

const SettingsPage = () => {
  const { user } = useAuth();
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notifications, setNotifications] = useState(user?.notificationSettings || {
    email: true,
    screenTimeAlerts: true,
    safetyAlerts: true,
    weeklyReports: true
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,[e.target.name]: e.target.value
});
setError('');
setSuccess('');
};
const handlePasswordSubmit = async (e) => {
e.preventDefault();
setLoading(true);
setError('');
setSuccess('');
if (passwordData.newPassword !== passwordData.confirmPassword) {
  setError('Passwords do not match');
  setLoading(false);
  return;
}

if (passwordData.newPassword.length < 6) {
  setError('Password must be at least 6 characters');
  setLoading(false);
  return;
}

try {
  await authAPI.updatePassword({
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword
  });
  setSuccess('Password updated successfully!');
  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
} catch (err) {
  setError(err.response?.data?.message || 'Failed to update password');
} finally {
  setLoading(false);
}
};
const handleNotificationToggle = async (key) => {
const newNotifications = {
...notifications,
[key]: !notifications[key]
};
setNotifications(newNotifications);
try {
  await authAPI.updateNotifications(newNotifications);
} catch (err) {
  console.error('Error updating notifications:', err);
}
};
return (
<div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
<Navbar />
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-8">⚙️ Settings</h1>

    {/* Change Password */}
    <Card title="Change Password" className="mb-8">
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            disabled={loading}
          />
        </div>

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Updating...' : 'Change Password'}
        </Button>
      </form>
    </Card>

    {/* Notification Settings */}
    <Card title="Notification Preferences">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-800">Email Notifications</h4>
            <p className="text-sm text-gray-600">Receive notifications via email</p>
          </div>
          <button
            onClick={() => handleNotificationToggle('email')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications.email ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.email ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-800">Screen Time Alerts</h4>
            <p className="text-sm text-gray-600">Get notified about screen time limits</p>
          </div>
          <button
            onClick={() => handleNotificationToggle('screenTimeAlerts')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications.screenTimeAlerts ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.screenTimeAlerts ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-800">Safety Alerts</h4>
            <p className="text-sm text-gray-600">Important safety notifications</p>
          </div>
          <button
            onClick={() => handleNotificationToggle('safetyAlerts')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications.safetyAlerts ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.safetyAlerts ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-800">Weekly Reports</h4>
            <p className="text-sm text-gray-600">Receive weekly progress summaries</p>
          </div>
          <button
            onClick={() => handleNotificationToggle('weeklyReports')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications.weeklyReports ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </Card>
  </div>
</div>
);
};
export default SettingsPage;
