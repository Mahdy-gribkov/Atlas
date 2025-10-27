/**
 * Timeline Creation Component
 * 
 * Provides visual timeline and schedule management for Atlas travel agent.
 * Implements timeline visualization, schedule planning, and time management.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Timeline Creation Variants
const timelineCreationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'timeline-creation-mode-standard',
        'enhanced': 'timeline-creation-mode-enhanced',
        'advanced': 'timeline-creation-mode-advanced',
        'custom': 'timeline-creation-mode-custom'
      },
      type: {
        'horizontal': 'timeline-type-horizontal',
        'vertical': 'timeline-type-vertical',
        'circular': 'timeline-type-circular',
        'mixed': 'timeline-type-mixed'
      },
      style: {
        'minimal': 'timeline-style-minimal',
        'moderate': 'timeline-style-moderate',
        'detailed': 'timeline-style-detailed',
        'custom': 'timeline-style-custom'
      },
      format: {
        'text': 'timeline-format-text',
        'visual': 'timeline-format-visual',
        'interactive': 'timeline-format-interactive',
        'mixed': 'timeline-format-mixed'
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

// Timeline Creation Props
interface TimelineCreationProps extends VariantProps<typeof timelineCreationVariants> {
  className?: string;
  onTimelineUpdate?: (timeline: TimelineData) => void;
  initialTimeline?: Partial<TimelineData>;
  showControls?: boolean;
  showFilters?: boolean;
  showExport?: boolean;
  showCollaboration?: boolean;
}

// Timeline Data Interface
interface TimelineData {
  id: string;
  title: string;
  description: string;
  tripId: string;
  startDate: Date;
  endDate: Date;
  timezone: string;
  events: TimelineEvent[];
  milestones: Milestone[];
  phases: TimelinePhase[];
  settings: TimelineSettings;
  collaborators: Collaborator[];
  createdAt: Date;
  updatedAt: Date;
}

// Timeline Event Interface
interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  type: 'activity' | 'transportation' | 'meal' | 'accommodation' | 'meeting' | 'free-time' | 'other';
  category: string;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  participants: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'planned' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  dependencies: string[];
  tags: string[];
  notes: string;
  attachments: Attachment[];
  color: string;
  isAllDay: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Milestone Interface
interface Milestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'departure' | 'arrival' | 'checkpoint' | 'deadline' | 'celebration';
  importance: 'low' | 'medium' | 'high';
  completed: boolean;
  completedAt?: Date;
  notes: string;
}

// Timeline Phase Interface
interface TimelinePhase {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  color: string;
  events: string[];
  goals: string[];
  completed: boolean;
}

// Collaborator Interface
interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  permissions: string[];
  joinedAt: Date;
}

// Attachment Interface
interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'link' | 'note';
  url: string;
  size?: number;
  uploadedAt: Date;
}

// Timeline Settings Interface
interface TimelineSettings {
  viewMode: 'day' | 'week' | 'month' | 'timeline';
  timeFormat: '12h' | '24h';
  workingHours: {
    start: string;
    end: string;
  };
  weekends: boolean;
  timezone: string;
  autoSave: boolean;
  notifications: boolean;
  colorScheme: 'default' | 'custom';
  customColors: string[];
}

// Timeline Creation Component
export const TimelineCreation = React.forwardRef<HTMLDivElement, TimelineCreationProps>(
  ({ 
    className, 
    onTimelineUpdate,
    initialTimeline,
    showControls = true,
    showFilters = true,
    showExport = true,
    showCollaboration = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [timeline, setTimeline] = useState<TimelineData>(
      initialTimeline || {
        id: '',
        title: '',
        description: '',
        tripId: '',
        startDate: new Date(),
        endDate: new Date(),
        timezone: 'UTC',
        events: [],
        milestones: [],
        phases: [],
        settings: {
          viewMode: 'timeline',
          timeFormat: '24h',
          workingHours: { start: '09:00', end: '17:00' },
          weekends: true,
          timezone: 'UTC',
          autoSave: true,
          notifications: true,
          colorScheme: 'default',
          customColors: []
        },
        collaborators: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('timeline');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'timeline'>('timeline');

    const tabs = [
      { id: 'timeline', name: 'Timeline', icon: '📅' },
      { id: 'events', name: 'Events', icon: '📋' },
      { id: 'milestones', name: 'Milestones', icon: '🎯' },
      { id: 'phases', name: 'Phases', icon: '📊' },
      { id: 'settings', name: 'Settings', icon: '⚙️' }
    ];

    const eventTypes = [
      { id: 'activity', name: 'Activity', icon: '🎯', color: 'blue' },
      { id: 'transportation', name: 'Transportation', icon: '🚗', color: 'green' },
      { id: 'meal', name: 'Meal', icon: '🍽️', color: 'orange' },
      { id: 'accommodation', name: 'Accommodation', icon: '🏨', color: 'purple' },
      { id: 'meeting', name: 'Meeting', icon: '👥', color: 'indigo' },
      { id: 'free-time', name: 'Free Time', icon: '😌', color: 'gray' },
      { id: 'other', name: 'Other', icon: '📝', color: 'slate' }
    ];

    const milestoneTypes = [
      { id: 'departure', name: 'Departure', icon: '✈️', color: 'blue' },
      { id: 'arrival', name: 'Arrival', icon: '🏁', color: 'green' },
      { id: 'checkpoint', name: 'Checkpoint', icon: '📍', color: 'yellow' },
      { id: 'deadline', name: 'Deadline', icon: '⏰', color: 'red' },
      { id: 'celebration', name: 'Celebration', icon: '🎉', color: 'pink' }
    ];

    const updateTimeline = useCallback((path: string, value: any) => {
      setTimeline(prev => {
        const newTimeline = { ...prev };
        const keys = path.split('.');
        let current: any = newTimeline;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newTimeline.updatedAt = new Date();
        onTimelineUpdate?.(newTimeline);
        return newTimeline;
      });
    }, [onTimelineUpdate]);

    const addEvent = useCallback(() => {
      const newEvent: TimelineEvent = {
        id: `event-${Date.now()}`,
        title: 'New Event',
        description: '',
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
        duration: 60,
        type: 'activity',
        category: '',
        location: {
          name: '',
          address: '',
          coordinates: { lat: 0, lng: 0 }
        },
        participants: [],
        priority: 'medium',
        status: 'planned',
        dependencies: [],
        tags: [],
        notes: '',
        attachments: [],
        color: '#3B82F6',
        isAllDay: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      updateTimeline('events', [...timeline.events, newEvent]);
    }, [timeline.events, updateTimeline]);

    const addMilestone = useCallback(() => {
      const newMilestone: Milestone = {
        id: `milestone-${Date.now()}`,
        title: 'New Milestone',
        description: '',
        date: new Date(),
        type: 'checkpoint',
        importance: 'medium',
        completed: false,
        notes: ''
      };
      updateTimeline('milestones', [...timeline.milestones, newMilestone]);
    }, [timeline.milestones, updateTimeline]);

    const addPhase = useCallback(() => {
      const newPhase: TimelinePhase = {
        id: `phase-${Date.now()}`,
        name: 'New Phase',
        description: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
        color: '#10B981',
        events: [],
        goals: [],
        completed: false
      };
      updateTimeline('phases', [...timeline.phases, newPhase]);
    }, [timeline.phases, updateTimeline]);

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: timeline.settings.timeFormat === '12h'
      });
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const getEventTypeIcon = (type: TimelineEvent['type']) => {
      const eventType = eventTypes.find(t => t.id === type);
      return eventType?.icon || '📝';
    };

    const getEventTypeName = (type: TimelineEvent['type']) => {
      const eventType = eventTypes.find(t => t.id === type);
      return eventType?.name || type;
    };

    const getEventTypeColor = (type: TimelineEvent['type']) => {
      const eventType = eventTypes.find(t => t.id === type);
      return eventType?.color || 'gray';
    };

    const getMilestoneIcon = (type: Milestone['type']) => {
      const milestoneType = milestoneTypes.find(t => t.id === type);
      return milestoneType?.icon || '📍';
    };

    const getMilestoneColor = (type: Milestone['type']) => {
      const milestoneType = milestoneTypes.find(t => t.id === type);
      return milestoneType?.color || 'gray';
    };

    const getPriorityColor = (priority: TimelineEvent['priority']) => {
      switch (priority) {
        case 'high': return 'text-red-600 dark:text-red-400';
        case 'medium': return 'text-yellow-600 dark:text-yellow-400';
        case 'low': return 'text-green-600 dark:text-green-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getStatusColor = (status: TimelineEvent['status']) => {
      switch (status) {
        case 'completed': return 'text-green-600 dark:text-green-400';
        case 'in-progress': return 'text-blue-600 dark:text-blue-400';
        case 'confirmed': return 'text-purple-600 dark:text-purple-400';
        case 'planned': return 'text-gray-600 dark:text-gray-400';
        case 'cancelled': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const calculateDuration = (startTime: Date, endTime: Date) => {
      const diffMs = endTime.getTime() - startTime.getTime();
      return Math.round(diffMs / (1000 * 60)); // minutes
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          timelineCreationVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Timeline Creation
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {timeline.title || 'Create your travel timeline'}
            </p>
          </div>
          <div className="flex gap-2">
            {showExport && (
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                📤 Export
              </button>
            )}
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              💾 Save
            </button>
          </div>
        </div>

        {/* Timeline Overview */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timeline Title
              </label>
              <input
                type="text"
                value={timeline.title}
                onChange={(e) => updateTimeline('title', e.target.value)}
                placeholder="Enter timeline title"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={timeline.startDate.toISOString().split('T')[0]}
                onChange={(e) => updateTimeline('startDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={timeline.endDate.toISOString().split('T')[0]}
                onChange={(e) => updateTimeline('endDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                View Mode
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as typeof viewMode)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="timeline">Timeline</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={timeline.description}
              onChange={(e) => updateTimeline('description', e.target.value)}
              placeholder="Describe your timeline..."
              rows={3}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Timeline Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {timeline.events.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {timeline.milestones.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Milestones</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {timeline.phases.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Phases</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {timeline.events.filter(e => e.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
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
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Timeline View
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={addEvent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    ➕ Event
                  </button>
                  <button
                    onClick={addMilestone}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                  >
                    🎯 Milestone
                  </button>
                </div>
              </div>
              
              {/* Timeline Visualization */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="space-y-4">
                  {timeline.events.map((event, index) => (
                    <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className={cn(
                          'w-4 h-4 rounded-full',
                          `bg-${getEventTypeColor(event.type)}-500`
                        )} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className={cn('text-sm', getPriorityColor(event.priority))}>
                              {event.priority}
                            </span>
                            <span className={cn('text-sm', getStatusColor(event.status))}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>{getEventTypeIcon(event.type)} {getEventTypeName(event.type)}</span>
                          <span>📅 {formatDate(event.startTime)}</span>
                          <span>🕐 {formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                          <span>⏱️ {calculateDuration(event.startTime, event.endTime)} min</span>
                        </div>
                        
                        {event.location.name && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            📍 {event.location.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {timeline.events.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <div className="text-6xl mb-4">📅</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No events planned yet
                      </h3>
                      <p>Start by adding events to your timeline</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Events
                </h3>
                <button
                  onClick={addEvent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  ➕ Add Event
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeline.events.map((event) => (
                  <div key={event.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {event.title}
                        </h4>
                      </div>
                      <div className={cn(
                        'px-2 py-1 text-xs rounded-md',
                        `bg-${getEventTypeColor(event.type)}-100 text-${getEventTypeColor(event.type)}-800 dark:bg-${getEventTypeColor(event.type)}-900 dark:text-${getEventTypeColor(event.type)}-200`
                      )}>
                        {event.status}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(event.startTime)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {calculateDuration(event.startTime, event.endTime)} min
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <span className={cn('font-medium', getPriorityColor(event.priority))}>
                          {event.priority}
                        </span>
                      </div>
                    </div>
                    
                    {event.location.name && (
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        📍 {event.location.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Milestones
                </h3>
                <button
                  onClick={addMilestone}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  🎯 Add Milestone
                </button>
              </div>
              
              <div className="space-y-3">
                {timeline.milestones.map((milestone) => (
                  <div key={milestone.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-white',
                        `bg-${getMilestoneColor(milestone.type)}-500`
                      )}>
                        {getMilestoneIcon(milestone.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {milestone.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'px-2 py-1 text-xs rounded-md',
                              milestone.importance === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              milestone.importance === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            )}>
                              {milestone.importance}
                            </span>
                            <span className={cn(
                              'px-2 py-1 text-xs rounded-md',
                              milestone.completed 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            )}>
                              {milestone.completed ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {milestone.description}
                        </p>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          📅 {formatDate(milestone.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'phases' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Timeline Phases
                </h3>
                <button
                  onClick={addPhase}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                >
                  📊 Add Phase
                </button>
              </div>
              
              <div className="space-y-3">
                {timeline.phases.map((phase) => (
                  <div key={phase.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: phase.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {phase.name}
                          </h4>
                          <span className={cn(
                            'px-2 py-1 text-xs rounded-md',
                            phase.completed 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          )}>
                            {phase.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {phase.description}
                        </p>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          📅 {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Timeline Settings
              </h3>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time Format
                    </label>
                    <select
                      value={timeline.settings.timeFormat}
                      onChange={(e) => updateTimeline('settings.timeFormat', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="12h">12 Hour (AM/PM)</option>
                      <option value="24h">24 Hour</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timezone
                    </label>
                    <select
                      value={timeline.settings.timezone}
                      onChange={(e) => updateTimeline('settings.timezone', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Working Hours Start
                    </label>
                    <input
                      type="time"
                      value={timeline.settings.workingHours.start}
                      onChange={(e) => updateTimeline('settings.workingHours.start', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Working Hours End
                    </label>
                    <input
                      type="time"
                      value={timeline.settings.workingHours.end}
                      onChange={(e) => updateTimeline('settings.workingHours.end', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timeline.settings.weekends}
                      onChange={(e) => updateTimeline('settings.weekends', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include weekends</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timeline.settings.autoSave}
                      onChange={(e) => updateTimeline('settings.autoSave', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Auto-save changes</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timeline.settings.notifications}
                      onChange={(e) => updateTimeline('settings.notifications', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable notifications</span>
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

TimelineCreation.displayName = 'TimelineCreation';

// Timeline Creation Demo Component
interface TimelineCreationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const TimelineCreationDemo = React.forwardRef<HTMLDivElement, TimelineCreationDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [timeline, setTimeline] = useState<Partial<TimelineData>>({});

    const handleTimelineUpdate = (updatedTimeline: TimelineData) => {
      setTimeline(updatedTimeline);
      console.log('Timeline updated:', updatedTimeline);
    };

    const mockTimeline: Partial<TimelineData> = {
      id: 'timeline-1',
      title: 'Paris Adventure Timeline',
      description: 'A detailed timeline for our Paris adventure',
      tripId: 'trip-1',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-22'),
      timezone: 'Europe/Paris',
      events: [],
      milestones: [],
      phases: [],
      settings: {
        viewMode: 'timeline',
        timeFormat: '24h',
        workingHours: { start: '09:00', end: '18:00' },
        weekends: true,
        timezone: 'Europe/Paris',
        autoSave: true,
        notifications: true,
        colorScheme: 'default',
        customColors: []
      },
      collaborators: [],
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
          Timeline Creation Demo
        </h3>
        
        <TimelineCreation
          onTimelineUpdate={handleTimelineUpdate}
          initialTimeline={mockTimeline}
          showControls={true}
          showFilters={true}
          showExport={true}
          showCollaboration={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visual timeline creation with events, milestones, phases, and comprehensive schedule management.
            </p>
          </div>
        )}
      </div>
    );
  }
);

TimelineCreationDemo.displayName = 'TimelineCreationDemo';

// Export all components
export {
  timelineCreationVariants,
  type TimelineCreationProps,
  type TimelineData,
  type TimelineEvent,
  type Milestone,
  type TimelinePhase,
  type Collaborator,
  type Attachment,
  type TimelineSettings,
  type TimelineCreationDemoProps
};
