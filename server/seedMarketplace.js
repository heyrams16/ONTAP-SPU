const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Service = require('./models/Service');

dotenv.config();

async function seedMarketplace() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ontap-spu');
    console.log('MongoDB connected successfully');

    // Get existing users to assign as sellers
    const users = await User.find().limit(10);

    if (users.length === 0) {
      console.log('No users found. Please run seedProfiles.js first.');
      process.exit(1);
    }

    // Clear existing marketplace items
    await Service.deleteMany({ category: 'marketplace' });
    console.log('Cleared existing marketplace items');

    const marketplaceItems = [
      // Textbooks
      {
        title: 'Introduction to Algorithms (4th Edition)',
        description: 'Classic CLRS algorithms textbook. Minimal highlighting, excellent condition. Used for CS301.',
        category: 'marketplace',
        itemType: 'textbook',
        condition: 'like-new',
        provider: users[0]._id,
        price: 85,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Campus pickup',
        tags: ['cs', 'algorithms', 'textbook']
      },
      {
        title: 'Organic Chemistry by Paula Bruice',
        description: 'Complete with solution manual. Some highlighting but no torn pages. Great for CHEM201/202.',
        category: 'marketplace',
        itemType: 'textbook',
        condition: 'good',
        provider: users[1]._id,
        price: 60,
        priceType: 'fixed',
        availability: 'Available now',
        location: 'Science Building',
        tags: ['chemistry', 'organic', 'textbook']
      },
      {
        title: 'Calculus: Early Transcendentals',
        description: 'Brand new, never used. Wrong edition for my class. Still in shrink wrap!',
        category: 'marketplace',
        itemType: 'textbook',
        condition: 'new',
        provider: users[2]._id,
        price: 120,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Dorm pickup',
        tags: ['math', 'calculus', 'new']
      },
      {
        title: 'Microeconomics Principles',
        description: 'Used for ECON101. Some notes in margins but helpful for studying.',
        category: 'marketplace',
        itemType: 'textbook',
        condition: 'good',
        provider: users[3]._id,
        price: 45,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Library area',
        tags: ['economics', 'textbook']
      },

      // Electronics
      {
        title: 'iPad Air 2020 64GB',
        description: 'Space Gray, excellent condition. Comes with Apple Pencil (1st gen) and case. Perfect for note-taking!',
        category: 'marketplace',
        itemType: 'electronics',
        condition: 'like-new',
        provider: users[4]._id,
        price: 380,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Campus meetup',
        tags: ['ipad', 'apple', 'tablet', 'apple-pencil']
      },
      {
        title: 'Logitech Webcam C920',
        description: 'HD webcam, barely used. Great for online classes and Zoom meetings. Original box included.',
        category: 'marketplace',
        itemType: 'electronics',
        condition: 'like-new',
        provider: users[5]._id,
        price: 45,
        priceType: 'fixed',
        availability: 'Available now',
        location: 'Dorm building',
        tags: ['webcam', 'zoom', 'online-class']
      },
      {
        title: 'Beats Solo3 Wireless Headphones',
        description: 'Black color, good working condition. Some wear on ear pads but sound quality is perfect.',
        category: 'marketplace',
        itemType: 'electronics',
        condition: 'good',
        provider: users[6]._id,
        price: 90,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Student center',
        tags: ['headphones', 'beats', 'wireless']
      },
      {
        title: 'iPhone 12 Charger & Cable',
        description: 'Official Apple 20W USB-C charger with Lightning cable. Never used, still in box.',
        category: 'marketplace',
        itemType: 'electronics',
        condition: 'new',
        provider: users[7]._id,
        price: 25,
        priceType: 'fixed',
        availability: 'Available now',
        location: 'Campus',
        tags: ['apple', 'charger', 'iphone']
      },

      // Furniture
      {
        title: 'Mini Fridge - Perfect for Dorm',
        description: '3.2 cu ft mini fridge, black. Works perfectly, very quiet. Moving out sale!',
        category: 'marketplace',
        itemType: 'furniture',
        condition: 'good',
        provider: users[0]._id,
        price: 60,
        priceType: 'negotiable',
        availability: 'Available end of semester',
        location: 'Dorm building',
        tags: ['fridge', 'dorm', 'moving-sale']
      },
      {
        title: 'Study Desk with Drawers',
        description: 'Wooden desk with 3 drawers. 48x24 inches. Sturdy and in great condition.',
        category: 'marketplace',
        itemType: 'furniture',
        condition: 'good',
        provider: users[1]._id,
        price: 75,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Off-campus apartment',
        tags: ['desk', 'furniture', 'study']
      },
      {
        title: 'IKEA Swivel Chair',
        description: 'Black office chair with adjustable height. Comfortable for long study sessions.',
        category: 'marketplace',
        itemType: 'furniture',
        condition: 'fair',
        provider: users[2]._id,
        price: 30,
        priceType: 'fixed',
        availability: 'Available now',
        location: 'Campus area',
        tags: ['chair', 'ikea', 'office']
      },
      {
        title: 'Bookshelf 5-Tier',
        description: 'White wooden bookshelf, holds tons of books. Easy to disassemble for moving.',
        category: 'marketplace',
        itemType: 'furniture',
        condition: 'good',
        provider: users[3]._id,
        price: 40,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Dorm',
        tags: ['bookshelf', 'storage', 'furniture']
      },

      // Clothing
      {
        title: 'North Face Winter Jacket (M)',
        description: 'Navy blue, medium size. Very warm, perfect for East Coast winters. Barely worn.',
        category: 'marketplace',
        itemType: 'clothing',
        condition: 'like-new',
        provider: users[4]._id,
        price: 120,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Campus',
        tags: ['jacket', 'north-face', 'winter']
      },
      {
        title: 'SPU Hoodie - Official Merch',
        description: 'Size Large, gray color. Official SPU merchandise. Worn a few times, excellent condition.',
        category: 'marketplace',
        itemType: 'clothing',
        condition: 'like-new',
        provider: users[5]._id,
        price: 25,
        priceType: 'fixed',
        availability: 'Available now',
        location: 'Student center',
        tags: ['hoodie', 'spu', 'merch']
      },
      {
        title: 'Professional Business Suit',
        description: 'Black suit, size 40R. Perfect for interviews and career fairs. Dry cleaned.',
        category: 'marketplace',
        itemType: 'clothing',
        condition: 'good',
        provider: users[6]._id,
        price: 80,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Campus',
        tags: ['suit', 'professional', 'interview']
      },

      // Supplies
      {
        title: 'Graphing Calculator TI-84 Plus',
        description: 'Texas Instruments TI-84 Plus. Perfect working condition. Required for most math classes.',
        category: 'marketplace',
        itemType: 'supplies',
        condition: 'good',
        provider: users[7]._id,
        price: 70,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Library',
        tags: ['calculator', 'ti-84', 'math']
      },
      {
        title: 'Art Supplies Bundle',
        description: 'Sketchbooks, colored pencils, markers, acrylic paints. Great for art students!',
        category: 'marketplace',
        itemType: 'supplies',
        condition: 'good',
        provider: users[0]._id,
        price: 35,
        priceType: 'fixed',
        availability: 'Available now',
        location: 'Art building',
        tags: ['art', 'supplies', 'bundle']
      },
      {
        title: 'Lab Coat & Safety Goggles',
        description: 'Brand new lab coat (size M) and safety goggles. Required for chemistry/biology labs.',
        category: 'marketplace',
        itemType: 'supplies',
        condition: 'new',
        provider: users[1]._id,
        price: 20,
        priceType: 'fixed',
        availability: 'Available now',
        location: 'Science building',
        tags: ['lab', 'safety', 'science']
      },
      {
        title: 'Printer - HP DeskJet',
        description: 'Wireless printer, works great. Includes 2 extra ink cartridges. Perfect for essays!',
        category: 'marketplace',
        itemType: 'supplies',
        condition: 'good',
        provider: users[2]._id,
        price: 55,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Dorm area',
        tags: ['printer', 'hp', 'wireless']
      },

      // Other
      {
        title: 'Bicycle - Mountain Bike',
        description: '21-speed mountain bike, black and red. Great for getting around campus. Includes lock.',
        category: 'marketplace',
        itemType: 'other',
        condition: 'good',
        provider: users[3]._id,
        price: 150,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Campus bike rack',
        tags: ['bicycle', 'bike', 'transportation']
      },
      {
        title: 'Electric Kettle',
        description: 'Fast-boiling kettle for coffee, tea, ramen. Auto shut-off feature. Like new!',
        category: 'marketplace',
        itemType: 'other',
        condition: 'like-new',
        provider: users[4]._id,
        price: 18,
        priceType: 'fixed',
        availability: 'Available now',
        location: 'Dorm',
        tags: ['kettle', 'dorm', 'appliance']
      },
      {
        title: 'Gym Membership Transfer',
        description: 'Transferring my annual gym membership (8 months left). Save on initiation fee!',
        category: 'marketplace',
        itemType: 'other',
        condition: 'new',
        provider: users[5]._id,
        price: 200,
        priceType: 'negotiable',
        availability: 'Available now',
        location: 'Local gym',
        tags: ['gym', 'fitness', 'membership']
      }
    ];

    // Create all marketplace items
    for (const itemData of marketplaceItems) {
      const item = new Service(itemData);
      await item.save();
      console.log(`Created marketplace item: ${item.title}`);
    }

    console.log('\n✅ Successfully seeded all marketplace items!');
    console.log(`Total items created: ${marketplaceItems.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding marketplace:', error);
    process.exit(1);
  }
}

seedMarketplace();
