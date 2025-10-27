/**
 * Group Bookings Component
 * 
 * Provides group booking management for Atlas travel agent.
 * Implements group coordination, payment splitting, and group travel management.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Group Bookings Variants
const groupBookingsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'group-bookings-mode-standard',
        'enhanced': 'group-bookings-mode-enhanced',
        'advanced': 'group-bookings-mode-advanced',
        'custom': 'group-bookings-mode-custom'
      },
      type: {
        'family': 'group-type-family',
        'corporate': 'group-type-corporate',
        'friends': 'group-type-friends',
        'mixed': 'group-type-mixed'
      },
      style: {
        'minimal': 'group-style-minimal',
        'moderate': 'group-style-moderate',
        'detailed': 'group-style-detailed',
        'custom': 'group-style-custom'
      },
      format: {
        'text': 'group-format-text',
        'visual': 'group-format-visual',
        'interactive': 'group-format-interactive',
        'mixed': 'group-format-mixed'
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

// Group Bookings Props
interface GroupBookingsProps extends VariantProps<typeof groupBookingsVariants> {
  className?: string;
  onGroupUpdate?: (group: GroupBookingData) => void;
  initialGroup?: Partial<GroupBookingData>;
  showCoordination?: boolean;
  showPayments?: boolean;
  showCommunication?: boolean;
  showManagement?: boolean;
}

// Group Booking Data Interface
interface GroupBookingData {
  id: string;
  tripId: string;
  tripName: string;
  groupDetails: GroupDetails;
  members: GroupMember[];
  bookings: GroupBooking[];
  payments: GroupPayment[];
  communications: GroupCommunication[];
  activities: GroupActivity[];
  settings: GroupBookingSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Group Details Interface
interface GroupDetails {
  name: string;
  description: string;
  type: 'family' | 'corporate' | 'friends' | 'school' | 'club' | 'other';
  size: number;
  maxSize: number;
  organizer: GroupOrganizer;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: {
    total: number;
    perPerson: number;
    currency: string;
  };
  status: 'planning' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  visibility: 'private' | 'invite-only' | 'public';
  tags: string[];
}

// Group Organizer Interface
interface GroupOrganizer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'organizer' | 'co-organizer' | 'assistant';
  permissions: string[];
  isPrimary: boolean;
}

// Group Member Interface
interface GroupMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  age: number;
  role: 'member' | 'organizer' | 'co-organizer' | 'assistant';
  status: 'invited' | 'confirmed' | 'declined' | 'pending';
  joinedDate: Date;
  profile: MemberProfile;
  preferences: MemberPreferences;
  emergencyContact: EmergencyContact;
  specialRequests: string[];
  dietaryRestrictions: string[];
  medicalConditions: string[];
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  totalOwed: number;
  totalPaid: number;
  currency: string;
}

// Member Profile Interface
interface MemberProfile {
  avatar: string;
  bio: string;
  interests: string[];
  travelExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  languages: string[];
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

// Member Preferences Interface
interface MemberPreferences {
  accommodation: {
    type: 'hotel' | 'hostel' | 'apartment' | 'camping' | 'any';
    budget: number;
    currency: string;
    roomSharing: boolean;
    roommates: string[];
  };
  activities: {
    interests: string[];
    intensity: 'low' | 'moderate' | 'high';
    adventureLevel: 'low' | 'moderate' | 'high';
  };
  transportation: {
    preferred: string[];
    budget: number;
    currency: string;
  };
  dining: {
    preferences: string[];
    budget: number;
    currency: string;
    dietaryRestrictions: string[];
  };
}

// Emergency Contact Interface
interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
}

// Group Booking Interface
interface GroupBooking {
  id: string;
  bookingType: 'flight' | 'hotel' | 'activity' | 'transportation' | 'restaurant' | 'other';
  provider: string;
  bookingReference: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  participants: string[]; // Member IDs
  totalCost: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  organizer: string; // Member ID
  notes: string;
  documents: BookingDocument[];
  createdAt: Date;
}

// Booking Document Interface
interface BookingDocument {
  id: string;
  type: 'confirmation' | 'receipt' | 'voucher' | 'itinerary' | 'other';
  name: string;
  url: string;
  uploadDate: Date;
  uploadedBy: string; // Member ID
}

// Group Payment Interface
interface GroupPayment {
  id: string;
  type: 'deposit' | 'installment' | 'final' | 'refund' | 'adjustment';
  description: string;
  amount: number;
  currency: string;
  payer: string; // Member ID
  recipients: string[]; // Member IDs
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod: string;
  transactionId: string;
  notes: string;
  createdAt: Date;
}

// Group Communication Interface
interface GroupCommunication {
  id: string;
  type: 'announcement' | 'message' | 'poll' | 'event' | 'reminder';
  title: string;
  content: string;
  author: string; // Member ID
  recipients: string[]; // Member IDs or 'all'
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean[];
  attachments: CommunicationAttachment[];
  createdAt: Date;
  expiresAt?: Date;
}

// Communication Attachment Interface
interface CommunicationAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video' | 'audio';
  size: number;
}

// Group Activity Interface
interface GroupActivity {
  id: string;
  name: string;
  description: string;
  type: 'sightseeing' | 'adventure' | 'cultural' | 'dining' | 'entertainment' | 'relaxation';
  date: Date;
  time: string;
  duration: number; // in hours
  location: string;
  participants: string[]; // Member IDs
  organizer: string; // Member ID
  cost: number;
  currency: string;
  status: 'planned' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  requirements: string[];
  notes: string;
  createdAt: Date;
}

// Group Booking Settings Interface
interface GroupBookingSettings {
  permissions: {
    canInviteMembers: string[];
    canCreateBookings: string[];
    canManagePayments: string[];
    canSendCommunications: string[];
    canModifyItinerary: string[];
  };
  notifications: {
    newMembers: boolean;
    paymentReminders: boolean;
    bookingUpdates: boolean;
    communicationAlerts: boolean;
    activityReminders: boolean;
  };
  paymentSettings: {
    autoReminders: boolean;
    reminderDays: number[];
    lateFees: boolean;
    lateFeeAmount: number;
    currency: string;
  };
  communicationSettings: {
    allowMemberMessages: boolean;
    requireApproval: boolean;
    moderationLevel: 'low' | 'medium' | 'high';
  };
}

// Group Bookings Component
export const GroupBookings = React.forwardRef<HTMLDivElement, GroupBookingsProps>(
  ({ 
    className, 
    onGroupUpdate,
    initialGroup,
    showCoordination = true,
    showPayments = true,
    showCommunication = true,
    showManagement = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [group, setGroup] = useState<GroupBookingData>(
      initialGroup || {
        id: '',
        tripId: '',
        tripName: '',
        groupDetails: {
          name: '',
          description: '',
          type: 'friends',
          size: 0,
          maxSize: 20,
          organizer: {
            id: '',
            name: '',
            email: '',
            phone: '',
            role: 'organizer',
            permissions: [],
            isPrimary: true
          },
          destination: '',
          startDate: new Date(),
          endDate: new Date(),
          budget: {
            total: 0,
            perPerson: 0,
            currency: 'USD'
          },
          status: 'planning',
          visibility: 'private',
          tags: []
        },
        members: [],
        bookings: [],
        payments: [],
        communications: [],
        activities: [],
        settings: {
          permissions: {
            canInviteMembers: [],
            canCreateBookings: [],
            canManagePayments: [],
            canSendCommunications: [],
            canModifyItinerary: []
          },
          notifications: {
            newMembers: true,
            paymentReminders: true,
            bookingUpdates: true,
            communicationAlerts: true,
            activityReminders: true
          },
          paymentSettings: {
            autoReminders: true,
            reminderDays: [7, 3, 1],
            lateFees: false,
            lateFeeAmount: 0,
            currency: 'USD'
          },
          communicationSettings: {
            allowMemberMessages: true,
            requireApproval: false,
            moderationLevel: 'medium'
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>('list');

    const tabs = [
      { id: 'overview', name: 'Overview', icon: '📊' },
      { id: 'members', name: 'Members', icon: '👥' },
      { id: 'bookings', name: 'Bookings', icon: '🎫' },
      { id: 'payments', name: 'Payments', icon: '💰' },
      { id: 'communication', name: 'Chat', icon: '💬' },
      { id: 'activities', name: 'Activities', icon: '🎯' }
    ];

    const groupTypes = [
      { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: 'blue' },
      { id: 'corporate', name: 'Corporate', icon: '🏢', color: 'green' },
      { id: 'friends', name: 'Friends', icon: '👫', color: 'purple' },
      { id: 'school', name: 'School', icon: '🎓', color: 'orange' },
      { id: 'club', name: 'Club', icon: '🏆', color: 'red' },
      { id: 'other', name: 'Other', icon: '👥', color: 'gray' }
    ];

    const memberRoles = [
      { id: 'organizer', name: 'Organizer', icon: '👑', color: 'gold' },
      { id: 'co-organizer', name: 'Co-Organizer', icon: '👑', color: 'silver' },
      { id: 'assistant', name: 'Assistant', icon: '🛠️', color: 'bronze' },
      { id: 'member', name: 'Member', icon: '👤', color: 'blue' }
    ];

    const memberStatuses = [
      { id: 'invited', name: 'Invited', icon: '📧', color: 'yellow' },
      { id: 'confirmed', name: 'Confirmed', icon: '✅', color: 'green' },
      { id: 'declined', name: 'Declined', icon: '❌', color: 'red' },
      { id: 'pending', name: 'Pending', icon: '⏳', color: 'orange' }
    ];

    const updateGroup = useCallback((path: string, value: any) => {
      setGroup(prev => {
        const newGroup = { ...prev };
        const keys = path.split('.');
        let current: any = newGroup;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newGroup.updatedAt = new Date();
        onGroupUpdate?.(newGroup);
        return newGroup;
      });
    }, [onGroupUpdate]);

    const addMember = useCallback(() => {
      const newMember: GroupMember = {
        id: `member-${Date.now()}`,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: new Date(),
        age: 25,
        role: 'member',
        status: 'invited',
        joinedDate: new Date(),
        profile: {
          avatar: '',
          bio: '',
          interests: [],
          travelExperience: 'intermediate',
          languages: ['en'],
          socialMedia: {}
        },
        preferences: {
          accommodation: {
            type: 'hotel',
            budget: 100,
            currency: 'USD',
            roomSharing: false,
            roommates: []
          },
          activities: {
            interests: [],
            intensity: 'moderate',
            adventureLevel: 'moderate'
          },
          transportation: {
            preferred: [],
            budget: 50,
            currency: 'USD'
          },
          dining: {
            preferences: [],
            budget: 75,
            currency: 'USD',
            dietaryRestrictions: []
          }
        },
        emergencyContact: {
          name: '',
          relationship: '',
          phone: '',
          email: '',
          address: ''
        },
        specialRequests: [],
        dietaryRestrictions: [],
        medicalConditions: [],
        paymentStatus: 'pending',
        totalOwed: 0,
        totalPaid: 0,
        currency: 'USD'
      };
      updateGroup('members', [...group.members, newMember]);
    }, [group.members, updateGroup]);

    const removeMember = useCallback((memberId: string) => {
      updateGroup('members', group.members.filter(m => m.id !== memberId));
    }, [group.members, updateGroup]);

    const updateMemberStatus = useCallback((memberId: string, status: GroupMember['status']) => {
      const updatedMembers = group.members.map(member => 
        member.id === memberId ? { ...member, status } : member
      );
      updateGroup('members', updatedMembers);
    }, [group.members, updateGroup]);

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

    const getGroupTypeIcon = (type: string) => {
      const groupType = groupTypes.find(t => t.id === type);
      return groupType?.icon || '👥';
    };

    const getGroupTypeName = (type: string) => {
      const groupType = groupTypes.find(t => t.id === type);
      return groupType?.name || type;
    };

    const getMemberRoleIcon = (role: string) => {
      const memberRole = memberRoles.find(r => r.id === role);
      return memberRole?.icon || '👤';
    };

    const getMemberRoleName = (role: string) => {
      const memberRole = memberRoles.find(r => r.id === role);
      return memberRole?.name || role;
    };

    const getMemberStatusIcon = (status: string) => {
      const memberStatus = memberStatuses.find(s => s.id === status);
      return memberStatus?.icon || '⏳';
    };

    const getMemberStatusName = (status: string) => {
      const memberStatus = memberStatuses.find(s => s.id === status);
      return memberStatus?.name || status;
    };

    const getMemberStatusColor = (status: string) => {
      const memberStatus = memberStatuses.find(s => s.id === status);
      return memberStatus?.color || 'gray';
    };

    const getPaymentStatusColor = (status: string) => {
      switch (status) {
        case 'paid': return 'text-green-600 dark:text-green-400';
        case 'pending': return 'text-yellow-600 dark:text-yellow-400';
        case 'overdue': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getConfirmedMembers = () => {
      return group.members.filter(member => member.status === 'confirmed');
    };

    const getTotalOwed = () => {
      return group.members.reduce((total, member) => total + member.totalOwed, 0);
    };

    const getTotalPaid = () => {
      return group.members.reduce((total, member) => total + member.totalPaid, 0);
    };

    const getOutstandingAmount = () => {
      return getTotalOwed() - getTotalPaid();
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          groupBookingsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Group Bookings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your group travel: {group.groupDetails.name || 'Untitled Group'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              📧 Invite Members
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Group Overview */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {group.groupDetails.name || 'Untitled Group'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {getGroupTypeIcon(group.groupDetails.type)} {getGroupTypeName(group.groupDetails.type)} • {group.groupDetails.destination}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
              <div className={cn(
                'text-sm font-medium',
                group.groupDetails.status === 'confirmed' ? 'text-green-600 dark:text-green-400' :
                group.groupDetails.status === 'planning' ? 'text-yellow-600 dark:text-yellow-400' :
                group.groupDetails.status === 'active' ? 'text-blue-600 dark:text-blue-400' :
                'text-red-600 dark:text-red-400'
              )}>
                {group.groupDetails.status}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {group.members.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Members</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {getConfirmedMembers().length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Confirmed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {group.bookings.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Bookings</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(getOutstandingAmount(), group.groupDetails.budget.currency)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Outstanding</div>
            </div>
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
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Group Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Trip Details</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Destination:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {group.groupDetails.destination}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Start Date:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(group.groupDetails.startDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>End Date:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(group.groupDetails.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(group.groupDetails.budget.total, group.groupDetails.budget.currency)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Total Owed:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(getTotalOwed(), group.groupDetails.budget.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Paid:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(getTotalPaid(), group.groupDetails.budget.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Outstanding:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(getOutstandingAmount(), group.groupDetails.budget.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Per Person:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(group.groupDetails.budget.perPerson, group.groupDetails.budget.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Group Members
                </h3>
                <button
                  onClick={addMember}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  + Add Member
                </button>
              </div>
              
              <div className="space-y-3">
                {group.members.map((member) => (
                  <div key={member.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-lg">{getMemberRoleIcon(member.role)}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {member.firstName} {member.lastName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.email} • {getMemberRoleName(member.role)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              'px-2 py-1 text-xs rounded-md',
                              `bg-${getMemberStatusColor(member.status)}-100 dark:bg-${getMemberStatusColor(member.status)}-900`,
                              `text-${getMemberStatusColor(member.status)}-600 dark:text-${getMemberStatusColor(member.status)}-400`
                            )}>
                              {getMemberStatusIcon(member.status)} {getMemberStatusName(member.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Payment Status</div>
                        <div className={cn('text-sm font-medium', getPaymentStatusColor(member.paymentStatus))}>
                          {member.paymentStatus}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(member.totalOwed - member.totalPaid, member.currency)} owed
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <div className="flex justify-between">
                          <span>Age:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {member.age} years
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Joined:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {formatDate(member.joinedDate)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>Total Owed:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(member.totalOwed, member.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Paid:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(member.totalPaid, member.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1">
                        {member.dietaryRestrictions.slice(0, 2).map((restriction) => (
                          <span
                            key={restriction}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                          >
                            {restriction}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                          Edit
                        </button>
                        <button
                          onClick={() => removeMember(member.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Group Bookings
              </h3>
              
              {group.bookings.length > 0 ? (
                <div className="space-y-3">
                  {group.bookings.map((booking) => (
                    <div key={booking.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {booking.description}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.provider} • {booking.bookingReference}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(booking.totalCost, booking.currency)}
                          </div>
                          <div className={cn(
                            'text-sm font-medium',
                            booking.status === 'confirmed' ? 'text-green-600 dark:text-green-400' :
                            booking.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          )}>
                            {booking.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(booking.date)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {booking.time}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Location:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {booking.location}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Participants:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {booking.participants.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🎫</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No bookings yet
                  </h3>
                  <p>Create bookings for your group trip</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && showPayments && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Payment Management
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Payment management coming soon
                </h3>
                <p>Track payments, split costs, and manage group finances</p>
              </div>
            </div>
          )}

          {activeTab === 'communication' && showCommunication && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Group Communication
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Group chat coming soon
                </h3>
                <p>Communicate with your group members</p>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Group Activities
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No activities planned yet
                </h3>
                <p>Plan and organize group activities</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

GroupBookings.displayName = 'GroupBookings';

// Group Bookings Demo Component
interface GroupBookingsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const GroupBookingsDemo = React.forwardRef<HTMLDivElement, GroupBookingsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [group, setGroup] = useState<Partial<GroupBookingData>>({});

    const handleGroupUpdate = (updatedGroup: GroupBookingData) => {
      setGroup(updatedGroup);
      console.log('Group booking updated:', updatedGroup);
    };

    const mockGroup: Partial<GroupBookingData> = {
      id: 'group-booking-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      groupDetails: {
        name: 'Paris Adventure Group',
        description: 'Friends exploring the City of Light together',
        type: 'friends',
        size: 6,
        maxSize: 8,
        organizer: {
          id: 'organizer-1',
          name: 'John Smith',
          email: 'john@example.com',
          phone: '+1-555-0123',
          role: 'organizer',
          permissions: ['all'],
          isPrimary: true
        },
        destination: 'Paris, France',
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-06-22'),
        budget: {
          total: 12000,
          perPerson: 2000,
          currency: 'USD'
        },
        status: 'planning',
        visibility: 'private',
        tags: ['friends', 'europe', 'culture']
      },
      members: [],
      bookings: [],
      payments: [],
      communications: [],
      activities: [],
      settings: {
        permissions: {
          canInviteMembers: ['organizer'],
          canCreateBookings: ['organizer', 'co-organizer'],
          canManagePayments: ['organizer'],
          canSendCommunications: ['organizer', 'co-organizer'],
          canModifyItinerary: ['organizer']
        },
        notifications: {
          newMembers: true,
          paymentReminders: true,
          bookingUpdates: true,
          communicationAlerts: true,
          activityReminders: true
        },
        paymentSettings: {
          autoReminders: true,
          reminderDays: [7, 3, 1],
          lateFees: false,
          lateFeeAmount: 0,
          currency: 'USD'
        },
        communicationSettings: {
          allowMemberMessages: true,
          requireApproval: false,
          moderationLevel: 'medium'
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
          Group Bookings Demo
        </h3>
        
        <GroupBookings
          onGroupUpdate={handleGroupUpdate}
          initialGroup={mockGroup}
          showCoordination={true}
          showPayments={true}
          showCommunication={true}
          showManagement={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive group booking management with member coordination, payment tracking, communication tools, and activity planning.
            </p>
          </div>
        )}
      </div>
    );
  }
);

GroupBookingsDemo.displayName = 'GroupBookingsDemo';

// Export all components
export {
  groupBookingsVariants,
  type GroupBookingsProps,
  type GroupBookingData,
  type GroupDetails,
  type GroupOrganizer,
  type GroupMember,
  type MemberProfile,
  type MemberPreferences,
  type EmergencyContact,
  type GroupBooking,
  type BookingDocument,
  type GroupPayment,
  type GroupCommunication,
  type CommunicationAttachment,
  type GroupActivity,
  type GroupBookingSettings,
  type GroupBookingsDemoProps
};
