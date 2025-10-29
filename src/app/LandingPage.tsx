"use client";

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Heart
} from 'lucide-react';
import Link from 'next/link';

export function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-atlas-primary-lighter via-atlas-bg to-atlas-secondary-lighter flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-atlas-primary-main/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="h-8 w-8 text-atlas-primary-main animate-spin" />
          </div>
          <p className="text-atlas-text-secondary">Loading Atlas...</p>
        </div>
      </div>
    );
  }

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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Travel Planning
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-atlas-text-primary mb-6">
            Plan Your Perfect Trip with{' '}
            <span className="text-atlas-primary-main">Atlas</span>
          </h1>
          
          <p className="text-xl text-atlas-text-secondary mb-8 max-w-2xl mx-auto">
            Discover destinations, create personalized itineraries, and book your next adventure 
            with the power of AI. Atlas makes travel planning effortless and intelligent.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Planning Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/chat/guest">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Try Demo Chat
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-atlas-text-primary mb-4">
            Why Choose Atlas?
          </h2>
          <p className="text-lg text-atlas-text-secondary max-w-2xl mx-auto">
            Experience the future of travel planning with our intelligent AI assistant
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-atlas-primary-main/10 rounded-lg flex items-center justify-center mb-4">
                <Plane className="h-6 w-6 text-atlas-primary-main" />
              </div>
              <CardTitle>AI-Powered Planning</CardTitle>
              <CardDescription>
                Get personalized recommendations based on your preferences, budget, and travel style
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-atlas-secondary-main/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-atlas-secondary-main" />
              </div>
              <CardTitle>Smart Itineraries</CardTitle>
              <CardDescription>
                Create detailed day-by-day plans with activities, restaurants, and attractions
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-atlas-ai-main/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-atlas-ai-main" />
              </div>
              <CardTitle>Real-Time Updates</CardTitle>
              <CardDescription>
                Stay informed with live weather, flight status, and local recommendations
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-atlas-success-main/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-atlas-success-main" />
              </div>
              <CardTitle>Group Travel</CardTitle>
              <CardDescription>
                Coordinate with friends and family for seamless group travel experiences
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-atlas-warning-main/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-atlas-warning-main" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your data is protected with enterprise-grade security and privacy controls
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-atlas-info-main/10 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-atlas-info-main" />
              </div>
              <CardTitle>Personalized Experience</CardTitle>
              <CardDescription>
                Learn from your preferences to provide increasingly better recommendations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white">
          <CardContent className="text-center py-16">
            <Heart className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Explore the World?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who trust Atlas to plan their perfect adventures. 
              Start your journey today.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-atlas-border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Globe className="h-6 w-6 text-atlas-primary-main" />
            <span className="text-lg font-semibold text-atlas-text-primary">Atlas</span>
          </div>
          <p className="text-sm text-atlas-text-tertiary">
            © 2024 Atlas. All rights reserved. Made with ❤️ for travelers.
          </p>
        </div>
      </footer>
    </div>
  );
}
