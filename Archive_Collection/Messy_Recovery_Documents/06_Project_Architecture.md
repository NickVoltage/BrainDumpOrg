# Project Architecture

> **Note:** This document defines the complete architecture for the note-taking application, including structure, patterns, integration points, and implementation guidelines.

**Document Purpose:** Comprehensive architecture guide for implementation.

**Related Documents:**
- `03_Project_Planning.md` - Planning context and tech stack
- `04_Proposed_Selections_From_Project_Planning.md` - Technology decisions
- `05_Projected_Issues_And_Research.md` - Solutions to challenges
- `00_AI_ReadME_Project_Guidance_And_Rules.md` - Development rules

**Last Updated:** 2024  
**Status:** Architecture Definition Complete

---

## 1. Architecture Overview

### 1.1 Core Principles

**Primary Goals:**
1. **Easily and Highly Customizable GUI Development Experience**
2. **Functional Prototype Approach (User-Driven Development)**
3. **Easily Maintainable Codebase That's Feature-Packed**

**Architecture Patterns:**
- **Feature-Based Organization** - Each feature is an independent module
- **Layered Architecture** - Clear separation: Presentation → Application → Domain → Infrastructure
- **Component-Based** - Modular, reusable UI components
- **Service-Oriented** - Business logic in service layer
- **Hybrid Storage** - File system for content, SQLite for metadata
- **Hybrid State Management** - React Context for UI, Zustand for data

**Key Design Decisions:**
- Start simple, add complexity as needed (prototype approach)
- Right tool for each job (hybrid patterns)
- Feature independence (can develop/test features separately)
- Clear boundaries (easy to understand and modify)

---

### 1.2 Architecture Layers

```
┌─────────────────────────────────────────┐
│     Presentation Layer (React UI)      │
│  - Components, Hooks, Context (UI)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    Application Layer (Services)        │
│  - Business Logic, State (Zustand)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Domain Layer (Models/Types)       │
│  - Data Models, Type Definitions       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   Infrastructure Layer (Storage/I/O)        │
│  - File System, SQLite, External APIs   │
└─────────────────────────────────────────┘
```

**Layer Responsibilities:**
- **Presentation:** UI rendering, user interactions, visual feedback
- **Application:** Business logic, state management, coordination
- **Domain:** Data models, types, business rules
- **Infrastructure:** Data persistence, file I/O, external services

**Dependency Direction:** Dependencies point inward (Infrastructure → Domain → Application → Presentation)

---

## 2. Project Structure

### 2.1 Root Structure

