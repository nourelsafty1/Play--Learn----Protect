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

// Sample Games - All Self-Hosted for Full Tracking
const sampleGames = [
  {
    title: 'Maths Adventure',
    titleArabic: 'مغامرة الرياضيات',
    description: 'Learn addition and subtraction through exciting adventures!',
    descriptionArabic: 'تعلم الجمع والطرح من خلال مغامرات مثيرة!',
    category: 'Maths',
    type: 'serious',
    ageGroups: ['6-8', '9-12'],
    difficulty: 'beginner',
    thumbnail: 'https://via.placeholder.com/300x200?text=Math+Game',
    gameUrl: '/games/math-addition-game.html',
    gameType: 'self-hosted',
    learningObjectives: [
      'Master basic addition',
      'Learn subtraction',
      'Solve word problems',
      'Practice mental math'
    ],
    learningObjectivesArabic: [
      'إتقان الجمع الأساسي',
      'تعلم الطرح',
      'حل المسائل اللفظية',
      'ممارسة الحساب الذهني'
    ],
    skills: ['problem-solving', 'arithmetic', 'logic', 'mental-math'],
    skillsArabic: ['حل المشكلات', 'الحساب', 'المنطق', 'الحساب الذهني'],
    pointsPerCompletion: 100,
    bonusPoints: 50,
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
    category: 'English',
    type: 'serious',
    ageGroups: ['3-5', '6-8'],
    difficulty: 'beginner',
    thumbnail: 'https://via.placeholder.com/300x200?text=Word+Game',
    gameUrl: '/games/english-word-game.html',
    gameType: 'self-hosted',
    learningObjectives: [
      'Learn new words',
      'Improve spelling',
      'Build sentences',
      'Enhance vocabulary'
    ],
    learningObjectivesArabic: [
      'تعلم كلمات جديدة',
      'تحسين الإملاء',
      'بناء الجمل',
      'تعزيز المفردات'
    ],
    skills: ['vocabulary', 'spelling', 'reading', 'language'],
    skillsArabic: ['المفردات', 'الإملاء', 'القراءة', 'اللغة'],
    pointsPerCompletion: 80,
    bonusPoints: 40,
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
    category: 'Coding',
    type: 'serious',
    ageGroups: ['9-12'],
    difficulty: 'intermediate',
    thumbnail: 'https://via.placeholder.com/300x200?text=Coding+Game',
    gameUrl: '/games/coding-sequence-game.html',
    gameType: 'self-hosted',
    learningObjectives: [
      'Understand basic programming concepts',
      'Learn sequences and commands',
      'Create simple programs',
      'Develop logical thinking'
    ],
    learningObjectivesArabic: [
      'فهم أساسيات البرمجة',
      'تعلم التسلسل والأوامر',
      'إنشاء برامج بسيطة',
      'تطوير التفكير المنطقي'
    ],
    skills: ['coding', 'logic', 'problem-solving', 'sequences'],
    skillsArabic: ['البرمجة', 'المنطق', 'حل المشكلات', 'التسلسل'],
    pointsPerCompletion: 150,
    bonusPoints: 75,
    duration: 20,
    hasLevels: true,
    numberOfLevels: 5,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    isFeatured: true,
    contentRating: '9+',
    safetyChecked: true
  },
  {
    title: 'Physics Forces',
    titleArabic: 'قوى الفيزياء',
    description: 'Learn about forces, motion, and physics through interactive questions!',
    descriptionArabic: 'تعلم عن القوى والحركة والفيزياء من خلال الأسئلة التفاعلية!',
    category: 'Physics',
    type: 'serious',
    ageGroups: ['6-8', '9-12'],
    difficulty: 'intermediate',
    thumbnail: 'https://via.placeholder.com/300x200?text=Physics+Game',
    gameUrl: '/games/physics-forces-game.html',
    gameType: 'self-hosted',
    learningObjectives: [
      'Understand forces and motion',
      'Learn about gravity',
      'Understand friction',
      'Explore physics concepts'
    ],
    learningObjectivesArabic: [
      'فهم القوى والحركة',
      'تعلم عن الجاذبية',
      'فهم الاحتكاك',
      'استكشاف مفاهيم الفيزياء'
    ],
    skills: ['scientific-thinking', 'physics', 'observation', 'analysis'],
    skillsArabic: ['التفكير العلمي', 'الفيزياء', 'الملاحظة', 'التحليل'],
    pointsPerCompletion: 120,
    bonusPoints: 60,
    duration: 15,
    hasLevels: true,
    numberOfLevels: 5,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    contentRating: '6+',
    safetyChecked: true
  },
  {
    title: 'Chemistry Elements',
    titleArabic: 'عناصر الكيمياء',
    description: 'Learn about chemical elements and their symbols!',
    descriptionArabic: 'تعلم عن العناصر الكيميائية ورموزها!',
    category: 'Chemistry',
    type: 'serious',
    ageGroups: ['9-12'],
    difficulty: 'intermediate',
    thumbnail: 'https://via.placeholder.com/300x200?text=Chemistry+Game',
    gameUrl: '/games/chemistry-elements-game.html',
    gameType: 'self-hosted',
    learningObjectives: [
      'Learn chemical elements',
      'Understand element symbols',
      'Recognize common elements',
      'Build chemistry knowledge'
    ],
    learningObjectivesArabic: [
      'تعلم العناصر الكيميائية',
      'فهم رموز العناصر',
      'التعرف على العناصر الشائعة',
      'بناء المعرفة الكيميائية'
    ],
    skills: ['chemistry', 'memory', 'recognition', 'science'],
    skillsArabic: ['الكيمياء', 'الذاكرة', 'التعرف', 'العلوم'],
    pointsPerCompletion: 130,
    bonusPoints: 65,
    duration: 12,
    hasLevels: true,
    numberOfLevels: 5,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    contentRating: '9+',
    safetyChecked: true
  },
  {
    title: 'Creative Canvas',
    titleArabic: 'لوحة الإبداع',
    description: 'Express yourself through digital art and creativity!',
    descriptionArabic: 'عبر عن نفسك من خلال الفن الرقمي والإبداع!',
    category: 'Creativity',
    type: 'creative',
    ageGroups: ['3-5', '6-8', '9-12'],
    difficulty: 'beginner',
    thumbnail: 'https://via.placeholder.com/300x200?text=Art+Game',
    gameUrl: '/games/creative-art-game.html',
    gameType: 'self-hosted',
    learningObjectives: [
      'Express creativity',
      'Learn colors and shapes',
      'Develop artistic skills',
      'Apply knowledge creatively'
    ],
    learningObjectivesArabic: [
      'التعبير عن الإبداع',
      'تعلم الألوان والأشكال',
      'تطوير المهارات الفنية',
      'تطبيق المعرفة بشكل إبداعي'
    ],
    skills: ['creativity', 'art', 'self-expression', 'imagination'],
    skillsArabic: ['الإبداع', 'الفن', 'التعبير عن الذات', 'الخيال'],
    pointsPerCompletion: 90,
    bonusPoints: 45,
    duration: 15,
    hasLevels: false,
    numberOfLevels: 1,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    contentRating: 'everyone',
    safetyChecked: true
  },
  {
    title: 'Advanced Coding Challenge',
    titleArabic: 'تحدي البرمجة المتقدم',
    description: 'Master advanced programming concepts with challenging puzzles and earn bonus points!',
    descriptionArabic: 'أتقن مفاهيم البرمجة المتقدمة مع الألغاز الصعبة واكسب نقاط إضافية!',
    category: 'Coding',
    type: 'serious',
    ageGroups: ['9-12'],
    difficulty: 'advanced',
    thumbnail: 'https://via.placeholder.com/300x200?text=Advanced+Coding',
    gameUrl: '/games/coding-challenge-advanced.html',
    gameType: 'self-hosted',
    learningObjectives: [
      'Master loops and nested loops',
      'Understand conditional logic',
      'Optimize code for efficiency',
      'Solve complex programming challenges',
      'Learn algorithm optimization'
    ],
    learningObjectivesArabic: [
      'إتقان الحلقات المتداخلة',
      'فهم المنطق الشرطي',
      'تحسين الكود للكفاءة',
      'حل تحديات البرمجة المعقدة',
      'تعلم تحسين الخوارزميات'
    ],
    skills: ['advanced-coding', 'algorithm-design', 'optimization', 'problem-solving', 'logical-thinking'],
    skillsArabic: ['البرمجة المتقدمة', 'تصميم الخوارزميات', 'التحسين', 'حل المشكلات', 'التفكير المنطقي'],
    pointsPerCompletion: 300,
    bonusPoints: 150, // High bonus for optimal solutions
    duration: 25,
    hasLevels: true,
    numberOfLevels: 5,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    isFeatured: true,
    contentRating: '9+',
    safetyChecked: true
  },
  {
    title: 'Arabic Alphabet Adventure',
    titleArabic: 'مغامرة الحروف العربية',
    description: 'Learn the Arabic alphabet through fun, interactive games! Perfect for beginners.',
    descriptionArabic: 'تعلم الحروف العربية من خلال ألعاب تفاعلية ممتعة! مثالي للمبتدئين.',
    category: 'Arabic',
    type: 'serious',
    ageGroups: ['3-5', '6-8', '9-12'],
    difficulty: 'beginner',
    thumbnail: 'https://via.placeholder.com/300x200?text=Arabic+Alphabet',
    gameUrl: '/games/arabic-alphabet-game.html',
    gameType: 'self-hosted',
    learningObjectives: [
      'Learn all 29 Arabic letters',
      'Recognize letter names and sounds',
      'Associate letters with words',
      'Build Arabic vocabulary',
      'Practice letter pronunciation'
    ],
    learningObjectivesArabic: [
      'تعلم جميع الحروف العربية الـ 29',
      'التعرف على أسماء الحروف وأصواتها',
      'ربط الحروف بالكلمات',
      'بناء المفردات العربية',
      'ممارسة نطق الحروف'
    ],
    skills: ['arabic-language', 'alphabet-recognition', 'vocabulary', 'pronunciation', 'reading'],
    skillsArabic: ['اللغة العربية', 'التعرف على الأبجدية', 'المفردات', 'النطق', 'القراءة'],
    pointsPerCompletion: 100,
    bonusPoints: 50,
    duration: 15,
    hasLevels: true,
    numberOfLevels: 3,
    language: ['ar', 'en'],
    isActive: true,
    isPublished: true,
    isFeatured: true,
    contentRating: 'everyone',
    safetyChecked: true
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

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed
seedDatabase();