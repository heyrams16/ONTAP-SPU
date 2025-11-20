const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['rides', 'tutoring', 'errands', 'campus-tasks', 'marketplace', 'rentals'],
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceType: {
    type: String,
    enum: ['fixed', 'hourly', 'negotiable'],
    default: 'fixed'
  },
  availability: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  images: [String],
  // Marketplace-specific fields
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    required: function() { return this.category === 'marketplace'; }
  },
  itemType: {
    type: String,
    enum: ['textbook', 'electronics', 'furniture', 'clothing', 'supplies', 'other'],
    required: function() { return this.category === 'marketplace'; }
  },
  // Rentals-specific fields
  rentalPeriod: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly', 'semester'],
    required: function() { return this.category === 'rentals'; }
  },
  deposit: {
    type: Number,
    min: 0,
    required: function() { return this.category === 'rentals'; }
  },
  rentalItemType: {
    type: String,
    enum: ['textbook', 'electronics', 'equipment', 'furniture', 'vehicle', 'other'],
    required: function() { return this.category === 'rentals'; }
  },
  rentalCondition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair'],
    required: function() { return this.category === 'rentals'; }
  },
  // Ride Pooling-specific fields (Via style with waypoints and zones)
  route: {
    from: {
      type: String,
      required: function() { return this.category === 'rides'; }
    },
    to: {
      type: String,
      required: function() { return this.category === 'rides'; }
    },
    fromCoords: {
      lat: Number,
      lng: Number
    },
    toCoords: {
      lat: Number,
      lng: Number
    },
    fromZone: String, // Via-style pickup zone
    toZone: String, // Via-style dropoff zone
    waypoints: [{
      name: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      zone: String
    }], // Via-style waypoints with coordinates
    distance: Number, // in miles
    duration: Number // estimated duration in minutes
  },
  departureTime: {
    type: Date,
    required: function() { return this.category === 'rides'; }
  },
  seatsAvailable: {
    type: Number,
    min: 1,
    max: 7,
    required: function() { return this.category === 'rides'; }
  },
  vehicleInfo: {
    make: String,
    model: String,
    color: String,
    licensePlate: String,
    year: Number
  },
  rideType: {
    type: String,
    enum: ['one-time', 'recurring', 'daily-commute'],
    default: 'one-time'
  },
  preferences: {
    smokingAllowed: { type: Boolean, default: false },
    petsAllowed: { type: Boolean, default: false },
    musicPreference: String,
    conversationLevel: { type: String, enum: ['quiet', 'moderate', 'chatty'] }
  },
  bookedSeats: {
    type: Number,
    default: 0,
    min: 0
  },
  passengers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    seatsBooked: Number,
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    bookedAt: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
