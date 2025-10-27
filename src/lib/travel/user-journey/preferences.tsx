/**
 * Preferences Component
 * 
 * Provides user preferences management for Atlas travel agent.
 * Implements comprehensive preference settings and customization features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Preferences Variants
const preferencesVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'preferences-mode-standard',
        'enhanced': 'preferences-mode-enhanced',
        'advanced': 'preferences-mode-advanced',
        'custom': 'preferences-mode-custom'
      },
      type: {
        'travel': 'preferences-type-travel',
        'ui': 'preferences-type-ui',
        'notifications': 'preferences-type-notifications',
        'privacy': 'preferences-type-privacy',
        'mixed': 'preferences-type-mixed'
      },
      style: {
        'minimal': 'preferences-style-minimal',
        'moderate': 'preferences-style-moderate',
        'detailed': 'preferences-style-detailed',
        'custom': 'preferences-style-custom'
      },
      format: {
        'text': 'preferences-format-text',
        'visual': 'preferences-format-visual',
        'interactive': 'preferences-format-interactive',
        'mixed': 'preferences-format-mixed'
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

// Preferences Props
interface PreferencesProps extends VariantProps<typeof preferencesVariants> {
  className?: string;
  onPreferencesChange?: (preferences: UserPreferences) => void;
  initialPreferences?: Partial<UserPreferences>;
  showSections?: string[];
  showReset?: boolean;
  showExport?: boolean;
}

// User Preferences Interface
interface UserPreferences {
  travel: {
    style: string[];
    budget: {
      range: 'budget' | 'mid-range' | 'luxury';
      dailyAmount: number;
      currency: string;
    };
    interests: string[];
    accommodation: {
      type: string[];
      amenities: string[];
      rating: number;
    };
    transportation: {
      preferred: string[];
      avoid: string[];
    };
    activities: {
      indoor: string[];
      outdoor: string[];
      cultural: string[];
      adventure: string[];
    };
    dining: {
      cuisine: string[];
      dietary: string[];
      priceRange: string;
      atmosphere: string[];
    };
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    currency: string;
    timezone: string;
    dateFormat: string;
    temperature: 'celsius' | 'fahrenheit';
    distance: 'metric' | 'imperial';
    fontSize: 'small' | 'medium' | 'large';
    animations: boolean;
    soundEffects: boolean;
  };
  notifications: {
    email: {
      enabled: boolean;
      frequency: 'immediate' | 'daily' | 'weekly';
      types: string[];
    };
    push: {
      enabled: boolean;
      types: string[];
    };
    sms: {
      enabled: boolean;
      types: string[];
    };
    inApp: {
      enabled: boolean;
      types: string[];
    };
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    locationSharing: boolean;
    travelHistory: boolean;
    socialFeatures: boolean;
    dataCollection: boolean;
    analytics: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    voiceControl: boolean;
  };
}

// Preferences Component
export const Preferences = React.forwardRef<HTMLDivElement, PreferencesProps>(
  ({ 
    className, 
    onPreferencesChange,
    initialPreferences,
    showSections = ['travel', 'ui', 'notifications', 'privacy', 'accessibility'],
    showReset = true,
    showExport = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [preferences, setPreferences] = useState<UserPreferences>(
      initialPreferences || {
        travel: {
          style: ['culture', 'nature'],
          budget: {
            range: 'mid-range',
            dailyAmount: 100,
            currency: 'USD'
          },
          interests: ['photography', 'history', 'food'],
          accommodation: {
            type: ['hotel', 'bnb'],
            amenities: ['wifi', 'breakfast'],
            rating: 4
          },
          transportation: {
            preferred: ['flight', 'train'],
            avoid: ['bus']
          },
          activities: {
            indoor: ['museums', 'shopping'],
            outdoor: ['hiking', 'beaches'],
            cultural: ['temples', 'festivals'],
            adventure: ['diving', 'climbing']
          },
          dining: {
            cuisine: ['local', 'italian'],
            dietary: [],
            priceRange: 'mid-range',
            atmosphere: ['casual', 'romantic']
          }
        },
        ui: {
          theme: 'auto',
          language: 'en',
          currency: 'USD',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          temperature: 'celsius',
          distance: 'metric',
          fontSize: 'medium',
          animations: true,
          soundEffects: false
        },
        notifications: {
          email: {
            enabled: true,
            frequency: 'daily',
            types: ['bookings', 'recommendations', 'updates']
          },
          push: {
            enabled: true,
            types: ['bookings', 'alerts']
          },
          sms: {
            enabled: false,
            types: ['emergency']
          },
          inApp: {
            enabled: true,
            types: ['all']
          }
        },
        privacy: {
          profileVisibility: 'friends',
          locationSharing: true,
          travelHistory: false,
          socialFeatures: true,
          dataCollection: true,
          analytics: true
        },
        accessibility: {
          highContrast: false,
          largeText: false,
          reducedMotion: false,
          screenReader: false,
          keyboardNavigation: true,
          voiceControl: false
        }
      }
    );

    const [activeSection, setActiveSection] = useState(showSections[0] || 'travel');
    const [hasChanges, setHasChanges] = useState(false);

    const sections = [
      { id: 'travel', name: 'Travel', icon: '✈️' },
      { id: 'ui', name: 'Interface', icon: '🎨' },
      { id: 'notifications', name: 'Notifications', icon: '🔔' },
      { id: 'privacy', name: 'Privacy', icon: '🔒' },
      { id: 'accessibility', name: 'Accessibility', icon: '♿' }
    ].filter(section => showSections.includes(section.id));

    const updatePreference = useCallback((path: string, value: any) => {
      setPreferences(prev => {
        const newPreferences = { ...prev };
        const keys = path.split('.');
        let current: any = newPreferences;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        setHasChanges(true);
        onPreferencesChange?.(newPreferences);
        return newPreferences;
      });
    }, [onPreferencesChange]);

    const resetPreferences = useCallback(() => {
      const defaultPreferences: UserPreferences = {
        travel: {
          style: [],
          budget: {
            range: 'mid-range',
            dailyAmount: 100,
            currency: 'USD'
          },
          interests: [],
          accommodation: {
            type: [],
            amenities: [],
            rating: 4
          },
          transportation: {
            preferred: [],
            avoid: []
          },
          activities: {
            indoor: [],
            outdoor: [],
            cultural: [],
            adventure: []
          },
          dining: {
            cuisine: [],
            dietary: [],
            priceRange: 'mid-range',
            atmosphere: []
          }
        },
        ui: {
          theme: 'auto',
          language: 'en',
          currency: 'USD',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          temperature: 'celsius',
          distance: 'metric',
          fontSize: 'medium',
          animations: true,
          soundEffects: false
        },
        notifications: {
          email: {
            enabled: true,
            frequency: 'daily',
            types: []
          },
          push: {
            enabled: true,
            types: []
          },
          sms: {
            enabled: false,
            types: []
          },
          inApp: {
            enabled: true,
            types: []
          }
        },
        privacy: {
          profileVisibility: 'friends',
          locationSharing: true,
          travelHistory: false,
          socialFeatures: true,
          dataCollection: true,
          analytics: true
        },
        accessibility: {
          highContrast: false,
          largeText: false,
          reducedMotion: false,
          screenReader: false,
          keyboardNavigation: true,
          voiceControl: false
        }
      };
      
      setPreferences(defaultPreferences);
      setHasChanges(true);
      onPreferencesChange?.(defaultPreferences);
    }, [onPreferencesChange]);

    const exportPreferences = useCallback(() => {
      const dataStr = JSON.stringify(preferences, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'atlas-preferences.json';
      link.click();
      URL.revokeObjectURL(url);
    }, [preferences]);

    const travelStyles = [
      'Adventure', 'Culture', 'Relaxation', 'Food & Wine', 'Nature', 'Urban',
      'Luxury', 'Budget', 'Family', 'Solo', 'Business', 'Romantic'
    ];

    const interests = [
      'Photography', 'Art', 'Music', 'Sports', 'History', 'Architecture',
      'Cooking', 'Dancing', 'Reading', 'Gaming', 'Fitness', 'Yoga',
      'Meditation', 'Volunteering', 'Learning', 'Socializing'
    ];

    const accommodationTypes = [
      'Hotel', 'Hostel', 'B&B', 'Apartment', 'Villa', 'Resort',
      'Cabin', 'Camping', 'Homestay', 'Boutique'
    ];

    const amenities = [
      'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar',
      'Parking', 'Airport Shuttle', 'Pet Friendly', 'Business Center'
    ];

    const transportationTypes = [
      'Flight', 'Train', 'Bus', 'Car', 'Taxi', 'Rideshare',
      'Bike', 'Walking', 'Boat', 'Subway'
    ];

    const cuisines = [
      'Local', 'Italian', 'French', 'Japanese', 'Chinese', 'Indian',
      'Mexican', 'Thai', 'Mediterranean', 'American', 'Fusion'
    ];

    const languages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' }
    ];

    const currencies = [
      'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'
    ];

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          preferencesVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Preferences
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Customize your Atlas experience
            </p>
          </div>
          <div className="flex gap-2">
            {showReset && (
              <button
                onClick={resetPreferences}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Reset
              </button>
            )}
            {showExport && (
              <button
                onClick={exportPreferences}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                Export
              </button>
            )}
            {hasChanges && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-600">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200',
                activeSection === section.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              <span>{section.icon}</span>
              <span>{section.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeSection === 'travel' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Travel Style
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {travelStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => {
                        const currentStyles = preferences.travel.style;
                        const newStyles = currentStyles.includes(style)
                          ? currentStyles.filter(s => s !== style)
                          : [...currentStyles, style];
                        updatePreference('travel.style', newStyles);
                      }}
                      className={cn(
                        'px-3 py-2 text-sm rounded-md transition-colors duration-200',
                        preferences.travel.style.includes(style)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Budget
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Range
                    </label>
                    <select
                      value={preferences.travel.budget.range}
                      onChange={(e) => updatePreference('travel.budget.range', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="budget">Budget</option>
                      <option value="mid-range">Mid-range</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Daily Amount
                    </label>
                    <input
                      type="number"
                      value={preferences.travel.budget.dailyAmount}
                      onChange={(e) => updatePreference('travel.budget.dailyAmount', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Currency
                    </label>
                    <select
                      value={preferences.travel.budget.currency}
                      onChange={(e) => updatePreference('travel.budget.currency', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    >
                      {currencies.map((currency) => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Interests
                </h4>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => {
                        const currentInterests = preferences.travel.interests;
                        const newInterests = currentInterests.includes(interest)
                          ? currentInterests.filter(i => i !== interest)
                          : [...currentInterests, interest];
                        updatePreference('travel.interests', newInterests);
                      }}
                      className={cn(
                        'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                        preferences.travel.interests.includes(interest)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      )}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Accommodation
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Preferred Types
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {accommodationTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            const currentTypes = preferences.travel.accommodation.type;
                            const newTypes = currentTypes.includes(type)
                              ? currentTypes.filter(t => t !== type)
                              : [...currentTypes, type];
                            updatePreference('travel.accommodation.type', newTypes);
                          }}
                          className={cn(
                            'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                            preferences.travel.accommodation.type.includes(type)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Required Amenities
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {amenities.map((amenity) => (
                        <button
                          key={amenity}
                          onClick={() => {
                            const currentAmenities = preferences.travel.accommodation.amenities;
                            const newAmenities = currentAmenities.includes(amenity)
                              ? currentAmenities.filter(a => a !== amenity)
                              : [...currentAmenities, amenity];
                            updatePreference('travel.accommodation.amenities', newAmenities);
                          }}
                          className={cn(
                            'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                            preferences.travel.accommodation.amenities.includes(amenity)
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          )}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Minimum Rating
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={preferences.travel.accommodation.rating}
                        onChange={(e) => updatePreference('travel.accommodation.rating', parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {preferences.travel.accommodation.rating} ⭐
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Transportation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Preferred
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {transportationTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            const currentPreferred = preferences.travel.transportation.preferred;
                            const newPreferred = currentPreferred.includes(type)
                              ? currentPreferred.filter(t => t !== type)
                              : [...currentPreferred, type];
                            updatePreference('travel.transportation.preferred', newPreferred);
                          }}
                          className={cn(
                            'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                            preferences.travel.transportation.preferred.includes(type)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Avoid
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {transportationTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            const currentAvoid = preferences.travel.transportation.avoid;
                            const newAvoid = currentAvoid.includes(type)
                              ? currentAvoid.filter(t => t !== type)
                              : [...currentAvoid, type];
                            updatePreference('travel.transportation.avoid', newAvoid);
                          }}
                          className={cn(
                            'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                            preferences.travel.transportation.avoid.includes(type)
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Dining
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Preferred Cuisines
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {cuisines.map((cuisine) => (
                        <button
                          key={cuisine}
                          onClick={() => {
                            const currentCuisines = preferences.travel.dining.cuisine;
                            const newCuisines = currentCuisines.includes(cuisine)
                              ? currentCuisines.filter(c => c !== cuisine)
                              : [...currentCuisines, cuisine];
                            updatePreference('travel.dining.cuisine', newCuisines);
                          }}
                          className={cn(
                            'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                            preferences.travel.dining.cuisine.includes(cuisine)
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          )}
                        >
                          {cuisine}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Price Range
                      </label>
                      <select
                        value={preferences.travel.dining.priceRange}
                        onChange={(e) => updatePreference('travel.dining.priceRange', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                      >
                        <option value="budget">Budget</option>
                        <option value="mid-range">Mid-range</option>
                        <option value="upscale">Upscale</option>
                        <option value="fine-dining">Fine Dining</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Atmosphere
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['casual', 'romantic', 'family', 'business', 'trendy', 'traditional'].map((atmosphere) => (
                          <button
                            key={atmosphere}
                            onClick={() => {
                              const currentAtmosphere = preferences.travel.dining.atmosphere;
                              const newAtmosphere = currentAtmosphere.includes(atmosphere)
                                ? currentAtmosphere.filter(a => a !== atmosphere)
                                : [...currentAtmosphere, atmosphere];
                              updatePreference('travel.dining.atmosphere', newAtmosphere);
                            }}
                            className={cn(
                              'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                              preferences.travel.dining.atmosphere.includes(atmosphere)
                                ? 'bg-pink-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            )}
                          >
                            {atmosphere}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'ui' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Theme
                  </label>
                  <div className="flex gap-2">
                    {['light', 'dark', 'auto'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updatePreference('ui.theme', theme)}
                        className={cn(
                          'px-3 py-2 text-sm rounded-md transition-colors duration-200',
                          preferences.ui.theme === theme
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                        )}
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Language
                  </label>
                  <select
                    value={preferences.ui.language}
                    onChange={(e) => updatePreference('ui.language', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Currency
                  </label>
                  <select
                    value={preferences.ui.currency}
                    onChange={(e) => updatePreference('ui.currency', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Font Size
                  </label>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => updatePreference('ui.fontSize', size)}
                        className={cn(
                          'px-3 py-2 text-sm rounded-md transition-colors duration-200',
                          preferences.ui.fontSize === size
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                        )}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Display Options
                </h4>
                <div className="space-y-3">
                  {Object.entries(preferences.ui).filter(([key]) => typeof preferences.ui[key as keyof typeof preferences.ui] === 'boolean').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                      <button
                        onClick={() => updatePreference(`ui.${key}`, !value)}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                          value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                            value ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              {Object.entries(preferences.notifications).map(([type, settings]) => (
                <div key={type}>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Notifications
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Enable {type} notifications
                      </label>
                      <button
                        onClick={() => updatePreference(`notifications.${type}.enabled`, !settings.enabled)}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                          settings.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                            settings.enabled ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>
                    
                    {settings.enabled && settings.frequency && (
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Frequency
                        </label>
                        <select
                          value={settings.frequency}
                          onChange={(e) => updatePreference(`notifications.${type}.frequency`, e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                        >
                          <option value="immediate">Immediate</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Privacy Settings
                </h4>
                <div className="space-y-3">
                  {Object.entries(preferences.privacy).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                      {typeof value === 'boolean' ? (
                        <button
                          onClick={() => updatePreference(`privacy.${key}`, !value)}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                            value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                              value ? 'translate-x-6' : 'translate-x-1'
                            )}
                          />
                        </button>
                      ) : (
                        <select
                          value={value}
                          onChange={(e) => updatePreference(`privacy.${key}`, e.target.value)}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                        >
                          <option value="public">Public</option>
                          <option value="friends">Friends Only</option>
                          <option value="private">Private</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'accessibility' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Accessibility Options
                </h4>
                <div className="space-y-3">
                  {Object.entries(preferences.accessibility).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                      <button
                        onClick={() => updatePreference(`accessibility.${key}`, !value)}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                          value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                            value ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Preferences.displayName = 'Preferences';

// Preferences Demo Component
interface PreferencesDemoProps {
  className?: string;
  showControls?: boolean;
}

export const PreferencesDemo = React.forwardRef<HTMLDivElement, PreferencesDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});

    const handlePreferencesChange = (updatedPreferences: UserPreferences) => {
      setPreferences(updatedPreferences);
      console.log('Preferences updated:', updatedPreferences);
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
          Preferences Demo
        </h3>
        
        <Preferences
          onPreferencesChange={handlePreferencesChange}
          initialPreferences={preferences}
          showSections={['travel', 'ui', 'notifications', 'privacy', 'accessibility']}
          showReset={true}
          showExport={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive preferences management with travel, UI, notifications, privacy, and accessibility settings.
            </p>
          </div>
        )}
      </div>
    );
  }
);

PreferencesDemo.displayName = 'PreferencesDemo';

// Export all components
export {
  preferencesVariants,
  type PreferencesProps,
  type UserPreferences,
  type PreferencesDemoProps
};
