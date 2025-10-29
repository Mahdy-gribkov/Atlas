"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  Edit,
  Share2,
  Download,
  ArrowLeft,
  Plane,
  Hotel,
  Car,
  Utensils,
  Camera
} from 'lucide-react';
import Link from 'next/link';

interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'flight' | 'hotel' | 'activity' | 'restaurant' | 'transport';
  location: string;
  duration: string;
}

interface ItineraryDay {
  date: string;
  dayNumber: number;
  activities: Activity[];
}

const mockItinerary = {
  id: '1',
  title: 'Paris Adventure',
  destination: 'Paris, France',
  startDate: '2024-03-15',
  endDate: '2024-03-22',
  duration: 7,
  travelers: 2,
  status: 'planned',
  days: [
    {
      date: '2024-03-15',
      dayNumber: 1,
      activities: [
        {
          id: '1',
          time: '08:00',
          title: 'Flight to Paris',
          description: 'Departure from New York',
          type: 'flight',
          location: 'JFK Airport',
          duration: '8h 30m'
        },
        {
          id: '2',
          time: '16:30',
          title: 'Arrival in Paris',
          description: 'Land at Charles de Gaulle Airport',
          type: 'flight',
          location: 'CDG Airport',
          duration: '1h'
        },
        {
          id: '3',
          time: '18:00',
          title: 'Check-in Hotel',
          description: 'Hotel Le Marais',
          type: 'hotel',
          location: 'Le Marais, Paris',
          duration: '30m'
        }
      ]
    },
    {
      date: '2024-03-16',
      dayNumber: 2,
      activities: [
        {
          id: '4',
          time: '09:00',
          title: 'Eiffel Tower Visit',
          description: 'Skip-the-line tickets',
          type: 'activity',
          location: 'Eiffel Tower',
          duration: '2h'
        },
        {
          id: '5',
          time: '12:00',
          title: 'Lunch at Café de Flore',
          description: 'Traditional French cuisine',
          type: 'restaurant',
          location: 'Saint-Germain-des-Prés',
          duration: '1h 30m'
        },
        {
          id: '6',
          time: '14:00',
          title: 'Louvre Museum',
          description: 'Art and history tour',
          type: 'activity',
          location: 'Louvre Museum',
          duration: '3h'
        }
      ]
    }
  ]
};

export function ItineraryDisplay() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-4 w-4" />;
      case 'hotel':
        return <Hotel className="h-4 w-4" />;
      case 'activity':
        return <Camera className="h-4 w-4" />;
      case 'restaurant':
        return <Utensils className="h-4 w-4" />;
      case 'transport':
        return <Car className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'flight':
        return 'bg-atlas-primary-main/10 text-atlas-primary-main';
      case 'hotel':
        return 'bg-atlas-secondary-main/10 text-atlas-secondary-main';
      case 'activity':
        return 'bg-atlas-ai-main/10 text-atlas-ai-main';
      case 'restaurant':
        return 'bg-atlas-success-main/10 text-atlas-success-main';
      case 'transport':
        return 'bg-atlas-warning-main/10 text-atlas-warning-main';
      default:
        return 'bg-atlas-text-tertiary/10 text-atlas-text-tertiary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/itineraries">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Itineraries
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-atlas-text-primary">{mockItinerary.title}</h1>
            <p className="text-atlas-text-secondary mt-1">
              {mockItinerary.destination} • {mockItinerary.startDate} - {mockItinerary.endDate}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Trip Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-atlas-primary-main/10 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-atlas-primary-main" />
              </div>
              <div>
                <p className="text-sm text-atlas-text-secondary">Duration</p>
                <p className="text-lg font-semibold text-atlas-text-primary">{mockItinerary.duration} days</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-atlas-secondary-main/10 rounded-lg flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-atlas-secondary-main" />
              </div>
              <div>
                <p className="text-sm text-atlas-text-secondary">Travelers</p>
                <p className="text-lg font-semibold text-atlas-text-primary">{mockItinerary.travelers}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-atlas-ai-main/10 rounded-lg flex items-center justify-center mr-4">
                <Star className="h-6 w-6 text-atlas-ai-main" />
              </div>
              <div>
                <p className="text-sm text-atlas-text-secondary">Activities</p>
                <p className="text-lg font-semibold text-atlas-text-primary">
                  {mockItinerary.days.reduce((total, day) => total + day.activities.length, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-atlas-success-main/10 rounded-lg flex items-center justify-center mr-4">
                <MapPin className="h-6 w-6 text-atlas-success-main" />
              </div>
              <div>
                <p className="text-sm text-atlas-text-secondary">Status</p>
                <Badge className="bg-atlas-info-main/10 text-atlas-info-main">
                  {mockItinerary.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <div className="space-y-6">
        {mockItinerary.days.map((day) => (
          <Card key={day.dayNumber}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-atlas-primary-main" />
                Day {day.dayNumber} - {new Date(day.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {day.activities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      {index < day.activities.length - 1 && (
                        <div className="w-0.5 h-8 bg-atlas-border mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-atlas-text-primary">{activity.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-atlas-text-tertiary">{activity.time}</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.duration}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-atlas-text-secondary mb-1">{activity.description}</p>
                      <div className="flex items-center text-sm text-atlas-text-tertiary">
                        <MapPin className="h-3 w-3 mr-1" />
                        {activity.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
