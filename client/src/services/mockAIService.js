// Mock AI Service with Live Event Simulation
// Simulates real-time AI processing and responses

class MockAIService {
  constructor() {
    this.processingDelay = 1500; // Simulate AI processing time
    this.eventListeners = new Map();
    this.liveData = {
      studySessions: [],
      campusEvents: [],
      aiInteractions: 0,
      activeUsers: 142,
      questionsAnswered: 2847
    };

    // Start live event simulation
    this.startLiveEvents();
  }

  // ============= STUDY ASSISTANT =============

  async generateQuiz(subject, topic, difficulty, questionCount = 5) {
    await this.simulateProcessing();

    const questions = [];
    const questionTypes = ['multiple-choice', 'true-false', 'short-answer'];

    for (let i = 0; i < questionCount; i++) {
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

      questions.push({
        id: `q${i + 1}`,
        type,
        question: this.generateQuestion(subject, topic, difficulty, i + 1),
        options: type === 'multiple-choice' ? this.generateOptions(subject, topic) : null,
        correctAnswer: type === 'multiple-choice' ? Math.floor(Math.random() * 4) : null,
        points: difficulty === 'beginner' ? 5 : difficulty === 'medium' ? 10 : 15,
        explanation: `This tests your understanding of ${topic} in ${subject}.`,
        hints: [
          `Remember the key concepts of ${topic}`,
          `Think about real-world applications`,
          `Review the fundamental principles`
        ]
      });
    }

    this.trackEvent('quiz_generated', { subject, topic, difficulty, questionCount });

    return {
      quizId: this.generateId(),
      title: `${subject}: ${topic} Quiz`,
      difficulty,
      totalQuestions: questionCount,
      estimatedTime: questionCount * 2,
      questions,
      createdAt: new Date().toISOString(),
      aiConfidence: 0.92 + Math.random() * 0.08
    };
  }

  generateQuestion(subject, topic, difficulty, number) {
    const templates = {
      beginner: [
        `What is the definition of ${topic} in ${subject}?`,
        `Which of the following best describes ${topic}?`,
        `True or False: ${topic} is a fundamental concept in ${subject}.`
      ],
      medium: [
        `Explain how ${topic} applies to real-world scenarios in ${subject}.`,
        `Compare and contrast ${topic} with similar concepts in ${subject}.`,
        `What are the key advantages of using ${topic} in ${subject}?`
      ],
      advanced: [
        `Analyze the implications of ${topic} on modern ${subject} practices.`,
        `Design a solution using ${topic} to solve a complex ${subject} problem.`,
        `Evaluate the effectiveness of ${topic} in advanced ${subject} applications.`
      ]
    };

    const questions = templates[difficulty] || templates.medium;
    return questions[number % questions.length];
  }

  generateOptions(subject, topic) {
    return [
      `A fundamental principle of ${topic}`,
      `An advanced application of ${subject}`,
      `A common misconception about ${topic}`,
      `The correct definition of ${topic}`
    ];
  }

  async explainConcept(subject, topic, detailLevel = 'medium') {
    await this.simulateProcessing();

    this.trackEvent('concept_explained', { subject, topic, detailLevel });

    return {
      concept: topic,
      subject,
      definition: `${topic} is a crucial concept in ${subject} that involves understanding key principles and their applications.`,
      keyPoints: [
        `Core foundation: ${topic} builds upon fundamental ${subject} concepts`,
        `Practical application: Used extensively in real-world ${subject} scenarios`,
        `Common patterns: Follows established ${subject} methodologies`,
        `Advanced techniques: Can be extended for complex problem-solving`,
        `Industry relevance: Critical skill for ${subject} professionals`
      ],
      examples: [
        {
          title: 'Basic Example',
          scenario: `Consider a simple ${subject} problem involving ${topic}`,
          solution: `By applying ${topic} principles, we can solve it efficiently`,
          code: detailLevel === 'advanced' ? `// Example implementation\nfunction ${topic.replace(/\s+/g, '')}() {\n  // Your code here\n}` : null
        },
        {
          title: 'Advanced Application',
          scenario: `In production ${subject} systems, ${topic} is used for...`,
          solution: `This demonstrates the scalability of ${topic}`,
          diagram: '📊 Visual representation available'
        }
      ],
      relatedConcepts: [
        `Related Topic 1 in ${subject}`,
        `Related Topic 2 in ${subject}`,
        `Advanced ${topic} techniques`
      ],
      resources: [
        `📚 Textbook: ${subject} Fundamentals, Chapter on ${topic}`,
        `🎥 Video: Understanding ${topic} in 10 minutes`,
        `💻 Interactive: ${topic} Coding Playground`,
        `📄 Research Paper: Advanced ${topic} Applications`
      ],
      practiceProblems: 12,
      estimatedLearningTime: '2-3 hours',
      difficultyRating: detailLevel === 'beginner' ? 2 : detailLevel === 'medium' ? 5 : 8,
      aiConfidence: 0.94
    };
  }

