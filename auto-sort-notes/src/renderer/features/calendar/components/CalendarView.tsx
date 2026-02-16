/**
 * Calendar View Component
 * 
 * Purpose: Main calendar view component with month/week/day views.
 * Displays calendar events and allows navigation.
 * 
 * Last Updated: 2024
 * Status: Placeholder - Ready for breadcrumb comments
 */

// Comment 102: Calendar View Component - Main Calendar Display
// This component provides the main calendar interface with multiple view types (month, week, day).
// It displays calendar events and allows user interaction (create, edit, delete events).
//
// Intended Interactions:
// - Uses: src/renderer/features/calendar/services/calendar-service.ts (Comment 100)
// - Uses: src/renderer/features/calendar/hooks/useCalendar.ts (Comment 104)
// - Uses: src/renderer/features/calendar/components/CalendarMonth.tsx
// - Uses: src/renderer/features/calendar/components/CalendarWeek.tsx
// - Uses: src/renderer/features/calendar/components/CalendarDay.tsx
// - Updates: src/renderer/stores/calendar-store.ts (Zustand store)
//
// Logic Flow:
// 1. Component loads calendar events via useCalendar hook
// 2. Displays calendar view (month/week/day) based on current view
// 3. User interacts with calendar (navigate, create event, etc.)
// 4. Component calls service layer for operations
// 5. UI updates reflect changes
//
// Dependencies:
// - calendar-service.ts (Comment 100) - business logic
// - useCalendar.ts (Comment 104) - calendar operations hook
// - calendar-store.ts - state management
//
// Related Files:
// - src/renderer/features/calendar/services/calendar-service.ts (called by this component)
// - src/renderer/features/calendar/hooks/useCalendar.ts (used by this component)
// - src/renderer/features/calendar/components/CalendarMonth.tsx (month view)
// - src/renderer/features/calendar/components/CalendarWeek.tsx (week view)
// - src/renderer/features/calendar/components/CalendarDay.tsx (day view)
//
// Related Comments:
// - Comment 100 (calendar-service.ts - service called by this component)
// - Comment 102 (CalendarMonth.tsx - month view component)
// - Comment 102 (CalendarWeek.tsx - week view component)
// - Comment 102 (CalendarDay.tsx - day view component)
// - Comment 104 (useCalendar.ts - calendar operations hook)

