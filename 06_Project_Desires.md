# Project Desires

This document outlines the desired features and goals for the note-taking application. Each checkbox item links to preliminary research findings on how similar features could hypothetically be implemented.

## Feature Checklist

- [ ] [Full-Featured Text Editor](#full-featured-text-editor)
- [ ] [Local File Saving](#local-file-saving)
- [ ] [Reminders Attached to Note Files](#reminders-attached-to-note-files)
- [ ] [Save, Open, and Edit Popular File Types](#save-open-and-edit-popular-file-types)
- [ ] [Custom Metadata Association](#custom-metadata-association)
- [ ] [To-Do Lists Within Notes](#to-do-lists-within-notes)
- [ ] [Branched Notes](#branched-notes)
- [ ] [Non-Destructive Historical Timelines](#non-destructive-historical-timelines)
- [ ] [Modern GUI and Features](#modern-gui-and-features)
- [ ] [Hierarchical Notes](#hierarchical-notes)
- [ ] [Timer](#timer)
- [ ] [Alarm](#alarm)

---

## Hypothetical Implementation Research Findings

> **Note:** This section contains general guidance for preliminary research only. It is NOT an implementation plan and should NOT be used as such. The information here serves as a starting point for understanding how similar features are typically implemented in existing applications.

### Full-Featured Text Editor

**Research Focus Areas:**
- Investigate Google Docs feature set and capabilities
- Research rich text editing libraries and frameworks (e.g., Quill, Draft.js, Slate, ProseMirror, TinyMCE)
- Study collaborative editing features and real-time synchronization patterns
- Explore formatting options: bold, italic, underline, strikethrough, headings, lists, links, images, tables
- Research advanced features: comments, suggestions, version history, spell check, grammar check
- Investigate text search and replace functionality
- Study undo/redo implementation patterns
- Research copy/paste handling with formatting preservation
- Explore export options (PDF, DOCX, HTML, etc.)

**Key Considerations:**
- Browser-based vs. native application approach
- Performance implications of rich text editing
- Accessibility requirements for text editors
- Mobile responsiveness and touch interactions

---

### Local File Saving

**Research Focus Areas:**
- Investigate file system APIs available for desktop applications (Electron, Tauri, native frameworks)
- Research file persistence patterns and storage strategies
- Study auto-save mechanisms and recovery systems
- Explore file format options (plain text, markdown, JSON, binary formats)
- Research file organization and folder structure patterns
- Investigate file locking mechanisms to prevent data loss
- Study backup and versioning strategies
- Explore file encryption options for sensitive notes

**Key Considerations:**
- Cross-platform file system compatibility
- File size limitations and performance
- Data integrity and corruption prevention
- User privacy and data security

---

### Reminders Attached to Note Files

**Research Focus Areas:**
- Investigate notification systems for desktop applications
- Research scheduling and reminder libraries
- Study calendar integration patterns
- Explore reminder persistence and storage
- Research notification delivery mechanisms (system notifications, in-app alerts)
- Investigate recurring reminder patterns
- Study reminder management interfaces (list views, calendar views)
- Explore reminder synchronization across devices (if applicable)
- Research calendar GUI components and libraries
- Study modular calendar component architecture
- Investigate date-related entry display and organization
- Research calendar view implementations (month, week, day views)
- Explore date filtering and querying mechanisms

**Key Considerations:**
- System-level notification permissions
- Background task execution
- Timezone handling
- Reminder reliability and delivery
- Calendar GUI as separate view in application
- Modular calendar component design (reusable in other projects)
- Efficient access and display of date-related information
- Support for multiple date types:
  - Direct calendar entries (notes, journal entries, call notes, bill tracking, events)
  - Notes by creation date
  - Notes by modified date
  - Notes by associated goal dates (Due date-time and Do date-time)
- Performance with large numbers of date entries
- Date-time precision and timezone handling

---

### Save, Open, and Edit Popular File Types

**Research Focus Areas:**
- Investigate file format libraries and parsers (DOCX, PDF, ODT, RTF, HTML, Markdown)
- Research file conversion and import/export capabilities
- Study file type detection and validation
- Explore editing capabilities for different file formats
- Research format preservation during editing
- Investigate file format limitations and compatibility
- Study file preview and rendering options
- Explore batch file processing capabilities

**Key Considerations:**
- File format complexity and parsing requirements
- Loss of formatting during conversion
- Performance with large files
- Licensing requirements for file format libraries

---

### Custom Metadata Association

**Research Focus Areas:**
- Investigate metadata storage strategies (embedded vs. separate database)
- Research document numbering systems and version tracking
- Study tag management systems and autocomplete implementations
- Explore project organization and categorization patterns
- Investigate metadata search and filtering capabilities
- Research persistent tag storage and retrieval
- Study metadata UI patterns (tag clouds, project trees, filters)
- Explore metadata export and import functionality

**Key Considerations:**
- Document number format: `{app_version}_{creation_timestamp}`
- Tag persistence file structure and management
- Metadata query performance
- Data migration and backward compatibility

---

### To-Do Lists Within Notes

**Research Focus Areas:**
- Investigate inline widget and component patterns
- Research task management UI components
- Study checkbox and list formatting in rich text editors
- Explore task completion tracking and persistence
- Investigate task prioritization and sorting
- Research task due dates and reminders integration
- Study nested task/subtask patterns
- Explore task filtering and search within notes

**Key Considerations:**
- Integration with rich text editor
- Task state persistence
- User experience for creating and managing tasks
- Visual distinction between tasks and regular text

---

### Branched Notes

**Research Focus Areas:**
- Investigate AI chatbot conversation branching patterns (ChatGPT, Claude) and how they enable divergent exploration while preserving original context
- Research tree/graph data structures for managing note branches and parent-child relationships
- Study branch creation workflows: user triggers, branch points, context inheritance
- Explore branch navigation interfaces: switching between branches, viewing branch relationships, branch indicators
- Investigate branch metadata: branch names, descriptions, purposes, creation context, timestamps
- Research storage patterns for branches: efficient storage of shared content, delta compression, reference-based storage
- Study merge strategies: combining branches, conflict resolution, selective integration
- Explore visual representation of branch relationships: tree views, graph visualizations, branch indicators in UI
- Investigate branch search and filtering: finding branches by name, date, or content
- Research branch comparison: viewing differences between branches, side-by-side comparison
- Study branch lifecycle: creating, renaming, deleting branches, branch organization

**Key Considerations:**
- Branch independence: each branch maintains full editing capability without affecting parent or sibling branches
- Context preservation: branches should inherit and display parent context up to the branch point, allowing users to understand the origin
- Multiple branches: support creating multiple branches from the same point for exploring different approaches or alternative solutions
- Navigation: intuitive interface for switching between branches and understanding relationships between branches
- Visual clarity: clear indicators showing which branch is active, branch relationships, and branch hierarchy
- Storage efficiency: implement efficient storage strategies to handle potentially large numbers of branches without excessive duplication
- Branch creation triggers: allow branching at any point in a note's content or from any point in historical timeline

---

### Non-Destructive Historical Timelines

**Research Focus Areas:**
- Research version control systems (Git) and immutable data structures for preserving complete edit history
- Study non-destructive editing paradigms in design software (Fusion360 timeline, Adobe History panel, Blender undo system)
- Investigate event sourcing patterns for maintaining complete audit trails of all changes
- Explore timeline visualization techniques and UI patterns for displaying document evolution chronologically
- Research storage strategies: efficient storage of versions, delta compression, snapshot strategies, incremental saves
- Study navigation patterns: jumping to historical versions, comparing versions, viewing diffs, timeline scrubbing
- Investigate branching from history: creating new branches from any historical point, not just current state
- Explore user decision mechanisms: when reverting to a historical point, provide popup prompt with choice between "Create New Branch" (preserves all history) or "Revert Entirely" (destructive, with clear explanation of consequences and confirmation)
- Research performance implications: handling large histories, efficient rendering, lazy loading of historical versions
- Study search and filtering: finding specific changes, filtering by date/author/change type, searching within historical versions
- Investigate change tracking: what changed, when it changed, who changed it (if applicable), change descriptions
- Explore timeline interactions: clicking on timeline points, previewing versions, restoring from history
- Research undo/redo integration: how timeline system integrates with standard undo/redo functionality

**Key Considerations:**
- Non-destructive by default: all edits preserved, no automatic deletion of history (unlike Fusion360's destructive model where reverting to a past point and making new changes destroys all intermediate history)
- User choice mechanism: when reverting to a historical point, provide popup prompt with two clear options:
  - "Create New Branch" - preserves all existing history, creates new branch from selected point (recommended default)
  - "Revert Entirely" - destructive operation that discards all changes after selected point (requires explicit confirmation with clear warning)
- Complete preservation: maintain full history even after reverts, unless user explicitly chooses destructive revert option
- Timeline visualization: provide clear visual representation of note evolution with ability to navigate to any point, showing major milestones and change points
- Branching from history: enable creating new branches from any historical version, not just current state, allowing exploration of "what if" scenarios
- Performance: efficient storage and retrieval of historical versions, especially for notes with extensive edit history
- Change granularity: determine appropriate level of change tracking (character-level, word-level, paragraph-level, or operation-level)

---

### Modern GUI and Features

**Research Focus Areas:**
- Investigate modern UI/UX design patterns and trends
- Research desktop application frameworks (Electron, Tauri, Flutter Desktop, native)
- Study responsive design for desktop applications
- Explore dark mode and theme customization
- Investigate animation and transition libraries
- Research accessibility frameworks and WCAG compliance
- Study modern navigation patterns (sidebar, tabs, breadcrumbs)
- Explore keyboard shortcuts and power user features
- Investigate drag-and-drop functionality
- Research search and filter interfaces

**Key Considerations:**
- Performance and resource usage
- Cross-platform consistency
- User customization options
- Accessibility standards compliance

---

### Hierarchical Notes

**Research Focus Areas:**
- Investigate tree-based note organization patterns (folders, nested notes, outline structure)
- Research parent-child note relationships and navigation patterns
- Study note hierarchy visualization (tree views, indented lists, breadcrumbs)
- Explore note organization strategies (folders, tags, projects, hierarchies)
- Investigate drag-and-drop for reorganizing note hierarchies
- Research note hierarchy storage and retrieval patterns
- Study note hierarchy search and filtering (search within folder, recursive search)
- Explore note hierarchy operations (move, copy, delete with children)
- Investigate note hierarchy metadata (depth, path, parent/child counts)
- Research note hierarchy UI patterns (collapsible trees, expand/collapse all, keyboard navigation)
- Study note hierarchy performance with large numbers of nested notes
- Explore note hierarchy export/import functionality

**Key Considerations:**
- Flexible hierarchy depth (unlimited nesting or reasonable limits)
- Visual clarity of hierarchy relationships
- Efficient navigation between parent and child notes
- Performance with deeply nested structures
- Hierarchy operations (move, copy, delete) and their effects on children
- Search and filtering within hierarchy contexts
- Integration with other features (branches, metadata, tags, projects)
- User experience for creating and managing hierarchies

---

### Timer

**Research Focus Areas:**
- Investigate timer functionality patterns (countdown, count-up, interval timers)
- Research timer UI components and visualization (circular progress, linear progress, digital display)
- Study timer persistence and state management (save timer state, resume paused timers)
- Explore timer notifications and alerts (completion sounds, system notifications)
- Investigate timer features (multiple timers, timer presets, timer history)
- Research timer integration with notes (attach timer to note, timer notes, time tracking)
- Study timer accuracy and performance (background execution, system sleep handling)
- Explore timer customization (sounds, visual themes, display formats)
- Investigate timer statistics and tracking (total time, session history, productivity metrics)
- Research timer accessibility (keyboard shortcuts, screen reader support, visual indicators)

**Key Considerations:**
- Timer accuracy and reliability
- Background execution when app is minimized
- System sleep/wake handling
- Multiple concurrent timers
- Timer persistence across app restarts
- Integration with note-taking workflow
- User experience for starting, pausing, and stopping timers
- Notification and alert mechanisms
- Timer customization options

---

### Alarm

**Research Focus Areas:**
- Investigate alarm functionality patterns (one-time alarms, recurring alarms, snooze)
- Research system-level alarm APIs (desktop notifications, system alarms, background execution)
- Study alarm scheduling and persistence (save alarms, alarm database, alarm management)
- Explore alarm features (multiple alarms, alarm presets, alarm categories)
- Investigate alarm integration with notes (attach alarm to note, alarm notes, reminder notes)
- Research alarm notifications and alerts (sounds, visual alerts, system notifications)
- Study alarm reliability and delivery (background execution, system sleep handling, timezone handling)
- Explore alarm customization (sounds, visual themes, snooze intervals, repeat patterns)
- Investigate alarm management UI (alarm list, alarm editor, alarm status)
- Research alarm accessibility (keyboard shortcuts, screen reader support, visual indicators)

**Key Considerations:**
- Alarm reliability and delivery (must work even when app is closed)
- System-level integration for background execution
- Timezone handling and daylight saving time
- Multiple concurrent alarms
- Alarm persistence across app restarts and system reboots
- Integration with note-taking workflow and reminders
- User experience for creating, editing, and managing alarms
- Notification and alert mechanisms
- Alarm customization options (sounds, snooze, repeat)
- System permissions and requirements

