/**
 * Timer Storage
 * 
 * Purpose: Data persistence for timers.
 * Stores timer data in SQLite database (or localStorage for now).
 * 
 * Last Updated: 2024
 * Status: Active - In-memory storage with localStorage persistence
 */

// Comment 301: Timer Storage - Timer Data Persistence
// This module handles SQLite operations for timers.
// Timers are stored in the 'timers' table with duration, state, routine associations, etc.
// Currently uses localStorage for persistence until SQLite is fully implemented.
//
// Intended Interactions:
// - Called by: src/renderer/features/alarms/services/timer-service.ts (Comment 300)
// - Uses: src/renderer/shared/storage/database.ts (Comment 001) - when SQLite is ready
// - Stores: Timers in SQLite 'timers' table (or localStorage for now)
//
// Related Comments:
// - Comment 300 (timer-service.ts - service that calls this)
// - Comment 001 (database.ts - database connection)

import type { Timer } from '../types';
import type { Result } from '../../../shared/types/result.types';

const STORAGE_KEY = 'timers';

// In-memory store (will be replaced with SQLite)
let timersStore: Timer[] = [];

// Load from localStorage on initialization
function loadFromStorage(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      timersStore = parsed.map((timer: any) => ({
        ...timer,
        startedAt: timer.startedAt ? new Date(timer.startedAt) : undefined,
        pausedAt: timer.pausedAt ? new Date(timer.pausedAt) : undefined,
        completedAt: timer.completedAt ? new Date(timer.completedAt) : undefined,
        createdAt: new Date(timer.createdAt),
        updatedAt: new Date(timer.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load timers from storage:', error);
    timersStore = [];
  }
}

// Save to localStorage
function saveToStorage(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timersStore));
  } catch (error) {
    console.error('Failed to save timers to storage:', error);
  }
}

// Initialize on module load
loadFromStorage();

export const timerStorage = {
  async getAllTimers(): Promise<Result<Timer[], Error>> {
    try {
      return { ok: true, value: [...timersStore] };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get timers') };
    }
  },

  async getTimerById(id: string): Promise<Result<Timer | null, Error>> {
    try {
      const timer = timersStore.find(t => t.id === id);
      return { ok: true, value: timer || null };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get timer') };
    }
  },

  async createTimer(timer: Omit<Timer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Timer, Error>> {
    try {
      const now = new Date();
      const newTimer: Timer = {
        ...timer,
        id: `timer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      timersStore.push(newTimer);
      saveToStorage();
      return { ok: true, value: newTimer };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to create timer') };
    }
  },

  async updateTimer(id: string, updates: Partial<Omit<Timer, 'id' | 'createdAt'>>): Promise<Result<Timer, Error>> {
    try {
      const index = timersStore.findIndex(t => t.id === id);
      if (index === -1) {
        return { ok: false, error: new Error('Timer not found') };
      }
      const updatedTimer: Timer = {
        ...timersStore[index],
        ...updates,
        updatedAt: new Date(),
      };
      timersStore[index] = updatedTimer;
      saveToStorage();
      return { ok: true, value: updatedTimer };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to update timer') };
    }
  },

  async deleteTimer(id: string): Promise<Result<void, Error>> {
    try {
      const index = timersStore.findIndex(t => t.id === id);
      if (index === -1) {
        return { ok: false, error: new Error('Timer not found') };
      }
      timersStore.splice(index, 1);
      saveToStorage();
      return { ok: true, value: undefined };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to delete timer') };
    }
  },
};
