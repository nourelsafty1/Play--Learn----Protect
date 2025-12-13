// backend/scripts/seedData.js

require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('../src/models/Game');
const LearningModule = require('../src/models/LearningModule');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Sample Games
// Sample Games with REAL game URLs
const sampleGames = [
  {
    title: 'Math Adventure',
    titleArabic: 'مغامرة الرياضيات',
    description: 'Learn addition and subtraction through exciting adventures!',
    descriptionArabic: 'تعلم الجمع والطرح من خلال مغامرات مثيرة!',
    category: 'math',
    type: 'serious',
    ageGroups: ['6-8', '9-12'],
    difficulty: 'beginner',
    thumbnail: 'math-game',
    gameUrl: 'https://www.mathplayground.com/addition_blocks.html',
    learningObjectives: [
      'Master basic addition',
      'Learn subtraction',
      'Solve word problems'
    ],
    skills: ['problem-solving', 'arithmetic', 'logic'],
    pointsPerCompletion: 100,
    duration: 15,
    hasLevels: true,
    numberOfLevels: 5,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    isFeatured: true,
    contentRating: '6+',
    safetyChecked: true
  },
  {
    title: 'Word Builder',
    titleArabic: 'بناء الكلمات',
    description: 'Build your vocabulary with fun word puzzles!',
    descriptionArabic: 'بناء المفردات الخاصة بك مع الألغاز كلمة متعة!',
    category: 'language',
    type: 'serious',
    ageGroups: ['3-5', '6-8'],
    difficulty: 'beginner',
    thumbnail: 'word-game',
    gameUrl: 'https://www.abcya.com/games/alphabet_arcade',
    learningObjectives: [
      'Learn new words',
      'Improve spelling',
      'Build sentences'
    ],
    skills: ['vocabulary', 'spelling', 'reading'],
    pointsPerCompletion: 80,
    duration: 10,
    hasLevels: true,
    numberOfLevels: 3,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    contentRating: 'everyone',
    safetyChecked: true
  },
  {
    title: 'Coding Quest',
    titleArabic: 'مهمة البرمجة',
    description: 'Learn the basics of coding through interactive challenges!',
    descriptionArabic: 'تعلم أساسيات البرمجة من خلال التحديات التفاعلية!',
    category: 'coding',
    type: 'serious',
    ageGroups: ['9-12'],
    difficulty: 'intermediate',
    thumbnail: 'coding-game',
    gameUrl: 'https://blockly.games/maze?lang=en',
    learningObjectives: [
      'Understand basic programming concepts',
      'Learn loops and conditions',
      'Create simple programs'
    ],
    skills: ['coding', 'logic', 'problem-solving'],
    pointsPerCompletion: 150,
    duration: 20,
    hasLevels: true,
    numberOfLevels: 8,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    isFeatured: true,
    contentRating: '9+',
    safetyChecked: true
  },
  {
    title: 'Science Lab',
    titleArabic: 'مختبر العلوم',
    description: 'Explore science through fun experiments!',
    descriptionArabic: 'استكشف العلوم من خلال التجارب الممتعة!',
    category: 'science',
    type: 'serious',
    ageGroups: ['6-8', '9-12'],
    difficulty: 'intermediate',
    thumbnail: 'science-game',
    gameUrl: 'https://www.sciencekids.co.nz/gamesactivities/planetsandmoons.html',
    learningObjectives: [
      'Learn scientific method',
      'Conduct virtual experiments',
      'Understand basic physics'
    ],
    skills: ['scientific-thinking', 'observation', 'analysis'],
    pointsPerCompletion: 120,
    duration: 18,
    hasLevels: true,
    numberOfLevels: 6,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    contentRating: '6+',
    safetyChecked: true
  },
  {
    title: 'Creative Canvas',
    titleArabic: 'لوحة الإبداع',
    description: 'Express yourself through digital art and creativity!',
    descriptionArabic: 'عبر عن نفسك من خلال الفن الرقمي والإبداع!',
    category: 'creative',
    type: 'creative',
    ageGroups: ['3-5', '6-8', '9-12'],
    difficulty: 'beginner',
    thumbnail: 'art-game',
    gameUrl: 'https://www.abcya.com/games/paint',
    learningObjectives: [
      'Express creativity',
      'Learn colors and shapes',
      'Develop artistic skills'
    ],
    skills: ['creativity', 'art', 'self-expression'],
    pointsPerCompletion: 90,
    duration: 15,
    hasLevels: false,
    numberOfLevels: 1,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    contentRating: 'everyone',
    safetyChecked: true
  }
];

