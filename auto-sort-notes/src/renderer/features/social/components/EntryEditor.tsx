/**
 * Entry Editor Component
 * 
 * Purpose: Form component for creating and editing contact entries.
 * 
 * Last Updated: 2024
 * Status: Active - Complete entry editor
 */

// Comment 408: Entry Editor Component - Create/Edit Contact Entry Form
// This component provides a form interface for creating and editing contact entries.
// Handles entry type, title, content, and custom date.
//
// Intended Interactions:
// - Used by: ContactDetail component (Comment 406)
// - Uses: useContact hook (Comment 403) for entry operations
//
// Related Comments:
// - Comment 403 (useContact.ts - hook used by this component)
// - Comment 406 (ContactDetail.tsx - parent component)

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { ContactEntry, ContactEntryType } from '../types';
import { format } from 'date-fns';

interface EntryEditorProps {
  entry?: ContactEntry;
  entryType?: ContactEntryType;
  onSave: (entry: Omit<ContactEntry, 'id' | 'contactId' | 'createdAt' | 'updatedAt' | 'dateEntered'>) => void;
  onCancel: () => void;
  onClose: () => void;
}

const entryTypeLabels: Record<ContactEntryType, string> = {
  general: 'General',
  social: 'Social',
  education: 'Education',
  experience: 'Experience',
  interaction: 'Interaction Journal',
  custom: 'Custom',
};

export const EntryEditor = ({ entry, entryType, onSave, onCancel, onClose }: EntryEditorProps) => {
  const [type, setType] = useState<ContactEntryType>(entry?.type || entryType || 'general');
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [customDate, setCustomDate] = useState<string>(
    entry?.customDate ? format(entry.customDate, 'yyyy-MM-dd') : ''
  );

  useEffect(() => {
    if (entry) {
      setType(entry.type);
      setTitle(entry.title);
      setContent(entry.content);
      setCustomDate(entry.customDate ? format(entry.customDate, 'yyyy-MM-dd') : '');
    } else if (entryType) {
      setType(entryType);
    }
  }, [entry, entryType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Title and content are required.');
      return;
    }

    onSave({
      type,
      title: title.trim(),
      content: content.trim(),
      customDate: customDate ? new Date(customDate) : undefined,
      metadata: entry?.metadata,
    });

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
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
            {entry ? 'Edit Entry' : 'New Entry'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 rounded hover:bg-muted transition-colors"
            style={{ color: 'var(--color-foreground)' }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Entry Type */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContactEntryType)}
              className="px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
            >
              {Object.entries(entryTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label
              htmlFor="entryTitle"
              className="text-sm font-medium"
              style={{ color: 'var(--color-foreground)' }}
            >
              Title *
            </label>
            <input
              id="entryTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
              placeholder="Enter entry title"
            />
          </div>

          {/* Custom Date */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label
              htmlFor="customDate"
              className="text-sm font-medium"
              style={{ color: 'var(--color-foreground)' }}
            >
              Date (Optional)
            </label>
            <input
              id="customDate"
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
            />
          </div>

          {/* Content */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
            <label
              htmlFor="entryContent"
              className="text-sm font-medium pt-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              Content *
            </label>
            <textarea
              id="entryContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="px-3 py-2 rounded border resize-y"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
              placeholder="Enter entry content..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button
              type="button"
              onClick={onCancel}
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
              disabled={!title.trim() || !content.trim()}
              className="px-4 py-2 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
                border: 'none',
              }}
            >
              <Save className="w-4 h-4" />
              {entry ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

