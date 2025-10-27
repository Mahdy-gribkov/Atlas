/**
 * Booking Component
 * 
 * Provides comprehensive booking functionality for Atlas travel agent.
 * Implements booking flow, payment processing, and confirmation features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Booking Variants
const bookingVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'booking-mode-standard',
        'enhanced': 'booking-mode-enhanced',
        'advanced': 'booking-mode-advanced',
        'custom': 'booking-mode-custom'
      },
      type: {
        'flight': 'booking-type-flight',
        'hotel': 'booking-type-hotel',
        'activity': 'booking-type-activity',
        'package': 'booking-type-package',
        'mixed': 'booking-type-mixed'
      },
      style: {
        'minimal': 'booking-style-minimal',
        'moderate': 'booking-style-moderate',
        'detailed': 'booking-style-detailed',
        'custom': 'booking-style-custom'
      },
      format: {
        'text': 'booking-format-text',
        'visual': 'booking-format-visual',
        'interactive': 'booking-format-interactive',
        'mixed': 'booking-format-mixed'
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

// Booking Props
interface BookingProps extends VariantProps<typeof bookingVariants> {
  className?: string;
  onBookingComplete?: (booking: BookingData) => void;
  onBookingCancel?: () => void;
  initialBooking?: Partial<BookingData>;
  showSteps?: boolean;
  showPayment?: boolean;
  showConfirmation?: boolean;
}

// Booking Data Interface
interface BookingData {
  id: string;
  type: 'flight' | 'hotel' | 'activity' | 'package';
  item: {
    id: string;
    title: string;
    description: string;
    image?: string;
    price: number;
    currency: string;
    location?: string;
    date?: Date;
    duration?: string;
    capacity?: number;
  };
  travelers: {
    adults: number;
    children: number;
    infants: number;
    details: TravelerInfo[];
  };
  dates: {
    checkIn?: Date;
    checkOut?: Date;
    departure?: Date;
    return?: Date;
  };
  preferences: {
    seatPreference?: string;
    mealPreference?: string;
    roomType?: string;
    bedType?: string;
    specialRequests?: string;
  };
  payment: {
    method: 'card' | 'paypal' | 'apple-pay' | 'google-pay';
    cardDetails?: {
      number: string;
      expiry: string;
      cvv: string;
      name: string;
    };
    billingAddress?: Address;
  };
  contact: {
    email: string;
    phone: string;
    address: Address;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  taxes: number;
  fees: number;
  createdAt: Date;
  confirmationCode: string;
}

// Traveler Info Interface
interface TravelerInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  passport?: string;
  nationality?: string;
  specialNeeds?: string;
}

// Address Interface
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Booking Component
export const Booking = React.forwardRef<HTMLDivElement, BookingProps>(
  ({ 
    className, 
    onBookingComplete,
    onBookingCancel,
    initialBooking,
    showSteps = true,
    showPayment = true,
    showConfirmation = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [booking, setBooking] = useState<BookingData>(
      initialBooking || {
        id: '',
        type: 'hotel',
        item: {
          id: '',
          title: '',
          description: '',
          price: 0,
          currency: 'USD'
        },
        travelers: {
          adults: 1,
          children: 0,
          infants: 0,
          details: []
        },
        dates: {},
        preferences: {},
        payment: {
          method: 'card'
        },
        contact: {
          email: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          }
        },
        status: 'pending',
        totalAmount: 0,
        taxes: 0,
        fees: 0,
        createdAt: new Date(),
        confirmationCode: ''
      }
    );

    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const steps = [
      { id: 1, name: 'Travelers', icon: '👥' },
      { id: 2, name: 'Dates', icon: '📅' },
      { id: 3, name: 'Preferences', icon: '⚙️' },
      { id: 4, name: 'Payment', icon: '💳' },
      { id: 5, name: 'Confirmation', icon: '✅' }
    ];

    const updateBooking = useCallback((path: string, value: any) => {
      setBooking(prev => {
        const newBooking = { ...prev };
        const keys = path.split('.');
        let current: any = newBooking;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return newBooking;
      });
    }, []);

    const validateStep = useCallback((step: number): boolean => {
      const newErrors: Record<string, string> = {};

      switch (step) {
        case 1: // Travelers
          if (booking.travelers.adults === 0) {
            newErrors.adults = 'At least one adult is required';
          }
          break;
        case 2: // Dates
          if (booking.type === 'hotel' && !booking.dates.checkIn) {
            newErrors.checkIn = 'Check-in date is required';
          }
          if (booking.type === 'hotel' && !booking.dates.checkOut) {
            newErrors.checkOut = 'Check-out date is required';
          }
          if (booking.type === 'flight' && !booking.dates.departure) {
            newErrors.departure = 'Departure date is required';
          }
          break;
        case 3: // Preferences
          // Optional step, no validation required
          break;
        case 4: // Payment
          if (!booking.contact.email) {
            newErrors.email = 'Email is required';
          }
          if (!booking.contact.phone) {
            newErrors.phone = 'Phone number is required';
          }
          if (booking.payment.method === 'card' && !booking.payment.cardDetails?.number) {
            newErrors.cardNumber = 'Card number is required';
          }
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [booking]);

    const handleNext = useCallback(() => {
      if (validateStep(currentStep)) {
        if (currentStep < steps.length) {
          setCurrentStep(prev => prev + 1);
        } else {
          handleComplete();
        }
      }
    }, [currentStep, validateStep]);

    const handlePrevious = useCallback(() => {
      if (currentStep > 1) {
        setCurrentStep(prev => prev - 1);
      }
    }, [currentStep]);

    const handleComplete = useCallback(async () => {
      setIsProcessing(true);
      
      // Simulate booking processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const completedBooking: BookingData = {
        ...booking,
        id: `BK-${Date.now()}`,
        status: 'confirmed',
        confirmationCode: `ATL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        totalAmount: booking.item.price + booking.taxes + booking.fees,
        taxes: booking.item.price * 0.1, // 10% tax
        fees: booking.item.price * 0.05, // 5% fees
        createdAt: new Date()
      };
      
      setBooking(completedBooking);
      onBookingComplete?.(completedBooking);
      setIsProcessing(false);
    }, [booking, onBookingComplete]);

    const handleCancel = useCallback(() => {
      onBookingCancel?.();
    }, [onBookingCancel]);

    const addTraveler = useCallback(() => {
      const totalTravelers = booking.travelers.adults + booking.travelers.children + booking.travelers.infants;
      if (totalTravelers < 9) { // Max 9 travelers
        const newTraveler: TravelerInfo = {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: 'male',
          passport: '',
          nationality: '',
          specialNeeds: ''
        };
        updateBooking('travelers.details', [...booking.travelers.details, newTraveler]);
      }
    }, [booking.travelers, updateBooking]);

    const removeTraveler = useCallback((index: number) => {
      const newDetails = booking.travelers.details.filter((_, i) => i !== index);
      updateBooking('travelers.details', newDetails);
    }, [booking.travelers.details, updateBooking]);

    const updateTraveler = useCallback((index: number, field: string, value: string) => {
      const newDetails = [...booking.travelers.details];
      newDetails[index] = { ...newDetails[index], [field]: value };
      updateBooking('travelers.details', newDetails);
    }, [booking.travelers.details, updateBooking]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          bookingVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Complete Your Booking
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {booking.item.title}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${booking.item.price}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              per {booking.type === 'hotel' ? 'night' : booking.type === 'flight' ? 'person' : 'booking'}
            </div>
          </div>
        </div>

        {/* Steps */}
        {showSteps && (
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200',
                  currentStep >= step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400'
                )}>
                  <span className="text-sm">{step.icon}</span>
                </div>
                <div className="ml-3">
                  <div className={cn(
                    'text-sm font-medium',
                    currentStep >= step.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  )}>
                    {step.name}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-12 h-0.5 mx-4',
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  )} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Traveler Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Adults (18+)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={booking.travelers.adults}
                    onChange={(e) => updateBooking('travelers.adults', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  />
                  {errors.adults && (
                    <p className="text-red-500 text-sm mt-1">{errors.adults}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Children (2-17)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={booking.travelers.children}
                    onChange={(e) => updateBooking('travelers.children', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Infants (0-1)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={booking.travelers.infants}
                    onChange={(e) => updateBooking('travelers.infants', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              {/* Traveler Details */}
              {booking.travelers.details.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
                    Traveler Details
                  </h4>
                  {booking.travelers.details.map((traveler, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100">
                          Traveler {index + 1}
                        </h5>
                        <button
                          onClick={() => removeTraveler(index)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={traveler.firstName}
                            onChange={(e) => updateTraveler(index, 'firstName', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={traveler.lastName}
                            onChange={(e) => updateTraveler(index, 'lastName', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            value={traveler.dateOfBirth}
                            onChange={(e) => updateTraveler(index, 'dateOfBirth', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Gender
                          </label>
                          <select
                            value={traveler.gender}
                            onChange={(e) => updateTraveler(index, 'gender', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={addTraveler}
                className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200"
              >
                + Add Traveler Details
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Dates & Times
              </h3>
              
              {booking.type === 'hotel' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={booking.dates.checkIn?.toISOString().split('T')[0] || ''}
                      onChange={(e) => updateBooking('dates.checkIn', new Date(e.target.value))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                    {errors.checkIn && (
                      <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      value={booking.dates.checkOut?.toISOString().split('T')[0] || ''}
                      onChange={(e) => updateBooking('dates.checkOut', new Date(e.target.value))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                    {errors.checkOut && (
                      <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>
                    )}
                  </div>
                </div>
              )}
              
              {booking.type === 'flight' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Departure Date
                    </label>
                    <input
                      type="datetime-local"
                      value={booking.dates.departure?.toISOString().slice(0, 16) || ''}
                      onChange={(e) => updateBooking('dates.departure', new Date(e.target.value))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                    {errors.departure && (
                      <p className="text-red-500 text-sm mt-1">{errors.departure}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Return Date
                    </label>
                    <input
                      type="datetime-local"
                      value={booking.dates.return?.toISOString().slice(0, 16) || ''}
                      onChange={(e) => updateBooking('dates.return', new Date(e.target.value))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Preferences
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.type === 'flight' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Seat Preference
                      </label>
                      <select
                        value={booking.preferences.seatPreference || ''}
                        onChange={(e) => updateBooking('preferences.seatPreference', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                      >
                        <option value="">No preference</option>
                        <option value="window">Window</option>
                        <option value="aisle">Aisle</option>
                        <option value="middle">Middle</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Meal Preference
                      </label>
                      <select
                        value={booking.preferences.mealPreference || ''}
                        onChange={(e) => updateBooking('preferences.mealPreference', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                      >
                        <option value="">No preference</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="halal">Halal</option>
                        <option value="kosher">Kosher</option>
                      </select>
                    </div>
                  </>
                )}
                
                {booking.type === 'hotel' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Room Type
                      </label>
                      <select
                        value={booking.preferences.roomType || ''}
                        onChange={(e) => updateBooking('preferences.roomType', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                      >
                        <option value="">Standard</option>
                        <option value="deluxe">Deluxe</option>
                        <option value="suite">Suite</option>
                        <option value="presidential">Presidential</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Bed Type
                      </label>
                      <select
                        value={booking.preferences.bedType || ''}
                        onChange={(e) => updateBooking('preferences.bedType', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                      >
                        <option value="">No preference</option>
                        <option value="king">King</option>
                        <option value="queen">Queen</option>
                        <option value="double">Double</option>
                        <option value="twin">Twin</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={booking.preferences.specialRequests || ''}
                  onChange={(e) => updateBooking('preferences.specialRequests', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Any special requests or requirements..."
                />
              </div>
            </div>
          )}

          {currentStep === 4 && showPayment && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Payment Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={booking.contact.email}
                      onChange={(e) => updateBooking('contact.email', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
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
                      value={booking.contact.phone}
                      onChange={(e) => updateBooking('contact.phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['card', 'paypal', 'apple-pay', 'google-pay'].map((method) => (
                        <button
                          key={method}
                          onClick={() => updateBooking('payment.method', method)}
                          className={cn(
                            'p-3 border rounded-md text-center transition-colors duration-200',
                            booking.payment.method === method
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          )}
                        >
                          {method === 'card' && '💳 Card'}
                          {method === 'paypal' && '🅿️ PayPal'}
                          {method === 'apple-pay' && '🍎 Apple Pay'}
                          {method === 'google-pay' && '📱 Google Pay'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
                    Booking Summary
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Base Price</span>
                      <span>${booking.item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Taxes</span>
                      <span>${booking.taxes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fees</span>
                      <span>${booking.fees}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${booking.item.price + booking.taxes + booking.fees}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && showConfirmation && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your booking has been successfully confirmed
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Confirmation Details
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Confirmation Code:</span>
                    <span className="font-mono font-semibold">{booking.confirmationCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Booking ID:</span>
                    <span className="font-mono">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                    <span className="font-semibold">${booking.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
          
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Previous
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : currentStep === steps.length ? (
                'Complete Booking'
              ) : (
                'Next'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

Booking.displayName = 'Booking';

// Booking Demo Component
interface BookingDemoProps {
  className?: string;
  showControls?: boolean;
}

export const BookingDemo = React.forwardRef<HTMLDivElement, BookingDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [booking, setBooking] = useState<BookingData | null>(null);

    const handleBookingComplete = (completedBooking: BookingData) => {
      setBooking(completedBooking);
      console.log('Booking completed:', completedBooking);
    };

    const handleBookingCancel = () => {
      console.log('Booking cancelled');
    };

    const mockBookingData: Partial<BookingData> = {
      type: 'hotel',
      item: {
        id: 'hotel-1',
        title: 'Grand Hotel Paris',
        description: 'Luxury hotel in the heart of Paris',
        image: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Grand+Hotel',
        price: 250,
        currency: 'USD',
        location: 'Paris, France'
      },
      travelers: {
        adults: 2,
        children: 0,
        infants: 0,
        details: []
      },
      dates: {
        checkIn: new Date('2024-06-15'),
        checkOut: new Date('2024-06-18')
      },
      preferences: {},
      payment: {
        method: 'card'
      },
      contact: {
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      },
      status: 'pending',
      totalAmount: 0,
      taxes: 0,
      fees: 0,
      createdAt: new Date(),
      confirmationCode: ''
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
          Booking Demo
        </h3>
        
        <Booking
          onBookingComplete={handleBookingComplete}
          onBookingCancel={handleBookingCancel}
          initialBooking={mockBookingData}
          showSteps={true}
          showPayment={true}
          showConfirmation={true}
        />
        
        {booking && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Booking Completed Successfully!
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Confirmation Code: {booking.confirmationCode}
            </p>
          </div>
        )}
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive booking flow with traveler information, dates, preferences, payment, and confirmation.
            </p>
          </div>
        )}
      </div>
    );
  }
);

BookingDemo.displayName = 'BookingDemo';

// Export all components
export {
  bookingVariants,
  type BookingProps,
  type BookingData,
  type TravelerInfo,
  type Address,
  type BookingDemoProps
};
