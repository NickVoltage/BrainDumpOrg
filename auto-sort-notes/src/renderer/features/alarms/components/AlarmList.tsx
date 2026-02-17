/**
 * Alarm List Component
 * 
 * Purpose: Displays list of alarms with management options.
 * 
 * Last Updated: 2024
 * Status: Active - Complete alarm list
 */

// Comment 312: Alarm List Component - Alarm List Display
// This component displays a list of alarms with their details and management options.
// Shows alarm title, time, recurrence, enabled status, and routine association.
//
// Intended Interactions:
// - Used by: AlarmTimerTab component (Comment 309)
// - Uses: useAlarm hook (Comment 307) for alarm operations
// - Displays: List of alarms with edit, delete, enable/disable, snooze, dismiss options
//
// Related Comments:
// - Comment 309 (AlarmTimerTab.tsx - parent component)
// - Comment 307 (useAlarm.ts - hook used by this component)
// - Comment 314 (AlarmEditor.tsx - editor component)

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, Bell, BellOff, Clock, Repeat, X } from 'lucide-react';
import { useAlarm } from '../hooks/useAlarm';
import type { Alarm } from '../types';
import { clsx } from 'clsx';

interface AlarmListProps {
  onEdit?: (alarm: Alarm) => void;
  filter?: { enabled?: boolean; routineId?: string };
}

export const AlarmList = ({ onEdit, filter }: AlarmListProps) => {
  const { getAlarms, deleteAlarm, enableAlarm, disableAlarm, snoozeAlarm, dismissAlarm, loading, error } = useAlarm();
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  useEffect(() => {
    loadAlarms();
  }, [filter]);

  const loadAlarms = async () => {
    const result = await getAlarms(filter);
    if (result.ok) {
      setAlarms(result.value);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this alarm?')) {
      await deleteAlarm(id);
      loadAlarms();
    }
  };

  const handleToggleEnabled = async (alarm: Alarm) => {
    if (alarm.enabled) {
      await disableAlarm(alarm.id);
    } else {
      await enableAlarm(alarm.id);
    }
    loadAlarms();
  };

  const handleSnooze = async (id: string) => {
    await snoozeAlarm(id);
    loadAlarms();
  };

  const handleDismiss = async (id: string) => {
    await dismissAlarm(id);
    loadAlarms();
  };

  if (loading) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-muted-foreground)' }}>
        Loading alarms...
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

  if (alarms.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-muted-foreground)' }}>
        No alarms found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alarms.map(alarm => {
        const isOverdue = alarm.nextTrigger && alarm.nextTrigger < new Date() && alarm.enabled;
        const isDueSoon = alarm.nextTrigger && 
          alarm.nextTrigger >= new Date() && 
          alarm.nextTrigger <= new Date(Date.now() + 60 * 60 * 1000) && 
          alarm.enabled;

        return (
          <div
            key={alarm.id}
            className={clsx(
              'flex items-center gap-4 p-4 rounded-lg border transition-colors',
              !alarm.enabled && 'opacity-60',
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
              onClick={() => handleToggleEnabled(alarm)}
              className="flex-shrink-0"
              aria-label={alarm.enabled ? 'Disable alarm' : 'Enable alarm'}
            >
              {alarm.enabled ? (
                <Bell className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              ) : (
                <BellOff className="w-5 h-5" style={{ color: 'var(--color-muted-foreground)' }} />
              )}
            </button>

            {/* Alarm Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className={clsx(
                    'text-base font-medium',
                    !alarm.enabled && 'line-through text-muted-foreground',
                  )}
                  style={{
                    color: !alarm.enabled 
                      ? 'var(--color-muted-foreground)' 
                      : 'var(--color-foreground)',
                  }}
                >
                  {alarm.title}
                </h3>
                {alarm.routineId && (
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
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{format(alarm.alarmTime, 'MMM d, yyyy h:mm a')}</span>
                </div>
                {alarm.recurring && (
                  <div className="flex items-center gap-1">
                    <Repeat className="w-3 h-3" />
                    <span className="capitalize">{alarm.recurring.frequency}</span>
                  </div>
                )}
                {alarm.nextTrigger && (
                  <div
                    className={clsx(
                      'flex items-center gap-1',
                      isOverdue && 'text-red-600 dark:text-red-400 font-semibold',
                      isDueSoon && !isOverdue && 'text-yellow-600 dark:text-yellow-400 font-semibold',
                    )}
                  >
                    <span>Next: {format(alarm.nextTrigger, 'MMM d, h:mm a')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {alarm.enabled && (
                <>
                  <button
                    onClick={() => handleSnooze(alarm.id)}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    style={{ color: 'var(--color-foreground)' }}
                    aria-label="Snooze alarm"
                    title="Snooze"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDismiss(alarm.id)}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    style={{ color: 'var(--color-foreground)' }}
                    aria-label="Dismiss alarm"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => onEdit && onEdit(alarm)}
                className="p-1.5 rounded hover:bg-muted transition-colors"
                style={{ color: 'var(--color-foreground)' }}
                aria-label="Edit alarm"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(alarm.id)}
                className="p-1.5 rounded hover:bg-muted transition-colors"
                style={{ color: 'var(--color-foreground)' }}
                aria-label="Delete alarm"
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
