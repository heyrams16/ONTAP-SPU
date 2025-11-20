const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const demoUsers = [
  { name: 'Demo User 1', email: 'demo1@saintpeters.edu', password: 'demo123', studentId: 'DEMO001', phone: '201-555-1001' },
  { name: 'Demo User 2', email: 'demo2@saintpeters.edu', password: 'demo123', studentId: 'DEMO002', phone: '201-555-1002' },
  { name: 'Demo User 3', email: 'demo3@saintpeters.edu', password: 'demo123', studentId: 'DEMO003', phone: '201-555-1003' },
  { name: 'Demo User 4', email: 'demo4@saintpeters.edu', password: 'demo123', studentId: 'DEMO004', phone: '201-555-1004' },
  { name: 'Demo User 5', email: 'demo5@saintpeters.edu', password: 'demo123', studentId: 'DEMO005', phone: '201-555-1005' },
  { name: 'Demo User 6', email: 'demo6@saintpeters.edu', password: 'demo123', studentId: 'DEMO006', phone: '201-555-1006' },
  { name: 'Demo User 7', email: 'demo7@saintpeters.edu', password: 'demo123', studentId: 'DEMO007', phone: '201-555-1007' },
  { name: 'Demo User 8', email: 'demo8@saintpeters.edu', password: 'demo123', studentId: 'DEMO008', phone: '201-555-1008' },
  { name: 'Demo User 9', email: 'demo9@saintpeters.edu', password: 'demo123', studentId: 'DEMO009', phone: '201-555-1009' },
  { name: 'Demo User 10', email: 'demo10@saintpeters.edu', password: 'demo123', studentId: 'DEMO010', phone: '201-555-1010' }
];

async function seedDemoUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ontap-spu');
    console.log('MongoDB connected successfully');

    // Remove existing demo users
    await User.deleteMany({ email: { $regex: /^demo\d+@saintpeters\.edu$/ } });
    console.log('Cleared existing demo users');

    // Create demo users
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created demo user: ${user.email}`);
    }

    console.log('\n✅ Successfully created all demo users!');
    console.log('Demo credentials:');
    console.log('Email: demo1@saintpeters.edu to demo10@saintpeters.edu');
    console.log('Password: demo123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo users:', error);
    process.exit(1);
  }
}

seedDemoUsers();
