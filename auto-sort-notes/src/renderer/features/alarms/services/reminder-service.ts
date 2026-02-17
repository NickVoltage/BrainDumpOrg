/**
 * Reminder Service
 * 
 * Purpose: Business logic for reminder operations (create, read, update, delete).
 * Handles reminder scheduling, recurrence patterns, and routine associations.
 * 
 * Last Updated: 2024
 * Status: Active - Complete reminder operations
 */

// Comment 304: Reminder Service - Main Entry Point for Reminder Operations
// This service handles all business logic for reminder operations.
// Manages reminder scheduling, recurrence patterns, note associations, and routine associations.
//
// Intended Interactions:
// - Called by: src/renderer/features/alarms/components/ReminderList.tsx (Comment 313)
// - Called by: src/renderer/features/alarms/hooks/useReminder.ts (Comment 309)
// - Calls: src/renderer/features/alarms/storage/reminder-storage.ts (Comment 305)
//
// Logic Flow:
// 1. Component/hook calls service method
// 2. Service validates input and calculates next trigger time
// 3. Service calls storage layer
// 4. Service returns Result<T, E> to caller
//
// Related Comments:
// - Comment 305 (reminder-storage.ts - storage implementation)
// - Comment 309 (useReminder.ts - hook that wraps this service)
// - Comment 313 (ReminderList.tsx - component that calls this service)

import type { Reminder, ReminderFilter, RecurrencePattern } from '../types';
import { reminderStorage } from '../storage/reminder-storage';
import { alarmService } from './alarm-service'; // Reuse recurrence calculation
import type { Result } from '../../../shared/types/result.types';

/**
 * Calculate next trigger time based on recurrence pattern
 * (Reuses logic from alarm service)
 */
function calculateNextTrigger(reminderTime: Date, recurring?: RecurrencePattern): Date | undefined {
  if (!recurring) {
    return reminderTime > new Date() ? reminderTime : undefined;
  }

  const now = new Date();
  let nextTrigger = new Date(reminderTime);

  switch (recurring.frequency) {
    case 'daily':
      const interval = recurring.interval || 1;
      while (nextTrigger <= now) {
        nextTrigger = new Date(nextTrigger.getTime() + interval * 24 * 60 * 60 * 1000);
      }
      break;

    case 'weekly':
      const daysOfWeek = recurring.daysOfWeek || [reminderTime.getDay()];
      const currentDay = now.getDay();
      const daysUntilNext = daysOfWeek
        .map(day => (day - currentDay + 7) % 7)
        .filter(days => days > 0)
        .sort((a, b) => a - b)[0] || (7 - currentDay + daysOfWeek[0]);
      nextTrigger = new Date(now);
      nextTrigger.setDate(nextTrigger.getDate() + daysUntilNext);
      nextTrigger.setHours(reminderTime.getHours(), reminderTime.getMinutes(), reminderTime.getSeconds(), 0);
      break;

    case 'monthly':
      const daysOfMonth = recurring.daysOfMonth || [reminderTime.getDate()];
      nextTrigger = new Date(now);
      const currentDate = now.getDate();
      const nextDay = daysOfMonth.find(day => day >= currentDate) || daysOfMonth[0];
      nextTrigger.setDate(nextDay);
      nextTrigger.setHours(reminderTime.getHours(), reminderTime.getMinutes(), reminderTime.getSeconds(), 0);
      if (nextTrigger <= now) {
        nextTrigger.setMonth(nextTrigger.getMonth() + 1);
      }
      break;

    case 'yearly':
      nextTrigger = new Date(now);
      nextTrigger.setMonth(reminderTime.getMonth(), reminderTime.getDate());
      nextTrigger.setHours(reminderTime.getHours(), reminderTime.getMinutes(), reminderTime.getSeconds(), 0);
      if (nextTrigger <= now) {
        nextTrigger.setFullYear(nextTrigger.getFullYear() + 1);
      }
      break;

    default:
      return undefined;
  }

  if (recurring.endDate && nextTrigger > recurring.endDate) {
    return undefined;
  }

  return nextTrigger;
}

/**
 * Filter reminders based on filter criteria
 */