  async generateFlashcards(subject, topic, count = 10) {
    await this.simulateProcessing();

    const flashcards = [];

    for (let i = 0; i < count; i++) {
      flashcards.push({
        id: `fc${i + 1}`,
        front: `Question ${i + 1}: Key concept about ${topic}?`,
        back: `Answer: ${topic} involves understanding ${subject} principles and their application in various scenarios.`,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        tags: [subject, topic, 'key-concept'],
        reviewed: false,
        masteryLevel: 0
      });
    }

    this.trackEvent('flashcards_generated', { subject, topic, count });

    return {
      deckId: this.generateId(),
      title: `${subject}: ${topic} Flashcards`,
      cards: flashcards,
      totalCards: count,
      estimatedReviewTime: count * 0.5,
      createdAt: new Date().toISOString()
    };
  }

  async generateStudyPlan(courses, availableHours, goals) {
    await this.simulateProcessing();

    const plan = {
      planId: this.generateId(),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      totalHours: availableHours,
      optimizationScore: 0.87,
      schedule: []
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const times = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '7:00 PM'];

    courses.forEach((course, idx) => {
      const sessionsPerWeek = Math.ceil(availableHours / courses.length);

      for (let i = 0; i < sessionsPerWeek; i++) {
        plan.schedule.push({
          day: days[i % days.length],
          time: times[(idx + i) % times.length],
          subject: course,
          duration: '1.5 hours',
          activity: ['Review', 'Practice', 'Project Work', 'Quiz'][i % 4],
          priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
          energyLevel: i < 2 ? 'High' : 'Medium'
        });
      }
    });

    this.trackEvent('study_plan_generated', { courses, availableHours });

    return plan;
  }

  // ============= CAREER ADVISOR =============

  async analyzeResume(resumeText) {
    await this.simulateProcessing(2000);

    const wordCount = resumeText.split(/\s+/).length;
    const hasEmail = resumeText.includes('@');
    const hasPhone = /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(resumeText);
    const hasMetrics = /\d+%|\$\d+|increased|decreased|improved/gi.test(resumeText);

    let score = 50;
    if (hasEmail) score += 10;
    if (hasPhone) score += 5;
    if (wordCount > 300 && wordCount < 600) score += 15;
    if (hasMetrics) score += 20;

    this.trackEvent('resume_analyzed', { score, wordCount });

    return {
      analysisId: this.generateId(),
      atsScore: Math.min(score, 98),
      wordCount,
      sections: {
        contact: hasEmail && hasPhone,
        experience: resumeText.toLowerCase().includes('experience'),
        education: resumeText.toLowerCase().includes('education'),
        skills: resumeText.toLowerCase().includes('skills'),
        projects: resumeText.toLowerCase().includes('project')
      },
      keywordMatch: {
        matched: 12,
        total: 20,
        missing: ['Leadership', 'Agile', 'Cloud', 'Analytics']
      },
      improvements: [
        {
          priority: 'high',
          category: 'formatting',
          issue: 'Add more quantifiable achievements',
          impact: '+15 ATS points'
        },
        {
          priority: 'medium',
          category: 'keywords',
          issue: 'Include industry-specific terms',
          impact: '+10 ATS points'
        }
      ],
      industryBenchmark: {
        yourScore: score,
        averageScore: 72,
        topPercentile: 85
      },
      estimatedCallbackRate: `${score}%`,
      analyzedAt: new Date().toISOString()
    };
  }

  async generateMockInterview(role, difficulty) {
    await this.simulateProcessing();

    const questions = [
      {
        id: 1,
        question: `Tell me about yourself and why you're interested in ${role}.`,
        type: 'behavioral',
        difficulty: 'easy',
        expectedTime: '2-3 minutes',
        keyPoints: ['Background', 'Motivation', 'Career goals'],
        tips: 'Use the STAR method to structure your answer'
      },
      {
        id: 2,
        question: `Describe a challenging project you worked on in ${role}.`,
        type: 'experience',
        difficulty: 'medium',
        expectedTime: '3-4 minutes',
        keyPoints: ['Problem', 'Approach', 'Result', 'Learning'],
        tips: 'Focus on your specific contributions and measurable outcomes'
      },
      {
        id: 3,
        question: `What technical skills are most important for ${role}?`,
        type: 'technical',
        difficulty: 'medium',
        expectedTime: '2 minutes',
        keyPoints: ['Core skills', 'Tools', 'Best practices'],
        tips: 'Demonstrate depth of knowledge with specific examples'
      }
    ];

    this.trackEvent('mock_interview_started', { role, difficulty });

    return {
      interviewId: this.generateId(),
      role,
      difficulty,
      questions,
      totalQuestions: questions.length,
      estimatedDuration: '15-20 minutes',
      aiEvaluationEnabled: true,
      recordingEnabled: false
    };
  }