```
note-app/
├── 00_Project_Guidance/              # Project documentation
│   ├── 00_AI_ReadME_Project_Guidance_And_Rules.md
│   ├── 00_Codebase_Comments_Guidelines.md
│   ├── 00_Project_Desires.md
│   └── [other guidance docs]
│
├── src/
│   ├── main/                          # Tauri main process (Rust)
│   │   ├── main.rs
│   │   ├── commands.rs                # Tauri commands
│   │   ├── storage.rs                 # File system operations
│   │   └── scheduler.rs               # Background tasks (alarms)
│   │
│   ├── renderer/                       # Frontend (TypeScript/React)
│   │   ├── features/                  # Feature-based modules
│   │   ├── shared/                    # Shared across features
│   │   ├── stores/                    # Zustand stores
│   │   ├── contexts/                  # React Context
│   │   ├── config/                    # Configuration
│   │   └── App.tsx                    # Main app component
│   │
│   ├── tests/                         # Test files
│   └── assets/                        # Static assets
│
├── docs/                              # Additional documentation
├── 00_Project_Desires.md
├── 01_Project_Research_Agenda.md
├── 01_Research_*.md
├── 02_Dev_Best_Practices_Research.md
├── 03_Project_Planning.md
├── 04_Proposed_Selections_From_Project_Planning.md
├── 05_Projected_Issues_And_Research.md
├── 06_Project_Architecture.md          # This document
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

### 2.2 Feature-Based Structure

**Each feature follows this structure:**

```
src/renderer/features/
├── notes/                              # Notes feature
│   ├── components/                     # UI components
│   │   ├── NoteEditor.tsx
│   │   ├── NoteList.tsx
│   │   ├── NoteTree.tsx               # Hierarchical view
│   │   └── NoteMetadataPanel.tsx
│   │
│   ├── services/                      # Business logic
│   │   ├── note-service.ts            # Note operations
│   │   ├── hierarchy-service.ts       # Parent-child relationships
│   │   └── version-service.ts         # Historical timelines
│   │
│   ├── storage/                        # Data persistence
│   │   ├── note-file-storage.ts       # File system operations
│   │   ├── note-database-storage.ts   # SQLite operations
│   │   └── note-storage-interface.ts  # Storage abstraction
│   │
│   ├── hooks/                          # React hooks
│   │   ├── useNote.ts
│   │   ├── useNoteHierarchy.ts
│   │   └── useNoteVersions.ts
│   │
│   ├── stores/                         # Zustand stores (if feature-specific)
│   │   └── note-store.ts
│   │
│   ├── types.ts                        # TypeScript types
│   └── index.ts                        # Public exports
│
├── timers/                             # Timer feature
│   ├── components/
│   │   ├── TimerDisplay.tsx
│   │   ├── TimerControls.tsx
│   │   └── TimerList.tsx
│   ├── services/
│   │   └── timer-service.ts
│   ├── storage/
│   │   └── timer-storage.ts
│   ├── hooks/
│   │   └── useTimer.ts
│   ├── types.ts
│   └── index.ts
│
├── alarms/                             # Alarm feature
│   ├── components/
│   │   ├── AlarmEditor.tsx
│   │   ├── AlarmList.tsx
│   │   └── AlarmNotification.tsx
│   ├── services/
│   │   └── alarm-service.ts
│   ├── storage/
│   │   └── alarm-storage.ts
│   ├── hooks/
│   │   └── useAlarm.ts
│   ├── types.ts
│   └── index.ts
│
├── branches/                           # Branched notes feature
│   ├── components/
│   │   ├── BranchTree.tsx
│   │   ├── BranchSelector.tsx
│   │   └── BranchCreator.tsx
│   ├── services/
│   │   ├── branch-service.ts
│   │   └── branch-merge-service.ts
│   ├── storage/
│   │   └── branch-storage.ts
│   ├── hooks/
│   │   └── useBranch.ts
│   ├── types.ts
│   └── index.ts
│
├── reminders/                          # Reminders feature
│   ├── components/
│   │   ├── ReminderEditor.tsx
│   │   └── ReminderList.tsx
│   ├── services/
│   │   └── reminder-service.ts
│   ├── storage/
│   │   └── reminder-storage.ts
│   ├── hooks/
│   │   └── useReminder.ts
│   ├── types.ts
│   └── index.ts
│
└── calendar/                           # Calendar feature (modular)
    ├── components/
    │   ├── CalendarView.tsx
    │   ├── CalendarMonth.tsx
    │   └── CalendarEvent.tsx
    ├── services/
    │   └── calendar-service.ts
    ├── storage/
    │   └── calendar-storage.ts
    ├── hooks/
    │   └── useCalendar.ts
    ├── types.ts
    └── index.ts
```

**Feature Module Principles:**
- **Self-contained:** Each feature has everything it needs
- **Independent:** Can be developed/tested separately
- **Composable:** Features can work together
- **Clear boundaries:** Well-defined interfaces

---

### 2.3 Shared Resources

```
src/renderer/shared/
├── components/                         # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Sidebar.tsx
│   └── Toolbar.tsx
│
├── services/                          # Cross-feature services
│   ├── file-service.ts                # File operations
│   ├── search-service.ts              # Full-text search
│   └── notification-service.ts       # System notifications
│
├── storage/                           # Shared storage utilities
│   ├── database.ts                    # SQLite connection
│   ├── file-system.ts                # File system utilities
│   └── storage-helpers.ts            # Common storage functions
│
├── utils/                             # Utility functions
│   ├── date-utils.ts
│   ├── string-utils.ts
│   ├── validation.ts
│   └── diff-utils.ts
│
├── hooks/                             # Shared React hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useTheme.ts
│
└── types/                             # Shared types
    ├── common.types.ts
    └── api.types.ts
```

---

### 2.4 State Management Structure

```
src/renderer/
├── stores/                            # Zustand stores (business state)
│   ├── note-store.ts                 # Notes collection state
│   ├── timer-store.ts                # Timers state
│   ├── alarm-store.ts               # Alarms state
│   ├── branch-store.ts              # Branches state
│   └── ui-store.ts                  # UI preferences
│
└── contexts/                          # React Context (UI state)
    ├── EditorContext.tsx            # Current editor state
    ├── ThemeContext.tsx             # Theme state
    └── NavigationContext.tsx        # Navigation state
