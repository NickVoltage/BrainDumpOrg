# Development Tips and Tricks

> **Note:** This document contains practical tips, tricks, and optimizations to enhance development productivity, code quality, and debugging efficiency.

**Document Purpose:** Quick reference for development tips, productivity hacks, and best practices.

**Related Documents:**
- `08_Development_Practices_And_Testing.md` - Development practices
- `02_Dev_Best_Practices_Research.md` - Best practices research
- `06_Project_Architecture.md` - Architecture patterns

**Last Updated:** 2024  
**Status:** Living Document (add tips as discovered)

---

## 1. AI-Assisted Development Tips

### 1.1 File Organization for AI Efficiency

**Keep Files Small and Focused:**
- **Target:** Under 300 lines per file
- **Why:** AI tools waste context tokens reading irrelevant code
- **Benefit:** Faster, more accurate code generation
- **Action:** Split large files by responsibility

**Use Descriptive, Semantic Names:**
- ❌ **Bad:** `utils.ts`, `helpers.ts`, `misc.ts`
- ✅ **Good:** `password-hashing.ts`, `notification-service.ts`, `date-formatter.ts`
- **Why:** Semantic search works better with specific names
- **Benefit:** AI can find relevant code without reading entire files

**Co-locate Related Files:**
- Group related functionality together
- Reduces directory traversals
- Makes relationships clear to AI
- Example: `features/notes/components/` contains all note-related components

**Avoid Circular Dependencies:**
- Confuses AI about module boundaries
- Leads to incorrect imports
- Makes code harder to understand
- Use dependency injection or event-based communication

---

### 1.2 Context Management

**Include Project Plan in Every Session:**
- Reference `03_Project_Planning.md` at start of each coding session
- Update plan after significant progress
- Provides strategic context to AI
- Maintains continuity across sessions

**Use Living Documentation:**
- Keep `project-plan.md` updated
- Document decisions as you make them
- Include completed items and next steps
- Creates natural project management flow

**Provide Clear Context:**
- When asking for changes, reference specific files
- Include relevant code snippets
- Explain the "why" behind requests
- Reference related features or patterns

---

### 1.3 PRD→Plan→Todo Methodology

**Three-Phase Approach:**

1. **PRD (Product Requirements Document)**
   - Define what needs to be built
   - Include user stories, functional requirements
   - Define acceptance criteria
   - Business perspective

2. **Plan**
   - Translate PRD to technical blueprint
   - Explore codebase structure
   - Outline major components
   - Technical perspective

3. **Todo**
   - Break plan into granular tasks
   - Make tasks executable independently
   - Include verification steps
   - Implementation perspective

**Benefits:**
- Prevents misaligned implementations
- Ensures comprehensive coverage
- Built-in documentation
- Clear progress tracking

---

## 2. React/TypeScript Development Tips

### 2.1 TypeScript Best Practices

**Use Strict Type Checking:**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Leverage Type Inference:**
```typescript
// Let TypeScript infer when possible
const notes = useNoteStore((state) => state.notes); // Type inferred

// Explicit types for public APIs
export function createNote(data: CreateNoteData): Promise<Note> {
  // Implementation
}
```

**Use Discriminated Unions:**
```typescript
// Better type safety for different states
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Note[] }
  | { status: 'error'; error: string };
```

**Create Utility Types:**
```typescript
// Reusable type utilities
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
```

---

### 2.2 React Performance Tips

**Memoize Expensive Computations:**
```typescript
// Use useMemo for expensive calculations
const filteredNotes = useMemo(() => {
  return notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [notes, searchQuery]);
```

**Optimize Re-renders:**
```typescript
// Use React.memo for components that receive stable props
const NoteCard = React.memo(({ note }: { note: Note }) => {
  // Component implementation
});

// Use useCallback for stable function references
const handleSave = useCallback((note: Note) => {
  noteService.update(note);
}, []);
```

**Lazy Load Components:**
```typescript
// Lazy load heavy components
const CalendarView = React.lazy(() => import('./CalendarView'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <CalendarView />
</Suspense>
```

