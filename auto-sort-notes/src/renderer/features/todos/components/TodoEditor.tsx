/**
 * Todo Editor Component
 * 
 * Purpose: Form component for creating and editing to-do items.
 * 
 * Last Updated: 2024
 * Status: Active - Complete editor form
 */

// Comment 206: Todo Editor Component - Create/Edit Todo Form
// This component provides a form interface for creating and editing to-do items.
// Handles todo title, Do date, Due date, priority, and description.
//
// Intended Interactions:
// - Uses: src/renderer/features/todos/services/todo-service.ts (Comment 200)
// - Uses: src/renderer/features/todos/hooks/useTodo.ts (Comment 204)
// - Handles: Todo creation, editing
//
// Related Comments:
// - Comment 200 (todo-service.ts - service called by this component)
// - Comment 204 (useTodo.ts - hook used by this component)

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useTodo } from '../hooks/useTodo';
import type { TodoItem, TodoPriority } from '../types';
import { format } from 'date-fns';

interface TodoEditorProps {
  todo?: TodoItem;
  onSave?: (todo: TodoItem) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const TodoEditor = ({ todo, onSave, onCancel, onClose }: TodoEditorProps) => {
  const { createTodo, updateTodo, loading } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [doDate, setDoDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [tags, setTags] = useState<string>('');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setDoDate(todo.doDate ? format(todo.doDate, 'yyyy-MM-dd') : '');
      setDueDate(todo.dueDate ? format(todo.dueDate, 'yyyy-MM-dd') : '');
      setPriority(todo.priority);
      setTags(todo.tags?.join(', ') || '');
    }
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    const todoData = {
      title: title.trim(),
      description: description.trim() || undefined,
      doDate: doDate ? new Date(doDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
      tags: tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
    };

    if (todo) {
      // Update existing todo
      const result = await updateTodo(todo.id, todoData);
      if (result.ok && onSave) {
        onSave(result.value);
      }
    } else {
      // Create new todo
      const result = await createTodo(todoData);
      if (result.ok && onSave) {
        onSave(result.value);
      }
    }

    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCancel}>
      <div
        className="bg-background border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto m-4"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
            {todo ? 'Edit Todo' : 'New Todo'}
          </h2>
          <button
            onClick={handleCancel}
            className="p-1 rounded hover:bg-muted transition-colors"
            style={{ color: 'var(--color-foreground)' }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-foreground)' }}
            >
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
              placeholder="Enter todo title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-foreground)' }}
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded border resize-none"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
              placeholder="Enter todo description (optional)"
            />
          </div>

          {/* Dates and Priority Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Do Date */}
            <div>
              <label
                htmlFor="doDate"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-foreground)' }}
              >
                Do Date
              </label>
              <input
                id="doDate"
                type="date"
                value={doDate}
                onChange={(e) => setDoDate(e.target.value)}
                className="w-full px-3 py-2 rounded border"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-foreground)' }}
              >
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded border"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-foreground)' }}
              >
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TodoPriority)}
                className="w-full px-3 py-2 rounded border"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-foreground)' }}
            >
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-foreground)',
                border: '1px solid var(--color-border)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-4 py-2 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
                border: 'none',
              }}
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : todo ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
