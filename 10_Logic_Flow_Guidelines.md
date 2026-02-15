# Logic Flow Guidelines

> **Note:** This document defines standard patterns and guidelines for how logic flows through the application. It establishes principles and common patterns while remaining flexible for the functional prototype approach.

**Document Purpose:** Guide for implementing consistent logic flow patterns across features.

**Related Documents:**
- `06_Project_Architecture.md` - Architecture structure and patterns
- `03_Project_Planning.md` - Development approach and priorities
- `00_Codebase_Comments_Guidelines.md` - Comment documentation standards

**Last Updated:** 2024  
**Status:** Active Guidelines

---

## 1. Core Flow Principles

### 1.1 Unidirectional Data Flow

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

### 1.2 Layer Responsibilities

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

### 1.3 Communication Rules

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

## 2. Standard Flow Patterns

### 2.1 Create Operation Flow

**Pattern: Create New Entity**

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

**Example: Create Note**
```typescript
// Component
const handleCreateNote = async () => {
  const newNote = await noteService.createNote({
    title: 'New Note',
    parentId: currentParentId,
  });
  // Store automatically updates via service
};

// Service
async createNote(data: CreateNoteData): Promise<Note> {
  // 1. Validate
  validateNoteData(data);
  
  // 2. Generate ID
  const documentId = generateDocumentId();
  
  // 3. Create model
  const note: Note = {
    documentId,
    ...data,
    createdAt: new Date(),
  };
  
  // 4. Save
  await this.storage.saveNote(note);
  
  // 5. Update store
  useNoteStore.getState().addNote(note);
  
  return note;
}
```

---

### 2.2 Read Operation Flow

**Pattern: Load Entity**

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

**Example: Load Note**
```typescript
// Component
const NoteViewer = ({ noteId }: Props) => {
  const { note, isLoading } = useNote(noteId);
  
  if (isLoading) return <Loading />;
  if (!note) return <NotFound />;
  
  return <NoteContent note={note} />;
};

// Hook
function useNote(noteId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const note = useNoteStore((state) => state.notes[noteId]);
  
  useEffect(() => {
    if (!note) {
      noteService.loadNote(noteId).then(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [noteId, note]);
  
  return { note, isLoading };
}

// Service
async loadNote(noteId: string): Promise<Note> {
  // 1. Load from storage
  const [content, metadata] = await Promise.all([
    this.fileStorage.loadContent(noteId),
    this.databaseStorage.loadMetadata(noteId),
  ]);
  
  // 2. Transform
  const note: Note = {
    ...metadata,
    content: JSON.parse(content),
  };
  
  // 3. Update store
  useNoteStore.getState().setNote(note);
  
  return note;
}
```

---

### 2.3 Update Operation Flow

**Pattern: Update Entity**

```
User Action (Edit)
    ↓
Component Updates Local State
    ↓
Debounced Auto-save Trigger
    ↓
Service.updateEntity(id, changes)
    ↓
┌─────────────────────────┐
│ 1. Validate changes    │
│ 2. Load current entity │
│ 3. Apply changes       │
│ 4. Save to storage     │
│ 5. Return updated      │
└─────────────────────────┘
    ↓
Update Zustand Store
    ↓
Update UI State (isDirty = false)
    ↓
Component Re-renders
```

**Example: Update Note**
```typescript
// Component
const NoteEditor = ({ noteId }: Props) => {
  const editor = useEditor();
  const { isDirty, setIsDirty } = useContext(EditorContext);
  
  // Auto-save on change
  useEffect(() => {
    if (!editor) return;
    
    const timeoutId = setTimeout(() => {
      if (isDirty) {
        handleSave();
      }
    }, 2000); // 2 second debounce
    
    return () => clearTimeout(timeoutId);
  }, [editor?.getJSON(), isDirty]);
  
  const handleSave = async () => {
    const content = editor.getJSON();
    await noteService.updateNote(noteId, { content });
    setIsDirty(false);
  };
};

// Service
async updateNote(noteId: string, changes: Partial<Note>): Promise<Note> {
  // 1. Validate
  if (changes.content) {
    validateNoteContent(changes.content);
  }
  
  // 2. Load current
  const current = await this.loadNote(noteId);
  
  // 3. Apply changes
  const updated: Note = {
    ...current,
    ...changes,
    modifiedAt: new Date(),
  };
  
  // 4. Save
  await this.storage.updateNote(noteId, updated);
  
  // 5. Update store
  useNoteStore.getState().updateNote(updated);
  
  return updated;
}
```