**Batch State Updates:**
```typescript
// React 18+ automatically batches, but be aware of async updates
// Use functional updates for state that depends on previous state
setCount(prev => prev + 1);
```

---

### 2.3 React Hooks Best Practices

**Custom Hooks for Reusability:**
```typescript
// Extract reusable logic
function useNote(noteId: string) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    noteService.load(noteId).then(setNote).finally(() => setLoading(false));
  }, [noteId]);
  
  return { note, loading };
}
```

**Dependency Array Best Practices:**
```typescript
// Include all dependencies
useEffect(() => {
  // Effect code
}, [dependency1, dependency2]); // Don't omit dependencies

// Use useCallback/useMemo to stabilize function/object dependencies
const memoizedCallback = useCallback(() => {
  // Callback code
}, [deps]);
```

**Cleanup in useEffect:**
```typescript
useEffect(() => {
  const subscription = subscribe();
  return () => {
    subscription.unsubscribe(); // Always cleanup
  };
}, []);
```

---

## 3. Tauri-Specific Tips

### 3.1 IPC Communication

**Type-Safe IPC:**
```typescript
// Define command types
interface TauriCommands {
  'load-note': { noteId: string };
  'save-note': { note: Note };
}

// Use typed invoke
const note = await invoke<TauriCommands['load-note']>('load_note', {
  noteId: '123'
});
```

**Batch IPC Calls:**
```typescript
// Reduce IPC overhead by batching
const results = await Promise.all([
  invoke('get_notes'),
  invoke('get_tags'),
  invoke('get_projects')
]);
```

**Error Handling:**
```typescript
// Always handle IPC errors
try {
  const result = await invoke('save_note', { note });
} catch (error) {
  console.error('IPC Error:', error);
  // Handle gracefully
}
```

---

### 3.2 File System Operations

**Use Tauri's File System API:**
```typescript
import { readTextFile, writeTextFile } from '@tauri-apps/api/fs';

// Async file operations
const content = await readTextFile('path/to/file.md');
await writeTextFile('path/to/file.md', newContent);
```

**Handle Large Files:**
```typescript
// Stream large files instead of loading entirely
import { readFile } from '@tauri-apps/api/fs';
// Use chunked reading for large files
```

**Path Management:**
```typescript
import { join, appDataDir } from '@tauri-apps/api/path';

// Use path utilities for cross-platform compatibility
const dataDir = await appDataDir();
const notePath = await join(dataDir, 'notes', `${noteId}.md`);
```

---

### 3.3 Window Management

**Create Standalone Test Windows:**
```typescript
import { Window } from '@tauri-apps/api/window';

// Create test window for standalone feature testing
const testWindow = new Window({
  url: '/test-windows/timer-test',
  title: 'Timer Test',
  width: 800,
  height: 600
});
```

**Window State Management:**
```typescript
// Save/restore window state
const window = getCurrentWindow();
await window.saveState(); // Save window state
await window.restoreState(); // Restore on next launch
```

---

## 4. Tiptap/Rich Text Editor Tips

### 4.1 Editor Configuration

**Extend Editor with Custom Extensions:**
```typescript
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CustomExtension from './extensions/CustomExtension';

const editor = useEditor({
  extensions: [
    StarterKit,
    CustomExtension, // Add custom functionality
  ],
  content: '<p>Hello World!</p>',
});
```

**Optimize Editor Performance:**
```typescript
// Debounce auto-save
const debouncedSave = useMemo(
  () => debounce((content: string) => {
    noteService.saveContent(noteId, content);
  }, 1000),
  [noteId]
);

editor.on('update', ({ editor }) => {
  debouncedSave(editor.getHTML());
});
```

**Handle Large Documents:**
```typescript
// Use virtual scrolling or pagination for very large documents
// Consider splitting into sections
// Use lazy loading for document parts
```

---

### 4.2 Custom Extensions

