# Projected Issues and Research

> **Note:** This document tracks identified challenges, projected issues, and research findings for potential solutions. Update this document as solutions are found and evaluated.

**Document Purpose:** Central location for documenting technical challenges and their solutions.

**Related Documents:**
- `04_Proposed_Selections_From_Project_Planning.md` - Source of identified challenges
- `03_Project_Planning.md` - Project planning context
- `00_Project_Desires.md` - Project requirements

**Last Updated:** 2024  
**Status:** Active Research

---

## Issue Priority Levels

- **🔴 Critical:** Blocks feature implementation or significantly impacts functionality
- **🟡 Moderate:** Requires careful design but has workable solutions
- **🟢 Minor:** Architectural consideration, not a blocker

---

## 1. Critical Challenges (🔴)

### 1.1 Electron + Alarm Background Execution

**Status:** ✅ **RESEARCHED - SOLUTIONS IDENTIFIED**

**Issue Description:**
- Electron framework has more complex background execution requirements for alarms
- Alarms need to fire reliably even when application is closed or minimized
- System-level integration needed for background task execution

**Impact:**
- **Feature:** Alarm
- **Severity:** Critical - Alarms must work reliably regardless of app state
- **User Experience:** Alarms failing to fire would be a critical bug

**Location in Planning Doc:**
- Section 1.1 Primary Framework → Electron option

**Research Areas:**
- [x] Electron background process patterns
- [x] System notification APIs for desktop applications
- [x] Background task scheduling in Electron
- [x] System tray integration for background execution
- [x] Native module integration for system-level alarms
- [x] Cross-platform alarm reliability (Windows, macOS, Linux)
- [x] Power management and sleep/wake handling
- [x] Alternative approaches (separate background service, system cron jobs)

**Potential Solutions:**

**Solution 1: Electron Main Process + node-schedule + System Notifications - RECOMMENDED FOR ELECTRON**
- Description: Use Electron's main process (Node.js) to run a background scheduler using `node-schedule` library. Store alarms in SQLite, check periodically, and trigger system notifications via Electron's `Notification` API. Keep app running in system tray when minimized.
- Pros:
  - Reliable - main process runs independently of renderer
  - Uses native system notifications (cross-platform)
  - Can persist alarms across app restarts
  - System tray keeps app alive without visible window
