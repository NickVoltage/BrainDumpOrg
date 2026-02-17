/**
 * Reminder Editor Component
 * 
 * Purpose: Form component for creating and editing reminders.
 * 
 * Last Updated: 2024
 * Status: Active - Complete reminder editor
 */

// Comment 315: Reminder Editor Component - Create/Edit Reminder Form
// This component provides a form interface for creating and editing reminders.
// Handles reminder title, time, recurrence, note association, sound, and routine association.
//
// Intended Interactions:
// - Uses: reminder-service.ts (Comment 304) for reminder operations
// - Uses: useReminder hook (Comment 309) for reminder operations
// - Handles: Reminder creation, editing, note association, routine association
//
// Related Comments:
// - Comment 304 (reminder-service.ts - service called by this component)
// - Comment 309 (useReminder.ts - hook used by this component)

import { useState, useEffect, useRef } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import { useReminder } from '../hooks/useReminder';
import type { Reminder, AlarmSound, AlarmNotificationMethod, RecurrencePattern } from '../types';
import { format } from 'date-fns';
import { NoteSelector } from './NoteSelector';

interface ReminderEditorProps {
  reminder?: Reminder;
  noteId?: string; // Pre-fill note ID if creating from a note
  onSave?: (reminder: Reminder) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const ReminderEditor = ({ reminder, noteId, onSave, onCancel, onClose }: ReminderEditorProps) => {
  const { createReminder, updateReminder, loading } = useReminder();
  const [title, setTitle] = useState('');
  const [reminderNoteId, setReminderNoteId] = useState<string | undefined>(noteId);
  const [reminderTime, setReminderTime] = useState<string>('');
  const [reminderDate, setReminderDate] = useState<string>('');
  const [recurring, setRecurring] = useState<boolean>(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [sound, setSound] = useState<AlarmSound>('default');
  const [notificationMethod, setNotificationMethod] = useState<AlarmNotificationMethod>('both');
  const [snoozeDuration, setSnoozeDuration] = useState(5);
  const [enabled, setEnabled] = useState(true);
  const [routineId, setRoutineId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [displayImageFile, setDisplayImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title);
      setReminderNoteId(reminder.noteId || undefined);
      const reminderDateTime = new Date(reminder.reminderTime);
      setReminderDate(format(reminderDateTime, 'yyyy-MM-dd'));
      setReminderTime(format(reminderDateTime, 'HH:mm'));
      setRecurring(!!reminder.recurring);
      if (reminder.recurring) {
        setRecurrenceFrequency(reminder.recurring.frequency);
      }
      setSound(reminder.sound);
      setNotificationMethod(reminder.notificationMethod);
      setSnoozeDuration(reminder.snoozeDuration);
      setEnabled(reminder.enabled);
      setRoutineId(reminder.routineId || '');
      setNotes(reminder.notes || '');
      setDisplayImage(reminder.displayImage || null);
    } else if (noteId) {
      // Pre-fill noteId if provided (e.g., from right-click context menu)
      setReminderNoteId(noteId);
    }
  }, [reminder, noteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    // Note ID is optional - no validation needed

    const dateTime = new Date(`${reminderDate}T${reminderTime}`);
    if (isNaN(dateTime.getTime())) {
      return;
    }

    const recurrence: RecurrencePattern | undefined = recurring
      ? { frequency: recurrenceFrequency }
      : undefined;

    const reminderData = {
      title: title.trim(),
      noteId: reminderNoteId?.trim() || undefined, // Optional - undefined if not provided
      reminderTime: dateTime,
      recurring: recurrence,
      enabled,
      sound,
      notificationMethod,
      snoozeDuration,
      routineId: routineId || undefined,
      notes: notes.trim() || undefined,
      displayImage: displayImage || undefined,
    };

    if (reminder) {
      // Update existing reminder
      const result = await updateReminder(reminder.id, reminderData);
      if (result.ok && onSave) {
        onSave(result.value);
      }
    } else {
      // Create new reminder
      const result = await createReminder(reminderData);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setDisplayImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setDisplayImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file');
      }
    }
  };

