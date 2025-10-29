"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  ArrowRight,
  ArrowLeft,
  Plus,
  Globe,
  Plane,
  Hotel,
  Car,
  Utensils,
  Camera
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const steps: Step[] = [
  { id: 1, title: 'Destination', description: 'Choose where you want to go', completed: false },
  { id: 2, title: 'Dates', description: 'Select your travel dates', completed: false },
  { id: 3, title: 'Travelers', description: 'Add travelers and preferences', completed: false },
  { id: 4, title: 'Activities', description: 'Plan your activities', completed: false },
  { id: 5, title: 'Review', description: 'Review and confirm your trip', completed: false }
];

export function ItineraryWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    interests: [] as string[],
    activities: [] as string[]
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Creating itinerary with:', formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-atlas-text-primary mb-2">
                Where would you like to go?
              </label>
              <Input
                placeholder="Enter destination (e.g., Paris, Tokyo, New York)"
                value={formData.destination}
                onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Paris', 'Tokyo', 'London', 'New York', 'Barcelona', 'Rome', 'Amsterdam', 'Berlin'].map((city) => (
                <Button
                  key={city}
                  variant={formData.destination === city ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, destination: city }))}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {city}
                </Button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-atlas-text-primary mb-2">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-atlas-text-primary mb-2">
                  End Date
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['3 days', '1 week', '2 weeks', '1 month', 'Custom'].map((duration) => (
                <Button
                  key={duration}
                  variant="outline"
                  size="sm"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span>{duration}</span>
                </Button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-atlas-text-primary mb-2">
                Number of Travelers
              </label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
                >
                  -
                </Button>
                <span className="text-lg font-semibold">{formData.travelers}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, travelers: prev.travelers + 1 }))}
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-atlas-text-primary mb-2">
                Budget Range
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['$500-1000', '$1000-2500', '$2500-5000', '$5000+'].map((budget) => (
                  <Button
                    key={budget}
                    variant={formData.budget === budget ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, budget }))}
                  >
                    {budget}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-atlas-text-primary mb-2">
                What interests you?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Camera, label: 'Photography' },
                  { icon: Utensils, label: 'Food & Dining' },
                  { icon: Hotel, label: 'Luxury Hotels' },
                  { icon: Car, label: 'Adventure' },
                  { icon: Globe, label: 'Culture' },
                  { icon: Plane, label: 'Sightseeing' },
                  { icon: Star, label: 'Nightlife' },
                  { icon: MapPin, label: 'Nature' }
                ].map((interest) => (
                  <Button
                    key={interest.label}
                    variant={formData.interests.includes(interest.label) ? 'default' : 'outline'}
                    size="sm"
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        interests: prev.interests.includes(interest.label)
                          ? prev.interests.filter(i => i !== interest.label)
                          : [...prev.interests, interest.label]
                      }));
                    }}
                  >
                    <interest.icon className="h-5 w-5" />
                    <span>{interest.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Your Trip</CardTitle>
                <CardDescription>Please review your itinerary details before creating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-atlas-text-secondary" />
                  <span className="text-atlas-text-primary"><strong>Destination:</strong> {formData.destination}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-atlas-text-secondary" />
                  <span className="text-atlas-text-primary"><strong>Dates:</strong> {formData.startDate} - {formData.endDate}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-atlas-text-secondary" />
                  <span className="text-atlas-text-primary"><strong>Travelers:</strong> {formData.travelers}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-atlas-text-secondary" />
                  <span className="text-atlas-text-primary"><strong>Budget:</strong> {formData.budget}</span>
                </div>
                {formData.interests.length > 0 && (
                  <div>
                    <span className="text-atlas-text-primary"><strong>Interests:</strong></span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.interests.map((interest) => (
                        <Badge key={interest} variant="outline">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-atlas-text-primary">Create New Itinerary</h1>
        <p className="text-atlas-text-secondary mt-2">
          Let's plan your perfect trip step by step
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id 
                    ? 'bg-atlas-primary-main text-white' 
                    : 'bg-atlas-border text-atlas-text-tertiary'
                }`}>
                  {step.completed ? (
                    <Star className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-atlas-text-primary' : 'text-atlas-text-tertiary'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-atlas-text-secondary">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-atlas-primary-main' : 'bg-atlas-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep === steps.length ? (
          <Button onClick={handleSubmit}>
            Create Itinerary
            <Plus className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
