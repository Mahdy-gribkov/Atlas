/**
 * Weather Information Component
 * 
 * Provides comprehensive weather data and climate information for Atlas travel agent.
 * Implements real-time weather, forecasts, and climate insights.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Weather Information Variants
const weatherInformationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'weather-information-mode-standard',
        'enhanced': 'weather-information-mode-enhanced',
        'advanced': 'weather-information-mode-advanced',
        'custom': 'weather-information-mode-custom'
      },
      type: {
        'current': 'weather-type-current',
        'forecast': 'weather-type-forecast',
        'climate': 'weather-type-climate',
        'alerts': 'weather-type-alerts',
        'mixed': 'weather-type-mixed'
      },
      style: {
        'minimal': 'weather-style-minimal',
        'moderate': 'weather-style-moderate',
        'detailed': 'weather-style-detailed',
        'custom': 'weather-style-custom'
      },
      format: {
        'text': 'weather-format-text',
        'visual': 'weather-format-visual',
        'interactive': 'weather-format-interactive',
        'mixed': 'weather-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'mixed',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// Weather Information Props
interface WeatherInformationProps extends VariantProps<typeof weatherInformationVariants> {
  className?: string;
  onWeatherUpdate?: (weather: WeatherData) => void;
  initialWeather?: Partial<WeatherData>;
  showForecast?: boolean;
  showAlerts?: boolean;
  showClimate?: boolean;
  showRadar?: boolean;
}

// Weather Data Interface
interface WeatherData {
  id: string;
  location: {
    name: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    timezone: string;
  };
  current: CurrentWeather;
  forecast: WeatherForecast[];
  alerts: WeatherAlert[];
  climate: ClimateData;
  radar?: RadarData;
  lastUpdated: Date;
  createdAt: Date;
}

// Current Weather Interface
interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  wind: {
    speed: number;
    direction: number;
    gust?: number;
  };
  condition: {
    main: string;
    description: string;
    icon: string;
  };
  sunrise: Date;
  sunset: Date;
  timestamp: Date;
}

// Weather Forecast Interface
interface WeatherForecast {
  date: Date;
  day: string;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  condition: {
    main: string;
    description: string;
    icon: string;
  };
  precipitation: {
    probability: number;
    amount: number;
    type: 'rain' | 'snow' | 'sleet' | 'hail';
  };
  wind: {
    speed: number;
    direction: number;
  };
  humidity: number;
  uvIndex: number;
  hourly: HourlyForecast[];
}

// Hourly Forecast Interface
interface HourlyForecast {
  time: Date;
  temperature: number;
  condition: {
    main: string;
    description: string;
    icon: string;
  };
  precipitation: {
    probability: number;
    amount: number;
  };
  wind: {
    speed: number;
    direction: number;
  };
}

// Weather Alert Interface
interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory' | 'statement';
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  areas: string[];
  startTime: Date;
  endTime: Date;
  instructions: string[];
}

// Climate Data Interface
interface ClimateData {
  averageTemperature: {
    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;
  };
  averagePrecipitation: {
    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;
  };
  bestTimeToVisit: string[];
  climateType: string;
  seasons: SeasonInfo[];
}

// Season Info Interface
interface SeasonInfo {
  name: string;
  months: string[];
  temperature: {
    min: number;
    max: number;
  };
  precipitation: number;
  description: string;
}

// Radar Data Interface
interface RadarData {
  imageUrl: string;
  timestamp: Date;
  coverage: number;
}

// Weather Information Component
export const WeatherInformation = React.forwardRef<HTMLDivElement, WeatherInformationProps>(
  ({ 
    className, 
    onWeatherUpdate,
    initialWeather,
    showForecast = true,
    showAlerts = true,
    showClimate = true,
    showRadar = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [weather, setWeather] = useState<WeatherData>(
      initialWeather || {
        id: '',
        location: {
          name: '',
          country: '',
          coordinates: { lat: 0, lng: 0 },
          timezone: ''
        },
        current: {
          temperature: 0,
          feelsLike: 0,
          humidity: 0,
          pressure: 0,
          visibility: 0,
          uvIndex: 0,
          wind: { speed: 0, direction: 0 },
          condition: { main: '', description: '', icon: '' },
          sunrise: new Date(),
          sunset: new Date(),
          timestamp: new Date()
        },
        forecast: [],
        alerts: [],
        climate: {
          averageTemperature: {
            january: 0, february: 0, march: 0, april: 0, may: 0, june: 0,
            july: 0, august: 0, september: 0, october: 0, november: 0, december: 0
          },
          averagePrecipitation: {
            january: 0, february: 0, march: 0, april: 0, may: 0, june: 0,
            july: 0, august: 0, september: 0, october: 0, november: 0, december: 0
          },
          bestTimeToVisit: [],
          climateType: '',
          seasons: []
        },
        lastUpdated: new Date(),
        createdAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('current');
    const [isLoading, setIsLoading] = useState(false);
    const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

    const tabs = [
      { id: 'current', name: 'Current', icon: '🌡️' },
      { id: 'forecast', name: 'Forecast', icon: '📅' },
      { id: 'climate', name: 'Climate', icon: '🌍' },
      { id: 'alerts', name: 'Alerts', icon: '⚠️' }
    ];

    const updateWeather = useCallback((path: string, value: any) => {
      setWeather(prev => {
        const newWeather = { ...prev };
        const keys = path.split('.');
        let current: any = newWeather;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newWeather.lastUpdated = new Date();
        onWeatherUpdate?.(newWeather);
        return newWeather;
      });
    }, [onWeatherUpdate]);

    const loadWeather = useCallback(async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockWeather: WeatherData = {
        id: 'weather-1',
        location: {
          name: 'Paris',
          country: 'France',
          coordinates: { lat: 48.8566, lng: 2.3522 },
          timezone: 'Europe/Paris'
        },
        current: {
          temperature: 18,
          feelsLike: 16,
          humidity: 65,
          pressure: 1013,
          visibility: 10,
          uvIndex: 3,
          wind: { speed: 12, direction: 240, gust: 18 },
          condition: { main: 'Clouds', description: 'Partly cloudy', icon: '02d' },
          sunrise: new Date('2024-01-15T08:30:00'),
          sunset: new Date('2024-01-15T17:15:00'),
          timestamp: new Date()
        },
        forecast: [
          {
            date: new Date('2024-01-16'),
            day: 'Tuesday',
            temperature: { min: 12, max: 20, avg: 16 },
            condition: { main: 'Rain', description: 'Light rain', icon: '10d' },
            precipitation: { probability: 80, amount: 5, type: 'rain' },
            wind: { speed: 15, direction: 250 },
            humidity: 75,
            uvIndex: 2,
            hourly: []
          },
          {
            date: new Date('2024-01-17'),
            day: 'Wednesday',
            temperature: { min: 8, max: 15, avg: 11 },
            condition: { main: 'Clear', description: 'Clear sky', icon: '01d' },
            precipitation: { probability: 10, amount: 0, type: 'rain' },
            wind: { speed: 8, direction: 180 },
            humidity: 55,
            uvIndex: 4,
            hourly: []
          }
        ],
        alerts: [
          {
            id: 'alert-1',
            type: 'advisory',
            severity: 'moderate',
            title: 'Wind Advisory',
            description: 'Strong winds expected throughout the day',
            areas: ['Paris', 'Île-de-France'],
            startTime: new Date('2024-01-15T12:00:00'),
            endTime: new Date('2024-01-15T20:00:00'),
            instructions: ['Avoid outdoor activities', 'Secure loose objects', 'Drive with caution']
          }
        ],
        climate: {
          averageTemperature: {
            january: 4, february: 5, march: 8, april: 12, may: 16, june: 19,
            july: 21, august: 21, september: 17, october: 13, november: 8, december: 5
          },
          averagePrecipitation: {
            january: 55, february: 45, march: 50, april: 45, may: 60, june: 55,
            july: 60, august: 60, september: 50, october: 60, november: 55, december: 60
          },
          bestTimeToVisit: ['April-June', 'September-November'],
          climateType: 'Temperate Oceanic',
          seasons: [
            {
              name: 'Spring',
              months: ['March', 'April', 'May'],
              temperature: { min: 8, max: 16 },
              precipitation: 52,
              description: 'Mild temperatures with increasing sunshine'
            },
            {
              name: 'Summer',
              months: ['June', 'July', 'August'],
              temperature: { min: 16, max: 21 },
              precipitation: 58,
              description: 'Warm and pleasant with occasional rain'
            },
            {
              name: 'Autumn',
              months: ['September', 'October', 'November'],
              temperature: { min: 8, max: 17 },
              precipitation: 55,
              description: 'Cooling temperatures with beautiful foliage'
            },
            {
              name: 'Winter',
              months: ['December', 'January', 'February'],
              temperature: { min: 2, max: 7 },
              precipitation: 53,
              description: 'Cold and damp with occasional snow'
            }
          ]
        },
        lastUpdated: new Date(),
        createdAt: new Date()
      };
      
      setWeather(mockWeather);
      setIsLoading(false);
    }, []);

    const formatTemperature = (temp: number) => {
      if (unitSystem === 'imperial') {
        return `${Math.round(temp * 9/5 + 32)}°F`;
      }
      return `${Math.round(temp)}°C`;
    };

    const formatWindSpeed = (speed: number) => {
      if (unitSystem === 'imperial') {
        return `${Math.round(speed * 2.237)} mph`;
      }
      return `${Math.round(speed * 3.6)} km/h`;
    };

    const formatPressure = (pressure: number) => {
      if (unitSystem === 'imperial') {
        return `${Math.round(pressure * 0.02953)} inHg`;
      }
      return `${pressure} hPa`;
    };

    const formatVisibility = (visibility: number) => {
      if (unitSystem === 'imperial') {
        return `${Math.round(visibility * 0.621371)} mi`;
      }
      return `${visibility} km`;
    };

    const getWindDirection = (degrees: number) => {
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      return directions[Math.round(degrees / 22.5) % 16];
    };

    const getUVIndexColor = (index: number) => {
      if (index <= 2) return 'text-green-600 dark:text-green-400';
      if (index <= 5) return 'text-yellow-600 dark:text-yellow-400';
      if (index <= 7) return 'text-orange-600 dark:text-orange-400';
      if (index <= 10) return 'text-red-600 dark:text-red-400';
      return 'text-purple-600 dark:text-purple-400';
    };

    const getUVIndexDescription = (index: number) => {
      if (index <= 2) return 'Low';
      if (index <= 5) return 'Moderate';
      if (index <= 7) return 'High';
      if (index <= 10) return 'Very High';
      return 'Extreme';
    };

    const getAlertColor = (severity: WeatherAlert['severity']) => {
      switch (severity) {
        case 'minor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case 'severe': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
        case 'extreme': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      }
    };

    const getAlertIcon = (type: WeatherAlert['type']) => {
      switch (type) {
        case 'warning': return '⚠️';
        case 'watch': return '👀';
        case 'advisory': return 'ℹ️';
        case 'statement': return '📢';
        default: return 'ℹ️';
      }
    };

    useEffect(() => {
      loadWeather();
    }, [loadWeather]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          weatherInformationVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Weather Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {weather.location.name}, {weather.location.country}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md">
              <button
                onClick={() => setUnitSystem('metric')}
                className={cn(
                  'px-3 py-1 text-sm rounded-l-md transition-colors duration-200',
                  unitSystem === 'metric'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                °C
              </button>
              <button
                onClick={() => setUnitSystem('imperial')}
                className={cn(
                  'px-3 py-1 text-sm rounded-r-md transition-colors duration-200',
                  unitSystem === 'imperial'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                °F
              </button>
            </div>
            <button
              onClick={loadWeather}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? '🔄' : '🔄'} Refresh
            </button>
          </div>
        </div>

        {/* Current Weather */}
        {activeTab === 'current' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-6xl mb-2">🌤️</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {formatTemperature(weather.current.temperature)}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  {weather.current.condition.description}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  Feels like {formatTemperature(weather.current.feelsLike)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Humidity:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{weather.current.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pressure:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatPressure(weather.current.pressure)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Visibility:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatVisibility(weather.current.visibility)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">UV Index:</span>
                  <span className={cn('font-medium', getUVIndexColor(weather.current.uvIndex))}>
                    {weather.current.uvIndex} ({getUVIndexDescription(weather.current.uvIndex)})
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Wind:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatWindSpeed(weather.current.wind.speed)} {getWindDirection(weather.current.wind.direction)}
                  </span>
                </div>
                {weather.current.wind.gust && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Gusts:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatWindSpeed(weather.current.wind.gust)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sunrise:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {weather.current.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sunset:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {weather.current.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Last Updated
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {weather.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forecast */}
        {activeTab === 'forecast' && showForecast && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weather.forecast.map((day, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {day.day}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {day.date.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🌧️</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {day.condition.description}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">High:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatTemperature(day.temperature.max)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Low:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatTemperature(day.temperature.min)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Precipitation:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {day.precipitation.probability}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Wind:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatWindSpeed(day.wind.speed)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Humidity:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {day.humidity}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Climate */}
        {activeTab === 'climate' && showClimate && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Climate Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Average Temperature by Month
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(weather.climate.averageTemperature).map(([month, temp]) => (
                      <div key={month} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{month}:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatTemperature(temp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Average Precipitation by Month
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(weather.climate.averagePrecipitation).map(([month, precip]) => (
                      <div key={month} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{month}:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {precip}mm
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Best Time to Visit
                </h4>
                <div className="flex flex-wrap gap-2">
                  {weather.climate.bestTimeToVisit.map((period, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md text-sm"
                    >
                      {period}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {weather.climate.seasons.map((season, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {season.name}
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {season.months.join(', ')}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Temp:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatTemperature(season.temperature.min)} - {formatTemperature(season.temperature.max)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Rain:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {season.precipitation}mm
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                    {season.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts */}
        {activeTab === 'alerts' && showAlerts && (
          <div className="space-y-4">
            {weather.alerts.length > 0 ? (
              weather.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn('p-4 rounded-lg border-l-4', getAlertColor(alert.severity))}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {alert.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {alert.description}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                        {alert.startTime.toLocaleString()} - {alert.endTime.toLocaleString()}
                      </div>
                      <div className="space-y-1">
                        {alert.instructions.map((instruction, index) => (
                          <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            • {instruction}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No weather alerts
                </h3>
                <p>All clear! No weather warnings or advisories at this time.</p>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-600">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200',
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
              {tab.id === 'alerts' && weather.alerts.length > 0 && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                  {weather.alerts.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

WeatherInformation.displayName = 'WeatherInformation';

// Weather Information Demo Component
interface WeatherInformationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const WeatherInformationDemo = React.forwardRef<HTMLDivElement, WeatherInformationDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [weather, setWeather] = useState<Partial<WeatherData>>({});

    const handleWeatherUpdate = (updatedWeather: WeatherData) => {
      setWeather(updatedWeather);
      console.log('Weather updated:', updatedWeather);
    };

    const mockWeather: Partial<WeatherData> = {
      id: 'weather-1',
      location: {
        name: 'Paris',
        country: 'France',
        coordinates: { lat: 48.8566, lng: 2.3522 },
        timezone: 'Europe/Paris'
      },
      current: {
        temperature: 18,
        feelsLike: 16,
        humidity: 65,
        pressure: 1013,
        visibility: 10,
        uvIndex: 3,
        wind: { speed: 12, direction: 240 },
        condition: { main: 'Clouds', description: 'Partly cloudy', icon: '02d' },
        sunrise: new Date('2024-01-15T08:30:00'),
        sunset: new Date('2024-01-15T17:15:00'),
        timestamp: new Date()
      },
      forecast: [],
      alerts: [],
      climate: {
        averageTemperature: {
          january: 4, february: 5, march: 8, april: 12, may: 16, june: 19,
          july: 21, august: 21, september: 17, october: 13, november: 8, december: 5
        },
        averagePrecipitation: {
          january: 55, february: 45, march: 50, april: 45, may: 60, june: 55,
          july: 60, august: 60, september: 50, october: 60, november: 55, december: 60
        },
        bestTimeToVisit: ['April-June', 'September-November'],
        climateType: 'Temperate Oceanic',
        seasons: []
      },
      lastUpdated: new Date(),
      createdAt: new Date()
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6 p-6 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Weather Information Demo
        </h3>
        
        <WeatherInformation
          onWeatherUpdate={handleWeatherUpdate}
          initialWeather={mockWeather}
          showForecast={true}
          showAlerts={true}
          showClimate={true}
          showRadar={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive weather information with current conditions, forecasts, climate data, and weather alerts.
            </p>
          </div>
        )}
      </div>
    );
  }
);

WeatherInformationDemo.displayName = 'WeatherInformationDemo';

// Export all components
export {
  weatherInformationVariants,
  type WeatherInformationProps,
  type WeatherData,
  type CurrentWeather,
  type WeatherForecast,
  type HourlyForecast,
  type WeatherAlert,
  type ClimateData,
  type SeasonInfo,
  type RadarData,
  type WeatherInformationDemoProps
};
