/**
 * useTodoList Hook
 * 
 * Purpose: React hook for todo list operations with filtering and sorting.
 * 
 * Last Updated: 2024
 * Status: Active - Complete list operations
 */

// Comment 205: useTodoList Hook - Todo List Operations
// This hook provides React-friendly interface for todo list operations.
// Handles loading todos with filtering, sorting, and state management.
//
// Intended Interactions:
// - Used by: TodoList component (Comment 202)
// - Uses: todo-service.ts (Comment 200) for business logic
//
// Logic Flow:
// 1. Hook loads todos on mount or when filters/sort change
// 2. Calls todo-service.ts getTodos with filters and sort
// 3. Updates local state with results
// 4. Provides refresh method to reload todos
//
// Related Comments:
// - Comment 200 (todo-service.ts - service used by this hook)
// - Comment 202 (TodoList.tsx - component that uses this hook)

import { useState, useEffect, useCallback } from 'react';
import { todoService } from '../services/todo-service';
import type { TodoItem, TodoFilter, TodoSort } from '../types';
import type { Result } from '../../../shared/types/result.types';

export function useTodoList(filter?: TodoFilter, sort?: TodoSort) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await todoService.getTodos(filter, sort);
      if (result.ok) {
        setTodos(result.value);
      } else {
        setError(result.error);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load todos');
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [filter, sort]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const refresh = useCallback(() => {
    loadTodos();
  }, [loadTodos]);

  return {
    todos,
    loading,
    error,
    refresh,
  };
}
