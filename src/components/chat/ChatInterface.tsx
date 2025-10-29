"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send,
  MessageCircle,
  Bot,
  User,
  Loader2,
  Sparkles,
  Globe,
  MapPin,
  Calendar,
  Plane
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m Atlas, your AI travel assistant. How can I help you plan your next adventure?',
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I understand you\'re looking for travel assistance! While the full AI chat functionality is being prepared, I can help you explore our features. Would you like to learn about destination recommendations, itinerary planning, or booking assistance?',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: Globe, label: 'Find Destinations', prompt: 'Show me popular destinations for spring travel' },
    { icon: MapPin, label: 'Plan Itinerary', prompt: 'Help me plan a 5-day trip to Tokyo' },
    { icon: Calendar, label: 'Check Availability', prompt: 'What are the best travel dates for Europe in summer?' },
    { icon: Plane, label: 'Book Flights', prompt: 'Find flights from New York to London' },
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-atlas-ai-main/10 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-atlas-ai-main" />
              </div>
              <div>
                <CardTitle className="text-lg">Atlas AI Assistant</CardTitle>
                <CardDescription className="flex items-center">
                  <div className="w-2 h-2 bg-atlas-success-main rounded-full mr-2"></div>
                  Online and ready to help
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-atlas-ai-main/10 text-atlas-ai-main">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-atlas-primary-main text-white'
                    : 'bg-atlas-border-subtle text-atlas-text-primary'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-white/20' 
                      : 'bg-atlas-ai-main/20'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <Bot className="h-3 w-3" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-white/70' 
                        : 'text-atlas-text-tertiary'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-atlas-border-subtle rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-atlas-ai-main/20 flex items-center justify-center">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <Loader2 className="h-4 w-4 animate-spin text-atlas-ai-main" />
                    <span className="text-sm text-atlas-text-secondary">Atlas is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Quick Actions */}
        <div className="p-4 border-t border-atlas-border">
          <p className="text-sm text-atlas-text-secondary mb-3">Quick actions:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-auto p-2 flex flex-col items-center space-y-1"
                onClick={() => setInput(action.prompt)}
              >
                <action.icon className="h-4 w-4" />
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-atlas-border">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Atlas about your travel plans..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
