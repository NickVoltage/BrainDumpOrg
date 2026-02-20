/**
 * useTodo Hook
 * 
 * Purpose: React hook for individual todo operations.
 * 
 * Last Updated: 2024
 * Status: Active - Complete todo operations
 */

// Comment 204: useTodo Hook - Individual Todo Operations
// This hook provides React-friendly interface for individual todo operations.
// Wraps todo-service.ts methods with React state management.
//
// Intended Interactions:
// - Used by: TodoItem component (Comment 203)
// - Used by: TodoEditor component (Comment 206)
// - Uses: todo-service.ts (Comment 200) for business logic
//
// Logic Flow:
// 1. Hook provides methods for todo operations
// 2. Methods call todo-service.ts
// 3. Service returns Result<T, E>
// 4. Hook handles errors and updates state
//
// Related Comments:
// - Comment 200 (todo-service.ts - service used by this hook)
// - Comment 203 (TodoItem.tsx - component that uses this hook)
// - Comment 206 (TodoEditor.tsx - component that uses this hook)

import { useState, useCallback } from 'react';
import { todoService } from '../services/todo-service';
import type { TodoItem } from '../types';
import type { Result } from '../../../shared/types/result.types';

export function useTodo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getTodo = useCallback(async (id: string): Promise<Result<TodoItem | null, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await todoService.getTodo(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get todo');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'completedAt'>): Promise<Result<TodoItem, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await todoService.createTodo(todo);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create todo');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTodo = useCallback(async (id: string, updates: Partial<Omit<TodoItem, 'id' | 'createdAt'>>): Promise<Result<TodoItem, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await todoService.updateTodo(id, updates);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update todo');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTodo = useCallback(async (id: string): Promise<Result<void, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await todoService.deleteTodo(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete todo');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleComplete = useCallback(async (id: string): Promise<Result<TodoItem, Error>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await todoService.toggleComplete(id);
      if (!result.ok) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to toggle todo');
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  };
}
