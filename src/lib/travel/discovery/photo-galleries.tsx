/**
 * Photo Galleries Component
 * 
 * Provides comprehensive photo galleries for Atlas travel agent.
 * Implements destination photos, user galleries, and visual discovery.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Photo Galleries Variants
const photoGalleriesVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'photo-galleries-mode-standard',
        'enhanced': 'photo-galleries-mode-enhanced',
        'advanced': 'photo-galleries-mode-advanced',
        'custom': 'photo-galleries-mode-custom'
      },
      type: {
        'destination': 'photo-type-destination',
        'user': 'photo-type-user',
        'professional': 'photo-type-professional',
        'mixed': 'photo-type-mixed'
      },
      style: {
        'minimal': 'photo-style-minimal',
        'moderate': 'photo-style-moderate',
        'detailed': 'photo-style-detailed',
        'custom': 'photo-style-custom'
      },
      format: {
        'text': 'photo-format-text',
        'visual': 'photo-format-visual',
        'interactive': 'photo-format-interactive',
        'mixed': 'photo-format-mixed'
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

// Photo Galleries Props
interface PhotoGalleriesProps extends VariantProps<typeof photoGalleriesVariants> {
  className?: string;
  onPhotoSelect?: (photo: PhotoData) => void;
  initialGalleries?: Partial<PhotoGalleriesData>;
  showFilters?: boolean;
  showUpload?: boolean;
  showSharing?: boolean;
  showCollections?: boolean;
}

// Photo Galleries Data Interface
interface PhotoGalleriesData {
  id: string;
  destination: string;
  galleries: PhotoGallery[];
  collections: PhotoCollection[];
  featured: PhotoData[];
  recent: PhotoData[];
  popular: PhotoData[];
  userPhotos: PhotoData[];
  categories: PhotoCategory[];
  filters: PhotoFilters;
  uploadSettings: UploadSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Photo Gallery Interface
interface PhotoGallery {
  id: string;
  title: string;
  description: string;
  type: 'destination' | 'user' | 'professional' | 'curated';
  photos: PhotoData[];
  coverPhoto: PhotoData;
  author: {
    name: string;
    avatar?: string;
    verified: boolean;
    followerCount: number;
  };
  stats: {
    viewCount: number;
    likeCount: number;
    shareCount: number;
    downloadCount: number;
  };
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Photo Collection Interface
interface PhotoCollection {
  id: string;
  title: string;
  description: string;
  photos: PhotoData[];
  coverPhoto: PhotoData;
  category: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
}

// Photo Data Interface
interface PhotoData {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  fullSize: string;
  metadata: PhotoMetadata;
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    address?: string;
  };
  author: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
    type: 'user' | 'professional' | 'official';
  };
  stats: {
    views: number;
    likes: number;
    downloads: number;
    shares: number;
  };
  tags: string[];
  category: string;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Photo Metadata Interface
interface PhotoMetadata {
  camera: {
    make?: string;
    model?: string;
    lens?: string;
  };
  settings: {
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    focalLength?: string;
  };
  dimensions: {
    width: number;
    height: number;
  };
  fileSize: number;
  format: string;
  takenAt: Date;
  edited: boolean;
}

// Photo Category Interface
interface PhotoCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// Photo Filters Interface
interface PhotoFilters {
  category: string[];
  type: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  location: string[];
  tags: string[];
  author: string[];
  featured: boolean;
  public: boolean;
}

// Upload Settings Interface
interface UploadSettings {
  maxFileSize: number; // in MB
  allowedFormats: string[];
  maxPhotosPerUpload: number;
  autoResize: boolean;
  quality: number;
}

// Photo Galleries Component
export const PhotoGalleries = React.forwardRef<HTMLDivElement, PhotoGalleriesProps>(
  ({ 
    className, 
    onPhotoSelect,
    initialGalleries,
    showFilters = true,
    showUpload = true,
    showSharing = true,
    showCollections = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [galleries, setGalleries] = useState<PhotoGalleriesData>(
      initialGalleries || {
        id: '',
        destination: '',
        galleries: [],
        collections: [],
        featured: [],
        recent: [],
        popular: [],
        userPhotos: [],
        categories: [],
        filters: {
          category: [],
          type: [],
          dateRange: {
            start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            end: new Date()
          },
          location: [],
          tags: [],
          author: [],
          featured: false,
          public: true
        },
        uploadSettings: {
          maxFileSize: 10,
          allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          maxPhotosPerUpload: 20,
          autoResize: true,
          quality: 85
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('featured');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'masonry' | 'list'>('grid');
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);

    const tabs = [
      { id: 'featured', name: 'Featured', icon: '⭐' },
      { id: 'recent', name: 'Recent', icon: '🕒' },
      { id: 'popular', name: 'Popular', icon: '🔥' },
      { id: 'collections', name: 'Collections', icon: '📁' },
      { id: 'user', name: 'User Photos', icon: '👤' }
    ];

    const photoCategories = [
      { id: 'landmarks', name: 'Landmarks', icon: '🏛️', color: 'blue' },
      { id: 'nature', name: 'Nature', icon: '🌿', color: 'green' },
      { id: 'food', name: 'Food', icon: '🍽️', color: 'orange' },
      { id: 'culture', name: 'Culture', icon: '🎭', color: 'purple' },
      { id: 'street', name: 'Street Life', icon: '🚶', color: 'gray' },
      { id: 'architecture', name: 'Architecture', icon: '🏗️', color: 'indigo' },
      { id: 'night', name: 'Night Life', icon: '🌃', color: 'dark' },
      { id: 'people', name: 'People', icon: '👥', color: 'pink' }
    ];

    const photoTypes = [
      { id: 'destination', name: 'Destination', icon: '🗺️' },
      { id: 'user', name: 'User Photos', icon: '📸' },
      { id: 'professional', name: 'Professional', icon: '📷' },
      { id: 'curated', name: 'Curated', icon: '✨' }
    ];

    const updateGalleries = useCallback((path: string, value: any) => {
      setGalleries(prev => {
        const newGalleries = { ...prev };
        const keys = path.split('.');
        let current: any = newGalleries;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newGalleries.updatedAt = new Date();
        return newGalleries;
      });
    }, []);

    const loadGalleries = useCallback(async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockPhotos: PhotoData[] = [
        {
          id: 'photo-1',
          title: 'Eiffel Tower at Sunset',
          description: 'Beautiful view of the Eiffel Tower during golden hour',
          url: '/images/eiffel-sunset.jpg',
          thumbnail: '/images/eiffel-sunset-thumb.jpg',
          fullSize: '/images/eiffel-sunset-full.jpg',
          metadata: {
            camera: {
              make: 'Canon',
              model: 'EOS R5',
              lens: 'RF 24-70mm f/2.8L'
            },
            settings: {
              aperture: 'f/8',
              shutterSpeed: '1/125s',
              iso: 100,
              focalLength: '35mm'
            },
            dimensions: { width: 4000, height: 3000 },
            fileSize: 8.5,
            format: 'jpg',
            takenAt: new Date('2024-06-15T19:30:00'),
            edited: true
          },
          location: {
            name: 'Eiffel Tower',
            coordinates: { lat: 48.8584, lng: 2.2945 },
            address: 'Champ de Mars, 7th arrondissement, Paris'
          },
          author: {
            id: 'user-1',
            name: 'Marie Dubois',
            avatar: '/images/marie-avatar.jpg',
            verified: true,
            type: 'professional'
          },
          stats: {
            views: 15420,
            likes: 892,
            downloads: 234,
            shares: 156
          },
          tags: ['eiffel-tower', 'sunset', 'paris', 'landmark', 'golden-hour'],
          category: 'landmarks',
          isPublic: true,
          isFeatured: true,
          createdAt: new Date('2024-06-15'),
          updatedAt: new Date('2024-06-15')
        },
        {
          id: 'photo-2',
          title: 'Montmartre Street Art',
          description: 'Colorful street art in the charming Montmartre district',
          url: '/images/montmartre-art.jpg',
          thumbnail: '/images/montmartre-art-thumb.jpg',
          fullSize: '/images/montmartre-art-full.jpg',
          metadata: {
            camera: {
              make: 'Sony',
              model: 'A7 III',
              lens: 'FE 85mm f/1.4 GM'
            },
            settings: {
              aperture: 'f/2.8',
              shutterSpeed: '1/200s',
              iso: 400,
              focalLength: '85mm'
            },
            dimensions: { width: 6000, height: 4000 },
            fileSize: 12.3,
            format: 'jpg',
            takenAt: new Date('2024-06-10T14:20:00'),
            edited: false
          },
          location: {
            name: 'Montmartre',
            coordinates: { lat: 48.8846, lng: 2.3397 },
            address: '18th arrondissement, Paris'
          },
          author: {
            id: 'user-2',
            name: 'Pierre Moreau',
            avatar: '/images/pierre-avatar.jpg',
            verified: false,
            type: 'user'
          },
          stats: {
            views: 8234,
            likes: 456,
            downloads: 89,
            shares: 67
          },
          tags: ['street-art', 'montmartre', 'colorful', 'urban', 'art'],
          category: 'culture',
          isPublic: true,
          isFeatured: false,
          createdAt: new Date('2024-06-10'),
          updatedAt: new Date('2024-06-10')
        }
      ];
      
      updateGalleries('featured', mockPhotos.filter(p => p.isFeatured));
      updateGalleries('recent', mockPhotos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      updateGalleries('popular', mockPhotos.sort((a, b) => b.stats.views - a.stats.views));
      updateGalleries('userPhotos', mockPhotos.filter(p => p.author.type === 'user'));
      setIsLoading(false);
    }, [updateGalleries]);

    const getCurrentPhotos = useCallback(() => {
      switch (activeTab) {
        case 'recent':
          return galleries.recent;
        case 'popular':
          return galleries.popular;
        case 'user':
          return galleries.userPhotos;
        case 'featured':
          return galleries.featured;
        case 'collections':
          return galleries.collections.flatMap(c => c.photos);
        default:
          return galleries.featured;
      }
    }, [activeTab, galleries]);

    const getCategoryIcon = (category: string) => {
      const cat = photoCategories.find(c => c.id === category);
      return cat?.icon || '📸';
    };

    const getCategoryName = (category: string) => {
      const cat = photoCategories.find(c => c.id === category);
      return cat?.name || category;
    };

    const getTypeIcon = (type: string) => {
      const photoType = photoTypes.find(t => t.id === type);
      return photoType?.icon || '📸';
    };

    const formatFileSize = (sizeInMB: number) => {
      if (sizeInMB < 1) return `${(sizeInMB * 1024).toFixed(0)} KB`;
      return `${sizeInMB.toFixed(1)} MB`;
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const formatNumber = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    useEffect(() => {
      loadGalleries();
    }, [loadGalleries]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          photoGalleriesVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Photo Galleries
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover {galleries.destination} through amazing photos
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'px-3 py-1 text-sm rounded-l-md transition-colors duration-200',
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                ⊞ Grid
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={cn(
                  'px-3 py-1 text-sm transition-colors duration-200',
                  viewMode === 'masonry'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                ⊟ Masonry
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-3 py-1 text-sm rounded-r-md transition-colors duration-200',
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                ☰ List
              </button>
            </div>
            <button
              onClick={loadGalleries}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? '🔄' : '🔄'} Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                >
                  <option value="">All Categories</option>
                  {photoCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Photo Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {photoTypes.map((photoType) => (
                    <button
                      key={photoType.id}
                      onClick={() => {
                        const currentTypes = galleries.filters.type;
                        const newTypes = currentTypes.includes(photoType.id)
                          ? currentTypes.filter(t => t !== photoType.id)
                          : [...currentTypes, photoType.id];
                        updateGalleries('filters.type', newTypes);
                      }}
                      className={cn(
                        'px-3 py-1 text-xs rounded-md transition-colors duration-200',
                        galleries.filters.type.includes(photoType.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      )}
                    >
                      {photoType.icon} {photoType.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300">
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="likes">Most Liked</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={galleries.filters.featured}
                    onChange={(e) => updateGalleries('filters.featured', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  Featured Only
                </label>
              </div>
            </div>
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
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading amazing photos...</p>
            </div>
          ) : getCurrentPhotos().length > 0 ? (
            <div className={cn(
              'gap-4',
              viewMode === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
              viewMode === 'masonry' && 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 space-y-4',
              viewMode === 'list' && 'space-y-4'
            )}>
              {getCurrentPhotos()
                .filter(photo => !selectedCategory || photo.category === selectedCategory)
                .map((photo) => (
                <div
                  key={photo.id}
                  className={cn(
                    'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer',
                    viewMode === 'masonry' && 'break-inside-avoid',
                    viewMode === 'list' && 'flex'
                  )}
                  onClick={() => {
                    setSelectedPhoto(photo);
                    onPhotoSelect?.(photo);
                  }}
                >
                  {viewMode === 'list' ? (
                    <div className="flex w-full">
                      <div className="w-32 h-24 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                        <img
                          src={photo.thumbnail}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {photo.title}
                          </h3>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatNumber(photo.stats.likes)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {photo.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                          <span>{getCategoryIcon(photo.category)} {getCategoryName(photo.category)}</span>
                          <span>👁️ {formatNumber(photo.stats.views)}</span>
                          <span>📅 {formatDate(photo.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="aspect-square bg-gray-200 dark:bg-gray-700">
                        <img
                          src={photo.thumbnail}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                            {photo.title}
                          </h3>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatNumber(photo.stats.likes)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {photo.description}
                        </p>
                        
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex justify-between">
                            <span>Category:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {getCategoryIcon(photo.category)} {getCategoryName(photo.category)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Author:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {photo.author.name}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Views:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatNumber(photo.stats.views)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(photo.createdAt)}
                            </span>
                          </div>
                        </div>
                        
                        {photo.isFeatured && (
                          <div className="mt-3">
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-md">
                              ⭐ Featured
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex gap-1">
                            {photo.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                            View →
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No photos found
              </h3>
              <p>Try adjusting your filters or check back later for new photos</p>
            </div>
          )}
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex">
                <div className="flex-1">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    className="w-full h-full object-contain max-h-[70vh]"
                  />
                </div>
                <div className="w-80 p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {selectedPhoto.title}
                    </h3>
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {selectedPhoto.description}
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Author:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedPhoto.author.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedPhoto.location.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Views:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatNumber(selectedPhoto.stats.views)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Likes:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatNumber(selectedPhoto.stats.likes)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                        Download
                      </button>
                      <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        Share
                      </button>
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

PhotoGalleries.displayName = 'PhotoGalleries';

// Photo Galleries Demo Component
interface PhotoGalleriesDemoProps {
  className?: string;
  showControls?: boolean;
}

export const PhotoGalleriesDemo = React.forwardRef<HTMLDivElement, PhotoGalleriesDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [galleries, setGalleries] = useState<Partial<PhotoGalleriesData>>({});

    const handlePhotoSelect = (photo: PhotoData) => {
      console.log('Photo selected:', photo);
    };

    const mockGalleries: Partial<PhotoGalleriesData> = {
      id: 'galleries-1',
      destination: 'Paris, France',
      galleries: [],
      collections: [],
      featured: [],
      recent: [],
      popular: [],
      userPhotos: [],
      categories: [],
      filters: {
        category: [],
        type: [],
        dateRange: {
          start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        location: [],
        tags: [],
        author: [],
        featured: false,
        public: true
      },
      uploadSettings: {
        maxFileSize: 10,
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        maxPhotosPerUpload: 20,
        autoResize: true,
        quality: 85
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
          Photo Galleries Demo
        </h3>
        
        <PhotoGalleries
          onPhotoSelect={handlePhotoSelect}
          initialGalleries={mockGalleries}
          showFilters={true}
          showUpload={true}
          showSharing={true}
          showCollections={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive photo galleries with destination photos, user galleries, collections, and visual discovery.
            </p>
          </div>
        )}
      </div>
    );
  }
);

PhotoGalleriesDemo.displayName = 'PhotoGalleriesDemo';

// Export all components
export {
  photoGalleriesVariants,
  type PhotoGalleriesProps,
  type PhotoGalleriesData,
  type PhotoGallery,
  type PhotoCollection,
  type PhotoData,
  type PhotoMetadata,
  type PhotoCategory,
  type PhotoFilters,
  type UploadSettings,
  type PhotoGalleriesDemoProps
};
