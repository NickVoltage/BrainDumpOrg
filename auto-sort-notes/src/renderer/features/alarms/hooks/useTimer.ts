/**
 * useTimer Hook
 * 
 * Purpose: React hook for timer operations.
 * 
 * Last Updated: 2024
 * Status: Active - Complete timer operations
 */

// Comment 308: useTimer Hook - Timer Operations
// This hook provides React-friendly interface for timer operations.
// Wraps timer-service.ts methods with React state management.
//
// Intended Interactions:
// - Used by: TimerDisplay component (Comment 310)
// - Used by: TimerControls component (Comment 311)
// - Uses: timer-service.ts (Comment 300) for business logic
//
// Related Comments:
// - Comment 300 (timer-service.ts - service used by this hook)
// - Comment 310 (TimerDisplay.tsx - component that uses this hook)
// - Comment 311 (TimerControls.tsx - component that uses this hook)

import { useState, useCallback, useEffect } from 'react';
import { timerService } from '../services/timer-service';
import type { Timer, TimerFilter } from '../types';
import type { Result } from '../../../shared/types/result.types';

export function useTimer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getTimers = useCallback(async (filter?: TimerFilter): Promise<Result<Timer[], Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await timerService.getTimers(filter);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get timers');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const getTimer = useCallback(async (id: string): Promise<Result<Timer | null, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await timerService.getTimer(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get timer');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const createTimer = useCallback(async (timer: Omit<Timer, 'id' | 'createdAt' | 'updatedAt' | 'state' | 'elapsedSeconds'>): Promise<Result<Timer, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await timerService.createTimer(timer);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create timer');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTimer = useCallback(async (id: string, updates: Partial<Omit<Timer, 'id' | 'createdAt'>>): Promise<Result<Timer, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await timerService.updateTimer(id, updates);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update timer');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTimer = useCallback(async (id: string): Promise<Result<void, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await timerService.deleteTimer(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete timer');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const startTimer = useCallback(async (id: string): Promise<Result<Timer, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await timerService.startTimer(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start timer');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const pauseTimer = useCallback(async (id: string): Promise<Result<Timer, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await timerService.pauseTimer(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to pause timer');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const stopTimer = useCallback(async (id: string): Promise<Result<Timer, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await timerService.stopTimer(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to stop timer');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetTimer = useCallback(async (id: string): Promise<Result<Timer, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await timerService.resetTimer(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reset timer');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getTimers,
    getTimer,
    createTimer,
    updateTimer,
    deleteTimer,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
  };
}
