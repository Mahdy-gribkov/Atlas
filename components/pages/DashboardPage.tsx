'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to plan your next adventure?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <Badge variant="secondary">New</Badge>
            </div>
            <CardTitle className="text-lg">Create Itinerary</CardTitle>
            <CardDescription>
              Start planning your perfect trip
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/itinerary/create">
              <Button className="w-full">Get Started</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-lg">Chat Assistant</CardTitle>
            <CardDescription>
              Ask questions about your travel plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chat">
              <Button variant="outline" className="w-full">Start Chat</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Explore</CardTitle>
            <CardDescription>
              Discover new destinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/explore">
              <Button variant="outline" className="w-full">Explore</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <CardTitle className="text-lg">My Trips</CardTitle>
            <CardDescription>
              View your saved itineraries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/itineraries">
              <Button variant="outline" className="w-full">View All</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Itineraries</CardTitle>
            <CardDescription>
              Your latest travel plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Tokyo Adventure</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      March 15-22, 2024
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Planning</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Paris Getaway</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      February 10-15, 2024
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>
              Your travel summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Trips
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Countries Visited
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">47</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Days Traveled
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">$2.4k</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Spent
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
