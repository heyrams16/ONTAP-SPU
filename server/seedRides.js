const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// Ride Schema (inline for seeding)
const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  description: String,
  status: { type: String, enum: ['active', 'full', 'completed', 'cancelled'], default: 'active' },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Ride = mongoose.models.Ride || mongoose.model('Ride', rideSchema);

const rides = [
  {
    origin: 'SPU Campus',
    destination: 'Newark Airport (EWR)',
    departureTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    seats: 3,
    price: 25,
    description: 'Holiday break airport run. Comfortable sedan with trunk space for luggage.'
  },
  {
    origin: 'SPU Campus',
    destination: 'JFK Airport',
    departureTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    seats: 4,
    price: 35,
    description: 'Early morning flight? I got you covered. Leaving at 5am sharp.'
  },
  {
    origin: 'SPU Campus',
    destination: 'Penn Station NYC',
    departureTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    seats: 2,
    price: 15,
    description: 'Quick trip to the city. Taking the tunnel, usually 30-40 min.'
  },
  {
    origin: 'Jersey City',
    destination: 'SPU Campus',
    departureTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    seats: 3,
    price: 10,
    description: 'Morning commute from JC. Leave by 8am, arrive before 9am class.'
  },
  {
    origin: 'SPU Campus',
    destination: 'Hoboken',
    departureTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    seats: 4,
    price: 8,
    description: 'Evening trip to Hoboken. Great for dinner or night out!'
  },
  {
    origin: 'SPU Campus',
    destination: 'Edison, NJ',
    departureTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    seats: 3,
    price: 20,
    description: 'Weekend trip home. Can drop off anywhere along Route 1.'
  },
  {
    origin: 'Times Square NYC',
    destination: 'SPU Campus',
    departureTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
    seats: 4,
    price: 18,
    description: 'Late night return from the city. Safe ride back to campus.'
  },
  {
    origin: 'SPU Campus',
    destination: 'Princeton, NJ',
    departureTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    seats: 2,
    price: 22,
    description: 'Visiting friends at Princeton? Join the ride!'
  },
  {
    origin: 'Newark Penn Station',
    destination: 'SPU Campus',
    departureTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    seats: 4,
    price: 12,
    description: 'Pick up from train station. Text when you arrive.'
  },
  {
    origin: 'SPU Campus',
    destination: 'Garden State Plaza',
    departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    seats: 3,
    price: 15,
    description: 'Shopping trip! Will wait 2-3 hours then head back.'
  },
  {
    origin: 'SPU Campus',
    destination: 'LaGuardia Airport',
    departureTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    seats: 3,
    price: 30,
    description: 'LGA drop off. Taking GW Bridge route.'
  },
  {
    origin: 'Philadelphia',
    destination: 'SPU Campus',
    departureTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    seats: 4,
    price: 40,
    description: 'Coming back from Philly weekend. Can pick up along NJ Turnpike.'
  }
];

async function seedRides() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ontap-spu');
    console.log('MongoDB connected successfully');

    // Get demo users
    const demoUsers = await User.find({ email: { $regex: /demo.*@saintpeters.edu/ } });

    if (demoUsers.length === 0) {
      console.log('No demo users found. Please run seedDemoUsers.js first.');
      process.exit(1);
    }

    // Clear existing rides
    await Ride.deleteMany({});
    console.log('Cleared existing rides');

    // Create rides with random drivers
    for (const rideData of rides) {
      const driver = demoUsers[Math.floor(Math.random() * demoUsers.length)];
      const ride = new Ride({
        ...rideData,
        driver: driver._id
      });
      await ride.save();
      console.log(`Created ride: ${rideData.origin} → ${rideData.destination}`);
    }

    console.log(`\n✅ Successfully seeded ${rides.length} rides!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding rides:', error);
    process.exit(1);
  }
}

seedRides();
