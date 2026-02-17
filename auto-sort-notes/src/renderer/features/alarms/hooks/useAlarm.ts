/**
 * useAlarm Hook
 * 
 * Purpose: React hook for alarm operations.
 * 
 * Last Updated: 2024
 * Status: Active - Complete alarm operations
 */

// Comment 307: useAlarm Hook - Alarm Operations
// This hook provides React-friendly interface for alarm operations.
// Wraps alarm-service.ts methods with React state management.
//
// Intended Interactions:
// - Used by: AlarmList component (Comment 312)
// - Used by: AlarmEditor component
// - Uses: alarm-service.ts (Comment 302) for business logic
//
// Related Comments:
// - Comment 302 (alarm-service.ts - service used by this hook)
// - Comment 312 (AlarmList.tsx - component that uses this hook)

import { useState, useCallback } from 'react';
import { alarmService } from '../services/alarm-service';
import type { Alarm, AlarmFilter } from '../types';
import type { Result } from '../../../shared/types/result.types';

export function useAlarm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAlarms = useCallback(async (filter?: AlarmFilter): Promise<Result<Alarm[], Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await alarmService.getAlarms(filter);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get alarms');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAlarm = useCallback(async (id: string): Promise<Result<Alarm | null, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await alarmService.getAlarm(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get alarm');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const createAlarm = useCallback(async (alarm: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt' | 'snoozeCount' | 'nextTrigger'>): Promise<Result<Alarm, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await alarmService.createAlarm(alarm);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create alarm');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAlarm = useCallback(async (id: string, updates: Partial<Omit<Alarm, 'id' | 'createdAt'>>): Promise<Result<Alarm, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await alarmService.updateAlarm(id, updates);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update alarm');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAlarm = useCallback(async (id: string): Promise<Result<void, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await alarmService.deleteAlarm(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete alarm');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const enableAlarm = useCallback(async (id: string): Promise<Result<Alarm, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await alarmService.enableAlarm(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to enable alarm');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const disableAlarm = useCallback(async (id: string): Promise<Result<Alarm, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await alarmService.disableAlarm(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to disable alarm');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const snoozeAlarm = useCallback(async (id: string, snoozeDuration?: number): Promise<Result<Alarm, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await alarmService.snoozeAlarm(id, snoozeDuration);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to snooze alarm');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const dismissAlarm = useCallback(async (id: string): Promise<Result<Alarm, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await alarmService.dismissAlarm(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to dismiss alarm');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAlarms,
    getAlarm,
    createAlarm,
    updateAlarm,
    deleteAlarm,
    enableAlarm,
    disableAlarm,
    snoozeAlarm,
    dismissAlarm,
  };
}
