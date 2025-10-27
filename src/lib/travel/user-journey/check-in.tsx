/**
 * Check-in Component
 * 
 * Provides comprehensive check-in functionality for Atlas travel agent.
 * Implements online check-in, boarding pass management, and flight status features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Check-in Variants
const checkInVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'check-in-mode-standard',
        'enhanced': 'check-in-mode-enhanced',
        'advanced': 'check-in-mode-advanced',
        'custom': 'check-in-mode-custom'
      },
      type: {
        'flight': 'check-in-type-flight',
        'hotel': 'check-in-type-hotel',
        'car': 'check-in-type-car',
        'activity': 'check-in-type-activity',
        'mixed': 'check-in-type-mixed'
      },
      style: {
        'minimal': 'check-in-style-minimal',
        'moderate': 'check-in-style-moderate',
        'detailed': 'check-in-style-detailed',
        'custom': 'check-in-style-custom'
      },
      format: {
        'text': 'check-in-format-text',
        'visual': 'check-in-format-visual',
        'interactive': 'check-in-format-interactive',
        'mixed': 'check-in-format-mixed'
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

// Check-in Props
interface CheckInProps extends VariantProps<typeof checkInVariants> {
  className?: string;
  onCheckInComplete?: (checkIn: CheckInData) => void;
  initialCheckIn?: Partial<CheckInData>;
  showBoardingPass?: boolean;
  showSeatSelection?: boolean;
  showBaggage?: boolean;
  showStatus?: boolean;
}

// Check-in Data Interface
interface CheckInData {
  id: string;
  bookingReference: string;
  type: 'flight' | 'hotel' | 'car' | 'activity';
  status: 'pending' | 'available' | 'completed' | 'expired';
  checkInWindow: {
    opens: Date;
    closes: Date;
    isOpen: boolean;
  };
  details: FlightDetails | HotelDetails | CarDetails | ActivityDetails;
  passengers: PassengerInfo[];
  boardingPass?: BoardingPass;
  seatSelection?: SeatSelection;
  baggage?: BaggageInfo;
  createdAt: Date;
  updatedAt: Date;
}

// Flight Details Interface
interface FlightDetails {
  flightNumber: string;
  airline: string;
  departure: {
    airport: string;
    city: string;
    terminal: string;
    gate?: string;
    time: Date;
  };
  arrival: {
    airport: string;
    city: string;
    terminal: string;
    time: Date;
  };
  duration: number; // in minutes
  aircraft: string;
  class: 'economy' | 'premium-economy' | 'business' | 'first';
}

// Hotel Details Interface
interface HotelDetails {
  hotelName: string;
  address: string;
  checkInTime: Date;
  checkOutTime: Date;
  roomType: string;
  confirmationNumber: string;
}

// Car Details Interface
interface CarDetails {
  rentalCompany: string;
  carModel: string;
  pickupLocation: string;
  returnLocation: string;
  pickupTime: Date;
  returnTime: Date;
  confirmationNumber: string;
}

// Activity Details Interface
interface ActivityDetails {
  activityName: string;
  provider: string;
  location: string;
  startTime: Date;
  duration: number; // in minutes
  confirmationNumber: string;
}

// Passenger Info Interface
interface PassengerInfo {
  id: string;
  firstName: string;
  lastName: string;
  seatNumber?: string;
  boardingGroup?: string;
  isCheckedIn: boolean;
  specialRequests?: string[];
}

// Boarding Pass Interface
interface BoardingPass {
  id: string;
  passengerId: string;
  qrCode: string;
  barcode: string;
  seatNumber: string;
  boardingGroup: string;
  gate?: string;
  terminal: string;
  boardingTime: Date;
  isDownloaded: boolean;
  downloadUrl?: string;
}

// Seat Selection Interface
interface SeatSelection {
  availableSeats: Seat[];
  selectedSeats: string[];
  seatMap: SeatMapRow[];
  pricing: {
    basePrice: number;
    seatFees: Record<string, number>;
    currency: string;
  };
}

// Seat Interface
interface Seat {
  id: string;
  number: string;
  row: number;
  position: 'window' | 'middle' | 'aisle';
  class: 'economy' | 'premium-economy' | 'business' | 'first';
  isAvailable: boolean;
  price: number;
  features: string[];
}

// Seat Map Row Interface
interface SeatMapRow {
  rowNumber: number;
  seats: Seat[];
}

// Baggage Info Interface
interface BaggageInfo {
  allowance: {
    carryOn: number;
    checked: number;
    weight: number; // in kg
  };
  booked: {
    carryOn: number;
    checked: number;
    weight: number;
  };
  fees: {
    carryOn: number;
    checked: number;
    overweight: number;
  };
  currency: string;
}

// Check-in Component
export const CheckIn = React.forwardRef<HTMLDivElement, CheckInProps>(
  ({ 
    className, 
    onCheckInComplete,
    initialCheckIn,
    showBoardingPass = true,
    showSeatSelection = true,
    showBaggage = true,
    showStatus = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [checkIn, setCheckIn] = useState<CheckInData>(
      initialCheckIn || {
        id: '',
        bookingReference: '',
        type: 'flight',
        status: 'pending',
        checkInWindow: {
          opens: new Date(),
          closes: new Date(),
          isOpen: false
        },
        details: {} as any,
        passengers: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeStep, setActiveStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPassengers, setSelectedPassengers] = useState<string[]>([]);

    const steps = [
      { id: 1, name: 'Passengers', icon: '👥' },
      { id: 2, name: 'Seats', icon: '💺' },
      { id: 3, name: 'Baggage', icon: '🧳' },
      { id: 4, name: 'Boarding Pass', icon: '🎫' }
    ];

    const updateCheckIn = useCallback((path: string, value: any) => {
      setCheckIn(prev => {
        const newCheckIn = { ...prev };
        const keys = path.split('.');
        let current: any = newCheckIn;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newCheckIn.updatedAt = new Date();
        onCheckInComplete?.(newCheckIn);
        return newCheckIn;
      });
    }, [onCheckInComplete]);

    const handlePassengerSelect = useCallback((passengerId: string) => {
      setSelectedPassengers(prev => 
        prev.includes(passengerId) 
          ? prev.filter(id => id !== passengerId)
          : [...prev, passengerId]
      );
    }, []);

    const handleCheckIn = useCallback(async () => {
      setIsProcessing(true);
      
      // Simulate check-in process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update passenger check-in status
      const updatedPassengers = checkIn.passengers.map(passenger => 
        selectedPassengers.includes(passenger.id)
          ? { ...passenger, isCheckedIn: true }
          : passenger
      );
      
      updateCheckIn('passengers', updatedPassengers);
      updateCheckIn('status', 'completed');
      
      setIsProcessing(false);
      setActiveStep(4); // Move to boarding pass step
    }, [checkIn.passengers, selectedPassengers, updateCheckIn]);

    const generateBoardingPass = useCallback((passengerId: string) => {
      const passenger = checkIn.passengers.find(p => p.id === passengerId);
      if (!passenger) return;

      const boardingPass: BoardingPass = {
        id: `bp-${Date.now()}`,
        passengerId,
        qrCode: `QR-${passengerId}-${Date.now()}`,
        barcode: `BAR-${passengerId}-${Date.now()}`,
        seatNumber: passenger.seatNumber || 'TBD',
        boardingGroup: passenger.boardingGroup || 'A',
        gate: (checkIn.details as FlightDetails).departure?.gate,
        terminal: (checkIn.details as FlightDetails).departure?.terminal || 'T1',
        boardingTime: new Date((checkIn.details as FlightDetails).departure?.time.getTime() - 30 * 60 * 1000),
        isDownloaded: false
      };

      updateCheckIn('boardingPass', boardingPass);
    }, [checkIn.passengers, checkIn.details, updateCheckIn]);

    const downloadBoardingPass = useCallback((passengerId: string) => {
      const boardingPass = checkIn.boardingPass;
      if (!boardingPass) return;

      // Simulate download
      console.log('Downloading boarding pass for passenger:', passengerId);
      updateCheckIn('boardingPass.isDownloaded', true);
    }, [checkIn.boardingPass, updateCheckIn]);

    const getStatusColor = (status: CheckInData['status']) => {
      switch (status) {
        case 'pending': return 'text-gray-600 dark:text-gray-400';
        case 'available': return 'text-blue-600 dark:text-blue-400';
        case 'completed': return 'text-green-600 dark:text-green-400';
        case 'expired': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getStatusIcon = (status: CheckInData['status']) => {
      switch (status) {
        case 'pending': return '⏳';
        case 'available': return '✅';
        case 'completed': return '🎉';
        case 'expired': return '❌';
        default: return '⏳';
      }
    };

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString();
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          checkInVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Check-in
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Booking Reference: {checkIn.bookingReference}
            </p>
          </div>
          <div className="text-right">
            <div className={cn('flex items-center gap-2 text-lg font-semibold', getStatusColor(checkIn.status))}>
              <span>{getStatusIcon(checkIn.status)}</span>
              <span>{checkIn.status.charAt(0).toUpperCase() + checkIn.status.slice(1)}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Check-in {checkIn.checkInWindow.isOpen ? 'Available' : 'Not Available'}
            </div>
          </div>
        </div>

        {/* Flight Details */}
        {checkIn.type === 'flight' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Flight Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {(checkIn.details as FlightDetails).departure?.airport}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {(checkIn.details as FlightDetails).departure?.city}
                </div>
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-2">
                  {formatTime((checkIn.details as FlightDetails).departure?.time || new Date())}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {formatDate((checkIn.details as FlightDetails).departure?.time || new Date())}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {(checkIn.details as FlightDetails).flightNumber}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {(checkIn.details as FlightDetails).airline}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Duration: {(checkIn.details as FlightDetails).duration} min
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Aircraft: {(checkIn.details as FlightDetails).aircraft}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {(checkIn.details as FlightDetails).arrival?.airport}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {(checkIn.details as FlightDetails).arrival?.city}
                </div>
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-2">
                  {formatTime((checkIn.details as FlightDetails).arrival?.time || new Date())}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {formatDate((checkIn.details as FlightDetails).arrival?.time || new Date())}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200',
                activeStep >= step.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400'
              )}>
                <span className="text-sm">{step.icon}</span>
              </div>
              <div className="ml-3">
                <div className={cn(
                  'text-sm font-medium',
                  activeStep >= step.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                )}>
                  {step.name}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'w-12 h-0.5 mx-4',
                  activeStep > step.id ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          {activeStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Select Passengers
              </h3>
              
              <div className="space-y-3">
                {checkIn.passengers.map((passenger) => (
                  <div
                    key={passenger.id}
                    className={cn(
                      'flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors duration-200',
                      selectedPassengers.includes(passenger.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    )}
                    onClick={() => handlePassengerSelect(passenger.id)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedPassengers.includes(passenger.id)}
                        onChange={() => handlePassengerSelect(passenger.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {passenger.firstName} {passenger.lastName}
                        </div>
                        {passenger.seatNumber && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Seat: {passenger.seatNumber}
                          </div>
                        )}
                        {passenger.boardingGroup && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Boarding Group: {passenger.boardingGroup}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {passenger.isCheckedIn ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                          Checked In
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded-md">
                          Not Checked In
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setActiveStep(2)}
                  disabled={selectedPassengers.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Continue to Seat Selection
                </button>
              </div>
            </div>
          )}

          {activeStep === 2 && showSeatSelection && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Seat Selection
              </h3>
              
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">💺</div>
                <p>Seat selection feature would be implemented here</p>
                <p className="text-sm">Interactive seat map with pricing and availability</p>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Continue to Baggage
                </button>
              </div>
            </div>
          )}

          {activeStep === 3 && showBaggage && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Baggage Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {checkIn.baggage?.allowance.carryOn || 1}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Carry-on Allowance</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {checkIn.baggage?.allowance.checked || 2}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Checked Allowance</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {checkIn.baggage?.allowance.weight || 23}kg
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Weight Limit</div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Continue to Check-in
                </button>
              </div>
            </div>
          )}

          {activeStep === 4 && showBoardingPass && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Complete Check-in
              </h3>
              
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✈️</div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Ready to Check-in
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Complete the check-in process for {selectedPassengers.length} passenger(s)
                </p>
                
                <button
                  onClick={handleCheckIn}
                  disabled={isProcessing || selectedPassengers.length === 0}
                  className="px-8 py-3 bg-green-600 text-white text-lg font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Complete Check-in'
                  )}
                </button>
              </div>
              
              {checkIn.status === 'completed' && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Check-in Completed Successfully!
                  </h4>
                  <p className="text-green-700 dark:text-green-300 text-sm mb-4">
                    Your boarding passes are ready for download
                  </p>
                  
                  <div className="space-y-2">
                    {selectedPassengers.map((passengerId) => {
                      const passenger = checkIn.passengers.find(p => p.id === passengerId);
                      return (
                        <div key={passengerId} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-md">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {passenger?.firstName} {passenger?.lastName}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Seat: {passenger?.seatNumber || 'TBD'}
                            </div>
                          </div>
                          <button
                            onClick={() => downloadBoardingPass(passengerId)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                          >
                            Download Pass
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

CheckIn.displayName = 'CheckIn';

// Check-in Demo Component
interface CheckInDemoProps {
  className?: string;
  showControls?: boolean;
}

export const CheckInDemo = React.forwardRef<HTMLDivElement, CheckInDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [checkIn, setCheckIn] = useState<Partial<CheckInData>>({});

    const handleCheckInComplete = (completedCheckIn: CheckInData) => {
      setCheckIn(completedCheckIn);
      console.log('Check-in completed:', completedCheckIn);
    };

    const mockCheckIn: Partial<CheckInData> = {
      id: 'checkin-1',
      bookingReference: 'ABC123',
      type: 'flight',
      status: 'available',
      checkInWindow: {
        opens: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        closes: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        isOpen: true
      },
      details: {
        flightNumber: 'AA1234',
        airline: 'American Airlines',
        departure: {
          airport: 'LAX',
          city: 'Los Angeles',
          terminal: 'T4',
          gate: 'A12',
          time: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours from now
        },
        arrival: {
          airport: 'JFK',
          city: 'New York',
          terminal: 'T8',
          time: new Date(Date.now() + 7 * 60 * 60 * 1000) // 7 hours from now
        },
        duration: 300,
        aircraft: 'Boeing 737',
        class: 'economy'
      } as FlightDetails,
      passengers: [
        {
          id: 'passenger-1',
          firstName: 'John',
          lastName: 'Doe',
          seatNumber: '12A',
          boardingGroup: 'A',
          isCheckedIn: false,
          specialRequests: []
        },
        {
          id: 'passenger-2',
          firstName: 'Jane',
          lastName: 'Doe',
          seatNumber: '12B',
          boardingGroup: 'A',
          isCheckedIn: false,
          specialRequests: []
        }
      ],
      baggage: {
        allowance: {
          carryOn: 1,
          checked: 2,
          weight: 23
        },
        booked: {
          carryOn: 1,
          checked: 1,
          weight: 15
        },
        fees: {
          carryOn: 0,
          checked: 0,
          overweight: 0
        },
        currency: 'USD'
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
          Check-in Demo
        </h3>
        
        <CheckIn
          onCheckInComplete={handleCheckInComplete}
          initialCheckIn={mockCheckIn}
          showBoardingPass={true}
          showSeatSelection={true}
          showBaggage={true}
          showStatus={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive check-in system with passenger selection, seat assignment, baggage management, and boarding pass generation.
            </p>
          </div>
        )}
      </div>
    );
  }
);

CheckInDemo.displayName = 'CheckInDemo';

// Export all components
export {
  checkInVariants,
  type CheckInProps,
  type CheckInData,
  type FlightDetails,
  type HotelDetails,
  type CarDetails,
  type ActivityDetails,
  type PassengerInfo,
  type BoardingPass,
  type SeatSelection,
  type Seat,
  type SeatMapRow,
  type BaggageInfo,
  type CheckInDemoProps
};
