# OnTap AI - Intelligent Assistant Guide

## Overview

OnTap AI is an intelligent chatbot integrated into ONTAP-SPU that helps students:
- Find and match with services (tutoring, rides, errands, tasks)
- Search marketplace items
- Get educational help on various subjects
- Receive personalized recommendations

## Features

### 🎯 **Intelligent Matching**

The AI queries your database in real-time to match students with:

1. **Services**
   - Tutoring (by subject)
   - Rides (to airports, NYC, campus)
   - Errands (groceries, packages, laundry)
   - Campus Tasks (moving, events, tech support)

2. **Marketplace Items**
   - Textbooks (by subject or course)
   - Electronics (laptops, iPads, headphones)
   - Furniture (desks, chairs, fridges)
   - Clothing, Supplies, and more

### 📚 **Educational Q&A**

Built-in responses for common academic questions:
- **Mathematics**: Calculus, derivatives, integrals
- **Programming**: Python, JavaScript, coding concepts
- **Chemistry**: Organic chemistry, reactions, molecules
- **General**: Study tips, course help

### 🤖 **Local LLM Integration (Optional)**

For advanced educational responses, you can integrate a local LLM:

**Supported Services:**
- Ollama
- LM Studio
- Any OpenAI-compatible API

## How to Use

### For Students

1. **Click the purple robot button** in the bottom-right corner
2. **Type your question or request**:
   - "Find tutoring for calculus"
   - "I need a ride to Newark airport"
   - "Show me textbooks for organic chemistry"
   - "What is a derivative?"
   - "Looking for a desk for my dorm"

3. **Use quick actions** for common requests
4. **Get instant results** with:
   - Service/product matches
   - Prices and availability
   - Provider information
   - Direct links to view more

### Example Queries

**Service Matching:**
```
"Find tutoring services"
"I need a ride to NYC"
"Help with grocery shopping"
"Moving help needed"
```

**Marketplace Search:**
```
"Looking for calculus textbook"
"Need a laptop"
"Furniture for dorm room"
"Cheap electronics"
```

**Educational Questions:**
```
"What is calculus?"
"Explain Python programming"
"Help me understand chemistry"
"How do I solve derivatives?"
```

## Setting Up Local LLM (Optional)

### Prerequisites
- Ollama installed (https://ollama.ai)
- A downloaded model (recommended: llama2, mistral, or codellama)

### Installation Steps

1. **Install Ollama**
   ```bash
   # macOS
   brew install ollama

   # Or download from https://ollama.ai
   ```

2. **Pull a model**
   ```bash
   ollama pull llama2
   # or
   ollama pull mistral
   ```

3. **Start Ollama service**
   ```bash
   ollama serve
   ```

4. **Configure environment variables**

   Add to your `.env` file:
   ```env
   LOCAL_LLM_ENDPOINT=http://localhost:11434
   LLM_MODEL=llama2
   ```

5. **Restart the server**
   ```bash
   npm run server
   ```

### Verification

When configured correctly:
- Educational questions will be answered by your local LLM
- Responses will be more detailed and contextual
- Service/marketplace matching still uses the fast built-in system

## AI Architecture

### Backend (`server/routes/ai.js`)

The AI endpoint processes requests through:

1. **Educational Question Detection** → Local LLM (if enabled)
2. **Intent Classification** → Service/Marketplace matching
3. **Database Query** → Real-time results from MongoDB
4. **Response Generation** → Formatted output with matched items

### Response Flow

```
User Query
    ↓
Is it educational? → Yes → Local LLM → Enhanced Answer
    ↓ No
Intent Detection (tutoring, rides, marketplace, etc.)
    ↓
Database Search (MongoDB)
    ↓
Format Response with Matched Items
    ↓
Return to Frontend
```

### Frontend (`client/src/components/OnTapAI.js`)

- **Floating Chat Button**: Always accessible, pulsing animation
- **Chat Interface**: Real-time messaging with typing indicators
- **Quick Actions**: One-click common queries
- **API Integration**: Axios calls to `/api/ai/chat`

## API Endpoint

### POST `/api/ai/chat`

**Request:**
```json
{
  "message": "Find tutoring for calculus"
}
```

**Response:**
```json
{
  "response": "📚 I found these tutoring services...",
  "matchedItems": [
    {
      "_id": "...",
      "title": "Calculus & Math Help",
      "price": 20,
      "provider": { "name": "Emily Wong" },
      ...
    }
  ]
}
```

## Customization

### Adding New Intents

Edit `server/routes/ai.js` to add new matching logic:

```javascript
// Example: Add campus events matching
else if (lowerMessage.includes('event') ||
         lowerMessage.includes('party')) {
  const events = await Service.find({
    category: 'campus-tasks',
    tags: { $in: ['events'] }
  });
  // ... format response
}
```

### Modifying Educational Responses

Edit built-in responses in `server/routes/ai.js`:

```javascript
else if (lowerMessage.includes('your-topic')) {
  response = `📖 **Your Topic Help**\n\nYour custom response...`;
}
```

### Customizing LLM Prompts

Edit `server/utils/llmHelper.js`:

```javascript
const response = await axios.post(`${LOCAL_LLM_ENDPOINT}/api/generate`, {
  model: LLM_MODEL,
  prompt: `Your custom system prompt here...`,
  // ...
});
```

## Performance

### Built-in Matching (No LLM)
- Response time: 50-200ms
- Database queries optimized with indexes
- Instant results for service/marketplace matching

### With Local LLM
- Educational questions: 1-5 seconds (depends on model)
- Service matching: Still fast (bypasses LLM)
- Best for: Deep educational explanations

## Troubleshooting

### AI Not Responding
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Check MongoDB connection
3. Verify axios is installed: `npm list axios`

### LLM Not Working
1. Verify Ollama is running: `curl http://localhost:11434`
2. Check environment variables in `.env`
3. Ensure model is pulled: `ollama list`
4. Check server logs for LLM errors

### No Matches Found
1. Verify data is seeded: Check MongoDB database
2. Try broader search terms
3. Check service `isActive` status in database

## Future Enhancements

Potential improvements:
- **Context Memory**: Remember conversation history
- **Personalization**: User preferences and history
- **Multi-turn Conversations**: Follow-up questions
- **Image Understanding**: Analyze uploaded images
- **Voice Input**: Speech-to-text integration
- **Smart Scheduling**: AI-powered booking suggestions

## Privacy & Data

- All queries are processed locally (no external AI APIs by default)
- Chat history is client-side only (not stored in database)
- Optional LLM runs completely local (no data sent to cloud)
- User data never leaves your infrastructure

---

**Built with ❤️ for ONTAP-SPU - HackSPU 2025 Winner**
