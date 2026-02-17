/**
 * Timer Display Component
 * 
 * Purpose: Displays timer state and elapsed time.
 * 
 * Last Updated: 2024
 * Status: Active - Complete timer display
 */

// Comment 310: Timer Display Component - Timer State Display
// This component displays the current timer state and elapsed time.
// Shows timer name, elapsed time, remaining time (for countdown), and progress.
//
// Intended Interactions:
// - Used by: AlarmTimerTab component (Comment 309)
// - Displays: Timer name, elapsed time, remaining time, progress indicator
//
// Related Comments:
// - Comment 309 (AlarmTimerTab.tsx - parent component)
// - Comment 311 (TimerControls.tsx - controls component)

import { useEffect, useState } from 'react';
import type { Timer } from '../types';

interface TimerDisplayProps {
  timer: Timer;
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const TimerDisplay = ({ timer }: TimerDisplayProps) => {
  const [displayTime, setDisplayTime] = useState(timer.elapsedSeconds);
  const [isRunning, setIsRunning] = useState(timer.state === 'running');

  useEffect(() => {
    setIsRunning(timer.state === 'running');
    setDisplayTime(timer.elapsedSeconds);
  }, [timer.state, timer.elapsedSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setDisplayTime(prev => {
        if (timer.timerType === 'countdown') {
          const newTime = prev + 1;
          if (newTime >= timer.duration) {
            setIsRunning(false);
            return timer.duration;
          }
          return newTime;
        } else {
          return prev + 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timer.timerType, timer.duration]);

  const remainingTime = timer.timerType === 'countdown' 
    ? Math.max(0, timer.duration - displayTime)
    : null;
  const progress = timer.timerType === 'countdown' && timer.duration > 0
    ? (displayTime / timer.duration) * 100
    : null;

  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-background)',
      }}
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>
          {timer.name}
        </h3>
        
        {/* Timer Display */}
        <div className="text-6xl font-mono font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
          {timer.timerType === 'countdown' && remainingTime !== null
            ? formatTime(remainingTime)
            : formatTime(displayTime)}
        </div>

        {/* Progress Bar (for countdown) */}
        {progress !== null && (
          <div className="w-full h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--color-muted)' }}>
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${progress}%`,
                backgroundColor: progress >= 100 ? 'var(--color-error)' : 'var(--color-primary)',
              }}
            />
          </div>
        )}

        {/* Timer Type and State */}
        <div className="flex items-center justify-center gap-4 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          <span className="capitalize">{timer.timerType}</span>
          <span>•</span>
          <span className="capitalize">{timer.state}</span>
        </div>
      </div>
    </div>
  );
};
