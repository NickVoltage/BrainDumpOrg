-- ============================================================================
-- Database Schema for Auto-Sort Notes Application
-- ============================================================================
-- This schema defines all SQLite tables for the application's metadata storage.
-- Note: Content (Tiptap JSON) is stored in the file system, not in the database.
-- This follows the "Hybrid Storage" pattern: File System for content, SQLite for metadata.
--
-- Related Comments:
-- - Comment 001 (database.ts - database connection and initialization)
-- - Comment 012 (note-database-storage.ts - note metadata storage)
-- - Comment 101 (calendar-storage.ts - calendar data persistence)
-- - Comment 201 (todo-storage.ts - todo data persistence)
-- - Comment 301 (timer-storage.ts - timer data persistence)
-- - Comment 303 (alarm-storage.ts - alarm data persistence)
-- - Comment 305 (reminder-storage.ts - reminder data persistence)
-- - Comment 404 (metadata-storage.ts - metadata persistence)
-- - Comment 501 (branch-storage.ts - branch data persistence)
-- - Comment 602 (version-storage.ts - version history persistence)
-- ============================================================================

-- ============================================================================
-- NOTES TABLE
-- ============================================================================
-- Stores note metadata. Note content (Tiptap JSON) is stored in the file system.
-- Uses adjacency list model for hierarchical relationships (parent_id).
CREATE TABLE notes (
    document_id TEXT PRIMARY KEY,              -- Format: {app_version}_{timestamp}
    parent_id TEXT,                            -- NULL for root notes, references notes(document_id) for hierarchy
    title TEXT NOT NULL,                       -- Note title
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    file_path TEXT NOT NULL,                   -- Path to Tiptap JSON file in file system
    FOREIGN KEY (parent_id) REFERENCES notes(document_id) ON DELETE CASCADE
);

-- ============================================================================
-- TAGS TABLE
-- ============================================================================
-- Stores tag definitions. Tags can be associated with notes, calendar events, todos, etc.
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,                 -- Tag name (case-insensitive uniqueness enforced in application)
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- NOTE-TAG RELATIONSHIP TABLE
-- ============================================================================
-- Many-to-many relationship between notes and tags.
CREATE TABLE note_tags (
    note_id TEXT NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(document_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================
-- Stores project/category definitions. Projects can be associated with notes, calendar events, todos, etc.
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,                  -- Project name (case-insensitive uniqueness enforced in application)
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- NOTE-PROJECT RELATIONSHIP TABLE
-- ============================================================================
-- Many-to-many relationship between notes and projects.
CREATE TABLE note_projects (
    note_id TEXT NOT NULL,
    project_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, project_id),
    FOREIGN KEY (note_id) REFERENCES notes(document_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ============================================================================
-- REMINDERS TABLE
-- ============================================================================
-- Stores reminders attached to notes. Reminders can have Do dates and Due dates.
-- Note: This table is shared with calendar events (calendar events can also be reminders).
CREATE TABLE reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id TEXT,                               -- NULL if reminder is standalone (calendar event)
    title TEXT,                                 -- Reminder title
    description TEXT,                          -- Reminder description
    due_date DATETIME,                         -- Due date/time
    do_date DATETIME,                          -- Do date/time (when to start working on it)
    completed BOOLEAN NOT NULL DEFAULT 0,       -- Completion status
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(document_id) ON DELETE CASCADE
);

-- ============================================================================
-- TIMERS TABLE
-- ============================================================================
-- Stores timer state. Timers can be countdown or count-up timers.
CREATE TABLE timers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id TEXT,                               -- NULL if timer is standalone
    name TEXT,                                  -- Timer name/description
    duration INTEGER,                           -- Timer duration in seconds (for countdown)
    started_at DATETIME,                        -- When timer was started
    paused_at DATETIME,                         -- When timer was paused (NULL if running)
    elapsed_seconds INTEGER NOT NULL DEFAULT 0,  -- Elapsed time in seconds
    timer_type TEXT NOT NULL DEFAULT 'countdown', -- 'countdown' or 'countup'
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(document_id) ON DELETE CASCADE
);

-- ============================================================================
-- ALARMS TABLE
-- ============================================================================
-- Stores alarm definitions. Alarms can be one-time or recurring.
CREATE TABLE alarms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id TEXT,                               -- NULL if alarm is standalone
    title TEXT NOT NULL,                        -- Alarm title
    alarm_time DATETIME NOT NULL,               -- When alarm should trigger
    recurring TEXT,                            -- Recurrence pattern (JSON string, NULL for one-time)
    enabled BOOLEAN NOT NULL DEFAULT 1,         -- Whether alarm is active
    snooze_count INTEGER NOT NULL DEFAULT 0,   -- Number of times snoozed
    last_triggered DATETIME,                    -- Last time alarm was triggered
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(document_id) ON DELETE CASCADE
);

-- ============================================================================
-- CALENDAR EVENTS TABLE
-- ============================================================================
-- Stores calendar events. Calendar events can be one-time, recurring, or all-day.
-- Note: This table shares the reminders table structure for events that are also reminders.
-- For standalone calendar events, use this table. For reminders attached to notes, use reminders table.
CREATE TABLE calendar_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,                        -- Event title
    description TEXT,                          -- Event description
    event_date DATETIME NOT NULL,               -- Event date/time
    end_date DATETIME,                         -- Event end date/time (NULL for all-day or single-time events)
    event_type TEXT NOT NULL DEFAULT 'one-time', -- 'one-time', 'recurring', 'all-day'
    recurrence_pattern TEXT,                    -- Recurrence pattern (JSON string, NULL for one-time)
    location TEXT,                              -- Event location
    reminder_id INTEGER,                        -- Associated reminder ID (if event is also a reminder)
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reminder_id) REFERENCES reminders(id) ON DELETE SET NULL
);

