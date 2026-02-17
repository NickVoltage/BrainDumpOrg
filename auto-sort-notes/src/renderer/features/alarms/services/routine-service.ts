/**
 * Routine Service
 * 
 * Purpose: Business logic for routine operations (create, read, update, delete).
 * Handles routine condition evaluation and managing alarm/timer/reminder associations.
 * 
 * Last Updated: 2024
 * Status: Active - Complete routine operations
 */

// Comment 318: Routine Service - Main Entry Point for Routine Operations
// This service handles all business logic for routine operations.
// Manages routine conditions, alarm/timer/reminder associations, and routine activation.
//
// Intended Interactions:
// - Called by: Routine management components (future)
// - Calls: src/renderer/features/alarms/storage/routine-storage.ts (Comment 317)
// - Uses: alarm-service, timer-service, reminder-service for managing associations
//
// Logic Flow:
// 1. Component calls service method
// 2. Service validates input and evaluates conditions
// 3. Service calls storage layer
// 4. Service returns Result<T, E> to caller
//
// Related Comments:
// - Comment 317 (routine-storage.ts - storage implementation)
// - Comment 302 (alarm-service.ts - for alarm associations)
// - Comment 300 (timer-service.ts - for timer associations)
// - Comment 304 (reminder-service.ts - for reminder associations)

import type { Routine, RoutineCondition } from '../types';
import { routineStorage } from '../storage/routine-storage';
import type { Result } from '../../../shared/types/result.types';

/**
 * Evaluate if a routine condition is currently met
 */
function evaluateCondition(condition: RoutineCondition): boolean {
  const now = new Date();

  switch (condition.type) {
    case 'time':
      const conditionTime = new Date(condition.value);
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const targetTime = conditionTime.getHours() * 60 + conditionTime.getMinutes();
      return currentTime === targetTime;

    case 'dayOfWeek':
      return now.getDay() === condition.value;

    case 'dayOfMonth':
      return now.getDate() === condition.value;

    case 'dateRange':
      const { start, end } = condition.value;
      const startDate = new Date(start);
      const endDate = new Date(end);
      return now >= startDate && now <= endDate;

    case 'custom':
      // Future: Custom condition evaluation logic
      return true;

    default:
      return false;
  }
}

/**
 * Check if a routine should be active based on its conditions
 */
export function isRoutineActive(routine: Routine): boolean {
  if (!routine.enabled) {
    return false;
  }

  // All conditions must be met for routine to be active
  return routine.conditions.every(condition => evaluateCondition(condition));
}

export const routineService = {
  /**
   * Get all routines
   */
  async getRoutines(): Promise<Result<Routine[], Error>> {
    return routineStorage.getAllRoutines();
  },

  /**
   * Get a single routine by ID
   */
  async getRoutine(id: string): Promise<Result<Routine | null, Error>> {
    return routineStorage.getRoutineById(id);
  },

  /**
   * Create a new routine
   */
  async createRoutine(routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Routine, Error>> {
    if (!routine.name || routine.name.trim().length === 0) {
      return { ok: false, error: new Error('Routine name is required') };
    }

    return routineStorage.createRoutine(routine);
  },

  /**
   * Update an existing routine
   */
  async updateRoutine(id: string, updates: Partial<Omit<Routine, 'id' | 'createdAt'>>): Promise<Result<Routine, Error>> {
    return routineStorage.updateRoutine(id, updates);
  },

  /**
   * Delete a routine
   */
  async deleteRoutine(id: string): Promise<Result<void, Error>> {
    return routineStorage.deleteRoutine(id);
  },

  /**
   * Add an alarm to a routine
   */
  async addAlarmToRoutine(routineId: string, alarmId: string): Promise<Result<Routine, Error>> {
    const result = await routineStorage.getRoutineById(routineId);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Routine not found') };
    }

    const routine = result.value;
    if (routine.alarmIds.includes(alarmId)) {
      return { ok: true, value: routine }; // Already in routine
    }

    return routineStorage.updateRoutine(routineId, {
      alarmIds: [...routine.alarmIds, alarmId],
    });
  },

  /**
   * Remove an alarm from a routine
   */
  async removeAlarmFromRoutine(routineId: string, alarmId: string): Promise<Result<Routine, Error>> {
    const result = await routineStorage.getRoutineById(routineId);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Routine not found') };
    }

    const routine = result.value;
    return routineStorage.updateRoutine(routineId, {
      alarmIds: routine.alarmIds.filter(id => id !== alarmId),
    });
  },

  /**
   * Add a timer to a routine
   */
  async addTimerToRoutine(routineId: string, timerId: string): Promise<Result<Routine, Error>> {
    const result = await routineStorage.getRoutineById(routineId);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Routine not found') };
    }

    const routine = result.value;
    if (routine.timerIds.includes(timerId)) {
      return { ok: true, value: routine }; // Already in routine
    }

    return routineStorage.updateRoutine(routineId, {
      timerIds: [...routine.timerIds, timerId],
    });
  },

  /**
   * Remove a timer from a routine
   */
  async removeTimerFromRoutine(routineId: string, timerId: string): Promise<Result<Routine, Error>> {
    const result = await routineStorage.getRoutineById(routineId);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Routine not found') };
    }

    const routine = result.value;
    return routineStorage.updateRoutine(routineId, {
      timerIds: routine.timerIds.filter(id => id !== timerId),
    });
  },

  /**
   * Add a reminder to a routine
   */
  async addReminderToRoutine(routineId: string, reminderId: string): Promise<Result<Routine, Error>> {
    const result = await routineStorage.getRoutineById(routineId);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Routine not found') };
    }

    const routine = result.value;
    if (routine.reminderIds.includes(reminderId)) {
      return { ok: true, value: routine }; // Already in routine
    }

    return routineStorage.updateRoutine(routineId, {
      reminderIds: [...routine.reminderIds, reminderId],
    });
  },

  /**
   * Remove a reminder from a routine
   */
  async removeReminderFromRoutine(routineId: string, reminderId: string): Promise<Result<Routine, Error>> {
    const result = await routineStorage.getRoutineById(routineId);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Routine not found') };
    }

    const routine = result.value;
    return routineStorage.updateRoutine(routineId, {
      reminderIds: routine.reminderIds.filter(id => id !== reminderId),
    });
  },

  /**
   * Check if a routine is currently active
   */
  async isRoutineActive(routineId: string): Promise<Result<boolean, Error>> {
    const result = await routineStorage.getRoutineById(routineId);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Routine not found') };
    }

    return { ok: true, value: isRoutineActive(result.value) };
  },
};

