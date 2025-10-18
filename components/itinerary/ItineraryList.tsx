'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Plus, 
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Share2
} from 'lucide-react';
import { Itinerary } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function ItineraryList() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const router = useRouter();
  const { toast } = useToast();

  const loadItineraries = useCallback(async () => {
    try {
      const response = await fetch('/api/itineraries');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setItineraries(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading itineraries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load itineraries.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadItineraries();
  }, [loadItineraries]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this itinerary?')) return;

    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItineraries(prev => prev.filter(itinerary => itinerary.id !== id));
        toast({
          title: 'Success',
          description: 'Itinerary deleted successfully.',
        });
      } else {
        throw new Error('Failed to delete itinerary');
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete itinerary.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
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

  const filteredItineraries = itineraries.filter(itinerary => {
    const matchesSearch = itinerary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         itinerary.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || itinerary.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading itineraries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Itineraries
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view your travel plans
          </p>
        </div>
        <Button onClick={() => router.push('/itinerary/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Itinerary
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search itineraries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Itineraries Grid */}
      {filteredItineraries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No itineraries found' : 'No itineraries yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start planning your next adventure by creating your first itinerary.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => router.push('/itinerary/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Itinerary
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItineraries.map((itinerary) => (
            <Card key={itinerary.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1 line-clamp-2">
                      {itinerary.title}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{itinerary.destination}</span>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(itinerary.status)}>
                    {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(itinerary.startDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{itinerary.travelers} traveler{itinerary.travelers > 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4" />
                    <span>${itinerary.metadata.totalCost.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {itinerary.days.length} day{itinerary.days.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/itineraries/${itinerary.id}`)}
                  >
                    View Details
                  </Button>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/itineraries/${itinerary.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(itinerary.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
