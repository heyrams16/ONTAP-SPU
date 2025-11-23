const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// Post Schema (inline for seeding)
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['general', 'event', 'question', 'announcement', 'marketplace', 'lost-found'], default: 'general' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

const posts = [
  {
    content: "Just finished my finals! Who else is celebrating? 🎉 Let's grab coffee at the student center!",
    category: 'general'
  },
  {
    content: "📢 REMINDER: Career Fair tomorrow in the gymnasium from 10am-4pm. Dress professionally and bring resumes! Over 50 companies attending.",
    category: 'announcement'
  },
  {
    content: "Lost my AirPods case near the library yesterday (silver with a blue sticker). Please DM if found! 🙏",
    category: 'lost-found'
  },
  {
    content: "Anyone taking COMP 201 next semester? Looking for study group partners. I have all the textbooks and past exams!",
    category: 'question'
  },
  {
    content: "🎸 Open mic night this Friday at 8pm in the campus cafe! Come support your fellow students or sign up to perform.",
    category: 'event'
  },
  {
    content: "Selling my barely-used standing desk. Perfect condition, adjustable height. $150 OBO. DM for pics!",
    category: 'marketplace'
  },
  {
    content: "Pro tip: The library's 4th floor study rooms can be booked online 24 hours in advance. Game changer for group projects! 📚",
    category: 'general'
  },
  {
    content: "⚽ Intramural soccer signups end this week! Need 2 more players for our team. All skill levels welcome!",
    category: 'event'
  },
  {
    content: "Does anyone know a good mechanic near campus? My car is making weird noises 😅",
    category: 'question'
  },
  {
    content: "Found a set of keys near the science building. Has a red keychain. Come to lost & found in admin building.",
    category: 'lost-found'
  },
  {
    content: "🍕 Free pizza at the Student Government meeting tonight at 7pm! Come vote on spring events budget.",
    category: 'announcement'
  },
  {
    content: "Looking for a roommate for next semester! 2BR apartment walking distance from campus. $650/month all included.",
    category: 'marketplace'
  },
  {
    content: "Just got my dream internship offer! Hard work pays off. Don't give up, everyone! 💪",
    category: 'general'
  },
  {
    content: "🎬 Movie night this Saturday! We're watching Interstellar in the main auditorium. Free popcorn!",
    category: 'event'
  },
  {
    content: "Tutoring available for Organic Chemistry! I got an A last semester. $20/hour or free for group sessions.",
    category: 'marketplace'
  },
  {
    content: "The new campus app is amazing! Finally can check my grades without logging into 5 different systems 😂",
    category: 'general'
  },
  {
    content: "🚨 Important: Parking lot B will be closed next week for repaving. Use lot C or D instead.",
    category: 'announcement'
  },
  {
    content: "Anyone else's wifi acting up in the dorms? Tried restarting router but still super slow.",
    category: 'question'
  },
  {
    content: "Giving away free textbooks from last semester: Intro to Psychology, Microeconomics, and World History. First come first serve!",
    category: 'marketplace'
  },
  {
    content: "🏀 Basketball watch party for the championship game! Sunday 3pm at the rec center. Bring snacks to share!",
    category: 'event'
  }
];

async function seedPosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ontap-spu');
    console.log('MongoDB connected successfully');

    // Get demo users
    const demoUsers = await User.find({ email: { $regex: /demo.*@saintpeters.edu/ } });

    if (demoUsers.length === 0) {
      console.log('No demo users found. Please run seedDemoUsers.js first.');
      process.exit(1);
    }

    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Create posts with random authors and some likes
    for (const postData of posts) {
      const author = demoUsers[Math.floor(Math.random() * demoUsers.length)];

      // Add random likes from other users
      const likeCount = Math.floor(Math.random() * 8);
      const likes = demoUsers
        .filter(u => u._id.toString() !== author._id.toString())
        .sort(() => 0.5 - Math.random())
        .slice(0, likeCount)
        .map(u => u._id);

      const post = new Post({
        ...postData,
        author: author._id,
        likes
      });
      await post.save();
      console.log(`Created post: ${postData.content.substring(0, 50)}...`);
    }

    console.log(`\n✅ Successfully seeded ${posts.length} posts!`);

    // Summary by category
    const categories = {};
    posts.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    console.log('\n📊 Posts by category:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`- ${cat}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding posts:', error);
    process.exit(1);
  }
}

seedPosts();
