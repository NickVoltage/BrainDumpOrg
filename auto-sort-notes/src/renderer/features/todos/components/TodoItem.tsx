/**
 * Todo Item Component
 * 
 * Purpose: Individual to-do item display component.
 * Shows todo details and handles interactions.
 * 
 * Last Updated: 2024
 * Status: Active - Complete todo item display
 */

// Comment 203: Todo Item Component - Individual Todo Display
// This component displays an individual to-do item with its details.
// Shows title, Do date, Due date, priority, completion status, and actions.
//
// Intended Interactions:
// - Used by: src/renderer/features/todos/components/TodoList.tsx (Comment 202)
// - Displays: Todo title, dates, priority, completion checkbox
// - Handles: Toggle completion, edit, delete
//
// Related Comments:
// - Comment 202 (TodoList.tsx - parent component)
// - Comment 204 (useTodo.ts - hook used for operations)

import { format } from 'date-fns';
import { Check, X, Edit2, Trash2, Calendar, Flag } from 'lucide-react';
import { useTodo } from '../hooks/useTodo';
import type { TodoItem } from '../types';
import { PRIORITY_COLORS } from '../types';
import { clsx } from 'clsx';

interface TodoItemProps {
  todo: TodoItem;
  onEdit?: (todo: TodoItem) => void;
  onDelete?: (id: string) => void;
  onToggleComplete?: (id: string) => void;
}

export const TodoItem = ({ todo, onEdit, onDelete, onToggleComplete }: TodoItemProps) => {
  const { toggleComplete, loading } = useTodo();

  const handleToggleComplete = async () => {
    if (onToggleComplete) {
      onToggleComplete(todo.id);
    } else {
      await toggleComplete(todo.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(todo);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(todo.id);
    }
  };

  const priorityColors = PRIORITY_COLORS[todo.priority];
  const isOverdue = todo.dueDate && todo.dueDate < new Date() && todo.status === 'incomplete';
  const isDueSoon = todo.dueDate && 
    todo.dueDate >= new Date() && 
    todo.dueDate <= new Date(Date.now() + 24 * 60 * 60 * 1000) && 
    todo.status === 'incomplete';

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border transition-colors',
        todo.status === 'completed' && 'opacity-60',
        isOverdue && 'border-red-500/50 bg-red-500/5',
        isDueSoon && !isOverdue && 'border-yellow-500/50 bg-yellow-500/5',
      )}
      style={{
        borderColor: isOverdue 
          ? 'rgba(239, 68, 68, 0.5)' 
          : isDueSoon 
          ? 'rgba(234, 179, 8, 0.5)' 
          : 'var(--color-border)',
        backgroundColor: isOverdue 
          ? 'rgba(239, 68, 68, 0.05)' 
          : isDueSoon 
          ? 'rgba(234, 179, 8, 0.05)' 
          : 'transparent',
      }}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggleComplete}
        disabled={loading}
        className={clsx(
          'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-0.5',
          todo.status === 'completed' && 'bg-primary border-primary',
        )}
        style={{
          backgroundColor: todo.status === 'completed' ? 'var(--color-primary)' : 'transparent',
          borderColor: todo.status === 'completed' ? 'var(--color-primary)' : 'var(--color-border)',
        }}
        aria-label={todo.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.status === 'completed' && (
          <Check className="w-3 h-3" style={{ color: 'var(--color-primary-foreground)' }} />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <div className="flex items-start gap-2 mb-1">
          <h3
            className={clsx(
              'text-base font-medium flex-1',
              todo.status === 'completed' && 'line-through text-muted-foreground',
            )}
            style={{
              color: todo.status === 'completed' 
                ? 'var(--color-muted-foreground)' 
                : 'var(--color-foreground)',
            }}
          >
            {todo.title}
          </h3>
          {/* Priority Badge */}
          <div
            className="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 flex-shrink-0"
            style={{
              backgroundColor: priorityColors.bg,
              color: priorityColors.text,
              borderColor: priorityColors.border,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <Flag className="w-3 h-3" />
            {todo.priority}
          </div>
        </div>

        {/* Description */}
        {todo.description && (
          <p
            className="text-sm mb-2 line-clamp-2"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            {todo.description}
          </p>
        )}

        {/* Dates */}
        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
          {todo.doDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Do: {format(todo.doDate, 'MMM d, yyyy')}</span>
            </div>
          )}
          {todo.dueDate && (
            <div
              className={clsx(
                'flex items-center gap-1',
                isOverdue && 'text-red-600 dark:text-red-400 font-semibold',
                isDueSoon && !isOverdue && 'text-yellow-600 dark:text-yellow-400 font-semibold',
              )}
            >
              <Calendar className="w-3 h-3" />
              <span>Due: {format(todo.dueDate, 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {todo.tags && todo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {todo.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded"
                style={{
                  backgroundColor: 'var(--color-muted)',
                  color: 'var(--color-foreground)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={handleEdit}
          className="p-1.5 rounded hover:bg-muted transition-colors"
          style={{ color: 'var(--color-foreground)' }}
          aria-label="Edit todo"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded hover:bg-muted transition-colors"
          style={{ color: 'var(--color-foreground)' }}
          aria-label="Delete todo"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
