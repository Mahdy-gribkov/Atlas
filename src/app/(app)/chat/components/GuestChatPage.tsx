"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle,
  Sparkles,
  Globe,
  ArrowRight,
  Star,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export function GuestChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-atlas-primary-lighter via-atlas-bg to-atlas-secondary-lighter">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-atlas-primary-main" />
            <span className="text-2xl font-bold text-atlas-text-primary">Atlas</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Try Atlas AI Assistant
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold text-atlas-text-primary mb-6">
              Chat with Atlas AI
            </h1>
            
            <p className="text-xl text-atlas-text-secondary mb-8 max-w-2xl mx-auto">
              Experience the power of AI-driven travel planning. Ask questions, get recommendations, 
              and discover amazing destinations - no account required.
            </p>
          </div>

          {/* Chat Interface Placeholder */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-atlas-ai-main" />
                AI Travel Assistant
              </CardTitle>
              <CardDescription>
                Ask me anything about travel planning, destinations, or itineraries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-atlas-card-bg border border-atlas-border rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-atlas-ai-main/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-atlas-ai-main" />
                  </div>
                  <h3 className="text-lg font-semibold text-atlas-text-primary mb-2">
                    Chat Interface Coming Soon
                  </h3>
                  <p className="text-atlas-text-secondary mb-4">
                    The AI chat interface is being prepared. In the meantime, you can explore our features.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/signup">
                      <Button>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline">
                        Explore Features
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-atlas-primary-main/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-atlas-primary-main" />
                </div>
                <CardTitle>Destination Discovery</CardTitle>
                <CardDescription>
                  Get personalized destination recommendations based on your interests and budget
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-atlas-secondary-main/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-atlas-secondary-main" />
                </div>
                <CardTitle>Itinerary Planning</CardTitle>
                <CardDescription>
                  Create detailed day-by-day itineraries with activities, restaurants, and attractions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-atlas-ai-main/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-atlas-ai-main" />
                </div>
                <CardTitle>Group Coordination</CardTitle>
                <CardDescription>
                  Plan trips with friends and family, coordinate schedules and preferences
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white">
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">
                Ready for More Features?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Create a free account to access advanced AI features, save your conversations, 
                and get personalized travel recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" variant="secondary">
                    <Zap className="mr-2 h-4 w-4" />
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-atlas-primary-main">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
