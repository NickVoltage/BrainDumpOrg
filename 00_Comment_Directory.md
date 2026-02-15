# Comment Directory

> **Note:** This directory maintains a registry of all numbered comments in the codebase. This enables easy navigation, relationship tracking, and comprehensive understanding of the codebase structure.

**Last Updated:** 2024  
**Total Comments:** 908+  
**Status:** Complete - All breadcrumb comments registered

---

## Table of Contents

- [Infrastructure Comments (001-011)](#infrastructure-comments-001-011)
- [Notes Feature Comments (010-023)](#notes-feature-comments-010-023)
- [Calendar Feature Comments (100-111)](#calendar-feature-comments-100-111)
- [To-Do List Feature Comments (200-210)](#to-do-list-feature-comments-200-210)
- [Alarm/Timer Feature Comments (300-317)](#alarmtimer-feature-comments-300-317)
- [Metadata Feature Comments (400-415)](#metadata-feature-comments-400-415)
- [Branched Notes Feature Comments (500-506)](#branched-notes-feature-comments-500-506)
- [Historical Timelines Feature Comments (600-608)](#historical-timelines-feature-comments-600-608)
- [Hierarchical Notes Feature Comments (700-709)](#hierarchical-notes-feature-comments-700-709)
- [File Import/Export Feature Comments (800-805)](#file-importexport-feature-comments-800-805)
- [Dashboard Feature Comments (900-908)](#dashboard-feature-comments-900-908)

---

## Infrastructure Comments (001-011)

### Comment 001
- **File:** `auto-sort-notes/src/renderer/shared/storage/database.ts`
- **Location:** Database connection module
- **Purpose:** SQLite Database Connection and Initialization
- **Related:** Comment 001 (storage-helpers.ts), Comment 001 (database.rs), Comment 012 (note-database-storage.ts), Comment 101 (calendar-storage.ts)
- **Description:** This module handles SQLite database connection, initialization, and core database operations. It provides a centralized database interface that all features will use for metadata storage.

### Comment 002
- **File:** `auto-sort-notes/src/renderer/shared/storage/file-system.ts`
- **Location:** File system operations module
- **Purpose:** File System Operations and Utilities
- **Related:** Comment 002 (storage-helpers.ts), Comment 002 (storage.rs), Comment 011 (note-file-storage.ts), Comment 800 (file-import-service.ts)
- **Description:** This module handles all file system operations for content storage. It provides utilities for reading, writing, creating, deleting, and managing files in the application data directory.

### Comment 003
- **File:** `auto-sort-notes/src/renderer/shared/types/result.types.ts`
- **Location:** Result type definition
- **Purpose:** Result<T, E> Type for Error Handling
- **Related:** Comment 003 (All service files), Comment 003 (All storage files), Comment 010 (note-service.ts)
- **Description:** This type provides a functional approach to error handling, similar to Rust's Result type. It allows functions to return either a success value (Ok) or an error (Err) without throwing exceptions.

### Comment 004
- **File:** `auto-sort-notes/src/renderer/shared/storage/storage-helpers.ts`
- **Location:** Storage helper functions module
- **Purpose:** Common Storage Helper Functions
- **Related:** Comment 001 (database.ts), Comment 002 (file-system.ts), Comment 004 (All feature storage modules)
- **Description:** This module provides common helper functions for database and file system operations. It wraps the database and file-system modules with additional utilities and error handling.

### Comment 005
- **File:** `auto-sort-notes/src/renderer/shared/services/file-service.ts`
- **Location:** File service module
- **Purpose:** Shared File Operations
- **Related:** Comment 002 (file-system.ts)
- **Description:** This service provides common file operations used across features. Wraps file-system.ts with additional utilities.

### Comment 006
- **File:** `auto-sort-notes/src/renderer/shared/services/search-service.ts`
- **Location:** Search service module
- **Purpose:** Shared Search Operations
- **Related:** Comment 403 (metadata-search-service.ts)
- **Description:** This service provides common search functionality used across features. Can integrate with metadata-search-service.ts for unified search.

### Comment 007
- **File:** `auto-sort-notes/src/renderer/shared/services/notification-service.ts`
- **Location:** Notification service module
- **Purpose:** System Notifications
- **Related:** Comment 315 (AlarmNotification.tsx)
- **Description:** This service provides system notifications used across features. Used by alarms, reminders, and other features for user notifications.

### Comment 008
- **File:** `auto-sort-notes/src/renderer/shared/utils/debounce.ts`
- **Location:** Debounce utility module
- **Purpose:** Debounce Function
- **Related:** Comment 014 (useAutoSave.ts)
- **Description:** This utility provides debounce functionality for delaying execution. Used by useAutoSave.ts and other debounced operations.

### Comment 009
- **File:** `auto-sort-notes/src/renderer/shared/utils/date-utils.ts`
- **Location:** Date utilities module
- **Purpose:** Date Manipulation
- **Related:** Comment 100 (calendar-service.ts)
- **Description:** This utility provides date manipulation and formatting functions. Used across calendar, todos, alarms, and other date-related features.

### Comment 010
- **File:** `auto-sort-notes/src/renderer/shared/hooks/useTheme.ts`
- **Location:** useTheme hook
- **Purpose:** React Hook for Theme Operations
- **Related:** Comment 010 (ThemeContext.tsx)
- **Description:** This hook provides a React interface for theme operations. Uses ThemeContext for theme state management.

### Comment 011
- **File:** `auto-sort-notes/src/renderer/config/themes.ts`
- **Location:** Themes configuration module
- **Purpose:** Theme Definitions
- **Related:** Comment 010 (ThemeContext.tsx)
- **Description:** This file defines available themes and their properties. Used by ThemeContext and theme toggle components.

---

## Notes Feature Comments (010-023)

### Comment 010
- **File:** `auto-sort-notes/src/renderer/features/notes/services/note-service.ts`
- **Location:** Note service module
- **Purpose:** Note Service - Main Entry Point for Note Operations
- **Related:** Comment 010 (NoteEditor.tsx), Comment 010 (useNote.ts), Comment 011 (note-file-storage.ts), Comment 012 (note-database-storage.ts), Comment 013 (NoteEditor.tsx), Comment 014 (useAutoSave.ts)
- **Description:** This service handles all business logic for note operations (create, read, update, delete). It coordinates between the presentation layer (components) and infrastructure layer (storage).

### Comment 011
- **File:** `auto-sort-notes/src/renderer/features/notes/storage/note-file-storage.ts`
- **Location:** Note file storage module
- **Purpose:** Note File Storage - Content Storage (Tiptap JSON)
- **Related:** Comment 010 (note-service.ts), Comment 002 (file-system.ts), Comment 012 (note-database-storage.ts)
- **Description:** This module handles file system operations for note content storage. Note content is stored as Tiptap JSON files in the file system, while metadata is stored in SQLite.

### Comment 012
- **File:** `auto-sort-notes/src/renderer/features/notes/storage/note-database-storage.ts`
- **Location:** Note database storage module
- **Purpose:** Note Database Storage - Metadata Storage (SQLite)
- **Related:** Comment 010 (note-service.ts), Comment 001 (database.ts), Comment 011 (note-file-storage.ts)
- **Description:** This module handles SQLite operations for note metadata. Note metadata (title, tags, projects, document number, timestamps, etc.) is stored in SQLite, while content is stored in the file system.

### Comment 013
- **File:** `auto-sort-notes/src/renderer/features/notes/components/NoteEditor.tsx`
- **Location:** NoteEditor component
- **Purpose:** Note Editor Component - Main Text Editor with Tiptap
- **Related:** Comment 010 (note-service.ts), Comment 013 (NoteToolbar.tsx), Comment 013 (NoteMetadataPanel.tsx), Comment 014 (useAutoSave.ts), Comment 016 (useNote.ts)
- **Description:** This component provides the main text editor interface using Tiptap rich text editor. It handles user input, formatting, and content editing.

### Comment 014
- **File:** `auto-sort-notes/src/renderer/features/notes/hooks/useAutoSave.ts`
- **Location:** useAutoSave hook
- **Purpose:** Auto-Save Hook - Debounced Auto-Save Functionality
- **Related:** Comment 013 (NoteEditor.tsx), Comment 010 (note-service.ts)
- **Description:** This hook provides auto-save functionality with debouncing for note content. It monitors editor content changes and automatically saves after a debounce period.

### Comment 015
- **File:** `auto-sort-notes/src/renderer/features/notes/services/file-import-service.ts`
- **Location:** File import service module
- **Purpose:** File Import Service - Import Various File Types
- **Related:** Comment 015 (FileImportDialog.tsx), Comment 800 (docx-parser.ts), Comment 010 (note-service.ts)
- **Description:** This service handles importing various file types (DOCX, PDF, Markdown, HTML) into notes. It converts imported files to Tiptap JSON format for use in the editor.

### Comment 016
- **File:** `auto-sort-notes/src/renderer/features/notes/hooks/useNote.ts`
- **Location:** useNote hook
- **Purpose:** useNote Hook - React Hook for Note Operations
- **Related:** Comment 010 (note-service.ts), Comment 013 (NoteEditor.tsx)
- **Description:** This hook provides a React interface for note operations, wrapping the note service. It manages note state, loading states, and error handling for components.

### Comment 017
- **File:** `auto-sort-notes/src/renderer/features/notes/components/NoteList.tsx`
- **Location:** NoteList component
- **Purpose:** Note List Component - Display List of Notes
- **Related:** Comment 016 (useNote.ts), Comment 900 (Dashboard.tsx)
- **Description:** This component displays a list of notes with filtering, sorting, and selection capabilities. Used in dashboard and note management views.

### Comment 018
- **File:** `auto-sort-notes/src/renderer/features/notes/components/NoteTree.tsx`
- **Location:** NoteTree component
- **Purpose:** Note Tree Component - Hierarchical Tree View
- **Related:** Comment 700 (hierarchy-service.ts), Comment 702 (NoteTree.tsx in hierarchy feature)
- **Description:** This component displays notes in a hierarchical tree structure showing parent-child relationships. Part of the Hierarchical Notes feature.

### Comment 019
- **File:** `auto-sort-notes/src/renderer/features/notes/components/NoteMetadataPanel.tsx`
- **Location:** NoteMetadataPanel component
- **Purpose:** Note Metadata Panel Component - Edit Note Metadata
- **Related:** Comment 010 (note-service.ts), Comment 401 (tag-service.ts), Comment 402 (project-service.ts)
- **Description:** This component displays and allows editing of note metadata (tags, projects, document number). Part of the Custom Metadata Association feature.

### Comment 020
- **File:** `auto-sort-notes/src/renderer/features/notes/components/NoteToolbar.tsx`
- **Location:** NoteToolbar component
- **Purpose:** Note Toolbar Component - Formatting Toolbar
- **Related:** Comment 013 (NoteEditor.tsx)
- **Description:** This component provides a formatting toolbar for the Tiptap editor with formatting options. Integrates with Tiptap commands for text formatting.

### Comment 021
- **File:** `auto-sort-notes/src/renderer/features/notes/components/NoteSearch.tsx`
- **Location:** NoteSearch component
- **Purpose:** Note Search Component - Search Notes
- **Related:** Comment 010 (note-service.ts), Comment 403 (metadata-search-service.ts)
- **Description:** This component provides search functionality for notes, searching both content and metadata. Can integrate with unified metadata search for system-wide searching.

### Comment 022
- **File:** `auto-sort-notes/src/renderer/features/notes/services/hierarchy-service.ts`
- **Location:** Hierarchy service module (in notes feature)
- **Purpose:** Hierarchy Service - Hierarchical Note Relationships
- **Related:** Comment 700 (hierarchy-service.ts in hierarchy feature), Comment 012 (note-database-storage.ts)
- **Description:** This service handles hierarchical note relationships using the adjacency list model. Part of the Hierarchical Notes feature.

### Comment 023
- **File:** `auto-sort-notes/src/renderer/features/notes/services/version-service.ts`
- **Location:** Version service module (in notes feature)
- **Purpose:** Version Service - Historical Timeline Operations
- **Related:** Comment 600 (version-service.ts in versions feature), Comment 011 (note-file-storage.ts)
- **Description:** This service handles version history operations for non-destructive historical timelines. Part of the Historical Timelines feature.

---

## Calendar Feature Comments (100-111)

### Comment 100
- **File:** `auto-sort-notes/src/renderer/features/calendar/services/calendar-service.ts`
- **Location:** Calendar service module
- **Purpose:** Calendar Service - Main Entry Point for Calendar Operations
- **Related:** Comment 100 (CalendarView.tsx), Comment 100 (useCalendar.ts), Comment 101 (calendar-storage.ts), Comment 102 (CalendarView.tsx)
- **Description:** This service handles all business logic for calendar operations including event management, view switching (month/week/day), and recurrence patterns.

### Comment 101
- **File:** `auto-sort-notes/src/renderer/features/calendar/storage/calendar-storage.ts`
- **Location:** Calendar storage module
- **Purpose:** Calendar Storage - Calendar Data Persistence
- **Related:** Comment 100 (calendar-service.ts), Comment 001 (database.ts)
- **Description:** This module handles SQLite operations for calendar events and metadata. Calendar events are stored in the 'reminders' table (shared with reminders feature).

### Comment 102
- **File:** `auto-sort-notes/src/renderer/features/calendar/components/CalendarView.tsx`
- **Location:** CalendarView component
- **Purpose:** Calendar View Component - Main Calendar Display
- **Related:** Comment 100 (calendar-service.ts), Comment 102 (CalendarMonth.tsx), Comment 102 (CalendarWeek.tsx), Comment 102 (CalendarDay.tsx), Comment 104 (useCalendar.ts)
- **Description:** This component provides the main calendar interface with multiple view types (month, week, day). It displays calendar events and allows user interaction.

### Comment 103
- **File:** `auto-sort-notes/src/renderer/features/calendar/services/event-service.ts`
- **Location:** Event service module
- **Purpose:** Event Service - Calendar Event Operations
- **Related:** Comment 100 (calendar-service.ts), Comment 101 (calendar-storage.ts)
- **Description:** This service handles individual calendar event operations including creation, updates, deletion, and querying. Called by calendar service for event-specific operations.

### Comment 104
- **File:** `auto-sort-notes/src/renderer/features/calendar/hooks/useCalendar.ts`
- **Location:** useCalendar hook
- **Purpose:** useCalendar Hook - React Hook for Calendar Operations
- **Related:** Comment 100 (calendar-service.ts), Comment 102 (CalendarView.tsx)
- **Description:** This hook provides a React interface for calendar operations, wrapping the calendar service. It manages calendar state, loading states, and error handling for components.

### Comment 105
- **File:** `auto-sort-notes/src/renderer/features/calendar/services/recurrence-service.ts`
- **Location:** Recurrence service module
- **Purpose:** Recurrence Service - Recurring Event Patterns
- **Related:** Comment 103 (event-service.ts), Comment 108 (EventEditor.tsx)
- **Description:** This service handles recurrence pattern logic for calendar events. Generates recurring event instances based on recurrence rules.

### Comment 106
- **File:** `auto-sort-notes/src/renderer/features/calendar/hooks/useCalendarEvent.ts`
- **Location:** useCalendarEvent hook
- **Purpose:** useCalendarEvent Hook - React Hook for Event Operations
- **Related:** Comment 103 (event-service.ts), Comment 108 (EventEditor.tsx)
- **Description:** This hook provides a React interface for individual calendar event operations. Wraps the event service for component use.

### Comment 107
- **File:** `auto-sort-notes/src/renderer/features/calendar/components/CalendarEvent.tsx`
- **Location:** CalendarEvent component
- **Purpose:** Calendar Event Component - Event Display
- **Related:** Comment 102 (CalendarView.tsx), Comment 108 (EventEditor.tsx)
- **Description:** This component displays an individual calendar event in calendar views. Shows event title, time, and basic details.

### Comment 108
- **File:** `auto-sort-notes/src/renderer/features/calendar/components/EventEditor.tsx`
- **Location:** EventEditor component
- **Purpose:** Event Editor Component - Create/Edit Calendar Events
- **Related:** Comment 103 (event-service.ts), Comment 105 (recurrence-service.ts), Comment 106 (useCalendarEvent.ts)
- **Description:** This component provides a form interface for creating and editing calendar events. Handles event details, dates, recurrence patterns, and reminder settings.

### Comment 109
- **File:** `auto-sort-notes/src/renderer/features/calendar/components/EventList.tsx`
- **Location:** EventList component
- **Purpose:** Event List Component - List View of Events
- **Related:** Comment 102 (CalendarDay.tsx)
- **Description:** This component displays a list of calendar events with filtering and sorting options. Used in calendar day view and as a standalone list view.

### Comment 110
- **File:** `auto-sort-notes/src/renderer/features/calendar/types.ts`
- **Location:** Calendar types module
- **Purpose:** Calendar Types - TypeScript Type Definitions
- **Related:** Comment 100 (calendar-service.ts), Comment 102 (CalendarView.tsx)
- **Description:** This file defines TypeScript interfaces and types for calendar feature. Includes CalendarEvent, RecurrencePattern, CalendarView, etc.

### Comment 111
- **File:** `auto-sort-notes/src/renderer/features/calendar/index.ts`
- **Location:** Calendar feature exports
- **Purpose:** Calendar Feature Exports - Public API
- **Related:** All calendar feature comments (100-110)
- **Description:** This file exports public API for calendar feature. Other features can import calendar functionality through this file.

---

## To-Do List Feature Comments (200-210)

### Comment 200
- **File:** `auto-sort-notes/src/renderer/features/todos/services/todo-service.ts`
- **Location:** Todo service module
- **Purpose:** Todo Service - Main Entry Point for Todo Operations
- **Related:** Comment 200 (TodoList.tsx), Comment 200 (useTodo.ts), Comment 201 (todo-storage.ts)
- **Description:** This service handles all business logic for to-do list operations. Manages todo items with Do dates and Due dates, priorities, and completion status.

### Comment 201
- **File:** `auto-sort-notes/src/renderer/features/todos/storage/todo-storage.ts`
- **Location:** Todo storage module
- **Purpose:** Todo Storage - Todo Data Persistence
- **Related:** Comment 200 (todo-service.ts), Comment 001 (database.ts)
- **Description:** This module handles SQLite operations for to-do list items. Todo items are stored in the 'todos' table with Do dates, Due dates, priorities, etc.

### Comment 202
- **File:** `auto-sort-notes/src/renderer/features/todos/components/TodoList.tsx`
- **Location:** TodoList component
- **Purpose:** Todo List Component - Main Todo List Display
- **Related:** Comment 200 (todo-service.ts), Comment 203 (TodoItem.tsx), Comment 205 (useTodoList.ts)
- **Description:** This component provides the main to-do list interface for the Do/Due tab. Displays todos with filtering by Do date, Due date, priority, and completion status.

### Comment 203
- **File:** `auto-sort-notes/src/renderer/features/todos/components/TodoItem.tsx`
- **Location:** TodoItem component
- **Purpose:** Todo Item Component - Individual Todo Display
- **Related:** Comment 202 (TodoList.tsx)
- **Description:** This component displays an individual to-do item with its details. Shows title, Do date, Due date, priority, completion status, and actions.

### Comment 204
- **File:** `auto-sort-notes/src/renderer/features/todos/hooks/useTodo.ts`
- **Location:** useTodo hook
- **Purpose:** useTodo Hook - React Hook for Todo Operations
- **Related:** Comment 200 (todo-service.ts), Comment 206 (TodoEditor.tsx)
- **Description:** This hook provides a React interface for individual todo operations. Wraps the todo service for component use.

### Comment 205
- **File:** `auto-sort-notes/src/renderer/features/todos/hooks/useTodoList.ts`
- **Location:** useTodoList hook
- **Purpose:** useTodoList Hook - React Hook for Todo List Operations
- **Related:** Comment 200 (todo-service.ts), Comment 202 (TodoList.tsx)
- **Description:** This hook provides a React interface for todo list operations. Manages list state, filtering, and sorting.

### Comment 206
- **File:** `auto-sort-notes/src/renderer/features/todos/components/TodoEditor.tsx`
- **Location:** TodoEditor component
- **Purpose:** Todo Editor Component - Create/Edit Todo Form
- **Related:** Comment 200 (todo-service.ts), Comment 204 (useTodo.ts)
- **Description:** This component provides a form interface for creating and editing to-do items. Handles todo title, Do date, Due date, priority, and description.

### Comment 207
- **File:** `auto-sort-notes/src/renderer/features/todos/components/TodoFilter.tsx`
- **Location:** TodoFilter component
- **Purpose:** Todo Filter Component - Todo List Filtering
- **Related:** Comment 202 (TodoList.tsx)
- **Description:** This component provides filtering options for the to-do list. Filters by Do date, Due date, priority, completion status, and search query.

### Comment 208
- **File:** `auto-sort-notes/src/renderer/features/todos/components/TodoSearch.tsx`
- **Location:** TodoSearch component
- **Purpose:** Todo Search Component - Search Todos
- **Related:** Comment 202 (TodoList.tsx)
- **Description:** This component provides search functionality for to-do items. Searches todo titles, descriptions, and metadata.

### Comment 209
- **File:** `auto-sort-notes/src/renderer/features/todos/types.ts`
- **Location:** Todo types module
- **Purpose:** Todo Types - TypeScript Type Definitions
- **Related:** Comment 200 (todo-service.ts)
- **Description:** This file defines TypeScript interfaces and types for todo feature. Includes TodoItem, TodoPriority, TodoStatus, etc.

### Comment 210
- **File:** `auto-sort-notes/src/renderer/features/todos/index.ts`
- **Location:** Todo feature exports
- **Purpose:** Todo Feature Exports - Public API
- **Related:** All todo feature comments (200-209)
- **Description:** This file exports public API for todo feature.

---

## Alarm/Timer Feature Comments (300-317)

### Comment 300
- **File:** `auto-sort-notes/src/renderer/features/alarms/services/timer-service.ts`
- **Location:** Timer service module
- **Purpose:** Timer Service - Timer Operations
- **Related:** Comment 300 (TimerDisplay.tsx), Comment 300 (TimerControls.tsx), Comment 301 (timer-storage.ts), Comment 306 (useTimer.ts)
- **Description:** This service handles all business logic for timer operations including countdown, count-up, pause, resume, and reset functionality.

### Comment 301
- **File:** `auto-sort-notes/src/renderer/features/alarms/storage/timer-storage.ts`
- **Location:** Timer storage module
- **Purpose:** Timer Storage - Timer Data Persistence
- **Related:** Comment 300 (timer-service.ts), Comment 001 (database.ts)
- **Description:** This module handles SQLite operations for timer state. Timer data is stored in the 'timers' table.

### Comment 302
- **File:** `auto-sort-notes/src/renderer/features/alarms/services/alarm-service.ts`
- **Location:** Alarm service module
- **Purpose:** Alarm Service - Alarm Operations
- **Related:** Comment 302 (AlarmEditor.tsx), Comment 303 (alarm-storage.ts), Comment 303 (scheduler.rs), Comment 307 (useAlarm.ts)
- **Description:** This service handles all business logic for alarm operations including creation, scheduling, triggering, and dismissal. Integrates with Tauri scheduler for background execution.

### Comment 303
- **File:** `auto-sort-notes/src/renderer/features/alarms/storage/alarm-storage.ts`
- **Location:** Alarm storage module
- **Purpose:** Alarm Storage - Alarm Data Persistence
- **Related:** Comment 302 (alarm-service.ts), Comment 001 (database.ts)
- **Description:** This module handles SQLite operations for alarm data. Alarm data is stored in the 'alarms' table.

### Comment 304
- **File:** `auto-sort-notes/src/renderer/features/alarms/services/reminder-service.ts`
- **Location:** Reminder service module
- **Purpose:** Reminder Service - Reminder Operations
- **Related:** Comment 304 (ReminderEditor.tsx), Comment 305 (reminder-storage.ts), Comment 308 (useReminder.ts)
- **Description:** This service handles all business logic for reminder operations. Reminders can be attached to notes and calendar events, and trigger notifications.

### Comment 305
- **File:** `auto-sort-notes/src/renderer/features/alarms/storage/reminder-storage.ts`
- **Location:** Reminder storage module
- **Purpose:** Reminder Storage - Reminder Data Persistence
- **Related:** Comment 304 (reminder-service.ts), Comment 001 (database.ts), Comment 101 (calendar-storage.ts)
- **Description:** This module handles SQLite operations for reminder data. Reminder data is stored in the 'reminders' table (shared with calendar events).

### Comment 306
- **File:** `auto-sort-notes/src/renderer/features/alarms/hooks/useTimer.ts`
- **Location:** useTimer hook
- **Purpose:** useTimer Hook - React Hook for Timer Operations
- **Related:** Comment 300 (timer-service.ts)
- **Description:** This hook provides a React interface for timer operations. Wraps the timer service for component use.

### Comment 307
- **File:** `auto-sort-notes/src/renderer/features/alarms/hooks/useAlarm.ts`
- **Location:** useAlarm hook
- **Purpose:** useAlarm Hook - React Hook for Alarm Operations
- **Related:** Comment 302 (alarm-service.ts)
- **Description:** This hook provides a React interface for alarm operations. Wraps the alarm service for component use.

### Comment 308
- **File:** `auto-sort-notes/src/renderer/features/alarms/hooks/useReminder.ts`
- **Location:** useReminder hook
- **Purpose:** useReminder Hook - React Hook for Reminder Operations
- **Related:** Comment 304 (reminder-service.ts)
- **Description:** This hook provides a React interface for reminder operations. Wraps the reminder service for component use.

### Comment 309
- **File:** `auto-sort-notes/src/renderer/features/alarms/components/AlarmTimerTab.tsx`
- **Location:** AlarmTimerTab component
- **Purpose:** Alarm Timer Tab Component - Main Alarm/Timer Tab
- **Related:** Comment 309 (TimerDisplay.tsx), Comment 309 (TimerControls.tsx), Comment 309 (AlarmList.tsx), Comment 309 (ReminderList.tsx)
- **Description:** This component provides the main interface for the Alarm/Timer tab. Displays timer controls, alarm list, and reminder list in a unified interface.

### Comment 310
- **File:** `auto-sort-notes/src/renderer/features/alarms/components/TimerDisplay.tsx`
- **Location:** TimerDisplay component
- **Purpose:** Timer Display Component - Timer State Display
- **Related:** Comment 309 (AlarmTimerTab.tsx), Comment 306 (useTimer.ts)
- **Description:** This component displays the current timer state (time remaining or elapsed). Used in AlarmTimerTab to show active timer.

### Comment 311
- **File:** `auto-sort-notes/src/renderer/features/alarms/components/TimerControls.tsx`
- **Location:** TimerControls component
- **Purpose:** Timer Controls Component - Timer Control Buttons
- **Related:** Comment 309 (AlarmTimerTab.tsx), Comment 306 (useTimer.ts)
- **Description:** This component provides control buttons for the timer (start, pause, reset). Used in AlarmTimerTab to control timer operations.

### Comment 312
- **File:** `auto-sort-notes/src/renderer/features/alarms/components/AlarmList.tsx`
- **Location:** AlarmList component
- **Purpose:** Alarm List Component - List of Alarms
- **Related:** Comment 309 (AlarmTimerTab.tsx), Comment 307 (useAlarm.ts)
- **Description:** This component displays a list of scheduled alarms. Used in AlarmTimerTab to show all alarms.

### Comment 313
- **File:** `auto-sort-notes/src/renderer/features/alarms/components/ReminderList.tsx`
- **Location:** ReminderList component
- **Purpose:** Reminder List Component - List of Reminders
- **Related:** Comment 309 (AlarmTimerTab.tsx), Comment 308 (useReminder.ts)
- **Description:** This component displays a list of reminders. Used in AlarmTimerTab to show all reminders.

### Comment 314
- **File:** `auto-sort-notes/src/renderer/features/alarms/components/TimerList.tsx`
- **Location:** TimerList component
- **Purpose:** Timer List Component - List of Timers
- **Related:** Comment 309 (AlarmTimerTab.tsx)
- **Description:** This component displays a list of saved timers. Allows users to manage multiple timer presets.

### Comment 315
- **File:** `auto-sort-notes/src/renderer/features/alarms/components/AlarmNotification.tsx`
- **Location:** AlarmNotification component
- **Purpose:** Alarm Notification Component - Alarm Trigger Notification
- **Related:** Comment 302 (alarm-service.ts), Comment 303 (scheduler.rs)
- **Description:** This component displays a notification dialog when an alarm triggers. Shows alarm details and provides dismiss/snooze options.

### Comment 316
- **File:** `auto-sort-notes/src/renderer/features/alarms/types.ts`
- **Location:** Alarm/Timer types module
- **Purpose:** Alarm/Timer Types - TypeScript Type Definitions
- **Related:** Comment 300 (timer-service.ts), Comment 302 (alarm-service.ts), Comment 304 (reminder-service.ts)
- **Description:** This file defines TypeScript interfaces and types for alarm/timer feature. Includes Timer, Alarm, Reminder types.

### Comment 317
- **File:** `auto-sort-notes/src/renderer/features/alarms/index.ts`
- **Location:** Alarm/Timer feature exports
- **Purpose:** Alarm/Timer Feature Exports - Public API
- **Related:** All alarm/timer feature comments (300-316)
- **Description:** This file exports public API for alarm/timer feature.

---

## Metadata Feature Comments (400-415)

### Comment 400
- **File:** `auto-sort-notes/src/renderer/features/metadata/services/metadata-service.ts`
- **Location:** Metadata service module
- **Purpose:** Metadata Service - Centralized Metadata Management
- **Related:** Comment 400 (MetadataManager.tsx), Comment 401 (tag-service.ts), Comment 402 (project-service.ts), Comment 404 (metadata-storage.ts)
- **Description:** This service handles all business logic for metadata operations including tags, projects, and document numbers. Provides unified metadata management across all features.

### Comment 401
- **File:** `auto-sort-notes/src/renderer/features/metadata/services/tag-service.ts`
- **Location:** Tag service module
- **Purpose:** Tag Service - Tag Operations
- **Related:** Comment 400 (metadata-service.ts), Comment 404 (metadata-storage.ts)
- **Description:** This service handles all business logic for tag operations. Tags can be associated with notes, calendar events, todos, etc.

### Comment 402
- **File:** `auto-sort-notes/src/renderer/features/metadata/services/project-service.ts`
- **Location:** Project service module
- **Purpose:** Project Service - Project/Category Operations
- **Related:** Comment 400 (metadata-service.ts), Comment 404 (metadata-storage.ts)
- **Description:** This service handles all business logic for project/category operations. Projects can be associated with notes, calendar events, todos, etc.

### Comment 403
- **File:** `auto-sort-notes/src/renderer/features/metadata/services/metadata-search-service.ts`
- **Location:** Metadata search service module
- **Purpose:** Metadata Search Service - Unified Metadata Search
- **Related:** Comment 403 (MetadataSearch.tsx), Comment 404 (metadata-storage.ts)
- **Description:** This service provides unified search functionality across all metadata sources. Searches tags, projects, document numbers, dates, keywords across all features.

### Comment 404
- **File:** `auto-sort-notes/src/renderer/features/metadata/storage/metadata-storage.ts`
- **Location:** Metadata storage module
- **Purpose:** Metadata Storage - Metadata Data Persistence
- **Related:** Comment 400 (metadata-service.ts), Comment 401 (tag-service.ts), Comment 402 (project-service.ts), Comment 001 (database.ts)
- **Description:** This module handles SQLite operations for metadata. Stores tags, projects, and associations in 'tags', 'projects', 'note_tags', 'note_projects' tables.

### Comment 405
- **File:** `auto-sort-notes/src/renderer/features/metadata/components/TagEditor.tsx`
- **Location:** TagEditor component
- **Purpose:** Tag Editor Component - Create/Edit Tag Form
- **Related:** Comment 401 (tag-service.ts), Comment 409 (useTag.ts)
- **Description:** This component provides a form interface for creating and editing tags.

### Comment 406
- **File:** `auto-sort-notes/src/renderer/features/metadata/components/TagList.tsx`
- **Location:** TagList component
- **Purpose:** Tag List Component - List of Tags
- **Related:** Comment 401 (tag-service.ts), Comment 409 (useTag.ts)
- **Description:** This component displays a list of all tags with management options.

### Comment 407
- **File:** `auto-sort-notes/src/renderer/features/metadata/components/ProjectEditor.tsx`
- **Location:** ProjectEditor component
- **Purpose:** Project Editor Component - Create/Edit Project Form
- **Related:** Comment 402 (project-service.ts), Comment 410 (useProject.ts)
- **Description:** This component provides a form interface for creating and editing projects/categories.

### Comment 408
- **File:** `auto-sort-notes/src/renderer/features/metadata/components/ProjectList.tsx`
- **Location:** ProjectList component
- **Purpose:** Project List Component - List of Projects
- **Related:** Comment 402 (project-service.ts), Comment 410 (useProject.ts)
- **Description:** This component displays a list of all projects/categories with management options.

### Comment 409
- **File:** `auto-sort-notes/src/renderer/features/metadata/hooks/useTag.ts`
- **Location:** useTag hook
- **Purpose:** useTag Hook - React Hook for Tag Operations
- **Related:** Comment 401 (tag-service.ts)
- **Description:** This hook provides a React interface for tag operations. Wraps the tag service for component use.

### Comment 410
- **File:** `auto-sort-notes/src/renderer/features/metadata/hooks/useProject.ts`
- **Location:** useProject hook
- **Purpose:** useProject Hook - React Hook for Project Operations
- **Related:** Comment 402 (project-service.ts)
- **Description:** This hook provides a React interface for project operations. Wraps the project service for component use.

### Comment 411
- **File:** `auto-sort-notes/src/renderer/features/metadata/hooks/useMetadataSearch.ts`
- **Location:** useMetadataSearch hook
- **Purpose:** useMetadataSearch Hook - React Hook for Metadata Search
- **Related:** Comment 403 (metadata-search-service.ts)
- **Description:** This hook provides a React interface for metadata search operations. Wraps the metadata search service for component use.

### Comment 412
- **File:** `auto-sort-notes/src/renderer/features/metadata/components/MetadataPanel.tsx`
- **Location:** MetadataPanel component
- **Purpose:** Metadata Panel Component - Contextual Metadata UI
- **Related:** Comment 400 (metadata-service.ts), Comment 013 (NoteEditor.tsx)
- **Description:** This component provides a contextual metadata panel for editing metadata in context. Used in note editor, calendar event editor, etc. for quick metadata editing.

### Comment 413
- **File:** `auto-sort-notes/src/renderer/features/metadata/hooks/useMetadata.ts`
- **Location:** useMetadata hook
- **Purpose:** useMetadata Hook - React Hook for Metadata Operations
- **Related:** Comment 400 (metadata-service.ts)
- **Description:** This hook provides a React interface for metadata operations. Wraps the metadata service for component use.

### Comment 414
- **File:** `auto-sort-notes/src/renderer/features/metadata/types.ts`
- **Location:** Metadata types module
- **Purpose:** Metadata Types - TypeScript Type Definitions
- **Related:** Comment 400 (metadata-service.ts)
- **Description:** This file defines TypeScript interfaces and types for metadata feature. Includes Tag, Project, MetadataAssociation types.

### Comment 415
- **File:** `auto-sort-notes/src/renderer/features/metadata/index.ts`
- **Location:** Metadata feature exports
- **Purpose:** Metadata Feature Exports - Public API
- **Related:** All metadata feature comments (400-414)
- **Description:** This file exports public API for metadata feature.

---

## Branched Notes Feature Comments (500-506)

### Comment 500
- **File:** `auto-sort-notes/src/renderer/features/branches/services/branch-service.ts`
- **Location:** Branch service module
- **Purpose:** Branch Service - Branch Operations
- **Related:** Comment 500 (BranchCreator.tsx), Comment 501 (branch-storage.ts)
- **Description:** This service handles all business logic for branch operations including creation, navigation, and management. Branches allow creating independent versions from any point.

### Comment 501
- **File:** `auto-sort-notes/src/renderer/features/branches/storage/branch-storage.ts`
- **Location:** Branch storage module
- **Purpose:** Branch Storage - Branch Data Persistence
- **Related:** Comment 500 (branch-service.ts), Comment 001 (database.ts), Comment 002 (file-system.ts)
- **Description:** This module handles SQLite operations for branch metadata and file system operations for branch content. Uses delta compression and reference-based storage for efficiency.

### Comment 502
- **File:** `auto-sort-notes/src/renderer/features/branches/components/BranchTree.tsx`
- **Location:** BranchTree component
- **Purpose:** Branch Tree Component - Branch Tree Visualization
- **Related:** Comment 500 (branch-service.ts)
- **Description:** This component displays branches in a tree structure showing relationships.

### Comment 503
- **File:** `auto-sort-notes/src/renderer/features/branches/services/branch-merge-service.ts`
- **Location:** Branch merge service module
- **Purpose:** Branch Merge Service - Branch Merge Operations
- **Related:** Comment 503 (BranchMerge.tsx), Comment 501 (branch-storage.ts)
- **Description:** This service handles branch merging logic including conflict detection and resolution. Implements merge strategies (three-way merge, etc.).

### Comment 504
- **File:** `auto-sort-notes/src/renderer/features/branches/hooks/useBranch.ts`
- **Location:** useBranch hook
- **Purpose:** useBranch Hook - React Hook for Branch Operations
- **Related:** Comment 500 (branch-service.ts)
- **Description:** This hook provides a React interface for branch operations. Wraps the branch service for component use.

### Comment 505
- **File:** `auto-sort-notes/src/renderer/features/branches/types.ts`
- **Location:** Branch types module
- **Purpose:** Branch Types - TypeScript Type Definitions
- **Related:** Comment 500 (branch-service.ts)
- **Description:** This file defines TypeScript interfaces and types for branch feature.

### Comment 506
- **File:** `auto-sort-notes/src/renderer/features/branches/index.ts`
- **Location:** Branch feature exports
- **Purpose:** Branch Feature Exports - Public API
- **Related:** All branch feature comments (500-505)
- **Description:** This file exports public API for branch feature.

---

## Historical Timelines Feature Comments (600-608)

### Comment 600
- **File:** `auto-sort-notes/src/renderer/features/versions/services/version-service.ts`
- **Location:** Version service module
- **Purpose:** Version Service - Version History Operations
- **Related:** Comment 600 (VersionViewer.tsx), Comment 602 (version-storage.ts)
- **Description:** This service handles all business logic for version history operations. Manages non-destructive historical timelines with version snapshots and deltas.

### Comment 601
- **File:** `auto-sort-notes/src/renderer/features/versions/services/timeline-service.ts`
- **Location:** Timeline service module
- **Purpose:** Timeline Service - Timeline Visualization
- **Related:** Comment 601 (TimelineView.tsx), Comment 602 (version-storage.ts)
- **Description:** This service handles timeline visualization and navigation operations. Provides timeline data for timeline slider and view components.

### Comment 602
- **File:** `auto-sort-notes/src/renderer/features/versions/storage/version-storage.ts`
- **Location:** Version storage module
- **Purpose:** Version Storage - Version History Persistence
- **Related:** Comment 600 (version-service.ts), Comment 601 (timeline-service.ts), Comment 001 (database.ts), Comment 002 (file-system.ts)
- **Description:** This module handles SQLite operations for version metadata and file system operations for version content (snapshots and deltas).

### Comment 603
- **File:** `auto-sort-notes/src/renderer/features/versions/components/VersionRevertDialog.tsx`
- **Location:** VersionRevertDialog component
- **Purpose:** Version Revert Dialog Component - Revert Options
- **Related:** Comment 600 (version-service.ts), Comment 500 (branch-service.ts)
- **Description:** This component provides a dialog for reverting to a version with two options: Create Branch from this version (non-destructive) or Revert Entirely (overwrites current version).

### Comment 604
- **File:** `auto-sort-notes/src/renderer/features/versions/hooks/useVersion.ts`
- **Location:** useVersion hook
- **Purpose:** useVersion Hook - React Hook for Version Operations
- **Related:** Comment 600 (version-service.ts)
- **Description:** This hook provides a React interface for version operations. Wraps the version service for component use.

### Comment 605
- **File:** `auto-sort-notes/src/renderer/features/versions/hooks/useTimeline.ts`
- **Location:** useTimeline hook
- **Purpose:** useTimeline Hook - React Hook for Timeline Operations
- **Related:** Comment 601 (timeline-service.ts)
- **Description:** This hook provides a React interface for timeline operations. Wraps the timeline service for component use.

### Comment 606
- **File:** `auto-sort-notes/src/renderer/features/versions/types.ts`
- **Location:** Version types module
- **Purpose:** Version Types - TypeScript Type Definitions
- **Related:** Comment 600 (version-service.ts)
- **Description:** This file defines TypeScript interfaces and types for version feature.

### Comment 607
- **File:** `auto-sort-notes/src/renderer/features/versions/index.ts`
- **Location:** Version feature exports
- **Purpose:** Version Feature Exports - Public API
- **Related:** All version feature comments (600-606)
- **Description:** This file exports public API for version feature.

### Comment 608
- **File:** `auto-sort-notes/src/renderer/features/versions/components/VersionDiff.tsx`
- **Location:** VersionDiff component
- **Purpose:** Version Diff Component - Version Comparison
- **Related:** Comment 600 (version-service.ts)
- **Description:** This component displays differences between two versions. Shows added, removed, and modified content.

---

## Hierarchical Notes Feature Comments (700-709)

### Comment 700
- **File:** `auto-sort-notes/src/renderer/features/hierarchy/services/hierarchy-service.ts`
- **Location:** Hierarchy service module
- **Purpose:** Hierarchy Service - Hierarchical Note Operations
- **Related:** Comment 700 (NoteTree.tsx), Comment 701 (hierarchy-storage.ts), Comment 702 (hierarchy-query-service.ts)
- **Description:** This service handles all business logic for hierarchical note relationships. Uses adjacency list model with recursive queries for ancestors and descendants.

### Comment 701
- **File:** `auto-sort-notes/src/renderer/features/hierarchy/storage/hierarchy-storage.ts`
- **Location:** Hierarchy storage module
- **Purpose:** Hierarchy Storage - Hierarchy Data Persistence
- **Related:** Comment 700 (hierarchy-service.ts), Comment 012 (note-database-storage.ts), Comment 001 (database.ts)
- **Description:** This module handles hierarchy relationship storage. Uses note-database-storage.ts with additional hierarchy queries.

### Comment 702
- **File:** `auto-sort-notes/src/renderer/features/hierarchy/services/hierarchy-query-service.ts`
- **Location:** Hierarchy query service module
- **Purpose:** Hierarchy Query Service - Recursive Hierarchy Queries
- **Related:** Comment 700 (hierarchy-service.ts), Comment 001 (database.ts)
- **Description:** This service provides recursive queries for hierarchy operations. Uses recursive CTEs to query ancestors, descendants, and tree structures.

### Comment 703
- **File:** `auto-sort-notes/src/renderer/features/hierarchy/components/NoteTreeItem.tsx`
- **Location:** NoteTreeItem component
- **Purpose:** Note Tree Item Component - Tree Node Display
- **Related:** Comment 700 (NoteTree.tsx)
- **Description:** This component displays an individual tree node in the hierarchy. Used by NoteTree component for each node.

### Comment 704
- **File:** `auto-sort-notes/src/renderer/features/hierarchy/components/HierarchyNavigator.tsx`
- **Location:** HierarchyNavigator component
- **Purpose:** Hierarchy Navigator Component - Hierarchy Navigation
- **Related:** Comment 700 (hierarchy-service.ts)
- **Description:** This component provides navigation controls for hierarchical notes. Allows moving up/down the hierarchy, expanding/collapsing branches.

### Comment 705
- **File:** `auto-sort-notes/src/renderer/features/hierarchy/components/HierarchyBreadcrumbs.tsx`
- **Location:** HierarchyBreadcrumbs component
- **Purpose:** Hierarchy Breadcrumbs Component - Hierarchy Path Display
- **Related:** Comment 700 (hierarchy-service.ts)
- **Description:** This component displays breadcrumb navigation showing the current hierarchy path. Shows path from root to current note.

### Comment 706
- **File:** `auto-sort-notes/src/renderer/features/hierarchy/hooks/useHierarchy.ts`
- **Location:** useHierarchy hook
- **Purpose:** useHierarchy Hook - React Hook for Hierarchy Operations
- **Related:** Comment 700 (hierarchy-service.ts)
- **Description:** This hook provides a React interface for hierarchy operations. Wraps the hierarchy service for component use.

### Comment 707
- **File:** `auto-sort-notes/src/renderer/features/hierarchy/hooks/useNoteTree.ts`
- **Location:** useNoteTree hook
- **Purpose:** useNoteTree Hook - React Hook for Note Tree Operations
- **Related:** Comment 700 (hierarchy-service.ts)
- **Description:** This hook provides a React interface for note tree operations. Wraps the hierarchy service for tree-specific operations.

### Comment 708
- **File:** `auto-sort-notes/src/renderer/features/hierarchy/types.ts`
- **Location:** Hierarchy types module
- **Purpose:** Hierarchy Types - TypeScript Type Definitions
- **Related:** Comment 700 (hierarchy-service.ts)
- **Description:** This file defines TypeScript interfaces and types for hierarchy feature.

### Comment 709
- **File:** `auto-sort-notes/src/renderer/features/hierarchy/index.ts`
- **Location:** Hierarchy feature exports
- **Purpose:** Hierarchy Feature Exports - Public API
- **Related:** All hierarchy feature comments (700-708)
- **Description:** This file exports public API for hierarchy feature.

---

## File Import/Export Feature Comments (800-805)

### Comment 800
- **File:** `auto-sort-notes/src/renderer/features/file-import/services/file-import-service.ts`
- **Location:** File import service module
- **Purpose:** File Import Service - Import File Operations
- **Related:** Comment 800 (FileImportDialog.tsx), Comment 015 (file-import-service.ts in notes feature), Comment 800 (docx-parser.ts)
- **Description:** This service handles importing various file types and converting them to Tiptap JSON. Part of the "Save, Open, and Edit Popular File Types" feature.

### Comment 801
- **File:** `auto-sort-notes/src/renderer/features/file-import/services/file-export-service.ts`
- **Location:** File export service module
- **Purpose:** File Export Service - Export File Operations
- **Related:** Comment 801 (FileExportDialog.tsx)
- **Description:** This service handles exporting notes to various file types. Converts Tiptap JSON content to DOCX, PDF, Markdown, HTML formats.

### Comment 802
- **File:** `auto-sort-notes/src/renderer/features/file-import/hooks/useFileImport.ts`
- **Location:** useFileImport hook
- **Purpose:** useFileImport Hook - React Hook for File Import
- **Related:** Comment 800 (file-import-service.ts)
- **Description:** This hook provides a React interface for file import operations. Wraps the file import service for component use.

### Comment 803
- **File:** `auto-sort-notes/src/renderer/features/file-import/hooks/useFileExport.ts`
- **Location:** useFileExport hook
- **Purpose:** useFileExport Hook - React Hook for File Export
- **Related:** Comment 801 (file-export-service.ts)
- **Description:** This hook provides a React interface for file export operations. Wraps the file export service for component use.

### Comment 804
- **File:** `auto-sort-notes/src/renderer/features/file-import/types.ts`
- **Location:** File import types module
- **Purpose:** File Import Types - TypeScript Type Definitions
- **Related:** Comment 800 (file-import-service.ts)
- **Description:** This file defines TypeScript interfaces and types for file import/export feature.

### Comment 805
- **File:** `auto-sort-notes/src/renderer/features/file-import/index.ts`
- **Location:** File import feature exports
- **Purpose:** File Import Feature Exports - Public API
- **Related:** All file import feature comments (800-804)
- **Description:** This file exports public API for file import/export feature.

---

## Dashboard Feature Comments (900-908)

### Comment 900
- **File:** `auto-sort-notes/src/renderer/features/dashboard/services/dashboard-service.ts`
- **Location:** Dashboard service module
- **Purpose:** Dashboard Service - Dashboard Data Aggregation
- **Related:** Comment 900 (Dashboard.tsx), Comment 010 (note-service.ts)
- **Description:** This service aggregates data from all features for dashboard display. Provides recent notes, quick actions, search results, etc.

### Comment 901
- **File:** `auto-sort-notes/src/renderer/features/dashboard/components/DashboardLayout.tsx`
- **Location:** DashboardLayout component
- **Purpose:** Dashboard Layout Component - Dashboard Structure
- **Related:** Comment 900 (Dashboard.tsx)
- **Description:** This component provides the layout structure for the dashboard. Used by Dashboard component for layout organization.

### Comment 902
- **File:** `auto-sort-notes/src/renderer/features/dashboard/components/RecentNotes.tsx`
- **Location:** RecentNotes component
- **Purpose:** Recent Notes Component - Recent Notes Display
- **Related:** Comment 900 (Dashboard.tsx), Comment 010 (note-service.ts)
- **Description:** This component displays recent notes in the dashboard. Shows recently accessed or modified notes.

### Comment 903
- **File:** `auto-sort-notes/src/renderer/features/dashboard/hooks/useDashboard.ts`
- **Location:** useDashboard hook
- **Purpose:** useDashboard Hook - React Hook for Dashboard Operations
- **Related:** Comment 900 (dashboard-service.ts)
- **Description:** This hook provides a React interface for dashboard operations. Wraps the dashboard service for component use.

### Comment 904
- **File:** `auto-sort-notes/src/renderer/features/dashboard/types.ts`
- **Location:** Dashboard types module
- **Purpose:** Dashboard Types - TypeScript Type Definitions
- **Related:** Comment 900 (dashboard-service.ts)
- **Description:** This file defines TypeScript interfaces and types for dashboard feature.

### Comment 905
- **File:** `auto-sort-notes/src/renderer/features/dashboard/index.ts`
- **Location:** Dashboard feature exports
- **Purpose:** Dashboard Feature Exports - Public API
- **Related:** All dashboard feature comments (900-904)
- **Description:** This file exports public API for dashboard feature.

### Comment 906
- **File:** `auto-sort-notes/src/renderer/features/dashboard/components/QuickActions.tsx`
- **Location:** QuickActions component
- **Purpose:** Quick Actions Component - Quick Action Buttons
- **Related:** Comment 900 (Dashboard.tsx)
- **Description:** This component displays quick action buttons in the dashboard. Provides shortcuts to common operations (create note, etc.).

### Comment 907
- **File:** `auto-sort-notes/src/renderer/features/dashboard/components/DashboardSearch.tsx`
- **Location:** DashboardSearch component
- **Purpose:** Dashboard Search Component - Dashboard Search
- **Related:** Comment 900 (Dashboard.tsx), Comment 403 (metadata-search-service.ts)
- **Description:** This component provides search functionality in the dashboard. Can integrate with unified metadata search.

### Comment 908
- **File:** `auto-sort-notes/src/renderer/features/dashboard/components/NotePreview.tsx`
- **Location:** NotePreview component
- **Purpose:** Note Preview Component - Note Content Preview
- **Related:** Comment 902 (RecentNotes.tsx), Comment 907 (DashboardSearch.tsx)
- **Description:** This component displays a preview of note content in the dashboard. Used in RecentNotes and search results.

---

## Additional Comments

### Tauri Main Process Comments

#### Comment 001 (Tauri)
- **File:** `auto-sort-notes/src-tauri/src/commands.rs`
- **Location:** Tauri commands module
- **Purpose:** Tauri Commands - IPC Command Handlers
- **Related:** Comment 001 (database.rs), Comment 002 (storage.rs)
- **Description:** This module defines Tauri command handlers for IPC communication. Handles commands from the frontend (renderer) to the backend (main process).

#### Comment 001 (Tauri Database)
- **File:** `auto-sort-notes/src-tauri/src/database.rs`
- **Location:** Tauri database module
- **Purpose:** Tauri Database Module - SQLite Database Operations
- **Related:** Comment 001 (commands.rs), Comment 001 (database.ts)
- **Description:** This module handles SQLite database operations in the Tauri main process. Provides database connection and query execution for the backend.

#### Comment 002 (Tauri Storage)
- **File:** `auto-sort-notes/src-tauri/src/storage.rs`
- **Location:** Tauri storage module
- **Purpose:** Tauri Storage Module - File System Operations
- **Related:** Comment 001 (commands.rs), Comment 002 (file-system.ts)
- **Description:** This module handles file system operations in the Tauri main process. Provides file reading, writing, and management for the backend.

#### Comment 303 (Tauri Scheduler)
- **File:** `auto-sort-notes/src-tauri/src/scheduler.rs`
- **Location:** Tauri scheduler module
- **Purpose:** Tauri Scheduler - Background Task Execution
- **Related:** Comment 302 (alarm-service.ts), Comment 303 (alarm-storage.ts), Comment 007 (notification-service.ts)
- **Description:** This module handles background task execution for alarms and reminders. Runs in the Tauri main process to execute scheduled tasks even when app is in background.

---

## Comment Number Ranges Summary

- **001-011:** Infrastructure (database, file system, utilities, shared services)
- **010-023:** Notes Feature (core note operations, editor, auto-save, file import)
- **100-111:** Calendar Feature (events, views, recurrence)
- **200-210:** To-Do List Feature (todos, Do/Due dates, priorities)
- **300-317:** Alarm/Timer Feature (timers, alarms, reminders, notifications)
- **400-415:** Metadata Feature (tags, projects, unified search)
- **500-506:** Branched Notes Feature (branch creation, merge, tree)
- **600-608:** Historical Timelines Feature (versions, timeline, revert)
- **700-709:** Hierarchical Notes Feature (hierarchy, tree, navigation)
- **800-805:** File Import/Export Feature (import, export, parsers)
- **900-908:** Dashboard Feature (dashboard, recent notes, quick actions)

---

## Maintenance Notes

**When to Update:**
- When adding new numbered comments
- When changing comment relationships
- When removing comments
- When moving code between files
- When implementing features (update comments to reflect actual implementation)

**Update Process:**
1. Add entry when creating comment
2. Update relationships when linking comments
3. Remove entry when deleting code
4. Update location when moving code
5. Update description when implementing features

**Search Strategies:**
- Search by number: `Comment 001` to find all instances
- Search by keyword: `Comment *branch*` to find related comments
- Search by file: Search within specific file for its comments
- Search by relationship: Find all comments related to a specific comment

---

**Document Status:** Complete  
**Last Updated:** 2024  
**Maintained By:** Development Team

