const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Service = require('./models/Service');

dotenv.config();

async function seedRentals() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ontap-spu');
    console.log('MongoDB connected successfully');

    // Get existing users to assign as rental providers
    const users = await User.find().limit(10);

    if (users.length === 0) {
      console.log('No users found. Please run seedProfiles.js first.');
      process.exit(1);
    }

    // Clear existing rental items
    await Service.deleteMany({ category: 'rentals' });
    console.log('Cleared existing rental items');

    const rentalItems = [
      // Textbooks for Rent
      {
        title: 'Calculus: Early Transcendentals (Rental)',
        description: 'Rent this popular calculus textbook for the semester. Save money compared to buying! Great condition.',
        category: 'rentals',
        rentalItemType: 'textbook',
        rentalCondition: 'good',
        provider: users[0]._id,
        price: 35,
        priceType: 'fixed',
        rentalPeriod: 'semester',
        deposit: 50,
        availability: 'Available for Spring 2025',
        location: 'Library pickup',
        tags: ['math', 'calculus', 'textbook', 'semester-rental'],
        rating: 4.9
      },
      {
        title: 'Physics for Scientists & Engineers (Rental)',
        description: 'Complete textbook rental for one semester. Includes access code (unused). Perfect for PHYS101/102.',
        category: 'rentals',
        rentalItemType: 'textbook',
        rentalCondition: 'like-new',
        provider: users[1]._id,
        price: 40,
        priceType: 'fixed',
        rentalPeriod: 'semester',
        deposit: 60,
        availability: 'Available now',
        location: 'Science Building',
        tags: ['physics', 'textbook', 'semester-rental'],
        rating: 5.0
      },
      {
        title: 'Data Structures & Algorithms Textbook',
        description: 'Monthly rental for CS students. Latest edition with minimal wear.',
        category: 'rentals',
        rentalItemType: 'textbook',
        rentalCondition: 'good',
        provider: users[2]._id,
        price: 15,
        priceType: 'fixed',
        rentalPeriod: 'monthly',
        deposit: 30,
        availability: 'Available now',
        location: 'CS Building',
        tags: ['cs', 'data-structures', 'textbook'],
        rating: 4.7
      },

      // Electronics
      {
        title: 'Scientific Calculator (TI-84 Plus)',
        description: 'Rent TI-84 Plus graphing calculator. Perfect for exams and homework. Daily or weekly rental available.',
        category: 'rentals',
        rentalItemType: 'electronics',
        rentalCondition: 'like-new',
        provider: users[0]._id,
        price: 5,
        priceType: 'fixed',
        rentalPeriod: 'daily',
        deposit: 80,
        availability: 'Available daily',
        location: 'Math Department',
        tags: ['calculator', 'ti-84', 'exam', 'math'],
        rating: 4.8
      },
      {
        title: 'iPad Pro 11" (2022) for Note-Taking',
        description: 'Rent iPad Pro with Apple Pencil included. Perfect for digital note-taking and studying. Weekly rentals.',
        category: 'rentals',
        rentalItemType: 'electronics',
        rentalCondition: 'like-new',
        provider: users[3]._id,
        price: 50,
        priceType: 'fixed',
        rentalPeriod: 'weekly',
        deposit: 500,
        availability: 'Available now',
        location: 'Campus Center',
        tags: ['ipad', 'tablet', 'apple-pencil', 'notes'],
        rating: 5.0
      },
      {
        title: 'Laptop - MacBook Air M2',
        description: 'Rent MacBook Air for projects and exams. 8GB RAM, 256GB SSD. Perfect for CS students. Weekly/Monthly rental.',
        category: 'rentals',
        rentalItemType: 'electronics',
        rentalCondition: 'good',
        provider: users[4]._id,
        price: 80,
        priceType: 'fixed',
        rentalPeriod: 'weekly',
        deposit: 800,
        availability: 'Available next week',
        location: 'Tech Library',
        tags: ['laptop', 'macbook', 'computer', 'coding'],
        rating: 4.9
      },
      {
        title: 'Noise-Cancelling Headphones (Sony WH-1000XM5)',
        description: 'Premium headphones for studying in noisy environments. Daily rental for exam prep or projects.',
        category: 'rentals',
        rentalItemType: 'electronics',
        rentalCondition: 'like-new',
        provider: users[5]._id,
        price: 8,
        priceType: 'fixed',
        rentalPeriod: 'daily',
        deposit: 200,
        availability: 'Available daily',
        location: 'Student Union',
        tags: ['headphones', 'study', 'noise-cancelling'],
        rating: 4.8
      },

      // Equipment
      {
        title: 'Lab Equipment Set (Chemistry)',
        description: 'Complete chemistry lab equipment kit. Beakers, flasks, burettes, pipettes. Weekly rental for lab work.',
        category: 'rentals',
        rentalItemType: 'equipment',
        rentalCondition: 'good',
        provider: users[1]._id,
        price: 25,
        priceType: 'fixed',
        rentalPeriod: 'weekly',
        deposit: 100,
        availability: 'Available now',
        location: 'Chemistry Lab',
        tags: ['lab', 'chemistry', 'equipment'],
        rating: 4.6
      },
      {
        title: 'Photography Camera Kit (Canon EOS R)',
        description: 'Professional camera with lens kit. Perfect for photography class projects. Includes SD cards and battery.',
        category: 'rentals',
        rentalItemType: 'equipment',
        rentalCondition: 'like-new',
        provider: users[2]._id,
        price: 60,
        priceType: 'fixed',
        rentalPeriod: 'weekly',
        deposit: 1200,
        availability: 'Available now',
        location: 'Arts Building',
        tags: ['camera', 'photography', 'canon', 'lens'],
        rating: 5.0
      },
      {
        title: 'Projector for Group Presentations',
        description: 'Portable HD projector with HDMI. Perfect for group study sessions and practice presentations. Hourly rental.',
        category: 'rentals',
        rentalItemType: 'equipment',
        rentalCondition: 'good',
        provider: users[6]._id,
        price: 10,
        priceType: 'fixed',
        rentalPeriod: 'hourly',
        deposit: 150,
        availability: 'Available daily',
        location: 'Business Building',
        tags: ['projector', 'presentation', 'study-group'],
        rating: 4.7
      },
      {
        title: 'Musical Keyboard (88-Key Weighted)',
        description: 'Full-size keyboard for music students. Weekly rental. Includes stand and sustain pedal.',
        category: 'rentals',
        rentalItemType: 'equipment',
        rentalCondition: 'good',
        provider: users[7]._id,
        price: 35,
        priceType: 'fixed',
        rentalPeriod: 'weekly',
        deposit: 300,
        availability: 'Available now',
        location: 'Music Department',
        tags: ['keyboard', 'piano', 'music', 'practice'],
        rating: 4.8
      },

      // Furniture
      {
        title: 'Study Desk with Lamp',
        description: 'Adjustable height desk with LED lamp. Perfect for dorm rooms. Monthly rental for semester.',
        category: 'rentals',
        rentalItemType: 'furniture',
        rentalCondition: 'good',
        provider: users[3]._id,
        price: 40,
        priceType: 'fixed',
        rentalPeriod: 'monthly',
        deposit: 100,
        availability: 'Available now',
        location: 'Student Housing',
        tags: ['desk', 'furniture', 'study', 'dorm'],
        rating: 4.5
      },
      {
        title: 'Mini Refrigerator (Dorm Size)',
        description: 'Compact fridge for dorm room. Energy efficient. Semester or monthly rental available.',
        category: 'rentals',
        rentalItemType: 'furniture',
        rentalCondition: 'good',
        provider: users[8]._id,
        price: 30,
        priceType: 'fixed',
        rentalPeriod: 'monthly',
        deposit: 80,
        availability: 'Available now',
        location: 'Campus Housing',
        tags: ['fridge', 'refrigerator', 'dorm', 'appliance'],
        rating: 4.6
      },
      {
        title: 'Comfortable Study Chair (Ergonomic)',
        description: 'Ergonomic desk chair with lumbar support. Great for long study sessions. Monthly rental.',
        category: 'rentals',
        rentalItemType: 'furniture',
        rentalCondition: 'like-new',
        provider: users[4]._id,
        price: 25,
        priceType: 'fixed',
        rentalPeriod: 'monthly',
        deposit: 60,
        availability: 'Available now',
        location: 'Student Center',
        tags: ['chair', 'ergonomic', 'furniture', 'study'],
        rating: 4.9
      },

      // Vehicles
      {
        title: 'Bicycle (Mountain Bike)',
        description: 'Quality mountain bike for campus commute. Includes lock and helmet. Daily or weekly rental.',
        category: 'rentals',
        rentalItemType: 'vehicle',
        rentalCondition: 'good',
        provider: users[5]._id,
        price: 8,
        priceType: 'fixed',
        rentalPeriod: 'daily',
        deposit: 150,
        availability: 'Available daily',
        location: 'Bike Shop - Campus',
        tags: ['bike', 'bicycle', 'transport', 'campus'],
        rating: 4.7
      },
      {
        title: 'Electric Scooter (Xiaomi Pro 2)',
        description: 'Fast electric scooter for campus travel. 28mph max speed, 28-mile range. Hourly rental available.',
        category: 'rentals',
        rentalItemType: 'vehicle',
        rentalCondition: 'like-new',
        provider: users[6]._id,
        price: 5,
        priceType: 'fixed',
        rentalPeriod: 'hourly',
        deposit: 250,
        availability: 'Available now',
        location: 'Student Parking',
        tags: ['scooter', 'electric', 'transport', 'eco-friendly'],
        rating: 4.8
      },
      {
        title: 'Car Rental - Compact (Honda Civic)',
        description: 'Reliable car for weekend trips or grocery runs. Gas efficient. Daily rental. Insurance included.',
        category: 'rentals',
        rentalItemType: 'vehicle',
        rentalCondition: 'good',
        provider: users[7]._id,
        price: 45,
        priceType: 'fixed',
        rentalPeriod: 'daily',
        deposit: 300,
        availability: 'Book 24hrs ahead',
        location: 'Campus Parking Lot C',
        tags: ['car', 'vehicle', 'transport', 'weekend'],
        rating: 4.9
      },

      // Other Items
      {
        title: 'Party Speaker System (JBL)',
        description: 'Powerful Bluetooth speaker for events. Perfect for dorm parties or outdoor gatherings. Daily rental.',
        category: 'rentals',
        rentalItemType: 'other',
        rentalCondition: 'like-new',
        provider: users[8]._id,
        price: 20,
        priceType: 'fixed',
        rentalPeriod: 'daily',
        deposit: 150,
        availability: 'Available weekends',
        location: 'Student Activities',
        tags: ['speaker', 'party', 'music', 'event'],
        rating: 4.8
      },
      {
        title: 'Camping Gear Set (Tent + Sleeping Bags)',
        description: 'Complete camping set for outdoor adventures. 4-person tent, sleeping bags, camping stove. Weekend rental.',
        category: 'rentals',
        rentalItemType: 'other',
        rentalCondition: 'good',
        provider: users[9]._id,
        price: 40,
        priceType: 'fixed',
        rentalPeriod: 'weekly',
        deposit: 200,
        availability: 'Available for booking',
        location: 'Outdoor Club',
        tags: ['camping', 'tent', 'outdoor', 'adventure'],
        rating: 4.7
      },
      {
        title: 'Gaming Console (PS5 + 2 Controllers)',
        description: 'PlayStation 5 with extra controller and popular games. Perfect for study breaks. Weekly rental.',
        category: 'rentals',
        rentalItemType: 'other',
        rentalCondition: 'like-new',
        provider: users[0]._id,
        price: 50,
        priceType: 'fixed',
        rentalPeriod: 'weekly',
        deposit: 400,
        availability: 'Available now',
        location: 'Gaming Lounge',
        tags: ['ps5', 'gaming', 'console', 'entertainment'],
        rating: 5.0
      }
    ];

    // Insert rental items
    const createdRentals = await Service.insertMany(rentalItems);
    console.log(`✅ Created ${createdRentals.length} rental items`);

    console.log('\n📦 Rental Categories Summary:');
    console.log('- Textbooks for rent: 3 items');
    console.log('- Electronics: 4 items');
    console.log('- Equipment: 4 items');
    console.log('- Furniture: 3 items');
    console.log('- Vehicles: 3 items');
    console.log('- Other items: 3 items');
    console.log('\n💰 Rental Periods Available:');
    console.log('- Hourly rentals');
    console.log('- Daily rentals');
    console.log('- Weekly rentals');
    console.log('- Monthly rentals');
    console.log('- Semester rentals');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding rentals:', error);
    process.exit(1);
  }
}

seedRentals();
