/**
 * Timer Controls Component
 * 
 * Purpose: Controls for starting, pausing, stopping, and resetting timers.
 * 
 * Last Updated: 2024
 * Status: Active - Complete timer controls
 */

// Comment 311: Timer Controls Component - Timer Operation Controls
// This component provides controls for timer operations (start, pause, stop, reset).
// Handles timer state changes and calls timer service methods.
//
// Intended Interactions:
// - Used by: AlarmTimerTab component (Comment 309)
// - Uses: useTimer hook (Comment 308) for timer operations
// - Displays: Start, Pause, Stop, Reset buttons
//
// Related Comments:
// - Comment 309 (AlarmTimerTab.tsx - parent component)
// - Comment 308 (useTimer.ts - hook used by this component)
// - Comment 310 (TimerDisplay.tsx - displays timer state)

import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import type { Timer } from '../types';

interface TimerControlsProps {
  timer: Timer;
  onUpdate?: () => void;
}

export const TimerControls = ({ timer, onUpdate }: TimerControlsProps) => {
  const { startTimer, pauseTimer, stopTimer, resetTimer, loading } = useTimer();

  const handleStart = async () => {
    await startTimer(timer.id);
    if (onUpdate) onUpdate();
  };

  const handlePause = async () => {
    await pauseTimer(timer.id);
    if (onUpdate) onUpdate();
  };

  const handleStop = async () => {
    await stopTimer(timer.id);
    if (onUpdate) onUpdate();
  };

  const handleReset = async () => {
    await resetTimer(timer.id);
    if (onUpdate) onUpdate();
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {timer.state === 'running' ? (
        <button
          onClick={handlePause}
          disabled={loading}
          className="px-4 py-2 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
            border: 'none',
          }}
          aria-label="Pause timer"
        >
          <Pause className="w-4 h-4" />
          Pause
        </button>
      ) : (
        <button
          onClick={handleStart}
          disabled={loading || timer.state === 'completed'}
          className="px-4 py-2 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
            border: 'none',
          }}
          aria-label="Start timer"
        >
          <Play className="w-4 h-4" />
          Start
        </button>
      )}

      {timer.state === 'running' || timer.state === 'paused' ? (
        <button
          onClick={handleStop}
          disabled={loading}
          className="px-4 py-2 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
          }}
          aria-label="Stop timer"
        >
          <Square className="w-4 h-4" />
          Stop
        </button>
      ) : null}

      <button
        onClick={handleReset}
        disabled={loading || timer.elapsedSeconds === 0}
        className="px-4 py-2 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'transparent',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)',
        }}
        aria-label="Reset timer"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
  );
};
