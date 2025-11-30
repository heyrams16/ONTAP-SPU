# CLAUDE.md - ONTAP-SPU Development Guide

This file provides guidance for Claude Code when working with the ONTAP-SPU codebase.

## Project Overview

ONTAP-SPU is a campus marketplace platform connecting students for verified, affordable help with rides, tutoring, errands, and campus tasks. Winner of HackSPU 2025.

## Tech Stack

- **Frontend**: React 18, React Router 6, Axios, CSS (custom styling)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), bcryptjs for password hashing
- **AI Integration**: Groq SDK for AI-powered features
- **Dev Tools**: Nodemon, Concurrently

## Project Structure

```
ontap-spu/
├── server/                 # Backend API (Express.js)
│   ├── index.js           # Server entry point (port 5000)
│   ├── routes/            # API route handlers
│   │   ├── ai.js          # AI endpoints (study assistant, wellness coach, etc.)
│   │   ├── auth.js        # Authentication routes
│   │   ├── bookings.js    # Service bookings
│   │   ├── magicLink.js   # Passwordless auth
│   │   ├── marketplace.js # Buy/sell items
│   │   ├── posts.js       # Social feed posts
│   │   ├── profiles.js    # Student profiles
│   │   ├── rentals.js     # Rental listings
│   │   ├── recommendations.js
│   │   ├── rides.js       # Ride sharing
│   │   ├── services.js    # General services
│   │   └── users.js       # User management
│   ├── models/            # Mongoose schemas
│   │   ├── Booking.js
│   │   ├── Post.js
│   │   ├── Service.js
│   │   ├── StudentProfile.js
│   │   ├── User.js
│   │   └── UserActivity.js
│   ├── middleware/        # Auth & validation middleware
│   ├── utils/             # Utility functions
│   └── seed*.js           # Database seeders
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── App.js         # Main app with routing
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── MobileNav.js
│   │   │   ├── MobileMenu.js
│   │   │   ├── OnTapAI.js      # AI chatbot component
│   │   │   ├── LocationPicker.js
│   │   │   ├── NetworkAccess.js
│   │   │   └── InstallPrompt.js # PWA install
│   │   ├── pages/         # Page components
│   │   │   ├── Home.js / NewHome.js
│   │   │   ├── Login.js / Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── ServiceList.js / ServiceDetails.js / CreateService.js
│   │   │   ├── Marketplace.js
│   │   │   ├── Rentals.js
│   │   │   ├── Rides.js / RidePooling.js / OfferRide.js
│   │   │   ├── MindWaveHub.js   # AI tools hub
│   │   │   ├── AIStudyAssistant.js
│   │   │   ├── AITranslator.js
│   │   │   ├── WellnessCoach.js
│   │   │   ├── SmartCampus.js
│   │   │   ├── ResumeOptimizer.js
│   │   │   ├── AutoApply.js
│   │   │   ├── OnTapFeed.js    # Social feed
│   │   │   └── CollegeZone.js
│   │   ├── services/      # API service layer
│   │   └── utils/         # Frontend utilities
│   ├── public/            # Static assets
│   └── package.json       # Client dependencies (proxy: localhost:5000)
└── package.json           # Root package with scripts
```

## Development Commands

```bash
# Install all dependencies (root + client)
npm run install-all

# Start development (both server and client concurrently)
npm run dev

# Start server only (with nodemon)
npm run server

# Start client only
npm run client

# Production start
npm start

# Build client for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
MONGODB_URI=mongodb://localhost:27017/ontap-spu  # or MongoDB Atlas URI
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
GROQ_API_KEY=your-groq-api-key  # Required for AI features
```

## Database Seeding

```bash
# Seed demo users and profiles
node server/seedProfiles.js

# Seed services (rides, tutoring, errands, tasks)
node server/seedServices.js

# Seed marketplace items
node server/seedMarketplace.js

# Seed rentals
node server/seedRentals.js

# Seed ride data
node server/seedRides.js

# Seed social posts
node server/seedPosts.js

# Seed demo users
node server/seedDemoUsers.js
```

## API Endpoints

All API routes are prefixed with `/api`:

| Route | Description |
|-------|-------------|
| `/api/auth` | User registration & login |
| `/api/magic-link` | Passwordless authentication |
| `/api/services` | CRUD for service listings |
| `/api/bookings` | Service booking management |
| `/api/users` | User management |
| `/api/profiles` | Student profile management |
| `/api/ai` | AI-powered features (chatbot, study assistant, etc.) |
| `/api/recommendations` | Personalized recommendations |
| `/api/rides` | Ride sharing services |
| `/api/posts` | Social feed posts |
| `/api/marketplace` | Buy/sell marketplace |
| `/api/rentals` | Rental listings |
| `/api/health` | Health check endpoint |

## Key Features

1. **MindWave AI Hub** - AI-powered tools:
   - Study Assistant
   - Wellness Coach
   - Smart Campus
   - AI Translator
   - Resume Optimizer
   - Auto Apply (job applications)

2. **Campus Services**:
   - Ride sharing & pooling
   - Tutoring services
   - Errand services
   - Campus tasks

3. **Marketplace**:
   - Buy/sell items
   - Rental listings

4. **Social Features**:
   - OnTap Feed (posts)
   - Student profiles
   - College Zone

## Code Style

- React functional components with hooks
- CSS files paired with components (ComponentName.css)
- Express routes use async/await pattern
- Mongoose models with validation
- JWT-based authentication middleware
- API responses follow `{ success: boolean, data/error }` pattern

## Port Configuration

- **Backend Server**: Port 5000 (configurable via PORT env)
- **Frontend Dev Server**: Port 3000 (React default)
- **Client Proxy**: Requests to `/api/*` are proxied to `localhost:5000`

## Node Version

Requires Node.js >= 18.0.0
