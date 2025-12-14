// src/pages/EditLearningModulePage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { learningAPI } from '../services/api';

const EditLearningModulePage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Module data
  const [moduleData, setModuleData] = useState({
    title: '',
    titleArabic: '',
    description: '',
    descriptionArabic: '',
    subject: 'math',
    topic: '',
    ageGroups: [],
    gradeLevel: '',
    difficulty: 'beginner',
    learningObjectives: [''],
    skills: [''],
    pointsPerLesson: 50,
    completionPoints: 200,
    hasQuiz: false,
    passingScore: 70,
    language: ['ar', 'en']
  });
  
  const [lessons, setLessons] = useState([]);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [editingLessonIndex, setEditingLessonIndex] = useState(null);
  
  // New lesson form
  const [newLesson, setNewLesson] = useState({
    lessonNumber: 1,
    title: '',
    titleArabic: '',
    contentType: 'video',
    content: '',
    duration: 10,
    order: 1
  });

  useEffect(() => {
    if (user?.role !== 'teacher') {
      alert('Access denied. Only teachers can edit modules.');
      navigate('/learning');
      return;
    }
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const response = await learningAPI.getOne(moduleId);
      const module = response.data.data;
      
      setModuleData({
        title: module.title || '',
        titleArabic: module.titleArabic || '',
        description: module.description || '',
        descriptionArabic: module.descriptionArabic || '',
        subject: module.subject || 'math',
        topic: module.topic || '',
        ageGroups: module.ageGroups || [],
        gradeLevel: module.gradeLevel || '',
        difficulty: module.difficulty || 'beginner',
        learningObjectives: module.learningObjectives?.length > 0 ? module.learningObjectives : [''],
        skills: module.skills?.length > 0 ? module.skills : [''],
        pointsPerLesson: module.pointsPerLesson || 50,
        completionPoints: module.completionPoints || 200,
        hasQuiz: module.hasQuiz || false,
        passingScore: module.passingScore || 70,
        language: module.language || ['ar', 'en']
      });
      
      setLessons(module.lessons || []);
      
      if (module.lessons && module.lessons.length > 0) {
        setNewLesson(prev => ({
          ...prev,
          lessonNumber: module.lessons.length + 1,
          order: module.lessons.length + 1
        }));
      }
    } catch (error) {
      console.error('Error fetching module:', error);
      setError('Failed to load module');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleChange = (field, value) => {
    setModuleData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleArrayFieldChange = (field, index, value) => {
    setModuleData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setModuleData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setModuleData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleAgeGroupToggle = (ageGroup) => {
    setModuleData(prev => ({
      ...prev,
      ageGroups: prev.ageGroups.includes(ageGroup)
        ? prev.ageGroups.filter(ag => ag !== ageGroup)
        : [...prev.ageGroups, ageGroup]
    }));
  };

  const handleLanguageToggle = (lang) => {
    setModuleData(prev => ({
      ...prev,
      language: prev.language.includes(lang)
        ? prev.language.filter(l => l !== lang)
        : [...prev.language, lang]
    }));
  };

  const handleLessonChange = (field, value) => {
    setNewLesson(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addLesson = () => {
    if (!newLesson.title || !newLesson.content) {
      alert('Please fill in lesson title and content URL');
      return;
    }

    if (editingLessonIndex !== null) {
      // Update existing lesson
      setLessons(prev => prev.map((lesson, index) => 
        index === editingLessonIndex ? { ...newLesson } : lesson
      ));
      setEditingLessonIndex(null);
    } else {
      // Add new lesson
      setLessons(prev => [...prev, { ...newLesson }]);
    }

    // Reset form
    setNewLesson({
      lessonNumber: lessons.length + 2,
      title: '',
      titleArabic: '',
      contentType: 'video',
      content: '',
      duration: 10,
      order: lessons.length + 2
    });
    setShowAddLesson(false);
    setSuccess('Lesson added! Remember to save changes.');
  };

  const editLesson = (index) => {
    setNewLesson(lessons[index]);
    setEditingLessonIndex(index);
    setShowAddLesson(true);
  };

  const deleteLesson = (index) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      setLessons(prev => prev.filter((_, i) => i !== index));
      // Renumber lessons
      setLessons(prev => prev.map((lesson, i) => ({
        ...lesson,
        lessonNumber: i + 1,
        order: i + 1
      })));
      setSuccess('Lesson deleted! Remember to save changes.');
    }
  };

  const cancelLessonEdit = () => {
    setShowAddLesson(false);
    setEditingLessonIndex(null);
    setNewLesson({
      lessonNumber: lessons.length + 1,
      title: '',
      titleArabic: '',
      contentType: 'video',
      content: '',
      duration: 10,
      order: lessons.length + 1
    });
  };

  const validateModule = () => {
    if (!moduleData.title.trim()) {
      setError('Module title is required');
      return false;
    }
    if (!moduleData.description.trim()) {
      setError('Module description is required');
      return false;
    }
    if (moduleData.ageGroups.length === 0) {
      setError('Please select at least one age group');
      return false;
    }
    if (!moduleData.topic.trim()) {
      setError('Topic is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateModule()) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Clean up empty array items
      const cleanedObjectives = moduleData.learningObjectives.filter(obj => obj.trim() !== '');
      const cleanedSkills = moduleData.skills.filter(skill => skill.trim() !== '');

      const updateData = {
        ...moduleData,
        learningObjectives: cleanedObjectives,
        skills: cleanedSkills,
        lessons: lessons // This should include all lessons with their full data
      };

      console.log('Sending update data:', updateData);
      console.log('Number of lessons:', lessons.length);

      const response = await learningAPI.update(moduleId, updateData);
      console.log('Update response:', response.data);
      
      setSuccess(`✅ Module updated successfully! ${lessons.length} lessons saved.`);
      
      // Refresh the module data after a short delay
      setTimeout(() => {
        fetchModule();
      }, 1500);
    } catch (error) {
      console.error('Error saving module:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to save module. Please try again.');
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate('/learning')}
              className="mb-4"
            >
              ← Back to Learning
            </Button>
            <h1 className="text-4xl font-bold text-gray-800">✏️ Edit Learning Module</h1>
            <p className="text-gray-600 mt-2">Modify content and settings for this learning module</p>
          </div>
          <Button
            size="lg"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Module Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card title="📝 Basic Information">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Module Title (English) *
                  </label>
                  <input
                    type="text"
                    value={moduleData.title}
                    onChange={(e) => handleModuleChange('title', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    placeholder="Introduction to Numbers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Module Title (Arabic)
                  </label>
                  <input
                    type="text"
                    value={moduleData.titleArabic}
                    onChange={(e) => handleModuleChange('titleArabic', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    placeholder="مقدمة للأرقام"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description (English) *
                  </label>
                  <textarea
                    value={moduleData.description}
                    onChange={(e) => handleModuleChange('description', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    rows="3"
                    placeholder="Learn counting, number recognition, and basic arithmetic"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description (Arabic)
                  </label>
                  <textarea
                    value={moduleData.descriptionArabic}
                    onChange={(e) => handleModuleChange('descriptionArabic', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    rows="3"
                    placeholder="تعلم العد والتعرف على الأرقام والحساب الأساسي"
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      value={moduleData.subject}
                      onChange={(e) => handleModuleChange('subject', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    >
                      <option value="math">Math</option>
                      <option value="science">Science</option>
                      <option value="language">Language</option>
                      <option value="coding">Coding</option>
                      <option value="physics">Physics</option>
                      <option value="chemistry">Chemistry</option>
                      <option value="social-studies">Social Studies</option>
                      <option value="arts">Arts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Topic *
                    </label>
                    <input
                      type="text"
                      value={moduleData.topic}
                      onChange={(e) => handleModuleChange('topic', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="e.g., numbers, alphabet, basics"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Grade Level
                  </label>
                  <input
                    type="text"
                    value={moduleData.gradeLevel}
                    onChange={(e) => handleModuleChange('gradeLevel', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    placeholder="Grade 1, Grade 2, etc."
                  />
                </div>
              </div>
            </Card>

            {/* Classification */}
            <Card title="🎯 Classification">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age Groups * (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['3-5', '6-8', '9-12'].map(age => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => handleAgeGroupToggle(age)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          moduleData.ageGroups.includes(age)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {age} years
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    value={moduleData.difficulty}
                    onChange={(e) => handleModuleChange('difficulty', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Languages (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { code: 'en', name: 'English' },
                      { code: 'ar', name: 'Arabic' }
                    ].map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageToggle(lang.code)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          moduleData.language.includes(lang.code)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Learning Objectives */}
            <Card title="🎓 Learning Objectives">
              <div className="space-y-3">
                {moduleData.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleArrayFieldChange('learningObjectives', index, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="e.g., Master basic addition"
                    />
                    {moduleData.learningObjectives.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeArrayField('learningObjectives', index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => addArrayField('learningObjectives')}
                >
                  + Add Objective
                </Button>
              </div>
            </Card>

            {/* Skills */}
            <Card title="💡 Skills Developed">
              <div className="space-y-3">
                {moduleData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayFieldChange('skills', index, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="e.g., problem-solving, counting"
                    />
                    {moduleData.skills.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeArrayField('skills', index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => addArrayField('skills')}
                >
                  + Add Skill
                </Button>
              </div>
            </Card>

            {/* Lessons */}
            <Card title="📚 Lessons">
              <div className="space-y-4">
                {lessons.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No lessons added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-bold">
                                Lesson {lesson.lessonNumber}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                {lesson.contentType}
                              </span>
                              <span className="text-sm text-gray-500">
                                {lesson.duration} min
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-800 mb-1">{lesson.title}</h4>
                            {lesson.titleArabic && (
                              <p className="text-sm text-gray-600 mb-2" dir="rtl">{lesson.titleArabic}</p>
                            )}
                            <p className="text-sm text-gray-500 break-all">{lesson.content}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => editLesson(index)}
                            >
                              ✏️
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deleteLesson(index)}
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!showAddLesson && (
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => setShowAddLesson(true)}
                  >
                    + Add New Lesson
                  </Button>
                )}

                {/* Add/Edit Lesson Form */}
                {showAddLesson && (
                  <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <h4 className="font-bold text-gray-800 mb-4">
                      {editingLessonIndex !== null ? 'Edit Lesson' : 'Add New Lesson'}
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Lesson Number
                          </label>
                          <input
                            type="number"
                            value={newLesson.lessonNumber}
                            onChange={(e) => handleLessonChange('lessonNumber', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Duration (minutes)
                          </label>
                          <input
                            type="number"
                            value={newLesson.duration}
                            onChange={(e) => handleLessonChange('duration', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            min="1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Lesson Title (English) *
                        </label>
                        <input
                          type="text"
                          value={newLesson.title}
                          onChange={(e) => handleLessonChange('title', e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="Counting 1-10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Lesson Title (Arabic)
                        </label>
                        <input
                          type="text"
                          value={newLesson.titleArabic}
                          onChange={(e) => handleLessonChange('titleArabic', e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="العد 1-10"
                          dir="rtl"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Content Type *
                        </label>
                        <select
                          value={newLesson.contentType}
                          onChange={(e) => handleLessonChange('contentType', e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                          <option value="video">Video</option>
                          <option value="interactive">Interactive</option>
                          <option value="text">Text/Reading</option>
                          <option value="quiz">Quiz</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Content URL/Link *
                        </label>
                        <input
                          type="url"
                          value={newLesson.content}
                          onChange={(e) => handleLessonChange('content', e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Provide the full URL to the {newLesson.contentType} content
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          fullWidth
                          onClick={addLesson}
                        >
                          {editingLessonIndex !== null ? 'Update Lesson' : 'Add Lesson'}
                        </Button>
                        <Button
                          fullWidth
                          variant="secondary"
                          onClick={cancelLessonEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar - Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Gamification Settings */}
            <Card title="🎮 Gamification">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Points Per Lesson
                  </label>
                  <input
                    type="number"
                    value={moduleData.pointsPerLesson}
                    onChange={(e) => handleModuleChange('pointsPerLesson', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Completion Points
                  </label>
                  <input
                    type="number"
                    value={moduleData.completionPoints}
                    onChange={(e) => handleModuleChange('completionPoints', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    min="0"
                  />
                </div>
              </div>
            </Card>

            {/* Quiz Settings */}
            <Card title="📝 Quiz Settings">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">
                    Has Final Quiz
                  </label>
                  <button
                    type="button"
                    onClick={() => handleModuleChange('hasQuiz', !moduleData.hasQuiz)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      moduleData.hasQuiz ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        moduleData.hasQuiz ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {moduleData.hasQuiz && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      value={moduleData.passingScore}
                      onChange={(e) => handleModuleChange('passingScore', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      min="0"
                      max="100"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Module Statistics */}
            <Card title="📊 Module Statistics">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Lessons</span>
                  <span className="font-bold text-gray-800">{lessons.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Duration</span>
                  <span className="font-bold text-gray-800">
                    {lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)} min
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Max Points</span>
                  <span className="font-bold text-purple-600">
                    {(lessons.length * moduleData.pointsPerLesson) + moduleData.completionPoints}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card title="⚡ Quick Actions">
              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={() => navigate(`/learning/${moduleId}`)}
                >
                  👁️ Preview Module
                </Button>
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to discard all changes?')) {
                      fetchModule();
                      setShowAddLesson(false);
                      setEditingLessonIndex(null);
                      setSuccess('');
                      setError('');
                    }
                  }}
                >
                  🔄 Discard Changes
                </Button>
              </div>
            </Card>

            {/* Help Section */}
            <Card title="💡 Tips">
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Make sure to save after making changes</p>
                <p>• Add clear learning objectives for better engagement</p>
                <p>• Use a mix of content types (video, interactive, etc.)</p>
                <p>• Test all lesson links before publishing</p>
                <p>• Set appropriate difficulty levels for age groups</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLearningModulePage;