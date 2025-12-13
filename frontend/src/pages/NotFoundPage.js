// src/pages/NotFoundPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
        <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="text-8xl mb-8">🤔</div>
        <Button
          onClick={() => navigate('/dashboard')}
          fullWidth
          size="lg"
        >
          <span>🏠</span>
          <span>Go Back Home</span>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;