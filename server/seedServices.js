const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Service = require('./models/Service');

dotenv.config();

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ontap-spu');
    console.log('MongoDB connected successfully');

    // Get existing users to assign as service providers
    const users = await User.find().limit(8);

    if (users.length === 0) {
      console.log('No users found. Please run seedProfiles.js first.');
      process.exit(1);
    }

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    const services = [
      // Rides
      {
        title: 'Airport Shuttle to Newark',
        description: 'Reliable airport transportation to Newark Airport. Spacious car with room for luggage. Available 24/7 with advance booking.',
        category: 'rides',
        provider: users[0]._id,
        price: 35,
        priceType: 'fixed',
        availability: 'Daily, 6 AM - 11 PM',
        location: 'Saint Peters University',
        tags: ['airport', 'reliable', 'spacious'],
        route: {
          from: 'Saint Peters University',
          to: 'Newark Liberty International Airport',
          fromZone: 'Campus Main Entrance',
          toZone: 'Terminal B'
        },
        departureTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        seatsAvailable: 3,
        vehicleInfo: {
          make: 'Honda',
          model: 'Accord',
          color: 'Silver',
          year: 2020
        }
      },
      {
        title: 'Campus to NYC Carpool',
        description: 'Daily carpool to NYC for work or leisure. Split gas costs with other students. Departing at 7 AM, returning at 6 PM.',
        category: 'rides',
        provider: users[1]._id,
        price: 10,
        priceType: 'fixed',
        availability: 'Monday-Friday',
        location: 'Campus Parking Lot',
        tags: ['carpool', 'nyc', 'affordable'],
        route: {
          from: 'Saint Peters University',
          to: 'New York City - Midtown',
          fromZone: 'Campus Parking Lot',
          toZone: 'Times Square'
        },
        departureTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        seatsAvailable: 2,
        rideType: 'daily-commute',
        vehicleInfo: {
          make: 'Toyota',
          model: 'Camry',
          color: 'Blue',
          year: 2019
        }
      },
      {
        title: 'Late Night Campus Rides',
        description: 'Safe rides around campus and nearby areas for late night studying or events. Quick response time.',
        category: 'rides',
        provider: users[2]._id,
        price: 5,
        priceType: 'negotiable',
        availability: '9 PM - 2 AM',
        location: 'On Campus',
        tags: ['safe', 'late-night', 'quick'],
        route: {
          from: 'Saint Peters University - Library',
          to: 'Campus Dorms',
          fromZone: 'Library',
          toZone: 'Residence Halls'
        },
        departureTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now (tonight)
        seatsAvailable: 4,
        vehicleInfo: {
          make: 'Ford',
          model: 'Focus',
          color: 'Black',
          year: 2021
        }
      },

      // Tutoring
      {
        title: 'Python Programming Tutor',
        description: 'Experienced CS student offering Python tutoring for beginners to advanced. Cover basics, data structures, algorithms, and web development with Flask/Django.',
        category: 'tutoring',
        provider: users[0]._id,
        price: 25,
        priceType: 'hourly',
        availability: 'Mon, Wed, Fri 4-8 PM',
        location: 'Library or Online',
        tags: ['python', 'programming', 'cs']
      },
      {
        title: 'Calculus & Math Help',
        description: 'Math major offering help with Calculus I, II, III, Linear Algebra, and Differential Equations. Patient and thorough explanations.',
        category: 'tutoring',
        provider: users[3]._id,
        price: 20,
        priceType: 'hourly',
        availability: 'Tue, Thu 3-7 PM',
        location: 'Student Center',
        tags: ['math', 'calculus', 'patient']
      },
      {
        title: 'Spanish Language Tutoring',
        description: 'Native Spanish speaker offering language tutoring for all levels. Conversational practice, grammar, and exam prep.',
        category: 'tutoring',
        provider: users[4]._id,
        price: 18,
        priceType: 'hourly',
        availability: 'Flexible schedule',
        location: 'Online or Campus',
        tags: ['spanish', 'language', 'conversational']
      },
      {
        title: 'Business & Economics Tutoring',
        description: 'MBA student helping with business courses: Economics, Accounting, Finance, Marketing. Real-world examples and exam strategies.',
        category: 'tutoring',
        provider: users[1]._id,
        price: 30,
        priceType: 'hourly',
        availability: 'Weekends',
        location: 'Library',
        tags: ['business', 'economics', 'mba']
      },

      // Errands
      {
        title: 'Grocery Shopping Service',
        description: 'I can do your grocery shopping at ShopRite, Whole Foods, or Trader Joes. Just send me your list!',
        category: 'errands',
        provider: users[5]._id,
        price: 15,
        priceType: 'fixed',
        availability: 'Weekends',
        location: 'Jersey City area',
        tags: ['groceries', 'shopping', 'convenient']
      },
      {
        title: 'Package Pickup & Delivery',
        description: 'Need a package picked up from the post office or delivered across campus? I got you covered!',
        category: 'errands',
        provider: users[6]._id,
        price: 5,
        priceType: 'negotiable',
        availability: 'Daily 12-6 PM',
        location: 'Campus',
        tags: ['delivery', 'packages', 'fast']
      },
      {
        title: 'Laundry Service',
        description: 'Wash, dry, and fold your laundry. Drop off and pick up on campus. Eco-friendly detergent used.',
        category: 'errands',
        provider: users[7]._id,
        price: 12,
        priceType: 'fixed',
        availability: 'Mon-Fri',
        location: 'Dorm Buildings',
        tags: ['laundry', 'convenient', 'eco-friendly']
      },

      // Campus Tasks
      {
        title: 'Moving Help',
        description: 'Need help moving into/out of your dorm or apartment? Strong team available for lifting heavy items and furniture.',
        category: 'campus-tasks',
        provider: users[2]._id,
        price: 40,
        priceType: 'fixed',
        availability: 'Weekends',
        location: 'Campus & nearby',
        tags: ['moving', 'strong', 'team']
      },
      {
        title: 'Event Setup Assistant',
        description: 'Available to help set up for campus events, parties, or meetings. Tables, chairs, decorations, sound system.',
        category: 'campus-tasks',
        provider: users[3]._id,
        price: 15,
        priceType: 'hourly',
        availability: 'Flexible',
        location: 'Campus',
        tags: ['events', 'setup', 'reliable']
      },
      {
        title: 'Tech Support',
        description: 'Computer issues? Software installation? Wifi problems? I can help fix your tech problems quickly.',
        category: 'campus-tasks',
        provider: users[0]._id,
        price: 20,
        priceType: 'hourly',
        availability: 'Mon-Fri evenings',
        location: 'Your place or library',
        tags: ['tech', 'computer', 'quick-fix']
      },
      {
        title: 'Resume & Cover Letter Review',
        description: 'Career center intern offering professional resume and cover letter reviews. ATS optimization and formatting.',
        category: 'campus-tasks',
        provider: users[1]._id,
        price: 15,
        priceType: 'fixed',
        availability: 'Weekdays',
        location: 'Online',
        tags: ['resume', 'career', 'professional']
      },
      {
        title: 'Photography for Events',
        description: 'Professional quality photos for your events, headshots, or social media. Quick turnaround with editing.',
        category: 'campus-tasks',
        provider: users[5]._id,
        price: 50,
        priceType: 'negotiable',
        availability: 'Weekends & evenings',
        location: 'Anywhere on/near campus',
        tags: ['photography', 'events', 'professional']
      }
    ];

    // Create all services
    for (const serviceData of services) {
      const service = new Service(serviceData);
      await service.save();
      console.log(`Created service: ${service.title}`);
    }

    console.log('\n✅ Successfully seeded all services!');
    console.log(`Total services created: ${services.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
}

seedServices();
