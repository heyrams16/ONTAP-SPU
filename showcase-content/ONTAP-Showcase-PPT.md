# ONTAP - Data Science & AI Showcase 2025
## Saint Peters University | December 4, 2025

---

# SLIDE 1: Title Slide

**ONTAP**
*A Smart Campus Super App*

Data Science & AI Showcase 2025
Saint Peters University

Your Name
Date: December 4, 2025

---

# SLIDE 2: The Problem

## Campus Life is Fragmented

**Students use 5-10+ apps daily for:**
- Buying/selling textbooks
- Renting equipment
- Finding rides to airports
- Getting study help
- Campus information

**Result:**
- Poor user experience
- Wasted time switching apps
- Missed opportunities
- No unified data insights

*[Visual: Show icons of multiple scattered apps]*

---

# SLIDE 3: The Solution

## ONTAP - One App, Complete Campus Life

**Unified Platform with:**
- Student Marketplace
- Equipment Rentals
- Campus Rideshare
- MindWave AI Suite

**Inspired by:** Careem's super app model
**Built for:** University students

*[Visual: ONTAP app screenshot - home screen]*

---

# SLIDE 4: Key Features Overview

## Four Core Verticals

| Feature | Description | Data Points |
|---------|-------------|-------------|
| **Marketplace** | Buy/sell campus essentials | 22 listings |
| **Rentals** | Textbooks, electronics, furniture | 20 items |
| **Rideshare** | Airport runs, city commutes | 12 rides |
| **MindWave AI** | Study assistant, wellness, campus guide | 3 AI tools |

*[Visual: Grid of 4 feature cards with icons]*

---

# SLIDE 5: Technical Architecture

## Full-Stack Implementation

```
┌─────────────────────────────────────┐
│           FRONTEND                  │
│    React 18 | React Router | Axios  │
└──────────────┬──────────────────────┘
               │ REST APIs
┌──────────────▼──────────────────────┐
│           BACKEND                   │
│    Node.js | Express.js | JWT Auth  │
└──────────────┬──────────────────────┘
               │ Mongoose ODM
┌──────────────▼──────────────────────┐
│           DATABASE                  │
│         MongoDB Atlas               │
└──────────────┬──────────────────────┘
               │ API Calls
┌──────────────▼──────────────────────┐
│         AI INTEGRATION              │
│     OpenAI API | Custom Prompts     │
└─────────────────────────────────────┘
```

---

# SLIDE 6: Data Schema Design

## MongoDB Collections Architecture

**Users Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  university: String,
  createdAt: Date
}
```

**Services Collection (Marketplace/Rentals):**
```javascript
{
  _id: ObjectId,
  title: String,
  category: "marketplace" | "rentals" | "services",
  provider: ObjectId (ref: User),
  price: Number,
  condition: String,
  itemType: String,
  location: String,
  createdAt: Date
}
```

**Rides Collection:**
```javascript
{
  _id: ObjectId,
  driver: ObjectId (ref: User),
  origin: String,
  destination: String,
  departureTime: Date,
  seats: Number,
  price: Number,
  passengers: [ObjectId]
}
```

*[Visual: Entity Relationship Diagram]*

---

# SLIDE 7: MindWave AI Suite

## AI-Powered Student Tools

### 1. Study Assistant
- Explains complex topics
- Creates study plans
- Answers academic questions
- Custom prompt engineering

### 2. Wellness Coach
- Mental health support
- Stress management tips
- Work-life balance advice
- Empathetic responses

### 3. Smart Campus Guide
- Navigation help
- Event information
- Resource location
- Campus FAQ

**Technology:** OpenAI API with custom system prompts

*[Visual: Chat interface screenshots]*

---

# SLIDE 8: AI Implementation Details

## Prompt Engineering Approach

```javascript
// Study Assistant System Prompt
const studyAssistantPrompt = `
You are a helpful study assistant for university students.
- Break down complex topics into simple explanations
- Use examples relevant to college courses
- Suggest study techniques and resources
- Be encouraging and supportive
`;

