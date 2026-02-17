/**
 * Alarm Service
 * 
 * Purpose: Business logic for alarm operations (create, read, update, delete).
 * Handles alarm scheduling, recurrence patterns, and routine associations.
 * 
 * Last Updated: 2024
 * Status: Active - Complete alarm operations
 */

// Comment 302: Alarm Service - Main Entry Point for Alarm Operations
// This service handles all business logic for alarm operations.
// Manages alarm scheduling, recurrence patterns, next trigger calculations, and routine associations.
//
// Intended Interactions:
// - Called by: src/renderer/features/alarms/components/AlarmList.tsx (Comment 312)
// - Called by: src/renderer/features/alarms/hooks/useAlarm.ts (Comment 307)
// - Calls: src/renderer/features/alarms/storage/alarm-storage.ts (Comment 303)
//
// Logic Flow:
// 1. Component/hook calls service method
// 2. Service validates input and calculates next trigger time
// 3. Service calls storage layer
// 4. Service returns Result<T, E> to caller
//
// Related Comments:
// - Comment 303 (alarm-storage.ts - storage implementation)
// - Comment 307 (useAlarm.ts - hook that wraps this service)
// - Comment 312 (AlarmList.tsx - component that calls this service)

import type { Alarm, AlarmFilter, RecurrencePattern } from '../types';
import { alarmStorage } from '../storage/alarm-storage';
import type { Result } from '../../../shared/types/result.types';

/**
 * Calculate next trigger time based on recurrence pattern
 */
function calculateNextTrigger(alarmTime: Date, recurring?: RecurrencePattern): Date | undefined {
  if (!recurring) {
    // One-time alarm - next trigger is the alarm time if it's in the future
    return alarmTime > new Date() ? alarmTime : undefined;
  }

  const now = new Date();
  let nextTrigger = new Date(alarmTime);

  switch (recurring.frequency) {
    case 'daily':
      const interval = recurring.interval || 1;
      while (nextTrigger <= now) {
        nextTrigger = new Date(nextTrigger.getTime() + interval * 24 * 60 * 60 * 1000);
      }
      break;

    case 'weekly':
      const daysOfWeek = recurring.daysOfWeek || [alarmTime.getDay()];
      const currentDay = now.getDay();
      const daysUntilNext = daysOfWeek
        .map(day => (day - currentDay + 7) % 7)
        .filter(days => days > 0)
        .sort((a, b) => a - b)[0] || (7 - currentDay + daysOfWeek[0]);
      nextTrigger = new Date(now);
      nextTrigger.setDate(nextTrigger.getDate() + daysUntilNext);
      nextTrigger.setHours(alarmTime.getHours(), alarmTime.getMinutes(), alarmTime.getSeconds(), 0);
      break;

    case 'monthly':
      const daysOfMonth = recurring.daysOfMonth || [alarmTime.getDate()];
      nextTrigger = new Date(now);
      const currentDate = now.getDate();
      const nextDay = daysOfMonth.find(day => day >= currentDate) || daysOfMonth[0];
      nextTrigger.setDate(nextDay);
      nextTrigger.setHours(alarmTime.getHours(), alarmTime.getMinutes(), alarmTime.getSeconds(), 0);
      if (nextTrigger <= now) {
        nextTrigger.setMonth(nextTrigger.getMonth() + 1);
      }
      break;

    case 'yearly':
      nextTrigger = new Date(now);
      nextTrigger.setMonth(alarmTime.getMonth(), alarmTime.getDate());
      nextTrigger.setHours(alarmTime.getHours(), alarmTime.getMinutes(), alarmTime.getSeconds(), 0);
      if (nextTrigger <= now) {
        nextTrigger.setFullYear(nextTrigger.getFullYear() + 1);
      }
      break;

    default:
      return undefined;
  }

  // Check end date
  if (recurring.endDate && nextTrigger > recurring.endDate) {
    return undefined;
  }

  return nextTrigger;
}

/**
 * Filter alarms based on filter criteria
 */
