/**
 * Reminder List Component
 * 
 * Purpose: Displays list of reminders with management options.
 * 
 * Last Updated: 2024
 * Status: Active - Complete reminder list
 */

// Comment 313: Reminder List Component - Reminder List Display
// This component displays a list of reminders with their details and management options.
// Shows reminder title, time, note association, recurrence, enabled status, and routine association.
//
// Intended Interactions:
// - Used by: AlarmTimerTab component (Comment 309)
// - Uses: useReminder hook (Comment 309) for reminder operations
// - Displays: List of reminders with edit, delete, enable/disable, snooze, dismiss options
//
// Related Comments:
// - Comment 309 (AlarmTimerTab.tsx - parent component)
// - Comment 309 (useReminder.ts - hook used by this component)
// - Comment 315 (ReminderEditor.tsx - editor component)

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, Bell, BellOff, Clock, Repeat, X, FileText } from 'lucide-react';
import { useReminder } from '../hooks/useReminder';
import type { Reminder } from '../types';
import { clsx } from 'clsx';

interface ReminderListProps {
  onEdit?: (reminder: Reminder) => void;
  filter?: { enabled?: boolean; noteId?: string; routineId?: string };
}

export const ReminderList = ({ onEdit, filter }: ReminderListProps) => {
  const { getReminders, deleteReminder, enableReminder, disableReminder, snoozeReminder, dismissReminder, loading, error } = useReminder();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    loadReminders();
  }, [filter]);

  const loadReminders = async () => {
    const result = await getReminders(filter);
    if (result.ok) {
      setReminders(result.value);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      await deleteReminder(id);
      loadReminders();
    }
  };

  const handleToggleEnabled = async (reminder: Reminder) => {
    if (reminder.enabled) {
      await disableReminder(reminder.id);
    } else {
      await enableReminder(reminder.id);
    }
    loadReminders();
  };

  const handleSnooze = async (id: string) => {
    await snoozeReminder(id);
    loadReminders();
  };

  const handleDismiss = async (id: string) => {
    await dismissReminder(id);
    loadReminders();
  };

  if (loading) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-muted-foreground)' }}>
        Loading reminders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 dark:text-red-400">
        Error: {error.message}
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-muted-foreground)' }}>
        No reminders found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {reminders.map(reminder => {
        const isOverdue = reminder.nextTrigger && reminder.nextTrigger < new Date() && reminder.enabled;
        const isDueSoon = reminder.nextTrigger && 
          reminder.nextTrigger >= new Date() && 
          reminder.nextTrigger <= new Date(Date.now() + 60 * 60 * 1000) && 
          reminder.enabled;

        return (
          <div
            key={reminder.id}
            className={clsx(
              'flex items-center gap-4 p-4 rounded-lg border transition-colors',
              !reminder.enabled && 'opacity-60',
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
            {/* Enable/Disable Toggle */}
            <button
              onClick={() => handleToggleEnabled(reminder)}
              className="flex-shrink-0"
              aria-label={reminder.enabled ? 'Disable reminder' : 'Enable reminder'}
            >
              {reminder.enabled ? (
                <Bell className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              ) : (
                <BellOff className="w-5 h-5" style={{ color: 'var(--color-muted-foreground)' }} />
              )}
            </button>

            {/* Reminder Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className={clsx(
                    'text-base font-medium',
                    !reminder.enabled && 'line-through text-muted-foreground',
                  )}
                  style={{
                    color: !reminder.enabled 
                      ? 'var(--color-muted-foreground)' 
                      : 'var(--color-foreground)',
                  }}
                >
                  {reminder.title}
                </h3>
                {reminder.routineId && (
                  <span
                    className="px-2 py-0.5 text-xs rounded"
                    style={{
                      backgroundColor: 'var(--color-muted)',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    Routine
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                {reminder.noteId && (
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Note: {reminder.noteId}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{format(reminder.reminderTime, 'MMM d, yyyy h:mm a')}</span>
                </div>
                {reminder.recurring && (
                  <div className="flex items-center gap-1">
                    <Repeat className="w-3 h-3" />
                    <span className="capitalize">{reminder.recurring.frequency}</span>
                  </div>
                )}
                {reminder.nextTrigger && (
                  <div
                    className={clsx(
                      'flex items-center gap-1',
                      isOverdue && 'text-red-600 dark:text-red-400 font-semibold',
                      isDueSoon && !isOverdue && 'text-yellow-600 dark:text-yellow-400 font-semibold',
                    )}
                  >
                    <span>Next: {format(reminder.nextTrigger, 'MMM d, h:mm a')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {reminder.enabled && (
                <>
                  <button
                    onClick={() => handleSnooze(reminder.id)}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    style={{ color: 'var(--color-foreground)' }}
                    aria-label="Snooze reminder"
                    title="Snooze"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDismiss(reminder.id)}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    style={{ color: 'var(--color-foreground)' }}
                    aria-label="Dismiss reminder"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => onEdit && onEdit(reminder)}
                className="p-1.5 rounded hover:bg-muted transition-colors"
                style={{ color: 'var(--color-foreground)' }}
                aria-label="Edit reminder"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(reminder.id)}
                className="p-1.5 rounded hover:bg-muted transition-colors"
                style={{ color: 'var(--color-foreground)' }}
                aria-label="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
