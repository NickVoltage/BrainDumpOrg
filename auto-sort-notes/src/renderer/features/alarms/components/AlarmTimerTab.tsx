/**
 * Alarm Timer Tab Component
 * 
 * Purpose: Main tab component for Alarm/Timer feature.
 * Houses timer display, alarm list, and reminder list.
 * 
 * Last Updated: 2024
 * Status: Active - Icon-based navigation with Overview page
 */

// Comment 309: Alarm Timer Tab Component - Main Alarm/Timer Tab
// This component provides the main interface for the Alarm/Timer tab.
// Uses icon-based navigation with Overview, Reminders, Alarms, Timers, and Settings views.
//
// Intended Interactions:
// - Uses: src/renderer/features/alarms/components/TimerDisplay.tsx (Comment 310)
// - Uses: src/renderer/features/alarms/components/TimerControls.tsx (Comment 311)
// - Uses: src/renderer/features/alarms/components/AlarmList.tsx (Comment 312)
// - Uses: src/renderer/features/alarms/components/ReminderList.tsx (Comment 313)
// - Main tab component for Alarm/Timer feature
//
// Related Comments:
// - Comment 309 (TimerDisplay.tsx - timer display component)
// - Comment 309 (TimerControls.tsx - timer controls component)
// - Comment 309 (AlarmList.tsx - alarm list component)
// - Comment 309 (ReminderList.tsx - reminder list component)

import { useState, useEffect, useMemo } from 'react';
import { MenuBar } from '../../../shared/components/MenuBar';
import { TimerList } from './TimerList';
import { AlarmList } from './AlarmList';
import { ReminderList } from './ReminderList';
import { TimerEditor } from './TimerEditor';
import { AlarmEditor } from './AlarmEditor';
import { ReminderEditor } from './ReminderEditor';
import type { Timer, Alarm, Reminder } from '../types';
import { Menu, Clock, BellRing, Timer as TimerIcon, Settings, Plus, Edit2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useTimer } from '../hooks/useTimer';
import { useAlarm } from '../hooks/useAlarm';
import { useReminder } from '../hooks/useReminder';
import { format } from 'date-fns';

type ViewType = 'overview' | 'reminders' | 'alarms' | 'timers' | 'settings';

interface TimelineItem {
  id: string;
  type: 'timer' | 'alarm' | 'reminder';
  title: string;
  time: Date | null;
  item: Timer | Alarm | Reminder;
}

