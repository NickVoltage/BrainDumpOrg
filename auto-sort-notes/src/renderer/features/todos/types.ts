/**
 * Todo Types
 * 
 * Purpose: TypeScript type definitions for todo feature.
 * 
 * Last Updated: 2024
 * Status: Active - Complete type definitions
 */

// Comment 209: Todo Types - TypeScript Type Definitions
// This file defines TypeScript interfaces and types for todo feature.
// Includes TodoItem, TodoPriority, TodoStatus, etc.
//
// Related Comments:
// - Comment 200 (todo-service.ts - uses these types)
// - Comment 201 (todo-storage.ts - stores these types)
// - Comment 202 (TodoList.tsx - displays these types)
// - Comment 203 (TodoItem.tsx - renders individual TodoItem)

/**
 * Priority levels for todos
 */
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Completion status for todos
 */
export type TodoStatus = 'incomplete' | 'completed';

/**
 * Todo item interface
 * Represents a single to-do item with Do date, Due date, priority, etc.
 */
export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  doDate?: Date; // "Do" date - when to start working on this
  dueDate?: Date; // "Due" date - when this must be completed
  priority: TodoPriority;
  status: TodoStatus;
  completedAt?: Date; // When the todo was marked as completed
  createdAt: Date;
  updatedAt: Date;
  tags?: string[]; // Optional tags for categorization
  projectId?: string; // Optional link to a project (from metadata)
  parentId?: string; // Optional parent todo for subtasks
  order?: number; // Optional order for manual sorting
}

/**
 * Todo filter options
 */
export interface TodoFilter {
  status?: TodoStatus | 'all';
  priority?: TodoPriority | 'all';
  doDateFrom?: Date;
  doDateTo?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  tags?: string[];
  projectId?: string;
  searchQuery?: string; // Search in title and description
}

/**
 * Todo sort options
 */
export type TodoSortField = 'doDate' | 'dueDate' | 'priority' | 'createdAt' | 'updatedAt' | 'title';
export type TodoSortOrder = 'asc' | 'desc';

export interface TodoSort {
  field: TodoSortField;
  order: TodoSortOrder;
}

/**
 * Todo grouping options
 */
export type TodoGroupBy = 'none' | 'doDate' | 'dueDate' | 'priority' | 'status' | 'project';

/**
 * Priority color mapping for UI
 */
export const PRIORITY_COLORS: Record<TodoPriority, {
  bg: string;
  text: string;
  border: string;
}> = {
  low: {
    bg: 'rgba(107, 114, 128, 0.2)', // gray
    text: 'var(--color-foreground)',
    border: 'rgba(107, 114, 128, 0.5)',
  },
  medium: {
    bg: 'rgba(59, 130, 246, 0.2)', // blue
    text: 'var(--color-foreground)',
    border: 'rgba(59, 130, 246, 0.5)',
  },
  high: {
    bg: 'rgba(234, 179, 8, 0.2)', // yellow
    text: 'var(--color-foreground)',
    border: 'rgba(234, 179, 8, 0.5)',
  },
  urgent: {
    bg: 'rgba(239, 68, 68, 0.2)', // red
    text: 'var(--color-foreground)',
    border: 'rgba(239, 68, 68, 0.5)',
  },
};
