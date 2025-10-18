import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { withValidation } from '@/lib/middleware/validation';
import { GeminiService } from '@/services/ai/gemini.service';
import { ItineraryService } from '@/services/itinerary.service';
import { UserService } from '@/services/user.service';
import { aiItineraryRequestSchema } from '@/lib/validations/schemas';

const geminiService = new GeminiService();
const itineraryService = new ItineraryService();
const userService = new UserService();

export async function POST(request: NextRequest) {
  return withValidation(
    aiItineraryRequestSchema,
    async (req, data) => {
      return withAuth(
        req,
        async (authReq, token) => {
          try {
            const { destination, startDate, endDate, travelers, budget, preferences, prompt } = data;
            
            // Get user preferences
            const user = await userService.getUserById(token.uid as string);
            const userPreferences = preferences || user?.preferences || {};

            // Generate itinerary using AI
            const itineraryPrompt = prompt || 
              `Create a detailed travel itinerary for ${destination} from ${startDate} to ${endDate} for ${travelers} travelers with a budget of $${budget}.`;

            const aiItinerary = await geminiService.generateItinerary(itineraryPrompt, userPreferences);

            // Save itinerary to database
            const itinerary = await itineraryService.createItinerary(token.uid as string, {
              title: aiItinerary.title,
              destination: aiItinerary.destination,
              startDate: aiItinerary.startDate,
              endDate: aiItinerary.endDate,
              travelers: aiItinerary.travelers,
              budget: aiItinerary.budget,
              preferences: userPreferences,
            });

            // Update itinerary with AI-generated data
            const updatedItinerary = await itineraryService.updateItinerary(itinerary.id, {
              days: aiItinerary.days,
              metadata: aiItinerary.metadata,
            });

            return NextResponse.json({
              success: true,
              data: updatedItinerary,
              message: 'Itinerary generated successfully',
            });
          } catch (error) {
            console.error('Error generating itinerary:', error);
            return NextResponse.json(
              { success: false, error: 'Failed to generate itinerary' },
              { status: 500 }
            );
          }
        }
      );
    }
  );
}