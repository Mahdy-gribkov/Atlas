/**
 * Travel Insurance Component
 * 
 * Provides travel insurance comparison and purchase for Atlas travel agent.
 * Implements insurance search, comparison, and booking for comprehensive travel protection.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Travel Insurance Variants
const travelInsuranceVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'travel-insurance-mode-standard',
        'enhanced': 'travel-insurance-mode-enhanced',
        'advanced': 'travel-insurance-mode-advanced',
        'custom': 'travel-insurance-mode-custom'
      },
      type: {
        'basic': 'insurance-type-basic',
        'comprehensive': 'insurance-type-comprehensive',
        'premium': 'insurance-type-premium',
        'mixed': 'insurance-type-mixed'
      },
      style: {
        'minimal': 'insurance-style-minimal',
        'moderate': 'insurance-style-moderate',
        'detailed': 'insurance-style-detailed',
        'custom': 'insurance-style-custom'
      },
      format: {
        'text': 'insurance-format-text',
        'visual': 'insurance-format-visual',
        'interactive': 'insurance-format-interactive',
        'mixed': 'insurance-format-mixed'
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

// Travel Insurance Props
interface TravelInsuranceProps extends VariantProps<typeof travelInsuranceVariants> {
  className?: string;
  onInsuranceUpdate?: (insurance: TravelInsuranceData) => void;
  initialInsurance?: Partial<TravelInsuranceData>;
  showComparison?: boolean;
  showCoverage?: boolean;
  showClaims?: boolean;
  showEmergency?: boolean;
}

// Travel Insurance Data Interface
interface TravelInsuranceData {
  id: string;
  tripId: string;
  tripName: string;
  searchCriteria: InsuranceSearchCriteria;
  searchResults: InsuranceResult[];
  selectedPolicies: SelectedPolicy[];
  purchases: InsurancePurchase[];
  claims: InsuranceClaim[];
  settings: TravelInsuranceSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Insurance Search Criteria Interface
interface InsuranceSearchCriteria {
  tripDetails: TripDetails;
  travelers: TravelerInfo[];
  coverageTypes: string[];
  coverageAmount: {
    medical: number;
    tripCancellation: number;
    baggage: number;
    currency: string;
  };
  deductible: number;
  preExistingConditions: boolean;
  adventureActivities: boolean;
  businessTravel: boolean;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  providerPreferences: string[];
}

// Trip Details Interface
interface TripDetails {
  destination: string;
  departureDate: Date;
  returnDate: Date;
  tripDuration: number; // in days
  tripCost: number;
  currency: string;
  tripType: 'leisure' | 'business' | 'adventure' | 'family' | 'senior';
  countries: string[];
}

// Traveler Info Interface
interface TravelerInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
  nationality: string;
  residence: string;
  preExistingConditions: string[];
  adventureActivities: string[];
  isPrimary: boolean;
}

// Insurance Result Interface
interface InsuranceResult {
  id: string;
  provider: InsuranceProvider;
  policy: InsurancePolicy;
  pricing: InsurancePricing;
  coverage: InsuranceCoverage;
  exclusions: InsuranceExclusion[];
  claims: ClaimsProcess;
  rating: {
    overall: number;
    coverage: number;
    claims: number;
    customerService: number;
    value: number;
    reviewCount: number;
  };
  reviews: InsuranceReview[];
  lastUpdated: Date;
}

// Insurance Provider Interface
interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  contact: {
    phone: string;
    email: string;
    website: string;
    emergencyHotline: string;
  };
  languages: string[];
  specialties: string[];
  financialRating: string;
  yearsInBusiness: number;
}

// Insurance Policy Interface
interface InsurancePolicy {
  id: string;
  name: string;
  type: 'basic' | 'standard' | 'comprehensive' | 'premium';
  description: string;
  validityPeriod: {
    startDate: Date;
    endDate: Date;
    maxDuration: number; // in days
  };
  ageLimits: {
    minAge: number;
    maxAge: number;
  };
  preExistingConditions: {
    covered: boolean;
    waitingPeriod: number; // in days
    additionalCost: number;
  };
  adventureActivities: {
    covered: boolean;
    activities: string[];
    additionalCost: number;
  };
  cancellationPolicy: string;
  refundPolicy: string;
}

// Insurance Pricing Interface
interface InsurancePricing {
  basePrice: number;
  totalPrice: number;
  currency: string;
  breakdown: PricingBreakdown;
  discounts: InsuranceDiscount[];
  paymentMethods: string[];
  paymentSchedule: 'single' | 'monthly' | 'annual';
  taxes: number;
  fees: {
    processingFee: number;
    serviceFee: number;
  };
}

// Pricing Breakdown Interface
interface PricingBreakdown {
  basePremium: number;
  ageAdjustment: number;
  destinationAdjustment: number;
  durationAdjustment: number;
  coverageAdjustment: number;
  preExistingConditionsFee: number;
  adventureActivitiesFee: number;
  taxes: number;
  fees: number;
  total: number;
}

// Insurance Discount Interface
interface InsuranceDiscount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'group';
  value: number;
  conditions: string[];
  validFrom: Date;
  validTo: Date;
}

// Insurance Coverage Interface
interface InsuranceCoverage {
  medical: MedicalCoverage;
  tripCancellation: TripCancellationCoverage;
  tripInterruption: TripInterruptionCoverage;
  baggage: BaggageCoverage;
  personalLiability: PersonalLiabilityCoverage;
  emergencyEvacuation: EmergencyEvacuationCoverage;
  adventureActivities: AdventureActivitiesCoverage;
  businessTravel: BusinessTravelCoverage;
}

// Medical Coverage Interface
interface MedicalCoverage {
  covered: boolean;
  limit: number;
  currency: string;
  deductible: number;
  copay: number;
  includes: string[];
  excludes: string[];
  emergencyCoverage: boolean;
  preExistingConditions: boolean;
}

// Trip Cancellation Coverage Interface
interface TripCancellationCoverage {
  covered: boolean;
  limit: number;
  currency: string;
  deductible: number;
  coveredReasons: string[];
  excludedReasons: string[];
  cancellationDeadline: number; // in days before trip
}

// Trip Interruption Coverage Interface
interface TripInterruptionCoverage {
  covered: boolean;
  limit: number;
  currency: string;
  deductible: number;
  coveredReasons: string[];
  excludedReasons: string[];
}

// Baggage Coverage Interface
interface BaggageCoverage {
  covered: boolean;
  limit: number;
  currency: string;
  deductible: number;
  perItemLimit: number;
  includes: string[];
  excludes: string[];
  delayCoverage: boolean;
  delayAmount: number;
}

// Personal Liability Coverage Interface
interface PersonalLiabilityCoverage {
  covered: boolean;
  limit: number;
  currency: string;
  deductible: number;
  includes: string[];
  excludes: string[];
}

// Emergency Evacuation Coverage Interface
interface EmergencyEvacuationCoverage {
  covered: boolean;
  limit: number;
  currency: string;
  deductible: number;
  includes: string[];
  excludes: string[];
}

// Adventure Activities Coverage Interface
interface AdventureActivitiesCoverage {
  covered: boolean;
  activities: string[];
  limit: number;
  currency: string;
  deductible: number;
  additionalCost: number;
}

// Business Travel Coverage Interface
interface BusinessTravelCoverage {
  covered: boolean;
  limit: number;
  currency: string;
  deductible: number;
  includes: string[];
  excludes: string[];
}

// Insurance Exclusion Interface
interface InsuranceExclusion {
  id: string;
  category: string;
  description: string;
  isImportant: boolean;
  examples: string[];
}

// Claims Process Interface
interface ClaimsProcess {
  process: string;
  requiredDocuments: string[];
  timeLimit: number; // in days
  contactMethods: string[];
  onlineClaims: boolean;
  averageProcessingTime: number; // in days
  emergencyContact: string;
}

// Insurance Review Interface
interface InsuranceReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  verified: boolean;
  helpful: number;
  policyType: string;
  claimExperience: boolean;
  travelerType: 'business' | 'leisure' | 'family' | 'solo' | 'couple' | 'group';
  photos: string[];
}

// Selected Policy Interface
interface SelectedPolicy {
  id: string;
  policyId: string;
  policy: InsuranceResult;
  travelers: TravelerInfo[];
  tripDetails: TripDetails;
  selectedCoverage: SelectedCoverage;
  totalPrice: number;
  currency: string;
  status: 'selected' | 'purchased' | 'active' | 'expired' | 'cancelled';
  createdAt: Date;
}

// Selected Coverage Interface
interface SelectedCoverage {
  medical: boolean;
  tripCancellation: boolean;
  tripInterruption: boolean;
  baggage: boolean;
  personalLiability: boolean;
  emergencyEvacuation: boolean;
  adventureActivities: boolean;
  businessTravel: boolean;
}

// Insurance Purchase Interface
interface InsurancePurchase {
  id: string;
  purchaseNumber: string;
  selectedPolicy: SelectedPolicy;
  contactInfo: ContactInfo;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'confirmed' | 'active' | 'cancelled' | 'expired';
  confirmationNumber: string;
  purchaseDate: Date;
  effectiveDate: Date;
  expiryDate: Date;
  totalAmount: number;
  currency: string;
  documents: InsuranceDocument[];
  notifications: InsuranceNotification[];
}

// Contact Info Interface
interface ContactInfo {
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// Payment Info Interface
interface PaymentInfo {
  method: 'credit-card' | 'debit-card' | 'paypal' | 'bank-transfer' | 'wallet';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  billingAddress?: ContactInfo['address'];
  transactionId?: string;
}

// Insurance Document Interface
interface InsuranceDocument {
  id: string;
  type: 'policy' | 'certificate' | 'receipt' | 'claim-form' | 'other';
  name: string;
  url: string;
  downloadDate: Date;
}

// Insurance Notification Interface
interface InsuranceNotification {
  id: string;
  type: 'confirmation' | 'reminder' | 'claim-update' | 'renewal' | 'emergency';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Insurance Claim Interface
interface InsuranceClaim {
  id: string;
  claimNumber: string;
  policyId: string;
  claimType: string;
  description: string;
  amount: number;
  currency: string;
  status: 'submitted' | 'under-review' | 'approved' | 'denied' | 'paid';
  submittedDate: Date;
  resolvedDate?: Date;
  documents: ClaimDocument[];
  notes: string[];
}

// Claim Document Interface
interface ClaimDocument {
  id: string;
  type: 'receipt' | 'medical-report' | 'police-report' | 'photo' | 'other';
  name: string;
  url: string;
  uploadDate: Date;
}

// Travel Insurance Settings Interface
interface TravelInsuranceSettings {
  preferredProviders: string[];
  preferredPolicyTypes: string[];
  coveragePreferences: {
    medical: boolean;
    tripCancellation: boolean;
    baggage: boolean;
    personalLiability: boolean;
  };
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  deductiblePreference: number;
  notifications: {
    renewalReminders: boolean;
    claimUpdates: boolean;
    emergencyAlerts: boolean;
    policyChanges: boolean;
  };
}

// Travel Insurance Component
export const TravelInsurance = React.forwardRef<HTMLDivElement, TravelInsuranceProps>(
  ({ 
    className, 
    onInsuranceUpdate,
    initialInsurance,
    showComparison = true,
    showCoverage = true,
    showClaims = true,
    showEmergency = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [insurance, setInsurance] = useState<TravelInsuranceData>(
      initialInsurance || {
        id: '',
        tripId: '',
        tripName: '',
        searchCriteria: {
          tripDetails: {
            destination: '',
            departureDate: new Date(),
            returnDate: new Date(),
            tripDuration: 7,
            tripCost: 1000,
            currency: 'USD',
            tripType: 'leisure',
            countries: []
          },
          travelers: [],
          coverageTypes: [],
          coverageAmount: {
            medical: 100000,
            tripCancellation: 5000,
            baggage: 2500,
            currency: 'USD'
          },
          deductible: 100,
          preExistingConditions: false,
          adventureActivities: false,
          businessTravel: false,
          priceRange: { min: 0, max: 500, currency: 'USD' },
          providerPreferences: []
        },
        searchResults: [],
        selectedPolicies: [],
        purchases: [],
        claims: [],
        settings: {
          preferredProviders: [],
          preferredPolicyTypes: [],
          coveragePreferences: {
            medical: true,
            tripCancellation: true,
            baggage: true,
            personalLiability: true
          },
          priceRange: { min: 0, max: 500, currency: 'USD' },
          deductiblePreference: 100,
          notifications: {
            renewalReminders: true,
            claimUpdates: true,
            emergencyAlerts: true,
            policyChanges: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('search');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<string>('');
    const [comparisonMode, setComparisonMode] = useState(false);

    const tabs = [
      { id: 'search', name: 'Search', icon: '🔍' },
      { id: 'results', name: 'Results', icon: '🛡️' },
      { id: 'comparison', name: 'Comparison', icon: '⚖️' },
      { id: 'purchases', name: 'Policies', icon: '📋' },
      { id: 'claims', name: 'Claims', icon: '📝' }
    ];

    const policyTypes = [
      { id: 'basic', name: 'Basic', icon: '🛡️', color: 'blue' },
      { id: 'standard', name: 'Standard', icon: '🛡️', color: 'green' },
      { id: 'comprehensive', name: 'Comprehensive', icon: '🛡️', color: 'purple' },
      { id: 'premium', name: 'Premium', icon: '🛡️', color: 'gold' }
    ];

    const coverageTypes = [
      { id: 'medical', name: 'Medical', icon: '🏥', color: 'red' },
      { id: 'trip-cancellation', name: 'Trip Cancellation', icon: '❌', color: 'orange' },
      { id: 'baggage', name: 'Baggage', icon: '🧳', color: 'blue' },
      { id: 'personal-liability', name: 'Personal Liability', icon: '⚖️', color: 'purple' },
      { id: 'emergency-evacuation', name: 'Emergency Evacuation', icon: '🚁', color: 'green' },
      { id: 'adventure-activities', name: 'Adventure Activities', icon: '🏔️', color: 'yellow' }
    ];

    const providers = [
      { id: 'allianz', name: 'Allianz Travel', logo: '🛡️', color: 'blue' },
      { id: 'worldnomads', name: 'World Nomads', logo: '🌍', color: 'green' },
      { id: 'travelex', name: 'Travelex', logo: '✈️', color: 'red' },
      { id: 'seven-corners', name: 'Seven Corners', logo: '🗺️', color: 'purple' },
      { id: 'hth', name: 'HTH Worldwide', logo: '🏥', color: 'orange' },
      { id: 'imglobal', name: 'IMG Global', logo: '🌐', color: 'cyan' }
    ];

    const updateInsurance = useCallback((path: string, value: any) => {
      setInsurance(prev => {
        const newInsurance = { ...prev };
        const keys = path.split('.');
        let current: any = newInsurance;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newInsurance.updatedAt = new Date();
        onInsuranceUpdate?.(newInsurance);
        return newInsurance;
      });
    }, [onInsuranceUpdate]);

    const searchInsurance = useCallback(() => {
      setIsSearching(true);
      // Simulate insurance search
      setTimeout(() => {
        const mockResults: InsuranceResult[] = [
          {
            id: 'insurance-1',
            provider: {
              id: 'provider-1',
              name: 'Allianz Travel',
              logo: '🛡️',
              description: 'Comprehensive travel insurance with 24/7 emergency assistance',
              rating: 4.5,
              reviewCount: 2500,
              verified: true,
              contact: {
                phone: '+1-800-284-8300',
                email: 'info@allianztravel.com',
                website: 'https://allianztravel.com',
                emergencyHotline: '+1-800-284-8300'
              },
              languages: ['en', 'es', 'fr', 'de'],
              specialties: ['comprehensive', 'medical', 'emergency'],
              financialRating: 'A+',
              yearsInBusiness: 25
            },
            policy: {
              id: 'policy-1',
              name: 'Comprehensive Travel Protection',
              type: 'comprehensive',
              description: 'Complete travel protection with medical, trip cancellation, and baggage coverage',
              validityPeriod: {
                startDate: new Date(),
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                maxDuration: 365
              },
              ageLimits: {
                minAge: 0,
                maxAge: 80
              },
              preExistingConditions: {
                covered: true,
                waitingPeriod: 0,
                additionalCost: 0
              },
              adventureActivities: {
                covered: true,
                activities: ['hiking', 'skiing', 'scuba-diving'],
                additionalCost: 50
              },
              cancellationPolicy: 'Free cancellation up to 15 days before trip',
              refundPolicy: 'Pro-rated refund for unused coverage'
            },
            pricing: {
              basePrice: 89,
              totalPrice: 89,
              currency: 'USD',
              breakdown: {
                basePremium: 75,
                ageAdjustment: 0,
                destinationAdjustment: 10,
                durationAdjustment: 4,
                coverageAdjustment: 0,
                preExistingConditionsFee: 0,
                adventureActivitiesFee: 0,
                taxes: 0,
                fees: 0,
                total: 89
              },
              discounts: [],
              paymentMethods: ['credit-card', 'paypal'],
              paymentSchedule: 'single',
              taxes: 0,
              fees: {
                processingFee: 0,
                serviceFee: 0
              }
            },
            coverage: {
              medical: {
                covered: true,
                limit: 100000,
                currency: 'USD',
                deductible: 0,
                copay: 0,
                includes: ['emergency medical', 'hospitalization', 'prescription drugs'],
                excludes: ['pre-existing conditions', 'routine care'],
                emergencyCoverage: true,
                preExistingConditions: false
              },
              tripCancellation: {
                covered: true,
                limit: 5000,
                currency: 'USD',
                deductible: 0,
                coveredReasons: ['illness', 'death', 'weather', 'job loss'],
                excludedReasons: ['change of mind', 'financial hardship'],
                cancellationDeadline: 15
              },
              tripInterruption: {
                covered: true,
                limit: 5000,
                currency: 'USD',
                deductible: 0,
                coveredReasons: ['illness', 'death', 'weather'],
                excludedReasons: ['change of mind']
              },
              baggage: {
                covered: true,
                limit: 2500,
                currency: 'USD',
                deductible: 0,
                perItemLimit: 500,
                includes: ['lost luggage', 'stolen items', 'damaged items'],
                excludes: ['valuables', 'electronics'],
                delayCoverage: true,
                delayAmount: 100
              },
              personalLiability: {
                covered: true,
                limit: 100000,
                currency: 'USD',
                deductible: 0,
                includes: ['bodily injury', 'property damage'],
                excludes: ['intentional acts', 'business activities']
              },
              emergencyEvacuation: {
                covered: true,
                limit: 500000,
                currency: 'USD',
                deductible: 0,
                includes: ['medical evacuation', 'repatriation'],
                excludes: ['non-medical evacuation']
              },
              adventureActivities: {
                covered: true,
                activities: ['hiking', 'skiing', 'scuba-diving'],
                limit: 100000,
                currency: 'USD',
                deductible: 0,
                additionalCost: 50
              },
              businessTravel: {
                covered: false,
                limit: 0,
                currency: 'USD',
                deductible: 0,
                includes: [],
                excludes: []
              }
            },
            exclusions: [],
            claims: {
              process: 'Online claims submission with document upload',
              requiredDocuments: ['receipts', 'medical reports', 'police reports'],
              timeLimit: 90,
              contactMethods: ['online', 'phone', 'email'],
              onlineClaims: true,
              averageProcessingTime: 14,
              emergencyContact: '+1-800-284-8300'
            },
            rating: {
              overall: 4.5,
              coverage: 4.6,
              claims: 4.3,
              customerService: 4.4,
              value: 4.5,
              reviewCount: 2500
            },
            reviews: [],
            lastUpdated: new Date()
          }
        ];
        updateInsurance('searchResults', mockResults);
        setIsSearching(false);
      }, 2000);
    }, [updateInsurance]);

    const selectPolicy = useCallback((policyId: string) => {
      const policy = insurance.searchResults.find(p => p.id === policyId);
      if (!policy) return;

      const selectedPolicy: SelectedPolicy = {
        id: `selected-${Date.now()}`,
        policyId: policy.id,
        policy: policy,
        travelers: insurance.searchCriteria.travelers,
        tripDetails: insurance.searchCriteria.tripDetails,
        selectedCoverage: {
          medical: true,
          tripCancellation: true,
          tripInterruption: true,
          baggage: true,
          personalLiability: true,
          emergencyEvacuation: true,
          adventureActivities: insurance.searchCriteria.adventureActivities,
          businessTravel: insurance.searchCriteria.businessTravel
        },
        totalPrice: policy.pricing.totalPrice,
        currency: policy.pricing.currency,
        status: 'selected',
        createdAt: new Date()
      };
      updateInsurance('selectedPolicies', [...insurance.selectedPolicies, selectedPolicy]);
    }, [insurance.searchResults, insurance.selectedPolicies, insurance.searchCriteria, updateInsurance]);

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

    const getPolicyTypeIcon = (type: string) => {
      const policyType = policyTypes.find(t => t.id === type);
      return policyType?.icon || '🛡️';
    };

    const getPolicyTypeName = (type: string) => {
      const policyType = policyTypes.find(t => t.id === type);
      return policyType?.name || type;
    };

    const getCoverageTypeIcon = (type: string) => {
      const coverageType = coverageTypes.find(t => t.id === type);
      return coverageType?.icon || '🛡️';
    };

    const getCoverageTypeName = (type: string) => {
      const coverageType = coverageTypes.find(t => t.id === type);
      return coverageType?.name || type;
    };

    const getProviderLogo = (providerId: string) => {
      const provider = providers.find(p => p.id === providerId);
      return provider?.logo || '🛡️';
    };

    const getProviderName = (providerId: string) => {
      const provider = providers.find(p => p.id === providerId);
      return provider?.name || providerId;
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          travelInsuranceVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Travel Insurance
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Protect your trip with comprehensive travel insurance
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              🚨 Emergency
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              📋 My Policies
            </button>
          </div>
        </div>

        {/* Insurance Search */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Travel Insurance
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Destination
              </label>
              <input
                type="text"
                value={insurance.searchCriteria.tripDetails.destination}
                onChange={(e) => updateInsurance('searchCriteria.tripDetails.destination', e.target.value)}
                placeholder="Country or region"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Departure Date
              </label>
              <input
                type="date"
                value={insurance.searchCriteria.tripDetails.departureDate.toISOString().split('T')[0]}
                onChange={(e) => updateInsurance('searchCriteria.tripDetails.departureDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Return Date
              </label>
              <input
                type="date"
                value={insurance.searchCriteria.tripDetails.returnDate.toISOString().split('T')[0]}
                onChange={(e) => updateInsurance('searchCriteria.tripDetails.returnDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trip Cost
              </label>
              <input
                type="number"
                value={insurance.searchCriteria.tripDetails.tripCost}
                onChange={(e) => updateInsurance('searchCriteria.tripDetails.tripCost', parseInt(e.target.value))}
                placeholder="Total trip cost"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Coverage Types
              </label>
              <div className="flex flex-wrap gap-1">
                {coverageTypes.slice(0, 4).map((coverageType) => (
                  <button
                    key={coverageType.id}
                    onClick={() => {
                      const currentTypes = insurance.searchCriteria.coverageTypes;
                      const newTypes = currentTypes.includes(coverageType.id)
                        ? currentTypes.filter(t => t !== coverageType.id)
                        : [...currentTypes, coverageType.id];
                      updateInsurance('searchCriteria.coverageTypes', newTypes);
                    }}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                      insurance.searchCriteria.coverageTypes.includes(coverageType.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    )}
                  >
                    {coverageType.icon} {coverageType.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medical Coverage
              </label>
              <input
                type="number"
                value={insurance.searchCriteria.coverageAmount.medical}
                onChange={(e) => updateInsurance('searchCriteria.coverageAmount.medical', parseInt(e.target.value))}
                placeholder="Medical limit"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={insurance.searchCriteria.priceRange.min}
                  onChange={(e) => updateInsurance('searchCriteria.priceRange.min', parseInt(e.target.value))}
                  placeholder="Min"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                />
                <input
                  type="number"
                  value={insurance.searchCriteria.priceRange.max}
                  onChange={(e) => updateInsurance('searchCriteria.priceRange.max', parseInt(e.target.value))}
                  placeholder="Max"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={insurance.searchCriteria.preExistingConditions}
                onChange={(e) => updateInsurance('searchCriteria.preExistingConditions', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Pre-existing conditions</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={insurance.searchCriteria.adventureActivities}
                onChange={(e) => updateInsurance('searchCriteria.adventureActivities', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Adventure activities</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={insurance.searchCriteria.businessTravel}
                onChange={(e) => updateInsurance('searchCriteria.businessTravel', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Business travel</span>
            </label>
          </div>
          
          <button
            onClick={searchInsurance}
            disabled={isSearching}
            className={cn(
              'w-full px-4 py-2 rounded-md transition-colors duration-200',
              isSearching
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isSearching ? '🔍 Searching...' : '🔍 Search Insurance'}
          </button>
        </div>

        {/* Insurance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {insurance.searchResults.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Search Results</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {insurance.selectedPolicies.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Selected</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {insurance.purchases.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Policies</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {insurance.claims.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Claims</div>
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
          {activeTab === 'results' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Insurance Results
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {insurance.searchResults.length} policies found
                </div>
              </div>
              
              <div className="space-y-3">
                {insurance.searchResults.map((policy) => (
                  <div key={policy.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{policy.provider.logo}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {policy.provider.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {policy.policy.name} • {getPolicyTypeName(policy.policy.type)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {policy.provider.financialRating} • {policy.provider.yearsInBusiness} years
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(policy.pricing.totalPrice, policy.pricing.currency)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          total premium
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Coverage Includes:</h5>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Medical: {formatCurrency(policy.coverage.medical.limit, policy.coverage.medical.currency)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Trip Cancellation: {formatCurrency(policy.coverage.tripCancellation.limit, policy.coverage.tripCancellation.currency)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Baggage: {formatCurrency(policy.coverage.baggage.limit, policy.coverage.baggage.currency)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Policy Details:</h5>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex justify-between">
                            <span>Age Range:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {policy.policy.ageLimits.minAge}-{policy.policy.ageLimits.maxAge} years
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Max Duration:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {policy.policy.validityPeriod.maxDuration} days
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rating:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {policy.rating.overall}/5 ({policy.rating.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {policy.coverage.medical.covered && (
                          <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-md">
                            🏥 Medical
                          </span>
                        )}
                        {policy.coverage.tripCancellation.covered && (
                          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-md">
                            ❌ Trip Cancellation
                          </span>
                        )}
                        {policy.coverage.baggage.covered && (
                          <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-md">
                            🧳 Baggage
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                          Details
                        </button>
                        <button
                          onClick={() => selectPolicy(policy.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                My Policies
              </h3>
              
              {insurance.purchases.length > 0 ? (
                <div className="space-y-3">
                  {insurance.purchases.map((purchase) => (
                    <div key={purchase.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{purchase.selectedPolicy.policy.provider.logo}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {purchase.selectedPolicy.policy.provider.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Policy: {purchase.purchaseNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(purchase.totalAmount, purchase.currency)}
                          </div>
                          <div className={cn(
                            'text-sm font-medium',
                            purchase.status === 'active' ? 'text-green-600 dark:text-green-400' :
                            purchase.status === 'confirmed' ? 'text-blue-600 dark:text-blue-400' :
                            purchase.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          )}>
                            {purchase.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <div className="flex justify-between">
                            <span>Effective Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(purchase.effectiveDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expiry Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(purchase.expiryDate)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Destination:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {purchase.selectedPolicy.tripDetails.destination}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Purchase Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(purchase.purchaseDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🛡️</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No policies yet
                  </h3>
                  <p>Search and purchase travel insurance to see them here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'claims' && showClaims && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Claims
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No claims yet
                </h3>
                <p>File a claim if you need to use your travel insurance</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

TravelInsurance.displayName = 'TravelInsurance';

// Travel Insurance Demo Component
interface TravelInsuranceDemoProps {
  className?: string;
  showControls?: boolean;
}

export const TravelInsuranceDemo = React.forwardRef<HTMLDivElement, TravelInsuranceDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [insurance, setInsurance] = useState<Partial<TravelInsuranceData>>({});

    const handleInsuranceUpdate = (updatedInsurance: TravelInsuranceData) => {
      setInsurance(updatedInsurance);
      console.log('Travel insurance updated:', updatedInsurance);
    };

    const mockInsurance: Partial<TravelInsuranceData> = {
      id: 'travel-insurance-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      searchCriteria: {
        tripDetails: {
          destination: 'France',
          departureDate: new Date('2024-06-15'),
          returnDate: new Date('2024-06-22'),
          tripDuration: 7,
          tripCost: 2000,
          currency: 'USD',
          tripType: 'leisure',
          countries: ['France']
        },
        travelers: [],
        coverageTypes: [],
        coverageAmount: {
          medical: 100000,
          tripCancellation: 5000,
          baggage: 2500,
          currency: 'USD'
        },
        deductible: 100,
        preExistingConditions: false,
        adventureActivities: false,
        businessTravel: false,
        priceRange: { min: 0, max: 200, currency: 'USD' },
        providerPreferences: []
      },
      searchResults: [],
      selectedPolicies: [],
      purchases: [],
      claims: [],
      settings: {
        preferredProviders: [],
        preferredPolicyTypes: [],
        coveragePreferences: {
          medical: true,
          tripCancellation: true,
          baggage: true,
          personalLiability: true
        },
        priceRange: { min: 0, max: 200, currency: 'USD' },
        deductiblePreference: 100,
        notifications: {
          renewalReminders: true,
          claimUpdates: true,
          emergencyAlerts: true,
          policyChanges: true
        }
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
          Travel Insurance Demo
        </h3>
        
        <TravelInsurance
          onInsuranceUpdate={handleInsuranceUpdate}
          initialInsurance={mockInsurance}
          showComparison={true}
          showCoverage={true}
          showClaims={true}
          showEmergency={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive travel insurance comparison and purchase with coverage details, claims management, and emergency assistance.
            </p>
          </div>
        )}
      </div>
    );
  }
);

TravelInsuranceDemo.displayName = 'TravelInsuranceDemo';

// Export all components
export {
  travelInsuranceVariants,
  type TravelInsuranceProps,
  type TravelInsuranceData,
  type InsuranceSearchCriteria,
  type TripDetails,
  type TravelerInfo,
  type InsuranceResult,
  type InsuranceProvider,
  type InsurancePolicy,
  type InsurancePricing,
  type PricingBreakdown,
  type InsuranceDiscount,
  type InsuranceCoverage,
  type MedicalCoverage,
  type TripCancellationCoverage,
  type TripInterruptionCoverage,
  type BaggageCoverage,
  type PersonalLiabilityCoverage,
  type EmergencyEvacuationCoverage,
  type AdventureActivitiesCoverage,
  type BusinessTravelCoverage,
  type InsuranceExclusion,
  type ClaimsProcess,
  type InsuranceReview,
  type SelectedPolicy,
  type SelectedCoverage,
  type InsurancePurchase,
  type ContactInfo,
  type PaymentInfo,
  type InsuranceDocument,
  type InsuranceNotification,
  type InsuranceClaim,
  type ClaimDocument,
  type TravelInsuranceSettings,
  type TravelInsuranceDemoProps
};
