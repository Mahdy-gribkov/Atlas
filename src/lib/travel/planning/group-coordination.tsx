/**
 * Group Coordination Component
 * 
 * Provides multi-traveler coordination and planning for Atlas travel agent.
 * Implements group management, collaboration, and shared planning features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Group Coordination Variants
const groupCoordinationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'group-coordination-mode-standard',
        'enhanced': 'group-coordination-mode-enhanced',
        'advanced': 'group-coordination-mode-advanced',
        'custom': 'group-coordination-mode-custom'
      },
      type: {
        'family': 'group-type-family',
        'friends': 'group-type-friends',
        'business': 'group-type-business',
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

// Group Coordination Props
interface GroupCoordinationProps extends VariantProps<typeof groupCoordinationVariants> {
  className?: string;
  onGroupUpdate?: (group: GroupData) => void;
  initialGroup?: Partial<GroupData>;
  showChat?: boolean;
  showPolls?: boolean;
  showTasks?: boolean;
  showCalendar?: boolean;
}

// Group Data Interface
interface GroupData {
  id: string;
  name: string;
  description: string;
  tripId: string;
  type: 'family' | 'friends' | 'business' | 'mixed';
  members: GroupMember[];
  roles: GroupRole[];
  permissions: GroupPermissions;
  activities: GroupActivity[];
  tasks: GroupTask[];
  polls: GroupPoll[];
  messages: GroupMessage[];
  calendar: GroupCalendar;
  budget: GroupBudget;
  documents: GroupDocument[];
  settings: GroupSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Group Member Interface
interface GroupMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'organizer' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joinedAt: Date;
  lastActive: Date;
  preferences: MemberPreferences;
  emergencyContact: EmergencyContact;
  permissions: string[];
}

// Member Preferences Interface
interface MemberPreferences {
  interests: string[];
  dietary: string[];
  accessibility: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  accommodation: string[];
  transportation: string[];
  activities: string[];
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// Emergency Contact Interface
interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

// Group Role Interface
interface GroupRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  isDefault: boolean;
}

// Group Permissions Interface
interface GroupPermissions {
  canEditTrip: string[];
  canAddMembers: string[];
  canRemoveMembers: string[];
  canCreateTasks: string[];
  canCreatePolls: string[];
  canManageBudget: string[];
  canUploadDocuments: string[];
  canSendMessages: string[];
}

// Group Activity Interface
interface GroupActivity {
  id: string;
  title: string;
  description: string;
  type: 'activity' | 'meal' | 'transportation' | 'accommodation' | 'meeting';
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  participants: string[];
  status: 'planned' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  cost: number;
  currency: string;
  notes: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Group Task Interface
interface GroupTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigner: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: Date;
  category: string;
  tags: string[];
  attachments: string[];
  comments: TaskComment[];
  createdAt: Date;
  updatedAt: Date;
}

// Task Comment Interface
interface TaskComment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

// Group Poll Interface
interface GroupPoll {
  id: string;
  title: string;
  description: string;
  creator: string;
  type: 'single-choice' | 'multiple-choice' | 'rating' | 'text';
  options: PollOption[];
  responses: PollResponse[];
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

// Poll Option Interface
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

// Poll Response Interface
interface PollResponse {
  id: string;
  voter: string;
  optionId: string;
  response?: string;
  createdAt: Date;
}

// Group Message Interface
interface GroupMessage {
  id: string;
  sender: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  attachments: string[];
  reactions: MessageReaction[];
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
}

// Message Reaction Interface
interface MessageReaction {
  id: string;
  emoji: string;
  users: string[];
}

// Group Calendar Interface
interface GroupCalendar {
  id: string;
  events: CalendarEvent[];
  availability: MemberAvailability[];
  conflicts: CalendarConflict[];
}

// Calendar Event Interface
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  participants: string[];
  type: string;
  location: string;
}

// Member Availability Interface
interface MemberAvailability {
  memberId: string;
  date: Date;
  available: boolean;
  startTime?: string;
  endTime?: string;
  notes?: string;
}

// Calendar Conflict Interface
interface CalendarConflict {
  id: string;
  event1: string;
  event2: string;
  members: string[];
  severity: 'low' | 'medium' | 'high';
}

// Group Budget Interface
interface GroupBudget {
  id: string;
  total: number;
  currency: string;
  contributions: BudgetContribution[];
  expenses: BudgetExpense[];
  splits: BudgetSplit[];
  alerts: BudgetAlert[];
}

// Budget Contribution Interface
interface BudgetContribution {
  id: string;
  memberId: string;
  amount: number;
  currency: string;
  date: Date;
  method: string;
  status: 'pending' | 'confirmed' | 'failed';
}

// Budget Expense Interface
interface BudgetExpense {
  id: string;
  title: string;
  amount: number;
    currency: string;
  category: string;
  paidBy: string;
  splitBetween: string[];
  date: Date;
  receipt?: string;
}

// Budget Split Interface
interface BudgetSplit {
  id: string;
  expenseId: string;
  memberId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'settled';
}

// Budget Alert Interface
interface BudgetAlert {
  id: string;
  type: 'over-budget' | 'unpaid-expense' | 'unsettled-split';
  message: string;
  amount: number;
  currency: string;
  createdAt: Date;
}

// Group Document Interface
interface GroupDocument {
  id: string;
  name: string;
  type: 'passport' | 'visa' | 'insurance' | 'itinerary' | 'booking' | 'other';
  url: string;
  uploadedBy: string;
  sharedWith: string[];
  size: number;
  uploadedAt: Date;
}

// Group Settings Interface
interface GroupSettings {
  allowMemberInvites: boolean;
  requireApprovalForTasks: boolean;
  allowAnonymousPolls: boolean;
  enableNotifications: boolean;
  defaultRole: string;
  maxMembers: number;
  autoArchiveCompletedTasks: boolean;
  enableBudgetTracking: boolean;
}

// Group Coordination Component
export const GroupCoordination = React.forwardRef<HTMLDivElement, GroupCoordinationProps>(
  ({ 
    className, 
    onGroupUpdate,
    initialGroup,
    showChat = true,
    showPolls = true,
    showTasks = true,
    showCalendar = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [group, setGroup] = useState<GroupData>(
      initialGroup || {
        id: '',
        name: '',
        description: '',
        tripId: '',
        type: 'friends',
        members: [],
        roles: [],
        permissions: {
          canEditTrip: [],
          canAddMembers: [],
          canRemoveMembers: [],
          canCreateTasks: [],
          canCreatePolls: [],
          canManageBudget: [],
          canUploadDocuments: [],
          canSendMessages: []
        },
        activities: [],
        tasks: [],
        polls: [],
        messages: [],
        calendar: {
          id: '',
          events: [],
          availability: [],
          conflicts: []
        },
        budget: {
          id: '',
          total: 0,
          currency: 'USD',
          contributions: [],
          expenses: [],
          splits: [],
          alerts: []
        },
        documents: [],
        settings: {
          allowMemberInvites: true,
          requireApprovalForTasks: false,
          allowAnonymousPolls: false,
          enableNotifications: true,
          defaultRole: 'member',
          maxMembers: 20,
          autoArchiveCompletedTasks: true,
          enableBudgetTracking: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string>('');
    const [newMessage, setNewMessage] = useState('');

    const tabs = [
      { id: 'overview', name: 'Overview', icon: '📊' },
      { id: 'members', name: 'Members', icon: '👥' },
      { id: 'activities', name: 'Activities', icon: '🎯' },
      { id: 'tasks', name: 'Tasks', icon: '✅' },
      { id: 'chat', name: 'Chat', icon: '💬' },
      { id: 'polls', name: 'Polls', icon: '📊' },
      { id: 'budget', name: 'Budget', icon: '💰' }
    ];

    const groupTypes = [
      { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: 'blue' },
      { id: 'friends', name: 'Friends', icon: '👫', color: 'green' },
      { id: 'business', name: 'Business', icon: '💼', color: 'purple' },
      { id: 'mixed', name: 'Mixed', icon: '👥', color: 'gray' }
    ];

    const memberRoles = [
      { id: 'organizer', name: 'Organizer', icon: '👑', color: 'yellow' },
      { id: 'admin', name: 'Admin', icon: '⚡', color: 'blue' },
      { id: 'member', name: 'Member', icon: '👤', color: 'green' },
      { id: 'viewer', name: 'Viewer', icon: '👁️', color: 'gray' }
    ];

    const taskPriorities = [
      { id: 'low', name: 'Low', icon: '🟢', color: 'green' },
      { id: 'medium', name: 'Medium', icon: '🟡', color: 'yellow' },
      { id: 'high', name: 'High', icon: '🔴', color: 'red' }
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
        userId: '',
        name: '',
        email: '',
        role: 'member',
        status: 'pending',
        joinedAt: new Date(),
        lastActive: new Date(),
        preferences: {
          interests: [],
          dietary: [],
          accessibility: [],
          budget: { min: 0, max: 1000, currency: 'USD' },
          accommodation: [],
          transportation: [],
          activities: [],
          notifications: { email: true, push: true, sms: false }
        },
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        },
        permissions: []
      };
      updateGroup('members', [...group.members, newMember]);
    }, [group.members, updateGroup]);

    const addTask = useCallback(() => {
      const newTask: GroupTask = {
        id: `task-${Date.now()}`,
        title: 'New Task',
        description: '',
        assignee: '',
        assigner: '',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(),
        category: '',
        tags: [],
        attachments: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      updateGroup('tasks', [...group.tasks, newTask]);
    }, [group.tasks, updateGroup]);

    const addPoll = useCallback(() => {
      const newPoll: GroupPoll = {
        id: `poll-${Date.now()}`,
        title: 'New Poll',
        description: '',
        creator: '',
        type: 'single-choice',
        options: [],
        responses: [],
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        createdAt: new Date()
      };
      updateGroup('polls', [...group.polls, newPoll]);
    }, [group.polls, updateGroup]);

    const sendMessage = useCallback(() => {
      if (!newMessage.trim()) return;
      
      const message: GroupMessage = {
        id: `message-${Date.now()}`,
        sender: 'current-user',
        content: newMessage,
        type: 'text',
        attachments: [],
        reactions: [],
        isEdited: false,
        createdAt: new Date()
      };
      updateGroup('messages', [...group.messages, message]);
      setNewMessage('');
    }, [group.messages, newMessage, updateGroup]);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    const getGroupTypeIcon = (type: GroupData['type']) => {
      const groupType = groupTypes.find(t => t.id === type);
      return groupType?.icon || '👥';
    };

    const getGroupTypeName = (type: GroupData['type']) => {
      const groupType = groupTypes.find(t => t.id === type);
      return groupType?.name || type;
    };

    const getRoleIcon = (role: GroupMember['role']) => {
      const memberRole = memberRoles.find(r => r.id === role);
      return memberRole?.icon || '👤';
    };

    const getRoleColor = (role: GroupMember['role']) => {
      const memberRole = memberRoles.find(r => r.id === role);
      return memberRole?.color || 'gray';
    };

    const getPriorityColor = (priority: GroupTask['priority']) => {
      const taskPriority = taskPriorities.find(p => p.id === priority);
      return taskPriority?.color || 'gray';
    };

    const getStatusColor = (status: GroupTask['status']) => {
      switch (status) {
        case 'completed': return 'text-green-600 dark:text-green-400';
        case 'in-progress': return 'text-blue-600 dark:text-blue-400';
        case 'todo': return 'text-gray-600 dark:text-gray-400';
        case 'cancelled': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          groupCoordinationVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Group Coordination
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {group.name || 'Coordinate your travel group'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              📤 Invite
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Group Overview */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={group.name}
                onChange={(e) => updateGroup('name', e.target.value)}
                placeholder="Enter group name"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Group Type
              </label>
              <select
                value={group.type}
                onChange={(e) => updateGroup('type', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                {groupTypes.map((groupType) => (
                  <option key={groupType.id} value={groupType.id}>
                    {groupType.icon} {groupType.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Members
              </label>
              <input
                type="number"
                value={group.settings.maxMembers}
                onChange={(e) => updateGroup('settings.maxMembers', parseInt(e.target.value))}
                min="2"
                max="50"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Role
              </label>
              <select
                value={group.settings.defaultRole}
                onChange={(e) => updateGroup('settings.defaultRole', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                {memberRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.icon} {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={group.description}
              onChange={(e) => updateGroup('description', e.target.value)}
              placeholder="Describe your group..."
              rows={3}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Group Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {group.members.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Members</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {group.activities.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Activities</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {group.tasks.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tasks</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {group.polls.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Polls</div>
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Group Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {getGroupTypeIcon(group.type)} {getGroupTypeName(group.type)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Members:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {group.members.length} / {group.settings.maxMembers}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Created:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(group.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(group.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {group.messages.slice(-3).reverse().map((message) => (
                      <div key={message.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          👤
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {message.sender}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {message.content}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                    ))}
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
                  ➕ Add Member
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.members.map((member) => (
                  <div key={member.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <span>👤</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {member.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Role:</span>
                        <span className={cn(
                          'font-medium',
                          `text-${getRoleColor(member.role)}-600 dark:text-${getRoleColor(member.role)}-400`
                        )}>
                          {getRoleIcon(member.role)} {member.role}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={cn(
                          'font-medium',
                          member.status === 'active' ? 'text-green-600 dark:text-green-400' :
                          member.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-gray-600 dark:text-gray-400'
                        )}>
                          {member.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Joined:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(member.joinedAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Last Active:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(member.lastActive)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && showTasks && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Group Tasks
                </h3>
                <button
                  onClick={addTask}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  ➕ Add Task
                </button>
              </div>
              
              <div className="space-y-3">
                {group.tasks.map((task) => (
                  <div key={task.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-4 h-4 rounded-full',
                          `bg-${getPriorityColor(task.priority)}-500`
                        )} />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {task.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-md',
                          `bg-${getPriorityColor(task.priority)}-100 text-${getPriorityColor(task.priority)}-800 dark:bg-${getPriorityColor(task.priority)}-900 dark:text-${getPriorityColor(task.priority)}-200`
                        )}>
                          {task.priority}
                        </span>
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-md',
                          getStatusColor(task.status)
                        )}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <span>Assignee: {task.assignee}</span>
                        <span>Due: {formatDate(task.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Comments: {task.comments.length}</span>
                        <span>Attachments: {task.attachments.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && showChat && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Group Chat
              </h3>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg h-96 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {group.messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        👤
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {message.sender}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-600 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'polls' && showPolls && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Group Polls
                </h3>
                <button
                  onClick={addPoll}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                >
                  📊 Create Poll
                </button>
              </div>
              
              <div className="space-y-3">
                {group.polls.map((poll) => (
                  <div key={poll.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {poll.title}
                      </h4>
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-md',
                        poll.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      )}>
                        {poll.isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {poll.description}
                    </p>
                    
                    <div className="space-y-2">
                      {poll.options.map((option) => (
                        <div key={option.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {option.text}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {option.votes} votes
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                      Created by {poll.creator} • Expires {formatDate(poll.expiresAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Group Budget
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Budget management coming soon
                </h3>
                <p>Track shared expenses and split costs</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

GroupCoordination.displayName = 'GroupCoordination';

// Group Coordination Demo Component
interface GroupCoordinationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const GroupCoordinationDemo = React.forwardRef<HTMLDivElement, GroupCoordinationDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [group, setGroup] = useState<Partial<GroupData>>({});

    const handleGroupUpdate = (updatedGroup: GroupData) => {
      setGroup(updatedGroup);
      console.log('Group updated:', updatedGroup);
    };

    const mockGroup: Partial<GroupData> = {
      id: 'group-1',
      name: 'Paris Adventure Group',
      description: 'A group of friends exploring Paris together',
      tripId: 'trip-1',
      type: 'friends',
      members: [],
      roles: [],
      permissions: {
        canEditTrip: [],
        canAddMembers: [],
        canRemoveMembers: [],
        canCreateTasks: [],
        canCreatePolls: [],
        canManageBudget: [],
        canUploadDocuments: [],
        canSendMessages: []
      },
      activities: [],
      tasks: [],
      polls: [],
      messages: [],
      calendar: {
        id: '',
        events: [],
        availability: [],
        conflicts: []
      },
      budget: {
        id: '',
        total: 0,
        currency: 'USD',
        contributions: [],
        expenses: [],
        splits: [],
        alerts: []
      },
      documents: [],
      settings: {
        allowMemberInvites: true,
        requireApprovalForTasks: false,
        allowAnonymousPolls: false,
        enableNotifications: true,
        defaultRole: 'member',
        maxMembers: 10,
        autoArchiveCompletedTasks: true,
        enableBudgetTracking: true
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
          Group Coordination Demo
        </h3>
        
        <GroupCoordination
          onGroupUpdate={handleGroupUpdate}
          initialGroup={mockGroup}
          showChat={true}
          showPolls={true}
          showTasks={true}
          showCalendar={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Multi-traveler coordination with group management, collaboration, tasks, polls, and shared planning.
            </p>
          </div>
        )}
      </div>
    );
  }
);

GroupCoordinationDemo.displayName = 'GroupCoordinationDemo';

// Export all components
export {
  groupCoordinationVariants,
  type GroupCoordinationProps,
  type GroupData,
  type GroupMember,
  type MemberPreferences,
  type EmergencyContact,
  type GroupRole,
  type GroupPermissions,
  type GroupActivity,
  type GroupTask,
  type TaskComment,
  type GroupPoll,
  type PollOption,
  type PollResponse,
  type GroupMessage,
  type MessageReaction,
  type GroupCalendar,
  type CalendarEvent,
  type MemberAvailability,
  type CalendarConflict,
  type GroupBudget,
  type BudgetContribution,
  type BudgetExpense,
  type BudgetSplit,
  type BudgetAlert,
  type GroupDocument,
  type GroupSettings,
  type GroupCoordinationDemoProps
};
