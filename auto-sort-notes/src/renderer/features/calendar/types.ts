/**
 * Calendar Types
 * 
 * Purpose: TypeScript type definitions for calendar feature.
 * 
 * Last Updated: 2024
 * Status: Active - Event types with color support
 */

// Comment 110: Calendar Types - TypeScript Type Definitions
// This file defines TypeScript interfaces and types for calendar feature.
// Includes CalendarEvent, RecurrencePattern, CalendarView, EventColor, etc.
//
// Related Comments:
// - Comment 100 (calendar-service.ts - uses these types)
// - Comment 102 (CalendarView.tsx - uses these types)
// - Comment 2002 (CalendarMonth.tsx - displays events with colors)

/**
 * Event color options for visual distinction
 */
export type EventColor = 
  | 'blue'
  | 'green'
  | 'red'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'cyan'
  | 'gray'
  | 'indigo';

/**
 * Calendar event interface
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  color?: EventColor; // Color for event display
  emoji?: string; // Emoji icon for event (future feature)
  location?: string;
  recurrence?: RecurrencePattern;
  reminders?: Reminder[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Recurrence pattern for recurring events
 */
export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every N days/weeks/months/years
  endDate?: Date; // End date for recurrence
  count?: number; // Number of occurrences
  byDay?: string[]; // Days of week (e.g., ['MO', 'WE', 'FR'])
  byMonth?: number[]; // Months (1-12)
  byMonthDay?: number[]; // Days of month (1-31)
}

/**
 * Reminder for events
 */
export interface Reminder {
  id: string;
  minutesBefore: number; // Minutes before event to remind
  method: 'notification' | 'alarm' | 'email';
}

/**
 * Calendar view type
 */
export type CalendarViewType = 'month' | 'week' | 'day';

/**
 * Event color mapping for consistent styling
 */
export const EVENT_COLORS: Record<EventColor, {
  bg: string;
  text: string;
  border: string;
}> = {
  blue: {
    bg: 'bg-blue-500/30',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-500/50 border',
  },
  green: {
    bg: 'bg-green-500/30',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-500/50 border',
  },
  red: {
    bg: 'bg-red-500/30',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-500/50 border',
  },
  yellow: {
    bg: 'bg-yellow-500/30',
    text: 'text-yellow-800 dark:text-yellow-200',
    border: 'border-yellow-500/50 border',
  },
  purple: {
    bg: 'bg-purple-500/30',
    text: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-500/50 border',
  },
  orange: {
    bg: 'bg-orange-500/30',
    text: 'text-orange-800 dark:text-orange-200',
    border: 'border-orange-500/50 border',
  },
  pink: {
    bg: 'bg-pink-500/30',
    text: 'text-pink-800 dark:text-pink-200',
    border: 'border-pink-500/50 border',
  },
  cyan: {
    bg: 'bg-cyan-500/30',
    text: 'text-cyan-800 dark:text-cyan-200',
    border: 'border-cyan-500/50 border',
  },
  gray: {
    bg: 'bg-gray-500/30',
    text: 'text-gray-800 dark:text-gray-200',
    border: 'border-gray-500/50 border',
  },
  indigo: {
    bg: 'bg-indigo-500/30',
    text: 'text-indigo-800 dark:text-indigo-200',
    border: 'border-indigo-500/50 border',
  },
};
