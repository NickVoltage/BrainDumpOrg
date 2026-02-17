/**
 * Timer Editor Component
 * 
 * Purpose: Form component for creating and editing timers.
 * 
 * Last Updated: 2024
 * Status: Active - Complete timer editor
 */

// Comment 311: Timer Editor Component - Create/Edit Timer Form
// This component provides a form interface for creating and editing timers.
// Handles timer name, duration, type (countdown/countup), and routine association.
//
// Intended Interactions:
// - Uses: timer-service.ts (Comment 300) for timer operations
// - Uses: useTimer hook (Comment 308) for timer operations
// - Handles: Timer creation, editing, routine association
//
// Related Comments:
// - Comment 300 (timer-service.ts - service called by this component)
// - Comment 308 (useTimer.ts - hook used by this component)

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import type { Timer, TimerType } from '../types';

interface TimerEditorProps {
  timer?: Timer;
  onSave?: (timer: Timer) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const TimerEditor = ({ timer, onSave, onCancel, onClose }: TimerEditorProps) => {
  const { createTimer, updateTimer, loading } = useTimer();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(60); // Default 1 minute
  const [timerType, setTimerType] = useState<TimerType>('countdown');
  const [routineId, setRoutineId] = useState<string>('');

  useEffect(() => {
    if (timer) {
      setName(timer.name);
      setDuration(timer.duration);
      setTimerType(timer.timerType);
      setRoutineId(timer.routineId || '');
    }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }
    if (duration <= 0) {
      return;
    }

    const timerData = {
      name: name.trim(),
      duration,
      timerType,
      routineId: routineId || undefined,
    };

    if (timer) {
      // Update existing timer
      const result = await updateTimer(timer.id, timerData);
      if (result.ok && onSave) {
        onSave(result.value);
      }
    } else {
      // Create new timer
      const result = await createTimer(timerData);
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
        className="bg-background border border-border rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto m-4"
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
            {timer ? 'Edit Timer' : 'New Timer'}
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
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-foreground)' }}
            >
              Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
              placeholder="Enter timer name"
            />
          </div>

          {/* Timer Type */}
          <div>
            <label
              htmlFor="timerType"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-foreground)' }}
            >
              Timer Type *
            </label>
            <select
              id="timerType"
              value={timerType}
              onChange={(e) => setTimerType(e.target.value as TimerType)}
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
            >
              <option value="countdown">Countdown</option>
              <option value="countup">Count Up</option>
            </select>
          </div>

          {/* Duration (for countdown) */}
          {timerType === 'countdown' && (
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--color-foreground)' }}
              >
                Duration (seconds) *
              </label>
              <input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                required
                className="w-full px-3 py-2 rounded border"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                {Math.floor(duration / 60)} minutes {duration % 60} seconds
              </p>
            </div>
          )}

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
              disabled={loading || !name.trim() || (timerType === 'countdown' && duration <= 0)}
              className="px-4 py-2 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
                border: 'none',
              }}
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : timer ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