-- ============================================================================
-- TODO ITEMS TABLE
-- ============================================================================
-- Stores to-do list items. Todos can have Do dates and Due dates, priorities, and completion status.
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,                        -- Todo title
    description TEXT,                          -- Todo description
    due_date DATETIME,                         -- Due date/time
    do_date DATETIME,                          -- Do date/time (when to start working on it)
    completed BOOLEAN NOT NULL DEFAULT 0,       -- Completion status
    priority TEXT NOT NULL DEFAULT 'normal',    -- Priority: 'low', 'normal', 'high', 'urgent'
    note_id TEXT,                               -- Associated note ID (if todo is embedded in a note)
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,                     -- When todo was completed (NULL if not completed)
    FOREIGN KEY (note_id) REFERENCES notes(document_id) ON DELETE SET NULL
);

-- ============================================================================
-- BRANCHES TABLE
-- ============================================================================
-- Stores branch information for branched notes feature.
-- Branches allow creating independent versions from any point in a note's history.
CREATE TABLE branches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id TEXT NOT NULL,                      -- Original note ID
    parent_branch_id INTEGER,                   -- Parent branch ID (for branch hierarchy)
    branch_point TEXT,                          -- Position in document where branch was created
    branch_name TEXT NOT NULL,                   -- Branch name
    description TEXT,                           -- Branch description
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(document_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- ============================================================================
-- VERSIONS TABLE
-- ============================================================================
-- Stores version history for non-destructive historical timelines.
-- Each version is a snapshot of note content at a specific point in time.
CREATE TABLE versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id TEXT NOT NULL,                      -- Note ID
    version_number INTEGER NOT NULL,            -- Sequential version number
    content_snapshot TEXT NOT NULL,               -- File path to version snapshot (Tiptap JSON) or delta reference
    snapshot_type TEXT NOT NULL DEFAULT 'full',  -- 'full' (complete snapshot) or 'delta' (incremental change)
    parent_version_id INTEGER,                   -- Parent version ID (for delta snapshots)
    description TEXT,                           -- Version description/comment
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(document_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_version_id) REFERENCES versions(id) ON DELETE SET NULL,
    UNIQUE(note_id, version_number)             -- Ensure unique version numbers per note
);

-- ============================================================================
-- INDEXES
-- ============================================================================
-- Performance indexes for common query patterns.

-- Notes indexes
CREATE INDEX idx_notes_parent_id ON notes(parent_id);              -- Hierarchical queries
CREATE INDEX idx_notes_created_at ON notes(created_at);             -- Sort by creation date
CREATE INDEX idx_notes_modified_at ON notes(modified_at);           -- Sort by modification date
CREATE INDEX idx_notes_title ON notes(title);                       -- Search by title

-- Reminders indexes
CREATE INDEX idx_reminders_due_date ON reminders(due_date);        -- Query by due date
CREATE INDEX idx_reminders_do_date ON reminders(do_date);           -- Query by do date
CREATE INDEX idx_reminders_note_id ON reminders(note_id);           -- Query reminders for a note
CREATE INDEX idx_reminders_completed ON reminders(completed);      -- Filter by completion status

-- Timers indexes
CREATE INDEX idx_timers_note_id ON timers(note_id);                -- Query timers for a note
CREATE INDEX idx_timers_started_at ON timers(started_at);         -- Query active timers

-- Alarms indexes
CREATE INDEX idx_alarms_alarm_time ON alarms(alarm_time);         -- Query by alarm time
CREATE INDEX idx_alarms_enabled ON alarms(enabled);               -- Query active alarms
CREATE INDEX idx_alarms_note_id ON alarms(note_id);               -- Query alarms for a note

-- Calendar events indexes
CREATE INDEX idx_calendar_events_date ON calendar_events(event_date); -- Query by event date
CREATE INDEX idx_calendar_events_type ON calendar_events(event_type); -- Filter by event type
CREATE INDEX idx_calendar_events_reminder_id ON calendar_events(reminder_id); -- Query by reminder

-- Todos indexes
CREATE INDEX idx_todos_due_date ON todos(due_date);                -- Query by due date
CREATE INDEX idx_todos_do_date ON todos(do_date);                 -- Query by do date
CREATE INDEX idx_todos_completed ON todos(completed);              -- Filter by completion status
CREATE INDEX idx_todos_priority ON todos(priority);                -- Sort by priority
CREATE INDEX idx_todos_note_id ON todos(note_id);                  -- Query todos for a note

-- Branches indexes
CREATE INDEX idx_branches_note_id ON branches(note_id);            -- Query branches for a note
CREATE INDEX idx_branches_parent_branch_id ON branches(parent_branch_id); -- Branch hierarchy queries

-- Versions indexes
CREATE INDEX idx_versions_note_id ON versions(note_id);            -- Query versions for a note
CREATE INDEX idx_versions_version_number ON versions(note_id, version_number); -- Sort by version number
CREATE INDEX idx_versions_created_at ON versions(created_at);     -- Sort by creation date

-- Metadata relationship indexes
CREATE INDEX idx_note_tags_note_id ON note_tags(note_id);         -- Query tags for a note
CREATE INDEX idx_note_tags_tag_id ON note_tags(tag_id);           -- Query notes for a tag
CREATE INDEX idx_note_projects_note_id ON note_projects(note_id); -- Query projects for a note
CREATE INDEX idx_note_projects_project_id ON note_projects(project_id); -- Query notes for a project

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