```

**State Management Strategy:**
- **Zustand:** Business data (notes, timers, alarms, branches)
- **React Context:** UI state (current note, theme, navigation)
- **Component State:** Local UI state (form inputs, temporary state)

---

### 2.5 Configuration Structure

```
src/renderer/config/
├── themes.ts                          # Theme definitions
├── settings.ts                        # App settings
├── constants.ts                         # App constants
└── theme-config.json                 # User-customizable theme
```

---

## 3. Data Architecture

### 3.1 Storage Strategy

**Hybrid Storage Pattern (RECOMMENDED):**

```
┌─────────────────────────────────────┐
│         Note Content                │
│  File System: notes/{docId}.json    │
│  Format: Tiptap JSON or Markdown    │
└──────────────┬──────────────────────┘
               │
               │ Linked by document_id
               │
┌──────────────▼──────────────────────┐
│         Metadata                    │
│  SQLite: notes table                │
│  Columns: document_id, parent_id,   │
│           tags, reminders, etc.     │
└─────────────────────────────────────┘
```

**Storage Locations:**
- **Content Files:** `data/notes/{documentId}.json` or `.md`
- **SQLite Database:** `data/app.db`
- **Metadata:** All in SQLite `notes` table

**Document ID Format:**
- Pattern: `{app_version}_{timestamp}`
- Example: `1.0.0_20241201143052`
- Used as: Primary key in DB, filename in file system

---

### 3.2 Database Schema

**Core Tables:**

```sql
-- Notes table (metadata)
CREATE TABLE notes (
    document_id TEXT PRIMARY KEY,
    parent_id TEXT,
    title TEXT,
    created_at DATETIME,
    modified_at DATETIME,
    file_path TEXT,
    FOREIGN KEY (parent_id) REFERENCES notes(document_id)
);

-- Tags table
CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    created_at DATETIME
);

