/**
 * Custom hook for managing Travel Agent state and operations
 * Provides centralized state management for the travel agent interface
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export const useTravelAgent = () => {
  // Core state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Location state
  const [userLocation, setUserLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  
  // Map state
  const [mapLocations, setMapLocations] = useState([]);
  
  // User context
  const [userContext, setUserContext] = useState({
    name: '',
    preferences: {},
    travelHistory: []
  });
  
  // Refs
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Load saved preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('travelAgentTheme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    
    const savedContext = localStorage.getItem('travelAgentContext');
    if (savedContext) {
      try {
        setUserContext(JSON.parse(savedContext));
      } catch (e) {
        console.warn('Failed to parse saved context:', e);
      }
    }
  }, []);
  
  // Save theme preference
  useEffect(() => {
    localStorage.setItem('travelAgentTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  const formatMessageContent = useCallback((content) => {
    if (typeof content !== 'string') return content;
    
    // Format travel-specific content
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/🌍|✈️|🏨|🌤️|💰|🎯|🍽️|🚌|🛡️|📍/g, (match) => {
        const emojiMap = {
          '🌍': '<span class="emoji">🌍</span>',
          '✈️': '<span class="emoji">✈️</span>',
          '🏨': '<span class="emoji">🏨</span>',
          '🌤️': '<span class="emoji">🌤️</span>',
          '💰': '<span class="emoji">💰</span>',
          '🎯': '<span class="emoji">🎯</span>',
          '🍽️': '<span class="emoji">🍽️</span>',
          '🚌': '<span class="emoji">🚌</span>',
          '🛡️': '<span class="emoji">🛡️</span>',
          '📍': '<span class="emoji">📍</span>'
        };
        return emojiMap[match] || match;
      });
  }, []);
  
  const formatTravelMessage = useCallback((message) => {
    if (typeof message !== 'string') return message;
    
    // Enhanced travel message formatting
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong class="travel-highlight">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="travel-emphasis">$1</em>')
      .replace(/\n•/g, '<br>•')
      .replace(/\n\n/g, '<br><br>')
      .replace(/(\d+\.\s)/g, '<br>$1')
      .replace(/Day \d+:/g, '<div class="day-header">$&</div>')
      .replace(/Morning:|Afternoon:|Evening:/g, '<div class="time-header">$&</div>');
  }, []);
  
  const handleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);
  
  const sendMessage = useCallback(async (message = null) => {
    const messageToSend = message || input.trim();
    if (!messageToSend) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          context: {
            userLocation,
            currentLocation,
            destinationLocation,
            userContext,
            previousMessages: messages.slice(-5) // Last 5 messages for context
          }
        }),
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: '',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk) {
                assistantMessage.content += data.chunk;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.type === 'assistant') {
                    lastMessage.content = assistantMessage.content;
                  }
                  return newMessages;
                });
              }
              if (data.done) {
                setIsLoading(false);
                break;
              }
            } catch (e) {
              console.warn('Failed to parse streaming data:', e);
            }
          }
        }
      }
      
      // Update map locations based on response
      updateMapFromMessage(assistantMessage.content);
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('Error sending message:', error);
        const errorMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
      setIsLoading(false);
    }
  }, [input, userLocation, currentLocation, destinationLocation, userContext, messages]);
  
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);
  
  const handleLocationSubmit = useCallback((location) => {
    setUserLocation(location);
    setCurrentLocation(location);
    
    // Save to context
    const newContext = {
      ...userContext,
      currentLocation: location
    };
    setUserContext(newContext);
    localStorage.setItem('travelAgentContext', JSON.stringify(newContext));
  }, [userContext]);
  
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);
  
  const updateMapFromMessage = useCallback((messageContent) => {
    // Extract location mentions from message
    const locationRegex = /(?:in|to|from|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
    const matches = [...messageContent.matchAll(locationRegex)];
    
    if (matches.length > 0) {
      const newLocations = matches.map(match => ({
        name: match[1],
        coordinates: null, // Will be geocoded separately
        type: 'mentioned'
      }));
      
      setMapLocations(prev => [...prev, ...newLocations]);
    }
  }, []);
  
  const shareChat = useCallback(() => {
    const chatText = messages.map(msg => 
      `${msg.type === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    if (navigator.share) {
      navigator.share({
        title: 'Travel Agent Chat',
        text: chatText
      });
    } else {
      navigator.clipboard.writeText(chatText);
      alert('Chat copied to clipboard!');
    }
  }, [messages]);
  
  const saveChat = useCallback(() => {
    const chatData = {
      messages,
      timestamp: new Date().toISOString(),
      userContext
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travel-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages, userContext]);
  
  const clearChat = useCallback(() => {
    setMessages([]);
    setMapLocations([]);
  }, []);
  
  const updateUserContext = useCallback((updates) => {
    const newContext = { ...userContext, ...updates };
    setUserContext(newContext);
    localStorage.setItem('travelAgentContext', JSON.stringify(newContext));
  }, [userContext]);
  
  return {
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
    updateUserContext,
    formatMessageContent,
    formatTravelMessage,
    scrollToBottom
  };
};
