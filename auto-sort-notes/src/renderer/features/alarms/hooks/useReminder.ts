/**
 * useReminder Hook
 * 
 * Purpose: React hook for reminder operations.
 * 
 * Last Updated: 2024
 * Status: Active - Complete reminder operations
 */

// Comment 309: useReminder Hook - Reminder Operations
// This hook provides React-friendly interface for reminder operations.
// Wraps reminder-service.ts methods with React state management.
//
// Intended Interactions:
// - Used by: ReminderList component (Comment 313)
// - Used by: ReminderEditor component
// - Uses: reminder-service.ts (Comment 304) for business logic
//
// Related Comments:
// - Comment 304 (reminder-service.ts - service used by this hook)
// - Comment 313 (ReminderList.tsx - component that uses this hook)

import { useState, useCallback } from 'react';
import { reminderService } from '../services/reminder-service';
import type { Reminder, ReminderFilter } from '../types';
import type { Result } from '../../../shared/types/result.types';

export function useReminder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getReminders = useCallback(async (filter?: ReminderFilter): Promise<Result<Reminder[], Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await reminderService.getReminders(filter);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get reminders');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const getReminder = useCallback(async (id: string): Promise<Result<Reminder | null, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await reminderService.getReminder(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get reminder');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const createReminder = useCallback(async (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'snoozeCount' | 'nextTrigger'>): Promise<Result<Reminder, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await reminderService.createReminder(reminder);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create reminder');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReminder = useCallback(async (id: string, updates: Partial<Omit<Reminder, 'id' | 'createdAt'>>): Promise<Result<Reminder, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await reminderService.updateReminder(id, updates);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update reminder');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReminder = useCallback(async (id: string): Promise<Result<void, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await reminderService.deleteReminder(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete reminder');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const enableReminder = useCallback(async (id: string): Promise<Result<Reminder, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await reminderService.enableReminder(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to enable reminder');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const disableReminder = useCallback(async (id: string): Promise<Result<Reminder, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await reminderService.disableReminder(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to disable reminder');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const snoozeReminder = useCallback(async (id: string, snoozeDuration?: number): Promise<Result<Reminder, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await reminderService.snoozeReminder(id, snoozeDuration);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to snooze reminder');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const dismissReminder = useCallback(async (id: string): Promise<Result<Reminder, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await reminderService.dismissReminder(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to dismiss reminder');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getReminders,
    getReminder,
    createReminder,
    updateReminder,
    deleteReminder,
    enableReminder,
    disableReminder,
    snoozeReminder,
    dismissReminder,
  };
}