---

### 2.4 Delete Operation Flow

**Pattern: Delete Entity**

```
User Action (Click "Delete")
    ↓
Component Shows Confirmation
    ↓
User Confirms
    ↓
Service.deleteEntity(id)
    ↓
┌─────────────────────────┐
│ 1. Validate deletion   │
│ 2. Check dependencies  │
│ 3. Delete from storage │
│ 4. Clean up related    │
└─────────────────────────┘
    ↓
Update Zustand Store
    ↓
Navigate Away / Update UI
    ↓
Component Re-renders
```

**Example: Delete Note**
```typescript
// Service
async deleteNote(noteId: string): Promise<void> {
  // 1. Validate
  const note = await this.loadNote(noteId);
  if (!note) throw new Error('Note not found');
  
  // 2. Check dependencies
  const hasChildren = await this.hasChildNotes(noteId);
  if (hasChildren) {
    throw new Error('Cannot delete note with children');
  }
  
  // 3. Delete
  await Promise.all([
    this.fileStorage.deleteContent(noteId),
    this.databaseStorage.deleteMetadata(noteId),
  ]);
  
  // 4. Clean up
  await this.cleanupRelatedData(noteId);
  
  // 5. Update store
  useNoteStore.getState().removeNote(noteId);
}
```

---

## 3. Common Patterns

### 3.1 Auto-Save Pattern

**When to Use:** For content that changes frequently (editor content, form inputs)

**Pattern:**
```typescript
// Debounced auto-save
useEffect(() => {
  if (!isDirty) return;
  
  const timeoutId = setTimeout(() => {
    handleSave();
  }, DEBOUNCE_DELAY);
  
  return () => clearTimeout(timeoutId);
}, [content, isDirty]);

// Immediate save on blur/unmount
useEffect(() => {
  return () => {
    if (isDirty) {
      handleSave(); // Immediate save on unmount
    }
  };
}, []);
```

**Rules:**
- Debounce frequent changes (2-3 seconds)
- Save immediately on blur/unmount
- Show "Saving..." indicator
- Handle save errors gracefully

---

### 3.2 Validation Pattern

**Where Validation Occurs:**

```
User Input
    ↓
Component (Client-side validation)
    ↓
Service (Business logic validation)
    ↓
Storage (Data integrity validation)
```

**Pattern:**
```typescript
// Component level (immediate feedback)
const handleInputChange = (value: string) => {
  const error = validateInput(value);
  setLocalError(error);
  if (!error) {
    setValue(value);
  }
};

// Service level (business rules)
async createNote(data: CreateNoteData): Promise<Note> {
  // Validate business rules
  if (data.parentId) {
    const parent = await this.loadNote(data.parentId);
    if (!parent) {
      throw new ValidationError('Parent note not found');
    }
  }
  
  // Continue with creation
}
```

**Rules:**
- Validate at component level for immediate feedback
- Validate at service level for business rules
- Validate at storage level for data integrity
- Return clear error messages

---

### 3.3 Error Handling Pattern

**Error Flow:**

```
Operation Fails
    ↓
Catch Error
    ↓
Transform to User-Friendly Error
    ↓
Update Error State
    ↓
Display to User
    ↓
Log for Debugging
```

**Pattern:**
```typescript
// Service
async loadNote(noteId: string): Promise<Note> {
  try {
    return await this.storage.loadNote(noteId);
  } catch (error) {
    // Transform error
    if (error.code === 'ENOENT') {
      throw new NotFoundError('Note not found');
    }
    throw new Error('Failed to load note');
  }
}

// Component
const { note, error, isLoading } = useNote(noteId);

if (error) {
  return <ErrorMessage error={error} />;
}
```

**Rules:**
- Catch errors at service layer
- Transform technical errors to user-friendly messages
- Log errors for debugging
- Display errors in UI
- Allow user to retry