  // ============= SMART CAMPUS =============

  async getCampusLiveData() {
    // This runs continuously
    return {
      shuttles: [
        {
          id: 'shuttle-1',
          route: 'Campus Loop',
          currentLocation: { lat: 40.7128, lng: -74.0060 },
          nextStop: 'Library',
          eta: '3 min',
          occupancy: 15,
          capacity: 40,
          speed: 25,
          status: 'active'
        },
        {
          id: 'shuttle-2',
          route: 'Dorm Express',
          currentLocation: { lat: 40.7138, lng: -74.0070 },
          nextStop: 'Student Center',
          eta: '7 min',
          occupancy: 32,
          capacity: 40,
          speed: 20,
          status: 'active'
        }
      ],
      cafeterias: [
        {
          name: 'Main Dining Hall',
          crowdLevel: 'moderate',
          waitTime: '5-10 min',
          capacity: 200,
          currentCount: 87,
          peakHours: ['12:00 PM', '6:00 PM'],
          menuToday: ['Pizza', 'Salad Bar', 'Grill Station']
        },
        {
          name: 'Food Court',
          crowdLevel: 'busy',
          waitTime: '10-15 min',
          capacity: 150,
          currentCount: 132,
          peakHours: ['12:30 PM', '6:30 PM'],
          menuToday: ['Asian', 'Mexican', 'Sandwiches']
        }
      ],
      studySpaces: [
        {
          location: 'Library - 2nd Floor',
          available: 12,
          total: 45,
          quietLevel: 'silent',
          amenities: ['Power outlets', 'WiFi', 'Whiteboards']
        },
        {
          location: 'Student Center',
          available: 28,
          total: 60,
          quietLevel: 'moderate',
          amenities: ['Power outlets', 'WiFi', 'Group tables']
        }
      ],
      events: [
        {
          title: 'Tech Talk: AI in Education',
          location: 'Auditorium A',
          startTime: '3:00 PM',
          duration: '1 hour',
          attendees: 45,
          capacity: 100
        },
        {
          title: 'Study Group: Calculus',
          location: 'Library Room 201',
          startTime: '4:30 PM',
          duration: '2 hours',
          attendees: 8,
          capacity: 12
        }
      ],
      lastUpdated: new Date().toISOString()
    };
  }

  async predictShuttleArrival(shuttleId, stopName) {
    await this.simulateProcessing(500);

    const predictions = {
      shuttleId,
      stop: stopName,
      predictions: [
        { time: '3 min', confidence: 0.95 },
        { time: '18 min', confidence: 0.89 },
        { time: '33 min', confidence: 0.82 }
      ],
      averageWait: '12 minutes',
      crowdForecast: 'Moderate',
      recommendation: 'Current shuttle has low occupancy - good time to board!',
      alternativeRoutes: [
        { route: 'Walk', time: '15 min', distance: '0.7 miles' }
      ]
    };

    this.trackEvent('shuttle_prediction_requested', { shuttleId, stopName });

    return predictions;
  }

  // ============= WELLNESS COACH =============

