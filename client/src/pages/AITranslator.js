import React, { useState, useRef, useEffect } from 'react';
import './AITranslator.css';

function AITranslator() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [error, setError] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);

  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const languages = [
    { code: 'auto', name: 'Auto Detect' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ur', name: 'Urdu' },
    { code: 'bn', name: 'Bengali' },
    { code: 'tr', name: 'Turkish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' }
  ];

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(prev => prev + finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    setError('');
    setTranscript('');
    setTranslatedText('');
    setAudioURL('');
    setAudioBlob(null);
    audioChunksRef.current = [];

    // Start MediaRecorder for saving audio
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      setError('Could not access microphone. Please allow microphone permissions.');
      return;
    }

    if (recognitionRef.current) {
      // Set language for recognition
      if (sourceLanguage !== 'auto') {
        recognitionRef.current.lang = sourceLanguage;
      } else {
        recognitionRef.current.lang = 'en-US';
      }

      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      setError('Speech recognition not supported in this browser. Please use Chrome.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);

    // Auto-translate after stopping
    if (transcript) {
      translateText(transcript);
    }
  };

  const downloadRecording = () => {
    if (!audioBlob) return;

    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessingFile(true);
    setError('');
    setTranscript('');
    setTranslatedText('');

    // For demo purposes, show a simulated transcription
    // In production, you'd send this to a speech-to-text API
    setTimeout(() => {
      const demoTranscripts = {
        'audio/mp3': 'This is a demonstration of audio file transcription. In a production environment, this would be processed by a speech-to-text service like Google Cloud Speech, AWS Transcribe, or OpenAI Whisper.',
        'audio/wav': 'Audio file successfully uploaded and processed. The transcription service would convert your speech to text here.',
        'audio/mpeg': 'Your recording has been processed. This demo shows how the translator would work with real audio files.',
        'default': 'Audio file received. For full functionality, integrate with a speech-to-text API service.'
      };

      const transcriptText = demoTranscripts[file.type] || demoTranscripts['default'];
      setTranscript(transcriptText);
      setIsProcessingFile(false);
      translateText(transcriptText);
    }, 2000);
  };

  const translateText = async (text) => {
    if (!text.trim()) return;

    setIsTranslating(true);
    setError('');

    try {
      // Use LibreTranslate API (free and open source)
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage === 'auto' ? 'auto' : sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translatedText);
        if (data.detectedLanguage) {
          setDetectedLanguage(data.detectedLanguage.language);
        }
      } else {
        // Fallback to mock translation
        setTranslatedText(getMockTranslation(text, targetLanguage));
      }
    } catch (err) {
      // Fallback to mock translation for demo
      setTranslatedText(getMockTranslation(text, targetLanguage));
    } finally {
      setIsTranslating(false);
    }
  };

  const getMockTranslation = (text, target) => {
    // Demo translations for showcase
    const translations = {
      'es': `[Spanish Translation]\n${text.split(' ').map(w => w + 'o').join(' ')}`,
      'fr': `[French Translation]\n${text.split(' ').map(w => 'le ' + w).join(' ')}`,
      'de': `[German Translation]\n${text.split(' ').map(w => w + 'en').join(' ')}`,
      'ja': `[Japanese Translation]\n${text}の日本語訳`,
      'zh': `[Chinese Translation]\n${text}的中文翻译`,
      'ar': `[Arabic Translation]\n${text} الترجمة العربية`,
      'hi': `[Hindi Translation]\n${text} का हिंदी अनुवाद`,
      'default': `[${languages.find(l => l.code === target)?.name || target} Translation]\n${text}`
    };

    return translations[target] || translations['default'];
  };

  const speakTranslation = () => {
    if (!translatedText) return;

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLanguage;
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setTranscript('');
    setTranslatedText('');
    setUploadedFile(null);
    setDetectedLanguage('');
    setError('');
    setAudioURL('');
    setAudioBlob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="translator-page">
      {/* Header */}
      <div className="translator-header">
        <button className="back-btn" onClick={() => window.history.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="header-content">
          <h1>AI Translator</h1>
          <p>Translate any language instantly</p>
        </div>
      </div>

      <div className="translator-container">
        {/* Language Selection */}
        <div className="language-selector">
          <div className="language-select-group">
            <label>From</label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <button className="swap-btn" onClick={() => {
            if (sourceLanguage !== 'auto') {
              const temp = sourceLanguage;
              setSourceLanguage(targetLanguage);
              setTargetLanguage(temp);
            }
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="language-select-group">
            <label>To</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              {languages.filter(l => l.code !== 'auto').map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Methods */}
        <div className="input-methods">
          {/* Live Recording */}
          <div className="input-card">
            <div className="card-header">
              <h3>Live Recording</h3>
              <span className="badge">Real-time</span>
            </div>
            <p>Speak and get instant translation</p>

            <button
              className={`record-btn ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <>
                  <span className="pulse-dot"></span>
                  Stop Recording
                </>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 19V23M8 23H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Start Recording
                </>
              )}
            </button>

            {/* Audio Playback & Download */}
            {audioURL && (
              <div className="audio-controls">
                <audio controls src={audioURL} className="audio-player" />
                <button className="download-btn" onClick={downloadRecording}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Save Recording
                </button>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="input-card">
            <div className="card-header">
              <h3>Upload Audio</h3>
              <span className="badge">File</span>
            </div>
            <p>Upload audio file for translation</p>

            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />

            <button
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingFile}
            >
              {isProcessingFile ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Upload File
                </>
              )}
            </button>

            {uploadedFile && (
              <div className="file-info">
                <span>{uploadedFile.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* Results */}
        <div className="results-section">
          {/* Original Text */}
          <div className="result-card">
            <div className="result-header">
              <h4>Original Text</h4>
              {detectedLanguage && (
                <span className="detected-lang">
                  Detected: {languages.find(l => l.code === detectedLanguage)?.name || detectedLanguage}
                </span>
              )}
            </div>
            <div className="result-content">
              {transcript || <span className="placeholder">Your speech will appear here...</span>}
            </div>
            {transcript && (
              <div className="result-actions">
                <button onClick={() => copyToClipboard(transcript)} title="Copy">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                <button onClick={() => translateText(transcript)} title="Translate">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Translated Text */}
          <div className="result-card translated">
            <div className="result-header">
              <h4>Translation</h4>
              {isTranslating && <span className="translating">Translating...</span>}
            </div>
            <div className="result-content">
              {translatedText || <span className="placeholder">Translation will appear here...</span>}
            </div>
            {translatedText && (
              <div className="result-actions">
                <button onClick={() => copyToClipboard(translatedText)} title="Copy">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                <button onClick={speakTranslation} title="Listen">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Clear Button */}
        {(transcript || translatedText) && (
          <button className="clear-btn" onClick={clearAll}>
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}

export default AITranslator;
