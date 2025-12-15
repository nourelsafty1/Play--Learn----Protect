// src/pages/CreateLearningModulePage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { learningAPI } from '../services/api';

const CreateLearningModulePage = () => {
    const navigate = useNavigate();
    const { moduleId } = useParams();
    const { user } = useAuth();

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('basic'); // basic, learning, lessons

    // Module data
    const [moduleData, setModuleData] = useState({
        title: '',
        titleArabic: '',
        description: '',
        descriptionArabic: '',
        subject: 'Maths',
        topic: '',
        ageGroups: [],
        gradeLevel: '',
        difficulty: 'beginner',
        learningObjectives: [''],
        learningObjectivesArabic: [''],
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
            alert('Access denied. Only teachers can create modules.');
            navigate('/learning');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (moduleId) {
            fetchModuleData();
        }
    }, [moduleId]);

    const fetchModuleData = async () => {
        try {
            const response = await learningAPI.getOne(moduleId);
            const data = response.data.data;
            setModuleData({
                title: data.title || '',
                titleArabic: data.titleArabic || '',
                description: data.description || '',
                descriptionArabic: data.descriptionArabic || '',
                subject: data.subject || 'Maths',
                topic: data.topic || '',
                ageGroups: data.ageGroups || [],
                gradeLevel: data.gradeLevel || '',
                difficulty: data.difficulty || 'beginner',
                learningObjectives: data.learningObjectives || [''],
                learningObjectivesArabic: data.learningObjectivesArabic || [''],
                skills: data.skills || [''],
                pointsPerLesson: data.pointsPerLesson || 50,
                completionPoints: data.completionPoints || 200,
                hasQuiz: data.hasQuiz || false,
                passingScore: data.passingScore || 70,
                language: data.language || ['ar', 'en']
            });
            setLessons(data.lessons || []);
        } catch (error) {
            console.error('Error fetching module:', error);
            setError('Failed to fetch module details');
        }
    };

    const handleModuleChange = (field, value) => {
        setModuleData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
    };

    const handleArrayFieldChange = (field, index, value) => {
        setModuleData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayField = (field) => {
        setModuleData(prev => {
            if (field === 'learningObjectives') {
                return {
                    ...prev,
                    learningObjectives: [...prev.learningObjectives, ''],
                    learningObjectivesArabic: [...prev.learningObjectivesArabic, '']
                };
            }
            return {
                ...prev,
                [field]: [...prev[field], '']
            };
        });
    };

    const removeArrayField = (field, index) => {
        setModuleData(prev => {
            if (field === 'learningObjectives') {
                return {
                    ...prev,
                    learningObjectives: prev.learningObjectives.filter((_, i) => i !== index),
                    learningObjectivesArabic: prev.learningObjectivesArabic.filter((_, i) => i !== index)
                };
            }
            return {
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index)
            };
        });
    };

    const handleAgeGroupToggle = (ageGroup) => {
        setModuleData(prev => ({
            ...prev,
            ageGroups: prev.ageGroups.includes(ageGroup)
                ? prev.ageGroups.filter(ag => ag !== ageGroup)
                : [...prev.ageGroups, ageGroup]
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
            setLessons(prev => prev.map((lesson, index) =>
                index === editingLessonIndex ? { ...newLesson } : lesson
            ));
            setEditingLessonIndex(null);
        } else {
            setLessons(prev => [...prev, { ...newLesson }]);
        }

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
    };

    const deleteLesson = (index) => {
        setLessons(prev => prev.filter((_, i) => i !== index));
    };

    const editLesson = (index) => {
        setNewLesson(lessons[index]);
        setEditingLessonIndex(index);
        setShowAddLesson(true);
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
        return true;
    };

    const handleCreate = async () => {
        if (!validateModule()) return;

        setSaving(true);
        setError('');

        try {
            const payload = {
                ...moduleData,
                learningObjectives: moduleData.learningObjectives.filter(obj => obj.trim() !== ''),
                learningObjectivesArabic: moduleData.learningObjectivesArabic.filter(obj => obj.trim() !== ''),
                skills: moduleData.skills.filter(skill => skill.trim() !== ''),
                isPublished: true,
                isActive: true,
                lessons
            };

            if (moduleId) {
                await learningAPI.update(moduleId, payload);
                setSuccess('✅ Module updated successfully! You can continue editing.');
                // Don't redirect after update
                setTimeout(() => setSuccess(''), 3000); // Clear success message after 3s
            } else {
                await learningAPI.create(payload);
                setSuccess('✅ Module created successfully!');
                setTimeout(() => navigate('/learning'), 1500);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save module');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Button variant="secondary" size="sm" onClick={() => navigate('/learning')} className="mb-2">
                            ← Back
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-800">{moduleId ? '✏️ Edit Module' : '✨ Create New Module'}</h1>
                        <p className="text-gray-600">{moduleId ? 'Update existing course details' : 'Design a new course for your students'}</p>
                    </div>
                    <Button size="lg" onClick={handleCreate} disabled={saving}>
                        {saving ? (moduleId ? 'Updating...' : 'Creating...') : (moduleId ? '💾 Save Changes' : '🚀 Publish Module')}
                    </Button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-2">
                        <div
                            className={`p-4 rounded-lg cursor-pointer ${activeTab === 'basic' ? 'bg-purple-100 border-2 border-purple-500' : 'bg-white'}`}
                            onClick={() => setActiveTab('basic')}
                        >
                            <h3 className="font-bold">1. Basic Info</h3>
                            <p className="text-xs text-gray-500">Title, Subject, Age</p>
                        </div>
                        <div
                            className={`p-4 rounded-lg cursor-pointer ${activeTab === 'learning' ? 'bg-purple-100 border-2 border-purple-500' : 'bg-white'}`}
                            onClick={() => setActiveTab('learning')}
                        >
                            <h3 className="font-bold">2. Objectives</h3>
                            <p className="text-xs text-gray-500">What will they learn?</p>
                        </div>
                        <div
                            className={`p-4 rounded-lg cursor-pointer ${activeTab === 'lessons' ? 'bg-purple-100 border-2 border-purple-500' : 'bg-white'}`}
                            onClick={() => setActiveTab('lessons')}
                        >
                            <h3 className="font-bold">3. Lessons ({lessons.length})</h3>
                            <p className="text-xs text-gray-500">Add course content</p>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        {activeTab === 'basic' && (
                            <Card title="Module Details">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Title (English)</label>
                                        <input
                                            className="w-full border-2 border-gray-200 rounded-lg p-2"
                                            value={moduleData.title}
                                            onChange={(e) => handleModuleChange('title', e.target.value)}
                                            placeholder="e.g. Advanced Algebra"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Title (Arabic)</label>
                                        <input
                                            className="w-full border-2 border-gray-200 rounded-lg p-2 text-right"
                                            value={moduleData.titleArabic}
                                            onChange={(e) => handleModuleChange('titleArabic', e.target.value)}
                                            placeholder="Example Title Arabic"
                                            dir="rtl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Description (English)</label>
                                        <textarea
                                            className="w-full border-2 border-gray-200 rounded-lg p-2"
                                            rows="3"
                                            value={moduleData.description}
                                            onChange={(e) => handleModuleChange('description', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Description (Arabic)</label>
                                        <textarea
                                            className="w-full border-2 border-gray-200 rounded-lg p-2 text-right"
                                            rows="3"
                                            value={moduleData.descriptionArabic}
                                            onChange={(e) => handleModuleChange('descriptionArabic', e.target.value)}
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Subject</label>
                                            <select
                                                className="w-full border-2 border-gray-200 rounded-lg p-2"
                                                value={moduleData.subject}
                                                onChange={(e) => handleModuleChange('subject', e.target.value)}
                                            >
                                                <option value="Maths">Maths</option>
                                                <option value="Science">Science</option>
                                                <option value="English">English</option>
                                                <option value="Arabic">Arabic</option>
                                                <option value="Coding">Coding</option>
                                                <option value="Physics">Physics</option>
                                                <option value="Chemistry">Chemistry</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Topic</label>
                                            <input
                                                className="w-full border-2 border-gray-200 rounded-lg p-2"
                                                value={moduleData.topic}
                                                onChange={(e) => handleModuleChange('topic', e.target.value)}
                                                placeholder="e.g. Algebra"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Difficulty</label>
                                            <select
                                                className="w-full border-2 border-gray-200 rounded-lg p-2"
                                                value={moduleData.difficulty}
                                                onChange={(e) => handleModuleChange('difficulty', e.target.value)}
                                            >
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Age Groups</label>
                                        <div className="flex gap-2">
                                            {['3-5', '6-8', '9-12'].map(age => (
                                                <button
                                                    key={age}
                                                    className={`px-3 py-1 rounded-full text-sm font-bold ${moduleData.ageGroups.includes(age) ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                                                    onClick={() => handleAgeGroupToggle(age)}
                                                >
                                                    {age}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'learning' && (
                            <Card title="Learning Objectives">
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-500">What skills will students gain?</p>
                                    {moduleData.learningObjectives.map((obj, i) => (
                                        <div key={i} className="flex gap-2 items-start">
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                <input
                                                    className="w-full border-2 border-gray-200 rounded-lg p-2"
                                                    value={obj}
                                                    onChange={(e) => handleArrayFieldChange('learningObjectives', i, e.target.value)}
                                                    placeholder="Objective (English)"
                                                />
                                                <input
                                                    className="w-full border-2 border-gray-200 rounded-lg p-2 text-right"
                                                    value={moduleData.learningObjectivesArabic[i] || ''}
                                                    onChange={(e) => handleArrayFieldChange('learningObjectivesArabic', i, e.target.value)}
                                                    placeholder="Objective (Arabic)"
                                                    dir="rtl"
                                                />
                                            </div>
                                            <button onClick={() => removeArrayField('learningObjectives', i)} className="text-red-500 font-bold p-2">✕</button>
                                        </div>
                                    ))}
                                    <Button size="sm" variant="secondary" onClick={() => addArrayField('learningObjectives')}>+ Add Objective</Button>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'lessons' && (
                            <div className="space-y-4">
                                {lessons.map((lesson, i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                                        <div>
                                            <span className="font-bold text-purple-600 mr-2">#{i + 1}</span>
                                            <span className="font-semibold">{lesson.title}</span>
                                            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{lesson.contentType}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => editLesson(i)}>✏️</Button>
                                            <Button size="sm" variant="danger" onClick={() => deleteLesson(i)}>🗑️</Button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setShowAddLesson(true)}
                                    className="w-full py-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 font-bold hover:bg-purple-50"
                                >
                                    + Add New Lesson
                                </button>

                                {showAddLesson && (
                                    <Card className="mt-4 border-2 border-blue-200 bg-blue-50">
                                        <h3 className="font-bold mb-4">{editingLessonIndex !== null ? 'Edit Lesson' : 'New Lesson Details'}</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    className="w-full border border-gray-300 rounded p-2"
                                                    placeholder="Lesson Title (English)"
                                                    value={newLesson.title}
                                                    onChange={(e) => handleLessonChange('title', e.target.value)}
                                                />
                                                <input
                                                    className="w-full border border-gray-300 rounded p-2 text-right"
                                                    placeholder="Lesson Title (Arabic)"
                                                    value={newLesson.titleArabic}
                                                    onChange={(e) => handleLessonChange('titleArabic', e.target.value)}
                                                    dir="rtl"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <select
                                                    className="w-full border border-gray-300 rounded p-2"
                                                    value={newLesson.contentType}
                                                    onChange={(e) => handleLessonChange('contentType', e.target.value)}
                                                >
                                                    <option value="video">Video</option>
                                                    <option value="quiz">Quiz</option>
                                                    <option value="interactive">Interactive</option>
                                                    <option value="game">Game</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    className="w-full border border-gray-300 rounded p-2"
                                                    placeholder="Duration (min)"
                                                    value={newLesson.duration}
                                                    onChange={(e) => handleLessonChange('duration', e.target.value)}
                                                />
                                            </div>
                                            <input
                                                className="w-full border border-gray-300 rounded p-2"
                                                placeholder="Content URL (e.g. YouTube link)"
                                                value={newLesson.content}
                                                onChange={(e) => handleLessonChange('content', e.target.value)}
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <Button fullWidth onClick={addLesson}>Save Lesson</Button>
                                                <Button fullWidth variant="danger" onClick={() => setShowAddLesson(false)}>Cancel</Button>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between mt-6">
                            <Button disabled={activeTab === 'basic'} variant="secondary" onClick={() => {
                                if (activeTab === 'lessons') setActiveTab('learning');
                                if (activeTab === 'learning') setActiveTab('basic');
                            }}>Previous</Button>

                            <Button disabled={activeTab === 'lessons'} variant="secondary" onClick={() => {
                                if (activeTab === 'basic') setActiveTab('learning');
                                if (activeTab === 'learning') setActiveTab('lessons');
                            }}>Next Step →</Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateLearningModulePage;
