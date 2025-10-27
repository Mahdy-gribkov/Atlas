import { NextRequest, NextResponse } from 'next/server';
import { secure } from '@/lib/security';
import { WeatherService } from '@/services/external/weather.service';
import { z } from 'zod';

const weatherQuerySchema = z.object({
  location: z.string().min(1).max(100),
  type: z.enum(['current', 'forecast']).default('current'),
  days: z.string().optional().transform(val => val ? parseInt(val, 10) : 5),
});

export const GET = secure.user(async (req, context) => {
  try {
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    const location = queryParams.location;
    const type = queryParams.type || 'current';
    const days = queryParams.days ? parseInt(queryParams.days, 10) : 5;

    if (!location) {
      return NextResponse.json(
        { success: false, error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    const weatherService = new WeatherService();

    if (type === 'forecast') {
      const forecast = await weatherService.getWeatherForecast(location, days);
      
      if (!forecast) {
        return NextResponse.json(
          { success: false, error: 'Weather forecast not available' },
          { status: 503 }
        );
      }

      return NextResponse.json({
        success: true,
        data: forecast,
        message: `Weather forecast for ${location}`,
      });
    } else {
      const weather = await weatherService.getCurrentWeather(location);
      
      if (!weather) {
        return NextResponse.json(
          { success: false, error: 'Weather data not available' },
          { status: 503 }
        );
      }

      return NextResponse.json({
        success: true,
        data: weather,
        message: `Current weather for ${location}`,
      });
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
});
