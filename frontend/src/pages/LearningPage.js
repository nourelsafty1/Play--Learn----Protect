// src/pages/LearningPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { learningAPI } from '../services/api';
import { truncate } from '../utils/helpers';

const LearningPage = () => {
  const navigate = useNavigate();
  
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    ageGroup: '',
    difficulty: '',
    search: ''
  });

  useEffect(() => {
    fetchModules();
  }, [filters]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await learningAPI.getAll(filters);
      setModules(response.data.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const getSubjectEmoji = (subject) => {
    const emojis = {
      math: '🔢',
      science: '🔬',
      language: '📚',
      coding: '💻',
      physics: '⚛️',
      chemistry: '🧪',
      'social-studies': '🌍',
      arts: '🎨'
    };
    return emojis[subject] || '📖';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Learning Modules</h1>
          <p className="text-gray-600 text-lg">Structured courses to master new skills</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search modules..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="">All Subjects</option>
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="language">Language</option>
                <option value="coding">Coding</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
              </select>
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age Group
              </label>
              <select
                value={filters.ageGroup}
                onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="">All Ages</option>
                <option value="3-5">3-5 years</option>
                <option value="6-8">6-8 years</option>
                <option value="9-12">9-12 years</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
    </Card>

    {/* Modules Grid */}
    {loading ? (
      <Loading />
    ) : modules.length === 0 ? (
      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No modules found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      </Card>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card 
            key={module._id} 
            className="cursor-pointer hover:shadow-2xl transition-all"
            onClick={() => navigate(`/learning/${module._id}`)}
          >
            {/* Module Thumbnail */}
            <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-green-400 to-blue-400 h-48 flex items-center justify-center">
              {module.thumbnail ? (
                <img src={module.thumbnail} alt={module.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-6xl">{getSubjectEmoji(module.subject)}</div>
              )}
              <div className="absolute top-2 right-2 px-3 py-1 rounded-full bg-white text-gray-800 text-xs font-semibold">
                {module.subject}
              </div>
            </div>

            {/* Module Info */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">{module.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{truncate(module.description, 100)}</p>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>⭐ {module.averageRating.toFixed(1)}</span>
              <span>👥 {module.enrollmentCount} enrolled</span>
              <span className="capitalize">{module.difficulty}</span>
            </div>

            {/* Lessons Count */}
            <div className="mb-4 text-sm text-gray-600">
              📝 {module.lessons.length} lessons
            </div>

            <Button size="sm" fullWidth>
              Start Learning →
            </Button>
          </Card>
        ))}
      </div>
    )}
  </div>
</div>
);
};
export default LearningPage;