**Create Reusable Extensions:**
```typescript
// Custom extension pattern
import { Extension } from '@tiptap/core';

export const CustomExtension = Extension.create({
  name: 'customExtension',
  
  addOptions() {
    return {
      // Extension options
    };
  },
  
  addCommands() {
    return {
      customCommand: () => ({ commands }) => {
        // Command implementation
      },
    };
  },
});
```

**Integrate with Note Features:**
```typescript
// Example: Todo list extension
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

const editor = useEditor({
  extensions: [
    StarterKit,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
  ],
});
```

---

## 5. Performance Optimization Tips

### 5.1 Code Splitting

**Route-Based Code Splitting:**
```typescript
// Split by routes
const NotesView = lazy(() => import('./features/notes/NotesView'));
const CalendarView = lazy(() => import('./features/calendar/CalendarView'));
```

**Feature-Based Code Splitting:**
```typescript
// Load features on demand
const loadTimerFeature = () => import('./features/timer');
```

---

### 5.2 Data Loading Strategies

**Lazy Load Data:**
```typescript
// Load data as needed
const loadNoteContent = async (noteId: string) => {
  if (!contentCache.has(noteId)) {
    const content = await noteService.loadContent(noteId);
    contentCache.set(noteId, content);
  }
  return contentCache.get(noteId);
};
```

**Use Pagination:**
```typescript
// Paginate large lists
const [page, setPage] = useState(1);
const notes = useMemo(() => {
  return allNotes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}, [allNotes, page]);
```

**Implement Virtual Scrolling:**
```typescript
// For very long lists
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: notes.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

---

### 5.3 Memory Management

**Clean Up Subscriptions:**
```typescript
useEffect(() => {
  const unsubscribe = store.subscribe(() => {
    // Handle updates
  });
  
  return () => unsubscribe(); // Always cleanup
}, []);
```

**Clear Caches:**
```typescript
// Implement cache expiration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};
```

---

## 6. Debugging Tips and Tricks

### 6.1 React DevTools

**Component Inspection:**
- Use React DevTools to inspect component props/state
- Check component hierarchy
- Monitor re-renders
- Profile performance

**Redux/Zustand DevTools:**
```typescript
// Enable Zustand DevTools
import { devtools } from 'zustand/middleware';

const useNoteStore = create(
  devtools(
    (set) => ({
      // Store implementation
    }),
    { name: 'NoteStore' }
  )
);
```

---

### 6.2 Console Debugging

**Use Console Groups:**
```typescript
console.group('Note Creation');
console.log('Input:', data);
console.log('Processing...');
console.log('Result:', note);
console.groupEnd();
```

**Conditional Logging:**
```typescript
// Only log in development
const debugLog = (...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log('[DEBUG]', ...args);
  }
};
```

**Structured Logging:**
```typescript
// Use structured logs
logger.info('Note created', {
  noteId: note.id,
  title: note.title,
  timestamp: new Date().toISOString(),
});
```

---

### 6.3 Breakpoint Strategies

**Strategic Breakpoints:**
- Set breakpoints at function entry points
- Break on state changes
- Break on errors
- Use conditional breakpoints

**Debug Async Code:**
```typescript
// Use async/await breakpoints
const result = await noteService.load(noteId);
// Set breakpoint here to inspect result
console.log('Loaded note:', result);
```

---

### 6.4 Error Tracking

**Error Boundaries:**
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error
    logger.error('React Error', { error, errorInfo });
    // Report to error tracking service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

**Global Error Handler:**
```typescript
// Catch unhandled errors
window.addEventListener('error', (event) => {
  logger.error('Global Error', {
    message: event.message,
    source: event.filename,
    line: event.lineno,
  });
});
```

---

## 7. Productivity Tips

### 7.1 Keyboard Shortcuts

**Editor Shortcuts:**
- Use VS Code/Cursor shortcuts effectively
- Create custom snippets for common patterns
- Use multi-cursor editing
- Leverage command palette

**Application Shortcuts:**
```typescript
// Implement keyboard shortcuts in app
import { useHotkeys } from 'react-hotkeys-hook';

