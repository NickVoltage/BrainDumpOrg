/**
 * Todo Service
 * 
 * Purpose: Business logic for to-do list operations (create, read, update, delete).
 * Coordinates between presentation layer and infrastructure layer.
 * 
 * Last Updated: 2024
 * Status: Active - Complete CRUD operations
 */

// Comment 200: Todo Service - Main Entry Point for Todo Operations
// This service handles all business logic for to-do list operations.
// Manages todo items with Do dates and Due dates, priorities, and completion status.
//
// Intended Interactions:
// - Called by: src/renderer/features/todos/components/TodoList.tsx (Comment 202)
// - Called by: src/renderer/features/todos/hooks/useTodo.ts (Comment 204)
// - Calls: src/renderer/features/todos/storage/todo-storage.ts (Comment 201)
// - Updates: src/renderer/stores/todo-store.ts (Zustand store) - when implemented
//
// Logic Flow:
// 1. Component/hook calls service method
// 2. Service validates input
// 3. Service calls storage layer
// 4. Service updates Zustand store (when implemented)
// 5. Service returns Result<T, E> to caller
//
// Related Comments:
// - Comment 202 (TodoList.tsx - component that calls this service)
// - Comment 204 (useTodo.ts - hook that wraps this service)
// - Comment 201 (todo-storage.ts - storage implementation)

import type { TodoItem, TodoFilter, TodoSort, TodoPriority, TodoStatus } from '../types';
import { todoStorage } from '../storage/todo-storage';
import type { Result } from '../../../shared/types/result.types';

/**
 * Validate todo data
 */
function validateTodo(todo: Partial<TodoItem>): Result<void, Error> {
  if (!todo.title || todo.title.trim().length === 0) {
    return { ok: false, error: new Error('Todo title is required') };
  }
  if (todo.title.length > 500) {
    return { ok: false, error: new Error('Todo title must be 500 characters or less') };
  }
  if (todo.doDate && todo.dueDate && todo.doDate > todo.dueDate) {
    return { ok: false, error: new Error('Do date must be before or equal to Due date') };
  }
  return { ok: true, value: undefined };
}

/**
 * Filter todos based on filter criteria
 */
function filterTodos(todos: TodoItem[], filter: TodoFilter): TodoItem[] {
  return todos.filter(todo => {
    // Status filter
    if (filter.status && filter.status !== 'all' && todo.status !== filter.status) {
      return false;
    }

    // Priority filter
    if (filter.priority && filter.priority !== 'all' && todo.priority !== filter.priority) {
      return false;
    }

    // Do date filter
    if (filter.doDateFrom && todo.doDate && todo.doDate < filter.doDateFrom) {
      return false;
    }
    if (filter.doDateTo && todo.doDate && todo.doDate > filter.doDateTo) {
      return false;
    }

    // Due date filter
    if (filter.dueDateFrom && todo.dueDate && todo.dueDate < filter.dueDateFrom) {
      return false;
    }
    if (filter.dueDateTo && todo.dueDate && todo.dueDate > filter.dueDateTo) {
      return false;
    }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      if (!todo.tags || !filter.tags.some(tag => todo.tags!.includes(tag))) {
        return false;
      }
    }

    // Project filter
    if (filter.projectId && todo.projectId !== filter.projectId) {
      return false;
    }

    // Search query filter
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const matchesTitle = todo.title.toLowerCase().includes(query);
      const matchesDescription = todo.description?.toLowerCase().includes(query) || false;
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort todos based on sort criteria
 */
function sortTodos(todos: TodoItem[], sort: TodoSort): TodoItem[] {
  const sorted = [...todos];
  sorted.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sort.field) {
      case 'doDate':
        aValue = a.doDate?.getTime() || 0;
        bValue = b.doDate?.getTime() || 0;
        break;
      case 'dueDate':
        aValue = a.dueDate?.getTime() || 0;
        bValue = b.dueDate?.getTime() || 0;
        break;
      case 'priority':
        const priorityOrder: Record<TodoPriority, number> = { low: 1, medium: 2, high: 3, urgent: 4 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'createdAt':
        aValue = a.createdAt.getTime();
        bValue = b.createdAt.getTime();
        break;
      case 'updatedAt':
        aValue = a.updatedAt.getTime();
        bValue = b.updatedAt.getTime();
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return sort.order === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sort.order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return sorted;
}

export const todoService = {
  /**
   * Get all todos with optional filtering and sorting
   */
  async getTodos(filter?: TodoFilter, sort?: TodoSort): Promise<Result<TodoItem[], Error>> {
    try {
      const result = await todoStorage.getAllTodos();
      if (!result.ok) {
        return result;
      }

      let todos = result.value;

      // Apply filters
      if (filter) {
        todos = filterTodos(todos, filter);
      }

      // Apply sorting
      if (sort) {
        todos = sortTodos(todos, sort);
      } else {
        // Default sort: due date (ascending), then priority (descending)
        todos = sortTodos(todos, { field: 'dueDate', order: 'asc' });
        todos = sortTodos(todos, { field: 'priority', order: 'desc' });
      }

      return { ok: true, value: todos };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error : new Error('Failed to get todos') };
    }
  },

  /**
   * Get a single todo by ID
   */
  async getTodo(id: string): Promise<Result<TodoItem | null, Error>> {
    return todoStorage.getTodoById(id);
  },

  /**
   * Create a new todo
   */
  async createTodo(todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'completedAt'>): Promise<Result<TodoItem, Error>> {
    const validation = validateTodo(todo);
    if (!validation.ok) {
      return validation;
    }

    const newTodo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'> = {
      ...todo,
      status: 'incomplete',
    };

    return todoStorage.createTodo(newTodo);
  },

  /**
   * Update an existing todo
   */
  async updateTodo(id: string, updates: Partial<Omit<TodoItem, 'id' | 'createdAt'>>): Promise<Result<TodoItem, Error>> {
    // Get existing todo to validate
    const existingResult = await todoStorage.getTodoById(id);
    if (!existingResult.ok) {
      return existingResult;
    }
    if (!existingResult.value) {
      return { ok: false, error: new Error('Todo not found') };
    }

    const updatedTodo = { ...existingResult.value, ...updates };
    const validation = validateTodo(updatedTodo);
    if (!validation.ok) {
      return validation;
    }

    return todoStorage.updateTodo(id, updates);
  },

  /**
   * Delete a todo
   */
  async deleteTodo(id: string): Promise<Result<void, Error>> {
    return todoStorage.deleteTodo(id);
  },

  /**
   * Delete multiple todos
   */
  async deleteTodos(ids: string[]): Promise<Result<void, Error>> {
    return todoStorage.deleteTodos(ids);
  },

  /**
   * Mark todo as completed
   */
  async markComplete(id: string): Promise<Result<TodoItem, Error>> {
    return todoStorage.updateTodo(id, {
      status: 'completed',
      completedAt: new Date(),
    });
  },

  /**
   * Mark todo as incomplete
   */
  async markIncomplete(id: string): Promise<Result<TodoItem, Error>> {
    return todoStorage.updateTodo(id, {
      status: 'incomplete',
      completedAt: undefined,
    });
  },

  /**
   * Toggle todo completion status
   */
  async toggleComplete(id: string): Promise<Result<TodoItem, Error>> {
    const result = await todoStorage.getTodoById(id);
    if (!result.ok || !result.value) {
      return { ok: false, error: new Error('Todo not found') };
    }

    if (result.value.status === 'completed') {
      return this.markIncomplete(id);
    } else {
      return this.markComplete(id);
    }
  },
};
