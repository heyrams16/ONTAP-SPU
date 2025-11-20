import React, { useState, useEffect } from 'react';
import './AIStudyAssistant.css';
import mockAIService from '../services/mockAIService';

function AIStudyAssistant() {
  const [activeMode, setActiveMode] = useState('quiz');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock study plan data
  const studyPlan = [
    { time: '9:00 AM', subject: 'Computer Science', task: 'Data Structures Review', duration: '1 hour', status: 'completed' },
    { time: '11:00 AM', subject: 'Mathematics', task: 'Calculus Practice', duration: '45 mins', status: 'in-progress' },
    { time: '2:00 PM', subject: 'Physics', task: 'Quantum Mechanics', duration: '1.5 hours', status: 'pending' },
    { time: '5:00 PM', subject: 'Chemistry', task: 'Organic Chemistry Lab', duration: '2 hours', status: 'pending' }
  ];

  const recentTopics = [
    { subject: 'Data Structures', mastery: 85, icon: '💻' },
    { subject: 'Calculus', mastery: 72, icon: '📐' },
    { subject: 'Physics', mastery: 68, icon: '⚛️' },
    { subject: 'Chemistry', mastery: 91, icon: '🧪' }
  ];

  const handleGenerate = async () => {
    if (!subject || !topic) {
      alert('Please enter both subject and topic');
      return;
    }

    setIsProcessing(true);

    try {
      if (activeMode === 'quiz') {
        const quiz = await mockAIService.generateQuiz(subject, topic, difficulty, 5);
        setGeneratedContent(quiz);
      } else if (activeMode === 'explain') {
        const explanation = await mockAIService.explainConcept(subject, topic);
        setGeneratedContent(explanation);
      } else if (activeMode === 'flashcards') {
        const flashcards = await mockAIService.generateFlashcards(subject, topic, 6);
        setGeneratedContent(flashcards);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const modes = [
    { id: 'quiz', name: 'Generate Quiz', icon: '📝', description: 'Practice questions' },
    { id: 'explain', name: 'Explain Concept', icon: '💡', description: 'Detailed explanations' },
    { id: 'flashcards', name: 'Flashcards', icon: '🎴', description: 'Memory practice' },
    { id: 'schedule', name: 'Study Plan', icon: '📅', description: 'Optimize schedule' }
  ];

  return (
    <div className="ai-study-page">
      <div className="container">
        {/* Header */}
        <div className="study-header">
          <div className="header-top">
            <button className="back-btn" onClick={() => window.history.back()}>
              ← Back
            </button>
            <div className="privacy-indicator">
              <span className="privacy-dot"></span>
              Processing Locally
            </div>
          </div>
          <h1>📚 AI Study Assistant</h1>
          <p className="header-subtitle">
            Personalized learning powered by privacy-first AI
          </p>
        </div>

        <div className="study-content">
          {/* Sidebar */}
          <div className="study-sidebar">
            <div className="sidebar-section">
              <h3>Today's Schedule</h3>
              <div className="schedule-list">
                {studyPlan.map((item, idx) => (
                  <div key={idx} className={`schedule-item ${item.status}`}>
                    <div className="schedule-time">{item.time}</div>
                    <div className="schedule-details">
                      <div className="schedule-subject">{item.subject}</div>
                      <div className="schedule-task">{item.task}</div>
                      <div className="schedule-duration">{item.duration}</div>
                    </div>
                    <div className="schedule-status">
                      {item.status === 'completed' && '✓'}
                      {item.status === 'in-progress' && '⏱'}
                      {item.status === 'pending' && '○'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Topic Mastery</h3>
              <div className="mastery-list">
                {recentTopics.map((topic, idx) => (
                  <div key={idx} className="mastery-item">
                    <div className="mastery-icon">{topic.icon}</div>
                    <div className="mastery-info">
                      <div className="mastery-subject">{topic.subject}</div>
                      <div className="mastery-bar">
                        <div
                          className="mastery-fill"
                          style={{ width: `${topic.mastery}%` }}
                        ></div>
                      </div>
                      <div className="mastery-percent">{topic.mastery}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="study-main">
            {/* Mode Selection */}
            <div className="mode-selector">
              {modes.map(mode => (
                <div
                  key={mode.id}
                  className={`mode-card ${activeMode === mode.id ? 'active' : ''}`}
                  onClick={() => setActiveMode(mode.id)}
                >
                  <div className="mode-icon">{mode.icon}</div>
                  <div className="mode-name">{mode.name}</div>
                  <div className="mode-description">{mode.description}</div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <div className="study-form">
              <h3>What would you like to learn?</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    placeholder="e.g., Computer Science, Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Topic</label>
                  <input
                    type="text"
                    placeholder="e.g., Binary Search Trees, Calculus"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Difficulty Level</label>
                <div className="difficulty-selector">
                  {['beginner', 'medium', 'advanced'].map(level => (
                    <button
                      key={level}
                      className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                      onClick={() => setDifficulty(level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-small"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    ✨ Generate {modes.find(m => m.id === activeMode)?.name}
                  </>
                )}
              </button>
            </div>

            {/* Generated Content */}
            {generatedContent && (
              <div className="generated-content">
                {generatedContent.type === 'quiz' && (
                  <div className="quiz-content">
                    <h3>Generated Quiz</h3>
                    <div className="quiz-questions">
                      {generatedContent.questions.map((q, idx) => (
                        <div key={q.id} className="quiz-question">
                          <div className="question-header">
                            <span className="question-number">Question {idx + 1}</span>
                            {q.type === 'open' && <span className="question-type">Open-ended</span>}
                          </div>
                          <p className="question-text">{q.question}</p>
                          {q.options && (
                            <div className="question-options">
                              {q.options.map((opt, i) => (
                                <label key={i} className="option-label">
                                  <input type="radio" name={`q${q.id}`} />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          {q.hint && (
                            <div className="question-hint">
                              💡 Hint: {q.hint}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <button className="submit-quiz-btn">Submit Answers</button>
                  </div>
                )}

                {generatedContent.type === 'explanation' && (
                  <div className="explanation-content">
                    <h3>Concept Explanation</h3>
                    <div className="explanation-definition">
                      <h4>Definition</h4>
                      <p>{generatedContent.content.definition}</p>
                    </div>
                    <div className="explanation-points">
                      <h4>Key Points</h4>
                      <ul>
                        {generatedContent.content.keyPoints.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="explanation-examples">
                      <h4>Examples</h4>
                      {generatedContent.content.examples.map((ex, idx) => (
                        <div key={idx} className="example-box">
                          <h5>{ex.title}</h5>
                          <p>{ex.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="explanation-resources">
                      <h4>Additional Resources</h4>
                      <ul>
                        {generatedContent.content.resources.map((res, idx) => (
                          <li key={idx}>{res}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {generatedContent.type === 'flashcards' && (
                  <div className="flashcards-content">
                    <h3>Study Flashcards</h3>
                    <div className="flashcards-grid">
                      {generatedContent.cards.map((card, idx) => (
                        <div key={idx} className="flashcard">
                          <div className="flashcard-inner">
                            <div className="flashcard-front">
                              <span className="card-label">Question</span>
                              <p>{card.front}</p>
                            </div>
                            <div className="flashcard-back">
                              <span className="card-label">Answer</span>
                              <p>{card.back}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIStudyAssistant;