-- Note-Tag relationship
CREATE TABLE note_tags (
    note_id TEXT,
    tag_id INTEGER,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(document_id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Projects table
CREATE TABLE projects (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    created_at DATETIME
);

-- Note-Project relationship
CREATE TABLE note_projects (
    note_id TEXT,
    project_id INTEGER,
    PRIMARY KEY (note_id, project_id),
    FOREIGN KEY (note_id) REFERENCES notes(document_id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Reminders table
CREATE TABLE reminders (
    id INTEGER PRIMARY KEY,
    note_id TEXT,
    due_date DATETIME,
    do_date DATETIME,
    created_at DATETIME,
    FOREIGN KEY (note_id) REFERENCES notes(document_id)
);

-- Timers table
CREATE TABLE timers (
    id INTEGER PRIMARY KEY,
    note_id TEXT,
    duration INTEGER,
    started_at DATETIME,
    paused_at DATETIME,
    FOREIGN KEY (note_id) REFERENCES notes(document_id)
);

-- Alarms table
CREATE TABLE alarms (
    id INTEGER PRIMARY KEY,
    note_id TEXT,
    alarm_time DATETIME,
    recurring TEXT,
    enabled BOOLEAN,
    FOREIGN KEY (note_id) REFERENCES notes(document_id)
);

-- Branches table
CREATE TABLE branches (
    id INTEGER PRIMARY KEY,
    note_id TEXT,
    parent_branch_id INTEGER,
    branch_point TEXT,
    created_at DATETIME,
    FOREIGN KEY (note_id) REFERENCES notes(document_id),
    FOREIGN KEY (parent_branch_id) REFERENCES branches(id)
);

-- Versions table (historical timelines)
CREATE TABLE versions (
    id INTEGER PRIMARY KEY,
    note_id TEXT,
    version_number INTEGER,
    content_snapshot TEXT,
    created_at DATETIME,
    FOREIGN KEY (note_id) REFERENCES notes(document_id)
);
```

**Hierarchical Notes Pattern:**
- **Adjacency List Model:** `parent_id` references `document_id`
- **Query Children:** `SELECT * FROM notes WHERE parent_id = ?`
- **Query Ancestors:** Use recursive CTE (WITH RECURSIVE)
- **Query Descendants:** Use recursive CTE

---

### 3.3 File System Structure

```
data/
├── notes/                             # Note content files
│   ├── 1.0.0_20241201143052.json
│   ├── 1.0.0_20241201144530.json
│   └── ...
│
├── versions/                          # Version snapshots (optional)
│   └── [note_id]/
│       ├── v1.json
│       ├── v2.json
│       └── ...
│
├── branches/                          # Branch content (optional)
│   └── [branch_id]/
│       └── content.json
│
└── app.db                             # SQLite database
```

---

## 4. Integration Patterns

### 4.1 Tiptap Integration

**Pattern: Editor Content + Separate Metadata Storage**

```typescript
// Save note
const saveNote = async (noteId: string, editor: Editor) => {
  // 1. Get content from Tiptap
  const content = editor.getJSON();
  
  // 2. Save content to file system
  await fileStorage.saveNote(noteId, JSON.stringify(content));
  
  // 3. Update metadata in SQLite
  await database.updateNoteMetadata(noteId, {
    modified_at: new Date(),
    // ... other metadata
  });
};

// Load note
const loadNote = async (noteId: string, editor: Editor) => {
  // 1. Load content from file system
  const content = await fileStorage.loadNote(noteId);
  
  // 2. Load metadata from SQLite
  const metadata = await database.getNoteMetadata(noteId);
  
  // 3. Set content in Tiptap
  editor.setContent(JSON.parse(content));
  
  return { content, metadata };
};
```

**Key Points:**
- Tiptap handles content editing only
- Metadata stored separately in SQLite
- Linked via `document_id`
- Clear separation of concerns

---

### 4.2 State Management Integration

**Pattern: Hybrid State Management**

```typescript
// Zustand store (business data)
const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  currentNoteId: null,
  loadNotes: async () => {
    const notes = await noteService.getAll();
    set({ notes });
  },
  // ...
}));

// React Context (UI state)
const EditorContext = createContext<EditorState>({
  editor: null,
  isDirty: false,
  // ...
});

// Usage in component
const MyComponent = () => {
  // Business data from Zustand
  const { notes, loadNotes } = useNoteStore();
  
  // UI state from Context
  const { editor, isDirty } = useContext(EditorContext);
  
  // Local state for component
  const [isOpen, setIsOpen] = useState(false);
  
  // ...
};
```

**State Management Rules:**
- **Zustand:** Notes collection, timers, alarms, branches
- **Context:** Current editor, theme, navigation
- **useState:** Component-specific UI state

---

### 4.3 Storage Integration

**Pattern: Storage Abstraction Layer**

```typescript
// Storage interface
interface NoteStorage {
  saveContent(noteId: string, content: string): Promise<void>;
  loadContent(noteId: string): Promise<string>;
  saveMetadata(noteId: string, metadata: NoteMetadata): Promise<void>;
  loadMetadata(noteId: string): Promise<NoteMetadata>;
}

// Implementation
class HybridNoteStorage implements NoteStorage {
  async saveContent(noteId: string, content: string) {
    // Save to file system
    await fileSystem.writeFile(`notes/${noteId}.json`, content);
  }
  
  async loadContent(noteId: string) {
    // Load from file system
    return await fileSystem.readFile(`notes/${noteId}.json`);
  }
  
  async saveMetadata(noteId: string, metadata: NoteMetadata) {
    // Save to SQLite
    await database.updateNote(noteId, metadata);
  }
  
  async loadMetadata(noteId: string) {
    // Load from SQLite
    return await database.getNote(noteId);
  }
}
```

**Benefits:**
- Can swap storage implementations
- Easy to test (mock storage)
- Clear interface
- Single responsibility

---

### 4.4 Feature Integration

**Pattern: Feature Communication via Services**

```typescript
// Notes feature
const noteService = {
  createNote: async (data) => { /* ... */ },
  // ...
};

// Timers feature
const timerService = {
  createTimer: async (noteId, duration) => {
    // Can access note service if needed
    const note = await noteService.getNote(noteId);
    // Create timer linked to note
    // ...
  },
  // ...
};

// Alarms feature
const alarmService = {
  createAlarm: async (noteId, alarmTime) => {
    // Can access note service if needed
    const note = await noteService.getNote(noteId);
    // Create alarm linked to note
    // ...
  },
  // ...
};
```

**Integration Rules:**
- Features communicate via services
- No direct component-to-component communication
- Services can call other services
- Clear dependency direction

---

## 5. Data Flow

### 5.1 Note Creation Flow

```
User Action (Create Note)
    ↓
Component Event Handler
    ↓
NoteService.createNote()
    ↓
┌─────────────────────────┐
│ 1. Generate document_id │
│ 2. Create file (empty)  │
│ 3. Insert DB record     │
└─────────────────────────┘
    ↓
Update Zustand Store
    ↓
Update React Context (current note)
    ↓
UI Re-renders
```

---

### 5.2 Note Editing Flow

```
User Types in Editor
    ↓
Tiptap Editor Updates
    ↓
Editor Context Updates (isDirty = true)
    ↓
Auto-save Trigger (debounced)
    ↓
NoteService.saveNote()
    ↓
┌─────────────────────────┐
│ 1. Get content (JSON)   │
│ 2. Save to file system  │
│ 3. Update DB metadata   │
└─────────────────────────┘
    ↓
Update Zustand Store
    ↓
Editor Context Updates (isDirty = false)
```

---

### 5.3 Hierarchical Notes Flow

```
User Creates Child Note
    ↓
NoteService.createChildNote(parentId)
    ↓
┌─────────────────────────┐
│ 1. Generate document_id │
│ 2. Create file         │
│ 3. Insert DB (parent_id)│
└─────────────────────────┘
    ↓
HierarchyService.updateTree()
    ↓
Update Zustand Store (note tree)
    ↓
UI Re-renders (tree view)
```

---

### 5.4 Alarm Trigger Flow

```
Background Scheduler (node-schedule)
    ↓
Check SQLite for due alarms
    ↓
AlarmService.triggerAlarm(alarmId)
    ↓
┌─────────────────────────┐
│ 1. Get alarm data       │
│ 2. Get associated note │
│ 3. Show notification    │
└─────────────────────────┘
    ↓
System Notification API
    ↓
User sees notification
```

---

## 6. Feature Module Template

### 6.1 Standard Feature Structure

**Every feature should follow this structure:**

```
feature-name/
├── components/          # UI components (Presentation)
├── services/           # Business logic (Application)
├── storage/            # Data persistence (Infrastructure)
├── hooks/              # React hooks (Presentation)
├── stores/             # Zustand stores (if needed)
├── types.ts            # TypeScript types (Domain)
└── index.ts            # Public exports
```

---

### 6.2 Feature Module Example

**Example: Timer Feature**

```typescript
// types.ts
export interface Timer {
  id: string;
  noteId: string;
  duration: number;
  startedAt: Date;
  pausedAt?: Date;
}

// services/timer-service.ts
export class TimerService {
  async createTimer(noteId: string, duration: number): Promise<Timer> {
    // Business logic
    const timer = await timerStorage.create({ noteId, duration });
    return timer;
  }
  
  async startTimer(timerId: string): Promise<void> {
    // Business logic
    await timerStorage.update(timerId, { startedAt: new Date() });
  }
}

// storage/timer-storage.ts
export class TimerStorage {
  async create(data: CreateTimerData): Promise<Timer> {
    // SQLite operations
    // ...
  }
}

// hooks/useTimer.ts
export function useTimer(timerId: string) {
  const timer = useTimerStore((state) => state.timers[timerId]);
  const startTimer = useTimerStore((state) => state.startTimer);
  
  return { timer, startTimer };
}

// components/TimerDisplay.tsx
export function TimerDisplay({ timerId }: Props) {
  const { timer, startTimer } = useTimer(timerId);
  
  return (
    <div>
      {/* UI */}
    </div>
  );
}

// index.ts
export { TimerService } from './services/timer-service';
export { useTimer } from './hooks/useTimer';
export { TimerDisplay } from './components/TimerDisplay';
export type { Timer } from './types';
```

---

## 7. Technology Integration

### 7.1 Tiptap Integration

**Setup:**
```typescript
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const editor = useEditor({
  extensions: [StarterKit],
  content: '',
  onUpdate: ({ editor }) => {
    // Auto-save logic
  },
});
```

**Save/Load:**
```typescript
// Save
const content = editor.getJSON();
await saveNoteContent(noteId, JSON.stringify(content));

// Load
const content = await loadNoteContent(noteId);
editor.setContent(JSON.parse(content));
```

---

### 7.2 SQLite Integration

**Setup:**
```typescript
import Database from 'better-sqlite3';

const db = new Database('data/app.db');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    document_id TEXT PRIMARY KEY,
    -- ...
  )