useHotkeys('ctrl+s', (e) => {
  e.preventDefault();
  handleSave();
});
```

---

### 7.2 Code Snippets

**Create Reusable Snippets:**
```typescript
// VS Code snippet example
{
  "React Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "",
      "interface ${1:Component}Props {",
      "  $2",
      "}",
      "",
      "export const ${1:Component}: React.FC<${1:Component}Props> = ({ $3 }) => {",
      "  return (",
      "    <div>$4</div>",
      "  );",
      "};"
    ]
  }
}
```

---

### 7.3 Development Workflow

**Incremental Development:**
- Make small, testable changes
- Commit frequently
- Test after each change
- Refactor continuously

**Feature Flags:**
```typescript
// Use feature flags for gradual rollout
const FEATURES = {
  NEW_EDITOR: import.meta.env.VITE_FEATURE_NEW_EDITOR === 'true',
  BRANCHED_NOTES: import.meta.env.VITE_FEATURE_BRANCHED_NOTES === 'true',
};

if (FEATURES.NEW_EDITOR) {
  // New editor code
}
```

**Git Workflow:**
```bash
# Create feature branch
git checkout -b feature/timer-functionality

# Make small commits
git commit -m "Add: timer component structure"
git commit -m "Add: timer service logic"
git commit -m "Add: timer integration with notes"

# Keep commits focused and atomic
```

---

## 8. Code Organization Tips

### 8.1 File Naming Conventions

**Consistent Naming:**
- Components: `PascalCase.tsx` (e.g., `NoteEditor.tsx`)
- Services: `kebab-case.ts` (e.g., `note-service.ts`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useNote.ts`)
- Types: `kebab-case.ts` (e.g., `note-types.ts`)
- Utils: `kebab-case.ts` (e.g., `date-utils.ts`)

**Index Files:**
```typescript
// Use index.ts for clean imports
// features/notes/index.ts
export { NoteEditor } from './components/NoteEditor';
export { useNote } from './hooks/useNote';
export { noteService } from './services/note-service';
export type { Note } from './types';
```

---

### 8.2 Import Organization

**Group Imports:**
```typescript
// 1. External dependencies
import React, { useState, useEffect } from 'react';
import { useEditor } from '@tiptap/react';

// 2. Internal shared
import { Button } from '@/shared/components';
import { useAppStore } from '@/stores';

// 3. Feature-specific
import { NoteEditor } from '../components/NoteEditor';
import { useNote } from '../hooks/useNote';

// 4. Types
import type { Note } from '../types';
```

