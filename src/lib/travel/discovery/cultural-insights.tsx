/**
 * Cultural Insights Component
 * 
 * Provides comprehensive cultural information and local customs for Atlas travel agent.
 * Implements cultural guides, etiquette, traditions, and local knowledge.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Cultural Insights Variants
const culturalInsightsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'cultural-insights-mode-standard',
        'enhanced': 'cultural-insights-mode-enhanced',
        'advanced': 'cultural-insights-mode-advanced',
        'custom': 'cultural-insights-mode-custom'
      },
      type: {
        'etiquette': 'cultural-type-etiquette',
        'traditions': 'cultural-type-traditions',
        'history': 'cultural-type-history',
        'language': 'cultural-type-language',
        'mixed': 'cultural-type-mixed'
      },
      style: {
        'minimal': 'cultural-style-minimal',
        'moderate': 'cultural-style-moderate',
        'detailed': 'cultural-style-detailed',
        'custom': 'cultural-style-custom'
      },
      format: {
        'text': 'cultural-format-text',
        'visual': 'cultural-format-visual',
        'interactive': 'cultural-format-interactive',
        'mixed': 'cultural-format-mixed'
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

// Cultural Insights Props
interface CulturalInsightsProps extends VariantProps<typeof culturalInsightsVariants> {
  className?: string;
  onInsightSelect?: (insight: CulturalInsightData) => void;
  initialInsights?: Partial<CulturalInsightsData>;
  showEtiquette?: boolean;
  showTraditions?: boolean;
  showHistory?: boolean;
  showLanguage?: boolean;
}

// Cultural Insights Data Interface
interface CulturalInsightsData {
  id: string;
  destination: string;
  country: string;
  region: string;
  insights: CulturalInsightData[];
  etiquette: CulturalInsightData[];
  traditions: CulturalInsightData[];
  history: CulturalInsightData[];
  language: CulturalInsightData[];
  categories: CulturalCategory[];
  quickTips: QuickTip[];
  createdAt: Date;
  updatedAt: Date;
}

// Cultural Insight Data Interface
interface CulturalInsightData {
  id: string;
  title: string;
  content: string;
  category: string;
  type: 'etiquette' | 'tradition' | 'history' | 'language' | 'custom' | 'festival';
  importance: 'essential' | 'important' | 'helpful' | 'interesting';
  context: {
    situation: string;
    when: string;
    where: string;
  };
  examples: string[];
  doDont: {
    do: string[];
    dont: string[];
  };
  relatedInsights: string[];
  tags: string[];
  difficulty: 'easy' | 'moderate' | 'complex';
  language: string[];
  images: CulturalImage[];
  videos: CulturalVideo[];
  audio: CulturalAudio[];
  sources: CulturalSource[];
  lastUpdated: Date;
  createdAt: Date;
}

// Cultural Image Interface
interface CulturalImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  alt: string;
  isMain: boolean;
}

// Cultural Video Interface
interface CulturalVideo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  duration: number;
  language: string;
}

// Cultural Audio Interface
interface CulturalAudio {
  id: string;
  url: string;
  title: string;
  duration: number;
  language: string;
}

// Cultural Source Interface
interface CulturalSource {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'book' | 'video' | 'audio' | 'website';
  author: string;
  date: Date;
}

// Cultural Category Interface
interface CulturalCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// Quick Tip Interface
interface QuickTip {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

// Cultural Insights Component
export const CulturalInsights = React.forwardRef<HTMLDivElement, CulturalInsightsProps>(
  ({ 
    className, 
    onInsightSelect,
    initialInsights,
    showEtiquette = true,
    showTraditions = true,
    showHistory = true,
    showLanguage = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [insights, setInsights] = useState<CulturalInsightsData>(
      initialInsights || {
        id: '',
        destination: '',
        country: '',
        region: '',
        insights: [],
        etiquette: [],
        traditions: [],
        history: [],
        language: [],
        categories: [],
        quickTips: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('etiquette');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const tabs = [
      { id: 'etiquette', name: 'Etiquette', icon: '🤝' },
      { id: 'traditions', name: 'Traditions', icon: '🎭' },
      { id: 'history', name: 'History', icon: '📚' },
      { id: 'language', name: 'Language', icon: '🗣️' },
      { id: 'all', name: 'All Insights', icon: '🌟' }
    ];

    const culturalCategories = [
      { id: 'etiquette', name: 'Etiquette', icon: '🤝', description: 'Social customs and manners', color: 'blue' },
      { id: 'traditions', name: 'Traditions', icon: '🎭', description: 'Cultural traditions and customs', color: 'green' },
      { id: 'history', name: 'History', icon: '📚', description: 'Historical context and background', color: 'purple' },
      { id: 'language', name: 'Language', icon: '🗣️', description: 'Language tips and phrases', color: 'orange' },
      { id: 'festivals', name: 'Festivals', icon: '🎉', description: 'Cultural festivals and events', color: 'red' },
      { id: 'customs', name: 'Customs', icon: '🏛️', description: 'Local customs and practices', color: 'indigo' }
    ];

    const importanceLevels = [
      { id: 'essential', name: 'Essential', icon: '🔴', color: 'red' },
      { id: 'important', name: 'Important', icon: '🟡', color: 'yellow' },
      { id: 'helpful', name: 'Helpful', icon: '🟢', color: 'green' },
      { id: 'interesting', name: 'Interesting', icon: '🔵', color: 'blue' }
    ];

    const updateInsights = useCallback((path: string, value: any) => {
      setInsights(prev => {
        const newInsights = { ...prev };
        const keys = path.split('.');
        let current: any = newInsights;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newInsights.updatedAt = new Date();
        return newInsights;
      });
    }, []);

    const loadInsights = useCallback(async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const mockInsights: CulturalInsightData[] = [
        {
          id: 'insight-1',
          title: 'French Greeting Etiquette',
          content: 'In France, greetings are an important part of social interaction. The French typically greet with a light kiss on both cheeks (la bise), but this varies by region and relationship.',
          category: 'etiquette',
          type: 'etiquette',
          importance: 'essential',
          context: {
            situation: 'Meeting someone for the first time',
            when: 'Throughout the day',
            where: 'In social settings'
          },
          examples: [
            'Say "Bonjour" (good day) or "Bonsoir" (good evening)',
            'Offer a light handshake for business meetings',
            'Use "la bise" with friends and family'
          ],
          doDont: {
            do: [
              'Make eye contact when greeting',
              'Use appropriate titles (Monsieur/Madame)',
              'Wait for the other person to initiate la bise'
            ],
            dont: [
              'Skip greetings - it\'s considered rude',
              'Use la bise in professional settings',
              'Be too familiar with strangers'
            ]
          },
          relatedInsights: ['French dining etiquette', 'French conversation style'],
          tags: ['greeting', 'social', 'manners'],
          difficulty: 'easy',
          language: ['French', 'English'],
          images: [],
          videos: [],
          audio: [],
          sources: [],
          lastUpdated: new Date(),
          createdAt: new Date()
        },
        {
          id: 'insight-2',
          title: 'French Dining Customs',
          content: 'French dining is a social ritual that follows specific customs. Understanding these traditions will help you blend in and show respect for the culture.',
          category: 'etiquette',
          type: 'etiquette',
          importance: 'important',
          context: {
            situation: 'Dining at a restaurant or home',
            when: 'During meal times',
            where: 'Restaurants, homes, cafes'
          },
          examples: [
            'Keep hands on the table (not in lap)',
            'Wait for everyone to be served before eating',
            'Use proper utensils for each course'
          ],
          doDont: {
            do: [
              'Say "Bon appétit" before eating',
              'Keep your hands visible on the table',
              'Take your time and enjoy the meal'
            ],
            dont: [
              'Start eating before others',
              'Put your hands in your lap',
              'Ask for substitutions or modifications'
            ]
          },
          relatedInsights: ['French wine culture', 'French meal structure'],
          tags: ['dining', 'restaurant', 'manners'],
          difficulty: 'moderate',
          language: ['French', 'English'],
          images: [],
          videos: [],
          audio: [],
          sources: [],
          lastUpdated: new Date(),
          createdAt: new Date()
        },
        {
          id: 'insight-3',
          title: 'Bastille Day Celebrations',
          content: 'Bastille Day (July 14th) is France\'s national holiday, commemorating the storming of the Bastille prison in 1789. It\'s celebrated with parades, fireworks, and parties throughout the country.',
          category: 'traditions',
          type: 'festival',
          importance: 'interesting',
          context: {
            situation: 'National holiday celebration',
            when: 'July 14th annually',
            where: 'Throughout France, especially Paris'
          },
          examples: [
            'Military parade on Champs-Élysées',
            'Fireworks at the Eiffel Tower',
            'Firemen\'s balls (bals des pompiers)'
          ],
          doDont: {
            do: [
              'Join in the celebrations',
              'Watch the fireworks display',
              'Visit local fire stations for parties'
            ],
            dont: [
              'Expect everything to be open',
              'Plan important business meetings',
              'Forget to book accommodations early'
            ]
          },
          relatedInsights: ['French history', 'French national symbols'],
          tags: ['festival', 'national-holiday', 'celebration'],
          difficulty: 'easy',
          language: ['French', 'English'],
          images: [],
          videos: [],
          audio: [],
          sources: [],
          lastUpdated: new Date(),
          createdAt: new Date()
        }
      ];
      
      updateInsights('insights', mockInsights);
      updateInsights('etiquette', mockInsights.filter(i => i.type === 'etiquette'));
      updateInsights('traditions', mockInsights.filter(i => i.type === 'tradition' || i.type === 'festival'));
      updateInsights('history', mockInsights.filter(i => i.type === 'history'));
      updateInsights('language', mockInsights.filter(i => i.type === 'language'));
      setIsLoading(false);
    }, [updateInsights]);

    const getCurrentInsights = useCallback(() => {
      switch (activeTab) {
        case 'etiquette':
          return insights.etiquette;
        case 'traditions':
          return insights.traditions;
        case 'history':
          return insights.history;
        case 'language':
          return insights.language;
        case 'all':
          return insights.insights;
        default:
          return insights.insights;
      }
    }, [activeTab, insights]);

    const getCategoryIcon = (category: string) => {
      const cat = culturalCategories.find(c => c.id === category);
      return cat?.icon || '🌟';
    };

    const getImportanceColor = (importance: CulturalInsightData['importance']) => {
      switch (importance) {
        case 'essential': return 'text-red-600 dark:text-red-400';
        case 'important': return 'text-yellow-600 dark:text-yellow-400';
        case 'helpful': return 'text-green-600 dark:text-green-400';
        case 'interesting': return 'text-blue-600 dark:text-blue-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getImportanceIcon = (importance: CulturalInsightData['importance']) => {
      switch (importance) {
        case 'essential': return '🔴';
        case 'important': return '🟡';
        case 'helpful': return '🟢';
        case 'interesting': return '🔵';
        default: return '⚪';
      }
    };

    const getDifficultyColor = (difficulty: CulturalInsightData['difficulty']) => {
      switch (difficulty) {
        case 'easy': return 'text-green-600 dark:text-green-400';
        case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
        case 'complex': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    useEffect(() => {
      loadInsights();
    }, [loadInsights]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          culturalInsightsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Cultural Insights
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Learn about the culture and customs of {insights.destination || 'your destination'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadInsights}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? '🔄' : '🔄'} Refresh
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        {insights.quickTips.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
              Quick Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {insights.quickTips.map((tip) => (
                <div key={tip.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{tip.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {tip.title}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tip.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

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
          {culturalCategories.map((category) => (
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
              <p className="text-gray-600 dark:text-gray-400">Loading cultural insights...</p>
            </div>
          ) : getCurrentInsights().length > 0 ? (
            <div className="space-y-6">
              {getCurrentInsights()
                .filter(insight => !selectedCategory || insight.category === selectedCategory)
                .map((insight) => (
                <div
                  key={insight.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => onInsightSelect?.(insight)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(insight.category)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {insight.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className={cn('flex items-center gap-1', getImportanceColor(insight.importance))}>
                            {getImportanceIcon(insight.importance)} {insight.importance}
                          </span>
                          <span>•</span>
                          <span className={getDifficultyColor(insight.difficulty)}>
                            {insight.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {insight.content}
                  </p>
                  
                  {/* Context */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Context
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Situation:</span>
                        <p className="text-gray-600 dark:text-gray-400">{insight.context.situation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">When:</span>
                        <p className="text-gray-600 dark:text-gray-400">{insight.context.when}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Where:</span>
                        <p className="text-gray-600 dark:text-gray-400">{insight.context.where}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Examples */}
                  {insight.examples.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Examples
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {insight.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Do's and Don'ts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                        ✅ Do's
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-green-700 dark:text-green-300">
                        {insight.doDont.do.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                        ❌ Don'ts
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                        {insight.doDont.dont.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {insight.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No cultural insights found
              </h3>
              <p>Try adjusting your filters or check back later for new insights</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

CulturalInsights.displayName = 'CulturalInsights';

// Cultural Insights Demo Component
interface CulturalInsightsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const CulturalInsightsDemo = React.forwardRef<HTMLDivElement, CulturalInsightsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [insights, setInsights] = useState<Partial<CulturalInsightsData>>({});

    const handleInsightSelect = (insight: CulturalInsightData) => {
      console.log('Insight selected:', insight);
    };

    const mockInsights: Partial<CulturalInsightsData> = {
      id: 'insights-1',
      destination: 'Paris, France',
      country: 'France',
      region: 'Île-de-France',
      insights: [],
      etiquette: [],
      traditions: [],
      history: [],
      language: [],
      categories: [],
      quickTips: [
        {
          id: 'tip-1',
          title: 'Always greet shopkeepers',
          content: 'Say "Bonjour" when entering shops and "Au revoir" when leaving.',
          category: 'etiquette',
          icon: '👋',
          priority: 'high'
        },
        {
          id: 'tip-2',
          title: 'Keep hands on the table',
          content: 'During meals, keep your hands visible on the table, not in your lap.',
          category: 'etiquette',
          icon: '🍽️',
          priority: 'medium'
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
          Cultural Insights Demo
        </h3>
        
        <CulturalInsights
          onInsightSelect={handleInsightSelect}
          initialInsights={mockInsights}
          showEtiquette={true}
          showTraditions={true}
          showHistory={true}
          showLanguage={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive cultural insights with etiquette, traditions, history, and language tips for respectful travel.
            </p>
          </div>
        )}
      </div>
    );
  }
);

CulturalInsightsDemo.displayName = 'CulturalInsightsDemo';

// Export all components
export {
  culturalInsightsVariants,
  type CulturalInsightsProps,
  type CulturalInsightsData,
  type CulturalInsightData,
  type CulturalImage,
  type CulturalVideo,
  type CulturalAudio,
  type CulturalSource,
  type CulturalCategory,
  type QuickTip,
  type CulturalInsightsDemoProps
};
