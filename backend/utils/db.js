import mongoose from 'mongoose';
import Drill from '../models/Drill.js';
import Question from '../models/Question.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-drill-app';

async function seedDatabase() {
    const drillsCount = await Drill.countDocuments();
    if (drillsCount === 0) {
        console.log('Seeding initial data...');
        const drills = [
        ];
        const createdDrills = await Drill.insertMany(drills);

        const questionsData = {
        };

        for (const drill of createdDrills) {
            const questionsToInsert = questionsData[drill.title].map(text => ({
                drillId: drill._id,
                text,
            }));
            await Question.insertMany(questionsToInsert);
        }

        console.log('Database seeded successfully.');
    }
}

async function connectToDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');
        await seedDatabase();
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

export default connectToDatabase;
