/**
 * Calendar Month Component
 * 
 * Purpose: Month view for calendar displaying events in monthly grid.
 * Uses date-fns for accurate date calculations (leap years, month boundaries).
 * Displays holidays from baked-in holiday data.
 * 
 * Last Updated: 2024
 * Status: Active - Accurate calendar with holiday support
 */

// Comment 2002: Calendar Month View - Monthly Calendar Display
// This component displays calendar events in a monthly grid view with accurate date calculations.
// Uses date-fns for all date operations to ensure 100% accuracy (leap years, month boundaries).
// Displays holidays from baked-in holiday data (no internet required).
//
// Intended Interactions:
// - Used by: src/renderer/features/calendar/components/CalendarView.tsx (Comment 102)
// - Displays: Monthly grid with accurate dates and holidays
// - Handles: Month navigation, event display, holiday display
// - Uses: date-fns for accurate date calculations
// - Uses: holiday-utils.ts for holiday lookups
//
// Related Comments:
// - Comment 102 (CalendarView.tsx - parent component)
// - Comment 2000 (us-holidays.ts - holiday data source)
// - Comment 2001 (holiday-utils.ts - holiday utilities)
// - Comment 009 (date-utils.ts - date manipulation)

import { useState } from 'react';
import { dateUtils } from '../../../shared/utils/date-utils';
import { getHolidays } from '../../../shared/utils/holiday-utils';
import { format, isSameMonth, isToday } from 'date-fns';
import { clsx } from 'clsx';
import { CalendarEvent, EVENT_COLORS, EventColor } from '../types';
import { ContextMenu, ContextMenuItem } from '../../../shared/components/ContextMenu';

interface CalendarMonthProps {
  currentDate: Date;
  onDateClick?: (date: Date) => void;
  events?: CalendarEvent[]; // Events for the current month (will be passed from parent)
}