function filterAlarms(alarms: Alarm[], filter: AlarmFilter): Alarm[] {
  return alarms.filter(alarm => {
    if (filter.enabled !== undefined && alarm.enabled !== filter.enabled) {
      return false;
    }
    if (filter.routineId && alarm.routineId !== filter.routineId) {
      return false;
    }
    if (filter.dateFrom && alarm.alarmTime < filter.dateFrom) {
      return false;
    }
    if (filter.dateTo && alarm.alarmTime > filter.dateTo) {
      return false;
    }
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      if (!alarm.title.toLowerCase().includes(query)) {
        return false;
      }
    }
    return true;
  });
}

export const alarmService = {
  /**
   * Get all alarms with optional filtering
   */
  async getAlarms(filter?: AlarmFilter): Promise<Result<Alarm[], Error>> {
    try {
      const result = await alarmStorage.getAllAlarms();
      if (!result.ok) {
        return result;
      }

      let alarms = result.value;

      if (filter) {
        alarms = filterAlarms(alarms, filter);
      }

      return { ok: true, value: alarms };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get alarms') };
    }
  },

  /**
   * Get a single alarm by ID
   */
  async getAlarm(id: string): Promise<Result<Alarm | null, Error>> {
    return alarmStorage.getAlarmById(id);
  },

  /**
   * Create a new alarm
   */
  async createAlarm(alarm: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt' | 'snoozeCount' | 'nextTrigger'>): Promise<Result<Alarm, Error>> {
    if (!alarm.title || alarm.title.trim().length === 0) {
      return { ok: false, error: new Error('Alarm title is required') };
    }

    const nextTrigger = calculateNextTrigger(alarm.alarmTime, alarm.recurring);

    const newAlarm: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt'> = {
      ...alarm,
      snoozeCount: 0,
      nextTrigger,
    };

    return alarmStorage.createAlarm(newAlarm);
  },

  /**
   * Update an existing alarm
   */
  async updateAlarm(id: string, updates: Partial<Omit<Alarm, 'id' | 'createdAt'>>): Promise<Result<Alarm, Error>> {
    const existingResult = await alarmStorage.getAlarmById(id);
    if (!existingResult.ok || !existingResult.value) {
      return { ok: false, error: new Error('Alarm not found') };
    }

    const existing = existingResult.value;
    const alarmTime = updates.alarmTime || existing.alarmTime;
    const recurring = updates.recurring !== undefined ? updates.recurring : existing.recurring;

    // Recalculate next trigger if alarm time or recurrence changed
    const nextTrigger = (updates.alarmTime !== undefined || updates.recurring !== undefined)
      ? calculateNextTrigger(alarmTime, recurring)
      : existing.nextTrigger;

    return alarmStorage.updateAlarm(id, {
      ...updates,
      nextTrigger,
    });
  },

  /**
   * Delete an alarm
   */
  async deleteAlarm(id: string): Promise<Result<void, Error>> {
    return alarmStorage.deleteAlarm(id);
  },

  /**
   * Enable an alarm
   */
  async enableAlarm(id: string): Promise<Result<Alarm, Error>> {
    return alarmStorage.updateAlarm(id, { enabled: true });
  },

  /**
   * Disable an alarm
   */
  async disableAlarm(id: string): Promise<Result<Alarm, Error>> {
    return alarmStorage.updateAlarm(id, { enabled: false });
  },

  /**
   * Snooze an alarm
   */
  async snoozeAlarm(id: string, snoozeDuration?: number): Promise<Result<Alarm, Error>> {
    const result = await alarmStorage.getAlarmById(id);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Alarm not found') };
    }

    const alarm = result.value;
    const duration = snoozeDuration || alarm.snoozeDuration;
    const nextTrigger = new Date(Date.now() + duration * 60 * 1000);

    return alarmStorage.updateAlarm(id, {
      snoozeCount: alarm.snoozeCount + 1,
      nextTrigger,
    });
  },

  /**
   * Dismiss an alarm (mark as triggered and calculate next occurrence)
   */
  async dismissAlarm(id: string): Promise<Result<Alarm, Error>> {
    const result = await alarmStorage.getAlarmById(id);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Alarm not found') };
    }

    const alarm = result.value;
    const now = new Date();
    const nextTrigger = calculateNextTrigger(alarm.alarmTime, alarm.recurring);

    return alarmStorage.updateAlarm(id, {
      lastTriggered: now,
      nextTrigger,
      snoozeCount: 0,
    });
  },
};
