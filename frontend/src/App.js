import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome! I\'m your AI travel planning assistant. I can help you plan trips, find flights, hotels, and provide travel information. Where would you like to go?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const response = await fetch('/chat-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Update the last message (assistant message) with the response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: data.response
        };
        return newMessages;
      });

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
    } finally {
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
    "Plan a trip to Japan with $3000 budget",
    "Find flights to Paris in January", 
    "Best hotels in Bangkok under $50/night",
    "What's the weather in Tokyo?",
    "Tell me about Peru attractions"
  ];

  const travelCategories = [
    { icon: "✈️", title: "Flights", desc: "Find the best flight deals" },
    { icon: "🏨", title: "Hotels", desc: "Discover accommodation options" },
    { icon: "🌍", title: "Destinations", desc: "Explore countries and cities" },
    { icon: "💰", title: "Budget", desc: "Plan your travel budget" }
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">✈️</div>
            <div className="title-section">
              <h1>Travel AI Agent</h1>
              <p>Your intelligent travel planning companion</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="header-badges">
              <span className="badge" title="Your data never leaves your device">🔒 Privacy-First</span>
              <span className="badge" title="Powered by Llama 3.1:8b local AI">🤖 Local AI</span>
              <span className="badge" title="Instant responses, no delays">⚡ Real-time</span>
              <span className="badge" title="Voice recognition available">🎤 Voice</span>
              <span className="badge" title="Multi-language support">🌍 Multi-lang</span>
            </div>
            <div className="quick-start-buttons">
              {exampleQueries.slice(0, 3).map((query, index) => (
                <button
                  key={index}
                  className="quick-header-button"
                  onClick={() => setInput(query)}
                  disabled={isLoading}
                  title={query}
                >
                  {query.split(' ').slice(0, 2).join(' ')}...
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {showLocationPrompt && (
        <div className="location-prompt">
          <div className="location-modal">
            <h3>📍 Where are you traveling from?</h3>
            <p>This helps me provide better flight and travel recommendations.</p>
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
            <h3>Chat with Travel AI</h3>
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span>Online</span>
            </div>
          </div>

          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {message.content}
                  </div>
                  <div className="message-time">
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <div className="input-container">
              <button className="voice-button" title="Voice input (coming soon)">
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