`);
```

**Operations:**
```typescript
// Insert
const stmt = db.prepare('INSERT INTO notes (document_id, title) VALUES (?, ?)');
stmt.run(documentId, title);

// Query
const stmt = db.prepare('SELECT * FROM notes WHERE document_id = ?');
const note = stmt.get(documentId);
```

---

### 7.3 Zustand Integration

**Store Setup:**
```typescript
import { create } from 'zustand';

interface NoteStore {
  notes: Note[];
  currentNoteId: string | null;
  setNotes: (notes: Note[]) => void;
  setCurrentNote: (noteId: string) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  currentNoteId: null,
  setNotes: (notes) => set({ notes }),
  setCurrentNote: (noteId) => set({ currentNoteId: noteId }),
}));
```

---

## 8. Development Workflow

### 8.1 Adding a New Feature

**Steps:**
1. Create feature directory: `src/renderer/features/new-feature/`
2. Create standard structure (components, services, storage, hooks, types)
3. Implement storage interface
4. Implement service layer
5. Create Zustand store (if needed)
6. Create React components
7. Create hooks for component integration
8. Export from `index.ts`
9. Integrate into main app

---

### 8.2 Modifying Existing Features

**Steps:**
1. Identify which layer needs changes
2. Update types if data model changes
3. Update storage if persistence changes
4. Update service if business logic changes
5. Update components if UI changes
6. Update tests
7. Update documentation

