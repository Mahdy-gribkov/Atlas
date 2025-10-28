// Gemini 2.5 Pro AI Service - Budget Optimized
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    tokens?: number;
    cost?: number;
    model?: string;
  };
}

export interface TravelRequest {
  destination: string;
  duration: string;
  budget: string;
  interests: string[];
  travelStyle: 'budget' | 'mid-range' | 'luxury';
  groupSize: number;
  season: string;
}

export interface ItinerarySuggestion {
  day: number;
  activities: Activity[];
  estimatedCost: number;
  notes: string;
}

export interface Activity {
  name: string;
  description: string;
  duration: string;
  cost: string;
  location: string;
  type: 'attraction' | 'restaurant' | 'accommodation' | 'transport' | 'activity';
  rating?: number;
}

export interface AIResponse {
  success: boolean;
  message?: string;
  itinerary?: ItinerarySuggestion[];
  suggestions?: string[];
  error?: string;
  metadata?: {
    tokens: number;
    cost: number;
    model: string;
  };
}

class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private isInitialized = false;

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key not found. AI features will be disabled.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp", // Using the latest model
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }

  // Generate travel itinerary
  async generateItinerary(request: TravelRequest): Promise<AIResponse> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'AI service not initialized. Please check your API key.',
      };
    }

    try {
      const prompt = this.buildItineraryPrompt(request);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response (assuming JSON format)
      const parsedResponse = this.parseItineraryResponse(text);
      
      return {
        success: true,
        itinerary: parsedResponse.itinerary,
        suggestions: parsedResponse.suggestions,
        metadata: {
          tokens: response.usageMetadata?.totalTokenCount || 0,
          cost: this.calculateCost(response.usageMetadata?.totalTokenCount || 0),
          model: 'gemini-2.0-flash-exp',
        },
      };
    } catch (error: any) {
      console.error('Gemini AI error:', error);
      return {
        success: false,
        error: `AI service error: ${error.message}`,
      };
    }
  }

  // Chat with AI for travel advice
  async chatWithAI(messages: ChatMessage[]): Promise<AIResponse> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'AI service not initialized. Please check your API key.',
      };
    }

    try {
      const prompt = this.buildChatPrompt(messages);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        message: text,
        metadata: {
          tokens: response.usageMetadata?.totalTokenCount || 0,
          cost: this.calculateCost(response.usageMetadata?.totalTokenCount || 0),
          model: 'gemini-2.0-flash-exp',
        },
      };
    } catch (error: any) {
      console.error('Gemini AI chat error:', error);
      return {
        success: false,
        error: `AI service error: ${error.message}`,
      };
    }
  }

  // Get travel recommendations
  async getRecommendations(query: string, context?: string): Promise<AIResponse> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'AI service not initialized. Please check your API key.',
      };
    }

    try {
      const prompt = this.buildRecommendationPrompt(query, context);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        suggestions: this.parseRecommendations(text),
        metadata: {
          tokens: response.usageMetadata?.totalTokenCount || 0,
          cost: this.calculateCost(response.usageMetadata?.totalTokenCount || 0),
          model: 'gemini-2.0-flash-exp',
        },
      };
    } catch (error: any) {
      console.error('Gemini AI recommendations error:', error);
      return {
        success: false,
        error: `AI service error: ${error.message}`,
      };
    }
  }

  // Build itinerary generation prompt
  private buildItineraryPrompt(request: TravelRequest): string {
    return `You are Atlas, an expert travel planning AI assistant. Create a detailed ${request.duration} itinerary for ${request.destination}.

Travel Details:
- Destination: ${request.destination}
- Duration: ${request.duration}
- Budget: ${request.budget}
- Travel Style: ${request.travelStyle}
- Group Size: ${request.groupSize}
- Season: ${request.season}
- Interests: ${request.interests.join(', ')}

Please provide a detailed day-by-day itinerary in JSON format with the following structure:
{
  "itinerary": [
    {
      "day": 1,
      "activities": [
        {
          "name": "Activity Name",
          "description": "Detailed description",
          "duration": "2 hours",
          "cost": "$50",
          "location": "Specific location",
          "type": "attraction|restaurant|accommodation|transport|activity",
          "rating": 4.5
        }
      ],
      "estimatedCost": 150,
      "notes": "Additional notes for the day"
    }
  ],
  "suggestions": [
    "Additional travel tips",
    "Local customs to be aware of",
    "Best times to visit attractions"
  ]
}

Make sure to:
1. Include realistic costs based on the budget
2. Consider the travel style and group size
3. Include a mix of activities based on interests
4. Provide practical travel tips
5. Consider the season for weather-appropriate activities
6. Include transportation between activities
7. Suggest local restaurants and accommodations

Respond only with valid JSON.`;
  }

  // Build chat prompt
  private buildChatPrompt(messages: ChatMessage[]): string {
    const systemPrompt = `You are Atlas, an expert travel planning AI assistant. You help users plan amazing trips, provide travel advice, and answer questions about destinations around the world. You're knowledgeable about:

- Travel planning and itinerary creation
- Destination information and local insights
- Budget travel tips and cost optimization
- Cultural etiquette and local customs
- Weather and seasonal considerations
- Transportation options
- Accommodation recommendations
- Food and dining suggestions
- Safety and travel advisories

Always provide helpful, accurate, and practical advice. If you're unsure about something, say so rather than guessing.`;

    const conversationHistory = messages
      .slice(-10) // Keep last 10 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    return `${systemPrompt}\n\nConversation History:\n${conversationHistory}\n\nPlease respond as Atlas, the travel planning assistant.`;
  }

  // Build recommendation prompt
  private buildRecommendationPrompt(query: string, context?: string): string {
    return `You are Atlas, an expert travel planning AI assistant. The user is asking: "${query}"

${context ? `Context: ${context}` : ''}

Please provide 5-7 specific, actionable recommendations related to their query. Focus on practical, helpful advice that they can use for their travel planning.

Format your response as a simple list of recommendations, each on a new line starting with a bullet point.`;
  }

  // Parse itinerary response
  private parseItineraryResponse(text: string): { itinerary: ItinerarySuggestion[]; suggestions: string[] } {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          itinerary: parsed.itinerary || [],
          suggestions: parsed.suggestions || [],
        };
      }
    } catch (error) {
      console.error('Failed to parse itinerary response:', error);
    }

    // Fallback: return empty response
    return {
      itinerary: [],
      suggestions: ['Unable to parse itinerary response. Please try again.'],
    };
  }

  // Parse recommendations
  private parseRecommendations(text: string): string[] {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[-•*]\s*/, '')) // Remove bullet points
      .slice(0, 7); // Limit to 7 recommendations
  }

  // Calculate cost based on token usage
  private calculateCost(tokens: number): number {
    // Gemini 2.0 Flash pricing (as of 2024)
    // Input: $0.075 per 1M tokens
    // Output: $0.30 per 1M tokens
    // Assuming 50/50 input/output ratio
    const inputTokens = tokens * 0.5;
    const outputTokens = tokens * 0.5;
    
    const inputCost = (inputTokens / 1000000) * 0.075;
    const outputCost = (outputTokens / 1000000) * 0.30;
    
    return inputCost + outputCost;
  }

  // Check if service is available
  isAvailable(): boolean {
    return this.isInitialized;
  }

  // Get service status
  getStatus(): { available: boolean; model: string; error?: string } {
    return {
      available: this.isInitialized,
      model: 'gemini-2.0-flash-exp',
      error: this.isInitialized ? undefined : 'API key not configured',
    };
  }
}

// Export singleton instance
export const geminiAIService = new GeminiAIService();
export default geminiAIService;