// Sample Learning Modules
const sampleModules = [
  {
    title: 'Introduction to Numbers',
    titleArabic: 'مقدمة للأرقام',
    description: 'Learn counting, number recognition, and basic arithmetic',
    descriptionArabic: 'تعلم العد والتعرف على الأرقام والحساب الأساسي',
    subject: 'math',
    topic: 'numbers',
    ageGroups: ['3-5', '6-8'],
    difficulty: 'beginner',
    thumbnail: 'numbers',
    lessons: [
      {
        lessonNumber: 1,
        title: 'Counting 1-10',
        titleArabic: 'العد 1-10',
        contentType: 'video',
        content: 'https://www.youtube.com/watch?v=DR-cfDsHCGA',
        duration: 10,
        order: 1
      },
      {
        lessonNumber: 2,
        title: 'Number Recognition',
        titleArabic: 'التعرف على الأرقام',
        contentType: 'interactive',
        content: 'https://www.abcya.com/games/number_bingo',
        duration: 15,
        order: 2
      },
      {
        lessonNumber: 3,
        title: 'Simple Addition',
        titleArabic: 'الجمع البسيط',
        contentType: 'interactive',
        content: 'https://www.mathplayground.com/addition_blocks.html',
        duration: 12,
        order: 3
      }
    ],
    learningObjectives: [
      'Count from 1 to 10',
      'Recognize written numbers',
      'Perform simple addition'
    ],
    skills: ['counting', 'number-recognition', 'addition'],
    pointsPerLesson: 50,
    completionPoints: 200,
    hasQuiz: true,
    passingScore: 70,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true
  },
  {
    title: 'English Alphabet',
    titleArabic: 'الأبجدية الإنجليزية',
    description: 'Master the English alphabet with fun activities',
    descriptionArabic: 'اتقن الأبجدية الإنجليزية مع الأنشطة الممتعة',
    subject: 'language',
    topic: 'alphabet',
    ageGroups: ['3-5', '6-8'],
    difficulty: 'beginner',
    thumbnail: 'alphabet',
    lessons: [
      {
        lessonNumber: 1,
        title: 'Letters A-G',
        titleArabic: 'الحروف أ-ز',
        contentType: 'video',
        content: 'https://www.youtube.com/watch?v=BELlZKpi1Zs',
        duration: 12,
        order: 1
      },
      {
        lessonNumber: 2,
        title: 'Letters H-N',
        titleArabic: 'الحروف ح-ن',
        contentType: 'interactive',
        content: 'https://www.abcya.com/games/alphabet_arcade',
        duration: 12,
        order: 2
      },
      {
        lessonNumber: 3,
        title: 'Letters O-Z',
        titleArabic: 'الحروف و-ي',
        contentType: 'interactive',
        content: 'https://www.starfall.com/h/abcs/',
        duration: 12,
        order: 3
      },
      {
        lessonNumber: 4,
        title: 'Practice Test',
        titleArabic: 'اختبار الممارسة',
        contentType: 'quiz',
        content: 'https://www.abcya.com/games/letter_recognition',
        duration: 15,
        order: 4
      }
    ],
    learningObjectives: [
      'Recognize all letters',
      'Know letter sounds',
      'Write letters correctly'
    ],
    skills: ['alphabet', 'phonics', 'writing'],
    pointsPerLesson: 40,
    completionPoints: 180,
    hasQuiz: true,
    passingScore: 75,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    isFeatured: true
  },
  {
    title: 'Coding Basics',
    titleArabic: 'أساسيات البرمجة',
    description: 'Introduction to programming concepts for beginners',
    descriptionArabic: 'مقدمة في مفاهيم البرمجة للمبتدئين',
    subject: 'coding',
    topic: 'basics',
    ageGroups: ['9-12'],
    difficulty: 'beginner',
    thumbnail: 'coding',
    lessons: [
      {
        lessonNumber: 1,
        title: 'What is Programming?',
        titleArabic: 'ما هي البرمجة؟',
        contentType: 'video',
        content: 'https://www.youtube.com/watch?v=cda3_5982h8',
        duration: 20,
        order: 1
      },
      {
        lessonNumber: 2,
        title: 'Your First Code',
        titleArabic: 'الكود الأول الخاص بك',
        contentType: 'interactive',
        content: 'https://studio.code.org/s/course1',
        duration: 25,
        order: 2
      },
      {
        lessonNumber: 3,
        title: 'Loops and Conditions',
        titleArabic: 'الحلقات والشروط',
        contentType: 'interactive',
        content: 'https://blockly.games/maze?lang=en',
        duration: 30,
        order: 3
      },
      {
        lessonNumber: 4,
        title: 'Final Project',
        titleArabic: 'المشروع النهائي',
        contentType: 'interactive',
        content: 'https://scratch.mit.edu/projects/editor/',
        duration: 35,
        order: 4
      }
    ],
    learningObjectives: [
      'Understand programming basics',
      'Write simple code',
      'Use loops and conditions'
    ],
    skills: ['coding', 'logic', 'problem-solving'],
    pointsPerLesson: 60,
    completionPoints: 300,
    hasQuiz: true,
    passingScore: 80,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    isFeatured: true
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Dropping Game indexes...');
    try {
      await Game.collection.dropIndexes();
      console.log('✅ Game indexes dropped');
    } catch (err) {
      console.log('No Game indexes to drop');
    }

    console.log('Clearing existing games...');
    await Game.deleteMany({});

    console.log('Adding sample games...');
    await Game.insertMany(sampleGames);
    console.log(`✅ Added ${sampleGames.length} games`);

    console.log('\nDropping LearningModule indexes...');
    try {
      await LearningModule.collection.dropIndexes();
      console.log('✅ LearningModule indexes dropped');
    } catch (err) {
      console.log('No LearningModule indexes to drop');
    }

    console.log('Clearing existing learning modules...');
    await LearningModule.deleteMany({});

    console.log('Adding sample learning modules...');
    await LearningModule.insertMany(sampleModules);
    console.log(`✅ Added ${sampleModules.length} learning modules`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed
seedDatabase();