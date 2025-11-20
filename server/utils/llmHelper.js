const axios = require('axios');
const Groq = require('groq-sdk');

/**
 * Enhanced LLM Helper - ChatGPT-like capabilities
 *
 * Supports multiple providers:
 * 1. Groq (FREE, fast, cloud-based) - RECOMMENDED
 * 2. Ollama (local, private)
 * 3. OpenAI (paid)
 *
 * Setup (choose one):
 *
 * OPTION 1 - Groq (FREE, easiest):
 *   1. Get free API key: https://console.groq.com
 *   2. Set: GROQ_API_KEY=your_key_here
 *
 * OPTION 2 - Ollama (local):
 *   1. Install: https://ollama.ai
 *   2. Run: ollama pull llama3
 *   3. Set: USE_LOCAL_LLM=true
 */

// Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || null;
const USE_LOCAL_LLM = process.env.USE_LOCAL_LLM === 'true';
const LOCAL_LLM_ENDPOINT = process.env.LOCAL_LLM_ENDPOINT || 'http://localhost:11434';
const LLM_MODEL = process.env.LLM_MODEL || 'llama3';

// Initialize Groq client
let groqClient = null;
if (GROQ_API_KEY) {
  groqClient = new Groq({ apiKey: GROQ_API_KEY });
}

/**
 * Query Groq LLM (FREE, cloud-based, fast)
 * @param {string} question - The user's question
 * @returns {Promise<string>} - AI-generated response
 */
async function queryGroq(question) {
  if (!groqClient) {
    return null;
  }

  try {
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are OnTap AI, an educational assistant for college students. Provide comprehensive, well-structured explanations that are:
- Detailed and thorough (like ChatGPT)
- Easy to understand with examples
- Use bullet points, headings, and formatting
- Include key concepts, definitions, and practical applications
- Keep it conversational but informative
- End with a helpful suggestion about tutoring services available on the platform`
        },
        {
          role: 'user',
          content: question
        }
      ],
      model: 'llama-3.3-70b-versatile', // Fast and powerful (upgraded from 3.1)
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Groq API error:', error.message);
    return null;
  }
}

/**
 * Query local Ollama LLM
 * @param {string} question - The user's question
 * @returns {Promise<string>} - AI-generated response
 */
async function queryOllama(question) {
  try {
    const response = await axios.post(`${LOCAL_LLM_ENDPOINT}/api/generate`, {
      model: LLM_MODEL,
      prompt: `You are OnTap AI, an educational assistant for college students. Provide comprehensive, well-structured explanations like ChatGPT would. Include key concepts, definitions, examples, and practical applications. Use headings and bullet points.\n\nQuestion: ${question}\n\nAnswer:`,
      stream: false
    }, {
      timeout: 30000 // 30 second timeout for local models
    });

    if (response.data && response.data.response) {
      return response.data.response.trim();
    }

    return null;
  } catch (error) {
    console.error('Ollama error:', error.message);
    return null;
  }
}

/**
 * Query the best available LLM
 * @param {string} question - The user's question
 * @returns {Promise<string>} - AI-generated response
 */
async function queryLLM(question) {
  // Try Groq first (fastest, free)
  if (groqClient) {
    const response = await queryGroq(question);
    if (response) return response;
  }

  // Try local LLM second (private, but slower)
  if (USE_LOCAL_LLM) {
    const response = await queryOllama(question);
    if (response) return response;
  }

  return null; // No LLM configured
}

/**
 * Check if question is educational and suitable for LLM
 * @param {string} message - User's message
 * @returns {boolean}
 */
function isEducationalQuestion(message) {
  const lowerMessage = message.toLowerCase();

  // Educational question patterns
  const educationalPatterns = [
    'what is', 'what are', 'what does', 'what\'s',
    'how does', 'how do', 'how to', 'how can',
    'explain', 'define', 'definition of',
    'tell me about', 'teach me',
    'difference between', 'compare',
    'why does', 'why is', 'why do',
    'when should', 'when do',
    'help me understand', 'i don\'t understand',
    'can you explain',
    'meaning of', 'concept of',
    'theory', 'principle',
    'formula', 'equation',
    'example of', 'examples of'
  ];

  // Service request indicators (should NOT be treated as educational)
  const serviceIndicators = [
    'find tutor', 'find tutoring', 'need tutor',
    'looking for tutor', 'search for tutor',
    'find service', 'need service',
    'find ride', 'need ride', 'looking for ride',
    'marketplace', 'buy', 'sell',
    'show me services', 'available services'
  ];

  // Check for service requests first (higher priority)
  for (const indicator of serviceIndicators) {
    if (lowerMessage.includes(indicator)) {
      return false; // It's a service request, not educational
    }
  }

  // Check if it's an educational question
  for (const pattern of educationalPatterns) {
    if (lowerMessage.includes(pattern)) {
      return true;
    }
  }

  // Also catch standalone subject queries
  const subjectKeywords = [
    'data science', 'machine learning', 'artificial intelligence',
    'blockchain', 'quantum computing', 'cybersecurity',
    'biology', 'chemistry', 'physics',
    'calculus', 'algebra', 'statistics', 'probability',
    'economics', 'finance', 'accounting', 'marketing',
    'psychology', 'sociology', 'philosophy',
    'history', 'literature', 'poetry'
  ];

  // If message is just asking about a subject (not finding services for it)
  for (const subject of subjectKeywords) {
    if (lowerMessage.includes(subject) &&
        !lowerMessage.includes('find') &&
        !lowerMessage.includes('tutor') &&
        !lowerMessage.includes('service')) {
      return true;
    }
  }

  return false;
}

/**
 * Get educational response using LLM or fallback
 * @param {string} question - The user's question
 * @returns {Promise<string|null>}
 */
async function getEducationalResponse(question) {
  if (!isEducationalQuestion(question)) {
    return null;
  }

  // Try LLM (Groq or Ollama)
  const llmResponse = await queryLLM(question);
  if (llmResponse) {
    return `📚 **${llmResponse}**`;
  }

  // If no LLM is configured, return null to use built-in responses
  return null;
}

/**
 * Check if any LLM is enabled
 * @returns {boolean}
 */
function isLLMEnabled() {
  return !!(groqClient || USE_LOCAL_LLM);
}

/**
 * Get LLM status info
 * @returns {object}
 */
function getLLMStatus() {
  return {
    enabled: isLLMEnabled(),
    provider: groqClient ? 'Groq (Cloud)' : USE_LOCAL_LLM ? 'Ollama (Local)' : 'None',
    model: groqClient ? 'llama-3.3-70b-versatile' : LLM_MODEL
  };
}

module.exports = {
  queryLLM,
  queryGroq,
  queryOllama,
  isEducationalQuestion,
  getEducationalResponse,
  isLLMEnabled,
  getLLMStatus
};
