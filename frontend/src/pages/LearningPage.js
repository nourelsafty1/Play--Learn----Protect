// src/pages/LearningPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { learningAPI } from '../services/api';
import { getCategoryColor, truncate } from '../utils/helpers';

const LearningPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    ageGroup: '',
    difficulty: ''
  });

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleViewModule = (moduleId) => {
    navigate(`/learning/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 {t('learningModules')}</h1>
            <p className="text-gray-600 text-lg">
              {user?.role === 'teacher'
                ? t('teacherModulesDesc')
                : t('studentModulesDesc')
              }
            </p>
          </div>
          {user?.role === 'teacher' && (
            <Button onClick={() => navigate('/learning/create')}>
              ➕ {t('createNewModule')}
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('subject')}
              </label>
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="">{t('allSubjects')}</option>
                <option value="Maths">{t('maths')}</option>
                <option value="Biology">{t('biology')}</option>
                <option value="English">{t('english')}</option>
                <option value="Arabic">{t('arabic')}</option>
                <option value="Coding">{t('coding')}</option>
                <option value="Physics">{t('physics')}</option>
                <option value="Chemistry">{t('chemistry')}</option>
              </select>
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('ageGroup')}
              </label>
              <select
                value={filters.ageGroup}
                onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="">{t('allAges')}</option>
                <option value="3-5">3-5 {t('years')}</option>
                <option value="6-8">6-8 {t('years')}</option>
                <option value="9-12">9-12 {t('years')}</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('difficulty')}
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="">{t('allLevels')}</option>
                <option value="beginner">{t('beginner')}</option>
                <option value="intermediate">{t('intermediate')}</option>
                <option value="advanced">{t('advanced')}</option>
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('noModulesFound')}</h3>
              <p className="text-gray-500">{t('tryAdjustingFilters')}</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card
                key={module._id}
                className="cursor-pointer hover:shadow-2xl transition-all"
                onClick={() => handleViewModule(module._id)}
              >
                {/* Module Thumbnail */}
                <div
                  className={`relative mb-4 rounded-lg overflow-hidden h-48 flex items-center justify-center ${getCategoryColor(
                    module.subject
                  )}`}
                >
                  <div className="text-7xl">
                    {module.subject === 'Maths' && '🔢'}
                    {module.subject === 'Biology' && '🔬'}
                    {module.subject === 'Arabic' && '📚'}
                    {module.subject === 'English' && '📚'}
                    {module.subject === 'Coding' && '💻'}
                    {module.subject === 'Physics' && '⚛️'}
                    {module.subject === 'Chemistry' && '🧪'}
                  </div>

                  <div className="absolute top-2 right-2 px-3 py-1 rounded-full bg-white bg-opacity-90 text-gray-800 text-xs font-semibold capitalize">
                    {t(module.subject?.toLowerCase() || 'subject')}
                  </div>
                </div>

                {/* Module Info */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {(user?.language === 'ar' && module.titleArabic) ? module.titleArabic : module.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {truncate((user?.language === 'ar' && module.descriptionArabic) ? module.descriptionArabic : module.description, 100)}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>⭐ {(module.averageRating ?? 0).toFixed(1)}</span>
                  <span>👥 {module.enrollmentCount ?? 0} {t('enrolled')}</span>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex gap-2">
                    {module.ageGroups?.map((age, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                      >
                        {age} {t('years')}
                      </span>
                    ))}
                  </div>

                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold capitalize">
                    {t(module.difficulty?.toLowerCase() || 'difficulty')}
                  </span>
                </div>

                {/* Lessons Count */}
                <div className="mb-4 text-sm text-gray-600">
                  📝 {module.lessons?.length ?? 0} {t('lessons')}
                </div>

                {/* Action Buttons */}
                {user?.role === 'teacher' ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      fullWidth
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewModule(module._id);
                      }}
                    >
                      <span>👁️</span> {t('view')}
                    </Button>
                    {(typeof module.createdBy === 'object' ? module.createdBy._id === user._id : module.createdBy === user._id) && (
                      <Button
                        size="sm"
                        fullWidth
                        variant="primary" // Different variant to distinguish
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/learning/edit/${module._id}`);
                        }}
                      >
                        <span>✏️</span> {t('edit')}
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewModule(module._id);
                    }}
                  >
                    {t('startLearning')} →
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;