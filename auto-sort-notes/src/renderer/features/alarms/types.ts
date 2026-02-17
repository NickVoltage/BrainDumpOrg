/**
 * Alarm/Timer Types
 * 
 * Purpose: TypeScript type definitions for alarm/timer feature.
 * 
 * Last Updated: 2024
 * Status: Active - Complete type definitions with routine support
 */

// Comment 316: Alarm/Timer Types - TypeScript Type Definitions
// This file defines TypeScript interfaces and types for alarm/timer feature.
// Includes Timer, Alarm, Reminder, and Routine types.
// Routines allow grouping alarms/timers that activate based on custom factors.
//
// Related Comments:
// - Comment 300 (timer-service.ts - uses these types)
// - Comment 302 (alarm-service.ts - uses these types)
// - Comment 304 (reminder-service.ts - uses these types)
// - Comment 318 (routine-service.ts - uses these types)

/**
 * Timer type (countdown or count-up)
 */
export type TimerType = 'countdown' | 'countup';

/**
 * Timer state
 */
export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

/**
 * Recurrence pattern for alarms
 */
export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval?: number; // Every N days/weeks/months/years
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday) for weekly
  daysOfMonth?: number[]; // 1-31 for monthly
  endDate?: Date; // End date for recurrence
  count?: number; // Number of occurrences
}

/**
 * Alarm sound/notification options
 */
export type AlarmSound = 'default' | 'gentle' | 'urgent' | 'custom';
export type AlarmNotificationMethod = 'sound' | 'visual' | 'both';

/**
 * Timer interface
 */
export interface Timer {
  id: string;
  name: string;
  duration: number; // Duration in seconds (for countdown)
  elapsedSeconds: number; // Elapsed time in seconds
  timerType: TimerType;
  state: TimerState;
  startedAt?: Date;
  pausedAt?: Date;
  completedAt?: Date;
  routineId?: string; // Optional association with routine
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Alarm interface
 */
export interface Alarm {
  id: string;
  title: string;
  alarmTime: Date; // When alarm should trigger
  recurring?: RecurrencePattern; // Recurrence pattern (null for one-time)
  enabled: boolean; // Whether alarm is active
  sound: AlarmSound;
  notificationMethod: AlarmNotificationMethod;
  snoozeDuration: number; // Snooze duration in minutes
  snoozeCount: number; // Number of times snoozed
  lastTriggered?: Date; // Last time alarm was triggered
  nextTrigger?: Date; // Next scheduled trigger time
  routineId?: string; // Optional association with routine
  noteId?: string; // Optional link to a note
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Reminder interface
 * Reminders can be standalone or linked to notes for context-aware alerts
 */
export interface Reminder {
  id: string;
  noteId?: string; // Optional link to a note (empty string or undefined for standalone reminders)
  title: string;
  reminderTime: Date; // When reminder should trigger
  recurring?: RecurrencePattern; // Recurrence pattern (null for one-time)
  enabled: boolean; // Whether reminder is active
  sound: AlarmSound;
  notificationMethod: AlarmNotificationMethod;
  snoozeDuration: number; // Snooze duration in minutes
  snoozeCount: number; // Number of times snoozed
  lastTriggered?: Date; // Last time reminder was triggered
  nextTrigger?: Date; // Next scheduled trigger time
  routineId?: string; // Optional association with routine
  notes?: string; // Optional user-entered notes
  displayImage?: string; // Optional image URL/path to display when reminder pops up
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Routine activation condition
 * Defines when a routine should be active
 */
export interface RoutineCondition {
  type: 'time' | 'dayOfWeek' | 'dayOfMonth' | 'dateRange' | 'custom';
  value: any; // Condition-specific value
  operator?: 'equals' | 'before' | 'after' | 'between' | 'in';
}

/**
 * Routine interface
 * Groups alarms and timers that activate based on custom conditions
 */
export interface Routine {
  id: string;
  name: string;
  description?: string;
  enabled: boolean; // Whether routine is active
  conditions: RoutineCondition[]; // Conditions that must be met for routine to be active
  alarmIds: string[]; // Alarms associated with this routine
  timerIds: string[]; // Timers associated with this routine
  reminderIds: string[]; // Reminders associated with this routine
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Alarm filter options
 */
export interface AlarmFilter {
  enabled?: boolean;
  routineId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

/**
 * Timer filter options
 */
export interface TimerFilter {
  state?: TimerState;
  timerType?: TimerType;
  routineId?: string;
  searchQuery?: string;
}

/**
 * Reminder filter options
 */
export interface ReminderFilter {
  enabled?: boolean;
  noteId?: string;
  routineId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}
