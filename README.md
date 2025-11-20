# ONTAP-SPU

**Winner of HackSPU 2025**

A campus marketplace platform connecting students for verified, affordable help with rides, tutoring, errands, and campus tasks.

## Problem Statement

Students lack verified, affordable help for rides, tutoring, errands, or campus tasks.

## Solution

ONTAP-SPU provides a trusted peer-to-peer marketplace where students can offer and request services within their campus community.

## Features

- **Student Verification**: Secure authentication using university email
- **Service Categories**:
  - Rides (carpooling, airport trips)
  - Tutoring (academic help)
  - Errands (grocery runs, package pickup)
  - Campus Tasks (moving help, event assistance)
  - **Marketplace** (buy/sell textbooks, electronics, furniture, and more)
- **OnTap AI Assistant**: Intelligent chatbot to help find services, search marketplace, and answer campus questions
- **Rating & Reviews**: Build trust through community feedback
- **Real-time Booking**: Instant service requests and confirmations
- **Payment Integration**: Secure transactions between students

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Getting Started

1. Install dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start MongoDB locally or use MongoDB Atlas

4. Run the application:
```bash
npm run dev
```

5. (Optional) Seed demo data:
```bash
# Seed demo users and profiles
node server/seedProfiles.js

# Seed services (rides, tutoring, errands, tasks)
node server/seedServices.js

# Seed marketplace items
node server/seedMarketplace.js
```

## Project Structure

```
ontap-spu/
├── server/           # Backend API
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth & validation
│   └── index.js      # Server entry point
├── client/           # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
└── package.json
```

## License

MIT