**Use Path Aliases:**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/renderer/*"],
      "@/shared/*": ["./src/renderer/shared/*"],
      "@/features/*": ["./src/renderer/features/*"]
    }
  }
}
```

---

### 8.3 Component Organization

**Component Structure:**
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Component
// 4. Hooks (if needed)
// 5. Utilities (if needed)
// 6. Exports

// Example:
import React from 'react';
import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onSelect: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onSelect }) => {
  // Component implementation
};
```

---

## 9. Common Pitfalls and Solutions

### 9.1 React Pitfalls

**Pitfall: Missing Dependencies in useEffect**
```typescript
// ❌ Bad
useEffect(() => {
  fetchData(id);
}, []); // Missing 'id' dependency

// ✅ Good
useEffect(() => {
  fetchData(id);
}, [id]); // Include all dependencies
```

**Pitfall: Creating Objects in Render**
```typescript
// ❌ Bad - creates new object every render
<Component style={{ margin: 10 }} />

// ✅ Good - stable reference
const style = useMemo(() => ({ margin: 10 }), []);
<Component style={style} />
```

**Pitfall: Not Cleaning Up Effects**
```typescript
// ❌ Bad - memory leak
useEffect(() => {
  const interval = setInterval(() => {
    // Do something
  }, 1000);
  // Missing cleanup
}, []);

// ✅ Good - proper cleanup
useEffect(() => {
  const interval = setInterval(() => {
    // Do something
  }, 1000);
  
  return () => clearInterval(interval);
}, []);
```

---

### 9.2 TypeScript Pitfalls

**Pitfall: Using `any`**
```typescript
// ❌ Bad
function process(data: any) {
  // No type safety
}

// ✅ Good
function process<T>(data: T): ProcessedData<T> {
  // Type-safe
}
```

**Pitfall: Ignoring Null Checks**
```typescript
// ❌ Bad
const title = note.title.toUpperCase(); // Could be null

// ✅ Good
const title = note.title?.toUpperCase() ?? 'Untitled';
```

---

### 9.3 State Management Pitfalls

**Pitfall: Overusing Global State**
```typescript
// ❌ Bad - everything in global state
const useAppStore = create((set) => ({
  notes: [],
  tags: [],
  projects: [],
  ui: { sidebarOpen: true },
  // Too much global state
}));

// ✅ Good - local state for UI, global for shared data
const [sidebarOpen, setSidebarOpen] = useState(true); // Local
const notes = useNoteStore((state) => state.notes); // Global
```

---

## 10. Quick Reference Checklists

### 10.1 Before Starting a Feature

- [ ] Check codebase hierarchy (sibling/parent files)
- [ ] Review related features for patterns
- [ ] Create standalone test (if new feature)
- [ ] Write baseline tests
- [ ] Plan integration points
- [ ] Document approach

---

### 10.2 During Development

- [ ] Make small, incremental changes
- [ ] Test after each change
- [ ] Run linter
- [ ] Check for console errors
- [ ] Verify no regressions
- [ ] Update documentation

---

### 10.3 Before Committing

- [ ] All tests pass
- [ ] No linting errors
- [ ] No console errors
- [ ] Code follows patterns
- [ ] Documentation updated
- [ ] Commit message is descriptive

---

### 10.4 Performance Checklist

- [ ] Components memoized appropriately
- [ ] Expensive computations memoized
- [ ] Large lists virtualized or paginated
- [ ] Images optimized
- [ ] Code split by route/feature
- [ ] Unused code removed

---

## 11. Useful Tools and Extensions

### 11.1 VS Code/Cursor Extensions

**Recommended Extensions:**
- ESLint - Code linting
- Prettier - Code formatting
- TypeScript - Type checking
- React snippets - Quick component creation
- GitLens - Git integration
- Error Lens - Inline error display

---

### 11.2 Browser DevTools

**Chrome DevTools Features:**
- React DevTools extension
- Performance profiler
- Network throttling
- Memory profiler
- Console filtering

---

### 11.3 Development Tools

**Useful Tools:**
- React DevTools
- Redux DevTools (or Zustand DevTools)
- React Query DevTools (if using)
- Lighthouse (performance)
- Bundle analyzer (webpack-bundle-analyzer)

---

## 12. Continuous Improvement

### 12.1 Regular Reviews

**Code Reviews:**
- Review your own code before committing
- Check for common pitfalls
- Verify patterns are followed
- Ensure tests are adequate

**Performance Reviews:**
- Profile periodically
- Check bundle size
- Monitor memory usage
- Optimize bottlenecks

---

### 12.2 Learning and Adaptation

**Stay Updated:**
- Follow React/TypeScript updates
- Learn new patterns
- Experiment with new tools
- Share knowledge

**Document Learnings:**
- Add tips to this document
- Update best practices
- Share with team
- Create examples

---

## 13. Summary

**Key Takeaways:**

1. **File Organization:** Keep files small (<300 lines), use descriptive names, co-locate related files
2. **AI Efficiency:** Provide clear context, use living documentation, follow PRD→Plan→Todo
3. **Performance:** Memoize expensive operations, lazy load, virtualize long lists
4. **Debugging:** Use DevTools, structured logging, error boundaries
5. **Productivity:** Use shortcuts, snippets, incremental development
6. **Code Quality:** Follow patterns, avoid pitfalls, test thoroughly
7. **Continuous Improvement:** Review regularly, learn continuously, document learnings

**Remember:** These tips are guidelines, not rules. Adapt them to your specific needs and context.

---

**Document Status:** Living Document  
**Last Updated:** 2024  
**Maintenance:** Add new tips as discovered, update outdated practices
