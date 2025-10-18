'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Calendar, 
  Users, 
  Leaf, 
  Accessibility,
  Download,
  Share2,
  Edit,
  Trash2
} from 'lucide-react';
import { Itinerary, ItineraryDay, Activity } from '@/types';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export function ItineraryDisplay({ 
  itinerary, 
  onEdit, 
  onDelete, 
  onShare 
}: ItineraryDisplayProps) {
  const [activeDay, setActiveDay] = useState(0);

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatTime = (time: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(`2000-01-01T${time}`));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attraction': return '🏛️';
      case 'restaurant': return '🍽️';
      case 'entertainment': return '🎭';
      case 'shopping': return '🛍️';
      default: return '📍';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {itinerary.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{itinerary.destination}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{itinerary.travelers} traveler{itinerary.travelers > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(itinerary.status)}>
            {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
          </Badge>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Budget</p>
                <p className="text-lg font-semibold">${itinerary.budget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Cost</p>
                <p className="text-lg font-semibold">${itinerary.metadata.totalCost.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sustainability</p>
                <p className="text-lg font-semibold">{itinerary.metadata.sustainabilityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Accessibility className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accessibility</p>
                <p className="text-lg font-semibold">{itinerary.metadata.accessibilityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="itinerary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary" className="space-y-4">
          {itinerary.days.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Day Navigation */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Days</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {itinerary.days.map((day, index) => (
                      <Button
                        key={day.day}
                        variant={activeDay === index ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveDay(index)}
                      >
                        <div className="text-left">
                          <div className="font-medium">Day {day.day}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(day.date)}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Day Content */}
              <div className="lg:col-span-3">
                {itinerary.days[activeDay] && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Day {itinerary.days[activeDay].day}</span>
                        <Badge variant="outline">
                          ${itinerary.days[activeDay].estimatedCost}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {formatDate(itinerary.days[activeDay].date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {itinerary.days[activeDay].activities.map((activity, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                              <div>
                                <h4 className="font-medium">{activity.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(activity.timeSlot.start)} - {formatTime(activity.timeSlot.end)}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                                <DollarSign className="h-4 w-4" />
                                <span>${activity.cost}</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            {activity.description}
                          </p>
                          
                          {activity.location && (
                            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <MapPin className="h-4 w-4" />
                              <span>{activity.location.name}, {activity.location.city}</span>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {activity.bookingRequired && (
                              <Badge variant="outline" className="text-xs">
                                Booking Required
                              </Badge>
                            )}
                            {activity.accessibility?.wheelchairAccessible && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                <Accessibility className="h-3 w-3 mr-1" />
                                Accessible
                              </Badge>
                            )}
                            {activity.sustainability?.ecoFriendly && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                <Leaf className="h-3 w-3 mr-1" />
                                Eco-Friendly
                              </Badge>
                            )}
                            {activity.sustainability?.localBusiness && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                Local Business
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {itinerary.days[activeDay].notes && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Notes</h5>
                          <p className="text-sm text-blue-700 dark:text-blue-200">
                            {itinerary.days[activeDay].notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No activities planned yet. Start building your itinerary!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Map view coming soon! This will show all your activities on an interactive map.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Itinerary Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Source:</span>
                  <span className="capitalize">{itinerary.metadata.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Version:</span>
                  <span>{itinerary.metadata.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created:</span>
                  <span>{formatDate(itinerary.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                  <span>{formatDate(itinerary.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {itinerary.metadata.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
