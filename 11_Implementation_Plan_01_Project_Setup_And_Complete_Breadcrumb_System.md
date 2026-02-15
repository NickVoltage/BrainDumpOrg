# Implementation Plan 01: Project Setup & Complete Breadcrumb System

> **Note:** This is the first implementation plan for the note-taking application. It focuses on setting up the complete project structure and creating a comprehensive breadcrumb system that maps all 12 Project Desires and planned features throughout the codebase.

**Document Purpose:** Step-by-step guide for initial project setup and complete breadcrumb system creation.

**Related Documents:**
- `00_Breadcrumb_Development.md` - Breadcrumb development approach
- `00_Codebase_Comments_Guidelines.md` - Comment numbering standards
- `06_Project_Desires.md` - All 12 project desires
- `Archive_Collection/01_Archived_Implementation_Plans/09_Project_Architecture.md` - Architecture and project structure (archived, fully integrated)
- `Archive_Collection/01_Archived_Implementation_Plans/12_Proposed_Selections_From_Project_Planning.md` - Technology decisions (archived, fully integrated)
- `Archive_Collection/01_Archived_Implementation_Plans/13_Feature_Implementation_Conversation.md` - Feature categorization (archived, fully integrated)

**Last Updated:** 2024  
**Status:** Ready for Implementation

---

## Overview

This plan establishes the complete foundation for the application, including:
1. Tauri project initialization
2. Complete directory structure (all feature folders)
3. All placeholder files for all 12 Project Desires
4. Complete breadcrumb comment system
5. Comment directory file
6. Database schema (empty tables)
7. File system data directories
8. Basic infrastructure setup

**Critical Requirement:** The breadcrumb system must be 100% complete before proceeding to `12_Implementation_Plan_02_Breadcrumb_Verification_And_GUI_Foundation.md`. This ensures the complete roadmap exists before any GUI work begins.

---

## Development Priorities & Decision Framework

> **CRITICAL:** These priorities guide ALL development decisions and architectural choices throughout this plan. They take precedence over other considerations when making trade-offs.

### Priority 1: Easily and Highly Customizable GUI Development Experience

**Priority Level:** HIGHEST

**Goal:** Enable rapid GUI customization and iteration with minimal friction. The development experience must support quick visual changes, layout modifications, and UI experimentation without breaking functionality.

**How This Guides This Plan:**
- Component-based architecture with modular, reusable UI components
- CSS Variables + Tailwind CSS for easy customization
- Clear separation between logic and presentation
- Theme system foundation established early
- Content type system for reusable layout components

**Decision Checkpoint:** When making choices in this plan, ask: "Does this support rapid GUI customization?"

---

### Priority 2: Functional Prototype Approach (User-Driven Development)

**Priority Level:** HIGHEST

**Goal:** Build a working, usable application quickly that can be iteratively improved based on real user feedback. Prioritize functional features over perfect implementation.

**How This Guides This Plan:**
- Breadcrumb system enables on-demand feature development
- Placeholder files and comments provide roadmap without full implementation
- "Make it work, then make it right, then make it fast" philosophy
- GUI-first approach: build GUI, customize, then add features per-user-request

**Development Philosophy:**
- Prefer working code over perfect architecture initially
- Refactor when patterns become clear
- Don't over-engineer before understanding requirements
- Build for current needs, not hypothetical future needs

**Decision Checkpoint:** When making choices in this plan, ask: "Does this enable functional prototyping?"

---

### Priority 3: Easily Maintainable Codebase That's Feature-Packed

**Priority Level:** HIGHEST

**Goal:** Build a codebase that can support extensive features while remaining easy to understand, modify, and extend.

**How This Guides This Plan:**
- Feature-based folder structure
- Clear separation of concerns (layers)
- Comprehensive breadcrumb comments for navigation
- Documentation standards (file headers, numbered comments)
- Modular architecture with minimal coupling

**Key Principles:**
- **Modularity:** Features should be independent modules
- **Clarity:** Code should be self-documenting
- **Consistency:** Follow established patterns
- **Simplicity:** Prefer simple solutions over complex ones
- **Flexibility:** Design for change and extension

**Decision Checkpoint:** When making choices in this plan, ask: "Does this improve long-term maintainability?"

---

### Priority Integration & Decision Framework

**How Priorities Work Together:**
- **Customizable GUI + Prototype Approach:** Rapid GUI changes support quick iteration
- **Prototype Approach + Maintainable Codebase:** Start with working code, refactor when patterns emerge
- **Customizable GUI + Maintainable Codebase:** Modular components are both customizable and maintainable

**Decision Framework:**
When making development decisions in this plan, consider:
1. Does this support rapid GUI customization?
2. Does this enable functional prototyping?
3. Does this improve long-term maintainability?
4. Does this support feature growth?

**Priority Order for Conflicts:**
If a decision conflicts with these priorities, prioritize them in order:
1. **Maintainable Codebase** (long-term viability)
2. **Functional Prototype** (user-driven development)
3. **Customizable GUI** (development experience)

**Development Workflow:**
1. Build functional prototype quickly (Prototype Approach)
2. Customize GUI based on usage (Customizable GUI)
3. Refactor and improve architecture (Maintainable Codebase)
4. Add features iteratively (All Priorities)
5. Document and maintain (Maintainable Codebase)

---

## Phase 1: Development Environment Setup

### Step 1.1: Verify Prerequisites

**Objective:** Ensure all required tools are installed and configured.