---

### 3.4 Loading State Pattern

**Loading Flow:**

```
Operation Starts
    ↓
Set Loading = true
    ↓
Show Loading Indicator
    ↓
Operation Completes
    ↓
Set Loading = false
    ↓
Show Content / Error
```

**Pattern:**
```typescript
// Hook
function useNote(noteId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const note = useNoteStore((state) => state.notes[noteId]);
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    noteService.loadNote(noteId)
      .then(() => setIsLoading(false))
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [noteId]);
  
  return { note, isLoading, error };
}

// Component
const NoteViewer = ({ noteId }: Props) => {
  const { note, isLoading, error } = useNote(noteId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!note) return <NotFound />;
  
  return <NoteContent note={note} />;
};
```

**Rules:**
- Show loading state during async operations
- Handle error state
- Handle empty state
- Provide feedback to user

---

### 3.5 State Update Pattern

**When to Update State:**

```
Operation Completes
    ↓
Update Zustand Store (business data)
    ↓
Update React Context (UI state)
    ↓
Update Local State (component state)
    ↓
Trigger Re-render
```

**Pattern:**
```typescript
// Service updates Zustand
async createNote(data: CreateNoteData): Promise<Note> {
  const note = await this.storage.createNote(data);
  
  // Update business state
  useNoteStore.getState().addNote(note);
  
  return note;
}

// Component updates Context
const handleNoteCreated = (note: Note) => {
  // Update UI state
  setCurrentNote(note.id);
  setIsDirty(false);
};

// Component updates local state
const [localValue, setLocalValue] = useState('');
```

**Rules:**
- Update Zustand for business data (persists across components)
- Update Context for UI state (current selection, theme)
- Update local state for component-specific state
- Update in correct order (business → UI → local)

---

## 4. Feature Integration Patterns

### 4.1 Cross-Feature Communication

**Pattern: Features Communicate via Services**

```
Feature A Component
    ↓
Feature A Service
    ↓
Feature B Service (if needed)
    ↓
Shared Storage
    ↓
Update Both Feature Stores
```

**Example: Timer Attached to Note**
```typescript
// Timer feature
const timerService = {
  async createTimer(noteId: string, duration: number) {
    // Can access note service if needed
    const note = await noteService.getNote(noteId);
    if (!note) throw new Error('Note not found');
    
    // Create timer
    const timer = await timerStorage.create({
      noteId,
      duration,
    });
    
    // Update stores
    useTimerStore.getState().addTimer(timer);
    useNoteStore.getState().addTimerToNote(noteId, timer.id);
    
    return timer;
  },
};
```

**Rules:**
- Services can call other services
- No direct component-to-component communication
- Update relevant stores
- Handle dependencies

---

### 4.2 Shared State Pattern

**Pattern: Shared Zustand Store**

```
Feature A Updates Shared Store
    ↓
Store Notifies Subscribers
    ↓
Feature B Components Re-render
    ↓
Feature B Uses Updated Data
```

**Example: Notes and Calendar**
```typescript
// Shared store for date-related data
const useDateStore = create<DateStore>((set) => ({
  reminders: [],
  addReminder: (reminder) => set((state) => ({
    reminders: [...state.reminders, reminder],
  })),
}));

// Notes feature uses it
const noteService = {
  async createReminder(noteId: string, date: Date) {
    const reminder = await reminderStorage.create({ noteId, date });
    useDateStore.getState().addReminder(reminder);
  },
};

// Calendar feature uses it
const CalendarView = () => {
  const reminders = useDateStore((state) => state.reminders);
  // Display reminders in calendar
};
```

---

## 5. Decision Guidelines

### 5.1 When to Use Services vs. Direct Storage

**Use Services When:**
- ✅ Business logic needed (validation, transformation)
- ✅ Multiple storage operations needed
- ✅ Cross-feature coordination needed
- ✅ State updates needed

**Use Direct Storage When:**
- ✅ Simple read operations (no transformation)
- ✅ Internal to storage layer
- ✅ No business logic needed

**Example:**
```typescript
// Use service (has business logic)
const note = await noteService.createNote(data);

// Direct storage OK for internal operations
const content = await fileStorage.loadContent(noteId);
```

