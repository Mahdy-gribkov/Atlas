'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, DollarSign, Heart, Leaf, Accessibility } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

interface ItineraryFormData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  interests: string[];
  travelStyle: {
    budget: string;
    pace: string;
    accommodation: string;
    transportation: string;
    groupSize: string;
  };
  accessibility: {
    mobility: boolean;
    visual: boolean;
    hearing: boolean;
    cognitive: boolean;
    notes: string;
  };
  dietary: {
    restrictions: string[];
    allergies: string[];
    preferences: string[];
  };
  additionalNotes: string;
}

const INTEREST_OPTIONS = [
  'Culture & History', 'Nature & Outdoors', 'Food & Dining', 'Art & Museums',
  'Nightlife', 'Shopping', 'Adventure Sports', 'Relaxation & Wellness',
  'Photography', 'Music & Entertainment', 'Architecture', 'Local Experiences'
];

const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Kosher', 'Halal',
  'Pescatarian', 'Keto', 'Paleo', 'Low-Carb', 'Raw Food'
];

const DIETARY_ALLERGIES = [
  'Nuts', 'Shellfish', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Sesame'
];

export function ItineraryWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ItineraryFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: 1000,
    interests: [],
    travelStyle: {
      budget: 'mid-range',
      pace: 'moderate',
      accommodation: 'hotel',
      transportation: 'public',
      groupSize: 'solo',
    },
    accessibility: {
      mobility: false,
      visual: false,
      hearing: false,
      cognitive: false,
      notes: '',
    },
    dietary: {
      restrictions: [],
      allergies: [],
      preferences: [],
    },
    additionalNotes: '',
  });

  const updateFormData = (updates: Partial<ItineraryFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const steps: WizardStep[] = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Tell us about your trip basics',
      component: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="destination"
                placeholder="Where do you want to go?"
                value={formData.destination}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ destination: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ startDate: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ endDate: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travelers">Number of Travelers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.travelers}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ travelers: parseInt(e.target.value) || 1 })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  value={formData.budget}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ budget: parseInt(e.target.value) || 0 })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'interests',
      title: 'Interests & Preferences',
      description: 'What are you interested in?',
      component: (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>What interests you most? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {INTEREST_OPTIONS.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={() => 
                      toggleArrayItem(formData.interests, interest, (items) => 
                        updateFormData({ interests: items })
                      )
                    }
                  />
                  <Label htmlFor={interest} className="text-sm">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
            {formData.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'travel-style',
      title: 'Travel Style',
      description: 'How do you like to travel?',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Budget Level</Label>
              <Select
                value={formData.travelStyle.budget}
                onValueChange={(value: string) => 
                  updateFormData({ 
                    travelStyle: { ...formData.travelStyle, budget: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="mid-range">Mid-Range</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Travel Pace</Label>
              <Select
                value={formData.travelStyle.pace}
                onValueChange={(value: string) => 
                  updateFormData({ 
                    travelStyle: { ...formData.travelStyle, pace: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="fast-paced">Fast-Paced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Accommodation</Label>
              <Select
                value={formData.travelStyle.accommodation}
                onValueChange={(value: string) => 
                  updateFormData({ 
                    travelStyle: { ...formData.travelStyle, accommodation: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hostel">Hostel</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="airbnb">Airbnb</SelectItem>
                  <SelectItem value="luxury">Luxury Resort</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Transportation</Label>
              <Select
                value={formData.travelStyle.transportation}
                onValueChange={(value: string) => 
                  updateFormData({ 
                    travelStyle: { ...formData.travelStyle, transportation: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public Transport</SelectItem>
                  <SelectItem value="rental">Rental Car</SelectItem>
                  <SelectItem value="private">Private Driver</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'accessibility',
      title: 'Accessibility Needs',
      description: 'Let us know about any accessibility requirements',
      component: (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Accessibility Requirements (Select all that apply)</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mobility"
                  checked={formData.accessibility.mobility}
                  onCheckedChange={(checked) => 
                    updateFormData({ 
                      accessibility: { ...formData.accessibility, mobility: checked === true }
                    })
                  }
                />
                <Label htmlFor="mobility" className="flex items-center space-x-2">
                  <Accessibility className="h-4 w-4" />
                  <span>Mobility assistance</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="visual"
                  checked={formData.accessibility.visual}
                  onCheckedChange={(checked) => 
                    updateFormData({ 
                      accessibility: { ...formData.accessibility, visual: checked === true }
                    })
                  }
                />
                <Label htmlFor="visual" className="flex items-center space-x-2">
                  <Accessibility className="h-4 w-4" />
                  <span>Visual accessibility</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hearing"
                  checked={formData.accessibility.hearing}
                  onCheckedChange={(checked) => 
                    updateFormData({ 
                      accessibility: { ...formData.accessibility, hearing: checked === true }
                    })
                  }
                />
                <Label htmlFor="hearing" className="flex items-center space-x-2">
                  <Accessibility className="h-4 w-4" />
                  <span>Hearing accessibility</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cognitive"
                  checked={formData.accessibility.cognitive}
                  onCheckedChange={(checked) => 
                    updateFormData({ 
                      accessibility: { ...formData.accessibility, cognitive: checked === true }
                    })
                  }
                />
                <Label htmlFor="cognitive" className="flex items-center space-x-2">
                  <Accessibility className="h-4 w-4" />
                  <span>Cognitive accessibility</span>
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessibility-notes">Additional Accessibility Notes</Label>
            <Textarea
              id="accessibility-notes"
              placeholder="Any specific accessibility requirements or notes..."
              value={formData.accessibility.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                updateFormData({ 
                  accessibility: { ...formData.accessibility, notes: e.target.value }
                })
              }
              rows={3}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'dietary',
      title: 'Dietary Requirements',
      description: 'Any dietary restrictions or preferences?',
      component: (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Dietary Restrictions (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {DIETARY_RESTRICTIONS.map((restriction) => (
                <div key={restriction} className="flex items-center space-x-2">
                  <Checkbox
                    id={restriction}
                    checked={formData.dietary.restrictions.includes(restriction)}
                    onCheckedChange={() => 
                      toggleArrayItem(formData.dietary.restrictions, restriction, (items) => 
                        updateFormData({ 
                          dietary: { ...formData.dietary, restrictions: items }
                        })
                      )
                    }
                  />
                  <Label htmlFor={restriction} className="text-sm">
                    {restriction}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Allergies (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {DIETARY_ALLERGIES.map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergy}
                    checked={formData.dietary.allergies.includes(allergy)}
                    onCheckedChange={() => 
                      toggleArrayItem(formData.dietary.allergies, allergy, (items) => 
                        updateFormData({ 
                          dietary: { ...formData.dietary, allergies: items }
                        })
                      )
                    }
                  />
                  <Label htmlFor={allergy} className="text-sm">
                    {allergy}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietary-preferences">Additional Dietary Preferences</Label>
            <Textarea
              id="dietary-preferences"
              placeholder="Any other dietary preferences or notes..."
              value={formData.dietary.preferences.join(', ')}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                updateFormData({ 
                  dietary: { 
                    ...formData.dietary, 
                    preferences: e.target.value.split(',').map((p: string) => p.trim()).filter((p: string) => p)
                  }
                })
              }
              rows={3}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'additional-notes',
      title: 'Additional Notes',
      description: 'Anything else we should know?',
      component: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="additional-notes">Additional Notes</Label>
            <Textarea
              id="additional-notes"
              placeholder="Any special requests, must-see places, or other important information..."
              value={formData.additionalNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData({ additionalNotes: e.target.value })}
              rows={6}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Heart className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  We care about sustainability
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                  We&apos;ll prioritize eco-friendly options and local businesses in your itinerary.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          travelers: formData.travelers,
          budget: formData.budget,
          preferences: {
            interests: formData.interests,
            travelStyle: formData.travelStyle,
            accessibility: formData.accessibility,
            dietary: formData.dietary,
          },
          prompt: formData.additionalNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const result = await response.json();
      
      toast({
        title: 'Itinerary Generated!',
        description: 'Your personalized travel itinerary has been created.',
      });

      if (result.data?.id) {
        router.push(`/itineraries/${result.data.id}`);
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate itinerary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!(formData.destination && formData.startDate && formData.endDate);
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Your Perfect Itinerary
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about your dream trip and we&apos;ll create a personalized itinerary just for you.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep]?.title}</CardTitle>
          <CardDescription>{steps[currentStep]?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {steps[currentStep]?.component}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isStepValid()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Generating Itinerary...' : 'Generate Itinerary'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
