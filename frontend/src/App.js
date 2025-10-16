import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import TravelMap from './components/TravelMap';
import { mapService } from './services/mapService';

function App() {
  const [messages, setMessages] = useState([]);
  const [isFirstMessageLoading, setIsFirstMessageLoading] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [suggestedLocations] = useState([]);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [userContext, setUserContext] = useState({
    departureLocation: null,
    destination: null,
    travelDates: null,
    budget: null,
    interests: [],
    travelStyle: null
  });
  const [travelPlan, setTravelPlan] = useState({
    destination: null,
    dates: null,
    budget: null,
    activities: [],
    accommodations: null,
    transportation: null
  });
  const [mapWidth, setMapWidth] = useState(40); // Map width percentage

  // Show first message loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstMessageLoading(false);
      setMessages([{
        role: 'assistant',
        content: 'Hi! I\'m your travel planning assistant. I can help you with flights, hotels, weather, and travel planning. What would you like help with?'
      }]);
    }, 2000); // 2 second loading animation

    return () => clearTimeout(timer);
  }, []);

  // Utility function to clean and format message content
  const formatMessageContent = (content) => {
    if (!content) return '';
    
    // Remove HTML tags and clean up the content
    let cleaned = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&bull;/g, '•') // Convert HTML bullets
      .replace(/&nbsp;/g, ' ') // Convert HTML spaces
      .replace(/\n\n+/g, '\n\n') // Clean up multiple newlines
      .trim();
    
    return cleaned;
  };

  // Function to render simple, clean text formatting
  const renderFormattedContent = (content) => {
    if (!content) return '';
    
    // Simple formatting - just clean text with line breaks
    const cleaned = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\n\n+/g, '\n\n') // Clean up multiple newlines
      .trim();
    
    return (
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
        {cleaned}
      </div>
    );
  };

  // Function to format travel planning messages
  const formatTravelMessage = (content) => {
    if (!content) return content;
    
    // Remove the "Planning your trip... 🗺️ Travel Planning Assistant" prefix
    let formatted = content.replace(/^Planning your trip\.\.\.\s*🗺️\s*Travel Planning Assistant\s*/i, '');
    
    // Remove the "🗺️ Travel Planning Assistant" prefix
    formatted = formatted.replace(/^🗺️\s*Travel Planning Assistant\s*/i, '');
    
    // Rewrite the generic message
    formatted = formatted.replace(/^I can help you plan your trip! To provide the best recommendations, please let me know:\s*/i, '');
    
    // If we have context, customize the message
    if (userContext.departureLocation) {
      formatted = formatted.replace(/•\s*Destination:\s*Where do you want to go\?/i, '');
    }
    
    // Format questions to be on separate lines
    formatted = formatted.replace(/•\s*([^•]+?):\s*([^•]+?)(?=•|$)/g, '• $1:\n  $2');
    
    // Format bullet points better
    formatted = formatted.replace(/•\s*/g, '• ');
    
    // Clean up extra whitespace
    formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
    
    return formatted;
  };
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Only set default location if user denied permission or location unavailable
          if (error.code === error.PERMISSION_DENIED || error.code === error.POSITION_UNAVAILABLE) {
            setCurrentLocation({ lat: 32.0853, lng: 34.7818, name: 'Tel Aviv, Israel' });
          }
          // Don't set userLocation to avoid showing in input field
        }
      );
    } else {
      // Only set default location if geolocation is not supported
      setCurrentLocation({ lat: 32.0853, lng: 34.7818, name: 'Tel Aviv, Israel' });
      // Don't set userLocation to avoid showing in input field
    }
  }, []);

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

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Check if the message contains a location and update map
    // Check if message contains location keywords
    const locationKeywords = ['rome', 'paris', 'tokyo', 'london', 'new york', 'iceland', 'spain', 'france', 'italy', 'japan', 'germany', 'australia', 'canada', 'mexico', 'brazil', 'india', 'china', 'thailand', 'singapore', 'dubai', 'egypt', 'greece', 'turkey', 'russia', 'south korea', 'vietnam', 'indonesia', 'philippines', 'malaysia', 'south africa', 'morocco', 'kenya', 'tanzania', 'ethiopia', 'nigeria', 'ghana', 'senegal', 'tunisia', 'algeria', 'libya', 'sudan', 'chad', 'niger', 'mali', 'burkina faso', 'ivory coast', 'guinea', 'sierra leone', 'liberia', 'gambia', 'guinea-bissau', 'cape verde', 'sao tome', 'equatorial guinea', 'gabon', 'congo', 'cameroon', 'central african republic', 'democratic republic of congo', 'angola', 'zambia', 'zimbabwe', 'botswana', 'namibia', 'lesotho', 'swaziland', 'madagascar', 'mauritius', 'seychelles', 'comoros', 'djibouti', 'somalia', 'eritrea', 'uganda', 'rwanda', 'burundi', 'malawi', 'mozambique'];
    
    const lowerMessage = userMessage.toLowerCase();
    const foundLocation = locationKeywords.find(location => lowerMessage.includes(location));
    
    console.log('Checking location:', lowerMessage, 'Found:', foundLocation);
    
    if (foundLocation) {
      try {
        const geocodedLocation = await mapService.geocodeAddress(foundLocation);
        if (geocodedLocation && geocodedLocation.lat && geocodedLocation.lng) {
          setDestinationLocation({
            name: geocodedLocation.name || foundLocation,
            lat: geocodedLocation.lat,
            lng: geocodedLocation.lng
          });
          
          // Update travel plan
          setTravelPlan(prev => ({
            ...prev,
            destination: geocodedLocation.name || foundLocation,
            activities: ['Travel planning', 'Destination research']
          }));
          
          console.log('Updated travel plan with destination:', geocodedLocation.name || foundLocation);
          
          // Store in database via API
          try {
            await fetch('/api/travel-plan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                destination: geocodedLocation.name || foundLocation,
                lat: geocodedLocation.lat,
                lng: geocodedLocation.lng
              })
            });
          } catch (error) {
            console.log('Could not store destination:', error);
          }
        }
      } catch (error) {
        console.log('Could not geocode location:', foundLocation);
      }
    }

    // Add placeholder for assistant response
    setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }]);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          context: userContext
        })
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
                // Ensure we have a final message if none was added
                if (assistantMessage.trim()) {
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.role === 'assistant') {
                      newMessages[newMessages.length - 1] = {
                        role: 'assistant',
                        content: assistantMessage.trim(),
                        isTyping: false,
                        isStreaming: false
                      };
                    }
                    return newMessages;
                  });
                  
                  // Extract travel plan data from the response
                  extractTravelPlanData(assistantMessage.trim(), userMessage);
                }
                break;
              }
              
              if (data.chunk) {
                // Skip the "Planning your trip..." chunk
                if (data.chunk.includes('Planning your trip...')) {
                  continue;
                }
                
                assistantMessage += data.chunk + ' ';
                
                // Only add message when we have actual content
                if (assistantMessage.trim().length > 0) {
                  setMessages(prev => {
                    const newMessages = [...prev];
                    // Check if we already have a streaming message
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
                      // Update existing streaming message
                      newMessages[newMessages.length - 1] = {
                        role: 'assistant',
                        content: assistantMessage,
                        isTyping: false,
                        isStreaming: true
                      };
                    } else {
                      // Add new streaming message only when we have content
                      newMessages.push({
                        role: 'assistant',
                        content: assistantMessage,
                        isTyping: false,
                        isStreaming: true
                      });
                    }
                    return newMessages;
                  });
                }
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
      setIsLoading(false);
    }
  }, [input, isLoading, userContext]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLocationSubmit = async () => {
    if (userLocation.trim()) {
      setIsLocationLoading(true);
      setShowLocationPrompt(false);
      
      // Try to geocode the user's location input
      let geocodedLocation = null;
      
      // First try backend geocoding
      try {
        geocodedLocation = await mapService.geocodeAddress(userLocation);
      } catch (error) {
        console.log('Backend geocoding failed, trying fallback:', error);
      }
      
      // If backend failed, try fallback geocoding
      if (!geocodedLocation || !geocodedLocation.lat || !geocodedLocation.lng) {
        try {
          geocodedLocation = await mapService.fallbackGeocode(userLocation);
        } catch (error) {
          console.log('Fallback geocoding failed:', error);
        }
      }
      
      // If geocoding worked, use it
      if (geocodedLocation && geocodedLocation.lat && geocodedLocation.lng) {
        setCurrentLocation({
          name: geocodedLocation.name || userLocation,
          lat: geocodedLocation.lat,
          lng: geocodedLocation.lng
        });
      } else {
        // Fallback to predefined locations
        const locations = {
          'israel': { lat: 31.0461, lng: 34.8516, name: 'Israel' },
          'tel aviv': { lat: 32.0853, lng: 34.7818, name: 'Tel Aviv' },
          'jerusalem': { lat: 31.7683, lng: 35.2137, name: 'Jerusalem' },
          'new york': { lat: 40.7128, lng: -74.0060, name: 'New York' },
          'london': { lat: 51.5074, lng: -0.1278, name: 'London' },
          'paris': { lat: 48.8566, lng: 2.3522, name: 'Paris' },
          'rome': { lat: 41.9028, lng: 12.4964, name: 'Rome' }
        };
        
        const locationKey = userLocation.toLowerCase();
        if (locations[locationKey]) {
          setCurrentLocation(locations[locationKey]);
        } else {
          // Default fallback
          setCurrentLocation({ name: userLocation, lat: 32.0853, lng: 34.7818 });
        }
      }
      
      // Update user context
      setUserContext(prev => ({
        ...prev,
        departureLocation: userLocation
      }));
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Great! I'll remember you're traveling from ${userLocation}. Now, where would you like to go?`
      }]);
      
      setIsLocationLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const shareChat = async () => {
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Travel Chat',
          text: chatText,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(chatText);
      alert('Chat copied to clipboard!');
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/chat-history');
      const data = await response.json();
      
      if (data.conversations && data.conversations.length > 0) {
        const historyMessages = [];
        data.conversations.forEach(conv => {
          historyMessages.push({
            role: 'user',
            content: conv.user_message
          });
          historyMessages.push({
            role: 'assistant', 
            content: conv.assistant_response
          });
        });
        
        setMessages(historyMessages);
        alert(`Loaded ${data.conversations.length} previous conversations`);
      } else {
        alert('No chat history found');
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      alert('Error loading chat history');
    }
  };

  const extractTravelPlanData = (response, userMessage) => {
    try {
      // Check if this is a travel planning response
      if (response.includes('Flight Options') || response.includes('Hotel Options') || response.includes('Itinerary')) {
        const newTravelPlan = { ...travelPlan };
        
        // Extract destination from response
        const destinationMatch = response.match(/Flight Options to (\w+)/);
        if (destinationMatch) {
          newTravelPlan.destination = destinationMatch[1];
        }
        
        // Extract budget from user message or response
        const budgetMatch = userMessage.match(/(\d+)\s*(usd|dollars?|\$)/i) || response.match(/Budget.*?\$(\d+)/);
        if (budgetMatch) {
          newTravelPlan.budget = `$${budgetMatch[1]}`;
        }
        
        // Extract dates from user message
        const dateMatch = userMessage.match(/(\w+)\s+(\d{4})/i);
        if (dateMatch) {
          newTravelPlan.dates = `${dateMatch[1]} ${dateMatch[2]}`;
        }
        
        // Extract activities from response
        const activities = [];
        const activityMatches = response.match(/- ([^-]+)/g);
        if (activityMatches) {
          activityMatches.forEach(match => {
            const activity = match.replace('- ', '').trim();
            if (activity && !activity.includes('Option') && !activity.includes('Price')) {
              activities.push(activity);
            }
          });
        }
        newTravelPlan.activities = activities.slice(0, 5); // Limit to 5 activities
        
        setTravelPlan(newTravelPlan);
      }
    } catch (error) {
      console.error('Error extracting travel plan data:', error);
    }
  };

  const saveChat = (format) => {
    if (format === 'json') {
      // JSON
      const chatData = {
        messages,
        timestamp: new Date().toISOString(),
        location: userLocation
      };
      const dataStr = JSON.stringify(chatData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `travel-chat-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'txt') {
      // Text file
      const chatText = messages.map(msg => 
        `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');
      const dataBlob = new Blob([chatText], { type: 'text/plain' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `travel-chat-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'md') {
      // Markdown file
      const chatMarkdown = messages.map(msg => 
        `## ${msg.role === 'user' ? 'You' : 'Assistant'}\n\n${msg.content}`
      ).join('\n\n---\n\n');
      const dataBlob = new Blob([chatMarkdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `travel-chat-${new Date().toISOString().split('T')[0]}.md`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Function to extract location information from messages and geocode them
  const updateMapFromMessage = async (message) => {
    const content = message.content.toLowerCase();
    
    // Check if this is an attractions message and extract destination
    if (content.includes('top attractions in') && content.includes('🎯')) {
      const match = content.match(/top attractions in ([^🎯]+)/);
      if (match) {
        const destination = match[1].trim();
        try {
          const geocodedLocation = await mapService.geocodeAddress(destination);
          if (geocodedLocation && geocodedLocation.lat && geocodedLocation.lng) {
            setDestinationLocation({
              name: geocodedLocation.name || destination,
              lat: geocodedLocation.lat,
              lng: geocodedLocation.lng
            });
          }
        } catch (error) {
          console.log('Failed to geocode destination for attractions:', error);
        }
      }
    }
    
    // Simple location detection with fallback coordinates
    const locations = {
      'new york': { lat: 40.7128, lng: -74.0060, name: 'New York' },
      'tokyo': { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
      'japan': { lat: 35.6762, lng: 139.6503, name: 'Japan' },
      'bangkok': { lat: 13.7563, lng: 100.5018, name: 'Bangkok' },
      'peru': { lat: -12.0464, lng: -77.0428, name: 'Peru' },
      'london': { lat: 51.5074, lng: -0.1278, name: 'London' },
      'paris': { lat: 48.8566, lng: 2.3522, name: 'Paris' },
      'rome': { lat: 41.9028, lng: 12.4964, name: 'Rome' },
      'madrid': { lat: 40.4168, lng: -3.7038, name: 'Madrid' },
      'berlin': { lat: 52.5200, lng: 13.4050, name: 'Berlin' },
      'israel': { lat: 31.0461, lng: 34.8516, name: 'Israel' },
      'tel aviv': { lat: 32.0853, lng: 34.7818, name: 'Tel Aviv' }
    };
    
    for (const [key, location] of Object.entries(locations)) {
      if (content.includes(key)) {
        // Try to geocode with backend first, fallback to predefined coordinates
        try {
          const geocodedLocation = await mapService.geocodeAddress(location.name);
          if (geocodedLocation && geocodedLocation.lat && geocodedLocation.lng) {
            setDestinationLocation({
              name: geocodedLocation.name || location.name,
              lat: geocodedLocation.lat,
              lng: geocodedLocation.lng
            });
          } else {
            setDestinationLocation(location);
          }
        } catch (error) {
          console.log('Using fallback coordinates for:', location.name);
          setDestinationLocation(location);
        }
        break;
      }
    }
  };

  // Update map when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        updateMapFromMessage(lastMessage);
      }
    }
  }, [messages]);

  const exampleQueries = [
    "Find flights to New York",
    "Plan a trip to Japan", 
    "Weather in Tokyo",
    "Hotels in Bangkok",
    "Attractions in Peru"
  ];

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(90 12 12)"/>
              </svg>
            </div>
            <div className="title-section">
              <h1>Travel Assistant</h1>
            </div>
          </div>
          <div className="header-actions">
            <button className="header-btn" onClick={toggleTheme} title="Toggle theme">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                {isDarkMode ? (
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                ) : (
                  <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                )}
              </svg>
            </button>
            <button className="header-btn" onClick={shareChat} title="Share chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
            </button>
            <button className="header-btn" onClick={loadChatHistory} title="Chat history">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </button>
            <div className="download-container">
              <button className="header-btn" onClick={() => setShowDownloadOptions(!showDownloadOptions)} title="Save chat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
                </svg>
              </button>
              {showDownloadOptions && (
                <div className="download-options">
                  <button onClick={() => { saveChat('json'); setShowDownloadOptions(false); }}>JSON</button>
                  <button onClick={() => { saveChat('txt'); setShowDownloadOptions(false); }}>TXT</button>
                  <button onClick={() => { saveChat('md'); setShowDownloadOptions(false); }}>MD</button>
                </div>
              )}
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
        {/* Interactive Map - Responsive */}
        <div className="map-panel" style={{ width: `${mapWidth}%` }}>
          <div className="map-section">
            <div className="map-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
              </svg>
              Travel Map
            </div>
            <div className="map-container">
              <TravelMap 
                currentLocation={currentLocation}
                destinationLocation={destinationLocation}
                suggestedLocations={suggestedLocations}
              />
            </div>
            
            {/* Travel Plan Tracker */}
            <div className="travel-plan-tracker">
              <div className="tracker-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                Travel Plan
              </div>
              <div className="tracker-content">
                <div className="tracker-item">
                  <span className="tracker-label">Destination:</span>
                  <span className="tracker-value">{travelPlan.destination || 'Not set'}</span>
                </div>
                <div className="tracker-item">
                  <span className="tracker-label">Dates:</span>
                  <span className="tracker-value">{travelPlan.dates || 'Not set'}</span>
                </div>
                <div className="tracker-item">
                  <span className="tracker-label">Budget:</span>
                  <span className="tracker-value">{travelPlan.budget || 'Not set'}</span>
                </div>
                <div className="tracker-item">
                  <span className="tracker-label">Activities:</span>
                  <span className="tracker-value">{travelPlan.activities.length > 0 ? travelPlan.activities.join(', ') : 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Draggable Separator */}
        <div 
          className="resize-handle"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const startX = e.clientX;
            const startWidth = mapWidth;
            
            const handleMouseMove = (e) => {
              e.preventDefault();
              const deltaX = e.clientX - startX;
              const deltaPercent = (deltaX / window.innerWidth) * 100;
              const newWidth = Math.max(25, Math.min(70, startWidth + deltaPercent));
              setMapWidth(newWidth);
            };
            
            const handleMouseUp = (e) => {
              e.preventDefault();
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
              document.body.style.userSelect = '';
              document.body.style.cursor = '';
            };
            
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'col-resize';
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        <div className="chat-container" style={{ width: `${100 - mapWidth}%` }}>
        <div className="messages">
          {isFirstMessageLoading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="message-text">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === 'user' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {message.role === 'assistant' ? (
                      <div className="assistant-message">
                        {renderFormattedContent(formatMessageContent(message.content))}
                      </div>
                    ) : (
                      formatMessageContent(message.content)
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
                <div className="message-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="loading-text">AI is thinking...</div>
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                </svg>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="llm-disclaimer">
              <span className="disclaimer-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/>
                </svg>
              </span>
              <span className="disclaimer-text">
                LLM may make mistakes. For guidance only.
              </span>
              <span className="model-info">
                Free LLM (LLM7.io)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;