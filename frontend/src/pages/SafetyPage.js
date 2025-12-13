// src/pages/SafetyPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { childrenAPI, safetyAPI } from '../services/api';
import { getSeverityColor, formatDate } from '../utils/helpers';

const SafetyPage = () => {
  const navigate = useNavigate();
  
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchSafetyData();
    }
  }, [selectedChild, filter]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await childrenAPI.getAll();
      const childrenData = response.data.data;
      setChildren(childrenData);
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]._id);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSafetyData = async () => {
    try {
      setLoading(true);
      
      const params = filter !== 'all' ? { resolved: filter === 'resolved' } : {};
      
      const [alertsRes, dashboardRes] = await Promise.all([
        safetyAPI.getAlerts(selectedChild, params),
        safetyAPI.getSafetyDashboard(selectedChild)
      ]);

      setAlerts(alertsRes.data.data);
      setDashboard(dashboardRes.data.data);
    } catch (error) {
      console.error('Error fetching safety data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await safetyAPI.resolveAlert(alertId, {
        parentResponse: 'acknowledged',
        parentNotes: 'Reviewed and handled'
      });
      fetchSafetyData();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🛡️ Safety Dashboard</h1>
          <p className="text-gray-600 text-lg">Monitor and manage safety alerts</p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Child Selector */}
            <div className="flex-1 w-full md:w-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Child
              </label>
              <select
                value={selectedChild || ''}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                {children.map((child) => (
                  <option key={child._id} value={child._id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter */}
            <div className="flex-1 w-full md:w-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter Alerts
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Alerts</option>
                <option value="unresolved">Unresolved</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </Card>

        {loading ? (
          <Loading />
        ) : dashboard ? (
          <>
            {/* Risk Score Card */}
            <Card className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Overall Risk Assessment</h3>
                  <p className="text-gray-600">Based on recent activity and alerts</p>
                </div>
                <div className="text-center">
                  <div className={`inline-block px-8 py-4 rounded-2xl ${getRiskLevelColor(dashboard.riskScore.level)}`}>
                    <div className="text-4xl font-bold mb-1">{dashboard.riskScore.score}</div>
                    <div className="text-sm font-semibold uppercase">{dashboard.riskScore.level} Risk</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white text-center">
                <div className="text-3xl mb-2">🚨</div>
                <div className="text-4xl font-bold mb-2">{dashboard.unresolvedAlerts.count}</div>
                <div className="text-sm opacity-90">Unresolved Alerts</div>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-center">
                <div className="text-3xl mb-2">⚠️</div>
                <div className="text-4xl font-bold mb-2">{dashboard.recentFlags.count}</div>
                <div className="text-sm opacity-90">Content Flags</div>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-4xl font-bold mb-2">{dashboard.analytics.safetyScore}</div>
                <div className="text-sm opacity-90">Safety Score</div>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <div className="text-4xl font-bold mb-2">{dashboard.settings.contentFilterLevel}</div>
                <div className="text-sm opacity-90">Filter Level</div>
              </Card>
            </div>

            {/* Alerts List */}
            <Card title="Recent Alerts">
              {alerts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No alerts</h3>
                  <p className="text-gray-500">Everything looks safe!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div 
                      key={alert._id}
                      className={`p-6 rounded-lg border-2 ${
                        alert.resolved 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-white border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                              {alert.severity.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">{formatDate(alert.createdAt)}</span>
                            {alert.resolved && (
                              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                ✓ RESOLVED
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-gray-800 mb-1">{alert.title}</h4>
                          <p className="text-gray-600">{alert.message}</p>
                          
                          {alert.educationalTip && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm font-semibold text-blue-800 mb-1">💡 Safety Tip:</p>
                              <p className="text-sm text-blue-700">{alert.educationalTip}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {!alert.resolved && (
                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleResolveAlert(alert._id)}
                          >
                            ✓ Mark as Resolved
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => navigate(`/safety/alerts/${alert._id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        ) : (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No data available</h3>
              <p className="text-gray-500">Add a child to start monitoring</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SafetyPage;