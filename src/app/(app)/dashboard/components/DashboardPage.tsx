"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  MapPin,
  Calendar,
  Plane,
  Hotel,
  Car,
  Users,
  Star,
  Clock,
  TrendingUp,
  Globe,
  Settings,
  Bell
} from 'lucide-react';
import Link from 'next/link';

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-atlas-bg">
      {/* Header */}
      <header className="bg-atlas-card-bg border-b border-atlas-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-atlas-primary-main" />
              <span className="text-2xl font-bold text-atlas-text-primary">Atlas</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 bg-atlas-primary-main rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-atlas-text-primary mb-2">
            Welcome back, Traveler! 🌍
          </h1>
          <p className="text-atlas-text-secondary">
            Ready for your next adventure? Let's plan something amazing.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/itinerary/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-atlas-primary-main/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6 text-atlas-primary-main" />
                </div>
                <h3 className="font-semibold text-atlas-text-primary mb-2">New Trip</h3>
                <p className="text-sm text-atlas-text-secondary">Start planning your next adventure</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-atlas-ai-main/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-atlas-ai-main" />
                </div>
                <h3 className="font-semibold text-atlas-text-primary mb-2">AI Chat</h3>
                <p className="text-sm text-atlas-text-secondary">Get travel advice from AI</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/itineraries">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-atlas-secondary-main/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-atlas-secondary-main" />
                </div>
                <h3 className="font-semibold text-atlas-text-primary mb-2">My Trips</h3>
                <p className="text-sm text-atlas-text-secondary">View your itineraries</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-atlas-success-main/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-atlas-success-main" />
              </div>
              <h3 className="font-semibold text-atlas-text-primary mb-2">Analytics</h3>
              <p className="text-sm text-atlas-text-secondary">View travel insights</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trips */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-atlas-text-primary">Recent Trips</h2>
            <Link href="/itineraries">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Paris Adventure</CardTitle>
                  <Badge variant="outline">Upcoming</Badge>
                </div>
                <CardDescription>March 15-22, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-atlas-text-secondary">
                    <Calendar className="h-4 w-4 mr-2" />
                    7 days, 6 nights
                  </div>
                  <div className="flex items-center text-sm text-atlas-text-secondary">
                    <Users className="h-4 w-4 mr-2" />
                    2 travelers
                  </div>
                  <div className="flex items-center text-sm text-atlas-text-secondary">
                    <Star className="h-4 w-4 mr-2" />
                    12 activities planned
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Tokyo Discovery</CardTitle>
                  <Badge variant="outline" className="bg-atlas-success-main/10 text-atlas-success-main">
                    Completed
                  </Badge>
                </div>
                <CardDescription>January 10-17, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-atlas-text-secondary">
                    <Calendar className="h-4 w-4 mr-2" />
                    7 days, 6 nights
                  </div>
                  <div className="flex items-center text-sm text-atlas-text-secondary">
                    <Users className="h-4 w-4 mr-2" />
                    1 traveler
                  </div>
                  <div className="flex items-center text-sm text-atlas-text-secondary">
                    <Star className="h-4 w-4 mr-2" />
                    15 activities completed
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Barcelona Getaway</CardTitle>
                  <Badge variant="outline">Planning</Badge>
                </div>
                <CardDescription>May 5-12, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-atlas-text-secondary">
                    <Calendar className="h-4 w-4 mr-2" />
                    7 days, 6 nights
                  </div>
                  <div className="flex items-center text-sm text-atlas-text-secondary">
                    <Users className="h-4 w-4 mr-2" />
                    4 travelers
                  </div>
                  <div className="flex items-center text-sm text-atlas-text-secondary">
                    <Clock className="h-4 w-4 mr-2" />
                    Planning in progress
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-atlas-primary-main/10 rounded-lg flex items-center justify-center mr-4">
                  <Plane className="h-6 w-6 text-atlas-primary-main" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-atlas-text-primary">12</p>
                  <p className="text-sm text-atlas-text-secondary">Trips Planned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-atlas-secondary-main/10 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-atlas-secondary-main" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-atlas-text-primary">8</p>
                  <p className="text-sm text-atlas-text-secondary">Countries Visited</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-atlas-ai-main/10 rounded-lg flex items-center justify-center mr-4">
                  <Hotel className="h-6 w-6 text-atlas-ai-main" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-atlas-text-primary">24</p>
                  <p className="text-sm text-atlas-text-secondary">Nights Booked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-atlas-success-main/10 rounded-lg flex items-center justify-center mr-4">
                  <Star className="h-6 w-6 text-atlas-success-main" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-atlas-text-primary">156</p>
                  <p className="text-sm text-atlas-text-secondary">Activities Done</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
