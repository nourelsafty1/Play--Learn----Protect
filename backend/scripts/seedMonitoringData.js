// backend/scripts/seedMonitoringData.js

require('dotenv').config();
const mongoose = require('mongoose');
const Child = require('../src/models/Child');
const Session = require('../src/models/Session');
const Progress = require('../src/models/Progress');
const Alert = require('../src/models/Alert');
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

// Helper function to get random element from array
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to get random number between min and max
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to get random date in the past N days
const randomPastDate = (daysAgo) => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
  const randomHours = randomInt(8, 20); // Between 8 AM and 8 PM
  const randomMinutes = randomInt(0, 59);
  pastDate.setHours(randomHours, randomMinutes, 0, 0);
  return pastDate;
};

// Seed monitoring data
const seedMonitoringData = async () => {
  try {
    await connectDB();

    // Get all children
    const children = await Child.find({ isActive: true });
    if (children.length === 0) {
      console.log('⚠️  No children found. Please create children first.');
      process.exit(0);
    }

    console.log(`Found ${children.length} children`);

    // Get games and learning modules
    const games = await Game.find({ isActive: true, isPublished: true });
    const learningModules = await LearningModule.find({ isActive: true, isPublished: true });

    if (games.length === 0) {
      console.log('⚠️  No games found. Please seed games first.');
      process.exit(0);
    }

    console.log(`Found ${games.length} games and ${learningModules.length} learning modules`);

    // Clear existing monitoring data (optional - comment out if you want to keep existing data)
    console.log('\nClearing existing monitoring data...');
    await Session.deleteMany({});
    await Progress.deleteMany({});
    await Alert.deleteMany({});
    console.log('✅ Cleared existing monitoring data');

    let totalSessions = 0;
    let totalProgress = 0;
    let totalAlerts = 0;

    // Generate data for each child
    for (const child of children) {
      console.log(`\n📊 Generating data for ${child.name}...`);

      // Generate sessions for the past 14 days
      const sessionsToCreate = randomInt(8, 20); // 8-20 sessions per child
      
      for (let i = 0; i < sessionsToCreate; i++) {
        const daysAgo = randomInt(0, 14);
        const startTime = randomPastDate(daysAgo);
        const duration = randomInt(10 * 60, 60 * 60); // 10 minutes to 1 hour in seconds
        const endTime = new Date(startTime.getTime() + duration * 1000);

        // Create session
        const session = await Session.create({
          child: child._id,
          startTime,
          endTime,
          duration,
          isActive: Math.random() > 0.9, // 10% chance of being active
          deviceType: randomElement(['mobile', 'tablet', 'desktop']),
          totalGamesPlayed: 0,
          totalLessonsViewed: 0,
          pointsEarned: 0,
          activities: []
        });

        totalSessions++;

        // Add activities to session (2-5 activities per session)
        const numActivities = randomInt(2, 5);
        let sessionPoints = 0;

        for (let j = 0; j < numActivities; j++) {
          const activityType = randomElement(['game', 'learning-module', 'creative']);
          let gameId = null;
          let learningModuleId = null;
          let activityDuration = randomInt(5 * 60, 20 * 60); // 5-20 minutes
          let score = randomInt(60, 100);
          let completed = Math.random() > 0.3; // 70% completion rate

          if (activityType === 'game' && games.length > 0) {
            gameId = randomElement(games)._id;
            session.totalGamesPlayed += 1;
          } else if (activityType === 'learning-module' && learningModules.length > 0) {
            learningModuleId = randomElement(learningModules)._id;
            session.totalLessonsViewed += 1;
          }

          // Add activity to session
          session.activities.push({
            activityType,
            game: gameId,
            learningModule: learningModuleId,
            startTime: new Date(startTime.getTime() + j * activityDuration * 1000),
            endTime: new Date(startTime.getTime() + (j + 1) * activityDuration * 1000),
            duration: activityDuration,
            score,
            completed,
            level: randomInt(1, 5)
          });

          // Create progress record for games and learning modules
          if ((activityType === 'game' && gameId) || (activityType === 'learning-module' && learningModuleId)) {
            const progressData = {
              child: child._id,
              sessionId: session._id.toString(),
              contentType: activityType,
              status: completed ? 'completed' : 'in-progress',
              startedAt: session.activities[j].startTime,
              completedAt: completed ? session.activities[j].endTime : null,
              lastAccessedAt: session.activities[j].endTime,
              score,
              attempts: randomInt(1, 3),
              bestScore: score,
              timeSpent: activityDuration,
              pointsEarned: completed ? (activityType === 'game' ? randomInt(50, 150) : randomInt(30, 100)) : 0,
              completionPercentage: completed ? 100 : randomInt(30, 90)
            };

            if (activityType === 'game') {
              progressData.game = gameId;
              progressData.currentLevel = randomInt(1, 5);
              progressData.levelsCompleted = completed ? [{
                levelNumber: progressData.currentLevel,
                completedAt: session.activities[j].endTime,
                score,
                stars: randomInt(1, 3)
              }] : [];
            } else {
              progressData.learningModule = learningModuleId;
              progressData.currentLesson = randomInt(1, 5);
              progressData.lessonsCompleted = completed ? [{
                lessonNumber: progressData.currentLesson,
                completedAt: session.activities[j].endTime,
                score
              }] : [];
            }

            await Progress.create(progressData);
            totalProgress++;
            sessionPoints += progressData.pointsEarned;
          }
        }

        // Update session points
        session.pointsEarned = sessionPoints;
        await session.save();
      }

      // Generate some alerts (0-3 per child)
      const numAlerts = randomInt(0, 3);
      const alertTypes = [
        { type: 'screen-time-warning', severity: 'low', title: 'Screen Time Warning', message: 'Approaching daily screen time limit' },
        { type: 'screen-time-limit', severity: 'medium', title: 'Screen Time Limit Reached', message: 'Daily screen time limit has been reached' },
        { type: 'educational', severity: 'low', title: 'Learning Tip', message: 'Great progress! Keep up the good work!' },
        { type: 'excessive-gaming', severity: 'medium', title: 'Excessive Gaming Detected', message: 'Long gaming session detected' }
      ];

      for (let i = 0; i < numAlerts; i++) {
        const alertType = randomElement(alertTypes);
        const daysAgo = randomInt(0, 7);
        const createdAt = randomPastDate(daysAgo);
        const resolved = Math.random() > 0.5;

        const alertData = {
          child: child._id,
          type: alertType.type,
          severity: alertType.severity,
          title: alertType.title,
          message: alertType.message,
          triggeredBy: 'system',
          context: {},
          shownToParent: true,
          resolved,
          createdAt
        };

        if (resolved) {
          alertData.resolvedAt = new Date(createdAt.getTime() + randomInt(1, 24) * 60 * 60 * 1000);
          alertData.parentResponse = randomElement(['dismissed', 'acknowledged', 'action-taken']);
        }
        // Don't set parentResponse if not resolved - let Mongoose use default

        await Alert.create(alertData);

        totalAlerts++;
      }

      console.log(`✅ Generated ${sessionsToCreate} sessions, ${totalProgress} progress records, and ${numAlerts} alerts for ${child.name}`);
    }

    console.log(`\n🎉 Monitoring data seeded successfully!`);
    console.log(`   - Total Sessions: ${totalSessions}`);
    console.log(`   - Total Progress Records: ${totalProgress}`);
    console.log(`   - Total Alerts: ${totalAlerts}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding monitoring data:', error);
    process.exit(1);
  }
};

// Run the seed
seedMonitoringData();

