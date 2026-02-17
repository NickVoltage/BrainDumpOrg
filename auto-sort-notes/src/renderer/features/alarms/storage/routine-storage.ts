/**
 * Routine Storage
 * 
 * Purpose: Data persistence for routines.
 * Stores routine data in SQLite database (or localStorage for now).
 * 
 * Last Updated: 2024
 * Status: Active - In-memory storage with localStorage persistence
 */

// Comment 317: Routine Storage - Routine Data Persistence
// This module handles SQLite operations for routines.
// Routines group alarms, timers, and reminders that activate based on custom conditions.
// Currently uses localStorage for persistence until SQLite is fully implemented.
//
// Intended Interactions:
// - Called by: src/renderer/features/alarms/services/routine-service.ts (Comment 318)
// - Uses: src/renderer/shared/storage/database.ts (Comment 001) - when SQLite is ready
// - Stores: Routines in SQLite 'routines' table (or localStorage for now)
//
// Related Comments:
// - Comment 318 (routine-service.ts - service that calls this)
// - Comment 001 (database.ts - database connection)

import type { Routine } from '../types';
import type { Result } from '../../../shared/types/result.types';

const STORAGE_KEY = 'routines';

// In-memory store (will be replaced with SQLite)
let routinesStore: Routine[] = [];

// Load from localStorage on initialization
function loadFromStorage(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      routinesStore = parsed.map((routine: any) => ({
        ...routine,
        createdAt: new Date(routine.createdAt),
        updatedAt: new Date(routine.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load routines from storage:', error);
    routinesStore = [];
  }
}

// Save to localStorage
function saveToStorage(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routinesStore));
  } catch (error) {
    console.error('Failed to save routines to storage:', error);
  }
}

// Initialize on module load
loadFromStorage();

export const routineStorage = {
  async getAllRoutines(): Promise<Result<Routine[], Error>> {
    try {
      return { ok: true, value: [...routinesStore] };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get routines') };
    }
  },

  async getRoutineById(id: string): Promise<Result<Routine | null, Error>> {
    try {
      const routine = routinesStore.find(r => r.id === id);
      return { ok: true, value: routine || null };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get routine') };
    }
  },

  async createRoutine(routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Routine, Error>> {
    try {
      const now = new Date();
      const newRoutine: Routine = {
        ...routine,
        id: `routine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      routinesStore.push(newRoutine);
      saveToStorage();
      return { ok: true, value: newRoutine };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to create routine') };
    }
  },

  async updateRoutine(id: string, updates: Partial<Omit<Routine, 'id' | 'createdAt'>>): Promise<Result<Routine, Error>> {
    try {
      const index = routinesStore.findIndex(r => r.id === id);
      if (index === -1) {
        return { ok: false, error: new Error('Routine not found') };
      }
      const updatedRoutine: Routine = {
        ...routinesStore[index],
        ...updates,
        updatedAt: new Date(),
      };
      routinesStore[index] = updatedRoutine;
      saveToStorage();
      return { ok: true, value: updatedRoutine };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to update routine') };
    }
  },

  async deleteRoutine(id: string): Promise<Result<void, Error>> {
    try {
      const index = routinesStore.findIndex(r => r.id === id);
      if (index === -1) {
        return { ok: false, error: new Error('Routine not found') };
      }
      routinesStore.splice(index, 1);
      saveToStorage();
      return { ok: true, value: undefined };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to delete routine') };
    }
  },
};

