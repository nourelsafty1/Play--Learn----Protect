// src/pages/ChildDashboard.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { childrenAPI, progressAPI } from '../services/api';
import { getLevelProgress, getStreakEmoji, getLevelBadge } from '../utils/helpers';

const ChildDashboard = () => {
  const { childId } = useParams();
  
  const [child, setChild] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildData();
  }, [childId]);

  const fetchChildData = async () => {
    try {
      setLoading(true);
      
      const childRes = await childrenAPI.getDashboard(childId);
      setDashboard(childRes.data.data);
      setChild(childRes.data.data.profile);

    } catch (error) {
      console.error('Error fetching child data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    );
  }

  if (!child || !dashboard) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <p className="text-gray-600">Child not found</p>
          </Card>
        </div>
      </>
    );
  }

  const levelProgress = getLevelProgress(dashboard.progress.experiencePoints, child.level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-6">
              <div className={`w-24 h-24 rounded-full ${child.avatarColor || 'bg-blue-500'} flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg`}>
{child.avatar || child.name.charAt(0)}
</div>
<div>
<h1 className="text-4xl font-bold mb-2">
Welcome back, {child.name}! 👋
</h1>
<p className="text-lg opacity-90">
You're doing amazing! Keep learning and playing! 🌟
</p>
</div>
</div>
        {/* Streak Badge */}
        <div className="bg-white bg-opacity-20 backdrop-blur rounded-2xl p-4 text-center">
          <div className="text-4xl mb-2">{getStreakEmoji(child.currentStreak)}</div>
          <div className="text-2xl font-bold">{child.currentStreak}</div>
          <div className="text-sm opacity-90">Day Streak</div>
        </div>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Level */}
      <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-center">
        <div className="text-4xl mb-2">{getLevelBadge(child.level)}</div>
        <div className="text-5xl font-bold mb-2">{child.level}</div>
        <div className="text-sm opacity-90 mb-4">Level</div>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          ></div>
        </div>
        <div className="text-xs mt-2 opacity-90">{levelProgress}% to next level</div>
      </Card>

      {/* Total Points */}
      <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-center">
        <div className="text-4xl mb-2">⭐</div>
        <div className="text-5xl font-bold mb-2">{child.totalPoints.toLocaleString()}</div>
        <div className="text-sm opacity-90">Total Points</div>
      </Card>

      {/* Longest Streak */}
      <Card className="bg-gradient-to-br from-red-400 to-pink-500 text-white text-center">
        <div className="text-4xl mb-2">🔥</div>
        <div className="text-5xl font-bold mb-2">{child.longestStreak}</div>
        <div className="text-sm opacity-90">Longest Streak</div>
      </Card>

      {/* Screen Time */}
      <Card className="bg-gradient-to-br from-green-400 to-teal-500 text-white text-center">
        <div className="text-4xl mb-2">⏰</div>
        <div className="text-5xl font-bold mb-2">{dashboard.screenTime.today}m</div>
        <div className="text-sm opacity-90">Today's Screen Time</div>
        <div className="text-xs mt-2 opacity-90">
          {dashboard.screenTime.remaining}m remaining
        </div>
      </Card>
    </div>

    {/* Action Buttons */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Button 
        size="lg" 
        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
      >
        <span className="text-2xl">🎮</span>
        <span>Play Games</span>
      </Button>
      
      <Button 
        size="lg"
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      >
        <span className="text-2xl">📚</span>
        <span>Learn Something New</span>
      </Button>
      
      <Button 
        size="lg"
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
      >
        <span className="text-2xl">🏆</span>
        <span>View Achievements</span>
      </Button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Achievements */}
      <Card title="🏆 Your Achievements" subtitle={`${dashboard.achievements.length} earned`}>
        {dashboard.achievements.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500">Start playing to earn achievements!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboard.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="text-3xl">🏅</div>
                <div>
                  <p className="font-semibold text-gray-800">Achievement Unlocked!</p>
                  <p className="text-sm text-gray-500">
                    {new Date(achievement.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card title="📊 Recent Activity" subtitle="What you've been up to">
        {dashboard.recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎲</div>
            <p className="text-gray-500">No recent activity yet!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboard.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {activity.contentType === 'game' ? '🎮' : '📚'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {activity.game?.title || activity.learningModule?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.status === 'completed' ? '✅ Completed' : '⏳ In Progress'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">{activity.score}%</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  </div>
</div>
);
};
export default ChildDashboard;