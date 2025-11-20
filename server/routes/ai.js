const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { getEducationalResponse, isLLMEnabled, getLLMStatus } = require('../utils/llmHelper');

// LLM Status endpoint
router.get('/status', (req, res) => {
  const status = getLLMStatus();
  res.json({
    ...status,
    message: status.enabled
      ? `OnTap AI is powered by ${status.provider}`
      : 'OnTap AI is using built-in responses. Configure Groq API for ChatGPT-like capabilities!'
  });
});

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lowerMessage = message.toLowerCase();
    let response = '';
    let matchedItems = [];

    // Try local LLM for educational questions first
    const llmResponse = await getEducationalResponse(message);
    if (llmResponse) {
      return res.json({
        response: llmResponse,
        matchedItems: null,
        source: 'llm'
      });
    }

    // Intent detection and response generation

    // 1. SERVICE MATCHING - Tutoring
    const isLookingForTutor = (lowerMessage.includes('find') || lowerMessage.includes('need') || lowerMessage.includes('looking for')) &&
                               (lowerMessage.includes('tutor') || lowerMessage.includes('tutoring'));
    const isHomeworkHelp = lowerMessage.includes('help with') && (lowerMessage.includes('class') || lowerMessage.includes('study') || lowerMessage.includes('homework'));

    if (isLookingForTutor || isHomeworkHelp || lowerMessage.includes('exam prep')) {

      const services = await Service.find({
        category: 'tutoring',
        isActive: true
      }).populate('provider', 'name rating').limit(5);

      if (services.length > 0) {
        response = '📚 I found these tutoring services for you:\n\n';
        services.forEach(service => {
          response += `• **${service.title}**\n`;
          response += `  💰 $${service.price}${service.priceType === 'hourly' ? '/hr' : ''}\n`;
          response += `  👤 ${service.provider.name}\n`;
          response += `  ⭐ ${service.rating.toFixed(1)} rating\n\n`;
        });
        response += 'Visit the Services page to book a session!';
        matchedItems = services;
      }
    }

    // 2. SERVICE MATCHING - Rides
    else if (lowerMessage.includes('ride') ||
             lowerMessage.includes('drive') ||
             lowerMessage.includes('airport') ||
             lowerMessage.includes('nyc') ||
             lowerMessage.includes('transport')) {

      const services = await Service.find({
        category: 'rides',
        isActive: true
      }).populate('provider', 'name rating').limit(5);

      if (services.length > 0) {
        response = '🚗 Here are available ride options:\n\n';
        services.forEach(service => {
          response += `• **${service.title}**\n`;
          response += `  💰 $${service.price}\n`;
          response += `  📍 ${service.location}\n`;
          response += `  ⭐ ${service.rating.toFixed(1)} rating\n\n`;
        });
        response += 'Check out the Services page for more details!';
        matchedItems = services;
      }
    }

    // 3. SERVICE MATCHING - Errands
    else if (lowerMessage.includes('errand') ||
             lowerMessage.includes('grocery') ||
             lowerMessage.includes('package') ||
             lowerMessage.includes('delivery') ||
             lowerMessage.includes('laundry')) {

      const services = await Service.find({
        category: 'errands',
        isActive: true
      }).populate('provider', 'name rating').limit(5);

      if (services.length > 0) {
        response = '🛒 I can help you find errand services:\n\n';
        services.forEach(service => {
          response += `• **${service.title}**\n`;
          response += `  💰 $${service.price}\n`;
          response += `  ⏰ ${service.availability}\n`;
          response += `  ⭐ ${service.rating.toFixed(1)} rating\n\n`;
        });
        response += 'These students can save you time!';
        matchedItems = services;
      }
    }

    // 4. MARKETPLACE MATCHING - Textbooks
    else if (lowerMessage.includes('textbook') ||
             lowerMessage.includes('book') && !lowerMessage.includes('booking')) {

      const items = await Service.find({
        category: 'marketplace',
        itemType: 'textbook',
        isActive: true
      }).populate('provider', 'name').limit(5);

      if (items.length > 0) {
        response = '📚 Great! I found textbooks in the Marketplace:\n\n';
        items.forEach(item => {
          response += `• **${item.title}**\n`;
          response += `  💰 $${item.price}\n`;
          response += `  📦 Condition: ${item.condition}\n`;
          response += `  👤 ${item.provider.name}\n\n`;
        });
        response += 'Much cheaper than the bookstore! Check the Marketplace tab.';
        matchedItems = items;
      }
    }

    // 5. MARKETPLACE MATCHING - Electronics
    else if (lowerMessage.includes('laptop') ||
             lowerMessage.includes('ipad') ||
             lowerMessage.includes('computer') ||
             lowerMessage.includes('headphone') ||
             lowerMessage.includes('electronics') ||
             lowerMessage.includes('phone')) {

      const items = await Service.find({
        category: 'marketplace',
        itemType: 'electronics',
        isActive: true
      }).populate('provider', 'name').limit(5);

      if (items.length > 0) {
        response = '💻 Found these electronics in the Marketplace:\n\n';
        items.forEach(item => {
          response += `• **${item.title}**\n`;
          response += `  💰 $${item.price}\n`;
          response += `  📦 Condition: ${item.condition}\n`;
          response += `  👤 Seller: ${item.provider.name}\n\n`;
        });
        response += 'Browse the Marketplace for more tech deals!';
        matchedItems = items;
      }
    }

    // 6. MARKETPLACE MATCHING - Furniture
    else if (lowerMessage.includes('furniture') ||
             lowerMessage.includes('desk') ||
             lowerMessage.includes('chair') ||
             lowerMessage.includes('fridge') ||
             lowerMessage.includes('dorm room')) {

      const items = await Service.find({
        category: 'marketplace',
        itemType: 'furniture',
        isActive: true
      }).populate('provider', 'name').limit(5);

      if (items.length > 0) {
        response = '🪑 Check out this furniture for your space:\n\n';
        items.forEach(item => {
          response += `• **${item.title}**\n`;
          response += `  💰 $${item.price}\n`;
          response += `  📦 Condition: ${item.condition}\n`;
          response += `  📍 ${item.location}\n\n`;
        });
        response += 'Great deals from fellow students!';
        matchedItems = items;
      }
    }

    // 7. MARKETPLACE GENERAL
    else if (lowerMessage.includes('marketplace') ||
             lowerMessage.includes('buy') ||
             lowerMessage.includes('sell') ||
             lowerMessage.includes('shopping')) {

      const items = await Service.find({
        category: 'marketplace',
        isActive: true
      }).populate('provider', 'name').limit(6);

      if (items.length > 0) {
        response = '🛍️ The Marketplace has great deals! Here are some items:\n\n';
        items.forEach(item => {
          response += `• **${item.title}** - $${item.price}\n`;
          response += `  📦 ${item.itemType} • ${item.condition}\n\n`;
        });
        response += 'Visit the Marketplace tab to browse all items!';
        matchedItems = items;
      }
    }

    // 8. RENTALS MATCHING - Vehicles (check before general rentals)
    else if ((lowerMessage.includes('bike') ||
              lowerMessage.includes('bicycle') ||
              lowerMessage.includes('scooter') ||
              lowerMessage.includes('car')) &&
             (lowerMessage.includes('rent') || lowerMessage.includes('borrow'))) {

      const vehicles = await Service.find({
        category: 'rentals',
        rentalItemType: 'vehicle',
        isActive: true
      }).populate('provider', 'name').limit(5);

      if (vehicles.length > 0) {
        response = '🚗 Found these vehicles for rent:\n\n';
        vehicles.forEach(vehicle => {
          response += `• **${vehicle.title}**\n`;
          response += `  💰 $${vehicle.price}/${vehicle.rentalPeriod}\n`;
          response += `  💵 Deposit: $${vehicle.deposit}\n`;
          response += `  📍 ${vehicle.location}\n\n`;
        });
        response += 'Perfect for getting around campus or weekend trips!';
        matchedItems = vehicles;
      }
    }

    // 9. RENTALS MATCHING - Equipment (check before general rentals)
    else if ((lowerMessage.includes('camera') ||
              lowerMessage.includes('equipment') ||
              lowerMessage.includes('projector') ||
              lowerMessage.includes('lab equipment')) &&
             (lowerMessage.includes('rent') || lowerMessage.includes('borrow'))) {

      const equipment = await Service.find({
        category: 'rentals',
        rentalItemType: 'equipment',
        isActive: true
      }).populate('provider', 'name').limit(5);

      if (equipment.length > 0) {
        response = '🔧 Here\'s equipment you can rent:\n\n';
        equipment.forEach(item => {
          response += `• **${item.title}**\n`;
          response += `  💰 $${item.price}/${item.rentalPeriod}\n`;
          response += `  💵 Deposit: $${item.deposit}\n`;
          response += `  👤 ${item.provider.name}\n\n`;
        });
        response += 'Great for projects and assignments!';
        matchedItems = equipment;
      }
    }

    // 10. RENTALS MATCHING - General rent queries
    else if (lowerMessage.includes('rent') ||
             lowerMessage.includes('rental') ||
             lowerMessage.includes('borrow')) {

      const rentals = await Service.find({
        category: 'rentals',
        isActive: true
      }).populate('provider', 'name').limit(6);

      if (rentals.length > 0) {
        response = '🔑 Great! Here are rental items available:\n\n';
        rentals.forEach(rental => {
          response += `• **${rental.title}**\n`;
          response += `  💰 $${rental.price}/${rental.rentalPeriod}\n`;
          response += `  🔧 ${rental.rentalItemType} • ${rental.rentalCondition}\n`;
          response += `  💵 Deposit: $${rental.deposit}\n\n`;
        });
        response += 'Check the Rentals tab for more options! Save money by renting instead of buying.';
        matchedItems = rentals;
      }
    }

    // 11. EDUCATIONAL Q&A - Math/Calculus
    else if (lowerMessage.includes('calculus') ||
             lowerMessage.includes('derivative') ||
             lowerMessage.includes('integral') ||
             lowerMessage.includes('limit')) {
      response = `📐 **Calculus Help**\n\nI can help you understand calculus concepts!\n\n• **Derivatives**: Rate of change of a function\n• **Integrals**: Area under a curve\n• **Limits**: Behavior of functions as they approach a value\n\nWould you like me to find a tutor who can help you with calculus? We have experienced math tutors available!`;
    }

    // 9. EDUCATIONAL Q&A - Programming
    else if (lowerMessage.includes('python') ||
             lowerMessage.includes('javascript') ||
             lowerMessage.includes('programming') ||
             lowerMessage.includes('coding')) {
      response = `💻 **Programming Help**\n\nLearning to code? Here are some tips:\n\n• **Start with basics**: Variables, loops, functions\n• **Practice daily**: Solve coding challenges\n• **Build projects**: Apply what you learn\n\nWant personalized help? We have CS students offering Python and programming tutoring!`;
    }

    // 10. EDUCATIONAL Q&A - Chemistry
    else if (lowerMessage.includes('chemistry') ||
             lowerMessage.includes('organic') ||
             lowerMessage.includes('molecule') ||
             lowerMessage.includes('reaction')) {
      response = `🧪 **Chemistry Help**\n\nChemistry can be challenging! Key concepts:\n\n• **Organic Chemistry**: Study of carbon compounds\n• **Chemical Reactions**: How substances interact\n• **Molecular Structure**: Arrangement of atoms\n\nNeed more help? Check out our chemistry tutors or browse the Marketplace for textbooks!`;
    }

    // 11. EDUCATIONAL Q&A - Business & Finance
    else if (lowerMessage.includes('corporate finance') ||
             lowerMessage.includes('finance') ||
             lowerMessage.includes('financial') ||
             lowerMessage.includes('accounting') ||
             lowerMessage.includes('investment')) {
      response = `💼 **Corporate Finance**\n\n**Corporate Finance** manages a company's financial activities and capital structure.\n\n**Key Areas:**\n• **Capital Budgeting**: Deciding which projects to invest in\n• **Capital Structure**: Managing debt and equity financing\n• **Working Capital**: Day-to-day financial operations\n• **Financial Planning**: Forecasting and budgeting\n\n**Core Concepts:**\n• Time value of money (NPV, IRR)\n• Risk vs. Return tradeoffs\n• Cost of capital (WACC)\n• Financial statement analysis\n\n💡 Need deeper help? We have Business & Economics tutors available!`;
    }

    // 12. EDUCATIONAL Q&A - Economics
    else if (lowerMessage.includes('economics') ||
             lowerMessage.includes('supply and demand') ||
             lowerMessage.includes('gdp') ||
             lowerMessage.includes('inflation')) {
      response = `📊 **Economics**\n\n**Core Principles:**\n• **Supply & Demand**: Market price equilibrium\n• **Opportunity Cost**: What you give up for a choice\n• **Marginal Analysis**: Decisions at the margin\n\n**Macro Topics:**\n• GDP, inflation, unemployment\n• Monetary & fiscal policy\n• Economic growth\n\n**Micro Topics:**\n• Consumer behavior\n• Market structures\n• Elasticity\n\nWant tutoring? We have economics experts available!`;
    }

    // 13. EDUCATIONAL Q&A - Physics
    else if (lowerMessage.includes('physics') ||
             lowerMessage.includes('newton') ||
             lowerMessage.includes('force') ||
             lowerMessage.includes('energy') ||
             lowerMessage.includes('motion')) {
      response = `⚡ **Physics**\n\n**Classical Mechanics:**\n• Newton's Laws of Motion\n• Force = Mass × Acceleration\n• Energy conservation\n• Momentum\n\n**Key Concepts:**\n• **Kinematics**: Study of motion\n• **Dynamics**: Forces and motion\n• **Energy**: Kinetic and potential\n• **Waves**: Light, sound, oscillations\n\nNeed help with problem sets? Check our tutoring services!`;
    }

    // 14. EDUCATIONAL Q&A - Biology
    else if (lowerMessage.includes('biology') ||
             lowerMessage.includes('cell') ||
             lowerMessage.includes('dna') ||
             lowerMessage.includes('evolution')) {
      response = `🧬 **Biology**\n\n**Cell Biology:**\n• Prokaryotic vs Eukaryotic cells\n• Cell membrane and organelles\n• Mitosis and meiosis\n\n**Genetics:**\n• DNA structure (double helix)\n• Gene expression\n• Mendelian genetics\n\n**Evolution:**\n• Natural selection\n• Adaptation\n• Speciation\n\nWant to dive deeper? Find biology tutors on our platform!`;
    }

    // 15. EDUCATIONAL Q&A - Statistics
    else if (lowerMessage.includes('statistics') ||
             lowerMessage.includes('probability') ||
             lowerMessage.includes('standard deviation') ||
             lowerMessage.includes('hypothesis')) {
      response = `📈 **Statistics & Probability**\n\n**Descriptive Statistics:**\n• Mean, median, mode\n• Standard deviation\n• Variance\n• Data visualization\n\n**Probability:**\n• Independent events\n• Conditional probability\n• Distributions (normal, binomial)\n\n**Inferential Stats:**\n• Hypothesis testing\n• Confidence intervals\n• P-values\n\nNeed statistical help? Our math tutors can assist!`;
    }

    // 16. EDUCATIONAL Q&A - Computer Science
    else if (lowerMessage.includes('algorithm') ||
             lowerMessage.includes('data structure') ||
             lowerMessage.includes('computer science') ||
             lowerMessage.includes('big o')) {
      response = `💾 **Computer Science**\n\n**Data Structures:**\n• Arrays, linked lists\n• Stacks, queues\n• Trees, graphs\n• Hash tables\n\n**Algorithms:**\n• Sorting (quicksort, mergesort)\n• Searching (binary search)\n• Recursion\n• Dynamic programming\n\n**Complexity:**\n• Big O notation\n• Time vs space tradeoffs\n\nWe have CS tutors who can help you master these concepts!`;
    }

    // 17. EDUCATIONAL Q&A - Marketing
    else if (lowerMessage.includes('marketing') ||
             lowerMessage.includes('brand') ||
             lowerMessage.includes('4 ps')) {
      response = `📢 **Marketing**\n\n**4 Ps of Marketing:**\n• **Product**: What you sell\n• **Price**: Pricing strategy\n• **Place**: Distribution channels\n• **Promotion**: Advertising & communication\n\n**Key Concepts:**\n• Market segmentation\n• Target audience\n• Brand positioning\n• Consumer behavior\n• Digital marketing\n\nNeed marketing help? Check our business tutors!`;
    }

    // 18. EDUCATIONAL Q&A - Psychology
    else if (lowerMessage.includes('psychology') ||
             lowerMessage.includes('cognitive') ||
             lowerMessage.includes('behavior')) {
      response = `🧠 **Psychology**\n\n**Major Areas:**\n• **Cognitive**: Thinking, memory, perception\n• **Developmental**: Growth across lifespan\n• **Social**: How people interact\n• **Clinical**: Mental health & therapy\n\n**Key Concepts:**\n• Classical & operant conditioning\n• Memory systems\n• Personality theories\n• Psychological disorders\n\nInterested in learning more? Explore our tutoring services!`;
    }

    // 19. EDUCATIONAL Q&A - Data Science & ML
    else if (lowerMessage.includes('data science') ||
             lowerMessage.includes('machine learning') ||
             lowerMessage.includes('artificial intelligence') && !lowerMessage.includes('find')) {
      response = `🤖 **Data Science & AI**\n\n**Data Science** is an interdisciplinary field that uses scientific methods, algorithms, and systems to extract knowledge from data.\n\n**Key Components:**\n• **Statistics**: Mathematical foundations for analysis\n• **Programming**: Python, R, SQL for data manipulation\n• **Machine Learning**: Algorithms that learn from data\n• **Data Visualization**: Communicating insights\n• **Domain Knowledge**: Understanding the business context\n\n**Popular Tools:**\n• Python (pandas, NumPy, scikit-learn)\n• SQL & databases\n• Tableau, Power BI\n• TensorFlow, PyTorch (for deep learning)\n\n**Applications:**\n• Predictive analytics\n• Recommendation systems\n• Fraud detection\n• Healthcare diagnostics\n• Business intelligence\n\n**Career Paths:**\n• Data Scientist\n• Machine Learning Engineer\n• Data Analyst\n• AI Researcher\n\n💡 Want to learn more? We have Python programming and statistics tutors available!\n\n🔧 **Pro Tip**: For comprehensive, ChatGPT-like answers on ANY topic, ask the admin to set up the free Groq API (see SETUP_CHATGPT_AI.md)`;
    }

    // 20. EDUCATIONAL Q&A - General "What is" questions
    else if ((lowerMessage.startsWith('what is') ||
              lowerMessage.startsWith('what are') ||
              lowerMessage.startsWith('define') ||
              lowerMessage.includes('explain') ||
              lowerMessage.includes('how does') ||
              lowerMessage.includes('tell me about')) &&
             !lowerMessage.includes('find') &&
             !lowerMessage.includes('show') &&
             !lowerMessage.includes('need')) {
      response = `📚 **Educational Question Detected**\n\nI can help explain concepts! While I have built-in knowledge for many subjects, here are some popular topics:\n\n**Business**: Finance, accounting, economics, marketing\n**Sciences**: Physics, chemistry, biology\n**Math**: Calculus, statistics, algebra\n**Tech**: Programming, algorithms, data structures, **data science**\n**Social**: Psychology, sociology\n\nFor detailed explanations:\n1. I can provide an overview here\n2. Find a tutor for in-depth help\n3. Browse marketplace for textbooks\n\n💡 **Want ChatGPT-level answers?** Ask the admin to enable Groq API (free, 5min setup - see SETUP_CHATGPT_AI.md)\n\nWhat specific topic would you like to learn about?`;
    }

    // 20. PLATFORM INFO - How ONTAP works
    else if (lowerMessage.includes('how') && lowerMessage.includes('work') &&
             !lowerMessage.includes('what is') &&
             !lowerMessage.includes('explain')) {
      response = `🎓 **How ONTAP-SPU Works**\n\nONTAP is your campus marketplace for:\n\n✅ **Services** - Rides, tutoring, errands, campus tasks\n✅ **Marketplace** - Buy/sell textbooks, electronics, furniture\n✅ **Verified Students** - Safe, trusted peer-to-peer\n✅ **Easy Booking** - Request services instantly\n\nEverything you need, from students who get it!`;
    }

    // 21. SAFETY INFO
    else if (lowerMessage.includes('safe') ||
             lowerMessage.includes('trust') ||
             lowerMessage.includes('verify')) {
      response = `🔒 **Your Safety is Our Priority**\n\n🎓 All users verify with university email\n⭐ Rating & review system\n💬 In-app messaging (no personal info sharing)\n🔐 Secure payment processing\n\nOnly verified SPU students can use ONTAP!`;
    }

    // 22. GENERAL SEARCH - Search all services by keyword
    else if (lowerMessage.length > 3) {
      const searchResults = await Service.find({
        $or: [
          { title: { $regex: lowerMessage, $options: 'i' } },
          { description: { $regex: lowerMessage, $options: 'i' } },
          { tags: { $in: [new RegExp(lowerMessage, 'i')] } }
        ],
        isActive: true
      }).populate('provider', 'name rating').limit(5);

      if (searchResults.length > 0) {
        response = `🔍 I found these matches for "${message}":\n\n`;
        searchResults.forEach(item => {
          const icon = item.category === 'marketplace' ? '🛍️' :
                      item.category === 'rides' ? '🚗' :
                      item.category === 'tutoring' ? '📚' : '📦';
          response += `${icon} **${item.title}**\n`;
          response += `  💰 $${item.price}\n`;
          response += `  📂 ${item.category}\n\n`;
        });
        matchedItems = searchResults;
      } else {
        response = `I understand you're asking about "${message}". Here's what I can help you with:\n\n🔍 Find services (tutoring, rides, errands, tasks)\n🛒 Search marketplace items\n📚 Answer educational questions\n💡 Give recommendations\n\nTry asking:\n• "Find tutoring for calculus"\n• "Show marketplace textbooks"\n• "I need a ride to the airport"`;
      }
    }

    // DEFAULT RESPONSE
    if (!response) {
      response = `Hi! I'm OnTap AI. I can help you with:\n\n📚 **Educational Questions** - Ask about subjects\n🔍 **Find Services** - Tutoring, rides, errands, tasks\n🛍️ **Marketplace Search** - Textbooks, electronics, furniture\n💡 **Recommendations** - Get matched with what you need\n\nWhat can I help you with today?`;
    }

    res.json({
      response,
      matchedItems: matchedItems.length > 0 ? matchedItems : null
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({
      error: 'Sorry, I encountered an error. Please try again.',
      details: error.message
    });
  }
});

module.exports = router;