import { useState, useEffect, useRef } from 'react';
import { MenuBar } from '../../../shared/components/MenuBar';
import { Toolbar } from '../../../shared/components/Toolbar';
import { CalendarMonth } from './CalendarMonth';
import { dateUtils } from '../../../shared/utils/date-utils';
import { Plus, Calendar as CalendarIcon, CalendarDays, CalendarRange, Search, RotateCcw, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const monthPickerRef = useRef<HTMLDivElement>(null);
  const yearPickerRef = useRef<HTMLDivElement>(null);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target as Node)) {
        setShowMonthPicker(false);
      }
      if (yearPickerRef.current && !yearPickerRef.current.contains(event.target as Node)) {
        setShowYearPicker(false);
      }
    };

    if (showMonthPicker || showYearPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMonthPicker, showYearPicker]);

  const handlePreviousMonth = () => {
    setCurrentDate(dateUtils.subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(dateUtils.addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const textWidth = rect.width;
    
    // If click is in the left 60% of the text, open month picker
    // If click is in the right 40% of the text, open year picker
    if (clickX < textWidth * 0.6) {
      setShowMonthPicker(!showMonthPicker);
      setShowYearPicker(false);
    } else {
      setShowYearPicker(!showYearPicker);
      setShowMonthPicker(false);
    }
  };

  const handleMonthSelect = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearPicker(false);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Generate year range (current year ± 10 years)
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  // Comment 1260: Calendar Menu Bar - File Menu
  // File menu dropdown with event operations
  // - New Event: Creates new calendar event (Comment 1261)
  // - Import Events: Imports events from external calendar files (Comment 1262)
  // - Export Events: Exports events to external calendar format (Comment 1263)
  
  // Comment 1261: Calendar Menu Bar - File > New Event
  // Opens event editor dialog to create a new calendar event with date, time, description, etc.
  // Related: event-service.ts createEvent, EventEditor component
  
  // Comment 1262: Calendar Menu Bar - File > Import Events
  // Imports calendar events from external calendar files (ICS, etc.).
  // Related: file-import-service.ts, calendar import functionality
  
  // Comment 1263: Calendar Menu Bar - File > Export Events
  // Exports calendar events to external calendar format (ICS, etc.).
  // Related: file-export-service.ts, calendar export functionality
  
  // Comment 1264: Calendar Menu Bar - View Menu
  // View menu dropdown with calendar view options
  // - Month View: Shows full month grid (Comment 1265)
  // - Week View: Shows single week with time slots (Comment 1266)
  // - Day View: Shows single day with detailed time slots (Comment 1267)
  // - Today: Navigates to today's date (Comment 1268)
  
  // Comment 1265: Calendar Menu Bar - View > Month View
  // Changes calendar display to show full month grid view.
  // Related: CalendarMonth component, calendar-service.ts getEventsForMonth
  
  // Comment 1266: Calendar Menu Bar - View > Week View
  // Changes calendar display to show single week with time slots.
  // Related: CalendarWeek component, calendar-service.ts getEventsForWeek
  
  // Comment 1267: Calendar Menu Bar - View > Day View
  // Changes calendar display to show single day with detailed time slots.
  // Related: CalendarDay component, calendar-service.ts getEventsForDay
  
  // Comment 1268: Calendar Menu Bar - View > Today
  // Jumps calendar view to current date, maintaining current view type.
  // Related: calendar-service.ts navigateToDate
  
  // Comment 1269: Calendar Menu Bar - Event Menu
  // Event menu dropdown with event management
  // - Edit Event: Edits selected event (Comment 1270)
  // - Delete Event: Deletes selected event (Comment 1271)
  // - Duplicate Event: Creates copy of event (Comment 1272)
  
  // Comment 1270: Calendar Menu Bar - Event > Edit Event
  // Opens event editor dialog to edit selected event.
  // Related: event-service.ts updateEvent, EventEditor component
  
  // Comment 1271: Calendar Menu Bar - Event > Delete Event
  // Deletes the selected calendar event.
  // Related: event-service.ts deleteEvent
  
  // Comment 1272: Calendar Menu Bar - Event > Duplicate Event
  // Creates a copy of the selected event with same details.
  // Related: event-service.ts duplicateEvent
  
  // Comment 1273: Calendar Menu Bar - Tools Menu
  // Tools menu dropdown with utility functions
  // - Search: Opens search interface for events (Comment 1274)
  // - Filter: Opens filter options for events (Comment 1275)
  
  // Comment 1274: Calendar Menu Bar - Tools > Search
  // Opens search dialog to find events by title, description, date range, etc.
  // Related: search-service.ts, calendar event search
  
  // Comment 1275: Calendar Menu Bar - Tools > Filter
  // Opens filter panel to filter events by date range, category, etc.
  // Related: calendar-service.ts filterEvents
  
  // Comment 1276: Calendar Menu Bar - Settings Menu
  // Settings menu dropdown
  // - Calendar Settings: Opens calendar-specific settings (Comment 1277)
  // - Default View: Sets default calendar view (Comment 1278)
  
  // Comment 1277: Calendar Menu Bar - Settings > Calendar Settings
  // Opens settings dialog for customizing calendar appearance and behavior.
  // Related: Settings component, config/settings.ts
  
  // Comment 1278: Calendar Menu Bar - Settings > Default View
  // Sets the default calendar view (month, week, or day).
  // Related: config/settings.ts, calendar preferences

  const menuItems = [
    {
      id: 'file',
      label: 'File',
      items: [
        {
          id: 'new-event',
          label: 'New Event...',
          shortcut: 'Ctrl+N',
          onClick: () => {
            // TODO: Implement new event (Comment 1261)
            console.log('New Event - placeholder');
          },
        },
        { id: 'separator-1', separator: true },
        {
          id: 'import',
          label: 'Import Events...',
          onClick: () => {
            // TODO: Implement import events (Comment 1262)
            console.log('Import Events - placeholder');
          },
        },
        {
          id: 'export',
          label: 'Export Events...',
          onClick: () => {
            // TODO: Implement export events (Comment 1263)
            console.log('Export Events - placeholder');
          },
        },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        {
          id: 'month-view',
          label: 'Month View',
          onClick: () => {
            setViewType('month');
          },
        },
        {
          id: 'week-view',
          label: 'Week View',
          onClick: () => {
            setViewType('week');
            // TODO: Implement week view (Comment 1266)
            console.log('Week View - placeholder');
          },
        },
        {
          id: 'day-view',
          label: 'Day View',
          onClick: () => {
            setViewType('day');
            // TODO: Implement day view (Comment 1267)
            console.log('Day View - placeholder');
          },
        },
        { id: 'separator-1', separator: true },
        {
          id: 'today',
          label: 'Go to Today',
          shortcut: 'Ctrl+T',
          onClick: () => {
            handleToday();
          },
        },
      ],
    },
    {
      id: 'event',
      label: 'Event',
      items: [
        {
          id: 'edit-event',
          label: 'Edit Event...',
          shortcut: 'Ctrl+E',
          onClick: () => {
            // TODO: Implement edit event (Comment 1270)
            console.log('Edit Event - placeholder');
          },
        },
        {
          id: 'delete-event',
          label: 'Delete Event',
          shortcut: 'Delete',
          onClick: () => {
            // TODO: Implement delete event (Comment 1271)
            console.log('Delete Event - placeholder');
          },
        },
        {
          id: 'duplicate-event',
          label: 'Duplicate Event',
          shortcut: 'Ctrl+D',
          onClick: () => {
            // TODO: Implement duplicate event (Comment 1272)
            console.log('Duplicate Event - placeholder');
          },
        },
      ],
    },
    {
      id: 'tools',
      label: 'Tools',
      items: [
        {
          id: 'search',
          label: 'Search...',
          shortcut: 'Ctrl+F',
          onClick: () => {
            // TODO: Implement search (Comment 1274)
            console.log('Search - placeholder');
          },
        },
        {
          id: 'filter',
          label: 'Filter...',
          onClick: () => {
            // TODO: Implement filter (Comment 1275)
            console.log('Filter - placeholder');
          },
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      items: [
        {
          id: 'calendar-settings',
          label: 'Calendar Settings...',
          onClick: () => {
            // TODO: Implement calendar settings (Comment 1277)
            console.log('Calendar Settings - placeholder');
          },
        },
        {
          id: 'default-view',
          label: 'Default View',
          onClick: () => {
            // TODO: Implement default view (Comment 1278)
            console.log('Default View - placeholder');
          },
        },
      ],
    },
  ];

  // Toolbar items (quick action buttons)
  const toolbarItems = [
    {
      id: 'new-event',
      label: 'New Event',
      icon: Plus,
      variant: 'primary' as const,
      onClick: () => {
        // TODO: Implement new event (Comment 1261)
        console.log('New Event clicked - placeholder');
      },
    },
    {
      id: 'month-view',
      label: 'Month',
      icon: CalendarIcon,
      onClick: () => {
        setViewType('month');
      },
    },
    {
      id: 'week-view',
      label: 'Week',
      icon: CalendarRange,
      onClick: () => {
        setViewType('week');
        // TODO: Implement week view (Comment 1266)
        console.log('Week View clicked - placeholder');
      },
    },
    {
      id: 'day-view',
      label: 'Day',
      icon: CalendarDays,
      onClick: () => {
        setViewType('day');
        // TODO: Implement day view (Comment 1267)
        console.log('Day View clicked - placeholder');
      },
    },
    {
      id: 'today',
      label: 'Today',
      icon: RotateCcw,
      onClick: () => {
        handleToday();
      },
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      onClick: () => {
        // TODO: Implement search (Comment 1274)
        console.log('Search clicked - placeholder');
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onClick: () => {
        // TODO: Implement settings (Comment 1277)
        console.log('Settings clicked - placeholder');
      },
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <MenuBar items={menuItems} />
      <Toolbar items={toolbarItems} />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Calendar navigation header */}
        <div className="flex items-center justify-between pl-6 pt-4 pb-4 border-b border-border" style={{ paddingRight: '16px' }}>
          <div className="flex items-center">
            <button
              onClick={handlePreviousMonth}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-lg leading-none flex items-center bg-transparent border-none outline-none"
              style={{ 
                padding: '4px 24px 4px 0',
                margin: 0,
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
              aria-label="Previous month"
            >
              &lt;
            </button>
            <div className="relative min-w-[200px] text-center">
              <h2 
                className="text-xl font-semibold cursor-pointer"
                onClick={handleDateClick}
                aria-label="Select month or year"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDateClick(e as any);
                  }
                }}
              >
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              
              {/* Month Picker Dropdown */}
              {showMonthPicker && (
                <div 
                  ref={monthPickerRef}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-background border border-border rounded-md shadow-lg z-50 p-2 min-w-[150px] max-h-[300px] overflow-y-auto"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="flex flex-col gap-1">
                    {months.map((month, index) => (
                      <button
                        key={index}
                        onClick={() => handleMonthSelect(index)}
                        className="px-3 py-2 text-base rounded transition-colors text-left"
                        style={{
                          backgroundColor: currentMonth === index ? 'var(--color-primary)' : 'transparent',
                          color: currentMonth === index ? 'var(--color-primary-foreground)' : 'var(--color-foreground)',
                        }}
                        onMouseEnter={(e) => {
                          if (currentMonth !== index) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentMonth !== index) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Year Picker Dropdown */}
              {showYearPicker && (
                <div 
                  ref={yearPickerRef}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-background border border-border rounded-md shadow-lg z-50 p-2 min-w-[120px] max-h-[300px] overflow-y-auto"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="flex flex-col gap-1">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className="px-3 py-2 text-base rounded transition-colors text-center"
                        style={{
                          backgroundColor: currentYear === year ? 'var(--color-primary)' : 'transparent',
                          color: currentYear === year ? 'var(--color-primary-foreground)' : 'var(--color-foreground)',
                        }}
                        onMouseEnter={(e) => {
                          if (currentYear !== year) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentYear !== year) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleNextMonth}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-lg leading-none flex items-center bg-transparent border-none outline-none"
              style={{ 
                padding: '4px 0 4px 24px',
                margin: 0,
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
              aria-label="Next month"
            >
              &gt;
            </button>
          </div>
          <button
            onClick={handleToday}
            className="px-4 py-1.5 text-sm rounded transition-colors"
            style={{ 
              marginRight: '0',
              backgroundColor: 'var(--color-muted)',
              color: 'var(--color-foreground)',
              border: '1px solid var(--color-border)',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-secondary)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
            }}
          >
            Today
          </button>
        </div>

        {/* Calendar content */}
        <div className="flex-1 overflow-auto pl-6 pt-4 pb-4" style={{ paddingRight: '16px' }}>
          {viewType === 'month' && (
            <CalendarMonth currentDate={currentDate} events={[]} />
          )}
          {viewType === 'week' && (
            <div className="text-center text-muted-foreground py-8">
              Week view - Coming soon
            </div>
          )}
          {viewType === 'day' && (
            <div className="text-center text-muted-foreground py-8">
              Day view - Coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