  const handleRemoveImage = () => {
    setDisplayImage(null);
    setDisplayImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            {reminder ? 'Edit Reminder' : 'New Reminder'}
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
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label
              htmlFor="title"
              className="text-sm font-medium"
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
              className="px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
              placeholder="Enter reminder title"
            />
          </div>

          {/* Association */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
            <label
              htmlFor="noteId"
              className="text-sm font-medium pt-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              Association
            </label>
            <div>
              <NoteSelector
                value={reminderNoteId}
                onChange={(noteId) => setReminderNoteId(noteId)}
                placeholder="Search for a note to associate..."
                disabled={!!noteId && !!reminderNoteId} // Disable if pre-filled from right-click
              />
              <p className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                Optionally associate this reminder with a note. Leave empty for standalone reminders.
              </p>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label
              className="text-sm font-medium"
              style={{ color: 'var(--color-foreground)' }}
            >
              Date & Time *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                id="reminderDate"
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                required
                className="px-3 py-2 rounded border"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
              <input
                id="reminderTime"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                required
                className="px-3 py-2 rounded border"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
            </div>
          </div>

          {/* Recurring */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
              Recurring
            </label>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  className="w-4 h-4"
                />
                <span style={{ color: 'var(--color-foreground)' }}>Enable recurrence</span>
              </label>
              {recurring && (
                <select
                  value={recurrenceFrequency}
                  onChange={(e) => setRecurrenceFrequency(e.target.value as any)}
                  className="mt-2 w-full px-3 py-2 rounded border"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              )}
            </div>
          </div>

          {/* Sound and Notification */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
              Sound
            </label>
            <select
              id="sound"
              value={sound}
              onChange={(e) => setSound(e.target.value as AlarmSound)}
              className="px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
            >
              <option value="default">Default</option>
              <option value="gentle">Gentle</option>
              <option value="urgent">Urgent</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
              Notification Method
            </label>
            <select
              id="notificationMethod"
              value={notificationMethod}
              onChange={(e) => setNotificationMethod(e.target.value as AlarmNotificationMethod)}
              className="px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
            >
              <option value="sound">Sound Only</option>
              <option value="visual">Visual Only</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Snooze Duration */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label
              htmlFor="snoozeDuration"
              className="text-sm font-medium"
              style={{ color: 'var(--color-foreground)' }}
            >
              Snooze Duration (minutes)
            </label>
            <input
              id="snoozeDuration"
              type="number"
              min="1"
              max="60"
              value={snoozeDuration}
              onChange={(e) => setSnoozeDuration(parseInt(e.target.value) || 5)}
              className="px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
            />
          </div>

          {/* Enabled */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
              Enabled
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              <span style={{ color: 'var(--color-foreground)' }}>Enable this reminder</span>
            </label>
          </div>

          {/* Routine Association (placeholder for future) */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label
              htmlFor="routineId"
              className="text-sm font-medium"
              style={{ color: 'var(--color-foreground)' }}
            >
              Routine (optional)
            </label>
            <input
              id="routineId"
              type="text"
              value={routineId}
              onChange={(e) => setRoutineId(e.target.value)}
              className="px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
              placeholder="Routine ID (future feature)"
            />
          </div>

          {/* Display Image */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-start">
            <label className="text-sm font-medium pt-2" style={{ color: 'var(--color-foreground)' }}>
              Display Image
            </label>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="displayImage"
              />
              {displayImage ? (
                <div className="space-y-2">
                  <div className="relative inline-block">
                    <img
                      src={displayImage}
                      alt="Display preview"
                      className="max-w-full max-h-48 rounded border"
                      style={{ borderColor: 'var(--color-border)' }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <label
                      htmlFor="displayImage"
                      className="px-3 py-2 rounded border cursor-pointer transition-colors"
                      style={{
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-foreground)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
                      }}
                    >
                      Change Image
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-2 rounded border transition-colors"
                      style={{
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-foreground)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="displayImage"
                  className="flex items-center gap-2 px-4 py-3 rounded border cursor-pointer transition-colors"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
                  }}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Select Image</span>
                </label>
              )}
              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                Image to display when reminder notification appears
              </p>
            </div>
          </div>

          {/* Notes Section - Label above field */}
          <div className="space-y-2">
            <label
              htmlFor="notes"
              className="block text-sm font-medium"
              style={{ color: 'var(--color-foreground)' }}
            >
              Notes:
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded border resize-y"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
              placeholder="Enter any additional notes for this reminder..."
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
              {loading ? 'Saving...' : reminder ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
