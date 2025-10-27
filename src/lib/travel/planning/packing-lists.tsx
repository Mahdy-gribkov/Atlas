/**
 * Packing Lists Component
 * 
 * Provides smart packing lists and recommendations for Atlas travel agent.
 * Implements packing organization, recommendations, and travel preparation.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Packing Lists Variants
const packingListsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'packing-lists-mode-standard',
        'enhanced': 'packing-lists-mode-enhanced',
        'advanced': 'packing-lists-mode-advanced',
        'custom': 'packing-lists-mode-custom'
      },
      type: {
        'personal': 'packing-type-personal',
        'family': 'packing-type-family',
        'business': 'packing-type-business',
        'mixed': 'packing-type-mixed'
      },
      style: {
        'minimal': 'packing-style-minimal',
        'moderate': 'packing-style-moderate',
        'detailed': 'packing-style-detailed',
        'custom': 'packing-style-custom'
      },
      format: {
        'text': 'packing-format-text',
        'visual': 'packing-format-visual',
        'interactive': 'packing-format-interactive',
        'mixed': 'packing-format-mixed'
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

// Packing Lists Props
interface PackingListsProps extends VariantProps<typeof packingListsVariants> {
  className?: string;
  onPackingUpdate?: (packing: PackingListsData) => void;
  initialPacking?: Partial<PackingListsData>;
  showRecommendations?: boolean;
  showTemplates?: boolean;
  showChecklist?: boolean;
  showWeather?: boolean;
}

// Packing Lists Data Interface
interface PackingListsData {
  id: string;
  tripId: string;
  tripName: string;
  lists: PackingList[];
  templates: PackingTemplate[];
  recommendations: PackingRecommendation[];
  weatherForecast: WeatherForecast[];
  settings: PackingSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Packing List Interface
interface PackingList {
  id: string;
  name: string;
  description: string;
  type: 'personal' | 'family' | 'business' | 'adventure' | 'luxury';
  destination: string;
  duration: number; // in days
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  climate: 'tropical' | 'temperate' | 'cold' | 'desert' | 'mixed';
  categories: PackingCategory[];
  items: PackingItem[];
  isComplete: boolean;
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

// Packing Category Interface
interface PackingCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  items: string[];
  isEssential: boolean;
  order: number;
}

// Packing Item Interface
interface PackingItem {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  isPacked: boolean;
  isEssential: boolean;
  weight: number; // in grams
  size: 'xs' | 's' | 'm' | 'l' | 'xl';
  weatherDependent: boolean;
  activityDependent: boolean;
  notes: string;
  alternatives: string[];
  purchaseLocation?: string;
  estimatedCost?: number;
  currency?: string;
}

// Packing Template Interface
interface PackingTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  destination: string;
  duration: number;
  season: string;
  climate: string;
  categories: PackingCategory[];
  items: PackingItem[];
  isPopular: boolean;
  usageCount: number;
  rating: number;
  createdAt: Date;
}

// Packing Recommendation Interface
interface PackingRecommendation {
  id: string;
  type: 'item' | 'category' | 'tip';
  title: string;
  description: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  weatherBased: boolean;
  activityBased: boolean;
  isPersonalized: boolean;
  confidence: number; // 0-100
  alternatives: string[];
  createdAt: Date;
}

// Weather Forecast Interface
interface WeatherForecast {
  id: string;
  date: Date;
  location: string;
  temperature: {
    min: number;
    max: number;
    unit: 'celsius' | 'fahrenheit';
  };
  conditions: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  recommendations: string[];
}

// Packing Settings Interface
interface PackingSettings {
  autoRecommendations: boolean;
  weatherIntegration: boolean;
  weightTracking: boolean;
  costTracking: boolean;
  reminderNotifications: boolean;
  defaultCurrency: string;
  weightUnit: 'grams' | 'pounds' | 'kilograms';
  temperatureUnit: 'celsius' | 'fahrenheit';
  reminderDays: number[];
  maxWeight: number;
  budgetLimit: number;
}

// Packing Lists Component
export const PackingLists = React.forwardRef<HTMLDivElement, PackingListsProps>(
  ({ 
    className, 
    onPackingUpdate,
    initialPacking,
    showRecommendations = true,
    showTemplates = true,
    showChecklist = true,
    showWeather = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [packing, setPacking] = useState<PackingListsData>(
      initialPacking || {
        id: '',
        tripId: '',
        tripName: '',
        lists: [],
        templates: [],
        recommendations: [],
        weatherForecast: [],
        settings: {
          autoRecommendations: true,
          weatherIntegration: true,
          weightTracking: true,
          costTracking: true,
          reminderNotifications: true,
          defaultCurrency: 'USD',
          weightUnit: 'grams',
          temperatureUnit: 'celsius',
          reminderDays: [7, 3, 1],
          maxWeight: 23000, // 23kg in grams
          budgetLimit: 1000
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('lists');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedList, setSelectedList] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const tabs = [
      { id: 'lists', name: 'Lists', icon: '📋' },
      { id: 'templates', name: 'Templates', icon: '📄' },
      { id: 'recommendations', name: 'Recommendations', icon: '💡' },
      { id: 'weather', name: 'Weather', icon: '🌤️' },
      { id: 'checklist', name: 'Checklist', icon: '✅' }
    ];

    const listTypes = [
      { id: 'personal', name: 'Personal', icon: '👤', color: 'blue' },
      { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: 'green' },
      { id: 'business', name: 'Business', icon: '💼', color: 'purple' },
      { id: 'adventure', name: 'Adventure', icon: '🏔️', color: 'orange' },
      { id: 'luxury', name: 'Luxury', icon: '✨', color: 'pink' }
    ];

    const defaultCategories = [
      { id: 'clothing', name: 'Clothing', icon: '👕', color: 'blue', isEssential: true, order: 1 },
      { id: 'toiletries', name: 'Toiletries', icon: '🧴', color: 'green', isEssential: true, order: 2 },
      { id: 'electronics', name: 'Electronics', icon: '📱', color: 'purple', isEssential: false, order: 3 },
      { id: 'documents', name: 'Documents', icon: '📄', color: 'red', isEssential: true, order: 4 },
      { id: 'medications', name: 'Medications', icon: '💊', color: 'orange', isEssential: true, order: 5 },
      { id: 'accessories', name: 'Accessories', icon: '👜', color: 'pink', isEssential: false, order: 6 },
      { id: 'shoes', name: 'Shoes', icon: '👟', color: 'gray', isEssential: true, order: 7 },
      { id: 'miscellaneous', name: 'Miscellaneous', icon: '📦', color: 'yellow', isEssential: false, order: 8 }
    ];

    const seasons = [
      { id: 'spring', name: 'Spring', icon: '🌸', color: 'green' },
      { id: 'summer', name: 'Summer', icon: '☀️', color: 'yellow' },
      { id: 'autumn', name: 'Autumn', icon: '🍂', color: 'orange' },
      { id: 'winter', name: 'Winter', icon: '❄️', color: 'blue' }
    ];

    const climates = [
      { id: 'tropical', name: 'Tropical', icon: '🌴', color: 'green' },
      { id: 'temperate', name: 'Temperate', icon: '🌤️', color: 'blue' },
      { id: 'cold', name: 'Cold', icon: '🧊', color: 'cyan' },
      { id: 'desert', name: 'Desert', icon: '🏜️', color: 'yellow' },
      { id: 'mixed', name: 'Mixed', icon: '🌍', color: 'purple' }
    ];

    const updatePacking = useCallback((path: string, value: any) => {
      setPacking(prev => {
        const newPacking = { ...prev };
        const keys = path.split('.');
        let current: any = newPacking;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newPacking.updatedAt = new Date();
        onPackingUpdate?.(newPacking);
        return newPacking;
      });
    }, [onPackingUpdate]);

    const addList = useCallback(() => {
      const newList: PackingList = {
        id: `list-${Date.now()}`,
        name: '',
        description: '',
        type: 'personal',
        destination: '',
        duration: 7,
        season: 'summer',
        climate: 'temperate',
        categories: [...defaultCategories],
        items: [],
        isComplete: false,
        completionPercentage: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      updatePacking('lists', [...packing.lists, newList]);
    }, [packing.lists, updatePacking]);

    const addItem = useCallback((listId: string, categoryId: string) => {
      const newItem: PackingItem = {
        id: `item-${Date.now()}`,
        name: '',
        description: '',
        category: categoryId,
        quantity: 1,
        isPacked: false,
        isEssential: false,
        weight: 0,
        size: 'm',
        weatherDependent: false,
        activityDependent: false,
        notes: '',
        alternatives: []
      };
      
      const updatedLists = packing.lists.map(list => 
        list.id === listId 
          ? { ...list, items: [...list.items, newItem] }
          : list
      );
      updatePacking('lists', updatedLists);
    }, [packing.lists, updatePacking]);

    const toggleItemPacked = useCallback((listId: string, itemId: string) => {
      const updatedLists = packing.lists.map(list => 
        list.id === listId 
          ? {
              ...list,
              items: list.items.map(item => 
                item.id === itemId 
                  ? { ...item, isPacked: !item.isPacked }
                  : item
              )
            }
          : list
      );
      updatePacking('lists', updatedLists);
    }, [packing.lists, updatePacking]);

    const calculateCompletionPercentage = useCallback((list: PackingList) => {
      if (list.items.length === 0) return 0;
      const packedItems = list.items.filter(item => item.isPacked).length;
      return Math.round((packedItems / list.items.length) * 100);
    }, []);

    const calculateTotalWeight = useCallback((list: PackingList) => {
      return list.items.reduce((total, item) => total + (item.weight * item.quantity), 0);
    }, []);

    const calculateTotalCost = useCallback((list: PackingList) => {
      return list.items.reduce((total, item) => total + (item.estimatedCost || 0), 0);
    }, []);

    const formatWeight = (weight: number) => {
      if (packing.settings.weightUnit === 'pounds') {
        return `${(weight / 453.592).toFixed(1)} lbs`;
      } else if (packing.settings.weightUnit === 'kilograms') {
        return `${(weight / 1000).toFixed(1)} kg`;
      }
      return `${weight.toFixed(0)} g`;
    };

    const formatCurrency = (amount: number, currency: string) => {
      return `${currency} ${amount.toFixed(2)}`;
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const getListTypeIcon = (type: PackingList['type']) => {
      const listType = listTypes.find(t => t.id === type);
      return listType?.icon || '📋';
    };

    const getListTypeName = (type: PackingList['type']) => {
      const listType = listTypes.find(t => t.id === type);
      return listType?.name || type;
    };

    const getListTypeColor = (type: PackingList['type']) => {
      const listType = listTypes.find(t => t.id === type);
      return listType?.color || 'gray';
    };

    const getSeasonIcon = (season: PackingList['season']) => {
      const seasonData = seasons.find(s => s.id === season);
      return seasonData?.icon || '🌤️';
    };

    const getClimateIcon = (climate: PackingList['climate']) => {
      const climateData = climates.find(c => c.id === climate);
      return climateData?.icon || '🌍';
    };

    const getCategoryIcon = (categoryId: string) => {
      const category = defaultCategories.find(c => c.id === categoryId);
      return category?.icon || '📦';
    };

    const getCategoryName = (categoryId: string) => {
      const category = defaultCategories.find(c => c.id === categoryId);
      return category?.name || categoryId;
    };

    const getSizeColor = (size: PackingItem['size']) => {
      switch (size) {
        case 'xs': return 'text-gray-600 dark:text-gray-400';
        case 's': return 'text-green-600 dark:text-green-400';
        case 'm': return 'text-blue-600 dark:text-blue-400';
        case 'l': return 'text-orange-600 dark:text-orange-400';
        case 'xl': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    useEffect(() => {
      // Update completion percentage for all lists
      const updatedLists = packing.lists.map(list => ({
        ...list,
        completionPercentage: calculateCompletionPercentage(list)
      }));
      if (updatedLists.some((list, index) => list.completionPercentage !== packing.lists[index].completionPercentage)) {
        updatePacking('lists', updatedLists);
      }
    }, [packing.lists, calculateCompletionPercentage, updatePacking]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          packingListsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Packing Lists
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Smart packing for {packing.tripName || 'your trip'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              📄 Templates
            </button>
            <button
              onClick={addList}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              ➕ New List
            </button>
          </div>
        </div>

        {/* Packing Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {packing.lists.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Lists</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {packing.lists.reduce((total, list) => total + list.items.length, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {packing.lists.reduce((total, list) => total + list.items.filter(item => item.isPacked).length, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Packed</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {packing.lists.length > 0 ? Math.round(packing.lists.reduce((total, list) => total + list.completionPercentage, 0) / packing.lists.length) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
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
          {activeTab === 'lists' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Packing Lists
                </h3>
                <button
                  onClick={addList}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  ➕ Add List
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packing.lists.map((list) => (
                  <div key={list.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getListTypeIcon(list.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {list.name || 'New List'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {list.destination || 'No destination'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-md',
                          `bg-${getListTypeColor(list.type)}-100 text-${getListTypeColor(list.type)}-800 dark:bg-${getListTypeColor(list.type)}-900 dark:text-${getListTypeColor(list.type)}-200`
                        )}>
                          {getListTypeName(list.type)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {list.description || 'No description'}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {list.duration} days
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Season:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {getSeasonIcon(list.season)} {list.season}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Climate:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {getClimateIcon(list.climate)} {list.climate}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Items:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {list.items.length}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatWeight(calculateTotalWeight(list))}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Cost:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(calculateTotalCost(list), packing.settings.defaultCurrency)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{list.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${list.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        Created {formatDate(list.createdAt)}
                      </div>
                      <button 
                        onClick={() => setSelectedList(list.id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && showTemplates && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Packing Templates
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Templates coming soon
                </h3>
                <p>Pre-made packing lists for different trip types</p>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && showRecommendations && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Smart Recommendations
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  AI recommendations coming soon
                </h3>
                <p>Personalized packing suggestions based on your trip</p>
              </div>
            </div>
          )}

          {activeTab === 'weather' && showWeather && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Weather Forecast
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">🌤️</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Weather integration coming soon
                </h3>
                <p>Weather-based packing recommendations</p>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && showChecklist && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Packing Checklist
              </h3>
              
              {selectedList && packing.lists.find(l => l.id === selectedList) ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  {(() => {
                    const list = packing.lists.find(l => l.id === selectedList)!;
                    return (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {list.name}
                          </h4>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {list.completionPercentage}% Complete
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {defaultCategories.map((category) => {
                            const categoryItems = list.items.filter(item => item.category === category.id);
                            if (categoryItems.length === 0) return null;
                            
                            return (
                              <div key={category.id} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{category.icon}</span>
                                  <h5 className="font-medium text-gray-900 dark:text-gray-100">
                                    {category.name}
                                  </h5>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    ({categoryItems.filter(item => item.isPacked).length}/{categoryItems.length})
                                  </span>
                                </div>
                                
                                <div className="space-y-1 ml-6">
                                  {categoryItems.map((item) => (
                                    <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={item.isPacked}
                                        onChange={() => toggleItemPacked(list.id, item.id)}
                                        className="rounded border-gray-300 dark:border-gray-600"
                                      />
                                      <span className={cn(
                                        'text-sm',
                                        item.isPacked ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
                                      )}>
                                        {item.name} {item.quantity > 1 && `(${item.quantity})`}
                                      </span>
                                      {item.isEssential && (
                                        <span className="px-1 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
                                          Essential
                                        </span>
                                      )}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Select a list to view checklist
                  </h3>
                  <p>Choose a packing list to see the detailed checklist</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

PackingLists.displayName = 'PackingLists';

// Packing Lists Demo Component
interface PackingListsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const PackingListsDemo = React.forwardRef<HTMLDivElement, PackingListsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [packing, setPacking] = useState<Partial<PackingListsData>>({});

    const handlePackingUpdate = (updatedPacking: PackingListsData) => {
      setPacking(updatedPacking);
      console.log('Packing lists updated:', updatedPacking);
    };

    const mockPacking: Partial<PackingListsData> = {
      id: 'packing-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      lists: [],
      templates: [],
      recommendations: [],
      weatherForecast: [],
      settings: {
        autoRecommendations: true,
        weatherIntegration: true,
        weightTracking: true,
        costTracking: true,
        reminderNotifications: true,
        defaultCurrency: 'USD',
        weightUnit: 'grams',
        temperatureUnit: 'celsius',
        reminderDays: [7, 3, 1],
        maxWeight: 23000,
        budgetLimit: 1000
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
          Packing Lists Demo
        </h3>
        
        <PackingLists
          onPackingUpdate={handlePackingUpdate}
          initialPacking={mockPacking}
          showRecommendations={true}
          showTemplates={true}
          showChecklist={true}
          showWeather={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Smart packing lists with recommendations, templates, weather integration, and comprehensive checklists.
            </p>
          </div>
        )}
      </div>
    );
  }
);

PackingListsDemo.displayName = 'PackingListsDemo';

// Export all components
export {
  packingListsVariants,
  type PackingListsProps,
  type PackingListsData,
  type PackingList,
  type PackingCategory,
  type PackingItem,
  type PackingTemplate,
  type PackingRecommendation,
  type WeatherForecast,
  type PackingSettings,
  type PackingListsDemoProps
};
