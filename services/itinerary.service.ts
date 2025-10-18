import { adminDb } from '@/lib/firebase/admin';
import { Itinerary, ItineraryDay, Activity } from '@/types';
import { createItinerarySchema, updateItinerarySchema } from '@/lib/validations/schemas';
import { ItineraryGeneratorService, ItineraryRequest } from './itinerary/itinerary-generator.service';

export class ItineraryService {
  private collection = adminDb?.collection('itineraries');
  private generatorService = new ItineraryGeneratorService();

  async createItinerary(userId: string, itineraryData: any): Promise<Itinerary> {
    const validatedData = createItinerarySchema.parse(itineraryData);
    
    // Create itinerary request for the generator
    const request: ItineraryRequest = {
      destination: validatedData.destination,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      travelers: validatedData.travelers,
      budget: validatedData.budget,
      interests: validatedData.preferences?.interests || [],
      travelStyle: validatedData.preferences?.travelStyle?.budget || 'mid-range',
      ...(validatedData.preferences?.accessibility && {
        accessibility: {
          wheelchairAccessible: validatedData.preferences.accessibility.mobility,
          mobilityAssistance: validatedData.preferences.accessibility.mobility,
        }
      }),
      dietaryRestrictions: validatedData.preferences?.dietary?.restrictions || [],
    };

    // Generate itinerary using the real service
    const generatedItinerary = await this.generatorService.generateItinerary(request);
    
    const itinerary: Itinerary = {
      id: this.generateId(),
      userId,
      title: validatedData.title,
      destination: validatedData.destination,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
      travelers: validatedData.travelers,
      budget: validatedData.budget,
      status: 'draft',
      days: generatedItinerary.days.map(day => ({
        day: day.day,
        date: new Date(day.date),
        activities: day.activities.map(activity => ({
          id: activity.id,
          name: activity.name,
          type: 'attraction' as const,
          description: activity.description,
          location: {
            name: activity.location.name,
            address: activity.location.address,
            city: (activity.location as any).city || '',
            country: (activity.location as any).country || '',
            coordinates: activity.location.coordinates,
          },
          duration: typeof activity.duration === 'string' ? parseInt(activity.duration) : activity.duration,
          cost: typeof activity.cost === 'object' ? activity.cost.amount : activity.cost,
          rating: (activity as any).rating,
          bookingRequired: activity.bookingRequired,
          accessibility: {
            wheelchairAccessible: activity.accessibility?.wheelchairAccessible || false,
            visualAccessibility: (activity.accessibility as any)?.visualAccessibility || false,
            hearingAccessibility: (activity.accessibility as any)?.hearingAccessibility || false,
            cognitiveAccessibility: (activity.accessibility as any)?.cognitiveAccessibility || false,
            notes: (activity.accessibility as any)?.notes,
          },
          sustainability: {
            ecoFriendly: activity.sustainability?.ecoFriendly || false,
            carbonFootprint: (activity.sustainability as any)?.carbonFootprint || 0,
            localBusiness: (activity.sustainability as any)?.localBusiness || false,
            sustainableTransport: (activity.sustainability as any)?.sustainableTransport || false,
            notes: (activity.sustainability as any)?.notes,
          },
          timeSlot: {
            start: activity.startTime || '09:00',
            end: activity.endTime || '11:00',
            flexible: (activity as any).flexible || false,
          },
        })),
        estimatedCost: day.estimatedCost,
        notes: Array.isArray(day.notes) ? day.notes.join('; ') : day.notes || '',
      })),
      metadata: {
        totalCost: (generatedItinerary as any).totalCost || 0,
        sustainabilityScore: (generatedItinerary as any).sustainabilityScore || 0,
        accessibilityScore: (generatedItinerary as any).accessibilityScore || 0,
        tags: (generatedItinerary as any).tags || [],
        source: 'ai-generated',
        version: 1,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (this.collection) {
      await this.collection.doc(itinerary.id).set(itinerary);
    }
    return itinerary;
  }

  async getItineraryById(id: string): Promise<Itinerary | null> {
    if (!this.collection) {
      return null;
    }
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as Itinerary;
  }

  async getUserItineraries(
    userId: string, 
    page: number = 1, 
    limit: number = 10,
    filters?: { status?: string; destination?: string }
  ): Promise<{ itineraries: Itinerary[]; total: number }> {
    let query = this.collection.where('userId', '==', userId);
    
    if (filters?.status) {
      query = query.where('status', '==', filters.status);
    }
    
    if (filters?.destination) {
      query = query.where('destination', '==', filters.destination);
    }

    const offset = (page - 1) * limit;
    const snapshot = await query
      .offset(offset)
      .limit(limit)
      .orderBy('createdAt', 'desc')
      .get();

    const itineraries = snapshot.docs.map((doc: any) => doc.data() as Itinerary);
    
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;

    return { itineraries, total };
  }

  async updateItinerary(id: string, updateData: any): Promise<Itinerary> {
    const validatedData = updateItinerarySchema.parse(updateData);
    
    const itinerary = await this.getItineraryById(id);
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    const updatedItinerary: Itinerary = {
      ...itinerary,
      ...validatedData,
      updatedAt: new Date(),
    } as Itinerary;

    // Recalculate metadata if days or budget changed
    if (validatedData.days || validatedData.budget !== undefined) {
      updatedItinerary.metadata = this.calculateMetadata(updatedItinerary);
    }

    await this.collection.doc(id).update(validatedData);
    return updatedItinerary;
  }

  async deleteItinerary(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async addDayToItinerary(itineraryId: string, day: ItineraryDay): Promise<Itinerary> {
    const itinerary = await this.getItineraryById(itineraryId);
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    const updatedDays = [...itinerary.days, day];
    const updatedItinerary = {
      ...itinerary,
      days: updatedDays,
      metadata: this.calculateMetadata({ ...itinerary, days: updatedDays }),
      updatedAt: new Date(),
    };

    await this.collection.doc(itineraryId).update({
      days: updatedDays,
      metadata: updatedItinerary.metadata,
      updatedAt: new Date(),
    });

    return updatedItinerary;
  }

  async updateDayInItinerary(
    itineraryId: string, 
    dayNumber: number, 
    dayData: Partial<ItineraryDay>
  ): Promise<Itinerary> {
    const itinerary = await this.getItineraryById(itineraryId);
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    const dayIndex = itinerary.days.findIndex(d => d.day === dayNumber);
    if (dayIndex === -1) {
      throw new Error('Day not found');
    }

    const updatedDays = [...itinerary.days];
    updatedDays[dayIndex] = { ...updatedDays[dayIndex], ...dayData } as ItineraryDay;

    const updatedItinerary = {
      ...itinerary,
      days: updatedDays,
      metadata: this.calculateMetadata({ ...itinerary, days: updatedDays }),
      updatedAt: new Date(),
    };

    await this.collection.doc(itineraryId).update({
      days: updatedDays,
      metadata: updatedItinerary.metadata,
      updatedAt: new Date(),
    });

    return updatedItinerary;
  }

  private calculateMetadata(itinerary: Itinerary) {
    const totalCost = itinerary.days.reduce((sum, day) => sum + day.estimatedCost, 0);
    const sustainabilityScore = this.calculateSustainabilityScore(itinerary.days);
    const accessibilityScore = this.calculateAccessibilityScore(itinerary.days);
    const tags = this.extractTags(itinerary);

    return {
      ...itinerary.metadata,
      totalCost,
      sustainabilityScore,
      accessibilityScore,
      tags,
    };
  }

  private calculateSustainabilityScore(days: ItineraryDay[]): number {
    // Simple scoring algorithm - can be enhanced
    let score = 0;
    let totalActivities = 0;

    days.forEach(day => {
      day.activities.forEach(activity => {
        totalActivities++;
        if (activity.sustainability?.ecoFriendly) score += 2;
        if (activity.sustainability?.localBusiness) score += 1;
        if (activity.sustainability?.sustainableTransport) score += 1;
      });
    });

    return totalActivities > 0 ? Math.round((score / (totalActivities * 4)) * 100) : 0;
  }

  private calculateAccessibilityScore(days: ItineraryDay[]): number {
    // Simple scoring algorithm - can be enhanced
    let score = 0;
    let totalActivities = 0;

    days.forEach(day => {
      day.activities.forEach(activity => {
        totalActivities++;
        if (activity.accessibility?.wheelchairAccessible) score += 1;
        if (activity.accessibility?.visualAccessibility) score += 1;
        if (activity.accessibility?.hearingAccessibility) score += 1;
        if (activity.accessibility?.cognitiveAccessibility) score += 1;
      });
    });

    return totalActivities > 0 ? Math.round((score / (totalActivities * 4)) * 100) : 0;
  }

  private extractTags(itinerary: Itinerary): string[] {
    const tags = new Set<string>();
    
    tags.add(itinerary.destination.toLowerCase());
    tags.add(itinerary.metadata.source);
    
    itinerary.days.forEach(day => {
      day.activities.forEach(activity => {
        tags.add(activity.type);
        if (activity.sustainability?.ecoFriendly) tags.add('eco-friendly');
        if (activity.accessibility?.wheelchairAccessible) tags.add('accessible');
      });
    });

    return Array.from(tags);
  }

  private generateId(): string {
    return `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