// Wellness Coach System Prompt
const wellnessCoachPrompt = `
You are a supportive wellness coach for students.
- Provide empathetic, non-judgmental responses
- Suggest healthy coping strategies
- Encourage professional help when needed
- Focus on mental health and work-life balance
`;
```

**Key Techniques:**
- Role-based prompting
- Context window management
- Response formatting
- Safety guardrails

---

# SLIDE 9: Data Analytics Potential

## Built for Insights

**User Behavior Tracking:**
- Search patterns
- Popular categories
- Peak usage times
- Conversion funnels

**Recommendation Engine Potential:**
- Collaborative filtering
- Content-based filtering
- Hybrid approaches

**A/B Testing Ready:**
- UI variations
- Pricing experiments
- Feature rollouts

**Aggregation Pipelines:**
```javascript
db.services.aggregate([
  { $match: { category: "marketplace" } },
  { $group: {
    _id: "$itemType",
    avgPrice: { $avg: "$price" },
    count: { $sum: 1 }
  }},
  { $sort: { count: -1 } }
])
```

---

# SLIDE 10: Demo Data Statistics

## Current Dataset

| Collection | Count | Key Fields |
|------------|-------|------------|
| Users | 10 | name, email, university |
| Marketplace | 22 | title, price, condition, itemType |
| Rentals | 20 | title, price, rentalPeriod, deposit |
| Services | 15 | title, category, provider |
| Rides | 12 | origin, destination, seats, price |
| Posts | 20 | content, category, likes, comments |

**Data Relationships:**
- All items linked to provider (User)
- Rides linked to driver and passengers
- Posts linked to author with engagement metrics

---

# SLIDE 11: Technical Challenges Solved

## Key Engineering Problems

### 1. Network Access Detection
```javascript
const getApiUrl = () => {
  if (window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:5000/api`;
  }
  return '/api'; // Use proxy
};
```

### 2. Cross-Origin Resource Sharing
- Configured CORS for multi-device access
- Mobile QR code access implementation

### 3. Real-time Data Seeding
- Relational user references
- Random distribution algorithms
- Realistic demo data generation

### 4. Responsive UI System
- Careem-inspired design system
- CSS custom properties
- Mobile-first approach

---

# SLIDE 12: User Interface Design

## Careem-Inspired Design System

**Color Palette:**
- Primary: #00eb79 (Vibrant Green)
- Background: #0a0a0a (Dark)
- Text: #ffffff, #a0a0a0

**Typography:**
- Font: Inter
- Weights: 400, 500, 600, 700

**Components:**
- Rounded corners (12px-20px)
- Subtle shadows
- Card-based layouts
- Bottom navigation

*[Visual: UI component showcase]*

---

# SLIDE 13: Live Demo

## App Walkthrough

**Demo Flow:**
1. Home Screen - Super app layout
2. Marketplace - Browse products
3. Rentals - Filter by type/period
4. Rideshare - View available rides
5. MindWave AI - Chat with Study Assistant
6. Mobile Access - QR code scan

**Access URLs:**
- Desktop: http://localhost:3000
- Mobile: http://192.168.0.119:3000

*[Live demo or video playback]*

---

# SLIDE 14: Future Roadmap

## Planned Enhancements

### Phase 1: Analytics Dashboard
- User activity metrics
- Popular items tracking
- Revenue analytics

### Phase 2: Recommendation Engine
- "Students also bought"
- Personalized suggestions
- Similar items

### Phase 3: Real-time Features
- Live chat between users
- Push notifications
- WebSocket integration

### Phase 4: Advanced AI
- Image recognition for listings
- Price prediction model
- Sentiment analysis on reviews

---

# SLIDE 15: Data Science Applications

## Potential ML/AI Extensions

**1. Price Prediction Model**
- Features: condition, category, age, location
- Model: Random Forest / XGBoost
- Output: Suggested listing price

**2. Demand Forecasting**
- Predict high-demand periods
- Optimize rideshare availability
- Seasonal trends analysis

**3. Natural Language Processing**
- Review sentiment analysis
- Auto-categorization of listings
- Search query understanding

**4. Computer Vision**
- Auto-detect item condition from photos
- Category suggestion from images
- Duplicate listing detection

---

# SLIDE 16: Lessons Learned

## Key Takeaways

**Technical:**
- Proxy configuration complexity
- CORS handling for mobile access
- Database schema design matters early

**Product:**
- User-centric design drives adoption
- Real data makes better demos
- Mobile-first is essential

**AI/ML:**
- Prompt engineering is an art
- Context management is crucial
- Safety guardrails are necessary

**Personal Growth:**
- Full-stack development confidence
- Problem-solving under pressure
- Project management skills

---

# SLIDE 17: Impact & Value

## Why This Matters

**For Students:**
- Save time with unified platform
- Better prices through peer-to-peer
- AI-powered study support

**For Universities:**
- Reduce campus fragmentation
- Data insights on student needs
- Community building

**For Data Science:**
- Real-world application of concepts
- Scalable architecture patterns
- AI integration best practices

---

# SLIDE 18: Q&A

## Questions?

**Contact:**
- Email: [your email]
- LinkedIn: [your profile]
- GitHub: [your repo]

**Try the App:**
- Scan QR code
- Or visit: http://192.168.0.119:3000

---

# SLIDE 19: Thank You

## ONTAP - Campus Life, Simplified

*"One app for everything students need"*

---

# APPENDIX: Additional Slides

## A1: API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/marketplace | List all products |
| GET | /api/rentals | List all rentals |
| GET | /api/services | List all services |
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/rides | List all rides |

## A2: Database Indexes

```javascript
// Performance optimization indexes
db.services.createIndex({ category: 1, createdAt: -1 })
db.services.createIndex({ provider: 1 })
db.rides.createIndex({ departureTime: 1 })
db.users.createIndex({ email: 1 }, { unique: true })
```

## A3: Environment Configuration

```bash
# Server
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ontap-spu
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-api-key

# Client
REACT_APP_API_URL=http://192.168.0.119:5000/api
```

---

# PRESENTATION NOTES

## Timing Guide (15-20 minutes)
- Slides 1-3: Problem & Solution (2 min)
- Slides 4-6: Features & Architecture (3 min)
- Slides 7-9: AI Implementation (4 min)
- Slides 10-12: Data & Design (3 min)
- Slide 13: Live Demo (3-4 min)
- Slides 14-17: Future & Impact (2 min)
- Slide 18: Q&A (remaining time)

## Demo Preparation Checklist
- [ ] Server running on port 5000
- [ ] Client running on port 3000
- [ ] Database seeded with demo data
- [ ] Mobile device connected to same WiFi
- [ ] QR code tested and working
- [ ] Backup video recorded in case of issues

## Talking Points for Q&A
- Scalability approach
- Security considerations
- Monetization potential
- Competitive advantages
- Team/collaboration (if applicable)