---

### 5.2 When to Update State

**Update Zustand Store When:**
- ✅ Business data changes (notes, timers, alarms)
- ✅ Data needs to be shared across components
- ✅ Data needs to persist across navigation

**Update React Context When:**
- ✅ UI state changes (current selection, theme)
- ✅ Navigation state
- ✅ Editor state (current editor, isDirty)

**Update Local State When:**
- ✅ Component-specific UI state (modal open, form input)
- ✅ Temporary state (hover, focus)
- ✅ Derived state (computed from props)

---

### 5.3 When to Trigger Side Effects

**Trigger Side Effects:**
- ✅ After successful save (show notification)
- ✅ After data load (update UI)
- ✅ After error (show error message)
- ✅ On component mount (load data)
- ✅ On dependency change (reload data)

**Pattern:**
```typescript
useEffect(() => {
  // Side effect after state change
  if (note && !note.content) {
    loadNoteContent(note.id);
  }
}, [note]);
```

---

### 5.4 When to Use Hooks vs. Direct Service Calls

**Use Hooks When:**
- ✅ Component needs reactive updates
- ✅ Need loading/error states
- ✅ Need to subscribe to store changes
- ✅ Reusable across components

**Use Direct Service Calls When:**
- ✅ One-time operations (on button click)
- ✅ No need for reactive updates
- ✅ Simple operations

**Example:**
```typescript
// Use hook (reactive)
const { note, isLoading } = useNote(noteId);

// Direct call (one-time)
const handleDelete = async () => {
  await noteService.deleteNote(noteId);
  navigate('/notes');
};
```

---

## 6. Complete Flow Examples

### 6.1 Example 1: Create Hierarchical Note

**Complete Flow:**

```
User clicks "New Child Note"
    ↓
NoteCreator Component
    ↓
handleCreateChildNote()
    ↓
noteService.createChildNote(parentId, data)
    ↓
┌─────────────────────────────────┐
│ Service Layer:                   │
│ 1. Validate parent exists        │
│ 2. Generate document_id          │
│ 3. Create Note model             │
│ 4. Save content to file system   │
│ 5. Save metadata to SQLite       │
│ 6. Update hierarchy in SQLite    │
└─────────────────────────────────┘
    ↓
Update Zustand Store
  - Add note to notes collection
  - Update parent's children list
    ↓
Update React Context
  - Set current note to new note
    ↓
Navigate to new note
    ↓
NoteEditor Component renders
    ↓
useNote hook loads note
    ↓
Tiptap editor displays content
```

**Code Flow:**
```typescript
// Component
const NoteCreator = ({ parentId }: Props) => {
  const handleCreate = async () => {
    const newNote = await noteService.createChildNote(parentId, {
      title: 'New Note',
    });
    // Navigation happens automatically via store update
  };
};

// Service
async createChildNote(parentId: string, data: CreateNoteData): Promise<Note> {
  // 1. Validate
  const parent = await this.loadNote(parentId);
  if (!parent) throw new Error('Parent not found');
  
  // 2. Generate ID
  const documentId = generateDocumentId();
  
  // 3. Create model
  const note: Note = {
    documentId,
    parentId,
    ...data,
    createdAt: new Date(),
  };
  
  // 4. Save content
  await this.fileStorage.saveContent(documentId, '');
  
  // 5. Save metadata
  await this.databaseStorage.saveMetadata(note);
  
  // 6. Update hierarchy
  await this.hierarchyService.addChild(parentId, documentId);
  
  // 7. Update stores
  useNoteStore.getState().addNote(note);
  useNoteStore.getState().addChildToParent(parentId, documentId);
  
  return note;
}
```

---

### 6.2 Example 2: Auto-Save Note with Timer

**Complete Flow:**

