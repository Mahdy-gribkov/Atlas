/**
 * Local Experiences Component
 * 
 * Provides authentic local experiences and hidden gems for Atlas travel agent.
 * Implements local insights, cultural experiences, and off-the-beaten-path discoveries.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Local Experiences Variants
const localExperiencesVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'local-experiences-mode-standard',
        'enhanced': 'local-experiences-mode-enhanced',
        'advanced': 'local-experiences-mode-advanced',
        'custom': 'local-experiences-mode-custom'
      },
      type: {
        'cultural': 'local-type-cultural',
        'culinary': 'local-type-culinary',
        'artisan': 'local-type-artisan',
        'hidden': 'local-type-hidden',
        'mixed': 'local-type-mixed'
      },
      style: {
        'minimal': 'local-style-minimal',
        'moderate': 'local-style-moderate',
        'detailed': 'local-style-detailed',
        'custom': 'local-style-custom'
      },
      format: {
        'text': 'local-format-text',
        'visual': 'local-format-visual',
        'interactive': 'local-format-interactive',
        'mixed': 'local-format-mixed'
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

// Local Experiences Props
interface LocalExperiencesProps extends VariantProps<typeof localExperiencesVariants> {
  className?: string;
  onExperienceSelect?: (experience: LocalExperienceData) => void;
  initialExperiences?: Partial<LocalExperiencesData>;
  showFilters?: boolean;
  showCultural?: boolean;
  showCulinary?: boolean;
  showArtisan?: boolean;
}

// Local Experiences Data Interface
interface LocalExperiencesData {
  id: string;
  destination: string;
  experiences: LocalExperienceData[];
  cultural: LocalExperienceData[];
  culinary: LocalExperienceData[];
  artisan: LocalExperienceData[];
  hidden: LocalExperienceData[];
  categories: ExperienceCategory[];
  filters: ExperienceFilters;
  localInsights: LocalInsight[];
  createdAt: Date;
  updatedAt: Date;
}

// Local Experience Data Interface
interface LocalExperienceData {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'cultural' | 'culinary' | 'artisan' | 'hidden' | 'social' | 'educational';
  host: {
    name: string;
    avatar?: string;
    bio: string;
    rating: number;
    reviewCount: number;
    languages: string[];
    specialties: string[];
  };
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    neighborhood: string;
    accessibility: string[];
  };
  images: ExperienceImage[];
  pricing: {
    price: number;
    currency: string;
    includes: string[];
    groupSize: {
      min: number;
      max: number;
    };
    duration: number; // in hours
  };
  schedule: {
    days: string[];
    times: string[];
    frequency: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  };
  highlights: string[];
  whatToExpect: string[];
  requirements: {
    age: {
      min?: number;
      max?: number;
    };
    fitness: 'low' | 'moderate' | 'high';
    equipment: string[];
    skills: string[];
  };
  reviews: ExperienceReview[];
  rating: number;
  reviewCount: number;
  tags: string[];
  isAuthentic: boolean;
  isHidden: boolean;
  difficulty: 'easy' | 'moderate' | 'challenging';
  language: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Experience Image Interface
interface ExperienceImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  isMain: boolean;
}

// Experience Review Interface
interface ExperienceReview {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  helpful: number;
  photos: string[];
}

// Experience Category Interface
interface ExperienceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: string[];
}

// Local Insight Interface
interface LocalInsight {
  id: string;
  title: string;
  content: string;
  category: 'tip' | 'secret' | 'tradition' | 'history' | 'culture';
  author: string;
  location?: string;
  createdAt: Date;
}

// Experience Filters Interface
interface ExperienceFilters {
  category: string[];
  type: string[];
  priceRange: {
    min: number;
    max: number;
  };
  duration: {
    min: number;
    max: number;
  };
  rating: number;
  difficulty: string[];
  language: string[];
  groupSize: {
    min: number;
    max: number;
  };
}

// Local Experiences Component
export const LocalExperiences = React.forwardRef<HTMLDivElement, LocalExperiencesProps>(
  ({ 
    className, 
    onExperienceSelect,
    initialExperiences,
    showFilters = true,
    showCultural = true,
    showCulinary = true,
    showArtisan = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [experiences, setExperiences] = useState<LocalExperiencesData>(
      initialExperiences || {
        id: '',
        destination: '',
        experiences: [],
        cultural: [],
        culinary: [],
        artisan: [],
        hidden: [],
        categories: [],
        filters: {
          category: [],
          type: [],
          priceRange: { min: 0, max: 500 },
          duration: { min: 1, max: 8 },
          rating: 0,
          difficulty: [],
          language: [],
          groupSize: { min: 1, max: 20 }
        },
        localInsights: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('cultural');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const tabs = [
      { id: 'cultural', name: 'Cultural', icon: '🎭' },
      { id: 'culinary', name: 'Culinary', icon: '🍽️' },
      { id: 'artisan', name: 'Artisan', icon: '🎨' },
      { id: 'hidden', name: 'Hidden Gems', icon: '💎' },
      { id: 'all', name: 'All Experiences', icon: '🌟' }
    ];

    const experienceCategories = [
      { id: 'cultural', name: 'Cultural', icon: '🎭', subcategories: ['Traditions', 'Festivals', 'Music', 'Dance'] },
      { id: 'culinary', name: 'Culinary', icon: '🍽️', subcategories: ['Cooking Classes', 'Food Tours', 'Market Visits', 'Wine Tasting'] },
      { id: 'artisan', name: 'Artisan', icon: '🎨', subcategories: ['Crafts', 'Pottery', 'Textiles', 'Jewelry'] },
      { id: 'hidden', name: 'Hidden Gems', icon: '💎', subcategories: ['Secret Spots', 'Local Favorites', 'Off-the-Beaten-Path'] },
      { id: 'social', name: 'Social', icon: '👥', subcategories: ['Meetups', 'Language Exchange', 'Community Events'] },
      { id: 'educational', name: 'Educational', icon: '📚', subcategories: ['History', 'Language', 'Skills', 'Workshops'] }
    ];

    const difficultyLevels = [
      { id: 'easy', name: 'Easy', icon: '🟢' },
      { id: 'moderate', name: 'Moderate', icon: '🟡' },
      { id: 'challenging', name: 'Challenging', icon: '🔴' }
    ];

    const updateExperiences = useCallback((path: string, value: any) => {
      setExperiences(prev => {
        const newExperiences = { ...prev };
        const keys = path.split('.');
        let current: any = newExperiences;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newExperiences.updatedAt = new Date();
        return newExperiences;
      });
    }, []);

    const loadExperiences = useCallback(async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockExperiences: LocalExperienceData[] = [
        {
          id: 'exp-1',
          title: 'Traditional French Cooking Class with Local Chef',
          description: 'Learn to cook authentic French dishes in a local chef\'s home kitchen. Experience the warmth of French hospitality while mastering classic techniques.',
          category: 'culinary',
          type: 'culinary',
          host: {
            name: 'Marie Dubois',
            avatar: '/images/marie-avatar.jpg',
            bio: 'Professional chef with 15 years of experience in traditional French cuisine. Passionate about sharing authentic recipes and techniques.',
            rating: 4.9,
            reviewCount: 127,
            languages: ['French', 'English'],
            specialties: ['French Cuisine', 'Pastry', 'Wine Pairing']
          },
          location: {
            name: 'Marie\'s Kitchen',
            address: 'Rue de Rivoli, 4th arrondissement, Paris',
            coordinates: { lat: 48.8566, lng: 2.3522 },
            neighborhood: 'Marais',
            accessibility: ['Wheelchair accessible', 'Elevator available']
          },
          images: [
            {
              id: 'img-1',
              url: '/images/cooking-class.jpg',
              thumbnail: '/images/cooking-class-thumb.jpg',
              caption: 'Traditional French cooking class',
              isMain: true
            }
          ],
          pricing: {
            price: 85,
            currency: 'USD',
            includes: ['All ingredients', 'Recipe cards', 'Wine tasting', 'Take-home treats'],
            groupSize: { min: 2, max: 8 },
            duration: 3
          },
          schedule: {
            days: ['Tuesday', 'Thursday', 'Saturday'],
            times: ['10:00', '15:00'],
            frequency: 'weekly'
          },
          highlights: ['Hands-on cooking', 'Local ingredients', 'Small group size', 'Authentic recipes'],
          whatToExpect: ['Welcome drink', 'Market visit', 'Cooking session', 'Dining together'],
          requirements: {
            fitness: 'low',
            equipment: [],
            skills: []
          },
          reviews: [],
          rating: 4.9,
          reviewCount: 127,
          tags: ['cooking', 'french-cuisine', 'authentic', 'small-group'],
          isAuthentic: true,
          isHidden: false,
          difficulty: 'easy',
          language: ['English'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'exp-2',
          title: 'Secret Artisan Workshop in Montmartre',
          description: 'Discover hidden artisan workshops in the charming Montmartre district. Meet local craftspeople and learn traditional techniques.',
          category: 'artisan',
          type: 'artisan',
          host: {
            name: 'Pierre Moreau',
            avatar: '/images/pierre-avatar.jpg',
            bio: 'Third-generation artisan specializing in traditional French crafts. Runs a hidden workshop in Montmartre.',
            rating: 4.8,
            reviewCount: 89,
            languages: ['French', 'English'],
            specialties: ['Woodworking', 'Metalwork', 'Traditional Crafts']
          },
          location: {
            name: 'Atelier Secret',
            address: 'Rue des Abbesses, 18th arrondissement, Paris',
            coordinates: { lat: 48.8846, lng: 2.3397 },
            neighborhood: 'Montmartre',
            accessibility: ['Stairs only']
          },
          images: [
            {
              id: 'img-2',
              url: '/images/artisan-workshop.jpg',
              thumbnail: '/images/artisan-workshop-thumb.jpg',
              caption: 'Hidden artisan workshop',
              isMain: true
            }
          ],
          pricing: {
            price: 65,
            currency: 'USD',
            includes: ['Materials', 'Tools', 'Take-home creation', 'Coffee break'],
            groupSize: { min: 1, max: 6 },
            duration: 2
          },
          schedule: {
            days: ['Monday', 'Wednesday', 'Friday'],
            times: ['14:00', '16:00'],
            frequency: 'weekly'
          },
          highlights: ['Hidden location', 'Traditional techniques', 'Hands-on learning', 'Unique souvenirs'],
          whatToExpect: ['Workshop tour', 'Demonstration', 'Hands-on work', 'Coffee break'],
          requirements: {
            fitness: 'moderate',
            equipment: [],
            skills: []
          },
          reviews: [],
          rating: 4.8,
          reviewCount: 89,
          tags: ['artisan', 'hidden', 'traditional', 'hands-on'],
          isAuthentic: true,
          isHidden: true,
          difficulty: 'moderate',
          language: ['English'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      updateExperiences('experiences', mockExperiences);
      updateExperiences('cultural', mockExperiences.filter(e => e.type === 'cultural'));
      updateExperiences('culinary', mockExperiences.filter(e => e.type === 'culinary'));
      updateExperiences('artisan', mockExperiences.filter(e => e.type === 'artisan'));
      updateExperiences('hidden', mockExperiences.filter(e => e.isHidden));
      setIsLoading(false);
    }, [updateExperiences]);

    const getCurrentExperiences = useCallback(() => {
      switch (activeTab) {
        case 'cultural':
          return experiences.cultural;
        case 'culinary':
          return experiences.culinary;
        case 'artisan':
          return experiences.artisan;
        case 'hidden':
          return experiences.hidden;
        case 'all':
          return experiences.experiences;
        default:
          return experiences.experiences;
      }
    }, [activeTab, experiences]);

    const getCategoryIcon = (category: string) => {
      const cat = experienceCategories.find(c => c.id === category);
      return cat?.icon || '🌟';
    };

    const getDifficultyColor = (difficulty: LocalExperienceData['difficulty']) => {
      switch (difficulty) {
        case 'easy': return 'text-green-600 dark:text-green-400';
        case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
        case 'challenging': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getDifficultyIcon = (difficulty: LocalExperienceData['difficulty']) => {
      switch (difficulty) {
        case 'easy': return '🟢';
        case 'moderate': return '🟡';
        case 'challenging': return '🔴';
        default: return '⚪';
      }
    };

    const formatPrice = (pricing: LocalExperienceData['pricing']) => {
      return `${pricing.currency} ${pricing.price}`;
    };

    const formatDuration = (duration: number) => {
      return `${duration}h`;
    };

    useEffect(() => {
      loadExperiences();
    }, [loadExperiences]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          localExperiencesVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Local Experiences
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover authentic experiences in {experiences.destination || 'your destination'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadExperiences}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? '🔄' : '🔄'} Refresh
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={cn(
              'px-4 py-2 text-sm rounded-md transition-colors duration-200',
              selectedCategory === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            )}
          >
            All Categories
          </button>
          {experienceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'px-4 py-2 text-sm rounded-md transition-colors duration-200',
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              )}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

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
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Discovering authentic experiences...</p>
            </div>
          ) : getCurrentExperiences().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentExperiences()
                .filter(experience => !selectedCategory || experience.category === selectedCategory)
                .map((experience) => (
                <div
                  key={experience.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => onExperienceSelect?.(experience)}
                >
                  {experience.images[0] && (
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                      <img
                        src={experience.images[0].thumbnail}
                        alt={experience.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(experience.category)}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {experienceCategories.find(c => c.id === experience.category)?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {experience.rating}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          ({experience.reviewCount})
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {experience.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {experience.description}
                    </p>
                    
                    {/* Host Info */}
                    <div className="flex items-center gap-2 mb-3">
                      {experience.host.avatar && (
                        <img
                          src={experience.host.avatar}
                          alt={experience.host.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Hosted by {experience.host.name}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>📍 {experience.location.neighborhood}</span>
                        <span className={cn('flex items-center gap-1', getDifficultyColor(experience.difficulty))}>
                          {getDifficultyIcon(experience.difficulty)} {experience.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>⏱️ {formatDuration(experience.pricing.duration)}</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatPrice(experience.pricing)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>👥 {experience.pricing.groupSize.min}-{experience.pricing.groupSize.max} people</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {experience.language.join(', ')}
                        </span>
                      </div>
                    </div>
                    
                    {experience.isAuthentic && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                          ✅ Authentic
                        </span>
                        {experience.isHidden && (
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-md">
                            💎 Hidden Gem
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1">
                        {experience.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                        Book Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No experiences found
              </h3>
              <p>Try adjusting your filters or check back later for new experiences</p>
            </div>
          )}
        </div>

        {/* Local Insights */}
        {experiences.localInsights.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Local Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiences.localInsights.map((insight) => (
                <div key={insight.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {insight.content}
                  </p>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    By {insight.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

LocalExperiences.displayName = 'LocalExperiences';

// Local Experiences Demo Component
interface LocalExperiencesDemoProps {
  className?: string;
  showControls?: boolean;
}

export const LocalExperiencesDemo = React.forwardRef<HTMLDivElement, LocalExperiencesDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [experiences, setExperiences] = useState<Partial<LocalExperiencesData>>({});

    const handleExperienceSelect = (experience: LocalExperienceData) => {
      console.log('Experience selected:', experience);
    };

    const mockExperiences: Partial<LocalExperiencesData> = {
      id: 'exp-1',
      destination: 'Paris, France',
      experiences: [],
      cultural: [],
      culinary: [],
      artisan: [],
      hidden: [],
      categories: [],
      filters: {
        category: [],
        type: [],
        priceRange: { min: 0, max: 200 },
        duration: { min: 1, max: 6 },
        rating: 0,
        difficulty: [],
        language: [],
        groupSize: { min: 1, max: 15 }
      },
      localInsights: [
        {
          id: 'insight-1',
          title: 'Best Time to Visit Local Markets',
          content: 'Visit Marché des Enfants Rouges on Tuesday mornings for the freshest produce and fewer crowds.',
          category: 'tip',
          author: 'Local Guide Marie',
          createdAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
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
          Local Experiences Demo
        </h3>
        
        <LocalExperiences
          onExperienceSelect={handleExperienceSelect}
          initialExperiences={mockExperiences}
          showFilters={true}
          showCultural={true}
          showCulinary={true}
          showArtisan={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Authentic local experiences with cultural, culinary, and artisan activities, plus hidden gems and local insights.
            </p>
          </div>
        )}
      </div>
    );
  }
);

LocalExperiencesDemo.displayName = 'LocalExperiencesDemo';

// Export all components
export {
  localExperiencesVariants,
  type LocalExperiencesProps,
  type LocalExperiencesData,
  type LocalExperienceData,
  type ExperienceImage,
  type ExperienceReview,
  type ExperienceCategory,
  type LocalInsight,
  type ExperienceFilters,
  type LocalExperiencesDemoProps
};