---

## 9. Decision Rationale

### 9.1 Why Feature-Based?

**Benefits:**
- **Maintainability:** Easy to find code for specific feature
- **Scalability:** Can add features without affecting others
- **Testability:** Can test features independently
- **Team Collaboration:** Multiple developers can work on different features
- **Code Organization:** Clear boundaries and responsibilities

**Trade-offs:**
- Some code duplication (acceptable for independence)
- Need to manage feature dependencies
- More files to navigate (but better organized)

---

### 9.2 Why Hybrid Storage?

**Benefits:**
- **Performance:** Fast content access (files) + fast metadata queries (SQL)
- **Flexibility:** Easy to version, diff, backup content files
- **Scalability:** SQL queries for complex metadata operations
- **Industry Standard:** Used by Obsidian, Joplin, Notion

**Trade-offs:**
- Need to maintain two storage systems
- Need to handle data consistency
- More complex than single storage

---

### 9.3 Why Hybrid State Management?

**Benefits:**
- **Right Tool for Job:** Context for UI, Zustand for data
- **Performance:** Zustand prevents unnecessary re-renders
- **Simplicity:** Context for simple UI state
- **Flexibility:** Can migrate as needed

**Trade-offs:**
- Two state systems to understand
- Need to decide which to use when
- Potential confusion

---

## 10. Implementation Roadmap

### 10.1 Phase 1: Foundation (MVP)

**Setup:**
- Project structure
- Basic Tiptap editor
- File system storage (simple)
- Basic UI

**Architecture:**
- Simple file-based storage
- React Context for state
- Basic components

---

### 10.2 Phase 2: Core Features

**Add:**
- SQLite database
- Hybrid storage
- Zustand stores
- Note hierarchy
- Basic metadata

**Architecture:**
- Full hybrid storage
- Hybrid state management
- Feature-based structure

---

### 10.3 Phase 3: Advanced Features

**Add:**
- Branches
- Historical timelines
- Timers
- Alarms
- Calendar

**Architecture:**
- Complete feature modules
- Full integration
- Performance optimization

---

## 11. Best Practices

### 11.1 Code Organization

- **One feature per directory**
- **Clear layer separation**
- **Consistent naming**
- **Small, focused files** (<300 lines)
- **Descriptive file names**

---

### 11.2 State Management

- **Zustand for business data**
- **Context for UI state**
- **useState for local state**
- **Avoid prop drilling**
- **Keep stores focused**

---

### 11.3 Storage

- **Content in files**
- **Metadata in SQLite**
- **Document ID as bridge**
- **Handle consistency**
- **Validate on load**

---

### 11.4 Component Design

- **Single responsibility**
- **Composable components**
- **Props-based configuration**
- **Clear interfaces**
- **Reusable patterns**

---

## 12. Summary

**Architecture Approach:**
- **Feature-based organization** for maintainability
- **Hybrid storage** (files + SQLite) for performance
- **Hybrid state** (Context + Zustand) for right tool
- **Layered architecture** for clear boundaries
- **Service-oriented** for business logic

**Key Patterns:**
- Document ID links files to database
- Adjacency list for hierarchical notes
- Storage abstraction layer
- Feature independence
- Clear integration points

**Development Philosophy:**
- Start simple, add complexity as needed
- Right tool for each job
- Clear boundaries and responsibilities
- Maintainable and scalable

---

**Document Status:** Architecture Definition Complete  
**Last Updated:** 2024  
**Ready for Implementation:** Yes