```
User types in editor
    ↓
Tiptap onUpdate fires
    ↓
EditorContext updates (isDirty = true)
    ↓
Debounce timer starts (2 seconds)
    ↓
User continues typing
    ↓
Debounce timer resets
    ↓
User stops typing
    ↓
Debounce timer completes
    ↓
handleAutoSave()
    ↓
noteService.updateNote(noteId, content)
    ↓
┌─────────────────────────────────┐
│ Service Layer:                   │
│ 1. Get current content          │
│ 2. Validate new content          │
│ 3. Save content to file system   │
│ 4. Update metadata (modified_at)  │
│ 5. Create version snapshot       │
└─────────────────────────────────┘
    ↓
Update Zustand Store
  - Update note in collection
  - Update modified timestamp
    ↓
Update EditorContext
  - Set isDirty = false
  - Show "Saved" indicator
    ↓
Timer starts (if note has timer)
    ↓
TimerService checks if timer should start
    ↓
Update TimerStore
    ↓
TimerDisplay component updates
```

**Code Flow:**
```typescript
// Component
const NoteEditor = ({ noteId }: Props) => {
  const editor = useEditor();
  const { isDirty, setIsDirty } = useContext(EditorContext);
  
  // Auto-save on change
  useEffect(() => {
    if (!editor || !isDirty) return;
    
    const timeoutId = setTimeout(async () => {
      const content = editor.getJSON();
      await noteService.updateNote(noteId, { content });
      setIsDirty(false);
      
      // Check if timer should start
      const note = useNoteStore.getState().notes[noteId];
      if (note.timerId) {
        await timerService.startTimer(note.timerId);
      }
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [editor?.getJSON(), isDirty, noteId]);
};
```

---

### 6.3 Example 3: Alarm Trigger with Note Display

**Complete Flow:**

```
Background scheduler (node-schedule)
    ↓
Check SQLite for due alarms
    ↓
Find alarm due now
    ↓
alarmService.triggerAlarm(alarmId)
    ↓
┌─────────────────────────────────┐
│ Service Layer:                   │
│ 1. Load alarm from SQLite        │
│ 2. Load associated note          │
│ 3. Show system notification       │
│ 4. Update alarm status            │
│ 5. Handle recurring alarms       │
└─────────────────────────────────┘
    ↓
System Notification API
    ↓
User sees notification
    ↓
User clicks notification
    ↓
App brings to foreground
    ↓
Navigate to note
    ↓
NoteViewer component loads
    ↓
Display note with alarm indicator
```

**Code Flow:**
```typescript
// Background scheduler (main process)
schedule.scheduleJob('* * * * *', async () => {
  const dueAlarms = await alarmService.getDueAlarms();
  
  for (const alarm of dueAlarms) {
    await alarmService.triggerAlarm(alarm.id);
  }
});

// Service
async triggerAlarm(alarmId: string): Promise<void> {
  // 1. Load alarm
  const alarm = await this.storage.loadAlarm(alarmId);
  
  // 2. Load note
  const note = await noteService.loadNote(alarm.noteId);
  
  // 3. Show notification
  await notificationService.show({
    title: alarm.title || note.title,
    body: 'Alarm triggered',
    data: { noteId: note.documentId },
  });
  
  // 4. Update status
  await this.storage.updateAlarm(alarmId, {
    lastTriggered: new Date(),
  });
  
  // 5. Handle recurring
  if (alarm.recurring) {
    await this.scheduleNextOccurrence(alarmId);
  }
}
```

---

## 7. Anti-Patterns to Avoid

### 7.1 Don't Do This

**❌ Direct Storage Access from Components:**
```typescript
// BAD: Component directly accesses storage
const MyComponent = () => {
  const note = await fileStorage.loadContent(noteId); // ❌
};
```

**✅ Do This:**
```typescript
// GOOD: Component uses service
const MyComponent = () => {
  const { note } = useNote(noteId); // ✅
};
```

---

**❌ Business Logic in Components:**
```typescript
// BAD: Business logic in component
const MyComponent = () => {
  const handleSave = () => {
    if (data.parentId) {
      const parent = await loadNote(data.parentId); // ❌
      if (!parent) throw new Error('Invalid parent');
    }
    // ...
  };
};
```

**✅ Do This:**
```typescript
// GOOD: Business logic in service
const MyComponent = () => {
  const handleSave = () => {
    noteService.createNote(data); // ✅ Service handles validation
  };
};
```

---

