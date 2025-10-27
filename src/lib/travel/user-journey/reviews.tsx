/**
 * Reviews Component
 * 
 * Provides comprehensive review and rating functionality for Atlas travel agent.
 * Implements review management, rating system, and feedback features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Reviews Variants
const reviewsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'reviews-mode-standard',
        'enhanced': 'reviews-mode-enhanced',
        'advanced': 'reviews-mode-advanced',
        'custom': 'reviews-mode-custom'
      },
      type: {
        'hotel': 'reviews-type-hotel',
        'restaurant': 'reviews-type-restaurant',
        'activity': 'reviews-type-activity',
        'attraction': 'reviews-type-attraction',
        'mixed': 'reviews-type-mixed'
      },
      style: {
        'minimal': 'reviews-style-minimal',
        'moderate': 'reviews-style-moderate',
        'detailed': 'reviews-style-detailed',
        'custom': 'reviews-style-custom'
      },
      format: {
        'text': 'reviews-format-text',
        'visual': 'reviews-format-visual',
        'interactive': 'reviews-format-interactive',
        'mixed': 'reviews-format-mixed'
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

// Reviews Props
interface ReviewsProps extends VariantProps<typeof reviewsVariants> {
  className?: string;
  onReviewsUpdate?: (reviews: ReviewsData) => void;
  initialReviews?: Partial<ReviewsData>;
  showFilters?: boolean;
  showSorting?: boolean;
  showPhotos?: boolean;
  showHelpful?: boolean;
}

// Reviews Data Interface
interface ReviewsData {
  id: string;
  itemId: string;
  itemName: string;
  itemType: 'hotel' | 'restaurant' | 'activity' | 'attraction' | 'flight' | 'car';
  overallRating: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown;
  reviews: Review[];
  filters: ReviewFilters;
  sorting: ReviewSorting;
  createdAt: Date;
  updatedAt: Date;
}

// Rating Breakdown Interface
interface RatingBreakdown {
  excellent: number; // 5 stars
  veryGood: number; // 4 stars
  average: number; // 3 stars
  poor: number; // 2 stars
  terrible: number; // 1 star
}

// Review Interface
interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userLevel: 'new' | 'bronze' | 'silver' | 'gold' | 'platinum';
  rating: number;
  title: string;
  content: string;
  photos: ReviewPhoto[];
  categories: ReviewCategory[];
  helpful: {
    count: number;
    users: string[];
  };
  verified: boolean;
  stayDate?: Date;
  visitDate?: Date;
  tripType: 'business' | 'leisure' | 'family' | 'couple' | 'solo' | 'group';
  createdAt: Date;
  updatedAt: Date;
}

// Review Photo Interface
interface ReviewPhoto {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
  uploadedAt: Date;
}

// Review Category Interface
interface ReviewCategory {
  id: string;
  name: string;
  rating: number;
  type: 'service' | 'location' | 'cleanliness' | 'value' | 'amenities' | 'food' | 'atmosphere';
}

// Review Filters Interface
interface ReviewFilters {
  rating: number[];
  tripType: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  verified: boolean;
  withPhotos: boolean;
  language: string;
}

// Review Sorting Interface
interface ReviewSorting {
  by: 'newest' | 'oldest' | 'highest' | 'lowest' | 'most-helpful' | 'most-photos';
  order: 'asc' | 'desc';
}

// Reviews Component
export const Reviews = React.forwardRef<HTMLDivElement, ReviewsProps>(
  ({ 
    className, 
    onReviewsUpdate,
    initialReviews,
    showFilters = true,
    showSorting = true,
    showPhotos = true,
    showHelpful = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [reviews, setReviews] = useState<ReviewsData>(
      initialReviews || {
        id: '',
        itemId: '',
        itemName: '',
        itemType: 'hotel',
        overallRating: 0,
        totalReviews: 0,
        ratingBreakdown: {
          excellent: 0,
          veryGood: 0,
          average: 0,
          poor: 0,
          terrible: 0
        },
        reviews: [],
        filters: {
          rating: [],
          tripType: [],
          dateRange: {},
          verified: false,
          withPhotos: false,
          language: 'en'
        },
        sorting: {
          by: 'newest',
          order: 'desc'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('all');
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [newReview, setNewReview] = useState<Partial<Review>>({});

    const tabs = [
      { id: 'all', name: 'All Reviews', count: reviews.totalReviews },
      { id: 'photos', name: 'With Photos', count: reviews.reviews.filter(r => r.photos.length > 0).length },
      { id: 'verified', name: 'Verified', count: reviews.reviews.filter(r => r.verified).length }
    ];

    const tripTypes = [
      { id: 'business', name: 'Business', icon: '💼' },
      { id: 'leisure', name: 'Leisure', icon: '🏖️' },
      { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
      { id: 'couple', name: 'Couple', icon: '💑' },
      { id: 'solo', name: 'Solo', icon: '🚶' },
      { id: 'group', name: 'Group', icon: '👥' }
    ];

    const updateReviews = useCallback((path: string, value: any) => {
      setReviews(prev => {
        const newReviews = { ...prev };
        const keys = path.split('.');
        let current: any = newReviews;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newReviews.updatedAt = new Date();
        onReviewsUpdate?.(newReviews);
        return newReviews;
      });
    }, [onReviewsUpdate]);

    const addReview = useCallback((review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newReview: Review = {
        ...review,
        id: `review-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const updatedReviews = [...reviews.reviews, newReview];
      updateReviews('reviews', updatedReviews);
      updateReviews('totalReviews', updatedReviews.length);
      
      // Recalculate overall rating
      const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / updatedReviews.length;
      updateReviews('overallRating', averageRating);
      
      setIsWritingReview(false);
      setNewReview({});
    }, [reviews.reviews, updateReviews]);

    const markHelpful = useCallback((reviewId: string, userId: string) => {
      const updatedReviews = reviews.reviews.map(review => {
        if (review.id === reviewId) {
          const isAlreadyHelpful = review.helpful.users.includes(userId);
          return {
            ...review,
            helpful: {
              count: isAlreadyHelpful 
                ? review.helpful.count - 1 
                : review.helpful.count + 1,
              users: isAlreadyHelpful
                ? review.helpful.users.filter(id => id !== userId)
                : [...review.helpful.users, userId]
            }
          };
        }
        return review;
      });
      updateReviews('reviews', updatedReviews);
    }, [reviews.reviews, updateReviews]);

    const filteredReviews = useCallback(() => {
      let filtered = reviews.reviews;

      // Filter by tab
      switch (activeTab) {
        case 'photos':
          filtered = filtered.filter(review => review.photos.length > 0);
          break;
        case 'verified':
          filtered = filtered.filter(review => review.verified);
          break;
      }

      // Filter by rating
      if (reviews.filters.rating.length > 0) {
        filtered = filtered.filter(review => 
          reviews.filters.rating.includes(review.rating)
        );
      }

      // Filter by trip type
      if (reviews.filters.tripType.length > 0) {
        filtered = filtered.filter(review => 
          reviews.filters.tripType.includes(review.tripType)
        );
      }

      // Filter by verified
      if (reviews.filters.verified) {
        filtered = filtered.filter(review => review.verified);
      }

      // Filter by photos
      if (reviews.filters.withPhotos) {
        filtered = filtered.filter(review => review.photos.length > 0);
      }

      // Sort reviews
      filtered.sort((a, b) => {
        switch (reviews.sorting.by) {
          case 'newest':
            return reviews.sorting.order === 'desc' 
              ? b.createdAt.getTime() - a.createdAt.getTime()
              : a.createdAt.getTime() - b.createdAt.getTime();
          case 'oldest':
            return reviews.sorting.order === 'desc'
              ? a.createdAt.getTime() - b.createdAt.getTime()
              : b.createdAt.getTime() - a.createdAt.getTime();
          case 'highest':
            return reviews.sorting.order === 'desc'
              ? b.rating - a.rating
              : a.rating - b.rating;
          case 'lowest':
            return reviews.sorting.order === 'desc'
              ? a.rating - b.rating
              : b.rating - a.rating;
          case 'most-helpful':
            return reviews.sorting.order === 'desc'
              ? b.helpful.count - a.helpful.count
              : a.helpful.count - b.helpful.count;
          case 'most-photos':
            return reviews.sorting.order === 'desc'
              ? b.photos.length - a.photos.length
              : a.photos.length - b.photos.length;
          default:
            return 0;
        }
      });

      return filtered;
    }, [reviews.reviews, reviews.filters, reviews.sorting, activeTab]);

    const getRatingColor = (rating: number) => {
      if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
      if (rating >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
      if (rating >= 2.5) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };

    const getRatingStars = (rating: number) => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;

      for (let i = 0; i < fullStars; i++) {
        stars.push('★');
      }
      if (hasHalfStar) {
        stars.push('☆');
      }
      while (stars.length < 5) {
        stars.push('☆');
      }
      return stars.join('');
    };

    const getUserLevelColor = (level: Review['userLevel']) => {
      switch (level) {
        case 'new': return 'text-gray-600 dark:text-gray-400';
        case 'bronze': return 'text-orange-600 dark:text-orange-400';
        case 'silver': return 'text-gray-500 dark:text-gray-400';
        case 'gold': return 'text-yellow-600 dark:text-yellow-400';
        case 'platinum': return 'text-purple-600 dark:text-purple-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getUserLevelIcon = (level: Review['userLevel']) => {
      switch (level) {
        case 'new': return '🆕';
        case 'bronze': return '🥉';
        case 'silver': return '🥈';
        case 'gold': return '🥇';
        case 'platinum': return '💎';
        default: return '👤';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          reviewsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Reviews & Ratings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {reviews.itemName}
            </p>
          </div>
          <button
            onClick={() => setIsWritingReview(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Write Review
          </button>
        </div>

        {/* Overall Rating */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={cn('text-4xl font-bold', getRatingColor(reviews.overallRating))}>
                  {reviews.overallRating.toFixed(1)}
                </div>
                <div className={cn('text-lg', getRatingColor(reviews.overallRating))}>
                  {getRatingStars(reviews.overallRating)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {reviews.totalReviews} reviews
                </div>
              </div>
            </div>
            
            <div className="flex-1 ml-8">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.ratingBreakdown[
                    rating === 5 ? 'excellent' :
                    rating === 4 ? 'veryGood' :
                    rating === 3 ? 'average' :
                    rating === 2 ? 'poor' : 'terrible'
                  ];
                  const percentage = reviews.totalReviews > 0 ? (count / reviews.totalReviews) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                        {rating}
                      </span>
                      <span className="text-sm">★</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        {(showFilters || showSorting) && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex flex-wrap items-center gap-4">
              {showSorting && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort by:
                  </label>
                  <select
                    value={reviews.sorting.by}
                    onChange={(e) => updateReviews('sorting.by', e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                    <option value="most-helpful">Most Helpful</option>
                    <option value="most-photos">Most Photos</option>
                  </select>
                </div>
              )}
              
              {showFilters && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rating:
                  </label>
                  <div className="flex gap-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => {
                          const currentRatings = reviews.filters.rating;
                          const newRatings = currentRatings.includes(rating)
                            ? currentRatings.filter(r => r !== rating)
                            : [...currentRatings, rating];
                          updateReviews('filters.rating', newRatings);
                        }}
                        className={cn(
                          'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                          reviews.filters.rating.includes(rating)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                        )}
                      >
                        {rating}+
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
              <span>{tab.name}</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews().map((review) => (
            <div key={review.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {review.userAvatar ? (
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {review.userName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{getUserLevelIcon(review.userLevel)}</span>
                      <span className={getUserLevelColor(review.userLevel)}>
                        {review.userLevel.charAt(0).toUpperCase() + review.userLevel.slice(1)}
                      </span>
                      {review.verified && (
                        <span className="text-green-600 dark:text-green-400">✓ Verified</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={cn('text-lg font-semibold', getRatingColor(review.rating))}>
                    {getRatingStars(review.rating)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {review.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {review.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {review.content}
                </p>
              </div>

              {/* Review Categories */}
              {review.categories.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {review.categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {category.rating}
                          </span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Photos */}
              {showPhotos && review.photos.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {review.photos.map((photo) => (
                      <div key={photo.id} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                        <img
                          src={photo.thumbnail}
                          alt={photo.caption || 'Review photo'}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>📍 {tripTypes.find(t => t.id === review.tripType)?.name}</span>
                  {review.stayDate && (
                    <span>📅 Stayed {review.stayDate.toLocaleDateString()}</span>
                  )}
                  {review.visitDate && (
                    <span>📅 Visited {review.visitDate.toLocaleDateString()}</span>
                  )}
                </div>
                
                {showHelpful && (
                  <button
                    onClick={() => markHelpful(review.id, 'current-user')}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span>👍</span>
                    <span>Helpful ({review.helpful.count})</span>
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {filteredReviews().length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No reviews found
              </h3>
              <p>Try adjusting your filters or be the first to write a review</p>
            </div>
          )}
        </div>

        {/* Write Review Modal */}
        {isWritingReview && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Write a Review
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                        className={cn(
                          'text-2xl transition-colors duration-200',
                          (newReview.rating || 0) >= rating
                            ? 'text-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        )}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newReview.title || ''}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Summarize your experience"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Review
                  </label>
                  <textarea
                    value={newReview.content || ''}
                    onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Share your experience..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Trip Type
                  </label>
                  <select
                    value={newReview.tripType || ''}
                    onChange={(e) => setNewReview(prev => ({ ...prev, tripType: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tripTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsWritingReview(false);
                    setNewReview({});
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newReview.rating && newReview.title && newReview.content) {
                      addReview({
                        userId: 'current-user',
                        userName: 'You',
                        userLevel: 'new',
                        rating: newReview.rating,
                        title: newReview.title,
                        content: newReview.content,
                        photos: [],
                        categories: [],
                        helpful: { count: 0, users: [] },
                        verified: false,
                        tripType: newReview.tripType || 'leisure',
                        createdAt: new Date(),
                        updatedAt: new Date()
                      });
                    }
                  }}
                  disabled={!newReview.rating || !newReview.title || !newReview.content}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Reviews.displayName = 'Reviews';

// Reviews Demo Component
interface ReviewsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ReviewsDemo = React.forwardRef<HTMLDivElement, ReviewsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [reviews, setReviews] = useState<Partial<ReviewsData>>({});

    const handleReviewsUpdate = (updatedReviews: ReviewsData) => {
      setReviews(updatedReviews);
      console.log('Reviews updated:', updatedReviews);
    };

    const mockReviews: Partial<ReviewsData> = {
      id: 'reviews-1',
      itemId: 'hotel-1',
      itemName: 'Grand Hotel Paris',
      itemType: 'hotel',
      overallRating: 4.2,
      totalReviews: 127,
      ratingBreakdown: {
        excellent: 45,
        veryGood: 52,
        average: 20,
        poor: 8,
        terrible: 2
      },
      reviews: [
        {
          id: 'review-1',
          userId: 'user-1',
          userName: 'Sarah Johnson',
          userLevel: 'gold',
          rating: 5,
          title: 'Amazing stay in the heart of Paris!',
          content: 'The hotel exceeded all our expectations. The location is perfect, right in the center of Paris with easy access to all major attractions. The staff was incredibly friendly and helpful.',
          photos: [],
          categories: [
            { id: 'service', name: 'Service', rating: 5, type: 'service' },
            { id: 'location', name: 'Location', rating: 5, type: 'location' },
            { id: 'cleanliness', name: 'Cleanliness', rating: 4, type: 'cleanliness' }
          ],
          helpful: { count: 12, users: [] },
          verified: true,
          stayDate: new Date('2024-05-15'),
          tripType: 'couple',
          createdAt: new Date('2024-05-20'),
          updatedAt: new Date('2024-05-20')
        },
        {
          id: 'review-2',
          userId: 'user-2',
          userName: 'Mike Chen',
          userLevel: 'silver',
          rating: 4,
          title: 'Great location, good value',
          content: 'Good hotel with excellent location. Rooms are clean and comfortable. Breakfast was decent. Would recommend for business travelers.',
          photos: [],
          categories: [
            { id: 'location', name: 'Location', rating: 5, type: 'location' },
            { id: 'value', name: 'Value', rating: 4, type: 'value' }
          ],
          helpful: { count: 8, users: [] },
          verified: true,
          stayDate: new Date('2024-05-10'),
          tripType: 'business',
          createdAt: new Date('2024-05-12'),
          updatedAt: new Date('2024-05-12')
        }
      ],
      filters: {
        rating: [],
        tripType: [],
        dateRange: {},
        verified: false,
        withPhotos: false,
        language: 'en'
      },
      sorting: {
        by: 'newest',
        order: 'desc'
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
          Reviews Demo
        </h3>
        
        <Reviews
          onReviewsUpdate={handleReviewsUpdate}
          initialReviews={mockReviews}
          showFilters={true}
          showSorting={true}
          showPhotos={true}
          showHelpful={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive review system with ratings, filters, sorting, photo uploads, and helpful voting.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ReviewsDemo.displayName = 'ReviewsDemo';

// Export all components
export {
  reviewsVariants,
  type ReviewsProps,
  type ReviewsData,
  type RatingBreakdown,
  type Review,
  type ReviewPhoto,
  type ReviewCategory,
  type ReviewFilters,
  type ReviewSorting,
  type ReviewsDemoProps
};
