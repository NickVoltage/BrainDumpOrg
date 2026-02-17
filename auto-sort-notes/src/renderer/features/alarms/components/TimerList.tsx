/**
 * Timer List Component
 * 
 * Purpose: Displays list of timers with management options.
 * 
 * Last Updated: 2024
 * Status: Active - Complete timer list
 */

// Comment 310: Timer List Component - Timer List Display
// This component displays a list of timers with their details and management options.
// Shows timer name, type, state, elapsed time, and routine association.
//
// Intended Interactions:
// - Used by: AlarmTimerTab component (Comment 309)
// - Uses: useTimer hook (Comment 308) for timer operations
// - Displays: List of timers with edit, delete, start/pause/stop/reset options
//
// Related Comments:
// - Comment 309 (AlarmTimerTab.tsx - parent component)
// - Comment 308 (useTimer.ts - hook used by this component)

import { useState, useEffect } from 'react';
import { Edit2, Trash2, Play, Pause, Square, RotateCcw, Clock, Timer as TimerIcon } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import type { Timer } from '../types';
import { clsx } from 'clsx';

interface TimerListProps {
  onEdit?: (timer: Timer) => void;
  filter?: { state?: string; routineId?: string };
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const TimerList = ({ onEdit, filter }: TimerListProps) => {
  const { getTimers, deleteTimer, loading, error } = useTimer();
  const [timers, setTimers] = useState<Timer[]>([]);
  const [expandedTimer, setExpandedTimer] = useState<string | null>(null);

  useEffect(() => {
    loadTimers();
  }, [filter]);

  const loadTimers = async () => {
    const result = await getTimers(filter);
    if (result.ok) {
      setTimers(result.value);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this timer?')) {
      await deleteTimer(id);
      loadTimers();
    }
  };

  const handleToggleExpand = (id: string) => {
    setExpandedTimer(expandedTimer === id ? null : id);
  };

  if (loading) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-muted-foreground)' }}>
        Loading timers...
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

  if (timers.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-muted-foreground)' }}>
        No timers found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timers.map(timer => {
        const isExpanded = expandedTimer === timer.id;
        const remainingTime = timer.timerType === 'countdown' 
          ? Math.max(0, timer.duration - timer.elapsedSeconds)
          : null;

        return (
          <div
            key={timer.id}
            className="rounded-lg border"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-background)',
            }}
          >
            {/* Timer Summary */}
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleToggleExpand(timer.id)}
            >
              <TimerIcon className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-foreground)' }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-medium" style={{ color: 'var(--color-foreground)' }}>
                    {timer.name}
                  </h3>
                  {timer.routineId && (
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
                    <span>
                      {timer.timerType === 'countdown' && remainingTime !== null
                        ? formatTime(remainingTime)
                        : formatTime(timer.elapsedSeconds)}
                    </span>
                  </div>
                  <span className="capitalize">{timer.timerType}</span>
                  <span>•</span>
                  <span className="capitalize">{timer.state}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(timer);
                  }}
                  className="p-1.5 rounded hover:bg-muted transition-colors"
                  style={{ color: 'var(--color-foreground)' }}
                  aria-label="Edit timer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(timer.id);
                  }}
                  className="p-1.5 rounded hover:bg-muted transition-colors"
                  style={{ color: 'var(--color-foreground)' }}
                  aria-label="Delete timer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expanded Timer View */}
            {isExpanded && (
              <div
                className="border-t p-4"
                style={{ borderColor: 'var(--color-border)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <TimerDisplay timer={timer} />
                <div className="mt-4">
                  <TimerControls timer={timer} onUpdate={loadTimers} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