export const AlarmTimerTab = () => {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [showTimerEditor, setShowTimerEditor] = useState(false);
  const [showAlarmEditor, setShowAlarmEditor] = useState(false);
  const [showReminderEditor, setShowReminderEditor] = useState(false);
  const [editingTimer, setEditingTimer] = useState<Timer | undefined>(undefined);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | undefined>(undefined);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(undefined);
  const [includeNonScheduled, setIncludeNonScheduled] = useState(() => {
    const saved = localStorage.getItem('alarmTimer_includeNonScheduled');
    return saved === 'true';
  });
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  const { getTimers } = useTimer();
  const { getAlarms } = useAlarm();
  const { getReminders } = useReminder();

  const [allTimers, setAllTimers] = useState<Timer[]>([]);
  const [allAlarms, setAllAlarms] = useState<Alarm[]>([]);
  const [allReminders, setAllReminders] = useState<Reminder[]>([]);

  // Load all items
  useEffect(() => {
    loadAllItems();
  }, []);

  const loadAllItems = async () => {
    const timersResult = await getTimers();
    if (timersResult.ok) {
      setAllTimers(timersResult.value);
    }

    const alarmsResult = await getAlarms();
    if (alarmsResult.ok) {
      setAllAlarms(alarmsResult.value);
    }

    const remindersResult = await getReminders();
    if (remindersResult.ok) {
      setAllReminders(remindersResult.value);
    }
  };

  // Build timeline
  useEffect(() => {
    const items: TimelineItem[] = [];

    // Add timers (non-scheduled items)
    if (includeNonScheduled) {
      allTimers.forEach(timer => {
        items.push({
          id: timer.id,
          type: 'timer',
          title: timer.name,
          time: null,
          item: timer,
        });
      });
    }

    // Add alarms
    allAlarms.forEach(alarm => {
      if (alarm.nextTrigger || includeNonScheduled) {
        items.push({
          id: alarm.id,
          type: 'alarm',
          title: alarm.title,
          time: alarm.nextTrigger || null,
          item: alarm,
        });
      }
    });

    // Add reminders
    allReminders.forEach(reminder => {
      if (reminder.nextTrigger || includeNonScheduled) {
        items.push({
          id: reminder.id,
          type: 'reminder',
          title: reminder.title,
          time: reminder.nextTrigger || null,
          item: reminder,
        });
      }
    });

    // Sort by time (scheduled items first, then non-scheduled)
    items.sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.getTime() - b.time.getTime();
    });

    setTimelineItems(items);
  }, [allTimers, allAlarms, allReminders, includeNonScheduled]);

  const handleNewTimer = () => {
    setEditingTimer(undefined);
    setShowTimerEditor(true);
  };

  const handleNewAlarm = () => {
    setEditingAlarm(undefined);
    setShowAlarmEditor(true);
  };

  const handleNewReminder = () => {
    setEditingReminder(undefined);
    setShowReminderEditor(true);
  };

  const handleEditTimer = (timer: Timer) => {
    setEditingTimer(timer);
    setShowTimerEditor(true);
  };

  const handleEditAlarm = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setShowAlarmEditor(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowReminderEditor(true);
  };

  const handleSaveTimer = (timer: Timer) => {
    setShowTimerEditor(false);
    setEditingTimer(undefined);
    loadAllItems();
  };

  const handleSaveAlarm = (alarm: Alarm) => {
    setShowAlarmEditor(false);
    setEditingAlarm(undefined);
    loadAllItems();
  };

  const handleSaveReminder = (reminder: Reminder) => {
    setShowReminderEditor(false);
    setEditingReminder(undefined);
    loadAllItems();
  };

  // Menu Bar Items
  const menuItems = [
    {
      id: 'file',
      label: 'File',
      items: [
        {
          id: 'new-alarm',
          label: 'New Alarm...',
          shortcut: 'Ctrl+N',
          onClick: handleNewAlarm,
        },
        {
          id: 'new-timer',
          label: 'New Timer...',
          onClick: handleNewTimer,
        },
        {
          id: 'new-reminder',
          label: 'New Reminder...',
          onClick: handleNewReminder,
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      items: [
        {
          id: 'alarm-settings',
          label: 'Alarm Settings...',
          onClick: () => {
            if (activeView !== 'settings') setActiveView('settings');
          },
        },
      ],
    },
  ];

  // Navigation buttons
  const navButtons = [
    { id: 'overview', label: 'Overview', icon: Menu, view: 'overview' as ViewType },
    { id: 'reminders', label: 'Reminders', icon: Clock, view: 'reminders' as ViewType },
    { id: 'alarms', label: 'Alarms', icon: BellRing, view: 'alarms' as ViewType },
    { id: 'timers', label: 'Timers', icon: TimerIcon, view: 'timers' as ViewType },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' as ViewType },
  ];

  return (
    <div className="flex flex-col h-full">
      <MenuBar items={menuItems} />
      
      {/* Icon-based Navigation */}
      <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {navButtons.map((button) => {
          const Icon = button.icon;
          const isActive = activeView === button.view;
          return (
            <button
              key={button.id}
              onClick={() => setActiveView(button.view)}
              className={clsx(
                'p-2 rounded transition-colors'
              )}
              style={{
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? 'var(--color-primary-foreground)' : 'var(--color-foreground)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }
              }}
              title={button.label}
              aria-label={button.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-6 overflow-auto" style={{ paddingRight: '16px' }}>
        {/* Overview View */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Add Section */}
            <div className="border rounded-lg p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
                  Add
                </h2>
                <div className="flex gap-4">
                  <button
                    onClick={handleNewReminder}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors"
                    style={{
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <Clock className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
                    <span style={{ color: 'var(--color-foreground)' }}>Reminder</span>
                  </button>
                  <button
                    onClick={handleNewAlarm}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors"
                    style={{
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <BellRing className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
                    <span style={{ color: 'var(--color-foreground)' }}>Alarm</span>
                  </button>
                  <button
                    onClick={handleNewTimer}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors"
                    style={{
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <TimerIcon className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
                    <span style={{ color: 'var(--color-foreground)' }}>Timer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Routines and Timeline Side-by-Side */}
            <div className="grid grid-cols-2 gap-6">
              {/* Routines Section */}
              <div className="border rounded-lg p-4 flex flex-col" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
                  Routines
                </h2>
                <div className="flex-1 overflow-auto">
                  <div className="text-center py-8" style={{ color: 'var(--color-muted-foreground)' }}>
                    No routines created yet.
                    {/* TODO: Implement RoutineList component (Comment 327) */}
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="border rounded-lg p-4 flex flex-col" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
                    Timeline
                  </h2>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeNonScheduled}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIncludeNonScheduled(checked);
                        localStorage.setItem('alarmTimer_includeNonScheduled', String(checked));
                      }}
                      className="w-4 h-4"
                    />
                    <span style={{ color: 'var(--color-foreground)' }}>Include non-scheduled</span>
                  </label>
                </div>
                <div className="flex-1 overflow-auto">
                  {timelineItems.length === 0 ? (
                    <div className="text-center py-8" style={{ color: 'var(--color-muted-foreground)' }}>
                      No items in timeline
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {timelineItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 border rounded-lg"
                          style={{
                            borderColor: 'var(--color-border)',
                            backgroundColor: 'var(--color-background)',
                          }}
                        >
                          <div className="flex-shrink-0">
                            {item.type === 'timer' && <TimerIcon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />}
                            {item.type === 'alarm' && <BellRing className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />}
                            {item.type === 'reminder' && <Clock className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium" style={{ color: 'var(--color-foreground)' }}>
                              {item.title}
                            </div>
                            {item.time && (
                              <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                                {format(item.time, 'PPP p')}
                              </div>
                            )}
                            {!item.time && (
                              <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                                Non-scheduled
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              if (item.type === 'timer') handleEditTimer(item.item as Timer);
                              if (item.type === 'alarm') handleEditAlarm(item.item as Alarm);
                              if (item.type === 'reminder') handleEditReminder(item.item as Reminder);
                            }}
                            className="p-1.5 rounded hover:bg-muted transition-colors"
                            style={{ color: 'var(--color-foreground)' }}
                            aria-label="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reminders View */}
        {activeView === 'reminders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Reminders
              </h2>
              <button
                onClick={handleNewReminder}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '1';
                }}
              >
                <Plus className="w-4 h-4" />
                <span>New Reminder</span>
              </button>
            </div>
            <ReminderList onEdit={handleEditReminder} />
          </div>
        )}

        {/* Alarms View */}
        {activeView === 'alarms' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Alarms
              </h2>
              <button
                onClick={handleNewAlarm}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '1';
                }}
              >
                <Plus className="w-4 h-4" />
                <span>New Alarm</span>
              </button>
            </div>
            <AlarmList onEdit={handleEditAlarm} />
          </div>
        )}

        {/* Timers View */}
        {activeView === 'timers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Timers
              </h2>
              <button
                onClick={handleNewTimer}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '1';
                }}
              >
                <Plus className="w-4 h-4" />
                <span>New Timer</span>
              </button>
            </div>
            <TimerList onEdit={handleEditTimer} />
          </div>
        )}

        {/* Settings View */}
        {activeView === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
              Settings
            </h2>
            <div className="text-center py-8" style={{ color: 'var(--color-muted-foreground)' }}>
              Settings panel coming soon.
              {/* TODO: Implement Settings component (Comment 328) */}
            </div>
          </div>
        )}
      </div>

      {/* Editor Modals */}
      {showTimerEditor && (
        <TimerEditor
          timer={editingTimer}
          onSave={handleSaveTimer}
          onCancel={() => {
            setShowTimerEditor(false);
            setEditingTimer(undefined);
          }}
          onClose={() => {
            setShowTimerEditor(false);
            setEditingTimer(undefined);
          }}
        />
      )}

      {showAlarmEditor && (
        <AlarmEditor
          alarm={editingAlarm}
          onSave={handleSaveAlarm}
          onCancel={() => {
            setShowAlarmEditor(false);
            setEditingAlarm(undefined);
          }}
          onClose={() => {
            setShowAlarmEditor(false);
            setEditingAlarm(undefined);
          }}
        />
      )}

      {showReminderEditor && (
        <ReminderEditor
          reminder={editingReminder}
          onSave={handleSaveReminder}
          onCancel={() => {
            setShowReminderEditor(false);
            setEditingReminder(undefined);
          }}
          onClose={() => {
            setShowReminderEditor(false);
            setEditingReminder(undefined);
          }}
        />
      )}
    </div>
  );
};
