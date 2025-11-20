import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResumeOptimizer.css';

function ResumeOptimizer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [linkedInKeywords, setLinkedInKeywords] = useState([]);

  // Common ATS keywords by industry
  const industryKeywords = {
    'software-engineering': [
      'Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes',
      'Git', 'CI/CD', 'Agile', 'REST API', 'Microservices', 'SQL', 'MongoDB'
    ],
    'data-science': [
      'Machine Learning', 'Python', 'R', 'TensorFlow', 'PyTorch', 'SQL',
      'Data Analysis', 'Statistics', 'Pandas', 'NumPy', 'Visualization', 'ETL'
    ],
    'business-analyst': [
      'SQL', 'Excel', 'Tableau', 'Power BI', 'Requirements Gathering',
      'Stakeholder Management', 'Agile', 'JIRA', 'Process Improvement', 'KPIs'
    ],
    'marketing': [
      'SEO', 'Google Analytics', 'Content Marketing', 'Social Media',
      'Campaign Management', 'A/B Testing', 'Email Marketing', 'CRM', 'ROI'
    ]
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      // Extract text from file (simplified - in production use proper PDF/DOCX parser)
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result);
        analyzeResume(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const analyzeResume = (text) => {
    setLoading(true);

    // Simulate analysis (in production, call backend API)
    setTimeout(() => {
      const words = text.toLowerCase().split(/\s+/);
      const wordCount = words.length;

      // Calculate ATS score based on various factors
      let score = 50; // Base score

      // Check for contact info
      if (text.includes('@') || text.includes('email')) score += 10;
      if (text.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/)) score += 5;

      // Check for sections
      const sections = ['experience', 'education', 'skills', 'projects'];
      sections.forEach(section => {
        if (text.toLowerCase().includes(section)) score += 5;
      });

      // Check for keywords
      const roleKeywords = industryKeywords[targetRole] || [];
      const matchedKeywords = roleKeywords.filter(keyword =>
        text.toLowerCase().includes(keyword.toLowerCase())
      );
      score += Math.min(matchedKeywords.length * 2, 20);

      // Check for quantifiable achievements
      const hasNumbers = text.match(/\d+%|\$\d+|increased|decreased|improved/gi);
      if (hasNumbers && hasNumbers.length > 0) score += 10;

      setAtsScore(Math.min(score, 100));

      // Generate suggestions
      const newSuggestions = [];

      if (wordCount < 300) {
        newSuggestions.push({
          type: 'warning',
          title: 'Resume too short',
          description: 'Your resume should be 300-600 words. Add more details about your experience.',
          priority: 'high'
        });
      }

      if (wordCount > 800) {
        newSuggestions.push({
          type: 'warning',
          title: 'Resume too long',
          description: 'Keep your resume concise. Aim for 300-600 words for better ATS compatibility.',
          priority: 'medium'
        });
      }

      if (!text.toLowerCase().includes('experience')) {
        newSuggestions.push({
          type: 'error',
          title: 'Missing Experience section',
          description: 'Add a clear "Work Experience" or "Experience" section.',
          priority: 'high'
        });
      }

      if (!text.toLowerCase().includes('education')) {
        newSuggestions.push({
          type: 'error',
          title: 'Missing Education section',
          description: 'Include your education background.',
          priority: 'high'
        });
      }

      const missingKeywords = roleKeywords.filter(keyword =>
        !text.toLowerCase().includes(keyword.toLowerCase())
      );

      if (missingKeywords.length > 0) {
        newSuggestions.push({
          type: 'info',
          title: 'Add relevant keywords',
          description: `Consider adding: ${missingKeywords.slice(0, 5).join(', ')}`,
          priority: 'medium',
          keywords: missingKeywords
        });
      }

      if (!hasNumbers || hasNumbers.length < 3) {
        newSuggestions.push({
          type: 'info',
          title: 'Add quantifiable achievements',
          description: 'Include numbers, percentages, or metrics to show impact (e.g., "Increased sales by 25%")',
          priority: 'medium'
        });
      }

      setSuggestions(newSuggestions);
      setLinkedInKeywords(matchedKeywords);
      setLoading(false);

      setAnalysis({
        wordCount,
        hasContactInfo: text.includes('@'),
        sections: sections.filter(s => text.toLowerCase().includes(s)),
        matchedKeywords,
        missingKeywords: missingKeywords.slice(0, 10)
      });
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#f44336';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return '#f44336';
    if (priority === 'medium') return '#FF9800';
    return '#2196F3';
  };

  return (
    <div className="resume-optimizer-page">
      <div className="container">
        <div className="page-header">
          <h1>📄 ATS Resume Optimizer</h1>
          <p>Optimize your resume for Applicant Tracking Systems with AI-powered suggestions</p>
        </div>

        <div className="optimizer-content">
          {/* Upload Section */}
          <div className="upload-section">
            <div className="upload-card">
              <div className="upload-icon">📤</div>
              <h3>Upload Your Resume</h3>
              <p>Supported formats: PDF, DOCX, TXT</p>

              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="resume-upload" className="upload-btn">
                Choose File
              </label>

              {resumeFile && (
                <div className="file-info">
                  ✓ {resumeFile.name}
                </div>
              )}
            </div>

            <div className="role-selector">
              <label>Target Role:</label>
              <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                <option value="">Select target role</option>
                <option value="software-engineering">Software Engineering</option>
                <option value="data-science">Data Science</option>
                <option value="business-analyst">Business Analyst</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>

            {resumeText && (
              <div className="resume-preview">
                <h4>Resume Preview</h4>
                <textarea
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                    analyzeResume(e.target.value);
                  }}
                  rows={10}
                  placeholder="Paste your resume text here or upload a file..."
                />
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Analyzing your resume...</p>
            </div>
          )}

          {analysis && !loading && (
            <div className="analysis-results">
              {/* ATS Score */}
              <div className="score-card">
                <div className="score-header">
                  <h2>ATS Compatibility Score</h2>
                  <p>How likely your resume will pass automated screening</p>
                </div>
                <div className="score-display">
                  <div className="score-circle" style={{ borderColor: getScoreColor(atsScore) }}>
                    <span className="score-number" style={{ color: getScoreColor(atsScore) }}>
                      {atsScore}
                    </span>
                    <span className="score-label">/ 100</span>
                  </div>
                  <div className="score-description">
                    {atsScore >= 80 && '🎉 Excellent! Your resume is well-optimized for ATS.'}
                    {atsScore >= 60 && atsScore < 80 && "👍 Good, but there's room for improvement."}
                    {atsScore < 60 && '⚠️ Needs improvement to pass ATS screening.'}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{analysis.wordCount}</div>
                  <div className="stat-label">Words</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{analysis.sections.length}</div>
                  <div className="stat-label">Sections Found</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{analysis.matchedKeywords.length}</div>
                  <div className="stat-label">Keywords Matched</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{analysis.missingKeywords.length}</div>
                  <div className="stat-label">Suggested Keywords</div>
                </div>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="suggestions-section">
                  <h3>💡 Optimization Suggestions</h3>
                  <div className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className={`suggestion-card ${suggestion.type}`}>
                        <div className="suggestion-header">
                          <span className="priority-badge" style={{ backgroundColor: getPriorityColor(suggestion.priority) }}>
                            {suggestion.priority}
                          </span>
                          <h4>{suggestion.title}</h4>
                        </div>
                        <p>{suggestion.description}</p>
                        {suggestion.keywords && (
                          <div className="keyword-chips">
                            {suggestion.keywords.slice(0, 8).map((keyword, idx) => (
                              <span key={idx} className="keyword-chip">{keyword}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Keywords */}
              {linkedInKeywords.length > 0 && (
                <div className="keywords-section">
                  <h3>✓ Keywords Found in Your Resume</h3>
                  <div className="keyword-chips success">
                    {linkedInKeywords.map((keyword, idx) => (
                      <span key={idx} className="keyword-chip">{keyword}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {analysis.missingKeywords.length > 0 && (
                <div className="keywords-section">
                  <h3>+ Recommended Keywords to Add</h3>
                  <p className="keywords-hint">Based on similar profiles in your target role</p>
                  <div className="keyword-chips">
                    {analysis.missingKeywords.map((keyword, idx) => (
                      <span key={idx} className="keyword-chip clickable">
                        {keyword}
                        <span className="add-icon">+</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeOptimizer;
