/**
 * Profile Setup Component
 * 
 * Provides user profile setup and management for Atlas travel agent.
 * Implements comprehensive profile creation and editing features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Profile Setup Variants
const profileSetupVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'profile-setup-mode-standard',
        'enhanced': 'profile-setup-mode-enhanced',
        'advanced': 'profile-setup-mode-advanced',
        'custom': 'profile-setup-mode-custom'
      },
      type: {
        'basic': 'profile-type-basic',
        'detailed': 'profile-type-detailed',
        'preferences': 'profile-type-preferences',
        'social': 'profile-type-social',
        'mixed': 'profile-type-mixed'
      },
      style: {
        'minimal': 'profile-style-minimal',
        'moderate': 'profile-style-moderate',
        'detailed': 'profile-style-detailed',
        'custom': 'profile-style-custom'
      },
      format: {
        'text': 'profile-format-text',
        'visual': 'profile-format-visual',
        'interactive': 'profile-format-interactive',
        'mixed': 'profile-format-mixed'
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

// Profile Setup Props
interface ProfileSetupProps extends VariantProps<typeof profileSetupVariants> {
  className?: string;
  onProfileUpdate?: (profile: UserProfile) => void;
  initialProfile?: Partial<UserProfile>;
  showAvatar?: boolean;
  showSocial?: boolean;
  showPreferences?: boolean;
  showValidation?: boolean;
}

// User Profile Interface
interface UserProfile {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    nationality?: string;
    avatar?: string;
  };
  preferences: {
    travelStyle: string[];
    budget: 'budget' | 'mid-range' | 'luxury';
    interests: string[];
    languages: string[];
    dietaryRestrictions: string[];
    accessibility: string[];
  };
  social: {
    bio?: string;
    website?: string;
    socialMedia: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
      linkedin?: string;
    };
    travelGoals: string[];
    bucketList: string[];
  };
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      marketing: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'friends' | 'private';
      showLocation: boolean;
      showTravelHistory: boolean;
    };
    accessibility: {
      highContrast: boolean;
      largeText: boolean;
      reducedMotion: boolean;
    };
  };
}

// Profile Setup Component
export const ProfileSetup = React.forwardRef<HTMLDivElement, ProfileSetupProps>(
  ({ 
    className, 
    onProfileUpdate,
    initialProfile,
    showAvatar = true,
    showSocial = true,
    showPreferences = true,
    showValidation = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [profile, setProfile] = useState<UserProfile>(
      initialProfile || {
        id: '',
        personalInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: 'prefer-not-to-say',
          nationality: '',
          avatar: ''
        },
        preferences: {
          travelStyle: [],
          budget: 'mid-range',
          interests: [],
          languages: [],
          dietaryRestrictions: [],
          accessibility: []
        },
        social: {
          bio: '',
          website: '',
          socialMedia: {},
          travelGoals: [],
          bucketList: []
        },
        settings: {
          notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false
          },
          privacy: {
            profileVisibility: 'friends',
            showLocation: true,
            showTravelHistory: false
          },
          accessibility: {
            highContrast: false,
            largeText: false,
            reducedMotion: false
          }
        }
      }
    );

    const [activeTab, setActiveTab] = useState('personal');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isValidating, setIsValidating] = useState(false);

    const tabs = [
      { id: 'personal', name: 'Personal Info', icon: '👤' },
      { id: 'preferences', name: 'Preferences', icon: '⚙️' },
      { id: 'social', name: 'Social', icon: '🌐' },
      { id: 'settings', name: 'Settings', icon: '🔧' }
    ];

    const updateProfile = useCallback((path: string, value: any) => {
      setProfile(prev => {
        const newProfile = { ...prev };
        const keys = path.split('.');
        let current: any = newProfile;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        onProfileUpdate?.(newProfile);
        return newProfile;
      });
    }, [onProfileUpdate]);

    const validateProfile = useCallback(async () => {
      setIsValidating(true);
      const newErrors: Record<string, string> = {};

      // Validate required fields
      if (!profile.personalInfo.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!profile.personalInfo.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!profile.personalInfo.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(profile.personalInfo.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      setErrors(newErrors);
      setIsValidating(false);
      return Object.keys(newErrors).length === 0;
    }, [profile]);

    const handleSave = useCallback(async () => {
      const isValid = await validateProfile();
      if (isValid) {
        onProfileUpdate?.(profile);
      }
    }, [profile, validateProfile, onProfileUpdate]);

    const travelStyles = [
      'Adventure', 'Culture', 'Relaxation', 'Food & Wine', 'Nature', 'Urban',
      'Luxury', 'Budget', 'Family', 'Solo', 'Business', 'Romantic'
    ];

    const interests = [
      'Photography', 'Art', 'Music', 'Sports', 'History', 'Architecture',
      'Cooking', 'Dancing', 'Reading', 'Gaming', 'Fitness', 'Yoga',
      'Meditation', 'Volunteering', 'Learning', 'Socializing', 'Technology',
      'Fashion', 'Beauty', 'Gardening', 'Pets', 'Movies', 'Theater'
    ];

    const languages = [
      'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
      'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian',
      'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish'
    ];

    const dietaryRestrictions = [
      'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut Allergy',
      'Seafood Allergy', 'Halal', 'Kosher', 'Low-Carb', 'Keto', 'Paleo'
    ];

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          profileSetupVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Profile Setup
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Complete your profile to get personalized travel recommendations
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isValidating}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isValidating ? 'Saving...' : 'Save Profile'}
          </button>
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
        <div className="space-y-6">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              {showAvatar && (
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl text-gray-400 dark:text-gray-500">
                      {profile.personalInfo.avatar || '👤'}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200">
                      📷
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Click to upload a profile picture
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={profile.personalInfo.firstName}
                    onChange={(e) => updateProfile('personalInfo.firstName', e.target.value)}
                    className={cn(
                      'w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-300',
                      errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    )}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={profile.personalInfo.lastName}
                    onChange={(e) => updateProfile('personalInfo.lastName', e.target.value)}
                    className={cn(
                      'w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-300',
                      errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    )}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => updateProfile('personalInfo.email', e.target.value)}
                    className={cn(
                      'w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-300',
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    )}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.personalInfo.phone}
                    onChange={(e) => updateProfile('personalInfo.phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.personalInfo.dateOfBirth}
                    onChange={(e) => updateProfile('personalInfo.dateOfBirth', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Gender
                  </label>
                  <select
                    value={profile.personalInfo.gender}
                    onChange={(e) => updateProfile('personalInfo.gender', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="prefer-not-to-say">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={profile.personalInfo.nationality}
                    onChange={(e) => updateProfile('personalInfo.nationality', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Enter your nationality"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && showPreferences && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Travel Styles
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {travelStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => {
                        const currentStyles = profile.preferences.travelStyle;
                        const newStyles = currentStyles.includes(style)
                          ? currentStyles.filter(s => s !== style)
                          : [...currentStyles, style];
                        updateProfile('preferences.travelStyle', newStyles);
                      }}
                      className={cn(
                        'px-3 py-2 text-sm rounded-md transition-colors duration-200',
                        profile.preferences.travelStyle.includes(style)
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
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Interests
                </label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => {
                        const currentInterests = profile.preferences.interests;
                        const newInterests = currentInterests.includes(interest)
                          ? currentInterests.filter(i => i !== interest)
                          : [...currentInterests, interest];
                        updateProfile('preferences.interests', newInterests);
                      }}
                      className={cn(
                        'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                        profile.preferences.interests.includes(interest)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      )}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Budget Range
                  </label>
                  <select
                    value={profile.preferences.budget}
                    onChange={(e) => updateProfile('preferences.budget', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="budget">Budget</option>
                    <option value="mid-range">Mid-range</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Languages
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {languages.map((language) => (
                      <label key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profile.preferences.languages.includes(language)}
                          onChange={(e) => {
                            const currentLanguages = profile.preferences.languages;
                            const newLanguages = e.target.checked
                              ? [...currentLanguages, language]
                              : currentLanguages.filter(l => l !== language);
                            updateProfile('preferences.languages', newLanguages);
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Dietary Restrictions
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {dietaryRestrictions.map((restriction) => (
                    <button
                      key={restriction}
                      onClick={() => {
                        const currentRestrictions = profile.preferences.dietaryRestrictions;
                        const newRestrictions = currentRestrictions.includes(restriction)
                          ? currentRestrictions.filter(r => r !== restriction)
                          : [...currentRestrictions, restriction];
                        updateProfile('preferences.dietaryRestrictions', newRestrictions);
                      }}
                      className={cn(
                        'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                        profile.preferences.dietaryRestrictions.includes(restriction)
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      )}
                    >
                      {restriction}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && showSocial && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.social.bio}
                  onChange={(e) => updateProfile('social.bio', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={profile.social.website}
                  onChange={(e) => updateProfile('social.website', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={profile.social.socialMedia.instagram || ''}
                    onChange={(e) => updateProfile('social.socialMedia.instagram', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Twitter
                  </label>
                  <input
                    type="text"
                    value={profile.social.socialMedia.twitter || ''}
                    onChange={(e) => updateProfile('social.socialMedia.twitter', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    placeholder="@username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Travel Goals
                </label>
                <textarea
                  value={profile.social.travelGoals.join('\n')}
                  onChange={(e) => updateProfile('social.travelGoals', e.target.value.split('\n').filter(g => g.trim()))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Enter your travel goals, one per line..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Bucket List
                </label>
                <textarea
                  value={profile.social.bucketList.join('\n')}
                  onChange={(e) => updateProfile('social.bucketList', e.target.value.split('\n').filter(b => b.trim()))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Enter your bucket list items, one per line..."
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Notifications
                </h4>
                <div className="space-y-3">
                  {Object.entries(profile.settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                      </label>
                      <button
                        onClick={() => updateProfile(`settings.notifications.${key}`, !value)}
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

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Privacy
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={profile.settings.privacy.profileVisibility}
                      onChange={(e) => updateProfile('settings.privacy.profileVisibility', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(profile.settings.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                        <button
                          onClick={() => updateProfile(`settings.privacy.${key}`, !value)}
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

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Accessibility
                </h4>
                <div className="space-y-3">
                  {Object.entries(profile.settings.accessibility).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                      <button
                        onClick={() => updateProfile(`settings.accessibility.${key}`, !value)}
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

ProfileSetup.displayName = 'ProfileSetup';

// Profile Setup Demo Component
interface ProfileSetupDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ProfileSetupDemo = React.forwardRef<HTMLDivElement, ProfileSetupDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [profile, setProfile] = useState<Partial<UserProfile>>({});

    const handleProfileUpdate = (updatedProfile: UserProfile) => {
      setProfile(updatedProfile);
      console.log('Profile updated:', updatedProfile);
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
          Profile Setup Demo
        </h3>
        
        <ProfileSetup
          onProfileUpdate={handleProfileUpdate}
          initialProfile={profile}
          showAvatar={true}
          showSocial={true}
          showPreferences={true}
          showValidation={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive profile setup with personal info, preferences, social links, and settings.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ProfileSetupDemo.displayName = 'ProfileSetupDemo';

// Export all components
export {
  profileSetupVariants,
  type ProfileSetupProps,
  type UserProfile,
  type ProfileSetupDemoProps
};