function filterReminders(reminders: Reminder[], filter: ReminderFilter): Reminder[] {
  return reminders.filter(reminder => {
    if (filter.enabled !== undefined && reminder.enabled !== filter.enabled) {
      return false;
    }
    if (filter.noteId && reminder.noteId !== filter.noteId) {
      return false;
    }
    if (filter.routineId && reminder.routineId !== filter.routineId) {
      return false;
    }
    if (filter.dateFrom && reminder.reminderTime < filter.dateFrom) {
      return false;
    }
    if (filter.dateTo && reminder.reminderTime > filter.dateTo) {
      return false;
    }
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      if (!reminder.title.toLowerCase().includes(query)) {
        return false;
      }
    }
    return true;
  });
}

export const reminderService = {
  /**
   * Get all reminders with optional filtering
   */
  async getReminders(filter?: ReminderFilter): Promise<Result<Reminder[], Error>> {
    try {
      const result = await reminderStorage.getAllReminders();
      if (!result.ok) {
        return result;
      }

      let reminders = result.value;

      if (filter) {
        reminders = filterReminders(reminders, filter);
      }

      return { ok: true, value: reminders };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get reminders') };
    }
  },

  /**
   * Get a single reminder by ID
   */
  async getReminder(id: string): Promise<Result<Reminder | null, Error>> {
    return reminderStorage.getReminderById(id);
  },

  /**
   * Create a new reminder
   */
  async createReminder(reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'snoozeCount' | 'nextTrigger'>): Promise<Result<Reminder, Error>> {
    if (!reminder.title || reminder.title.trim().length === 0) {
      return { ok: false, error: new Error('Reminder title is required') };
    }
    if (!reminder.noteId || reminder.noteId.trim().length === 0) {
      return { ok: false, error: new Error('Note ID is required for reminders') };
    }

    const nextTrigger = calculateNextTrigger(reminder.reminderTime, reminder.recurring);

    const newReminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'> = {
      ...reminder,
      snoozeCount: 0,
      nextTrigger,
    };

    return reminderStorage.createReminder(newReminder);
  },

  /**
   * Update an existing reminder
   */
  async updateReminder(id: string, updates: Partial<Omit<Reminder, 'id' | 'createdAt'>>): Promise<Result<Reminder, Error>> {
    const existingResult = await reminderStorage.getReminderById(id);
    if (!existingResult.ok || !existingResult.value) {
      return { ok: false, error: new Error('Reminder not found') };
    }

    const existing = existingResult.value;
    const reminderTime = updates.reminderTime || existing.reminderTime;
    const recurring = updates.recurring !== undefined ? updates.recurring : existing.recurring;

    // Recalculate next trigger if reminder time or recurrence changed
    const nextTrigger = (updates.reminderTime !== undefined || updates.recurring !== undefined)
      ? calculateNextTrigger(reminderTime, recurring)
      : existing.nextTrigger;

    return reminderStorage.updateReminder(id, {
      ...updates,
      nextTrigger,
    });
  },

  /**
   * Delete a reminder
   */
  async deleteReminder(id: string): Promise<Result<void, Error>> {
    return reminderStorage.deleteReminder(id);
  },

  /**
   * Enable a reminder
   */
  async enableReminder(id: string): Promise<Result<Reminder, Error>> {
    return reminderStorage.updateReminder(id, { enabled: true });
  },

  /**
   * Disable a reminder
   */
  async disableReminder(id: string): Promise<Result<Reminder, Error>> {
    return reminderStorage.updateReminder(id, { enabled: false });
  },

  /**
   * Snooze a reminder
   */
  async snoozeReminder(id: string, snoozeDuration?: number): Promise<Result<Reminder, Error>> {
    const result = await reminderStorage.getReminderById(id);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Reminder not found') };
    }

    const reminder = result.value;
    const duration = snoozeDuration || reminder.snoozeDuration;
    const nextTrigger = new Date(Date.now() + duration * 60 * 1000);

    return reminderStorage.updateReminder(id, {
      snoozeCount: reminder.snoozeCount + 1,
      nextTrigger,
    });
  },

  /**
   * Dismiss a reminder (mark as triggered and calculate next occurrence)
   */
  async dismissReminder(id: string): Promise<Result<Reminder, Error>> {
    const result = await reminderStorage.getReminderById(id);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Reminder not found') };
    }

    const reminder = result.value;
    const now = new Date();
    const nextTrigger = calculateNextTrigger(reminder.reminderTime, reminder.recurring);

    return reminderStorage.updateReminder(id, {
      lastTriggered: now,
      nextTrigger,
      snoozeCount: 0,
    });
  },
};
