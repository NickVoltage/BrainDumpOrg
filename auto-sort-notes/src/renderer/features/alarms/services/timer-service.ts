/**
 * Timer Service
 * 
 * Purpose: Business logic for timer operations (create, read, update, delete, control).
 * Coordinates between presentation layer and infrastructure layer.
 * 
 * Last Updated: 2024
 * Status: Active - Complete timer operations
 */

// Comment 300: Timer Service - Main Entry Point for Timer Operations
// This service handles all business logic for timer operations.
// Manages timer state, duration, elapsed time, and routine associations.
//
// Intended Interactions:
// - Called by: src/renderer/features/alarms/components/TimerControls.tsx (Comment 311)
// - Called by: src/renderer/features/alarms/hooks/useTimer.ts (Comment 308)
// - Calls: src/renderer/features/alarms/storage/timer-storage.ts (Comment 301)
//
// Logic Flow:
// 1. Component/hook calls service method
// 2. Service validates input and manages timer state
// 3. Service calls storage layer
// 4. Service returns Result<T, E> to caller
//
// Related Comments:
// - Comment 301 (timer-storage.ts - storage implementation)
// - Comment 308 (useTimer.ts - hook that wraps this service)
// - Comment 311 (TimerControls.tsx - component that calls this service)

import type { Timer, TimerFilter, TimerType } from '../types';
import { timerStorage } from '../storage/timer-storage';
import type { Result } from '../../../shared/types/result.types';

/**
 * Filter timers based on filter criteria
 */
function filterTimers(timers: Timer[], filter: TimerFilter): Timer[] {
  return timers.filter(timer => {
    if (filter.state && timer.state !== filter.state) {
      return false;
    }
    if (filter.timerType && timer.timerType !== filter.timerType) {
      return false;
    }
    if (filter.routineId && timer.routineId !== filter.routineId) {
      return false;
    }
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      if (!timer.name.toLowerCase().includes(query)) {
        return false;
      }
    }
    return true;
  });
}

export const timerService = {
  /**
   * Get all timers with optional filtering
   */
  async getTimers(filter?: TimerFilter): Promise<Result<Timer[], Error>> {
    try {
      const result = await timerStorage.getAllTimers();
      if (!result.ok) {
        return result;
      }

      let timers = result.value;

      if (filter) {
        timers = filterTimers(timers, filter);
      }

      return { ok: true, value: timers };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get timers') };
    }
  },

  /**
   * Get a single timer by ID
   */
  async getTimer(id: string): Promise<Result<Timer | null, Error>> {
    return timerStorage.getTimerById(id);
  },

  /**
   * Create a new timer
   */
  async createTimer(timer: Omit<Timer, 'id' | 'createdAt' | 'updatedAt' | 'state' | 'elapsedSeconds'>): Promise<Result<Timer, Error>> {
    if (!timer.name || timer.name.trim().length === 0) {
      return { ok: false, error: new Error('Timer name is required') };
    }
    if (timer.duration <= 0) {
      return { ok: false, error: new Error('Timer duration must be greater than 0') };
    }

    const newTimer: Omit<Timer, 'id' | 'createdAt' | 'updatedAt'> = {
      ...timer,
      state: 'idle',
      elapsedSeconds: 0,
    };

    return timerStorage.createTimer(newTimer);
  },

  /**
   * Update an existing timer
   */
  async updateTimer(id: string, updates: Partial<Omit<Timer, 'id' | 'createdAt'>>): Promise<Result<Timer, Error>> {
    return timerStorage.updateTimer(id, updates);
  },

  /**
   * Delete a timer
   */
  async deleteTimer(id: string): Promise<Result<void, Error>> {
    return timerStorage.deleteTimer(id);
  },

  /**
   * Start a timer
   */
  async startTimer(id: string): Promise<Result<Timer, Error>> {
    const result = await timerStorage.getTimerById(id);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Timer not found') };
    }

    const timer = result.value;
    const now = new Date();

    if (timer.state === 'running') {
      return { ok: true, value: timer }; // Already running
    }

    // Calculate elapsed time if resuming from paused
    let elapsedSeconds = timer.elapsedSeconds;
    if (timer.state === 'paused' && timer.pausedAt) {
      const pausedDuration = Math.floor((now.getTime() - timer.pausedAt.getTime()) / 1000);
      elapsedSeconds = timer.elapsedSeconds; // Keep existing elapsed time
    }

    return timerStorage.updateTimer(id, {
      state: 'running',
      startedAt: timer.startedAt || now,
      pausedAt: undefined,
      elapsedSeconds,
    });
  },

  /**
   * Pause a timer
   */
  async pauseTimer(id: string): Promise<Result<Timer, Error>> {
    const result = await timerStorage.getTimerById(id);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Timer not found') };
    }

    const timer = result.value;
    if (timer.state !== 'running') {
      return { ok: false, error: new Error('Timer is not running') };
    }

    const now = new Date();
    const elapsedSeconds = timer.elapsedSeconds + Math.floor((now.getTime() - (timer.startedAt?.getTime() || now.getTime())) / 1000);

    return timerStorage.updateTimer(id, {
      state: 'paused',
      pausedAt: now,
      elapsedSeconds,
    });
  },

  /**
   * Stop a timer
   */
  async stopTimer(id: string): Promise<Result<Timer, Error>> {
    const result = await timerStorage.getTimerById(id);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Timer not found') };
    }

    const timer = result.value;
    const now = new Date();

    // Calculate final elapsed time
    let elapsedSeconds = timer.elapsedSeconds;
    if (timer.state === 'running' && timer.startedAt) {
      elapsedSeconds = timer.elapsedSeconds + Math.floor((now.getTime() - timer.startedAt.getTime()) / 1000);
    }

    const isCompleted = timer.timerType === 'countdown' && elapsedSeconds >= timer.duration;

    return timerStorage.updateTimer(id, {
      state: isCompleted ? 'completed' : 'idle',
      elapsedSeconds: isCompleted ? timer.duration : elapsedSeconds,
      pausedAt: undefined,
      startedAt: undefined,
      completedAt: isCompleted ? now : undefined,
    });
  },

  /**
   * Reset a timer
   */
  async resetTimer(id: string): Promise<Result<Timer, Error>> {
    return timerStorage.updateTimer(id, {
      state: 'idle',
      elapsedSeconds: 0,
      startedAt: undefined,
      pausedAt: undefined,
      completedAt: undefined,
    });
  },
};