- Cons:
  - App must remain running (can't fully close)
  - System tray required for background operation
  - Need to handle app wake from sleep
  - More complex than simple in-app timers
- Implementation Complexity: Moderate to High
- Cross-Platform Support: Full (Windows, macOS, Linux)
- Libraries: `node-schedule`, `electron-store` (for persistence)
- Recommendation: **Recommended for Electron** - Standard pattern for desktop alarm apps

**Solution 2: Tauri Background Tasks (If Using Tauri Instead) - RECOMMENDED FOR TAURI**
- Description: Tauri has better native integration. Use Rust backend with system notification APIs. Can use system schedulers (cron on Linux/macOS, Task Scheduler on Windows) or native Rust libraries for background execution.
- Pros:
  - Better native integration than Electron
  - Can use system-level schedulers
  - More reliable background execution
  - Lower resource usage
- Cons:
  - Requires Rust knowledge
  - Different implementation if switching from Electron
  - Platform-specific code needed
- Implementation Complexity: High (if switching frameworks)
- Cross-Platform Support: Full
- Libraries: Tauri plugins, system notification APIs
- Recommendation: **Consider if choosing Tauri** - Better long-term solution

**Solution 3: Hybrid: System Tray + Background Service**
- Description: Keep Electron app in system tray. Use main process to run background service that monitors alarms. Implement wake-from-sleep handling. Use native notifications.
- Pros:
  - User can minimize to tray
  - Background service independent of UI
  - Can implement auto-start on boot
- Cons:
  - Still requires app to be running
  - More complex setup
  - User education needed (minimize vs. close)
- Implementation Complexity: High
- Cross-Platform Support: Full
- Recommendation: Good for production apps

**Solution 4: Native System Integration (Advanced)**
- Description: Use native modules (node-gyp) or system schedulers (cron, Task Scheduler) to create truly background alarms that work even when app is closed. Requires platform-specific implementation.
- Pros:
  - Works even when app is completely closed
  - Most reliable solution
  - Uses OS-native scheduling
- Cons:
  - Very complex implementation
  - Platform-specific code required
  - Harder to maintain
  - May require separate background process
- Implementation Complexity: Very High
- Cross-Platform Support: Requires platform-specific code
- Recommendation: Only if alarms must work when app is closed

**Selected Solution:** 
- **Electron:** Solution 1 - Main Process + node-schedule + System Notifications
- **Tauri:** Solution 2 - Native Rust backend with system APIs

**Rationale:** Standard patterns for desktop alarm apps. Electron requires app running (system tray), Tauri has better native integration.

**Implementation Notes:**
- Store alarms in SQLite database
- Use main process for scheduling (Electron) or Rust backend (Tauri)
- Implement system tray integration for Electron
- Handle sleep/wake events
- Use native system notifications

---

### 1.2 React Context + Complex State Management

**Status:** ✅ **RESEARCHED - SOLUTIONS IDENTIFIED**

**Issue Description:**
- React Context API insufficient for managing complex state in Branched Notes and Non-Destructive Historical Timelines
- Context API can cause performance issues with frequent updates
- Complex state relationships (branch trees, version history) need sophisticated state management

**Impact:**
- **Features:** Branched Notes, Non-Destructive Historical Timelines
- **Severity:** Critical - These features require complex state management
- **User Experience:** Poor state management would lead to bugs, performance issues, and data loss

**Location in Planning Doc:**
- Section 1.6 State Management → React Context option

**Research Areas:**
- [x] State management patterns for tree/graph data structures
- [x] State management for version control systems
- [x] Performance optimization for complex state updates
- [x] State normalization patterns for hierarchical data
- [x] Immutable state management approaches
- [x] State persistence and synchronization
- [x] Undo/redo state management patterns
- [x] Branch/merge state management patterns

**Potential Solutions:**

**Solution 1: Zustand with Immer**
- Description: Use Zustand (lightweight) with Immer for immutable updates and complex state
- Pros: 
  - Lightweight and simple API
  - Good performance
  - Immer handles immutability automatically
  - Easy to use with TypeScript
- Cons:
  - May need additional patterns for complex relationships
  - Learning curve for Immer
- Implementation Complexity: Moderate
- Cross-Platform Support: Full (JavaScript library)
- Recommendation: Strong candidate for MVP

**Solution 2: Jotai (Atomic State)**
- Description: Atomic state management, good for complex relationships
- Pros:
  - Excellent for complex state relationships
  - Atomic updates prevent unnecessary re-renders
  - Good TypeScript support
  - Lightweight
- Cons:
  - Different mental model (atomic state)
  - May be overkill for simpler features
- Implementation Complexity: Moderate to High
- Cross-Platform Support: Full (JavaScript library)
- Recommendation: Good for complex features like branches

**Solution 3: Redux Toolkit**
- Description: Full-featured state management with Redux Toolkit
- Pros:
  - Mature ecosystem
  - Excellent DevTools
  - Strong patterns for complex state
  - Good TypeScript support
- Cons:
  - More boilerplate
  - Heavier than lightweight solutions
  - May be overkill for prototype approach
- Implementation Complexity: High
- Cross-Platform Support: Full (JavaScript library)
- Recommendation: Consider if lightweight solutions prove insufficient

**Solution 4: Hybrid Approach - RECOMMENDED**
- Description: Use React Context for simple state, Zustand/Jotai for complex features
- Pros:
  - Right tool for each job
  - Keeps simple features simple
  - Allows complex features to have proper state management
- Cons:
  - Multiple state management systems to learn
  - Potential confusion about which to use when
- Implementation Complexity: Moderate
- Cross-Platform Support: Full
- Recommendation: **Recommended** - Good pragmatic approach

**Selected Solution:** Solution 4 - Hybrid Approach (Context for UI, Zustand for data)

**Rationale:** Aligns with functional prototype approach. Use right tool for each job. Context for simple UI state, Zustand for complex business logic and data.

**Implementation Notes:**
- Use Context for UI state (theme, current view, etc.)
- Use Zustand for file operations, hierarchical data, and complex features
- Migrate Context to Zustand if performance issues arise

---

## 2. Integration Challenges (🟡)

### 2.1 Tiptap Integration Requirements

**Status:** ✅ **RESEARCHED - SOLUTIONS IDENTIFIED**

**Issue Description:**
- Tiptap (rich text editor) needs integration with:
  - Local File Saving (persisting editor content)
  - Reminders Attached to Note Files (associating reminders with editor content)
  - Timer (integrating timer functionality with notes)
  - Alarm (integrating alarm functionality with notes)

**Impact:**
- **Features:** Local File Saving, Reminders, Timer, Alarm
- **Severity:** Moderate - Integration is required but solutions exist
- **User Experience:** Seamless integration expected

**Location in Planning Doc:**
- Section 1.4 Rich Text Editor → Tiptap selection

**Research Areas:**
- [x] Tiptap content serialization (JSON, HTML, Markdown)
- [x] Tiptap file persistence patterns
- [x] Tiptap extension development for custom features
- [x] Integrating external data (reminders, timers) with editor content
- [x] Tiptap metadata storage patterns
- [x] Editor state synchronization with external systems
- [x] Custom node types for reminders/timers in editor
- [x] Editor content versioning and history

**Potential Solutions:**

**Solution 1: Editor Content + Separate Metadata Storage - RECOMMENDED**
- Description: Store Tiptap editor content (JSON/HTML) in file system or database. Store metadata (reminders, timers, alarms, document numbers) in SQLite. Link via document ID. Use Tiptap's `getJSON()` and `setContent()` for save/load.
- Pros:
  - Clear separation of concerns
  - Editor content can be versioned independently
  - Metadata can be queried efficiently (SQL)
  - Standard pattern used by many note apps
  - Easy to implement
- Cons:
  - Need to maintain relationships between content and metadata
  - Need to handle document ID consistency
  - Potential for data inconsistency if not careful
- Implementation Complexity: Moderate
- Cross-Platform Support: Full
- Pattern: Document ID as primary key linking files to database
- Recommendation: **Recommended for MVP** - Standard, proven approach

**Solution 2: Tiptap Custom Extensions for Metadata**
- Description: Create custom Tiptap node types (e.g., `reminderNode`, `timerNode`, `alarmNode`) that embed metadata directly in editor content. Store as part of Tiptap JSON.
- Pros:
  - Integrated directly into editor content
  - Visual representation in editor
  - Single source of truth
  - Can edit metadata inline
- Cons:
  - More complex implementation (custom node types)
  - Editor content becomes more complex
  - Harder to query metadata (need to parse JSON)
  - May impact editor performance with many metadata nodes
- Implementation Complexity: High
- Cross-Platform Support: Full
- Libraries: Tiptap extension development
- Recommendation: Consider for advanced features, not MVP

**Solution 3: Hybrid: Metadata in DB + Editor Marks**
- Description: Store metadata in SQLite. Use Tiptap marks (decorations) to visually indicate where reminders/timers are attached in content. Sync marks with database on save.
- Pros:
  - Balance between integration and separation
  - Good performance (metadata queries fast)
  - Visual indicators in editor
  - Flexible metadata management
- Cons:
  - Need to sync editor marks with metadata
  - More complex than pure separation
  - Need to handle mark persistence
- Implementation Complexity: Moderate to High
- Cross-Platform Support: Full
- Pattern: Marks for visual, DB for data
- Recommendation: Good balance for production, after MVP

**Solution 4: Tiptap with Sidebar/Panel Integration - MVP ALTERNATIVE**
- Description: Keep editor content pure. Display reminders/timers/alarms in separate UI panel/sidebar. Link via document ID. Update panel when editor content changes.
- Pros:
  - Clean editor content
  - Clear UI separation
  - Easy to implement
  - Good for complex metadata
- Cons:
  - Less integrated feel
  - Need to manage two UI areas
  - May feel disconnected
- Implementation Complexity: Low to Moderate
- Cross-Platform Support: Full
- Recommendation: Good for MVP, can enhance later

**Selected Solution:** Solution 1 - Editor Content + Separate Metadata Storage (Recommended for MVP: Solution 4 - Sidebar/Panel Integration)

**Rationale:** Standard pattern, proven approach. Sidebar easier for MVP, can enhance to Solution 1 later.

**Implementation Notes:**
- Use document ID to link editor content and metadata
- Implement save/load using Tiptap's `getJSON()` and `setContent()`
- Store metadata in SQLite with document ID as foreign key

---

### 2.2 React Context + Moderate Complexity State

**Status:** ✅ **RESEARCHED - SOLUTIONS IDENTIFIED**

**Issue Description:**
- React Context may be insufficient for:
  - Local File Saving (may need more complex state)
  - Reminders Attached to Note Files (may need more complex state)
  - Save, Open, and Edit Popular File Types (may need more complex state)
  - Hierarchical Notes (may need more complex state)

**Impact:**
- **Features:** Local File Saving, Reminders, File Types, Hierarchical Notes
- **Severity:** Moderate - May work with Context, but could benefit from better state management
- **User Experience:** Performance and maintainability concerns

**Location in Planning Doc:**
- Section 1.6 State Management → React Context option

**Research Areas:**
- [x] State management patterns for file operations
- [x] State management for hierarchical data structures
- [x] Performance implications of Context API with frequent updates
- [x] When to use Context vs. other state management
- [x] Optimizing Context performance (memoization, splitting contexts)
- [x] State management for async operations (file I/O)

**Potential Solutions:**

**Solution 1: Context with Performance Optimizations**
- Description: Use React Context but optimize with memoization and context splitting
- Pros:
  - Simple, no additional libraries
  - Can work for moderate complexity
  - Familiar to React developers
- Cons:
  - Requires careful optimization
  - May still have performance issues at scale
  - More boilerplate for optimization
- Implementation Complexity: Moderate
- Cross-Platform Support: Full
- Recommendation: Good for MVP, may need upgrade later

**Solution 2: Zustand for File Operations**
- Description: Use Zustand for file operations and hierarchical data, Context for simple UI state
- Pros:
  - Lightweight addition
  - Better performance for complex operations
  - Easy migration path
- Cons:
  - Multiple state systems
  - Need to decide which to use when
- Implementation Complexity: Moderate
- Cross-Platform Support: Full
- Recommendation: Good pragmatic approach

**Solution 3: Evaluate on Case-by-Case Basis - RECOMMENDED FOR MVP**
- Description: Start with Context for simple state (UI state, current note). Use Zustand for file operations, hierarchical data, and complex features. Migrate Context to Zustand if performance issues arise.
- Pros:
  - Prototype approach - start simple
  - Only add complexity when needed
  - Learn from real usage
  - Can use Context for UI, Zustand for data
- Cons:
  - May require refactoring later
  - Need to identify when to migrate
  - Two state systems to understand
- Implementation Complexity: Low to Moderate
- Cross-Platform Support: Full
- Pattern: Context for UI state, Zustand for business logic
- Recommendation: **Recommended for MVP** - Aligns with functional prototype approach

**Selected Solution:** Solution 3 - Evaluate case-by-case, use Context for UI, Zustand for data

**Rationale:** Prototype approach - start simple, add complexity when needed.

**Implementation Notes:**
- Start with Context for UI state
- Use Zustand for file operations and hierarchical data
- Monitor performance and migrate if needed

---

### 2.3 File System Storage Alone - Structured Data Needs

**Status:** ✅ **RESEARCHED - SOLUTIONS IDENTIFIED**

**Issue Description:**
- File system storage alone insufficient for:
  - Reminders Attached to Note Files (metadata needed)
  - Custom Metadata Association (may need database)
  - Timer (state persistence needed)
  - Alarm (scheduling data needed)

**Impact:**
- **Features:** Reminders, Custom Metadata, Timer, Alarm
- **Severity:** Moderate - Hybrid approach (file system + database) is standard solution
- **User Experience:** Need efficient querying and relationships

**Location in Planning Doc:**
- Section 1.7 Storage Solutions → File System option

**Research Areas:**
- [x] Hybrid storage patterns (file system + database)
- [x] Metadata storage in JSON files vs. database
- [x] Query performance: file system vs. database
- [x] Data consistency patterns for hybrid storage
- [x] Backup and recovery for hybrid storage
- [x] Migration strategies between storage types
- [x] Indexing strategies for file-based metadata

**Potential Solutions:**

**Solution 1: Hybrid Storage (File System + SQLite) - STRONGLY RECOMMENDED**
- Description: Store note content (Tiptap JSON/HTML/Markdown) in file system. Store all metadata (tags, projects, reminders, timers, alarms, document numbers, hierarchical relationships, branch info) in SQLite. Link via document ID.
- Pros:
  - Best of both worlds - fast content access + fast metadata queries
  - Flexible content storage (can version, diff, backup easily)
  - SQL queries for metadata (tags, dates, relationships)
  - Standard pattern used by Obsidian, Joplin, Notion
  - Content files are human-readable
  - Easy to backup (just copy files + database)
- Cons:
  - Need to maintain two storage systems
  - Need to handle data consistency (document ID must match)
  - Need to handle orphaned files or database entries
  - More complex than single storage
- Implementation Complexity: Moderate
- Cross-Platform Support: Full
- Schema Pattern:
  - Files: `notes/{documentId}.json` or `notes/{documentId}.md`
  - SQLite: `notes` table with `document_id`, `parent_id`, `tags`, `reminders`, etc.
  - Link: `document_id` is primary key
- Recommendation: **STRONGLY RECOMMENDED** - Industry standard for note apps

**Solution 2: JSON Metadata Files (Simple Alternative)**
- Description: Store metadata in JSON files (`{documentId}.meta.json`) alongside content files. No database needed.
- Pros:
  - Simple, no database needed
  - Easy to backup and version (just copy files)
  - Human-readable
  - No SQL knowledge needed
  - Good for small collections
- Cons:
  - Slower queries (need to read multiple files, no indexing)
  - No relationships/joins (harder to query "all notes with tag X")
  - May not scale well (1000+ notes)
  - Need to implement own indexing/search
- Implementation Complexity: Low
- Cross-Platform Support: Full
- Use Case: Good for MVP with <100 notes, upgrade later
- Recommendation: Good for MVP, will need upgrade for scale

**Solution 3: Single SQLite Database (All-in-One)**
- Description: Store everything (content + metadata) in SQLite. Content in TEXT or BLOB columns.
- Pros:
  - Single storage system (simpler architecture)
  - ACID transactions (data consistency)
  - Fast queries with indexes
  - Relationships and joins (easy to query)
  - Single file to backup
- Cons:
  - Large content in database can be inefficient (bloat)
  - Less flexible for content editing (harder to diff/version)
  - Database file grows large quickly
  - Harder to version content (need custom versioning)
  - Less human-readable (need tools to view)
- Implementation Complexity: Moderate
- Cross-Platform Support: Full
- Schema Pattern: `notes` table with `content` (TEXT/BLOB) + metadata columns
- Recommendation: Consider if simplicity > flexibility

**Solution 4: Hybrid with Content in SQLite JSON Column**
- Description: Store content as JSON in SQLite JSON column, metadata in other columns. Use SQLite JSON functions for querying.
- Pros:
  - Single storage system
  - Can query content with SQL JSON functions
  - ACID transactions
  - Good for structured content
- Cons:
  - Still database bloat with large content
  - Less flexible than file system
  - SQLite JSON support varies by version
- Implementation Complexity: Moderate
- Cross-Platform Support: Full (SQLite 3.38+)
- Recommendation: Consider if you need to query content structure

**Selected Solution:** Solution 1 - Hybrid Storage (File System + SQLite)

**Rationale:** Industry standard (Obsidian, Joplin, Notion use this). Best balance of flexibility and performance.

**Implementation Notes:**
- Use document ID to link files and database entries
- Implement data consistency checks
- Handle orphaned files/database entries
- Regular backup of both files and database

---

### 2.4 SQLite Storage Separation

**Status:** ✅ **RESEARCHED - SOLUTIONS IDENTIFIED**

**Issue Description:**
- SQLite stores metadata separately from note content
- Content stored in file system, metadata in database
- Need to maintain relationships between content and metadata

**Impact:**
- **Feature:** Full-Featured Text Editor
- **Severity:** Minor - This is an architectural design, not a problem
- **User Experience:** None - This is expected behavior

**Location in Planning Doc:**
- Section 1.7 Storage Solutions → SQLite option

**Research Areas:**
- [x] Content-metadata relationship patterns
- [x] Referential integrity between files and database
- [x] Handling orphaned files or database entries
- [x] Content-metadata synchronization strategies

**Potential Solutions:**

**Solution 1: Document ID as Bridge - RECOMMENDED**
- Description: Use consistent document IDs (UUIDs or `{app_version}_{timestamp}` format) to link files and database entries. Document ID is primary key in database, filename in file system.
- Pros:
  - Simple and reliable
  - Easy to implement
  - Clear relationship
  - Path-independent (can move files)
  - Standard pattern
- Cons:
  - Need to handle ID generation consistently
  - Need validation to ensure IDs match
- Implementation Complexity: Low
- Cross-Platform Support: Full
- Pattern: `document_id` in DB = `{documentId}.json` filename
- Recommendation: **STRONGLY RECOMMENDED** - Standard approach

**Solution 2: File Path as Primary Key**
- Description: Use file path as the link between content and metadata
- Pros:
  - Natural relationship
  - Easy to understand
  - No ID generation needed
- Cons:
  - Path changes break relationships
  - Less flexible (can't easily move files)
  - Platform-specific path handling
- Implementation Complexity: Low
- Cross-Platform Support: Full (with path normalization)
- Recommendation: Consider if paths are stable and never change

**Additional: Hierarchical Notes Storage Pattern**

**Adjacency List Model (RECOMMENDED):**
- SQLite table: `notes` with `id`, `parent_id`, `title`, `document_id`, etc.
- `parent_id` references `id` (self-referential foreign key)
- Query children: `SELECT * FROM notes WHERE parent_id = ?`
- Query ancestors: Use recursive CTE (Common Table Expression)
- Pros: Simple, flexible, easy to modify hierarchy
- Cons: Recursive queries can be slower for deep hierarchies
- SQLite Support: Full (WITH RECURSIVE since SQLite 3.8.3)

**Materialized Path Pattern:**
- Store full path: `path` column like `/1/2/5/` (IDs of ancestors)
- Query descendants: `SELECT * FROM notes WHERE path LIKE '/1/%'`
- Pros: Fast queries, no recursion needed
- Cons: Path updates needed when moving nodes, more complex
- Use Case: Better for read-heavy, less modification

**Nested Set Model:**
- Store `left` and `right` values for tree traversal
- Pros: Very fast queries for subtrees
- Cons: Complex to maintain, expensive updates
- Use Case: Rarely used, only for read-only hierarchies

**Recommendation for Hierarchical Notes:** Use **Adjacency List** with recursive CTEs. Simple, flexible, and SQLite handles it well. Can optimize later if needed.

**Selected Solution:** Solution 1 - Document ID as Bridge

**Rationale:** Standard approach, path-independent, reliable.

**Implementation Notes:**
- Generate consistent document IDs (UUIDs recommended)
- Validate ID consistency between files and database
- Use adjacency list model for hierarchical notes

---

## 3. Limited Relevance Items (🟢)

### 3.1 Search Solutions - Timer/Alarm Limited Relevance

**Status:** 📝 Not a Blocker

**Issue Description:**
- Search solutions (lunr.js, flexsearch) have limited relevance for Timer and Alarm features
- Timers and alarms are not primarily searchable content

**Impact:**
- **Features:** Timer, Alarm
- **Severity:** Minor - Not a problem, just noting limited applicability
- **User Experience:** None - Search is not expected for these features

**Location in Planning Doc:**
- Section 1.8 Search Solution

**Notes:**
- This is expected behavior - timers and alarms don't need full-text search
- May want basic filtering/search by name, but not full-text content search
- Not a problem to solve, just an observation

**Selected Solution:** N/A - Not applicable

---

### 3.2 Date/Time Libraries - Text Editor Limited Relevance

**Status:** 📝 Not a Blocker

**Issue Description:**
- Date/time libraries have limited relevance for Full-Featured Text Editor
- Editor doesn't primarily deal with dates/times

**Impact:**
- **Feature:** Full-Featured Text Editor
- **Severity:** Minor - Not a problem, just noting limited applicability
- **User Experience:** None - Date/time handling not expected in editor

**Location in Planning Doc:**
- Section 1.9 Date/Time Library

**Notes:**
- This is expected behavior - editor doesn't need date/time manipulation
- Date/time libraries are for calendar, reminders, timers, alarms
- Not a problem to solve, just an observation

**Selected Solution:** N/A - Not applicable

---

### 3.3 Component Playground - File Saving Limited Relevance

**Status:** 📝 Not a Blocker

**Issue Description:**
- Component playground/Storybook has limited relevance for Local File Saving
- File saving is not a UI component to develop in isolation

**Impact:**
- **Feature:** Local File Saving
- **Severity:** Minor - Not a problem, just noting limited applicability
- **User Experience:** None - Component playground not needed for this

**Location in Planning Doc:**
- Section 7.2 GUI Customization Tools

**Notes:**
- This is expected behavior - file saving is a service/utility, not a UI component
- Component playground is for developing UI components
- Not a problem to solve, just an observation

**Selected Solution:** N/A - Not applicable

---

## 4. Research Findings Summary

### 4.1 Solutions Status

**Critical Issues:**
- [x] 1.1 Electron + Alarm Background Execution - ✅ Solutions identified
- [x] 1.2 React Context + Complex State - ✅ Solutions identified

**Integration Challenges:**
- [x] 2.1 Tiptap Integration Requirements - ✅ Solutions identified
- [x] 2.2 React Context + Moderate Complexity - ✅ Solutions identified
- [x] 2.3 File System Storage Alone - ✅ Solutions identified
- [x] 2.4 SQLite Storage Separation - ✅ Solutions identified

**Limited Relevance:**
- [x] 3.1 Search Solutions - Not applicable
- [x] 3.2 Date/Time Libraries - Not applicable
- [x] 3.3 Component Playground - Not applicable

---

### 4.2 Recommended Solutions (Based on Research)

**Final Recommendations:**

1. **Alarm Background Execution:**
   - **Electron:** Solution 1 - Main Process + node-schedule + System Notifications
   - **Tauri:** Solution 2 - Native Rust backend with system APIs
   - **Rationale:** Standard patterns for desktop alarm apps. Electron requires app running (system tray), Tauri has better native integration.

2. **Complex State Management:**
   - **Recommended:** Solution 4 - Hybrid Approach (Context for UI, Zustand for data)
   - **Alternative for MVP:** Solution 3 - Start with Context, migrate as needed
   - **Rationale:** Aligns with functional prototype approach. Use right tool for each job.

3. **Tiptap Integration:**
   - **Recommended:** Solution 1 - Editor Content + Separate Metadata Storage
   - **MVP Alternative:** Solution 4 - Tiptap with Sidebar/Panel Integration
   - **Rationale:** Standard pattern, proven approach. Sidebar easier for MVP.

4. **Storage Architecture:**
   - **STRONGLY RECOMMENDED:** Solution 1 - Hybrid Storage (File System + SQLite)
   - **Hierarchical Notes:** Adjacency List Model with recursive CTEs
   - **Rationale:** Industry standard (Obsidian, Joplin, Notion use this). Best balance of flexibility and performance.

5. **React Context + Moderate Complexity:**
   - **Recommended:** Solution 3 - Evaluate case-by-case, use Context for UI, Zustand for data
   - **Rationale:** Prototype approach - start simple, add complexity when needed.

**Summary:**
- **Alarms:** Electron main process + node-schedule (or Tauri native)
- **State:** Hybrid (Context + Zustand)
- **Tiptap:** Separate metadata storage
- **Storage:** File system + SQLite (hybrid)
- **Hierarchy:** Adjacency list with recursive CTEs

**All solutions are cross-platform and align with functional prototype approach.**

---

## 5. Implementation Roadmap

### 5.1 Priority Order

1. **Storage Architecture** (Foundation)
   - Decision needed before other features
   - Affects all features
   - **Selected:** Hybrid Storage (File System + SQLite)

2. **State Management** (Foundation)
   - Decision needed early
   - Affects complex features
   - **Selected:** Hybrid (Context + Zustand)

3. **Tiptap Integration** (Core Feature)
   - Needed for MVP
   - Affects editor features
   - **Selected:** Editor Content + Separate Metadata Storage (MVP: Sidebar/Panel)

4. **Alarm Background Execution** (Advanced Feature)
   - Can be addressed after MVP
   - Specific to alarm feature
   - **Selected:** Electron main process + node-schedule (or Tauri native)

---

### 5.2 Research Tasks

**Completed Research:**
- [x] Research Electron background execution patterns
- [x] Research state management for tree/graph structures
- [x] Research Tiptap integration patterns
- [x] Research hybrid storage patterns
- [x] Research content-metadata relationship patterns
- [x] Research hierarchical data storage patterns

**Follow-up Research:**
- [ ] Evaluate selected solutions in prototype
- [ ] Performance testing of solutions
- [ ] Cross-platform compatibility testing

---

## 6. Notes and Considerations

### 6.1 Key Constraints

- Must support functional prototype approach
- Solutions should enable rapid iteration
- Must maintain codebase maintainability
- Should support feature-packed development

---

### 6.2 Trade-offs

- **Simplicity vs. Capability:** Balance between simple solutions and feature requirements
- **Performance vs. Development Speed:** Optimize for development speed initially, performance later
- **Single Solution vs. Hybrid:** Use right tool for each job, but avoid too many systems

---

### 6.3 Open Questions

- [ ] How critical is alarm background execution for MVP?
- [x] Can we start with React Context and migrate later? **Yes - Recommended approach**
- [x] What's the minimum viable storage architecture? **Hybrid Storage (File System + SQLite)**
- [x] How much Tiptap integration is needed for MVP? **Sidebar/Panel integration sufficient for MVP**

---

**Document Status:** Active Research  
**Last Updated:** 2024  
**Next Review:** After prototype implementation and testing

