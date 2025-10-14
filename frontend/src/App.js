import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome! I\'m your travel planning assistant. I can help you with flights, hotels, weather, budgets, and destination information. Where would you like to go?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Add empty assistant message for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.done) {
                setIsLoading(false);
                break;
              }
              
              if (data.chunk) {
                assistantMessage += data.chunk + ' ';
                
                // Update the assistant message in real-time
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: assistantMessage
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        };
        return newMessages;
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLocationSubmit = () => {
    if (userLocation.trim()) {
      setShowLocationPrompt(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Great! I'll remember you're traveling from ${userLocation}. Now, where would you like to go?`
      }]);
    }
  };

  const exampleQueries = [
    "Find flights to New York",
    "Plan a trip to Japan", 
    "Weather in Tokyo",
    "Hotels in Bangkok",
    "Attractions in Peru"
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">✈</div>
            <div className="title-section">
              <h1>Travel Assistant</h1>
            </div>
          </div>
        </div>
      </header>

      {showLocationPrompt && (
        <div className="location-prompt">
          <div className="location-modal">
            <h3>Where are you traveling from?</h3>
            <p>This helps provide better recommendations.</p>
            <div className="location-input">
              <input
                type="text"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                placeholder="Enter your departure city or country"
                onKeyPress={(e) => e.key === 'Enter' && handleLocationSubmit()}
              />
              <button onClick={handleLocationSubmit} disabled={!userLocation.trim()}>
                Continue
              </button>
            </div>
            <button 
              className="skip-button" 
              onClick={() => setShowLocationPrompt(false)}
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      <div className="main-content">
        <div className="chat-container">
          <div className="chat-header">
            <h3>Travel Planning</h3>
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span>Ready</span>
            </div>
          </div>

          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === 'user' ? '👤' : '✈'}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {message.role === 'assistant' ? (
                      <div className="assistant-message">
                        {message.content.split('\n').map((line, index) => (
                          <div key={index} className="message-line">
                            {line.includes('**') ? (
                              <div dangerouslySetInnerHTML={{
                                __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                  .replace(/•/g, '&bull;')
                              }} />
                            ) : (
                              line
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                  <div className="message-time">
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-avatar">✈</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="loading-text">Planning your trip...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <div className="input-container">
              <button 
                className={`voice-button ${isListening ? 'listening' : ''}`} 
                onClick={handleVoiceInput} 
                title="Voice input"
              >
                🎤
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about travel planning, destinations, flights, hotels..."
                rows="1"
                disabled={isLoading}
              />
              <button 
                onClick={sendMessage} 
                disabled={!input.trim() || isLoading}
                className="send-button"
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="quick-suggestions">
              <div className="suggestions-title">Quick Examples:</div>
              {exampleQueries.map((query, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => setInput(query)}
                  disabled={isLoading}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;