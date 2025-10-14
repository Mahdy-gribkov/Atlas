import React from 'react';
import './App.css';
import TravelMap from './components/TravelMap';
import { useTravelAgent } from './hooks/useTravelAgent';

function App() {
  const {
    // State
    messages,
    input,
    isLoading,
    isListening,
    isDarkMode,
    userLocation,
    currentLocation,
    destinationLocation,
    mapLocations,
    userContext,
    
    // Refs
    messagesEndRef,
    
    // Actions
    setInput,
    setCurrentLocation,
    setDestinationLocation,
    setMapLocations,
    sendMessage,
    handleVoiceInput,
    handleKeyPress,
    handleLocationSubmit,
    toggleTheme,
    shareChat,
    saveChat,
    clearChat,
    formatMessageContent,
    formatTravelMessage,
    scrollToBottom
  } = useTravelAgent();

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="header-content">
          <h1>🌍 Travel AI Agent</h1>
          <div className="header-controls">
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button 
              className="share-button"
              onClick={shareChat}
              title="Share chat"
            >
              📤
            </button>
            <button 
              className="save-button"
              onClick={saveChat}
              title="Save chat"
            >
              💾
            </button>
            <button 
              className="clear-button"
              onClick={clearChat}
              title="Clear chat"
            >
              🗑️
            </button>
          </div>
        </div>
      </header>

      <div className="app-content">
        <div className="chat-container">
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-content">
                  {message.type === 'assistant' ? (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: formatTravelMessage(formatMessageContent(message.content)) 
                      }} 
                    />
                  ) : (
                    <div>{message.content}</div>
                  )}
                </div>
                <div className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message assistant">
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

          <div className="input-container">
            <div className="input-wrapper">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about travel planning, flights, hotels, weather, attractions, and more..."
                className="message-input"
                rows="3"
                disabled={isLoading}
              />
              <div className="input-controls">
                <button
                  className={`voice-button ${isListening ? 'listening' : ''}`}
                  onClick={handleVoiceInput}
                  disabled={isLoading}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? '🎤' : '🎙️'}
                </button>
                <button
                  className="send-button"
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  title="Send message"
                >
                  ✈️
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="map-container">
          <TravelMap
            currentLocation={currentLocation}
            destinationLocation={destinationLocation}
            suggestedLocations={mapLocations}
            onLocationSelect={(location) => {
              setCurrentLocation(location);
              handleLocationSubmit(location);
            }}
          />
        </div>
      </div>

      <div className="location-prompt" style={{ display: userLocation ? 'none' : 'block' }}>
        <div className="location-prompt-content">
          <h3>📍 Set Your Location</h3>
          <p>Help me provide better travel recommendations by setting your current location.</p>
          <div className="location-input">
            <input
              type="text"
              placeholder="Enter your city or location..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLocationSubmit(e.target.value);
                }
              }}
            />
            <button onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords;
                    handleLocationSubmit(`${latitude},${longitude}`);
                  },
                  (error) => {
                    console.error('Geolocation error:', error);
                    alert('Unable to get your location. Please enter it manually.');
                  }
                );
              } else {
                alert('Geolocation not supported. Please enter your location manually.');
              }
            }}>
              📍 Use Current Location
            </button>
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <div className="footer-content">
          <p>🌍 Travel AI Agent - Your personal travel planning assistant</p>
          <div className="footer-links">
            <span>Privacy-First</span>
            <span>•</span>
            <span>Free APIs Only</span>
            <span>•</span>
            <span>Local Processing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;