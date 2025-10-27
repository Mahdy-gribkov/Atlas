/**
 * Travel Insurance Component
 * 
 * Provides travel insurance comparison and management for Atlas travel agent.
 * Implements insurance comparison, policy management, and claims processing.
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
        'comprehensive': 'insurance-type-comprehensive',
        'basic': 'insurance-type-basic',
        'medical': 'insurance-type-medical',
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
  onInsuranceUpdate?: (insurance: InsuranceData) => void;
  initialInsurance?: Partial<InsuranceData>;
  showComparison?: boolean;
  showClaims?: boolean;
  showPolicies?: boolean;
  showRecommendations?: boolean;
}

// Insurance Data Interface
interface InsuranceData {
  id: string;
  tripId: string;
  tripName: string;
  policies: InsurancePolicy[];
  comparisons: InsuranceComparison[];
  claims: InsuranceClaim[];
  recommendations: InsuranceRecommendation[];
  settings: InsuranceSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Insurance Policy Interface
interface InsurancePolicy {
  id: string;
  provider: string;
  policyName: string;
  type: 'comprehensive' | 'basic' | 'medical' | 'cancellation' | 'baggage' | 'adventure';
  description: string;
  coverage: PolicyCoverage;
  pricing: PolicyPricing;
  terms: PolicyTerms;
  benefits: PolicyBenefit[];
  exclusions: PolicyExclusion[];
  documents: PolicyDocument[];
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: Date;
  endDate: Date;
  purchasedAt: Date;
  policyNumber: string;
  contact: PolicyContact;
  rating: number;
  reviewCount: number;
  isRecommended: boolean;
  recommendationScore: number;
}

// Policy Coverage Interface
interface PolicyCoverage {
  medical: {
    emergency: number;
    routine: number;
    dental: number;
    evacuation: number;
    currency: string;
  };
  tripCancellation: {
    covered: boolean;
    amount: number;
    currency: string;
    reasons: string[];
  };
  tripInterruption: {
    covered: boolean;
    amount: number;
    currency: string;
    reasons: string[];
  };
  baggage: {
    personal: number;
    business: number;
    currency: string;
    delay: number;
  };
  personalLiability: {
    amount: number;
    currency: string;
    coverage: string[];
  };
  adventure: {
    activities: string[];
    coverage: number;
    currency: string;
  };
}

// Policy Pricing Interface
interface PolicyPricing {
  basePrice: number;
  currency: string;
  pricingModel: 'per-trip' | 'per-day' | 'annual';
  discounts: PricingDiscount[];
  fees: PricingFee[];
  totalPrice: number;
  paymentOptions: string[];
}

// Pricing Discount Interface
interface PricingDiscount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'early-bird' | 'group';
  value: number;
  conditions: string[];
  validUntil: Date;
}

// Pricing Fee Interface
interface PricingFee {
  id: string;
  name: string;
  amount: number;
  type: 'mandatory' | 'optional' | 'processing';
  description: string;
}

// Policy Terms Interface
interface PolicyTerms {
  deductible: number;
  currency: string;
  maxAge: number;
  minAge: number;
  preExistingConditions: {
    covered: boolean;
    waitingPeriod: number;
    conditions: string[];
  };
  cancellationPolicy: string;
  refundPolicy: string;
  claimProcess: string;
  emergencyContact: string;
  validCountries: string[];
  restrictions: string[];
}

// Policy Benefit Interface
interface PolicyBenefit {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  category: 'medical' | 'travel' | 'personal' | 'adventure';
  isIncluded: boolean;
  conditions: string[];
}

// Policy Exclusion Interface
interface PolicyExclusion {
  id: string;
  name: string;
  description: string;
  category: 'medical' | 'travel' | 'personal' | 'adventure';
  isStandard: boolean;
  alternatives: string[];
}

// Policy Document Interface
interface PolicyDocument {
  id: string;
  name: string;
  type: 'policy' | 'certificate' | 'terms' | 'claim-form' | 'other';
  url: string;
  uploadedAt: Date;
  size: number;
}

// Policy Contact Interface
interface PolicyContact {
  phone: string;
  email: string;
  website: string;
  emergencyPhone: string;
  hours: string;
  languages: string[];
}

// Insurance Comparison Interface
interface InsuranceComparison {
  id: string;
  name: string;
  policies: string[];
  criteria: ComparisonCriteria[];
  results: ComparisonResult[];
  createdAt: Date;
}

// Comparison Criteria Interface
interface ComparisonCriteria {
  id: string;
  name: string;
  weight: number;
  category: 'coverage' | 'price' | 'service' | 'reputation';
}

// Comparison Result Interface
interface ComparisonResult {
  policyId: string;
  score: number;
  ranking: number;
  highlights: string[];
  concerns: string[];
}

// Insurance Claim Interface
interface InsuranceClaim {
  id: string;
  policyId: string;
    policyName: string;
  type: 'medical' | 'cancellation' | 'baggage' | 'delay' | 'other';
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'paid';
  submittedAt: Date;
  resolvedAt?: Date;
  documents: ClaimDocument[];
  notes: string;
  claimNumber: string;
  adjuster?: string;
  updates: ClaimUpdate[];
}

// Claim Document Interface
interface ClaimDocument {
  id: string;
  name: string;
  type: 'receipt' | 'medical-report' | 'police-report' | 'other';
  url: string;
  uploadedAt: Date;
}

// Claim Update Interface
interface ClaimUpdate {
  id: string;
  date: Date;
  status: string;
  message: string;
  updatedBy: string;
}

// Insurance Recommendation Interface
interface InsuranceRecommendation {
  id: string;
  policyId: string;
  reason: string;
  score: number;
  category: 'coverage' | 'price' | 'service' | 'reputation';
  isPersonalized: boolean;
  alternatives: string[];
  createdAt: Date;
}

// Insurance Settings Interface
interface InsuranceSettings {
  autoRenewal: boolean;
  notifications: boolean;
  preferredProviders: string[];
  budgetLimit: number;
  currency: string;
  coveragePreferences: string[];
  excludeProviders: string[];
  alertThresholds: {
    priceIncrease: number;
    coverageChange: boolean;
    expiryReminder: number;
  };
}

// Travel Insurance Component
export const TravelInsurance = React.forwardRef<HTMLDivElement, TravelInsuranceProps>(
  ({ 
    className, 
    onInsuranceUpdate,
    initialInsurance,
    showComparison = true,
    showClaims = true,
    showPolicies = true,
    showRecommendations = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [insurance, setInsurance] = useState<InsuranceData>(
      initialInsurance || {
        id: '',
        tripId: '',
        tripName: '',
        policies: [],
        comparisons: [],
        claims: [],
        recommendations: [],
        settings: {
          autoRenewal: false,
          notifications: true,
          preferredProviders: [],
          budgetLimit: 1000,
          currency: 'USD',
          coveragePreferences: [],
          excludeProviders: [],
          alertThresholds: {
            priceIncrease: 20,
            coverageChange: true,
            expiryReminder: 30
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('policies');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<string>('');
    const [comparisonMode, setComparisonMode] = useState(false);

    const tabs = [
      { id: 'policies', name: 'Policies', icon: '📋' },
      { id: 'comparison', name: 'Comparison', icon: '⚖️' },
      { id: 'claims', name: 'Claims', icon: '📝' },
      { id: 'recommendations', name: 'Recommendations', icon: '💡' },
      { id: 'settings', name: 'Settings', icon: '⚙️' }
    ];

    const policyTypes = [
      { id: 'comprehensive', name: 'Comprehensive', icon: '🛡️', color: 'blue' },
      { id: 'basic', name: 'Basic', icon: '📄', color: 'green' },
      { id: 'medical', name: 'Medical', icon: '🏥', color: 'red' },
      { id: 'cancellation', name: 'Cancellation', icon: '❌', color: 'orange' },
      { id: 'baggage', name: 'Baggage', icon: '🧳', color: 'purple' },
      { id: 'adventure', name: 'Adventure', icon: '🏔️', color: 'yellow' }
    ];

    const claimTypes = [
      { id: 'medical', name: 'Medical', icon: '🏥', color: 'red' },
      { id: 'cancellation', name: 'Cancellation', icon: '❌', color: 'orange' },
      { id: 'baggage', name: 'Baggage', icon: '🧳', color: 'purple' },
      { id: 'delay', name: 'Delay', icon: '⏰', color: 'yellow' },
      { id: 'other', name: 'Other', icon: '📝', color: 'gray' }
    ];

    const claimStatuses = [
      { id: 'submitted', name: 'Submitted', color: 'blue' },
      { id: 'under-review', name: 'Under Review', color: 'yellow' },
      { id: 'approved', name: 'Approved', color: 'green' },
      { id: 'rejected', name: 'Rejected', color: 'red' },
      { id: 'paid', name: 'Paid', color: 'green' }
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

    const addPolicy = useCallback(() => {
      const newPolicy: InsurancePolicy = {
        id: `policy-${Date.now()}`,
        provider: '',
        policyName: '',
        type: 'comprehensive',
        description: '',
        coverage: {
          medical: {
            emergency: 0,
            routine: 0,
            dental: 0,
            evacuation: 0,
            currency: 'USD'
          },
          tripCancellation: {
            covered: false,
            amount: 0,
            currency: 'USD',
            reasons: []
          },
          tripInterruption: {
            covered: false,
            amount: 0,
            currency: 'USD',
            reasons: []
          },
          baggage: {
            personal: 0,
            business: 0,
            currency: 'USD',
            delay: 0
          },
          personalLiability: {
            amount: 0,
            currency: 'USD',
            coverage: []
          },
          adventure: {
            activities: [],
            coverage: 0,
            currency: 'USD'
          }
        },
        pricing: {
          basePrice: 0,
          currency: 'USD',
          pricingModel: 'per-trip',
          discounts: [],
          fees: [],
          totalPrice: 0,
          paymentOptions: []
        },
        terms: {
          deductible: 0,
          currency: 'USD',
          maxAge: 99,
          minAge: 0,
          preExistingConditions: {
            covered: false,
            waitingPeriod: 0,
            conditions: []
          },
          cancellationPolicy: '',
          refundPolicy: '',
          claimProcess: '',
          emergencyContact: '',
          validCountries: [],
          restrictions: []
        },
        benefits: [],
        exclusions: [],
        documents: [],
        status: 'pending',
        startDate: new Date(),
        endDate: new Date(),
        purchasedAt: new Date(),
        policyNumber: '',
        contact: {
          phone: '',
          email: '',
          website: '',
          emergencyPhone: '',
          hours: '',
          languages: []
        },
        rating: 0,
        reviewCount: 0,
        isRecommended: false,
        recommendationScore: 0
      };
      updateInsurance('policies', [...insurance.policies, newPolicy]);
    }, [insurance.policies, updateInsurance]);

    const addClaim = useCallback(() => {
      const newClaim: InsuranceClaim = {
        id: `claim-${Date.now()}`,
        policyId: '',
        policyName: '',
        type: 'medical',
        title: '',
        description: '',
        amount: 0,
        currency: 'USD',
        status: 'submitted',
        submittedAt: new Date(),
        documents: [],
        notes: '',
        claimNumber: '',
        updates: []
      };
      updateInsurance('claims', [...insurance.claims, newClaim]);
    }, [insurance.claims, updateInsurance]);

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

    const getPolicyTypeIcon = (type: InsurancePolicy['type']) => {
      const policyType = policyTypes.find(t => t.id === type);
      return policyType?.icon || '📋';
    };

    const getPolicyTypeName = (type: InsurancePolicy['type']) => {
      const policyType = policyTypes.find(t => t.id === type);
      return policyType?.name || type;
    };

    const getPolicyTypeColor = (type: InsurancePolicy['type']) => {
      const policyType = policyTypes.find(t => t.id === type);
      return policyType?.color || 'gray';
    };

    const getClaimTypeIcon = (type: InsuranceClaim['type']) => {
      const claimType = claimTypes.find(t => t.id === type);
      return claimType?.icon || '📝';
    };

    const getClaimStatusColor = (status: InsuranceClaim['status']) => {
      const claimStatus = claimStatuses.find(s => s.id === status);
      return claimStatus?.color || 'gray';
    };

    const getStatusColor = (status: InsurancePolicy['status']) => {
      switch (status) {
        case 'active': return 'text-green-600 dark:text-green-400';
        case 'expired': return 'text-red-600 dark:text-red-400';
        case 'cancelled': return 'text-gray-600 dark:text-gray-400';
        case 'pending': return 'text-yellow-600 dark:text-yellow-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const calculatePolicyScore = (policy: InsurancePolicy) => {
      let score = 0;
      
      // Coverage score
      if (policy.coverage.medical.emergency > 100000) score += 25;
      if (policy.coverage.tripCancellation.covered) score += 20;
      if (policy.coverage.baggage.personal > 1000) score += 15;
      
      // Price score (lower is better)
      if (policy.pricing.totalPrice < 100) score += 20;
      else if (policy.pricing.totalPrice < 200) score += 15;
      else if (policy.pricing.totalPrice < 300) score += 10;
      
      // Rating score
      score += policy.rating * 4;
      
      return Math.min(score, 100);
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
              Manage your {insurance.tripName || 'trip'} insurance
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              📊 Compare
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              🛡️ Get Quote
            </button>
          </div>
        </div>

        {/* Insurance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {insurance.policies.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Policies</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {insurance.policies.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {insurance.claims.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Claims</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {insurance.claims.filter(c => c.status === 'paid').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Paid Claims</div>
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
          {activeTab === 'policies' && showPolicies && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Insurance Policies
                </h3>
                <button
                  onClick={addPolicy}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  ➕ Add Policy
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insurance.policies.map((policy) => (
                  <div key={policy.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getPolicyTypeIcon(policy.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {policy.policyName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {policy.provider}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {policy.rating}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {policy.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {getPolicyTypeName(policy.type)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(policy.pricing.totalPrice, policy.pricing.currency)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={cn('font-medium', getStatusColor(policy.status))}>
                          {policy.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Valid:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
                        </span>
                      </div>
                    </div>
                    
                    {policy.isRecommended && (
                      <div className="mt-3">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                          🎯 Recommended
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        Score: {calculatePolicyScore(policy)}/100
                      </div>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comparison' && showComparison && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Policy Comparison
              </h3>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">⚖️</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Policy comparison coming soon
                  </h3>
                  <p>Compare different insurance policies side by side</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'claims' && showClaims && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Insurance Claims
                </h3>
                <button
                  onClick={addClaim}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  📝 File Claim
                </button>
              </div>
              
              <div className="space-y-3">
                {insurance.claims.map((claim) => (
                  <div key={claim.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getClaimTypeIcon(claim.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {claim.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {claim.policyName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-md',
                          `bg-${getClaimStatusColor(claim.status)}-100 text-${getClaimStatusColor(claim.status)}-800 dark:bg-${getClaimStatusColor(claim.status)}-900 dark:text-${getClaimStatusColor(claim.status)}-200`
                        )}>
                          {claim.status}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {claim.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <span>Amount: {formatCurrency(claim.amount, claim.currency)}</span>
                        <span>Submitted: {formatDate(claim.submittedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Claim #: {claim.claimNumber}</span>
                        <span>Documents: {claim.documents.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && showRecommendations && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Insurance Recommendations
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Personalized recommendations coming soon
                </h3>
                <p>Get AI-powered insurance recommendations based on your trip</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Insurance Settings
              </h3>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Budget Limit
                    </label>
                    <input
                      type="number"
                      value={insurance.settings.budgetLimit}
                      onChange={(e) => updateInsurance('settings.budgetLimit', parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={insurance.settings.currency}
                      onChange={(e) => updateInsurance('settings.currency', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                      <option value="AUD">AUD</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={insurance.settings.autoRenewal}
                      onChange={(e) => updateInsurance('settings.autoRenewal', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Auto-renewal</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={insurance.settings.notifications}
                      onChange={(e) => updateInsurance('settings.notifications', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Notifications</span>
                  </label>
                </div>
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
    const [insurance, setInsurance] = useState<Partial<InsuranceData>>({});

    const handleInsuranceUpdate = (updatedInsurance: InsuranceData) => {
      setInsurance(updatedInsurance);
      console.log('Insurance updated:', updatedInsurance);
    };

    const mockInsurance: Partial<InsuranceData> = {
      id: 'insurance-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      policies: [],
      comparisons: [],
      claims: [],
      recommendations: [],
      settings: {
        autoRenewal: false,
        notifications: true,
        preferredProviders: [],
        budgetLimit: 500,
        currency: 'USD',
        coveragePreferences: [],
        excludeProviders: [],
        alertThresholds: {
          priceIncrease: 20,
          coverageChange: true,
          expiryReminder: 30
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
          showClaims={true}
          showPolicies={true}
          showRecommendations={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive travel insurance management with policy comparison, claims processing, and personalized recommendations.
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
  type InsuranceData,
  type InsurancePolicy,
  type PolicyCoverage,
  type PolicyPricing,
  type PricingDiscount,
  type PricingFee,
  type PolicyTerms,
  type PolicyBenefit,
  type PolicyExclusion,
  type PolicyDocument,
  type PolicyContact,
  type InsuranceComparison,
  type ComparisonCriteria,
  type ComparisonResult,
  type InsuranceClaim,
  type ClaimDocument,
  type ClaimUpdate,
  type InsuranceRecommendation,
  type InsuranceSettings,
  type TravelInsuranceDemoProps
};
