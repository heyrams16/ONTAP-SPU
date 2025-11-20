import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './OnTapAI.css';

function OnTapAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m OnTap AI, your campus assistant. I can help you find services, marketplace items, answer questions about campus life, and more! You can also upload files for instant assistance! How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    'Find tutoring services',
    'Search marketplace for textbooks',
    'Show me rides to NYC',
    'Help with campus errands'
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles(prev => {
      const updated = [...prev];
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    // Create user message with text and files
    const userMessage = {
      role: 'user',
      content: input || 'Uploaded files',
      files: attachedFiles.map(f => ({ name: f.name, type: f.type, size: f.size, preview: f.preview }))
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentFiles = [...attachedFiles];
    setInput('');
    setAttachedFiles([]);
    setIsTyping(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('message', currentInput);

      currentFiles.forEach((fileObj, index) => {
        formData.append(`files`, fileObj.file);
      });

      // Call the AI API with file support
      const response = await axios.post('/api/ai/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const aiResponse = response.data.response;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('AI Error:', error);
      let errorMessage = 'Sorry, I encountered an error. ';

      if (currentFiles.length > 0) {
        errorMessage += 'I can analyze images, PDFs, and documents. Please make sure your files are valid.';
      } else {
        errorMessage += 'Please try again or check your connection.';
      }

      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsTyping(false);
      // Clean up file previews
      currentFiles.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    }
  };

  const handleQuickAction = (action) => {
    setInput(action);
    handleSend();
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        className={`ontap-ai-button ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open OnTap AI"
      >
        <span className="ai-icon">🤖</span>
        <span className="ai-pulse"></span>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="ontap-ai-window">
          <div className="ai-header">
            <div className="ai-title">
              <span className="ai-icon">🤖</span>
              <div>
                <h3>OnTap AI</h3>
                <span className="ai-status">Online</span>
              </div>
            </div>
            <button
              className="ai-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="ai-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-message ${msg.role}`}>
                {msg.role === 'assistant' && <span className="msg-icon">🤖</span>}
                <div className="msg-content">
                  {msg.content}
                  {msg.files && msg.files.length > 0 && (
                    <div className="message-files">
                      {msg.files.map((file, fileIdx) => (
                        <div key={fileIdx} className="message-file-item">
                          {file.preview ? (
                            <img src={file.preview} alt={file.name} className="file-preview-img" />
                          ) : (
                            <div className="file-icon">
                              📄
                            </div>
                          )}
                          <span className="file-name">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && <span className="msg-icon">👤</span>}
              </div>
            ))}
            {isTyping && (
              <div className="ai-message assistant">
                <span className="msg-icon">🤖</span>
                <div className="msg-content typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="ai-quick-actions">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Attached Files Preview */}
          {attachedFiles.length > 0 && (
            <div className="attached-files-preview">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="attached-file-chip">
                  {file.preview ? (
                    <img src={file.preview} alt={file.name} className="chip-preview" />
                  ) : (
                    <span className="chip-icon">📄</span>
                  )}
                  <span className="chip-name">{file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}</span>
                  <button
                    className="chip-remove"
                    onClick={() => handleRemoveFile(idx)}
                    aria-label="Remove file"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="ai-input-area">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
            />
            <button
              className="ai-attach-btn"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach files"
              title="Upload images, PDFs, or documents"
            >
              📎
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything or upload files..."
              className="ai-input"
            />
            <button
              onClick={handleSend}
              className="ai-send-btn"
              disabled={!input.trim() && attachedFiles.length === 0}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default OnTapAI;
