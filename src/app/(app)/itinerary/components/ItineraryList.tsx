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
  Trash2,
  Eye,
  Share2
} from 'lucide-react';

interface Itinerary {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  travelers: number;
  status: 'draft' | 'planned' | 'booked' | 'completed';
  activities: number;
}

const mockItineraries: Itinerary[] = [
  {
    id: '1',
    title: 'Paris Adventure',
    destination: 'Paris, France',
    startDate: '2024-03-15',
    endDate: '2024-03-22',
    duration: 7,
    travelers: 2,
    status: 'planned',
    activities: 12
  },
  {
    id: '2',
    title: 'Tokyo Discovery',
    destination: 'Tokyo, Japan',
    startDate: '2024-01-10',
    endDate: '2024-01-17',
    duration: 7,
    travelers: 1,
    status: 'completed',
    activities: 15
  },
  {
    id: '3',
    title: 'Barcelona Getaway',
    destination: 'Barcelona, Spain',
    startDate: '2024-05-05',
    endDate: '2024-05-12',
    duration: 7,
    travelers: 4,
    status: 'draft',
    activities: 8
  }
];

export function ItineraryList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-atlas-text-tertiary/10 text-atlas-text-tertiary';
      case 'planned':
        return 'bg-atlas-info-main/10 text-atlas-info-main';
      case 'booked':
        return 'bg-atlas-success-main/10 text-atlas-success-main';
      case 'completed':
        return 'bg-atlas-primary-main/10 text-atlas-primary-main';
      default:
        return 'bg-atlas-text-tertiary/10 text-atlas-text-tertiary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-atlas-text-primary">My Itineraries</h1>
          <p className="text-atlas-text-secondary mt-2">
            Manage and view your travel plans
          </p>
        </div>
        <Button>
          Create New Trip
        </Button>
      </div>

      {/* Itineraries Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockItineraries.map((itinerary) => (
          <Card key={itinerary.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{itinerary.title}</CardTitle>
                  <div className="flex items-center text-sm text-atlas-text-secondary mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {itinerary.destination}
                  </div>
                </div>
                <Badge className={getStatusColor(itinerary.status)}>
                  {itinerary.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-atlas-text-secondary">
                  <Calendar className="h-4 w-4 mr-2" />
                  {itinerary.startDate} - {itinerary.endDate}
                </div>
                <div className="flex items-center text-sm text-atlas-text-secondary">
                  <Clock className="h-4 w-4 mr-2" />
                  {itinerary.duration} days
                </div>
                <div className="flex items-center text-sm text-atlas-text-secondary">
                  <Users className="h-4 w-4 mr-2" />
                  {itinerary.travelers} traveler{itinerary.travelers > 1 ? 's' : ''}
                </div>
                <div className="flex items-center text-sm text-atlas-text-secondary">
                  <Star className="h-4 w-4 mr-2" />
                  {itinerary.activities} activities
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-atlas-error-main hover:text-atlas-error-main">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockItineraries.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-atlas-primary-main/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-atlas-primary-main" />
            </div>
            <h3 className="text-lg font-semibold text-atlas-text-primary mb-2">
              No itineraries yet
            </h3>
            <p className="text-atlas-text-secondary mb-6">
              Start planning your first trip with Atlas AI
            </p>
            <Button>
              Create Your First Trip
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