**Tasks:**
1. **Verify Rust Installation:**
   - Check: `rustc --version` (should be 1.70+)
   - If not installed: Install via rustup (https://rustup.rs/)
   - Verify: `cargo --version`

2. **Verify Node.js Installation:**
   - Check: `node --version` (should be 18+ LTS)
   - If not installed: Download from nodejs.org
   - Verify: `npm --version` (should be 9+)

3. **Verify System Dependencies:**
   - **Windows:** Microsoft C++ Build Tools (Visual Studio Build Tools)
   - **macOS:** Xcode Command Line Tools (`xcode-select --install`)
   - **Linux:** `build-essential`, `libwebkit2gtk-4.0-dev`, `libssl-dev`

4. **Install Tauri CLI:**
   - Run: `npm install -g @tauri-apps/cli`
   - Verify: `tauri --version` (should be 2.0+)

**Success Criteria:**
- All tools installed and verified
- All commands return expected versions
- System dependencies confirmed

**Breadcrumb Note:** This step establishes the development foundation. No breadcrumbs needed here as this is environment setup, not code structure.

---

### Step 1.2: Initialize Tauri Project

**Objective:** Create the base Tauri project structure using official CLI.

**Tasks:**
1. **Create Project:**
   - Run: `npm create tauri-app@latest`
   - Project name: `auto-sort-notes` (or user's preferred name)
   - Package manager: npm
   - Frontend framework: React
   - TypeScript: Yes
   - UI template: Custom (we'll build our own)

2. **Navigate to Project:**
   - `cd auto-sort-notes`

3. **Verify Project Structure:**
   - Confirm `src-tauri/` directory exists (Rust backend)
   - Confirm `src/` directory exists (React frontend)
   - Confirm `package.json` exists
   - Confirm `tauri.conf.json` exists

4. **Install Dependencies:**
   - Run: `npm install`
   - Verify: `node_modules/` directory created

5. **Test Initial Build:**
   - Run: `npm run tauri dev`
   - Verify: Application window opens (even if empty)
   - Close application

**Success Criteria:**
- Tauri project created successfully
- All dependencies installed
- Application builds and runs (empty window is fine)
- Project structure matches Tauri 2.0 conventions

**Breadcrumb Note:** This establishes the base project. Breadcrumbs for project structure will be added in Phase 2.

---

## Phase 2: Complete Directory Structure Creation

### Step 2.1: Create Feature-Based Directory Structure

**Objective:** Create complete directory structure for all features and shared resources.

**Tasks:**
1. **Create Main Source Directories:**
   ```
   src/
   ├── main/                    # Tauri main process (Rust) - already exists
   ├── renderer/                # Frontend (React/TypeScript)
   ├── tests/                   # Test files
   └── assets/                  # Static assets
   ```

2. **Create Renderer Structure:**
   ```
   src/renderer/
   ├── features/                # Feature-based modules
   ├── shared/                  # Shared across features
   ├── stores/                  # Zustand stores
   ├── contexts/                # React Context
   ├── config/                  # Configuration
   └── App.tsx                  # Main app component
   ```

3. **Create Feature Directories (All 12 Project Desires):**
   ```
   src/renderer/features/
   ├── notes/                   # Full-Featured Text Editor + Local File Saving
   ├── calendar/                # Calendar feature
   ├── todos/                   # To-Do List (Do/Due tab)
   ├── alarms/                  # Alarm/Timer tab (includes Reminders)
   ├── metadata/                # Custom Metadata Association
   ├── branches/                # Branched Notes (builds upon notes)
   ├── versions/                # Non-Destructive Historical Timelines (builds upon notes)
   ├── hierarchy/               # Hierarchical Notes (builds upon dashboard)
   ├── file-import/             # Save, Open, and Edit Popular File Types (builds upon multiple)
   └── dashboard/                # Main Dashboard
   ```

4. **Create Feature Subdirectories (for each feature):**
   For each feature directory, create:
   ```
   [feature-name]/
   ├── components/              # UI components
   ├── services/               # Business logic
   ├── storage/                # Data persistence
   ├── hooks/                  # React hooks
   ├── stores/                 # Zustand stores (if feature-specific)
   ├── types.ts                # TypeScript types
   └── index.ts                # Public exports
   ```

5. **Create Shared Directories:**
   ```
   src/renderer/shared/
   ├── components/              # Reusable UI components
   ├── services/               # Cross-feature services
   ├── storage/                # Shared storage utilities
   ├── utils/                  # Utility functions
   ├── hooks/                  # Shared React hooks
   └── types/                  # Shared types
   ```

6. **Create Store Directories:**
   ```
   src/renderer/stores/
   ├── note-store.ts
   ├── calendar-store.ts
   ├── todo-store.ts
   ├── alarm-store.ts
   ├── timer-store.ts
   ├── metadata-store.ts
   ├── branch-store.ts
   ├── version-store.ts
   └── ui-store.ts
   ```

7. **Create Context Directories:**
   ```
   src/renderer/contexts/
   ├── EditorContext.tsx
   ├── ThemeContext.tsx
   ├── NavigationContext.tsx
   └── AppContext.tsx
   ```

9. **Create Config Directories:**
   ```
   src/renderer/config/
   ├── themes.ts
   ├── settings.ts
   ├── constants.ts
   └── theme-config.json
   ```

10. **Create Tauri Main Process Directories:**
   ```
   src-tauri/src/
   ├── main.rs                 # Already exists
   ├── commands.rs             # Tauri commands
   ├── storage.rs              # File system operations
   ├── scheduler.rs            # Background tasks (alarms)
   └── database.rs             # SQLite database operations
   ```

**Success Criteria:**
- All directories created
- Structure matches architecture document
- All 12 Project Desires have feature directories
- Shared resources properly organized
- Test windows directory created for standalone development

**Breadcrumb Note:** Directory structure is the foundation. Breadcrumb comments will be added to placeholder files in Phase 3.

---

## Logic Flow Guidelines

> **CRITICAL:** These guidelines ensure consistent data flow and layer separation throughout the application.

### Unidirectional Data Flow

**Principle:** Data flows in one direction through the application layers.

```
User Action
    ↓
Presentation Layer (Components)
    ↓
Application Layer (Services)
    ↓
Domain Layer (Models/Types)
    ↓
Infrastructure Layer (Storage)
    ↓
State Update
    ↓
UI Re-render
```

**Rules:**
- User actions trigger flow downward (Presentation → Infrastructure)
- Data changes flow upward (Infrastructure → Presentation)
- No circular dependencies
- State updates trigger re-renders, not direct manipulation

---

### Layer Responsibilities

**Presentation Layer (Components/Hooks):**
- Handle user interactions
- Display data
- Trigger service calls
- Manage UI state (local component state)
- **Cannot:** Directly access storage, modify business logic

**Application Layer (Services):**
- Business logic
- Coordinate between features
- Validate data
- Transform data
- **Cannot:** Directly render UI, access storage implementation details

**Domain Layer (Models/Types):**
- Data structures
- Type definitions
- Business rules (validation rules, constraints)
- **Cannot:** Have side effects, access external systems

**Infrastructure Layer (Storage):**
- Data persistence
- File I/O
- Database operations
- External API calls
- **Cannot:** Contain business logic, make UI decisions

---

### Communication Rules

**Between Layers:**
- Layers communicate through interfaces/abstractions
- Upper layers depend on lower layers (not vice versa)
- Use dependency injection for testability

**Between Features:**
- Features communicate via services
- No direct component-to-component communication across features
- Shared state via Zustand stores
- UI state via React Context

---

### Standard Flow Patterns

**Create Operation Flow:**
```
User Action (Click "Create")
    ↓
Component Event Handler
    ↓
Service.createEntity(data)
    ↓
┌─────────────────────────┐
│ 1. Validate input       │
│ 2. Generate ID          │
│ 3. Create domain model   │
│ 4. Save to storage      │
│ 5. Return entity        │
└─────────────────────────┘
    ↓
Update Zustand Store
    ↓
Update UI (if needed)
    ↓
Component Re-renders
```

**Read Operation Flow:**
```
Component Mounts / User Action
    ↓
Component Calls Hook
    ↓
Hook Calls Service
    ↓
Service.loadEntity(id)
    ↓
┌─────────────────────────┐
│ 1. Load from storage    │
│ 2. Transform data       │
│ 3. Return entity        │
└─────────────────────────┘
    ↓
Update Zustand Store (if needed)
    ↓
Hook Returns Data
    ↓
Component Uses Data
```

**Update Operation Flow:**
```
User Action (Edit)
    ↓
Component Event Handler
    ↓
Service.updateEntity(id, data)
    ↓
┌─────────────────────────┐
│ 1. Validate input       │
│ 2. Load existing entity │
│ 3. Apply updates        │
│ 4. Save to storage      │
│ 5. Return updated entity│
└─────────────────────────┘
    ↓
Update Zustand Store
    ↓
Component Re-renders
```

**Delete Operation Flow:**
```
User Action (Delete)
    ↓
Component Event Handler
    ↓
Service.deleteEntity(id)
    ↓
┌─────────────────────────┐
│ 1. Validate deletion   │
│ 2. Delete from storage   │
│ 3. Update relationships │
│ 4. Return success       │
└─────────────────────────┘
    ↓
Update Zustand Store
    ↓
Component Re-renders
```

**Error Handling Flow:**
```
Operation Attempt
    ↓
Error Occurs
    ↓
Service Returns Result<T, E>
    ↓
Component Checks Result
    ↓
┌─────────────────────────┐
│ Success: Update UI      │
│ Error: Display message  │
└─────────────────────────┘
```

**Note:** These flow patterns should be referenced in breadcrumb comments in Phase 4 to ensure consistent implementation.

---

## Phase 3: Placeholder File Creation

### Step 3.1: Create Placeholder Files for Notes Feature

**Objective:** Create all placeholder files for the Notes feature (Full-Featured Text Editor + Local File Saving).

**Files to Create:**

1. **Components:**
   - `src/renderer/features/notes/components/NoteEditor.tsx`
   - `src/renderer/features/notes/components/NoteList.tsx`
   - `src/renderer/features/notes/components/NoteTree.tsx` (hierarchical view)
   - `src/renderer/features/notes/components/NoteMetadataPanel.tsx`
   - `src/renderer/features/notes/components/NoteToolbar.tsx`
   - `src/renderer/features/notes/components/NoteSearch.tsx`

2. **Services:**
   - `src/renderer/features/notes/services/note-service.ts`
   - `src/renderer/features/notes/services/hierarchy-service.ts` (for hierarchical notes)
   - `src/renderer/features/notes/services/version-service.ts` (for historical timelines)
   - `src/renderer/features/notes/services/file-import-service.ts` (for file types)

3. **Storage:**
   - `src/renderer/features/notes/storage/note-file-storage.ts`
   - `src/renderer/features/notes/storage/note-database-storage.ts`
   - `src/renderer/features/notes/storage/note-storage-interface.ts`

4. **Hooks:**
   - `src/renderer/features/notes/hooks/useNote.ts`
   - `src/renderer/features/notes/hooks/useNoteHierarchy.ts`
   - `src/renderer/features/notes/hooks/useNoteVersions.ts`
   - `src/renderer/features/notes/hooks/useAutoSave.ts`

5. **Types:**
   - `src/renderer/features/notes/types.ts`

6. **Index:**
   - `src/renderer/features/notes/index.ts`

**File Content Template:**
Each placeholder file should contain:
- File header comment (purpose, last updated, etc.)
- Placeholder breadcrumb comments (will be detailed in Phase 4)
- Basic TypeScript structure (empty exports, type definitions)

**Success Criteria:**
- All placeholder files created for Notes feature
- Files have proper structure
- Ready for breadcrumb comments

---

### Step 3.2: Create Placeholder Files for Calendar Feature

**Objective:** Create all placeholder files for the Calendar feature.

**Files to Create:**

1. **Components:**
   - `src/renderer/features/calendar/components/CalendarView.tsx`
   - `src/renderer/features/calendar/components/CalendarMonth.tsx`
   - `src/renderer/features/calendar/components/CalendarWeek.tsx`
   - `src/renderer/features/calendar/components/CalendarDay.tsx`
   - `src/renderer/features/calendar/components/CalendarEvent.tsx`
   - `src/renderer/features/calendar/components/EventEditor.tsx`
   - `src/renderer/features/calendar/components/EventList.tsx`

2. **Services:**
   - `src/renderer/features/calendar/services/calendar-service.ts`
   - `src/renderer/features/calendar/services/event-service.ts`
   - `src/renderer/features/calendar/services/recurrence-service.ts`

3. **Storage:**
   - `src/renderer/features/calendar/storage/calendar-storage.ts`

4. **Hooks:**
   - `src/renderer/features/calendar/hooks/useCalendar.ts`
   - `src/renderer/features/calendar/hooks/useCalendarEvent.ts`

5. **Types:**
   - `src/renderer/features/calendar/types.ts`

6. **Index:**
   - `src/renderer/features/calendar/index.ts`

**Success Criteria:**
- All placeholder files created for Calendar feature
- Files ready for breadcrumb comments

---

### Step 3.3: Create Placeholder Files for To-Do List Feature

**Objective:** Create all placeholder files for the To-Do List feature (Do/Due tab).

**Files to Create:**

1. **Components:**
   - `src/renderer/features/todos/components/TodoList.tsx`
   - `src/renderer/features/todos/components/TodoItem.tsx`
   - `src/renderer/features/todos/components/TodoEditor.tsx`
   - `src/renderer/features/todos/components/TodoFilter.tsx`
   - `src/renderer/features/todos/components/TodoSearch.tsx`

2. **Services:**
   - `src/renderer/features/todos/services/todo-service.ts`

3. **Storage:**
   - `src/renderer/features/todos/storage/todo-storage.ts`

4. **Hooks:**
   - `src/renderer/features/todos/hooks/useTodo.ts`
   - `src/renderer/features/todos/hooks/useTodoList.ts`

5. **Types:**
   - `src/renderer/features/todos/types.ts`

6. **Index:**
   - `src/renderer/features/todos/index.ts`

**Success Criteria:**
- All placeholder files created for To-Do List feature
- Files ready for breadcrumb comments

---

### Step 3.4: Create Placeholder Files for Alarm/Timer Feature

**Objective:** Create all placeholder files for Alarm/Timer tab (includes Reminders).

**Files to Create:**

1. **Components:**
   - `src/renderer/features/alarms/components/AlarmTimerTab.tsx` (main tab component)
   - `src/renderer/features/alarms/components/TimerDisplay.tsx`
   - `src/renderer/features/alarms/components/TimerControls.tsx`
   - `src/renderer/features/alarms/components/TimerList.tsx`
   - `src/renderer/features/alarms/components/AlarmEditor.tsx`
   - `src/renderer/features/alarms/components/AlarmList.tsx`
   - `src/renderer/features/alarms/components/AlarmNotification.tsx`
   - `src/renderer/features/alarms/components/ReminderEditor.tsx`
   - `src/renderer/features/alarms/components/ReminderList.tsx`

2. **Services:**
   - `src/renderer/features/alarms/services/timer-service.ts`
   - `src/renderer/features/alarms/services/alarm-service.ts`
   - `src/renderer/features/alarms/services/reminder-service.ts`

3. **Storage:**
   - `src/renderer/features/alarms/storage/timer-storage.ts`
   - `src/renderer/features/alarms/storage/alarm-storage.ts`
   - `src/renderer/features/alarms/storage/reminder-storage.ts`

4. **Hooks:**
   - `src/renderer/features/alarms/hooks/useTimer.ts`
   - `src/renderer/features/alarms/hooks/useAlarm.ts`
   - `src/renderer/features/alarms/hooks/useReminder.ts`

5. **Types:**
   - `src/renderer/features/alarms/types.ts`

6. **Index:**
   - `src/renderer/features/alarms/index.ts`

**Tauri Main Process Files:**
- `src-tauri/src/scheduler.rs` (background task execution for alarms)

**Success Criteria:**
- All placeholder files created for Alarm/Timer feature
- Tauri scheduler file created
- Files ready for breadcrumb comments

---

### Step 3.5: Create Placeholder Files for Custom Metadata Feature

**Objective:** Create all placeholder files for Custom Metadata Association.

**Files to Create:**

1. **Components:**
   - `src/renderer/features/metadata/components/MetadataManager.tsx` (centralized manager)
   - `src/renderer/features/metadata/components/TagEditor.tsx`
   - `src/renderer/features/metadata/components/TagList.tsx`
   - `src/renderer/features/metadata/components/ProjectEditor.tsx`
   - `src/renderer/features/metadata/components/ProjectList.tsx`
   - `src/renderer/features/metadata/components/MetadataSearch.tsx` (unified search)
   - `src/renderer/features/metadata/components/MetadataPanel.tsx` (contextual UI)

2. **Services:**
   - `src/renderer/features/metadata/services/metadata-service.ts`
   - `src/renderer/features/metadata/services/tag-service.ts`
   - `src/renderer/features/metadata/services/project-service.ts`
   - `src/renderer/features/metadata/services/metadata-search-service.ts`

3. **Storage:**
   - `src/renderer/features/metadata/storage/metadata-storage.ts`

4. **Hooks:**
   - `src/renderer/features/metadata/hooks/useMetadata.ts`
   - `src/renderer/features/metadata/hooks/useTag.ts`
   - `src/renderer/features/metadata/hooks/useProject.ts`
   - `src/renderer/features/metadata/hooks/useMetadataSearch.ts`

5. **Types:**
   - `src/renderer/features/metadata/types.ts`

6. **Index:**
   - `src/renderer/features/metadata/index.ts`

**Success Criteria:**
- All placeholder files created for Metadata feature
- Files ready for breadcrumb comments

---

### Step 3.6: Create Placeholder Files for Branched Notes Feature

**Objective:** Create all placeholder files for Branched Notes (builds upon notes).

**Files to Create:**

1. **Components:**
   - `src/renderer/features/branches/components/BranchTree.tsx`
   - `src/renderer/features/branches/components/BranchSelector.tsx`
   - `src/renderer/features/branches/components/BranchCreator.tsx`
   - `src/renderer/features/branches/components/BranchViewer.tsx`
   - `src/renderer/features/branches/components/BranchMerge.tsx`
   - `src/renderer/features/branches/components/BranchIndicator.tsx` (in editor)

2. **Services:**
   - `src/renderer/features/branches/services/branch-service.ts`
   - `src/renderer/features/branches/services/branch-merge-service.ts`
   - `src/renderer/features/branches/services/branch-storage-service.ts`

3. **Storage:**
   - `src/renderer/features/branches/storage/branch-storage.ts`

4. **Hooks:**
   - `src/renderer/features/branches/hooks/useBranch.ts`
   - `src/renderer/features/branches/hooks/useBranchTree.ts`

5. **Types:**
   - `src/renderer/features/branches/types.ts`

6. **Index:**
   - `src/renderer/features/branches/index.ts`

**Success Criteria:**
- All placeholder files created for Branched Notes feature
- Files ready for breadcrumb comments

---

### Step 3.7: Create Placeholder Files for Historical Timelines Feature

**Objective:** Create all placeholder files for Non-Destructive Historical Timelines (builds upon notes).

**Files to Create:**

1. **Components:**
   - `src/renderer/features/versions/components/TimelineView.tsx`
   - `src/renderer/features/versions/components/TimelineSlider.tsx`
   - `src/renderer/features/versions/components/VersionViewer.tsx`
   - `src/renderer/features/versions/components/VersionDiff.tsx`
   - `src/renderer/features/versions/components/VersionRevertDialog.tsx` (Create Branch vs Revert Entirely)

2. **Services:**
   - `src/renderer/features/versions/services/version-service.ts`
   - `src/renderer/features/versions/services/timeline-service.ts`
   - `src/renderer/features/versions/services/version-storage-service.ts`

3. **Storage:**
   - `src/renderer/features/versions/storage/version-storage.ts`

4. **Hooks:**
   - `src/renderer/features/versions/hooks/useVersion.ts`
   - `src/renderer/features/versions/hooks/useTimeline.ts`

5. **Types:**
   - `src/renderer/features/versions/types.ts`

6. **Index:**
   - `src/renderer/features/versions/index.ts`

**Success Criteria:**
- All placeholder files created for Historical Timelines feature
- Files ready for breadcrumb comments

---

### Step 3.8: Create Placeholder Files for Hierarchical Notes Feature

**Objective:** Create all placeholder files for Hierarchical Notes (builds upon dashboard).

**Files to Create:**

1. **Components:**
   - `src/renderer/features/hierarchy/components/NoteTree.tsx` (tree view in dashboard)
   - `src/renderer/features/hierarchy/components/NoteTreeItem.tsx`
   - `src/renderer/features/hierarchy/components/HierarchyNavigator.tsx`
   - `src/renderer/features/hierarchy/components/HierarchyBreadcrumbs.tsx`

2. **Services:**
   - `src/renderer/features/hierarchy/services/hierarchy-service.ts`
   - `src/renderer/features/hierarchy/services/hierarchy-query-service.ts`

3. **Storage:**
   - `src/renderer/features/hierarchy/storage/hierarchy-storage.ts` (uses note storage, adds hierarchy queries)

4. **Hooks:**
   - `src/renderer/features/hierarchy/hooks/useHierarchy.ts`
   - `src/renderer/features/hierarchy/hooks/useNoteTree.ts`

5. **Types:**
   - `src/renderer/features/hierarchy/types.ts`

6. **Index:**
   - `src/renderer/features/hierarchy/index.ts`

**Success Criteria:**
- All placeholder files created for Hierarchical Notes feature
- Files ready for breadcrumb comments

---

### Step 3.9: Create Placeholder Files for File Import/Export Feature

**Objective:** Create all placeholder files for Save, Open, and Edit Popular File Types (builds upon multiple features).

**Files to Create:**

1. **Components:**
   - `src/renderer/features/file-import/components/FileImportDialog.tsx`
   - `src/renderer/features/file-import/components/FileExportDialog.tsx`
   - `src/renderer/features/file-import/components/FileTypeSelector.tsx`
   - `src/renderer/features/file-import/components/ImportProgress.tsx`

2. **Services:**
   - `src/renderer/features/file-import/services/file-import-service.ts`
   - `src/renderer/features/file-import/services/file-export-service.ts`
   - `src/renderer/features/file-import/services/docx-parser.ts`
   - `src/renderer/features/file-import/services/pdf-parser.ts`
   - `src/renderer/features/file-import/services/markdown-converter.ts`
   - `src/renderer/features/file-import/services/html-converter.ts`

3. **Storage:**
   - `src/renderer/features/file-import/storage/import-storage.ts`

4. **Hooks:**
   - `src/renderer/features/file-import/hooks/useFileImport.ts`
   - `src/renderer/features/file-import/hooks/useFileExport.ts`

5. **Types:**
   - `src/renderer/features/file-import/types.ts`

6. **Index:**
   - `src/renderer/features/file-import/index.ts`

**Success Criteria:**
- All placeholder files created for File Import/Export feature
- Files ready for breadcrumb comments

---

### Step 3.10: Create Placeholder Files for Dashboard Feature

**Objective:** Create all placeholder files for Main Dashboard (default home page).

**Files to Create:**

1. **Components:**
   - `src/renderer/features/dashboard/components/Dashboard.tsx` (main component)
   - `src/renderer/features/dashboard/components/DashboardLayout.tsx`
   - `src/renderer/features/dashboard/components/RecentNotes.tsx`
   - `src/renderer/features/dashboard/components/QuickActions.tsx`
   - `src/renderer/features/dashboard/components/DashboardSearch.tsx`
   - `src/renderer/features/dashboard/components/NotePreview.tsx`

2. **Services:**
   - `src/renderer/features/dashboard/services/dashboard-service.ts`

3. **Hooks:**
   - `src/renderer/features/dashboard/hooks/useDashboard.ts`

4. **Types:**
   - `src/renderer/features/dashboard/types.ts`

5. **Index:**
   - `src/renderer/features/dashboard/index.ts`

**Success Criteria:**
- All placeholder files created for Dashboard feature
- Files ready for breadcrumb comments

---

### Step 3.11: Create Placeholder Files for Shared Resources

**Objective:** Create placeholder files for shared components, services, utilities, and types.

**Files to Create:**

1. **Shared Components:**
   - `src/renderer/shared/components/Button.tsx`
   - `src/renderer/shared/components/Input.tsx`
   - `src/renderer/shared/components/Modal.tsx`
   - `src/renderer/shared/components/Sidebar.tsx`
   - `src/renderer/shared/components/Toolbar.tsx`
   - `src/renderer/shared/components/TabBar.tsx`
   - `src/renderer/shared/components/ContentTypeContainer.tsx` (content type system)

2. **Shared Services:**
   - `src/renderer/shared/services/file-service.ts`
   - `src/renderer/shared/services/search-service.ts`
   - `src/renderer/shared/services/notification-service.ts`

3. **Shared Storage:**
   - `src/renderer/shared/storage/database.ts` (SQLite connection)
   - `src/renderer/shared/storage/file-system.ts` (file system utilities)
   - `src/renderer/shared/storage/storage-helpers.ts`

4. **Shared Utils:**
   - `src/renderer/shared/utils/date-utils.ts`
   - `src/renderer/shared/utils/string-utils.ts`
   - `src/renderer/shared/utils/validation.ts`
   - `src/renderer/shared/utils/diff-utils.ts`
   - `src/renderer/shared/utils/debounce.ts`

5. **Shared Hooks:**
   - `src/renderer/shared/hooks/useDebounce.ts`
   - `src/renderer/shared/hooks/useLocalStorage.ts`
   - `src/renderer/shared/hooks/useTheme.ts`

6. **Shared Types:**
   - `src/renderer/shared/types/common.types.ts`
   - `src/renderer/shared/types/api.types.ts`
   - `src/renderer/shared/types/result.types.ts` (Result<T, E> type)

**Success Criteria:**
- All shared placeholder files created
- Files ready for breadcrumb comments

---

### Step 3.12: Create Placeholder Files for Stores

**Objective:** Create placeholder Zustand store files.

**Files to Create:**
- `src/renderer/stores/note-store.ts`
- `src/renderer/stores/calendar-store.ts`
- `src/renderer/stores/todo-store.ts`
- `src/renderer/stores/alarm-store.ts`
- `src/renderer/stores/timer-store.ts`
- `src/renderer/stores/metadata-store.ts`
- `src/renderer/stores/branch-store.ts`
- `src/renderer/stores/version-store.ts`
- `src/renderer/stores/ui-store.ts`

**Success Criteria:**
- All store placeholder files created
- Files ready for breadcrumb comments

---

### Step 3.13: Create Placeholder Files for Contexts

**Objective:** Create placeholder React Context files.

**Files to Create:**
- `src/renderer/contexts/EditorContext.tsx`
- `src/renderer/contexts/ThemeContext.tsx`
- `src/renderer/contexts/NavigationContext.tsx`
- `src/renderer/contexts/AppContext.tsx`

**Success Criteria:**
- All context placeholder files created
- Files ready for breadcrumb comments

---

### Step 3.14: Create Placeholder Files for Config

**Objective:** Create configuration files.

**Files to Create:**
- `src/renderer/config/themes.ts`
- `src/renderer/config/settings.ts`
- `src/renderer/config/constants.ts`
- `src/renderer/config/theme-config.json`

**Success Criteria:**
- All config files created
- Files ready for breadcrumb comments

---

### Step 3.15: Create Placeholder Files for Tauri Main Process

**Objective:** Create Rust files for Tauri backend.

**Files to Create:**
- `src-tauri/src/commands.rs` (Tauri commands)
- `src-tauri/src/storage.rs` (file system operations)
- `src-tauri/src/scheduler.rs` (background tasks for alarms)
- `src-tauri/src/database.rs` (SQLite operations)

**Success Criteria:**
- All Tauri main process files created
- Files ready for breadcrumb comments

---

## Phase 4: Complete Breadcrumb Comment System

### Step 4.1: Understand Breadcrumb Comment Requirements

**Objective:** Review breadcrumb comment standards before adding comments.

**Reference Documents:**
- `00_Breadcrumb_Development.md` - Breadcrumb approach
- `00_Codebase_Comments_Guidelines.md` - Comment standards

**Key Requirements:**
1. **Every placeholder file must have breadcrumb comments** explaining:
   - Where the feature will be implemented
   - How it will interact with the codebase
   - Full sibling/parent paths
   - Logic flow
   - Dependencies
   - Related files

2. **Comment numbering:**
   - Sequential: Comment 001, Comment 002, etc.
   - Start from 001 for setup/infrastructure
   - Related code shares same number (bi-directional)
   - Register all comments in comment directory

3. **Comment format:**
   - Comment number
   - Brief title
   - Detailed explanation
   - Intended interactions
   - Logic flow
   - Dependencies
   - Related files
   - Related comment numbers

**Success Criteria:**
- Understanding of breadcrumb requirements confirmed
- Ready to add comments systematically

---

### Step 4.2: Add Breadcrumb Comments to Infrastructure Files

**Objective:** Add breadcrumb comments to shared infrastructure files (start with Comment 001).

**Files to Comment:**
1. **Database Connection:**
   - `src/renderer/shared/storage/database.ts`
   - Comment 001: SQLite database connection and initialization

2. **File System Utilities:**
   - `src/renderer/shared/storage/file-system.ts`
   - Comment 002: File system operations and utilities

3. **Error Handling:**
   - `src/renderer/shared/types/result.types.ts`
   - Comment 003: Result<T, E> type for error handling

4. **Storage Helpers:**
   - `src/renderer/shared/storage/storage-helpers.ts`
   - Comment 004: Common storage helper functions

**Comment Template for Infrastructure:**
```
// Comment XXX: [Feature Name] - [Purpose]
// This [file/function] will handle [what it does].
// It [how it works] and [why it exists].
//
// Intended Interactions:
// - Used by: [list of files that will use this]
// - Uses: [list of dependencies]
//
// Logic Flow:
// [Step-by-step process]
//
// Dependencies:
// - [dependency 1]
// - [dependency 2]
//
// Related Files:
// - [related file 1]
// - [related file 2]
//
// Related Comments:
// - Comment XXX ([relationship description])
```

**Success Criteria:**
- All infrastructure files have breadcrumb comments
- Comments registered in comment directory
- Comments explain intended implementation clearly

---

### Step 4.3: Add Breadcrumb Comments to Notes Feature

**Objective:** Add comprehensive breadcrumb comments to all Notes feature files.

**Comment Strategy:**
- Use Comment 010-099 range for Notes feature (core feature)
- Comment 010: Note service (main entry point)
- Comment 011: Note storage (file system)
- Comment 012: Note storage (database)
- Comment 013: Note editor component
- Comment 014: Auto-save functionality
- Comment 015: File import/export
- Continue sequentially for all Notes feature files

**Files to Comment (with example comment numbers):**
1. `note-service.ts` - Comment 010
2. `note-file-storage.ts` - Comment 011
3. `note-database-storage.ts` - Comment 012
4. `NoteEditor.tsx` - Comment 013
5. `useAutoSave.ts` - Comment 014
6. `file-import-service.ts` - Comment 015
7. Continue for all Notes feature files...

**Breadcrumb Comment Requirements:**
Each comment must explain:
- How Notes feature will work
- Integration with Tiptap editor
- File system storage (Tiptap JSON)
- Database metadata storage
- Auto-save strategy
- File import/export capabilities
- Integration with other features (metadata, branches, versions, hierarchy)

**Success Criteria:**
- All Notes feature files have breadcrumb comments
- Comments explain complete Notes feature implementation
- Comments registered in comment directory
- Bi-directional relationships documented

---

### Step 4.4: Add Breadcrumb Comments to Calendar Feature

**Objective:** Add comprehensive breadcrumb comments to all Calendar feature files.

**Comment Strategy:**
- Use Comment 100-199 range for Calendar feature
- Comment 100: Calendar service
- Comment 101: Calendar storage
- Comment 102: Calendar view component
- Continue sequentially...

**Breadcrumb Comment Requirements:**
Each comment must explain:
- Calendar event management
- Integration with reminders
- Multiple view types (month, week, day)
- Recurrence patterns
- Date filtering and querying
- Integration with notes (notes by date)

**Success Criteria:**
- All Calendar feature files have breadcrumb comments
- Comments explain complete Calendar feature implementation
- Comments registered in comment directory

---

### Step 4.5: Add Breadcrumb Comments to To-Do List Feature

**Objective:** Add comprehensive breadcrumb comments to all To-Do List feature files.

**Comment Strategy:**
- Use Comment 200-299 range for To-Do List feature
- Comment 200: Todo service
- Comment 201: Todo storage
- Comment 202: Todo list component
- Continue sequentially...

**Breadcrumb Comment Requirements:**
Each comment must explain:
- Todo item management
- Due dates and Do dates
- Priority levels
- Integration with notes (checkbox lists in documents)
- Standalone Do/Due tab functionality

**Success Criteria:**
- All To-Do List feature files have breadcrumb comments
- Comments explain complete To-Do List feature implementation
- Comments registered in comment directory

---

### Step 4.6: Add Breadcrumb Comments to Alarm/Timer Feature

**Objective:** Add comprehensive breadcrumb comments to all Alarm/Timer feature files.

**Comment Strategy:**
- Use Comment 300-399 range for Alarm/Timer feature
- Comment 300: Timer service
- Comment 301: Alarm service
- Comment 302: Reminder service
- Comment 303: Tauri scheduler (background execution)
- Continue sequentially...

**Breadcrumb Comment Requirements:**
Each comment must explain:
- Timer functionality (countdown, count-up)
- Alarm scheduling and delivery
- Reminder integration with notes and calendar
- Background execution (Tauri scheduler)
- System notifications
- Integration points (notes, calendar)

**Success Criteria:**
- All Alarm/Timer feature files have breadcrumb comments
- Tauri scheduler file has breadcrumb comments
- Comments explain complete Alarm/Timer feature implementation
- Comments registered in comment directory

---

### Step 4.7: Add Breadcrumb Comments to Metadata Feature

**Objective:** Add comprehensive breadcrumb comments to all Metadata feature files.

**Comment Strategy:**
- Use Comment 400-499 range for Metadata feature
- Comment 400: Metadata service
- Comment 401: Tag service
- Comment 402: Project service
- Comment 403: Unified metadata search
- Continue sequentially...

**Breadcrumb Comment Requirements:**
Each comment must explain:
- Tag management
- Project/category management
- Document numbering system
- Unified metadata search across all sources
- Contextual UI (menu, search bar, standalone tab)
- Integration with all features (notes, calendar, todos, etc.)

**Success Criteria:**
- All Metadata feature files have breadcrumb comments
- Comments explain complete Metadata feature implementation
- Comments registered in comment directory

---

### Step 4.8: Add Breadcrumb Comments to Branched Notes Feature

**Objective:** Add comprehensive breadcrumb comments to all Branched Notes feature files.

**Comment Strategy:**
- Use Comment 500-599 range for Branched Notes feature
- Comment 500: Branch service
- Comment 501: Branch storage
- Comment 502: Branch tree component
- Comment 503: Branch merge service
- Continue sequentially...

**Breadcrumb Comment Requirements:**
Each comment must explain:
- Branch creation from any point
- Branch independence
- Context preservation
- Multiple branches from same point
- Branch navigation
- Branch merge strategies
- Integration with notes editor
- Storage efficiency (delta compression, reference-based)

**Success Criteria:**
- All Branched Notes feature files have breadcrumb comments
- Comments explain complete Branched Notes feature implementation
- Comments registered in comment directory

---

### Step 4.9: Add Breadcrumb Comments to Historical Timelines Feature

**Objective:** Add comprehensive breadcrumb comments to all Historical Timelines feature files.

**Comment Strategy:**
- Use Comment 600-699 range for Historical Timelines feature
- Comment 600: Version service
- Comment 601: Timeline service
- Comment 602: Version storage
- Comment 603: Revert dialog (Create Branch vs Revert Entirely)
- Continue sequentially...

**Breadcrumb Comment Requirements:**
Each comment must explain:
- Non-destructive history preservation
- Timeline visualization
- Version navigation
- Branching from history
- User choice mechanism (Create Branch vs Revert Entirely)
- Storage strategy (snapshots, deltas)
- Integration with notes editor

**Success Criteria:**
- All Historical Timelines feature files have breadcrumb comments
- Comments explain complete Historical Timelines feature implementation
- Comments registered in comment directory

---

### Step 4.10: Add Breadcrumb Comments to Hierarchical Notes Feature

**Objective:** Add comprehensive breadcrumb comments to all Hierarchical Notes feature files.

**Comment Strategy:**
- Use Comment 700-799 range for Hierarchical Notes feature
- Comment 700: Hierarchy service
- Comment 701: Hierarchy queries (recursive CTEs)
- Comment 702: Note tree component
- Continue sequentially...

**Breadcrumb Comment Requirements:**
Each comment must explain:
- Adjacency List Model implementation
- Parent-child relationships
- Recursive queries (ancestors, descendants)
- Tree visualization
- Integration with dashboard
- Hierarchy operations (move, copy, delete)
- Performance considerations

**Success Criteria:**
- All Hierarchical Notes feature files have breadcrumb comments
- Comments explain complete Hierarchical Notes feature implementation
- Comments registered in comment directory

---

### Step 4.11: Add Breadcrumb Comments to File Import/Export Feature

**Objective:** Add comprehensive breadcrumb comments to all File Import/Export feature files.

**Comment Strategy:**
- Use Comment 800-899 range for File Import/Export feature
- Comment 800: File import service
- Comment 801: File export service
- Comment 802: DOCX parser
- Comment 803: PDF parser
- Continue sequentially...

**Breadcrumb Comment Requirements:**
Each comment must explain:
- File format support (DOCX, PDF, Markdown, HTML)
- Import workflow
- Export workflow
- Format conversion
- Integration with doc editor, calendar, reminders
- Format preservation

**Success Criteria:**
- All File Import/Export feature files have breadcrumb comments
- Comments explain complete File Import/Export feature implementation
- Comments registered in comment directory

---

### Step 4.12: Add Breadcrumb Comments to Dashboard Feature

**Objective:** Add comprehensive breadcrumb comments to all Dashboard feature files.

**Comment Strategy:**
- Use Comment 900-999 range for Dashboard feature
- Comment 900: Dashboard service
- Comment 901: Dashboard layout
- Comment 902: Recent notes display
- Continue sequentially...

**Breadcrumb Comment Requirements:**
Each comment must explain:
- Dashboard as default home page
- Integration with hierarchical notes
- Recent notes display
- Quick actions
- Search functionality
- Note preview
- Integration with all features

**Success Criteria:**
- All Dashboard feature files have breadcrumb comments
- Comments explain complete Dashboard feature implementation
- Comments registered in comment directory

---

### Step 4.13: Add Breadcrumb Comments to Shared Resources

**Objective:** Add breadcrumb comments to shared components, services, utilities, and hooks.

**Comment Strategy:**
- Continue sequential numbering from infrastructure comments
- Document how shared resources support all features

**Breadcrumb Comment Requirements:**
Each comment must explain:
- How shared resource supports features
- Integration points
- Reusability
- Dependencies

**Success Criteria:**
- All shared resource files have breadcrumb comments
- Comments explain how shared resources support features
- Comments registered in comment directory

---

### Step 4.14: Add Breadcrumb Comments to Stores and Contexts

**Objective:** Add breadcrumb comments to Zustand stores and React Contexts.

**Comment Strategy:**
- Document state management approach
- Explain which features use which stores/contexts
- Document data flow

**Breadcrumb Comment Requirements:**
Each comment must explain:
- What state is managed
- Which features use this store/context
- How state flows through application
- Integration with services

**Success Criteria:**
- All store and context files have breadcrumb comments
- Comments explain state management approach
- Comments registered in comment directory

---

### Step 4.15: Add Breadcrumb Comments to Tauri Main Process

**Objective:** Add breadcrumb comments to Rust backend files.

**Comment Strategy:**
- Document Tauri commands
- Document file system operations
- Document background scheduler
- Document database operations

**Breadcrumb Comment Requirements:**
Each comment must explain:
- Tauri command purpose
- IPC communication
- File system operations
- Background task execution
- Database operations

**Success Criteria:**
- All Tauri main process files have breadcrumb comments
- Comments explain backend functionality
- Comments registered in comment directory

---

## Phase 5: Comment Directory Creation

### Step 5.1: Create Comment Directory File

**Objective:** Create the `00_Comment_Directory.md` file to track all comments.

**File Location:** `00_Comment_Directory.md` (top level directory)

**File Structure:**
```markdown
# Comment Directory

> **Note:** This directory maintains a registry of all numbered comments in the codebase.

**Last Updated:** [Date]
**Total Comments:** [Count]

---

## Comment 001
- **File:** [full file path]
- **Location:** [function/class/method name]
- **Purpose:** [brief purpose]
- **Related:** Comment XXX ([relationship]), Comment YYY ([relationship])
- **Description:** [detailed description]

## Comment 002
...
```

**Initial Entries:**
- Add entries for all comments created in Phase 4
- Organize by comment number
- Include all required information

**Success Criteria:**
- Comment directory file created
- All comments from Phase 4 registered
- Directory is complete and accurate

---

### Step 5.2: Verify Comment Directory Completeness

**Objective:** Ensure all breadcrumb comments are registered in the comment directory.

**Verification Steps:**
1. Search codebase for all "Comment XXX" patterns
2. Verify each comment is registered in comment directory
3. Verify all relationships are documented
4. Verify file paths are correct
5. Verify comment numbers are sequential (no gaps, no duplicates)

**Success Criteria:**
- All comments registered
- No missing comments
- No duplicate comment numbers
- All relationships documented
- Comment directory is complete

---

## Phase 6: Database Schema Creation

### Step 6.1: Create Database Schema File

**Objective:** Create SQLite database schema with all required tables.

**File Location:** `src/renderer/shared/storage/schema.sql`

**Schema to Create:**
Based on archived architecture documents (Adjacency List Model - fully integrated into this plan):

1. **Notes Table:**
   - document_id (TEXT PRIMARY KEY)
   - parent_id (TEXT, FOREIGN KEY)
   - title (TEXT)
   - created_at (DATETIME)
   - modified_at (DATETIME)
   - file_path (TEXT)

2. **Tags Table:**
   - id (INTEGER PRIMARY KEY)
   - name (TEXT UNIQUE)
   - created_at (DATETIME)

3. **Note-Tag Relationship:**
   - note_id (TEXT, FOREIGN KEY)
   - tag_id (INTEGER, FOREIGN KEY)
   - PRIMARY KEY (note_id, tag_id)

4. **Projects Table:**
   - id (INTEGER PRIMARY KEY)
   - name (TEXT UNIQUE)
   - created_at (DATETIME)

5. **Note-Project Relationship:**
   - note_id (TEXT, FOREIGN KEY)
   - project_id (INTEGER, FOREIGN KEY)
   - PRIMARY KEY (note_id, project_id)

6. **Reminders Table:**
   - id (INTEGER PRIMARY KEY)
   - note_id (TEXT, FOREIGN KEY)
   - due_date (DATETIME)
   - do_date (DATETIME)
   - created_at (DATETIME)

7. **Timers Table:**
   - id (INTEGER PRIMARY KEY)
   - note_id (TEXT, FOREIGN KEY)
   - duration (INTEGER)
   - started_at (DATETIME)
   - paused_at (DATETIME)

8. **Alarms Table:**
   - id (INTEGER PRIMARY KEY)
   - note_id (TEXT, FOREIGN KEY)
   - alarm_time (DATETIME)
   - recurring (TEXT)
   - enabled (BOOLEAN)

9. **Calendar Events Table:**
   - id (INTEGER PRIMARY KEY)
   - title (TEXT)
   - event_date (DATETIME)
   - event_type (TEXT) -- 'one-time', 'recurring', 'all-day'
   - recurrence_pattern (TEXT) -- JSON for recurring events
   - created_at (DATETIME)

10. **Todo Items Table:**
    - id (INTEGER PRIMARY KEY)
    - title (TEXT)
    - due_date (DATETIME)
    - do_date (DATETIME)
    - completed (BOOLEAN)
    - priority (TEXT)
    - created_at (DATETIME)

11. **Branches Table:**
    - id (INTEGER PRIMARY KEY)
    - note_id (TEXT, FOREIGN KEY)
    - parent_branch_id (INTEGER, FOREIGN KEY)
    - branch_point (TEXT) -- position in document
    - branch_name (TEXT)
    - created_at (DATETIME)

12. **Versions Table:**
    - id (INTEGER PRIMARY KEY)
    - note_id (TEXT, FOREIGN KEY)
    - version_number (INTEGER)
    - content_snapshot (TEXT) -- file path or reference
    - created_at (DATETIME)

13. **Indexes:**
    - CREATE INDEX idx_notes_parent_id ON notes(parent_id);
    - CREATE INDEX idx_notes_created_at ON notes(created_at);
    - CREATE INDEX idx_notes_modified_at ON notes(modified_at);
    - CREATE INDEX idx_reminders_due_date ON reminders(due_date);
    - CREATE INDEX idx_alarms_alarm_time ON alarms(alarm_time);
    - CREATE INDEX idx_calendar_events_date ON calendar_events(event_date);
    - CREATE INDEX idx_todos_due_date ON todos(due_date);

**Success Criteria:**
- Schema file created with all tables
- All foreign keys defined
- All indexes created
- Schema matches architecture document

---

### Step 6.2: Create Database Initialization Code

**Objective:** Create code to initialize database with schema.

**File Location:** `src/renderer/shared/storage/database.ts`

**Implementation:**
- Read schema.sql file
- Execute schema to create tables
- Verify tables created successfully
- Handle errors appropriately

**Breadcrumb Comments:**
- Comment 001: Database connection and initialization
- Comment 002: Schema execution

**Success Criteria:**
- Database initialization code created
- Schema can be executed to create tables
- Error handling implemented

---

## Phase 7: File System Structure Creation

### Step 7.1: Create Data Directory Structure

**Objective:** Create file system directories for note content storage.

**Directories to Create:**
```
data/
├── notes/                    # Note content files (Tiptap JSON)
├── versions/                 # Version snapshots (optional, for historical timelines)
├── branches/                 # Branch content (optional, for branched notes)
└── backups/                  # Backup files
```

**Implementation:**
- Create directories programmatically on app startup
- Use Tauri app data directory
- Handle directory creation errors
- Verify directories exist

**File Naming Convention:**
- Notes: `{document_id}.json`
- Example: `1.0.0_20241201143052.json`

**Breadcrumb Comments:**
- Comment 003: File system directory structure
- Comment 004: File naming conventions

**Success Criteria:**
- All data directories created
- Directories use app data location
- Error handling implemented

---

## Phase 8: Basic Infrastructure Setup

### Step 8.1: Create Error Handling Infrastructure

**Objective:** Set up error handling patterns and utilities.

**Files to Create:**
1. **Result Type:**
   - `src/renderer/shared/types/result.types.ts`
   - Implement Result<T, E> type
   - Comment 003: Result type for error handling

2. **Error Classes:**
   - `src/renderer/shared/utils/errors.ts`
   - Create custom error classes (NoteError, StorageError, etc.)
   - Comment 005: Custom error classes

3. **Error Boundary:**
   - `src/renderer/shared/components/ErrorBoundary.tsx`
   - React error boundary component
   - Comment 006: Error boundary for React components

4. **Global Error Handler:**
   - `src/renderer/shared/utils/error-handler.ts`
   - Global error and unhandled rejection handlers
   - Comment 007: Global error handler

**Success Criteria:**
- Error handling infrastructure created
- Result type implemented
- Custom error classes created
- Error boundary component created
- Global error handler set up

---

### Step 8.2: Create Logging Infrastructure

**Objective:** Set up logging system for development and debugging.

**Files to Create:**
- `src/renderer/shared/utils/logger.ts`
- Logging utility with levels (debug, info, warn, error)
- File logging capability (Tauri app data directory)
- Comment 008: Logging infrastructure

**Success Criteria:**
- Logging utility created
- File logging configured
- Log levels implemented

---

### Step 8.3: Create TypeScript Type Definitions

**Objective:** Create core TypeScript interfaces using DDD pattern.

**Files to Create:**
1. **Core Domain Types:**
   - `src/renderer/shared/types/domain.types.ts`
   - Note, CalendarEvent, TodoItem, Alarm, Timer, etc.
   - Use Domain-Driven Design pattern
   - Use Branded Types for IDs (DocumentId, TagId, etc.)
   - Use Discriminated Unions for variants (CalendarEvent types)

2. **DTO Types:**
   - `src/renderer/shared/types/dto.types.ts`
   - CreateNoteData, UpdateNoteData, etc.

3. **Tiptap Types:**
   - `src/renderer/shared/types/tiptap.types.ts`
   - TiptapJSON type (from Tiptap)

**Breadcrumb Comments:**
- Comment 009: TypeScript type definitions
- Comment 010: Domain model types
- Comment 011: DTO types

**Success Criteria:**
- Core type definitions created
- DDD pattern followed
- Branded types for IDs
- Discriminated unions for variants
- All types properly defined

---

## Known Issues and Solutions

> **Note:** This section documents known challenges and their solutions to prevent rediscovery during implementation.

### Alarm Background Execution

**Issue:** Alarms need to fire reliably even when application is closed or minimized. System-level integration needed for background task execution.

**Selected Solution (Tauri):**
- Use Tauri Rust backend with system notification APIs
- Use system schedulers (cron on Linux/macOS, Task Scheduler on Windows) or native Rust libraries
- Store alarms in SQLite database
- Implement background scheduler in `src-tauri/src/scheduler.rs`

**Implementation Notes:**
- Tauri has better native integration than Electron
- Can use system-level schedulers
- More reliable background execution
- Lower resource usage
- Platform-specific code needed

**Files to Create:**
- `src-tauri/src/scheduler.rs` - Background task scheduler
- Breadcrumb comments should reference this solution

**Reference:** See `Archive_Collection/01_Archived_Implementation_Plans/11_Projected_Issues_And_Research.md` Section 1.1 for detailed research (archived, fully integrated).

---

### File Format Conversion

**Issue:** Converting between file formats (DOCX, PDF, Markdown, HTML) while preserving formatting and structure.

**Selected Solution:**
- Use specialized libraries for each format:
  - DOCX: `mammoth` or `docx` library
  - PDF: `pdf-parse` or `pdfjs-dist`
  - Markdown: `marked` or `remark`
  - HTML: Native DOM parsing
- Convert to Tiptap JSON format for storage
- Handle format-specific features (tables, images, formatting)

**Implementation Notes:**
- Some formatting may be lost during conversion
- Test conversion quality for each format
- Provide user feedback on conversion success/warnings
- Store original format metadata if needed

**Files to Create:**
- `src/renderer/features/file-import/services/docx-parser.ts`
- `src/renderer/features/file-import/services/pdf-parser.ts`
- `src/renderer/features/file-import/services/markdown-converter.ts`
- `src/renderer/features/file-import/services/html-converter.ts`

**Reference:** See `Archive_Collection/01_Archived_Implementation_Plans/11_Projected_Issues_And_Research.md` for detailed research (archived, fully integrated).

---

### Performance Considerations

**Issue:** Application must perform well with large numbers of notes, branches, and versions.

**Selected Solutions:**
- Use SQLite with proper indexes for fast queries
- Implement lazy loading for large lists
- Use virtual scrolling for note lists
- Implement pagination for version history
- Cache frequently accessed data
- Optimize Tiptap JSON parsing

**Implementation Notes:**
- Database indexes created in Phase 6 (Database Schema)
- Lazy loading patterns in breadcrumb comments
- Performance testing during feature implementation

**Reference:** See `Archive_Collection/01_Archived_Implementation_Plans/11_Projected_Issues_And_Research.md` for detailed research (archived, fully integrated).

---

### Cross-Platform Compatibility

**Issue:** Application must work consistently across Windows, macOS, and Linux.

**Selected Solutions:**
- Use Tauri for cross-platform desktop app
- Use CSS Variables for theming (works across platforms)
- Test file system operations on all platforms
- Handle platform-specific paths correctly
- Use Tauri's cross-platform APIs

**Implementation Notes:**
- Tauri handles most cross-platform concerns
- File paths: Use Tauri's path APIs
- System notifications: Use Tauri's notification API
- Test on all platforms during development

**Reference:** See `Archive_Collection/01_Archived_Implementation_Plans/11_Projected_Issues_And_Research.md` for detailed research (archived, fully integrated).

---

## Phase 9: Verification and Completion

### Step 9.1: Breadcrumb System Verification Checklist

**Objective:** Verify the breadcrumb system is 100% complete.

**Verification Checklist:**

1. **All 12 Project Desires Covered:**
   - [ ] Full-Featured Text Editor
   - [ ] Local File Saving
   - [ ] Reminders Attached to Note Files
   - [ ] Save, Open, and Edit Popular File Types
   - [ ] Custom Metadata Association
   - [ ] To-Do Lists Within Notes
   - [ ] Branched Notes
   - [ ] Non-Destructive Historical Timelines
   - [ ] Modern GUI and Features
   - [ ] Hierarchical Notes
   - [ ] Timer
   - [ ] Alarm

2. **All Core Standalone Tabs Covered:**
   - [ ] Main Dashboard
   - [ ] Document Editor (Notes/Docs tab)
   - [ ] Calendar
   - [ ] To-Do List (Do/Due tab)
   - [ ] Alarm/Timer tab
   - [ ] Custom Metadata Association

3. **All Build-Upon Features Covered:**
   - [ ] Save, Open, and Edit Popular File Types
   - [ ] Branched Notes
   - [ ] Non-Destructive Historical Timelines
   - [ ] Hierarchical Notes
   - [ ] To-Do Lists Within Notes (checkbox lists)

4. **All Files Have Breadcrumb Comments:**
   - [ ] All feature files
   - [ ] All shared resource files
   - [ ] All store files
   - [ ] All context files
   - [ ] All Tauri main process files

5. **Comment Directory Complete:**
   - [ ] All comments registered
   - [ ] All relationships documented
   - [ ] All file paths correct
   - [ ] Sequential numbering verified

6. **Infrastructure Complete:**
   - [ ] Database schema created
   - [ ] File system directories created
   - [ ] Error handling set up
   - [ ] Logging set up
   - [ ] Type definitions created

**Success Criteria:**
- All checklist items completed
- Breadcrumb system is 100% complete
- Ready to proceed to `12_Implementation_Plan_02_Breadcrumb_Verification_And_GUI_Foundation.md`

---

### Step 9.2: Final Verification

**Objective:** Final check before proceeding to next plan.

**Final Checks:**
1. Run: `npm run tauri dev` - verify app still builds
2. Verify all placeholder files exist
3. Verify comment directory is complete
4. Verify database schema is correct
5. Verify file system structure is correct
6. Verify no TypeScript errors (basic structure)

**Success Criteria:**
- Application builds successfully
- All files in place
- Breadcrumb system complete
- Ready for `12_Implementation_Plan_02_Breadcrumb_Verification_And_GUI_Foundation.md`

---

## Summary

**Implementation Plan 01** establishes:
1. ✅ Complete Tauri project setup
2. ✅ Complete directory structure (all features)
3. ✅ All placeholder files for all 12 Project Desires
4. ✅ Complete breadcrumb comment system
5. ✅ Complete comment directory
6. ✅ Database schema (empty tables)
7. ✅ File system data directories
8. ✅ Basic infrastructure (error handling, logging, types)

**Critical Achievement:**
- **100% Complete Breadcrumb System** - Every planned feature is mapped with breadcrumb comments showing exactly where and how it will be implemented.

**Next Step:**
- Proceed to **`12_Implementation_Plan_02_Breadcrumb_Verification_And_GUI_Foundation.md`**

---

**Document Status:** Ready for Implementation  
**Last Updated:** 2024  
**Estimated Time:** 4-6 hours for complete setup

