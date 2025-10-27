import { z } from 'zod';

// Weather API Response Schemas
const weatherResponseSchema = z.object({
  coord: z.object({
    lon: z.number(),
    lat: z.number(),
  }),
  weather: z.array(z.object({
    id: z.number(),
    main: z.string(),
    description: z.string(),
    icon: z.string(),
  })),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  wind: z.object({
    speed: z.number(),
    deg: z.number(),
  }),
  clouds: z.object({
    all: z.number(),
  }),
  dt: z.number(),
  sys: z.object({
    country: z.string(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
  name: z.string(),
});

const forecastResponseSchema = z.object({
  list: z.array(z.object({
    dt: z.number(),
    main: z.object({
      temp: z.number(),
      feels_like: z.number(),
      temp_min: z.number(),
      temp_max: z.number(),
      pressure: z.number(),
      humidity: z.number(),
    }),
    weather: z.array(z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })),
    wind: z.object({
      speed: z.number(),
      deg: z.number(),
    }),
    clouds: z.object({
      all: z.number(),
    }),
    dt_txt: z.string(),
  })),
  city: z.object({
    name: z.string(),
    country: z.string(),
    coord: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
  }),
});

export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  cloudiness: number;
  description: string;
  icon: string;
  sunrise: Date;
  sunset: Date;
  timestamp: Date;
}

export interface ForecastData {
  location: string;
  country: string;
  forecasts: Array<{
    datetime: Date;
    temperature: number;
    feelsLike: number;
    minTemp: number;
    maxTemp: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    cloudiness: number;
    description: string;
    icon: string;
  }>;
}

export class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenWeatherMap API key not found. Weather features will be disabled.');
    }
  }

  private isApiAvailable(): boolean {
    return !!this.apiKey;
  }

  async getCurrentWeather(location: string): Promise<WeatherData | null> {
    if (!this.isApiAvailable()) {
      console.warn('Weather API not available');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = weatherResponseSchema.parse(data);

      return {
        location: validatedData.name,
        country: validatedData.sys.country,
        temperature: Math.round(validatedData.main.temp),
        feelsLike: Math.round(validatedData.main.feels_like),
        minTemp: Math.round(validatedData.main.temp_min),
        maxTemp: Math.round(validatedData.main.temp_max),
        humidity: validatedData.main.humidity,
        pressure: validatedData.main.pressure,
        windSpeed: validatedData.wind.speed,
        windDirection: validatedData.wind.deg,
        cloudiness: validatedData.clouds.all,
        description: validatedData.weather[0]?.description || 'Unknown',
        icon: validatedData.weather[0]?.icon || '01d',
        sunrise: new Date(validatedData.sys.sunrise * 1000),
        sunset: new Date(validatedData.sys.sunset * 1000),
        timestamp: new Date(validatedData.dt * 1000),
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return null;
    }
  }

  async getWeatherForecast(location: string, days: number = 5): Promise<ForecastData | null> {
    if (!this.isApiAvailable()) {
      console.warn('Weather API not available');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = forecastResponseSchema.parse(data);

      // Group forecasts by day and get daily summaries
      const dailyForecasts = new Map<string, any[]>();
      
      validatedData.list.forEach((forecast) => {
        const date = new Date(forecast.dt_txt).toDateString();
        if (!dailyForecasts.has(date)) {
          dailyForecasts.set(date, []);
        }
        dailyForecasts.get(date)!.push(forecast);
      });

      const forecasts = Array.from(dailyForecasts.entries())
        .slice(0, days)
        .map(([date, dayForecasts]) => {
          const avgTemp = dayForecasts.reduce((sum, f) => sum + f.main.temp, 0) / dayForecasts.length;
          const minTemp = Math.min(...dayForecasts.map(f => f.main.temp_min));
          const maxTemp = Math.max(...dayForecasts.map(f => f.main.temp_max));
          const avgHumidity = dayForecasts.reduce((sum, f) => sum + f.main.humidity, 0) / dayForecasts.length;
          const avgPressure = dayForecasts.reduce((sum, f) => sum + f.main.pressure, 0) / dayForecasts.length;
          const avgWindSpeed = dayForecasts.reduce((sum, f) => sum + f.wind.speed, 0) / dayForecasts.length;
          const avgWindDirection = dayForecasts.reduce((sum, f) => sum + f.wind.deg, 0) / dayForecasts.length;
          const avgCloudiness = dayForecasts.reduce((sum, f) => sum + f.clouds.all, 0) / dayForecasts.length;
          
          // Get the most common weather condition for the day
          const weatherCounts = new Map<string, number>();
          dayForecasts.forEach(f => {
            const weather = f.weather[0];
            if (weather) {
              const key = `${weather.main}-${weather.description}`;
              weatherCounts.set(key, (weatherCounts.get(key) || 0) + 1);
            }
          });
          
          const mostCommonWeather = Array.from(weatherCounts.entries())
            .sort((a, b) => b[1] - a[1])[0];
          
          const weather = dayForecasts.find(f => 
            f.weather[0]?.main === mostCommonWeather?.[0]?.split('-')[0]
          )?.weather[0];

          return {
            datetime: new Date(date),
            temperature: Math.round(avgTemp),
            feelsLike: Math.round(avgTemp), // Simplified for daily forecast
            minTemp: Math.round(minTemp),
            maxTemp: Math.round(maxTemp),
            humidity: Math.round(avgHumidity),
            pressure: Math.round(avgPressure),
            windSpeed: Math.round(avgWindSpeed * 10) / 10,
            windDirection: Math.round(avgWindDirection),
            cloudiness: Math.round(avgCloudiness),
            description: weather?.description || 'Unknown',
            icon: weather?.icon || '01d',
          };
        });

      return {
        location: validatedData.city.name,
        country: validatedData.city.country,
        forecasts,
      };
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return null;
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData | null> {
    if (!this.isApiAvailable()) {
      console.warn('Weather API not available');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = weatherResponseSchema.parse(data);

      return {
        location: validatedData.name,
        country: validatedData.sys.country,
        temperature: Math.round(validatedData.main.temp),
        feelsLike: Math.round(validatedData.main.feels_like),
        minTemp: Math.round(validatedData.main.temp_min),
        maxTemp: Math.round(validatedData.main.temp_max),
        humidity: validatedData.main.humidity,
        pressure: validatedData.main.pressure,
        windSpeed: validatedData.wind.speed,
        windDirection: validatedData.wind.deg,
        cloudiness: validatedData.clouds.all,
        description: validatedData.weather[0]?.description || 'Unknown',
        icon: validatedData.weather[0]?.icon || '01d',
        sunrise: new Date(validatedData.sys.sunrise * 1000),
        sunset: new Date(validatedData.sys.sunset * 1000),
        timestamp: new Date(validatedData.dt * 1000),
      };
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error);
      return null;
    }
  }
}
