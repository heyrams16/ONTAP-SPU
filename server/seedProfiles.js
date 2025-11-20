const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');

dotenv.config();

const dummyProfiles = [
  {
    name: 'Alex Chen',
    email: 'alex.chen@saintpeters.edu',
    password: 'password123',
    studentId: 'SPU100',
    phone: '201-555-0101',
    profile: {
      profilePicture: 'https://i.pravatar.cc/150?img=12',
      bio: 'Computer Science major passionate about AI and machine learning. Love building things that make a difference!',
      major: 'Computer Science',
      year: 'Junior',
      areasOfInterest: ['Artificial Intelligence', 'Web Development', 'Robotics'],
      skills: ['Python', 'React', 'Machine Learning'],
      hobbies: ['Gaming', 'Photography', 'Basketball'],
      lookingFor: ['Study Partner', 'Project Collaborator']
    }
  },
  {
    name: 'Sarah Martinez',
    email: 'sarah.martinez@saintpeters.edu',
    password: 'password123',
    studentId: 'SPU101',
    phone: '201-555-0102',
    profile: {
      profilePicture: 'https://i.pravatar.cc/150?img=47',
      bio: 'Business Administration student with a passion for entrepreneurship and sustainable business practices.',
      major: 'Business Administration',
      year: 'Senior',
      areasOfInterest: ['Entrepreneurship', 'Marketing', 'Sustainability'],
      skills: ['Public Speaking', 'Marketing Strategy', 'Excel'],
      hobbies: ['Yoga', 'Reading', 'Volunteering'],
      lookingFor: ['Networking', 'Mentor', 'Friend']
    }
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus.johnson@saintpeters.edu',
    password: 'password123',
    studentId: 'SPU102',
    phone: '201-555-0103',
    profile: {
      profilePicture: 'https://i.pravatar.cc/150?img=33',
      bio: 'Biomedical Engineering student interested in medical devices and healthcare innovation.',
      major: 'Biomedical Engineering',
      year: 'Sophomore',
      areasOfInterest: ['Medical Devices', 'Healthcare Technology', 'Research'],
      skills: ['CAD Design', 'MATLAB', 'Laboratory Techniques'],
      hobbies: ['Running', 'Chess', 'Cooking'],
      lookingFor: ['Study Partner', 'Project Collaborator']
    }
  },
  {
    name: 'Emily Wong',
    email: 'emily.wong@harvard.edu',
    password: 'password123',
    studentId: 'HRV200',
    phone: '617-555-0201',
    profile: {
      profilePicture: 'https://i.pravatar.cc/150?img=45',
      bio: 'Psychology major at Harvard exploring behavioral economics and human decision-making.',
      major: 'Psychology',
      year: 'Junior',
      university: 'Harvard University',
      areasOfInterest: ['Behavioral Economics', 'Cognitive Science', 'Research'],
      skills: ['Statistical Analysis', 'Research Methods', 'Writing'],
      hobbies: ['Painting', 'Meditation', 'Podcasting'],
      lookingFor: ['Networking', 'Study Partner']
    }
  },
  {
    name: 'David Kim',
    email: 'david.kim@mit.edu',
    password: 'password123',
    studentId: 'MIT300',
    phone: '617-555-0301',
    profile: {
      profilePicture: 'https://i.pravatar.cc/150?img=15',
      bio: 'Electrical Engineering student at MIT working on renewable energy systems.',
      major: 'Electrical Engineering',
      year: 'Senior',
      university: 'MIT',
      areasOfInterest: ['Renewable Energy', 'Circuit Design', 'Embedded Systems'],
      skills: ['Circuit Analysis', 'C++', 'PCB Design'],
      hobbies: ['Hiking', 'Guitar', 'DIY Electronics'],
      lookingFor: ['Project Collaborator', 'Networking']
    }
  },
  {
    name: 'Jessica Brown',
    email: 'jessica.brown@saintpeters.edu',
    password: 'password123',
    studentId: 'SPU103',
    phone: '201-555-0104',
    profile: {
      profilePicture: 'https://i.pravatar.cc/150?img=44',
      bio: 'Graphic Design major passionate about UX/UI and creating beautiful user experiences.',
      major: 'Graphic Design',
      year: 'Freshman',
      areasOfInterest: ['UX/UI Design', 'Branding', 'Digital Art'],
      skills: ['Adobe Suite', 'Figma', 'Typography'],
      hobbies: ['Drawing', 'Photography', 'Fashion'],
      lookingFor: ['Friend', 'Project Collaborator']
    }
  },
  {
    name: 'Ryan Patel',
    email: 'ryan.patel@columbia.edu',
    password: 'password123',
    studentId: 'CLB400',
    phone: '212-555-0401',
    profile: {
      profilePicture: 'https://i.pravatar.cc/150?img=14',
      bio: 'Economics student at Columbia studying financial markets and data analysis.',
      major: 'Economics',
      year: 'Junior',
      university: 'Columbia University',
      areasOfInterest: ['Financial Markets', 'Data Analysis', 'Investment Banking'],
      skills: ['Python', 'Financial Modeling', 'SQL'],
      hobbies: ['Tennis', 'Investing', 'Traveling'],
      lookingFor: ['Networking', 'Mentor']
    }
  },
  {
    name: 'Maya Rodriguez',
    email: 'maya.rodriguez@saintpeters.edu',
    password: 'password123',
    studentId: 'SPU104',
    phone: '201-555-0105',
    profile: {
      profilePicture: 'https://i.pravatar.cc/150?img=48',
      bio: 'Environmental Science major dedicated to climate action and conservation efforts.',
      major: 'Environmental Science',
      year: 'Sophomore',
      areasOfInterest: ['Climate Change', 'Conservation', 'Sustainability'],
      skills: ['GIS Mapping', 'Data Collection', 'Environmental Policy'],
      hobbies: ['Bird Watching', 'Gardening', 'Camping'],
      lookingFor: ['Study Partner', 'Friend', 'Project Collaborator']
    }
  }
];

async function seedProfiles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ontap-spu');
    console.log('MongoDB connected successfully');

    // Clear existing dummy users and profiles
    await User.deleteMany({ email: { $regex: /@(saintpeters|harvard|mit|columbia)\.edu$/ } });
    await StudentProfile.deleteMany({});
    console.log('Cleared existing dummy data');

    // Create users and profiles
    for (const data of dummyProfiles) {
      const user = new User({
        name: data.name,
        email: data.email,
        password: data.password,
        studentId: data.studentId,
        phone: data.phone
      });

      await user.save();
      console.log(`Created user: ${user.name}`);

      const profile = new StudentProfile({
        user: user._id,
        ...data.profile
      });

      await profile.save();
      console.log(`Created profile for: ${user.name}`);
    }

    console.log('\n✅ Successfully seeded all dummy profiles!');
    console.log(`Total profiles created: ${dummyProfiles.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding profiles:', error);
    process.exit(1);
  }
}

seedProfiles();
