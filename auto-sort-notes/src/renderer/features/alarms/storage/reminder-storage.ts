/**
 * Reminder Storage
 * 
 * Purpose: Data persistence for reminders.
 * Stores reminder data in SQLite database (or localStorage for now).
 * 
 * Last Updated: 2024
 * Status: Active - In-memory storage with localStorage persistence
 */

// Comment 305: Reminder Storage - Reminder Data Persistence
// This module handles SQLite operations for reminders.
// Reminders are stored in the 'reminders' table with time, note associations, routine associations, etc.
// Currently uses localStorage for persistence until SQLite is fully implemented.
//
// Intended Interactions:
// - Called by: src/renderer/features/alarms/services/reminder-service.ts (Comment 304)
// - Uses: src/renderer/shared/storage/database.ts (Comment 001) - when SQLite is ready
// - Stores: Reminders in SQLite 'reminders' table (or localStorage for now)
//
// Related Comments:
// - Comment 304 (reminder-service.ts - service that calls this)
// - Comment 001 (database.ts - database connection)

import type { Reminder } from '../types';
import type { Result } from '../../../shared/types/result.types';

const STORAGE_KEY = 'reminders';

// In-memory store (will be replaced with SQLite)
let remindersStore: Reminder[] = [];

// Load from localStorage on initialization
function loadFromStorage(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      remindersStore = parsed.map((reminder: any) => ({
        ...reminder,
        reminderTime: new Date(reminder.reminderTime),
        lastTriggered: reminder.lastTriggered ? new Date(reminder.lastTriggered) : undefined,
        nextTrigger: reminder.nextTrigger ? new Date(reminder.nextTrigger) : undefined,
        createdAt: new Date(reminder.createdAt),
        updatedAt: new Date(reminder.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load reminders from storage:', error);
    remindersStore = [];
  }
}

// Save to localStorage
function saveToStorage(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remindersStore));
  } catch (error) {
    console.error('Failed to save reminders to storage:', error);
  }
}

// Initialize on module load
loadFromStorage();

export const reminderStorage = {
  async getAllReminders(): Promise<Result<Reminder[], Error>> {
    try {
      return { ok: true, value: [...remindersStore] };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get reminders') };
    }
  },

  async getReminderById(id: string): Promise<Result<Reminder | null, Error>> {
    try {
      const reminder = remindersStore.find(r => r.id === id);
      return { ok: true, value: reminder || null };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get reminder') };
    }
  },

  async createReminder(reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Reminder, Error>> {
    try {
      const now = new Date();
      const newReminder: Reminder = {
        ...reminder,
        id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      remindersStore.push(newReminder);
      saveToStorage();
      return { ok: true, value: newReminder };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to create reminder') };
    }
  },

  async updateReminder(id: string, updates: Partial<Omit<Reminder, 'id' | 'createdAt'>>): Promise<Result<Reminder, Error>> {
    try {
      const index = remindersStore.findIndex(r => r.id === id);
      if (index === -1) {
        return { ok: false, error: new Error('Reminder not found') };
      }
      const updatedReminder: Reminder = {
        ...remindersStore[index],
        ...updates,
        updatedAt: new Date(),
      };
      remindersStore[index] = updatedReminder;
      saveToStorage();
      return { ok: true, value: updatedReminder };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to update reminder') };
    }
  },

  async deleteReminder(id: string): Promise<Result<void, Error>> {
    try {
      const index = remindersStore.findIndex(r => r.id === id);
      if (index === -1) {
        return { ok: false, error: new Error('Reminder not found') };
      }
      remindersStore.splice(index, 1);
      saveToStorage();
      return { ok: true, value: undefined };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to delete reminder') };
    }
  },
};
