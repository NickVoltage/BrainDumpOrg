/**
 * Todo Storage
 * 
 * Purpose: Data persistence for to-do list items.
 * Stores todo data in SQLite database (or localStorage for now).
 * 
 * Last Updated: 2024
 * Status: Active - In-memory storage with localStorage persistence
 */

// Comment 201: Todo Storage - Todo Data Persistence
// This module handles SQLite operations for to-do list items.
// Todo items are stored in the 'todos' table with Do dates, Due dates, priorities, etc.
// Currently uses localStorage for persistence until SQLite is fully implemented.
//
// Intended Interactions:
// - Called by: src/renderer/features/todos/services/todo-service.ts (Comment 200)
// - Uses: src/renderer/shared/storage/database.ts (Comment 001) - when SQLite is ready
// - Stores: Todo items in SQLite 'todos' table (or localStorage for now)
//
// Logic Flow:
// 1. Service calls storage method
// 2. Storage executes SQL query using database connection (or localStorage for now)
// 3. Handles database errors and returns Result<T, E>
// 4. Returns todo data to service layer
//
// Dependencies:
// - database.ts (Comment 001) - database connection (when ready)
// - result.types.ts (Comment 003) - error handling
//
// Related Files:
// - src/renderer/features/todos/services/todo-service.ts (calls this)
// - src/renderer/shared/storage/database.ts (uses for database operations when ready)
//
// Related Comments:
// - Comment 200 (todo-service.ts - service that calls this)
// - Comment 001 (database.ts - database connection)

import type { TodoItem } from '../types';
import type { Result } from '../../../shared/types/result.types';

const STORAGE_KEY = 'todos';

// In-memory store (will be replaced with SQLite)
let todosStore: TodoItem[] = [];

// Load from localStorage on initialization
function loadFromStorage(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      todosStore = parsed.map((todo: any) => ({
        ...todo,
        doDate: todo.doDate ? new Date(todo.doDate) : undefined,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load todos from storage:', error);
    todosStore = [];
  }
}

// Save to localStorage
function saveToStorage(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todosStore));
  } catch (error) {
    console.error('Failed to save todos to storage:', error);
  }
}

// Initialize on module load
loadFromStorage();

export const todoStorage = {
  /**
   * Get all todos
   */
  async getAllTodos(): Promise<Result<TodoItem[], Error>> {
    try {
      return { ok: true, value: [...todosStore] };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get todos') };
    }
  },

  /**
   * Get a single todo by ID
   */
  async getTodoById(id: string): Promise<Result<TodoItem | null, Error>> {
    try {
      const todo = todosStore.find(t => t.id === id);
      return { ok: true, value: todo || null };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get todo') };
    }
  },

  /**
   * Create a new todo
   */
  async createTodo(todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<TodoItem, Error>> {
    try {
      const now = new Date();
      const newTodo: TodoItem = {
        ...todo,
        id: `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      todosStore.push(newTodo);
      saveToStorage();
      return { ok: true, value: newTodo };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to create todo') };
    }
  },

  /**
   * Update an existing todo
   */
  async updateTodo(id: string, updates: Partial<Omit<TodoItem, 'id' | 'createdAt'>>): Promise<Result<TodoItem, Error>> {
    try {
      const index = todosStore.findIndex(t => t.id === id);
      if (index === -1) {
        return { ok: false, error: new Error('Todo not found') };
      }
      const updatedTodo: TodoItem = {
        ...todosStore[index],
        ...updates,
        updatedAt: new Date(),
      };
      todosStore[index] = updatedTodo;
      saveToStorage();
      return { ok: true, value: updatedTodo };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to update todo') };
    }
  },

  /**
   * Delete a todo
   */
  async deleteTodo(id: string): Promise<Result<void, Error>> {
    try {
      const index = todosStore.findIndex(t => t.id === id);
      if (index === -1) {
        return { ok: false, error: new Error('Todo not found') };
      }
      todosStore.splice(index, 1);
      saveToStorage();
      return { ok: true, value: undefined };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to delete todo') };
    }
  },

  /**
   * Delete multiple todos
   */
  async deleteTodos(ids: string[]): Promise<Result<void, Error>> {
    try {
      todosStore = todosStore.filter(t => !ids.includes(t.id));
      saveToStorage();
      return { ok: true, value: undefined };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to delete todos') };
    }
  },
};
