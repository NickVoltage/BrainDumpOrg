# Comment Directory

> **Note:** This directory maintains a registry of all numbered comments in the codebase. Each comment is assigned a unique number and tracked with its location, purpose, and relationships.

**Last Updated:** 2024  
**Total Comments:** 6

---

## Comment 001

**Purpose:** Note operations - main entry points and coordination

**Locations:**
- `src/renderer/features/notes/services/note-service.ts` - Note service main entry point
- `src/renderer/features/notes/components/NoteEditor.tsx` - Note editor component
- `src/renderer/features/notes/storage/note-storage.ts` - Note storage implementation
- `src/renderer/features/notes/hooks/useNote.ts` - useNote hook
- `src/renderer/stores/note-store.ts` - Note store (Zustand)

**Description:**
Comment 001 represents the main entry points and coordination for note operations across the application. All files with Comment 001 are part of the same logical flow for note creation, editing, and management.

**Relationships:**
- Comment 001 (note-service.ts) calls Comment 001 (note-storage.ts)
- Comment 001 (NoteEditor.tsx) uses Comment 001 (useNote.ts)
- Comment 001 (useNote.ts) uses Comment 001 (note-service.ts)
- Comment 001 (note-service.ts) updates Comment 001 (note-store.ts)
- Comment 001 (NoteEditor.tsx) reads from Comment 001 (note-store.ts)

**Full Comment Text:**
- See each file for full comment text

---

## Comment 002

**Purpose:** Note update operations

**Locations:**
- `src/renderer/features/notes/services/note-service.ts` - Update note method
- `src/renderer/features/notes/storage/note-storage.ts` - Update note storage
- `src/renderer/stores/note-store.ts` - Update note action

**Description:**
Comment 002 represents the update note workflow across service, storage, and state management layers.

**Relationships:**
- Comment 002 (note-service.ts) calls Comment 002 (note-storage.ts)
- Comment 002 (note-service.ts) updates Comment 002 (note-store.ts)

---

## Comment 003

**Purpose:** Auto-save functionality

**Locations:**
- `src/renderer/features/notes/components/NoteEditor.tsx` - Auto-save setup
- `src/renderer/features/notes/hooks/useNote.ts` - Auto-save debounce logic
- `src/renderer/features/notes/services/note-service.ts` - Update note (called by auto-save)

**Description:**
Comment 003 represents the auto-save functionality that debounces editor changes and saves to storage.

**Relationships:**
- Comment 003 (NoteEditor.tsx) uses Comment 003 (useNote.ts)
- Comment 003 (useNote.ts) calls Comment 003 (note-service.ts)

---

## Comment 004

**Purpose:** Manual save functionality

**Locations:**
- `src/renderer/features/notes/components/NoteEditor.tsx` - Manual save handler
- `src/renderer/features/notes/hooks/useNote.ts` - Manual save function
- `src/renderer/features/notes/services/note-service.ts` - Update note (called by manual save)
- `src/renderer/stores/note-store.ts` - Update note action

**Description:**
Comment 004 represents the manual save workflow triggered by user action (save button).

**Relationships:**
- Comment 004 (NoteEditor.tsx) calls Comment 004 (useNote.ts)
- Comment 004 (useNote.ts) calls Comment 004 (note-service.ts)
- Comment 004 (note-service.ts) updates Comment 004 (note-store.ts)

---

## Comment 005

**Purpose:** Database operations

**Locations:**
- `src/renderer/infrastructure/database/db.ts` - Database connection and operations
- `src/renderer/features/notes/storage/note-storage.ts` - Uses database (referenced)

**Description:**
Comment 005 represents database operations for note metadata storage.

**Note:** This comment is referenced but the file doesn't exist yet (placeholder reference).

---

## Comment 006

**Purpose:** File system utilities

**Locations:**
- `src/renderer/infrastructure/storage/file-utils.ts` - File path utilities
- `src/renderer/features/notes/storage/note-storage.ts` - Uses file utilities (referenced)

**Description:**
Comment 006 represents file system utility functions for note content storage.

**Note:** This comment is referenced but the file doesn't exist yet (placeholder reference).

---

## Comment Numbering Rules

- Comments are numbered sequentially: Comment 001, Comment 002, Comment 003, etc.
- Each new comment gets the next available number (highest existing + 1)
- Related code across files shares the same comment number (bi-directional relationships)
- Comments must be registered in this directory when added to codebase