**❌ Circular Dependencies:**
```typescript
// BAD: Feature A depends on Feature B, Feature B depends on Feature A
// feature-a/service.ts
import { featureBService } from '../feature-b';

// feature-b/service.ts
import { featureAService } from '../feature-a'; // ❌
```

**✅ Do This:**
```typescript
// GOOD: Use shared service or event system
// shared/coordination-service.ts
export const coordinationService = {
  // Handle cross-feature coordination
};
```

---

**❌ State Updates in Wrong Layer:**
```typescript
// BAD: Storage layer updates state
class NoteStorage {
  async saveNote(note: Note) {
    await this.db.save(note);
    useNoteStore.getState().addNote(note); // ❌
  }
}
```

**✅ Do This:**
```typescript
// GOOD: Service layer updates state
class NoteService {
  async saveNote(note: Note) {
    await this.storage.saveNote(note);
    useNoteStore.getState().addNote(note); // ✅
  }
}
```

---

## 8. Flow Decision Tree

### 8.1 Creating New Feature Flow

**Decision Tree:**

```
Need to create new feature?
    ↓
Create feature directory
    ↓
Need data persistence?
    ├─ Yes → Create storage interface
    │         ↓
    │      Need business logic?
    │      ├─ Yes → Create service
    │      │         ↓
    │      │      Need reactive updates?
    │      │      ├─ Yes → Create hook
    │      │      │         ↓
    │      │      │      Create components
    │      │      │
    │      │      └─ No → Use service directly
    │      │
    │      └─ No → Create service with simple storage
    │
    └─ No → Create components only
```

---

### 8.2 State Management Decision

**Decision Tree:**

```
Need to store state?
    ↓
Shared across multiple components?
    ├─ Yes → Business data?
    │      ├─ Yes → Use Zustand store
    │      │
    │      └─ No → UI state?
    │             ├─ Yes → Use React Context
    │             │
    │             └─ No → Use local state
    │
    └─ No → Use local state (useState)
```

---

## 9. Best Practices Summary

### 9.1 Flow Best Practices

1. **Always flow through layers:** Component → Service → Storage
2. **Validate at appropriate layers:** Component (UI), Service (business), Storage (data)
3. **Handle errors gracefully:** Catch, transform, display
4. **Update state correctly:** Zustand for data, Context for UI, local for component
5. **Use hooks for reactive data:** When you need updates
6. **Debounce frequent operations:** Auto-save, search, etc.
7. **Handle loading states:** Show feedback during async operations

---

### 9.2 Common Mistakes to Avoid

1. ❌ Skipping service layer
2. ❌ Business logic in components
3. ❌ Direct storage access from components
4. ❌ State updates in wrong layer
5. ❌ Circular dependencies
6. ❌ No error handling
7. ❌ No loading states
8. ❌ No validation

---

## 10. Implementation Guidelines

### 10.1 Starting a New Feature

**Checklist:**
- [ ] Create feature directory structure
- [ ] Define types (types.ts)
- [ ] Create storage interface
- [ ] Implement storage
- [ ] Create service
- [ ] Create Zustand store (if needed)
- [ ] Create hooks (if needed)
- [ ] Create components
- [ ] Export from index.ts
- [ ] Integrate into main app

---

### 10.2 Modifying Existing Feature

**Checklist:**
- [ ] Identify which layer needs changes
- [ ] Update types if data model changes
- [ ] Update storage if persistence changes
- [ ] Update service if business logic changes
- [ ] Update components if UI changes
- [ ] Update tests
- [ ] Update documentation

---

## 11. Summary

**Core Principles:**
- Unidirectional data flow
- Clear layer responsibilities
- Service-oriented business logic
- State management at appropriate levels

**Standard Patterns:**
- CRUD operations follow consistent flow
- Auto-save with debouncing
- Validation at multiple layers
- Error handling throughout
- Loading states for async operations

**Decision Guidelines:**
- Use services for business logic
- Use hooks for reactive data
- Use Zustand for shared business data
- Use Context for UI state
- Use local state for component state

**Key Takeaway:**
Follow the patterns, but adapt as needed for the functional prototype approach. Start simple, add complexity when patterns emerge.

---

**Document Status:** Active Guidelines  
**Last Updated:** 2024  
**Flexibility:** Patterns and principles, not rigid rules