  async getWellnessInsights(userId) {
    await this.simulateProcessing(800);

    const avgMood = 6 + Math.floor(Math.random() * 3);
    const energyLevel = 5 + Math.floor(Math.random() * 4);
    const stressLevel = 3 + Math.floor(Math.random() * 5);
    const sleepHours = 6 + Math.floor(Math.random() * 3);

    const weekTrend = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      mood: 4 + Math.floor(Math.random() * 6)
    }));

    const recommendations = [
      {
        type: 'urgent',
        icon: '😴',
        title: 'Improve Sleep Quality',
        description: `You averaged only ${sleepHours} hours of sleep. Try to get 7-8 hours for optimal wellness.`,
        action: 'Set Sleep Schedule'
      },
      {
        type: 'suggestion',
        icon: '🧘',
        title: 'Mindfulness Break',
        description: 'Your stress levels are elevated. A 10-minute meditation could help.',
        action: 'Start Meditation'
      },
      {
        type: 'recommendation',
        icon: '🏃',
        title: 'Physical Activity',
        description: 'Regular exercise can boost your energy and mood. Try a 20-minute walk.',
        action: 'Log Activity'
      },
      {
        type: 'suggestion',
        icon: '💧',
        title: 'Stay Hydrated',
        description: 'Drinking water helps maintain energy levels and cognitive function.',
        action: 'Set Reminder'
      }
    ];

    const suggestedActivities = [
      {
        icon: '🧘',
        name: 'Guided Meditation',
        description: 'Reduce stress and improve focus with mindfulness',
        duration: '10 min',
        benefit: 'Reduces stress'
      },
      {
        icon: '🚶',
        name: 'Nature Walk',
        description: 'Get fresh air and clear your mind',
        duration: '20 min',
        benefit: 'Boosts mood'
      },
      {
        icon: '📓',
        name: 'Gratitude Journal',
        description: 'Reflect on positive aspects of your day',
        duration: '5 min',
        benefit: 'Increases positivity'
      },
      {
        icon: '💪',
        name: 'Stretching Routine',
        description: 'Release tension and improve flexibility',
        duration: '15 min',
        benefit: 'Reduces tension'
      },
      {
        icon: '🎵',
        name: 'Music Therapy',
        description: 'Listen to calming music to relax',
        duration: '15 min',
        benefit: 'Calms mind'
      },
      {
        icon: '☕',
        name: 'Breathing Exercise',
        description: 'Deep breathing to reduce anxiety',
        duration: '5 min',
        benefit: 'Reduces anxiety'
      }
    ];

    this.trackEvent('wellness_insights_requested', { userId });

    return {
      avgMood,
      energyLevel,
      stressLevel,
      sleepHours,
      wellnessScore: Math.round((avgMood * 10 + energyLevel * 8 + (10 - stressLevel) * 7 + sleepHours * 5) / 3),
      weekTrend,
      recommendations,
      suggestedActivities,
      moodPattern: 'Your mood tends to be higher on weekends and dips mid-week',
      energyPeak: 'Morning hours (9-11 AM) show highest energy levels',
      stressTrigger: 'Deadlines and exam periods correlate with increased stress'
    };
  }

  // ============= RESEARCH ASSISTANT =============

  async summarizePaper(paperTitle, paperText) {
    await this.simulateProcessing(2500);

    return {
      title: paperTitle,
      summary: `This paper explores key concepts in the field, presenting novel insights and methodologies. The research demonstrates significant findings that contribute to the understanding of the subject matter.`,
      keyFindings: [
        'Primary discovery showing 35% improvement',
        'Novel methodology for analysis',
        'Validation through extensive testing',
        'Implications for future research'
      ],
      methodology: 'Experimental study with control group',
      citations: 42,
      relevanceScore: 0.87,
      relatedPapers: [
        'Similar Study on Topic A (2023)',
        'Foundation Research (2021)',
        'Recent Developments (2024)'
      ],
      generatedCitation: {
        apa: `Author, A. (2024). ${paperTitle}. Journal Name, 10(2), 123-145.`,
        mla: `Author, First. "${paperTitle}." Journal Name 10.2 (2024): 123-145.`,
        chicago: `Author, First. "${paperTitle}." Journal Name 10, no. 2 (2024): 123-145.`
      }
    };
  }

  // ============= HELPER METHODS =============

  async simulateProcessing(delay) {
    const processingTime = delay || this.processingDelay;
    return new Promise(resolve => setTimeout(resolve, processingTime));
  }

  generateId() {
    return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  trackEvent(eventType, data) {
    this.liveData.aiInteractions++;

    const event = {
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
      userId: 'demo_user'
    };

    // Emit event to listeners
    if (this.eventListeners.has(eventType)) {
      this.eventListeners.get(eventType).forEach(callback => callback(event));
    }

    // Emit to global listeners
    if (this.eventListeners.has('*')) {
      this.eventListeners.get('*').forEach(callback => callback(event));
    }
  }

  // Live event system
  addEventListener(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType).push(callback);
  }

  removeEventListener(eventType, callback) {
    if (this.eventListeners.has(eventType)) {
      const listeners = this.eventListeners.get(eventType);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  startLiveEvents() {
    // Simulate live platform activity
    setInterval(() => {
      this.liveData.activeUsers = 120 + Math.floor(Math.random() * 50);

      // Random events
      const events = [
        { type: 'new_question', message: 'Student asked about Data Structures' },
        { type: 'quiz_completed', message: 'Quiz completed with 85% score' },
        { type: 'study_session_started', message: 'New study session: Calculus' },
        { type: 'peer_online', message: 'Study partner joined' }
      ];

      const randomEvent = events[Math.floor(Math.random() * events.length)];
      this.trackEvent('live_activity', randomEvent);
    }, 15000); // Every 15 seconds
  }

  getLiveStats() {
    return {
      ...this.liveData,
      questionsAnswered: this.liveData.questionsAnswered + Math.floor(Math.random() * 5),
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export default new MockAIService();
