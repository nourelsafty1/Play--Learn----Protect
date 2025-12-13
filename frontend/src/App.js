import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loading from './components/common/Loading';

// Import all pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ParentDashboard from './pages/ParentDashboard';
import ChildDashboard from './pages/ChildDashboard';
import AddChildPage from './pages/AddChildPage';
import GamesPage from './pages/GamesPage';
import GameDetailPage from './pages/GameDetailPage';
import LearningPage from './pages/LearningPage';
import LearningDetailPage from './pages/LearningDetailPage';
import MonitoringPage from './pages/MonitoringPage';
import SafetyPage from './pages/SafetyPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Navigate to="/login" replace />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <ParentDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Children Routes */}
        <Route 
          path="/children/add" 
          element={
            <ProtectedRoute>
              <AddChildPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/children/:childId/dashboard" 
          element={
            <ProtectedRoute>
              <ChildDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Games Routes */}
        <Route 
          path="/games" 
          element={
            <ProtectedRoute>
              <GamesPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/games/:gameId" 
          element={
            <ProtectedRoute>
              <GameDetailPage />
            </ProtectedRoute>
          } 
        />

        {/* Learning Routes */}
        <Route 
          path="/learning" 
          element={
            <ProtectedRoute>
              <LearningPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/learning/:moduleId" 
          element={
            <ProtectedRoute>
              <LearningDetailPage />
            </ProtectedRoute>
          } 
        />

        {/* Monitoring Routes */}
        <Route 
          path="/monitoring" 
          element={
            <ProtectedRoute>
              <MonitoringPage />
            </ProtectedRoute>
          } 
        />

        {/* Safety Routes */}
        <Route 
          path="/safety" 
          element={
            <ProtectedRoute>
              <SafetyPage />
            </ProtectedRoute>
          } 
        />

        {/* Leaderboard Route */}
        <Route 
          path="/leaderboard" 
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          } 
        />

        {/* Profile & Settings Routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;