export const CalendarMonth = ({ currentDate, onDateClick, events = [] }: CalendarMonthProps) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    date: Date;
  } | null>(null);

  // Get the start of the month
  const monthStart = dateUtils.getStartOfMonth(currentDate);
  
  // Get the start of the calendar grid (may include days from previous month)
  const calendarStart = dateUtils.getStartOfWeek(monthStart);
  
  // Get the end of the month
  const monthEnd = dateUtils.getEndOfMonth(currentDate);
  
  // Get the end of the calendar grid (may include days from next month)
  const calendarEnd = dateUtils.getEndOfWeek(monthEnd);
  
  // Get all days in the calendar grid
  const days = dateUtils.getDaysInRange(calendarStart, calendarEnd);
  
  // Week day headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (date: Date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, date: Date) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      date,
    });
  };

  const buildContextMenuItems = (date: Date): ContextMenuItem[] => {
    const dayEvents = events.filter(event => {
      const eventStart = new Date(event.startDate);
      return (
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate()
      );
    });
    const holidays = getHolidays(date);
    const hasEvents = dayEvents.length > 0;
    const hasHolidays = holidays.length > 0;

    const items: ContextMenuItem[] = [
      {
        id: 'new-event',
        label: 'New Event...',
        onClick: () => {
          // TODO: Implement new event (Comment 2100)
          console.log('New Event for', date);
        },
      },
      { id: 'separator-1', separator: true },
    ];

    // Edit Event submenu (only if events exist)
    if (hasEvents) {
      items.push({
        id: 'edit-event',
        label: 'Edit Event',
        submenu: dayEvents.map(event => ({
          id: `edit-${event.id}`,
          label: event.title,
          onClick: () => {
            // TODO: Implement edit event (Comment 2101)
            console.log('Edit Event', event.id);
          },
        })),
      });
      items.push({ id: 'separator-2', separator: true });
    }

    // Day Appearance submenu
    items.push({
      id: 'day-appearance',
      label: 'Day Appearance',
      submenu: [
        {
          id: 'set-background-color',
          label: 'Set Background Color...',
          onClick: () => {
            // TODO: Implement set background color (Comment 2102)
            console.log('Set Background Color for', date);
          },
        },
        {
          id: 'set-highlight-color',
          label: 'Set Highlight Color...',
          onClick: () => {
            // TODO: Implement set highlight color (Comment 2103)
            console.log('Set Highlight Color for', date);
          },
        },
        {
          id: 'set-day-label',
          label: 'Set Day Label...',
          onClick: () => {
            // TODO: Implement set day label (Comment 2104)
            console.log('Set Day Label for', date);
          },
        },
        { id: 'separator-appearance', separator: true },
        {
          id: 'clear-day-styling',
          label: 'Clear Day Styling',
          onClick: () => {
            // TODO: Implement clear day styling (Comment 2105)
            console.log('Clear Day Styling for', date);
          },
        },
      ],
    });

    items.push({ id: 'separator-3', separator: true });

    // Holiday Options submenu (only if holidays exist)
    if (hasHolidays) {
      const holidayItems: ContextMenuItem[] = holidays.flatMap(holiday => [
        {
          id: `hide-holiday-${holiday.id}`,
          label: `Hide Holiday: ${holiday.name}`,
          onClick: () => {
            // TODO: Implement hide holiday (Comment 2106)
            console.log('Hide Holiday', holiday.id);
          },
        },
        {
          id: `customize-holiday-${holiday.id}`,
          label: `Customize Holiday: ${holiday.name}...`,
          onClick: () => {
            // TODO: Implement customize holiday (Comment 2107)
            console.log('Customize Holiday', holiday.id);
          },
        },
      ]);
      holidayItems.push({ id: 'separator-holiday', separator: true });
      holidayItems.push({
        id: 'add-custom-holiday',
        label: 'Add Custom Holiday...',
        onClick: () => {
          // TODO: Implement add custom holiday (Comment 2108)
          console.log('Add Custom Holiday for', date);
        },
      });

      items.push({
        id: 'holiday-options',
        label: 'Holiday Options',
        submenu: holidayItems,
      });
      items.push({ id: 'separator-4', separator: true });
    }

    // Day Actions submenu
    items.push({
      id: 'day-actions',
      label: 'Day Actions',
      submenu: [
        {
          id: 'copy-day',
          label: 'Copy Day',
          onClick: () => {
            // TODO: Implement copy day (Comment 2109)
            console.log('Copy Day', date);
          },
        },
        {
          id: 'paste-events',
          label: 'Paste Events',
          onClick: () => {
            // TODO: Implement paste events (Comment 2110)
            console.log('Paste Events to', date);
          },
        },
        {
          id: 'show-day-details',
          label: 'Show Day Details',
          onClick: () => {
            // TODO: Implement show day details (Comment 2111)
            console.log('Show Day Details for', date);
          },
        },
        { id: 'separator-actions', separator: true },
        {
          id: 'clear-all-events',
          label: 'Clear All Events...',
          onClick: () => {
            // TODO: Implement clear all events (Comment 2112)
            console.log('Clear All Events for', date);
          },
        },
      ],
    });

    items.push({ id: 'separator-5', separator: true });

    // Settings
    items.push({
      id: 'settings',
      label: 'Settings...',
      onClick: () => {
        // TODO: Implement settings (Comment 2113)
        console.log('Open Settings');
      },
    });

    return items;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map(day => (
          <div
            key={day}
            className="p-2 text-sm font-medium text-muted-foreground text-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const holidays = getHolidays(day);
          const hasHoliday = holidays.length > 0;
          
          // Get events for this day
          const dayEvents = events.filter(event => {
            const eventStart = new Date(event.startDate);
            return (
              eventStart.getFullYear() === day.getFullYear() &&
              eventStart.getMonth() === day.getMonth() &&
              eventStart.getDate() === day.getDate()
            );
          });
          const hasEvents = dayEvents.length > 0;
          const hasContent = hasHoliday || hasEvents;

          // Determine holiday color based on type
          const getHolidayColor = (holidayType: 'fixed' | 'calculated') => {
            if (holidayType === 'fixed') {
              // Fixed holidays (major holidays) - use red/orange with more opacity
              return 'bg-red-500/30 text-red-800 dark:text-red-200 border-red-500/50 border';
            } else {
              // Calculated holidays - use blue with more opacity
              return 'bg-blue-500/30 text-blue-800 dark:text-blue-200 border-blue-500/50 border';
            }
          };

          return (
            <div
              key={day.toISOString()}
              className={clsx(
                'border border-border p-2 min-h-[80px] flex flex-col',
                'hover:bg-muted/50 transition-colors',
                // Only show pointer cursor if there's content or click handler
                (hasContent || onDateClick) && 'cursor-pointer',
                !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
                isCurrentDay && 'bg-blue-50/50 dark:bg-blue-950/30'
              )}
              style={{
                // Inline style for holiday background highlight (ensures it shows)
                ...(hasHoliday && !isCurrentDay ? { backgroundColor: 'rgba(251, 191, 36, 0.2)' } : {}),
                ...(hasEvents && !hasHoliday && !isCurrentDay ? { backgroundColor: 'rgba(59, 130, 246, 0.15)' } : {}),
                // Blue border for today's date
                ...(isCurrentDay ? { borderColor: 'rgba(59, 130, 246, 0.8)', borderWidth: '2px', borderStyle: 'solid' } : {})
              }}
              onClick={() => handleDateClick && handleDateClick(day)}
              onContextMenu={(e) => handleContextMenu(e, day)}
            >
              {/* Day number */}
              <div
                className="text-sm font-medium mb-1"
                style={{
                  color: isCurrentDay 
                    ? 'var(--color-primary)' 
                    : !isCurrentMonth 
                    ? 'var(--color-muted-foreground)'
                    : hasHoliday
                    ? 'var(--color-foreground)'
                    : 'var(--color-foreground)',
                  fontWeight: isCurrentDay ? 'bold' : hasHoliday ? '600' : 'normal',
                }}
              >
                {format(day, 'd')}
              </div>

              {/* Holidays */}
              {hasHoliday && (
                <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                  {holidays.slice(0, 2).map(holiday => {
                    const isFixed = holiday.type === 'fixed';
                    // Use theme-aware colors that work in both light and dark themes
                    // Use theme-aware colors that ensure readability in both light and dark themes
                    const style = isFixed
                      ? { 
                          backgroundColor: 'rgba(239, 68, 68, 0.4)', 
                          color: '#ffffff', // White text for better contrast on red background
                          borderColor: 'rgba(239, 68, 68, 0.7)',
                          borderWidth: '1px',
                          borderStyle: 'solid'
                        }
                      : { 
                          backgroundColor: 'rgba(59, 130, 246, 0.4)', 
                          color: '#ffffff', // White text for better contrast on blue background
                          borderColor: 'rgba(59, 130, 246, 0.7)',
                          borderWidth: '1px',
                          borderStyle: 'solid'
                        };
                    return (
                      <div
                        key={holiday.id}
                        className="text-xs px-1.5 py-0.5 rounded truncate font-medium"
                        style={style}
                        title={holiday.name}
                      >
                        {holiday.name}
                      </div>
                    );
                  })}
                  {holidays.length > 2 && (
                    <div className="text-xs text-muted-foreground px-1">
                      +{holidays.length - 2} more
                    </div>
                  )}
                </div>
              )}

              {/* Events - displayed with color coding */}
              {hasEvents && !hasHoliday && (
                <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((event) => {
                    const eventColor: EventColor = event.color || 'blue';
                    // Use inline styles with high contrast colors for readability
                    const getEventStyle = (color: EventColor) => {
                      const colorMap: Record<EventColor, { bg: string; text: string; border: string }> = {
                        blue: { bg: 'rgba(59, 130, 246, 0.4)', text: '#ffffff', border: 'rgba(59, 130, 246, 0.7)' },
                        green: { bg: 'rgba(34, 197, 94, 0.4)', text: '#ffffff', border: 'rgba(34, 197, 94, 0.7)' },
                        red: { bg: 'rgba(239, 68, 68, 0.4)', text: '#ffffff', border: 'rgba(239, 68, 68, 0.7)' },
                        yellow: { bg: 'rgba(234, 179, 8, 0.5)', text: '#000000', border: 'rgba(234, 179, 8, 0.7)' },
                        purple: { bg: 'rgba(168, 85, 247, 0.4)', text: '#ffffff', border: 'rgba(168, 85, 247, 0.7)' },
                        orange: { bg: 'rgba(249, 115, 22, 0.4)', text: '#ffffff', border: 'rgba(249, 115, 22, 0.7)' },
                        pink: { bg: 'rgba(236, 72, 153, 0.4)', text: '#ffffff', border: 'rgba(236, 72, 153, 0.7)' },
                        cyan: { bg: 'rgba(6, 182, 212, 0.4)', text: '#ffffff', border: 'rgba(6, 182, 212, 0.7)' },
                        gray: { bg: 'rgba(107, 114, 128, 0.4)', text: '#ffffff', border: 'rgba(107, 114, 128, 0.7)' },
                        indigo: { bg: 'rgba(99, 102, 241, 0.4)', text: '#ffffff', border: 'rgba(99, 102, 241, 0.7)' },
                      };
                      return colorMap[color];
                    };
                    const eventStyle = getEventStyle(eventColor);
                    return (
                      <div
                        key={event.id}
                        className="text-xs px-1.5 py-0.5 rounded border truncate font-medium"
                        style={{
                          backgroundColor: eventStyle.bg,
                          color: eventStyle.text,
                          borderColor: eventStyle.border,
                          borderWidth: '1px',
                          borderStyle: 'solid',
                        }}
                        title={event.title}
                      >
                        {event.emoji && <span className="mr-1">{event.emoji}</span>}
                        {event.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <div 
                      className="text-xs px-1"
                      style={{ color: 'var(--color-muted-foreground)' }}
                    >
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              )}

              {/* Show both holidays and events if both exist */}
              {hasHoliday && hasEvents && (
                <div className="flex flex-col gap-0.5 flex-1 overflow-hidden mt-0.5">
                  {dayEvents.slice(0, 1).map((event) => {
                    const eventColor: EventColor = event.color || 'green';
                    // Use inline styles with CSS variables for theme-aware colors
                    const getEventStyle = (color: EventColor) => {
                      const colorMap: Record<EventColor, { bg: string; text: string; border: string }> = {
                        blue: { bg: 'rgba(59, 130, 246, 0.4)', text: '#ffffff', border: 'rgba(59, 130, 246, 0.7)' },
                        green: { bg: 'rgba(34, 197, 94, 0.4)', text: '#ffffff', border: 'rgba(34, 197, 94, 0.7)' },
                        red: { bg: 'rgba(239, 68, 68, 0.4)', text: '#ffffff', border: 'rgba(239, 68, 68, 0.7)' },
                        yellow: { bg: 'rgba(234, 179, 8, 0.5)', text: '#000000', border: 'rgba(234, 179, 8, 0.7)' },
                        purple: { bg: 'rgba(168, 85, 247, 0.4)', text: '#ffffff', border: 'rgba(168, 85, 247, 0.7)' },
                        orange: { bg: 'rgba(249, 115, 22, 0.4)', text: '#ffffff', border: 'rgba(249, 115, 22, 0.7)' },
                        pink: { bg: 'rgba(236, 72, 153, 0.4)', text: '#ffffff', border: 'rgba(236, 72, 153, 0.7)' },
                        cyan: { bg: 'rgba(6, 182, 212, 0.4)', text: '#ffffff', border: 'rgba(6, 182, 212, 0.7)' },
                        gray: { bg: 'rgba(107, 114, 128, 0.4)', text: '#ffffff', border: 'rgba(107, 114, 128, 0.7)' },
                        indigo: { bg: 'rgba(99, 102, 241, 0.4)', text: '#ffffff', border: 'rgba(99, 102, 241, 0.7)' },
                      };
                      return colorMap[color];
                    };
                    const eventStyle = getEventStyle(eventColor);
                    return (
                      <div
                        key={event.id}
                        className="text-xs px-1.5 py-0.5 rounded border truncate font-medium"
                        style={{
                          backgroundColor: eventStyle.bg,
                          color: eventStyle.text,
                          borderColor: eventStyle.border,
                          borderWidth: '1px',
                          borderStyle: 'solid',
                        }}
                        title={event.title}
                      >
                        {event.emoji && <span className="mr-1">{event.emoji}</span>}
                        {event.title}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          items={buildContextMenuItems(contextMenu.date)}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};
