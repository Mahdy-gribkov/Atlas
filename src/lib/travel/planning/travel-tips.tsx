/**
 * Travel Tips Component
 * 
 * Provides destination-specific travel tips and advice for Atlas travel agent.
 * Implements travel guidance, local insights, and practical advice.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Travel Tips Variants
const travelTipsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'travel-tips-mode-standard',
        'enhanced': 'travel-tips-mode-enhanced',
        'advanced': 'travel-tips-mode-advanced',
        'custom': 'travel-tips-mode-custom'
      },
      type: {
        'general': 'tips-type-general',
        'destination': 'tips-type-destination',
        'cultural': 'tips-type-cultural',
        'mixed': 'tips-type-mixed'
      },
      style: {
        'minimal': 'tips-style-minimal',
        'moderate': 'tips-style-moderate',
        'detailed': 'tips-style-detailed',
        'custom': 'tips-style-custom'
      },
      format: {
        'text': 'tips-format-text',
        'visual': 'tips-format-visual',
        'interactive': 'tips-format-interactive',
        'mixed': 'tips-format-mixed'
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

// Travel Tips Props
interface TravelTipsProps extends VariantProps<typeof travelTipsVariants> {
  className?: string;
  onTipsUpdate?: (tips: TravelTipsData) => void;
  initialTips?: Partial<TravelTipsData>;
  showCategories?: boolean;
  showFavorites?: boolean;
  showPersonalized?: boolean;
  showLocal?: boolean;
}

// Travel Tips Data Interface
interface TravelTipsData {
  id: string;
  tripId: string;
  tripName: string;
  destination: string;
  tips: TravelTip[];
  categories: TipCategory[];
  favorites: string[];
  personalized: PersonalizedTip[];
  localInsights: LocalInsight[];
  settings: TipsSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Travel Tip Interface
interface TravelTip {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  subcategory: string;
  type: 'general' | 'destination' | 'cultural' | 'practical' | 'safety' | 'budget' | 'food' | 'transportation';
  priority: 'high' | 'medium' | 'low';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // estimated reading time in minutes
  tags: string[];
  author: string;
  source: string;
  credibility: number; // 0-100
  isVerified: boolean;
  isLocal: boolean;
  isPersonalized: boolean;
  applicableSeasons: string[];
  applicableActivities: string[];
  applicableBudget: 'budget' | 'mid-range' | 'luxury' | 'any';
  images: TipImage[];
  links: TipLink[];
  relatedTips: string[];
  likes: number;
  dislikes: number;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tip Category Interface
interface TipCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  subcategories: string[];
  isPopular: boolean;
  tipCount: number;
}

// Personalized Tip Interface
interface PersonalizedTip {
  id: string;
  tipId: string;
  reason: string;
  confidence: number; // 0-100
  factors: string[];
  isApplied: boolean;
  feedback?: 'helpful' | 'not-helpful' | 'neutral';
  createdAt: Date;
}

// Local Insight Interface
interface LocalInsight {
  id: string;
  title: string;
  description: string;
  location: string;
  type: 'restaurant' | 'attraction' | 'experience' | 'tip' | 'warning';
  category: string;
  rating: number;
  priceRange: 'budget' | 'mid-range' | 'expensive';
  bestTime: string;
  localContact?: string;
  isVerified: boolean;
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
}

// Tip Image Interface
interface TipImage {
  id: string;
  url: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
}

// Tip Link Interface
interface TipLink {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'website' | 'app' | 'other';
  description: string;
}

// Tips Settings Interface
interface TipsSettings {
  showPersonalizedOnly: boolean;
  showVerifiedOnly: boolean;
  showLocalOnly: boolean;
  preferredCategories: string[];
  excludedCategories: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'all';
  budgetPreference: 'budget' | 'mid-range' | 'luxury' | 'any';
  language: string;
  notifications: boolean;
  autoBookmark: boolean;
}

// Travel Tips Component
export const TravelTips = React.forwardRef<HTMLDivElement, TravelTipsProps>(
  ({ 
    className, 
    onTipsUpdate,
    initialTips,
    showCategories = true,
    showFavorites = true,
    showPersonalized = true,
    showLocal = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [tips, setTips] = useState<TravelTipsData>(
      initialTips || {
        id: '',
        tripId: '',
        tripName: '',
        destination: '',
        tips: [],
        categories: [],
        favorites: [],
        personalized: [],
        localInsights: [],
        settings: {
          showPersonalizedOnly: false,
          showVerifiedOnly: false,
          showLocalOnly: false,
          preferredCategories: [],
          excludedCategories: [],
          difficultyLevel: 'all',
          budgetPreference: 'any',
          language: 'en',
          notifications: true,
          autoBookmark: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTip, setSelectedTip] = useState<TravelTip | null>(null);

    const tabs = [
      { id: 'all', name: 'All Tips', icon: '💡' },
      { id: 'personalized', name: 'Personalized', icon: '🎯' },
      { id: 'local', name: 'Local Insights', icon: '🏘️' },
      { id: 'favorites', name: 'Favorites', icon: '⭐' },
      { id: 'categories', name: 'Categories', icon: '📁' }
    ];

    const tipTypes = [
      { id: 'general', name: 'General', icon: '🌍', color: 'blue' },
      { id: 'destination', name: 'Destination', icon: '📍', color: 'green' },
      { id: 'cultural', name: 'Cultural', icon: '🎭', color: 'purple' },
      { id: 'practical', name: 'Practical', icon: '🛠️', color: 'orange' },
      { id: 'safety', name: 'Safety', icon: '🛡️', color: 'red' },
      { id: 'budget', name: 'Budget', icon: '💰', color: 'yellow' },
      { id: 'food', name: 'Food', icon: '🍽️', color: 'pink' },
      { id: 'transportation', name: 'Transportation', icon: '🚗', color: 'indigo' }
    ];

    const defaultCategories = [
      { id: 'getting-around', name: 'Getting Around', icon: '🚗', color: 'blue', description: 'Transportation tips', subcategories: ['public-transport', 'taxi', 'rental-car', 'walking'], isPopular: true, tipCount: 0 },
      { id: 'accommodation', name: 'Accommodation', icon: '🏨', color: 'green', description: 'Where to stay', subcategories: ['hotels', 'hostels', 'airbnb', 'booking'], isPopular: true, tipCount: 0 },
      { id: 'food-drink', name: 'Food & Drink', icon: '🍽️', color: 'orange', description: 'Dining recommendations', subcategories: ['restaurants', 'street-food', 'local-cuisine', 'drinks'], isPopular: true, tipCount: 0 },
      { id: 'attractions', name: 'Attractions', icon: '🎯', color: 'purple', description: 'Things to see and do', subcategories: ['museums', 'landmarks', 'nature', 'activities'], isPopular: true, tipCount: 0 },
      { id: 'culture-etiquette', name: 'Culture & Etiquette', icon: '🎭', color: 'pink', description: 'Cultural norms and customs', subcategories: ['dress-code', 'behavior', 'traditions', 'language'], isPopular: false, tipCount: 0 },
      { id: 'safety-security', name: 'Safety & Security', icon: '🛡️', color: 'red', description: 'Safety tips and precautions', subcategories: ['personal-safety', 'scams', 'emergencies', 'health'], isPopular: true, tipCount: 0 },
      { id: 'money-budget', name: 'Money & Budget', icon: '💰', color: 'yellow', description: 'Financial tips', subcategories: ['currency', 'tipping', 'bargaining', 'budgeting'], isPopular: false, tipCount: 0 },
      { id: 'communication', name: 'Communication', icon: '📱', color: 'indigo', description: 'Language and communication', subcategories: ['language', 'wifi', 'sim-cards', 'apps'], isPopular: false, tipCount: 0 }
    ];

    const difficultyLevels = [
      { id: 'beginner', name: 'Beginner', icon: '🟢', color: 'green' },
      { id: 'intermediate', name: 'Intermediate', icon: '🟡', color: 'yellow' },
      { id: 'advanced', name: 'Advanced', icon: '🔴', color: 'red' }
    ];

    const updateTips = useCallback((path: string, value: any) => {
      setTips(prev => {
        const newTips = { ...prev };
        const keys = path.split('.');
        let current: any = newTips;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newTips.updatedAt = new Date();
        onTipsUpdate?.(newTips);
        return newTips;
      });
    }, [onTipsUpdate]);

    const addTip = useCallback(() => {
      const newTip: TravelTip = {
        id: `tip-${Date.now()}`,
        title: '',
        description: '',
        content: '',
        category: 'general',
        subcategory: '',
        type: 'general',
        priority: 'medium',
        difficulty: 'beginner',
        duration: 2,
        tags: [],
        author: 'User',
        source: 'Personal Experience',
        credibility: 80,
        isVerified: false,
        isLocal: false,
        isPersonalized: false,
        applicableSeasons: [],
        applicableActivities: [],
        applicableBudget: 'any',
        images: [],
        links: [],
        relatedTips: [],
        likes: 0,
        dislikes: 0,
        isBookmarked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      updateTips('tips', [...tips.tips, newTip]);
    }, [tips.tips, updateTips]);

    const toggleBookmark = useCallback((tipId: string) => {
      const updatedTips = tips.tips.map(tip => 
        tip.id === tipId 
          ? { ...tip, isBookmarked: !tip.isBookmarked }
          : tip
      );
      updateTips('tips', updatedTips);
      
      // Update favorites list
      const bookmarkedTips = updatedTips.filter(tip => tip.isBookmarked).map(tip => tip.id);
      updateTips('favorites', bookmarkedTips);
    }, [tips.tips, updateTips]);

    const likeTip = useCallback((tipId: string) => {
      const updatedTips = tips.tips.map(tip => 
        tip.id === tipId 
          ? { ...tip, likes: tip.likes + 1 }
          : tip
      );
      updateTips('tips', updatedTips);
    }, [tips.tips, updateTips]);

    const dislikeTip = useCallback((tipId: string) => {
      const updatedTips = tips.tips.map(tip => 
        tip.id === tipId 
          ? { ...tip, dislikes: tip.dislikes + 1 }
          : tip
      );
      updateTips('tips', updatedTips);
    }, [tips.tips, updateTips]);

    const initializeCategories = useCallback(() => {
      if (tips.categories.length === 0) {
        updateTips('categories', defaultCategories);
      }
    }, [tips.categories.length, updateTips]);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const getTipTypeIcon = (type: TravelTip['type']) => {
      const tipType = tipTypes.find(t => t.id === type);
      return tipType?.icon || '💡';
    };

    const getTipTypeName = (type: TravelTip['type']) => {
      const tipType = tipTypes.find(t => t.id === type);
      return tipType?.name || type;
    };

    const getTipTypeColor = (type: TravelTip['type']) => {
      const tipType = tipTypes.find(t => t.id === type);
      return tipType?.color || 'gray';
    };

    const getPriorityColor = (priority: TravelTip['priority']) => {
      switch (priority) {
        case 'high': return 'text-red-600 dark:text-red-400';
        case 'medium': return 'text-yellow-600 dark:text-yellow-400';
        case 'low': return 'text-green-600 dark:text-green-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getDifficultyColor = (difficulty: TravelTip['difficulty']) => {
      const difficultyLevel = difficultyLevels.find(d => d.id === difficulty);
      return difficultyLevel?.color || 'gray';
    };

    const getCategoryIcon = (categoryId: string) => {
      const category = defaultCategories.find(c => c.id === categoryId);
      return category?.icon || '📁';
    };

    const getCategoryName = (categoryId: string) => {
      const category = defaultCategories.find(c => c.id === categoryId);
      return category?.name || categoryId;
    };

    const getFilteredTips = useCallback(() => {
      let filteredTips = tips.tips;

      // Filter by tab
      switch (activeTab) {
        case 'personalized':
          filteredTips = filteredTips.filter(tip => tip.isPersonalized);
          break;
        case 'local':
          filteredTips = filteredTips.filter(tip => tip.isLocal);
          break;
        case 'favorites':
          filteredTips = filteredTips.filter(tip => tip.isBookmarked);
          break;
        case 'categories':
          if (selectedCategory) {
            filteredTips = filteredTips.filter(tip => tip.category === selectedCategory);
          }
          break;
      }

      // Filter by search query
      if (searchQuery) {
        filteredTips = filteredTips.filter(tip => 
          tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      // Filter by settings
      if (tips.settings.showPersonalizedOnly) {
        filteredTips = filteredTips.filter(tip => tip.isPersonalized);
      }
      if (tips.settings.showVerifiedOnly) {
        filteredTips = filteredTips.filter(tip => tip.isVerified);
      }
      if (tips.settings.showLocalOnly) {
        filteredTips = filteredTips.filter(tip => tip.isLocal);
      }

      return filteredTips;
    }, [tips.tips, activeTab, selectedCategory, searchQuery, tips.settings]);

    useEffect(() => {
      initializeCategories();
    }, [initializeCategories]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          travelTipsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Travel Tips
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Expert advice for {tips.destination || 'your destination'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              🔍 Search
            </button>
            <button
              onClick={addTip}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              ➕ Add Tip
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tips..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="">All Categories</option>
                {defaultCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tips Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {tips.tips.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tips</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {tips.tips.filter(tip => tip.isPersonalized).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Personalized</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {tips.tips.filter(tip => tip.isLocal).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Local</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {tips.favorites.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Favorites</div>
          </div>
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
          {activeTab === 'all' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  All Travel Tips
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {getFilteredTips().length} tips found
                </div>
              </div>
              
              <div className="space-y-3">
                {getFilteredTips().map((tip) => (
                  <div key={tip.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTipTypeIcon(tip.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {tip.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tip.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {tip.isPersonalized && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                            Personalized
                          </span>
                        )}
                        {tip.isLocal && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md">
                            Local
                          </span>
                        )}
                        {tip.isVerified && (
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-md">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {getCategoryIcon(tip.category)} {getCategoryName(tip.category)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {getTipTypeName(tip.type)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <span className={cn('font-medium', getPriorityColor(tip.priority))}>
                          {tip.priority}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <span className={cn('font-medium', `text-${getDifficultyColor(tip.difficulty)}-600 dark:text-${getDifficultyColor(tip.difficulty)}-400`)}>
                          {tip.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Reading Time:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {tip.duration} min
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex gap-1 mb-2">
                        {tip.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>By {tip.author}</span>
                          <span>{formatDate(tip.createdAt)}</span>
                          <span>Credibility: {tip.credibility}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => likeTip(tip.id)}
                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200"
                          >
                            👍 {tip.likes}
                          </button>
                          <button
                            onClick={() => dislikeTip(tip.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
                          >
                            👎 {tip.dislikes}
                          </button>
                          <button
                            onClick={() => toggleBookmark(tip.id)}
                            className={cn(
                              'transition-colors duration-200',
                              tip.isBookmarked 
                                ? 'text-yellow-600 dark:text-yellow-400' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'
                            )}
                          >
                            ⭐
                          </button>
                          <button
                            onClick={() => setSelectedTip(tip)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                          >
                            Read More →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && showCategories && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Tip Categories
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {defaultCategories.map((category) => (
                  <div key={category.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {category.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Tips:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {tips.tips.filter(tip => tip.category === category.id).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Popular:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {category.isPopular ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex gap-1">
                        {category.subcategories.slice(0, 3).map((subcategory) => (
                          <span
                            key={subcategory}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                          >
                            {subcategory}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'local' && showLocal && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Local Insights
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">🏘️</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Local insights coming soon
                </h3>
                <p>Get insider tips from locals</p>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && showFavorites && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Favorite Tips
              </h3>
              
              {tips.favorites.length > 0 ? (
                <div className="space-y-3">
                  {tips.tips.filter(tip => tip.isBookmarked).map((tip) => (
                    <div key={tip.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTipTypeIcon(tip.type)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {tip.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {tip.description}
                            </p>
                          </div>
                        </div>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <span>{getCategoryName(tip.category)}</span>
                          <span>{tip.duration} min read</span>
                        </div>
                        <button
                          onClick={() => setSelectedTip(tip)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          Read More →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No favorite tips yet
                  </h3>
                  <p>Bookmark tips you find helpful</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tip Modal */}
        {selectedTip && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {selectedTip.title}
                    </h3>
                    <button
                      onClick={() => setSelectedTip(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedTip.description}
                    </p>
                    
                    <div className="prose dark:prose-invert max-w-none">
                      {selectedTip.content}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <span>By {selectedTip.author}</span>
                        <span>{formatDate(selectedTip.createdAt)}</span>
                        <span>Credibility: {selectedTip.credibility}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => likeTip(selectedTip.id)}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200"
                        >
                          👍 {selectedTip.likes}
                        </button>
                        <button
                          onClick={() => dislikeTip(selectedTip.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
                        >
                          👎 {selectedTip.dislikes}
                        </button>
                        <button
                          onClick={() => toggleBookmark(selectedTip.id)}
                          className={cn(
                            'transition-colors duration-200',
                            selectedTip.isBookmarked 
                              ? 'text-yellow-600 dark:text-yellow-400' 
                              : 'text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'
                          )}
                        >
                          ⭐
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

TravelTips.displayName = 'TravelTips';

// Travel Tips Demo Component
interface TravelTipsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const TravelTipsDemo = React.forwardRef<HTMLDivElement, TravelTipsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [tips, setTips] = useState<Partial<TravelTipsData>>({});

    const handleTipsUpdate = (updatedTips: TravelTipsData) => {
      setTips(updatedTips);
      console.log('Travel tips updated:', updatedTips);
    };

    const mockTips: Partial<TravelTipsData> = {
      id: 'tips-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      destination: 'Paris, France',
      tips: [],
      categories: [],
      favorites: [],
      personalized: [],
      localInsights: [],
      settings: {
        showPersonalizedOnly: false,
        showVerifiedOnly: false,
        showLocalOnly: false,
        preferredCategories: [],
        excludedCategories: [],
        difficultyLevel: 'all',
        budgetPreference: 'any',
        language: 'en',
        notifications: true,
        autoBookmark: false
      },
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
          Travel Tips Demo
        </h3>
        
        <TravelTips
          onTipsUpdate={handleTipsUpdate}
          initialTips={mockTips}
          showCategories={true}
          showFavorites={true}
          showPersonalized={true}
          showLocal={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Destination-specific travel tips with personalized recommendations, local insights, and expert advice.
            </p>
          </div>
        )}
      </div>
    );
  }
);

TravelTipsDemo.displayName = 'TravelTipsDemo';

// Export all components
export {
  travelTipsVariants,
  type TravelTipsProps,
  type TravelTipsData,
  type TravelTip,
  type TipCategory,
  type PersonalizedTip,
  type LocalInsight,
  type TipImage,
  type TipLink,
  type TipsSettings,
  type TravelTipsDemoProps
};
