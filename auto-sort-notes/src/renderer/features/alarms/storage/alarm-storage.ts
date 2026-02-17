/**
 * Alarm Storage
 * 
 * Purpose: Data persistence for alarms.
 * Stores alarm data in SQLite database (or localStorage for now).
 * 
 * Last Updated: 2024
 * Status: Active - In-memory storage with localStorage persistence
 */

// Comment 303: Alarm Storage - Alarm Data Persistence
// This module handles SQLite operations for alarms.
// Alarms are stored in the 'alarms' table with time, recurrence, routine associations, etc.
// Currently uses localStorage for persistence until SQLite is fully implemented.
//
// Intended Interactions:
// - Called by: src/renderer/features/alarms/services/alarm-service.ts (Comment 302)
// - Uses: src/renderer/shared/storage/database.ts (Comment 001) - when SQLite is ready
// - Stores: Alarms in SQLite 'alarms' table (or localStorage for now)
//
// Related Comments:
// - Comment 302 (alarm-service.ts - service that calls this)
// - Comment 001 (database.ts - database connection)

import type { Alarm } from '../types';
import type { Result } from '../../../shared/types/result.types';

const STORAGE_KEY = 'alarms';

// In-memory store (will be replaced with SQLite)
let alarmsStore: Alarm[] = [];

// Load from localStorage on initialization
function loadFromStorage(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      alarmsStore = parsed.map((alarm: any) => ({
        ...alarm,
        alarmTime: new Date(alarm.alarmTime),
        lastTriggered: alarm.lastTriggered ? new Date(alarm.lastTriggered) : undefined,
        nextTrigger: alarm.nextTrigger ? new Date(alarm.nextTrigger) : undefined,
        createdAt: new Date(alarm.createdAt),
        updatedAt: new Date(alarm.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load alarms from storage:', error);
    alarmsStore = [];
  }
}

// Save to localStorage
function saveToStorage(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarmsStore));
  } catch (error) {
    console.error('Failed to save alarms to storage:', error);
  }
}

// Initialize on module load
loadFromStorage();

export const alarmStorage = {
  async getAllAlarms(): Promise<Result<Alarm[], Error>> {
    try {
      return { ok: true, value: [...alarmsStore] };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get alarms') };
    }
  },

  async getAlarmById(id: string): Promise<Result<Alarm | null, Error>> {
    try {
      const alarm = alarmsStore.find(a => a.id === id);
      return { ok: true, value: alarm || null };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get alarm') };
    }
  },

  async createAlarm(alarm: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Alarm, Error>> {
    try {
      const now = new Date();
      const newAlarm: Alarm = {
        ...alarm,
        id: `alarm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      alarmsStore.push(newAlarm);
      saveToStorage();
      return { ok: true, value: newAlarm };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to create alarm') };
    }
  },

  async updateAlarm(id: string, updates: Partial<Omit<Alarm, 'id' | 'createdAt'>>): Promise<Result<Alarm, Error>> {
    try {
      const index = alarmsStore.findIndex(a => a.id === id);
      if (index === -1) {
        return { ok: false, error: new Error('Alarm not found') };
      }
      const updatedAlarm: Alarm = {
        ...alarmsStore[index],
        ...updates,
        updatedAt: new Date(),
      };
      alarmsStore[index] = updatedAlarm;
      saveToStorage();
      return { ok: true, value: updatedAlarm };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to update alarm') };
    }
  },

  async deleteAlarm(id: string): Promise<Result<void, Error>> {
    try {
      const index = alarmsStore.findIndex(a => a.id === id);
      if (index === -1) {
        return { ok: false, error: new Error('Alarm not found') };
      }
      alarmsStore.splice(index, 1);
      saveToStorage();
      return { ok: true, value: undefined };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to delete alarm') };
    }
  },
};
