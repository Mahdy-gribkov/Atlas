import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private chatModel: ChatGoogleGenerativeAI;
  private outputParser: StringOutputParser;

  constructor() {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not set');
    }

    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    this.chatModel = new ChatGoogleGenerativeAI({
      modelName: 'gemini-2.5-pro',
      apiKey: process.env.GOOGLE_GEMINI_API_KEY,
      temperature: 0.7,
      maxOutputTokens: 2048,
    });
    this.outputParser = new StringOutputParser();
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const messages = [];
      
      if (systemPrompt) {
        messages.push(new SystemMessage(systemPrompt));
      }
      
      messages.push(new HumanMessage(prompt));

      const response = await this.chatModel.invoke(messages);
      return response.content as string;
    } catch (error) {
      console.error('Error generating text with Gemini:', error);
      throw new Error('Failed to generate text');
    }
  }

  async generateResponse(message: string, context: any): Promise<string> {
    try {
      const systemPrompt = `You are an expert AI travel assistant. Help users plan amazing trips with personalized recommendations, practical advice, and detailed itineraries.

Key guidelines:
1. Be friendly, helpful, and enthusiastic about travel
2. Provide specific, actionable advice
3. Consider budget, time, and user preferences
4. Suggest authentic local experiences
5. Include practical tips (transportation, timing, costs)
6. Ask clarifying questions when needed
7. Format responses clearly with bullet points and sections when appropriate

Always be encouraging and make travel planning feel exciting and achievable.`;

      const messages = [];
      messages.push(new SystemMessage(systemPrompt));
      
      // Add conversation history if available
      if (context.conversationHistory && context.conversationHistory.length > 0) {
        context.conversationHistory.forEach((msg: any) => {
          if (msg.role === 'user') {
            messages.push(new HumanMessage(msg.content));
          } else if (msg.role === 'assistant') {
            messages.push(new AIMessage(msg.content));
          }
        });
      }
      
      messages.push(new HumanMessage(message));

      const response = await this.chatModel.invoke(messages);
      return response.content as string;
    } catch (error) {
      console.error('Error generating response with Gemini:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.";
    }
  }

  async generateItinerary(prompt: string, userPreferences: any): Promise<any> {
    const systemPrompt = `You are an expert travel planner AI assistant. Your task is to create detailed, personalized travel itineraries based on user preferences and requirements.

Key guidelines:
1. Always consider user preferences for budget, travel style, interests, and accessibility needs
2. Provide realistic time estimates and costs
3. Include specific locations with coordinates when possible
4. Suggest sustainable and accessible options
5. Format your response as a structured JSON object
6. Be creative but practical in your recommendations

User preferences: ${JSON.stringify(userPreferences)}`;

    const fullPrompt = `${systemPrompt}

User request: ${prompt}

Please create a detailed travel itinerary in the following JSON format:
{
  "title": "Trip Title",
  "destination": "Destination City/Country",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "travelers": number,
  "budget": number,
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "name": "Activity Name",
          "type": "attraction|restaurant|entertainment|shopping|other",
          "description": "Detailed description",
          "location": {
            "name": "Location Name",
            "address": "Full Address",
            "coordinates": {"lat": number, "lng": number},
            "city": "City",
            "country": "Country"
          },
          "duration": number (in minutes),
          "cost": number,
          "timeSlot": {
            "start": "HH:MM",
            "end": "HH:MM",
            "flexible": boolean
          },
          "bookingRequired": boolean,
          "accessibility": {
            "wheelchairAccessible": boolean,
            "visualAccessibility": boolean,
            "hearingAccessibility": boolean,
            "cognitiveAccessibility": boolean
          },
          "sustainability": {
            "ecoFriendly": boolean,
            "localBusiness": boolean,
            "sustainableTransport": boolean
          }
        }
      ],
      "estimatedCost": number,
      "notes": "Optional notes for the day"
    }
  ],
  "metadata": {
    "totalCost": number,
    "sustainabilityScore": number (0-100),
    "accessibilityScore": number (0-100),
    "tags": ["tag1", "tag2"],
    "source": "ai-generated"
  }
}`;

    try {
      const response = await this.generateText(fullPrompt);
      
      // Try to parse the JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid JSON response from AI');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw new Error('Failed to generate itinerary');
    }
  }

  async chatWithContext(
    message: string, 
    conversationHistory: any[], 
    context: any = {}
  ): Promise<string> {
    const systemPrompt = `You are an expert travel planning AI assistant. You help users plan their trips, answer travel questions, and provide personalized recommendations.

Context:
- User preferences: ${JSON.stringify(context.userPreferences || {})}
- Current itinerary: ${context.currentItinerary ? 'User has an active itinerary' : 'No active itinerary'}
- Conversation history: ${conversationHistory.length} previous messages

Guidelines:
1. Be helpful, friendly, and informative
2. Ask clarifying questions when needed
3. Provide specific, actionable advice
4. Consider user preferences and constraints
5. Suggest sustainable and accessible options
6. Keep responses concise but comprehensive`;

    const messages = [new SystemMessage(systemPrompt)];
    
    // Add conversation history
    conversationHistory.forEach((msg: any) => {
      if (msg.role === 'user') {
        messages.push(new HumanMessage(msg.content));
      } else if (msg.role === 'assistant') {
        messages.push(new AIMessage(msg.content));
      }
    });
    
    // Add current message
    messages.push(new HumanMessage(message));

    try {
      const response = await this.chatModel.invoke(messages);
      return response.content as string;
    } catch (error) {
      console.error('Error in chat with context:', error);
      throw new Error('Failed to process chat message');
    }
  }

  async analyzeImage(imageData: string, prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      
      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg',
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async extractLocationFromImage(imageData: string): Promise<any> {
    const prompt = `Analyze this image and extract travel-related information. Look for:
1. Location/destination names
2. Landmarks or attractions
3. Activities or experiences
4. Any text that might indicate a place name

Return the information in JSON format:
{
  "locations": ["location1", "location2"],
  "landmarks": ["landmark1", "landmark2"],
  "activities": ["activity1", "activity2"],
  "confidence": number (0-1)
}`;

    try {
      const response = await this.analyzeImage(imageData, prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { locations: [], landmarks: [], activities: [], confidence: 0 };
    } catch (error) {
      console.error('Error extracting location from image:', error);
      return { locations: [], landmarks: [], activities: [], confidence: 0 };
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'embedding-001' });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }
}
