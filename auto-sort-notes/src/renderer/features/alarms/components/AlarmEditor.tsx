/**
 * Alarm Editor Component
 * 
 * Purpose: Form component for creating and editing alarms.
 * 
 * Last Updated: 2024
 * Status: Active - Complete alarm editor
 */

// Comment 314: Alarm Editor Component - Create/Edit Alarm Form
// This component provides a form interface for creating and editing alarms.
// Handles alarm title, time, recurrence, sound, notification method, and routine association.
//
// Intended Interactions:
// - Uses: alarm-service.ts (Comment 302) for alarm operations
// - Uses: useAlarm hook (Comment 307) for alarm operations
// - Handles: Alarm creation, editing, routine association
//
// Related Comments:
// - Comment 302 (alarm-service.ts - service called by this component)
// - Comment 307 (useAlarm.ts - hook used by this component)

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useAlarm } from '../hooks/useAlarm';
import type { Alarm, AlarmSound, AlarmNotificationMethod, RecurrencePattern } from '../types';
import { format } from 'date-fns';

interface AlarmEditorProps {
  alarm?: Alarm;
  onSave?: (alarm: Alarm) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const AlarmEditor = ({ alarm, onSave, onCancel, onClose }: AlarmEditorProps) => {
  const { createAlarm, updateAlarm, loading } = useAlarm();
  const [title, setTitle] = useState('');
  const [alarmTime, setAlarmTime] = useState<string>('');
  const [alarmDate, setAlarmDate] = useState<string>('');
  const [recurring, setRecurring] = useState<boolean>(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [sound, setSound] = useState<AlarmSound>('default');
  const [notificationMethod, setNotificationMethod] = useState<AlarmNotificationMethod>('both');
  const [snoozeDuration, setSnoozeDuration] = useState(5);
  const [enabled, setEnabled] = useState(true);
  const [routineId, setRoutineId] = useState<string>('');

  useEffect(() => {
    if (alarm) {
      setTitle(alarm.title);
      const alarmDateTime = new Date(alarm.alarmTime);
      setAlarmDate(format(alarmDateTime, 'yyyy-MM-dd'));
      setAlarmTime(format(alarmDateTime, 'HH:mm'));
      setRecurring(!!alarm.recurring);
      if (alarm.recurring) {
        setRecurrenceFrequency(alarm.recurring.frequency);
      }
      setSound(alarm.sound);
      setNotificationMethod(alarm.notificationMethod);
      setSnoozeDuration(alarm.snoozeDuration);
      setEnabled(alarm.enabled);
      setRoutineId(alarm.routineId || '');
    }
  }, [alarm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    const dateTime = new Date(`${alarmDate}T${alarmTime}`);
    if (isNaN(dateTime.getTime())) {
      return;
    }

    const recurrence: RecurrencePattern | undefined = recurring
      ? { frequency: recurrenceFrequency }
      : undefined;

    const alarmData = {
      title: title.trim(),
      alarmTime: dateTime,
      recurring: recurrence,
      enabled,
      sound,
      notificationMethod,
      snoozeDuration,
      routineId: routineId || undefined,
    };

    if (alarm) {
      // Update existing alarm
      const result = await updateAlarm(alarm.id, alarmData);
      if (result.ok && onSave) {
        onSave(result.value);
      }
    } else {
      // Create new alarm
      const result = await createAlarm(alarmData);
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
            {alarm ? 'Edit Alarm' : 'New Alarm'}
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
              placeholder="Enter alarm title"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="alarmDate"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-foreground)' }}
              >
                Date *
              </label>
              <input
                id="alarmDate"
                type="date"
                value={alarmDate}
                onChange={(e) => setAlarmDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded border"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
            </div>
            <div>
              <label
                htmlFor="alarmTime"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-foreground)' }}
              >
                Time *
              </label>
              <input
                id="alarmTime"
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded border"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
            </div>
          </div>

          {/* Recurring */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="w-4 h-4"
              />
              <span style={{ color: 'var(--color-foreground)' }}>Recurring</span>
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

          {/* Sound and Notification */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sound"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-foreground)' }}
              >
                Sound
              </label>
              <select
                id="sound"
                value={sound}
                onChange={(e) => setSound(e.target.value as AlarmSound)}
                className="w-full px-3 py-2 rounded border"
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
            <div>
              <label
                htmlFor="notificationMethod"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-foreground)' }}
              >
                Notification Method
              </label>
              <select
                id="notificationMethod"
                value={notificationMethod}
                onChange={(e) => setNotificationMethod(e.target.value as AlarmNotificationMethod)}
                className="w-full px-3 py-2 rounded border"
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
          </div>

          {/* Snooze Duration */}
          <div>
            <label
              htmlFor="snoozeDuration"
              className="block text-sm font-medium mb-1"
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
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
            />
          </div>

          {/* Enabled */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              <span style={{ color: 'var(--color-foreground)' }}>Enabled</span>
            </label>
          </div>

          {/* Routine Association (placeholder for future) */}
          <div>
            <label
              htmlFor="routineId"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-foreground)' }}
            >
              Routine (optional)
            </label>
            <input
              id="routineId"
              type="text"
              value={routineId}
              onChange={(e) => setRoutineId(e.target.value)}
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
              placeholder="Routine ID (future feature)"
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
              {loading ? 'Saving...' : alarm ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
