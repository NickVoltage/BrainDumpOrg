# Proposed Selections from Project Planning

> **Note:** This document tracks specific technology choices, architectural decisions, and selections made based on the project planning document. Update this document as decisions are finalized.

**Document Purpose:** Central location for documenting finalized choices and decisions from the planning phase.

**Related Documents:**
- `03_Project_Planning.md` - Source of recommendations and options
- `00_AI_ReadME_Project_Guidance_And_Rules.md` - Project guidance and rules

**Last Updated:** 2024  
**Status:** Active - Decisions in Progress

---

## 1. Technology Stack Selections

### 1.1 Primary Framework

**Status:** ✅ **SELECTED**

**Selection:** **Tauri**

**Options from Planning:**
- **Tauri** (✅ SELECTED)
  - Lightweight (~5-10MB vs Electron's ~100MB+)
  - Lower memory usage
  - Better security model
  - Native performance
  - Cross-platform (Windows, macOS, Linux)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - ✓ Local File Saving
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✓ Branched Notes
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes
  - ✓ Timer
  - ✓ Alarm

- **Electron** (Fallback)
  - Larger ecosystem
  - More examples and resources
  - Easier initial development
  - Higher resource usage
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - ✓ Local File Saving
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✓ Branched Notes
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes
  - ✓ Timer
  - ✗ Alarm (background execution more complex)

**Decision:** **Tauri**

**Rationale:**
- Lightweight and performant
- Better native integration for alarms
- Lower resource usage
- Better security model
- Supports all project desires

**Notes:**
- Confirmed in `12_Pre_Implementation_Plan_Conversation.md` Section 1
- Electron preserved as fallback option

---

### 1.2 Frontend Framework

**Status:** ✅ **SELECTED**

**Selection:** **React**

**Options from Planning:**
- **React** (✅ SELECTED)
  - Large ecosystem
  - Component-based architecture
  - Good for complex UIs
  - Strong community support
  - TypeScript support
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - ✓ Local File Saving
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✓ Branched Notes
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes
  - ✓ Timer
  - ✓ Alarm

- **Vue.js** (Alternative)
  - Simpler learning curve
  - Good performance
  - Growing ecosystem
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - ✓ Local File Saving
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✓ Branched Notes
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes
  - ✓ Timer
  - ✓ Alarm

**Decision:** **React**

**Rationale:**
- Large ecosystem supports all required features
- Component-based architecture aligns with modular design goals
- Excellent TypeScript integration
- Good for complex UIs (editor, calendar, branches)

**Notes:**
- Standard for all frontend code
- Component-based architecture critical for customizable GUI

---

### 1.3 Programming Language

**Status:** ✅ Selected

**Selection:** **TypeScript**

**Rationale:**
- Type safety prevents bugs
- Better IDE support for development
- Self-documenting through types
- Easier refactoring and maintenance
- Aligns with maintainable codebase priority

**Notes:**
- Standard for all frontend code
- Type definitions required for all modules

---

### 1.4 Rich Text Editor

**Status:** ✅ **SELECTED**

**Selection:** **Tiptap**

**Rationale:**
- Built on ProseMirror (proven foundation, same as Google Docs collaboration)
- Headless and framework-agnostic
- 100+ extensions available
- Real-time collaboration support (future consideration)
- Good documentation
- Active development
- Supports custom node types (tasks, branches, hierarchical notes)
- Excellent for customizable GUI development
- **Format:** Tiptap JSON (ProseMirror JSON) for primary storage
- **Decision Status:** Confirmed in `12_Pre_Implementation_Plan_Conversation.md` Section 2

**Project Desires Fit:**
- ✓ Full-Featured Text Editor
- - Local File Saving (needs integration)
- - Reminders Attached to Note Files (needs integration)
- ✓ Save, Open, and Edit Popular File Types (extensible)
- ✓ Custom Metadata Association (supports custom nodes)
- ✓ To-Do Lists Within Notes (custom node types)
- ✓ Branched Notes (supports branching content)
- ✓ Non-Destructive Historical Timelines (ProseMirror history)
- ✓ Modern GUI and Features
- ✓ Hierarchical Notes (custom node structure)
- - Timer (needs integration)
- - Alarm (needs integration)

**Implementation Requirements (UX Quality):**
To achieve Google Docs/Word-level UX quality, the following must be implemented:

- [ ] **Custom Styling:** Match visual aesthetic (CSS, design system)
  - Consistent typography
  - Professional font rendering
  - Smooth text rendering (anti-aliasing, subpixel rendering)
  - Proper line height and spacing
  - Clear visual hierarchy
  - Professional color palette
  - Clear visual hierarchy
  - Proper focus states and accessibility

- [ ] **UI Components:** Customize toolbar, menus, formatting UI
  - Professional toolbar design
  - Context menus with expected options
  - Inline formatting toolbar
  - Visual formatting indicators
  - Clear visual separation between content and UI

- [ ] **Animations:** Add smooth transitions and feedback
  - Smooth animations and transitions
  - Consistent button styles and hover states
  - Clear visual feedback for all interactions
  - Smooth scrolling
  - No flickering or layout shifts

- [ ] **Performance:** Optimize rendering for large documents
  - Instant feedback on all actions
  - No lag when typing
  - Fast document loading
  - Smooth cursor movement
  - Quick formatting application
  - Virtual scrolling for large documents (if needed)
  - Lazy loading for complex content

- [ ] **Accessibility:** Implement ARIA, keyboard navigation
  - ARIA labels and roles
  - Keyboard navigation (all features accessible via keyboard)
  - Screen reader support
  - Focus management
  - WCAG 2.1 AA compliance

- [ ] **Polish:** Attention to detail in interactions and visual feedback
  - Familiar keyboard shortcuts (Ctrl+B, Ctrl+I, etc.)
  - Tooltips and help text
  - Keyboard shortcut hints
  - Formatting previews
  - Auto-save with visual indicators
  - Undo/redo with clear feedback
  - Drag-and-drop functionality
  - Pixel-perfect rendering

**Reference:** See `12_Pre_Implementation_Plan_Conversation.md` Section 2 for detailed UX quality analysis.

**Notes:**
- Primary editor for all note content
- Will need custom extensions for hierarchical notes, tasks, etc.
- Tiptap JSON is the primary format for feature-rich editor
- Export/import formats (Markdown, HTML, DOCX) provide portability without compromising primary format
- Decision finalized in `12_Pre_Implementation_Plan_Conversation.md` Section 2
- Support for popular file types (DOCX, PDF, etc.) - future feature via export/import
- **IMPORTANT:** All implementation requirements above must be addressed to achieve target UX quality

---

### 1.5 Styling Solution

**Status:** ✅ **SELECTED**

**Selection:** **CSS Variables + Tailwind CSS + Design System**

**Options from Planning:**
- **CSS Variables** (✅ Required for theming)
  - Enables runtime theme changes
  - Maximum customization capability
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - ✓ Local File Saving
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✓ Branched Notes
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes
  - ✓ Timer
  - ✓ Alarm

- **Tailwind CSS** (✅ Selected - Recommended for rapid development and customization)
  - Utility-first approach for quick styling
  - Easy theme customization
  - Rapid prototyping support
  - Consistent design system
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - ✓ Local File Saving
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✓ Branched Notes
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes
  - ✓ Timer
  - ✓ Alarm

- **Styled Components** (Alternative for component-scoped styling)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - ✓ Local File Saving
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✓ Branched Notes
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes
  - ✓ Timer
  - ✓ Alarm

- **Custom CSS** (For complex components)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - ✓ Local File Saving
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✓ Branched Notes
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes
  - ✓ Timer
  - ✓ Alarm

- **Theme Configuration Files** (✅ Selected - JSON/YAML for non-code customization)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - ✓ Local File Saving
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✓ Branched Notes
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes
  - ✓ Timer
  - ✓ Alarm

**Decision:** **CSS Variables + Tailwind CSS + Design System**

**Rationale:**
- Meets customization priority (CSS Variables enable runtime changes)
- Provides professional polish (Tailwind design system)
- Enables rapid development (Tailwind utilities)
- Supports user theming (CSS Variables can be modified)
- Industry-proven approach (used by major brands)

**Notes:**
- CSS Variables are required regardless of other choices
- Tailwind CSS aligns with customizable GUI priority
- Theme configuration files support non-developer customization
- Decision confirmed in `12_Pre_Implementation_Plan_Conversation.md` Section 5

---

### 1.6 State Management

**Status:** ✅ **SELECTED**

**Selection:** **Hybrid Approach (Context + Zustand)**

**Options from Planning:**
- **Zustand** (✅ Selected - Lightweight, recommended)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - ✓ Local File Saving
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✓ Branched Notes
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes
  - ✓ Timer
  - ✓ Alarm

- **Jotai** (Lightweight, alternative)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - ✓ Local File Saving
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✓ Branched Notes
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes
  - ✓ Timer
  - ✓ Alarm

- **Redux Toolkit** (If complex state needed)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - ✓ Local File Saving
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✓ Branched Notes
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes
  - ✓ Timer
  - ✓ Alarm

- **React Context** (✅ Selected - For simple state)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor
  - - Local File Saving (may need more complex state)
  - - Reminders Attached to Note Files (may need more complex state)
  - - Save, Open, and Edit Popular File Types (may need more complex state)
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes
  - ✗ Branched Notes (complex state management needed)
  - ✗ Non-Destructive Historical Timelines (complex state management needed)
  - ✓ Modern GUI and Features
  - - Hierarchical Notes (may need more complex state)
  - ✓ Timer
  - ✓ Alarm

**Decision:** **Hybrid Approach - Context for UI state, Zustand for data and complex features**

**Rationale:**
- Aligns with functional prototype approach
- Use right tool for each job
- Context for simple UI state (theme, current view)
- Zustand for file operations, hierarchical data, and complex features
- Can migrate Context to Zustand if performance issues arise

**Notes:**
- Start with Context for UI state
- Use Zustand for file operations and hierarchical data
- Monitor performance and migrate if needed
- Decision confirmed in `05_Projected_Issues_And_Research.md` Section 1.2 and 2.2

---

### 1.7 Storage Solutions

**Status:** ✅ **SELECTED**

**Selection:** **Hybrid Storage (File System + SQLite)**

**Options from Planning:**
- **SQLite** (✅ Selected - via Tauri or better-sqlite3)
  - For metadata, tags, projects, branches, timers, alarms
  - Fast queries
  - ACID transactions
  
  **Project Desires Fit:**
  - - Full-Featured Text Editor (content stored separately)
  - ✓ Local File Saving (metadata)
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types (metadata)
  - ✓ Custom Metadata Association
  - ✓ To-Do Lists Within Notes (task state)
  - ✓ Branched Notes (branch relationships)
  - ✓ Non-Destructive Historical Timelines (version metadata)
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes (parent-child relationships)
  - ✓ Timer (timer state and history)
  - ✓ Alarm (alarm scheduling)

- **File System** (✅ Selected - via Tauri/Node.js)
  - For note content files
  - Tiptap JSON format (primary)
  - Export/import: Markdown, HTML, DOCX
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor (content storage)
  - ✓ Local File Saving
  - - Reminders Attached to Note Files (metadata needed)
  - ✓ Save, Open, and Edit Popular File Types
  - - Custom Metadata Association (may need database)
  - ✓ To-Do Lists Within Notes (content storage)
  - ✓ Branched Notes (content storage)
  - ✓ Non-Destructive Historical Timelines (version storage)
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes (content storage)
  - - Timer (state persistence needed)
  - - Alarm (scheduling data needed)

**Decision:** **Hybrid Storage (File System + SQLite)**

**Rationale:**
- Industry standard (Obsidian, Joplin, Notion use this)
- Best balance of flexibility and performance
- File system for content (flexibility, versioning, human-readable)
- SQLite for metadata (fast queries, relationships, ACID transactions)
- Document ID links files to database entries

**Notes:**
- SQLite for structured data (metadata, relationships)
- File system for note content (flexibility, versioning)
- Use document ID to link files and database entries
- Decision confirmed in `05_Projected_Issues_And_Research.md` Section 2.3
- Hierarchical notes: Adjacency List Model with recursive CTEs

---

### 1.8 Search Solution

**Status:** ⏳ Pending Decision

**Options from Planning:**
- **lunr.js** (Full-text search, client-side indexing)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor (search content)
  - ✓ Local File Saving (search files)
  - ✓ Reminders Attached to Note Files (search reminders)
  - ✓ Save, Open, and Edit Popular File Types (search imported files)
  - ✓ Custom Metadata Association (search metadata)
  - ✓ To-Do Lists Within Notes (search tasks)
  - ✓ Branched Notes (search branches)
  - ✓ Non-Destructive Historical Timelines (search history)
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes (search hierarchy)
  - - Timer (limited relevance)
  - - Alarm (limited relevance)

- **flexsearch** (Full-text search, client-side indexing, fast performance)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor (search content)
  - ✓ Local File Saving (search files)
  - ✓ Reminders Attached to Note Files (search reminders)
  - ✓ Save, Open, and Edit Popular File Types (search imported files)
  - ✓ Custom Metadata Association (search metadata)
  - ✓ To-Do Lists Within Notes (search tasks)
  - ✓ Branched Notes (search branches)
  - ✓ Non-Destructive Historical Timelines (search history)
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes (search hierarchy)
  - - Timer (limited relevance)
  - - Alarm (limited relevance)

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Client-side search for privacy and performance
- Will need to index note content, metadata, tags, etc.

---

### 1.9 Date/Time Library

**Status:** ⏳ Pending Decision

**Options from Planning:**
- **date-fns** (Date manipulation, timezone handling, formatting)
  
  **Project Desires Fit:**
  - - Full-Featured Text Editor (limited relevance)
  - ✓ Local File Saving (timestamps)
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types (timestamps)
  - ✓ Custom Metadata Association (creation dates)
  - ✓ To-Do Lists Within Notes (due dates)
  - ✓ Branched Notes (timestamps)
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes (timestamps)
  - ✓ Timer
  - ✓ Alarm

- **Luxon** (Date manipulation, timezone handling, formatting)
  
  **Project Desires Fit:**
  - - Full-Featured Text Editor (limited relevance)
  - ✓ Local File Saving (timestamps)
  - ✓ Reminders Attached to Note Files
  - ✓ Save, Open, and Edit Popular File Types (timestamps)
  - ✓ Custom Metadata Association (creation dates)
  - ✓ To-Do Lists Within Notes (due dates)
  - ✓ Branched Notes (timestamps)
  - ✓ Non-Destructive Historical Timelines
  - ✓ Modern GUI and Features
  - ✓ Hierarchical Notes (timestamps)
  - ✓ Timer
  - ✓ Alarm

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Critical for calendar, reminders, timers, alarms
- Must handle timezones properly

---

### 1.10 Testing Framework

**Status:** ⏳ Pending Decision

**Options from Planning:**
- **Vitest** (Fast, Vite-native, recommended)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor (unit tests)
  - ✓ Local File Saving (unit tests)
  - ✓ Reminders Attached to Note Files (unit tests)
  - ✓ Save, Open, and Edit Popular File Types (unit tests)
  - ✓ Custom Metadata Association (unit tests)
  - ✓ To-Do Lists Within Notes (unit tests)
  - ✓ Branched Notes (unit tests)
  - ✓ Non-Destructive Historical Timelines (unit tests)
  - ✓ Modern GUI and Features (unit tests)
  - ✓ Hierarchical Notes (unit tests)
  - ✓ Timer (unit tests)
  - ✓ Alarm (unit tests)

- **React Testing Library** (For component testing)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor (component tests)
  - ✓ Local File Saving (component tests)
  - ✓ Reminders Attached to Note Files (component tests)
  - ✓ Save, Open, and Edit Popular File Types (component tests)
  - ✓ Custom Metadata Association (component tests)
  - ✓ To-Do Lists Within Notes (component tests)
  - ✓ Branched Notes (component tests)
  - ✓ Non-Destructive Historical Timelines (component tests)
  - ✓ Modern GUI and Features (component tests)
  - ✓ Hierarchical Notes (component tests)
  - ✓ Timer (component tests)
  - ✓ Alarm (component tests)

- **Playwright** (For E2E testing)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor (E2E tests)
  - ✓ Local File Saving (E2E tests)
  - ✓ Reminders Attached to Note Files (E2E tests)
  - ✓ Save, Open, and Edit Popular File Types (E2E tests)
  - ✓ Custom Metadata Association (E2E tests)
  - ✓ To-Do Lists Within Notes (E2E tests)
  - ✓ Branched Notes (E2E tests)
  - ✓ Non-Destructive Historical Timelines (E2E tests)
  - ✓ Modern GUI and Features (E2E tests)
  - ✓ Hierarchical Notes (E2E tests)
  - ✓ Timer (E2E tests)
  - ✓ Alarm (E2E tests)

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Start with Vitest for unit tests
- Add React Testing Library for components
- Add Playwright later for E2E (not critical for MVP)

---

### 1.11 Build Tools

**Status:** ✅ **SELECTED**

**Selection:** **Vite + TypeScript + ESLint + Prettier + HMR**

**Options from Planning:**
- **Vite** (✅ Selected - Fast build tool, excellent HMR for rapid GUI iteration)
  
  **Project Desires Fit:**
  - ✓ Full-Featured Text Editor (development speed)
  - ✓ Local File Saving (development speed)
  - ✓ Reminders Attached to Note Files (development speed)
  - ✓ Save, Open, and Edit Popular File Types (development speed)
  - ✓ Custom Metadata Association (development speed)
  - ✓ To-Do Lists Within Notes (development speed)
  - ✓ Branched Notes (development speed)
  - ✓ Non-Destructive Historical Timelines (development speed)
  - ✓ Modern GUI and Features (development speed)
  - ✓ Hierarchical Notes (development speed)
  - ✓ Timer (development speed)
  - ✓ Alarm (development speed)

- **TypeScript Compiler** (✅ Selected)
- **ESLint** + **Prettier** (✅ Selected)
- **Hot Module Replacement (HMR)** (✅ Selected - Critical for customizable GUI development)
- **Component Playground/Storybook** (Optional, for isolated component development)

**Decision:** **Vite + TypeScript + ESLint + Prettier + HMR**

**Rationale:**
- Vite provides excellent HMR for rapid GUI iteration
- HMR is critical for customizable GUI development
- Fast build times support functional prototype approach
- TypeScript, ESLint, and Prettier ensure code quality

**Notes:**
- Vite is strongly recommended for HMR
- HMR is critical for rapid GUI customization
- Storybook can be added later if needed

---

## 2. Architecture Decisions

### 2.1 Architecture Pattern

**Status:** ✅ Selected

**Selection:** 
- **Component-Based Architecture**
- **Layered Architecture**
- **Service-Oriented Structure**
- **Feature-Based Organization**

**Rationale:**
- Supports modular, maintainable codebase
- Enables feature-packed development
- Aligns with customizable GUI priority
- Supports rapid iteration

**Notes:**
- Feature-based organization is critical for maintainability
- Layers: Presentation → Application → Domain → Infrastructure

---

### 2.2 Project Structure

**Status:** ⏳ Pending Decision

**Options from Planning:**
- Feature-based folder structure (recommended)
- Layer-based folder structure (alternative)

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Feature-based aligns with maintainable, feature-packed priority
- See `03_Project_Planning.md` Section 2.2 for detailed structure

---

### 2.3 Component Architecture

**Status:** ⏳ Pending Decision

**Options from Planning:**
- Highly modular, reusable UI components
- Props-based configuration
- Component composition patterns
- Clear separation between logic and presentation

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Critical for customizable GUI development
- Must support rapid visual changes

---

## 3. Development Approach Decisions

### 3.1 Development Workflow

**Status:** ✅ Selected

**Selection:** **User-Driven Functional Prototype Approach**

**Workflow:**
1. Build → Use → Refine → Repeat
2. Prioritize working code over perfect code
3. Refactor when patterns emerge, not preemptively
4. Make GUI changes quickly and test visually
5. Maintain code quality but don't let it block progress

**Rationale:**
- Aligns with user-driven development priority
- Enables rapid iteration
- Supports customizable GUI development
- Maintains focus on functionality

**Notes:**
- This is the core development philosophy
- All other decisions should support this approach

---

### 3.2 Code Quality Standards

**Status:** ⏳ Pending Decision

**Options from Planning:**
- TypeScript for type safety (selected)
- Comprehensive file header comments (required)
- Numbered comments for complex logic (required)
- Self-documenting code (preferred)
- Tests for critical functionality (not everything initially)

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Balance between quality and rapid development
- Documentation standards are non-negotiable
- Testing strategy should support prototype approach

---

## 4. Feature Implementation Priorities

### 4.1 MVP Feature Set

**Status:** ⏳ Pending Decision

**Proposed MVP Features:**
- [ ] Basic text editor (Tiptap)
- [ ] File save/load (local persistence)
- [ ] Basic UI (customizable via CSS variables)
- [ ] Theme system foundation
- [ ] [Additional feature 1]
- [ ] [Additional feature 2]

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- MVP should be functional and usable quickly
- Enables immediate user feedback
- Foundation for future features

---

### 4.2 Feature Implementation Order

**Status:** ⏳ Pending Decision

**Proposed Order:**
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]
...

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Order should support functional prototype approach
- Each feature should be usable before moving to next
- Consider dependencies between features

---

## 5. Development Tools and Environment

### 5.1 Package Manager

**Status:** ⏳ Pending Decision

**Options from Planning:**
- **npm**
- **pnpm** (Faster, more efficient)

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Lock files required for reproducibility

---

### 5.2 Version Control

**Status:** ✅ Selected

**Selection:** **Git** with GitHub/GitLab

**Rationale:**
- Standard version control
- Feature branch workflow
- Code reviews required

**Notes:**
- Feature branch workflow supports prototype approach
- Small, frequent commits

---

### 5.3 Code Quality Tools

**Status:** ⏳ Pending Decision

**Options from Planning:**
- **ESLint** (Linting)
- **Prettier** (Formatting)
- **TypeScript** (Type checking)
- Pre-commit hooks

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Pre-commit hooks can be added later
- Start with basic linting and formatting

---

## 6. Documentation Standards

### 6.1 File Header Comments

**Status:** ✅ Required

**Selection:** **Comprehensive file header comments** (see `03_Project_Planning.md` Section 3.1)

**Rationale:**
- Required for maintainable codebase
- Supports AI-assisted development
- Documents code purpose and relationships

**Notes:**
- Must be updated when fundamental changes occur
- Template defined in planning document

---

### 6.2 Comment Numbering System

**Status:** ✅ Required

**Selection:** **Numbered comments with bi-directional relationships** (see `00_Codebase_Comments_Guidelines.md`)

**Rationale:**
- Required for maintainable codebase
- Enables code navigation
- Documents relationships between code sections

**Notes:**
- Format: `Comment 001`, `Comment 002`, etc.
- Shared numbers for related code
- Registry must be maintained

---

## 7. Customization and Theming

### 7.1 Theme System

**Status:** ⏳ Pending Decision

**Options from Planning:**
- CSS Variables (required)
- Theme configuration files (JSON/YAML)
- Component-level theme props
- User-customizable themes

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Critical for customizable GUI development
- Must support rapid visual changes
- Should enable non-code customization

---

### 7.2 GUI Customization Tools

**Status:** ⏳ Pending Decision

**Options from Planning:**
- Hot Module Replacement (HMR) - required
- Component playground/storybook (optional)
- Visual debugging tools
- Theme editor/preview tools

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- HMR is critical for rapid GUI iteration
- Other tools can be added as needed

---

## 8. Storage and Data Management

### 8.1 Data Models

**Status:** ⏳ Pending Decision

**Data Models Needed:**
- Notes (hierarchical structure)
- Branches
- Metadata (tags, projects, document numbers)
- Timers
- Alarms
- Reminders
- Calendar entries
- Historical versions

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Models should support all project desires
- Consider relationships between models
- Design for scalability

---

### 8.2 File Formats

**Status:** ✅ **SELECTED**

**Selection:** **Tiptap JSON (ProseMirror JSON) for Primary Storage**

**Options from Planning:**
- **Tiptap JSON (ProseMirror JSON)** (✅ Selected - Primary storage format)
  - Built on ProseMirror (same foundation as Google Docs collaboration)
  - Supports ALL rich text features (100+ extensions available)
  - Preserves exact formatting (no data loss)
  - Extensible architecture (add custom features easily)
  - Direct compatibility with Tiptap editor
  - Supports complex structures (tables, nested lists)
  - Industry standard for modern rich text editors
  - Can export/import to DOCX, HTML, Markdown when needed
  - Future-proof (ProseMirror is actively maintained)
- **Markdown** (Export/import format)
- **HTML** (Export/import format)
- **DOCX** (Export/import format - future feature)
- **SQLite** (For structured metadata - see Section 1.7)

**Decision:** **Tiptap JSON (ProseMirror JSON) for Primary Storage**

**Rationale:**
- Supports all Google Docs/Word features
- UX Quality Reliability: HIGH - Proven foundation, pre-built UI components
- UX Quality Ease: HIGH - Well-documented, active community, real-world examples (Notion, Linear)
- Real-World Proof: Notion and Linear achieve Google Docs-level UX using ProseMirror/Tiptap

**Implementation Requirements (UX Quality):**
To achieve Google Docs/Word-level UX quality, the following must be implemented:

- [ ] **Custom Styling:** Match visual aesthetic (CSS, design system)
  - Consistent typography
  - Professional font rendering
  - Smooth text rendering (anti-aliasing, subpixel rendering)
  - Proper line height and spacing
  - Clear visual hierarchy
  - Professional color palette
  - Clear visual hierarchy
  - Proper focus states and accessibility

- [ ] **UI Components:** Customize toolbar, menus, formatting UI
  - Professional toolbar design
  - Context menus with expected options
  - Inline formatting toolbar
  - Visual formatting indicators
  - Clear visual separation between content and UI

- [ ] **Animations:** Add smooth transitions and feedback
  - Smooth animations and transitions
  - Consistent button styles and hover states
  - Clear visual feedback for all interactions
  - Smooth scrolling
  - No flickering or layout shifts

- [ ] **Performance:** Optimize rendering for large documents
  - Instant feedback on all actions
  - No lag when typing
  - Fast document loading
  - Smooth cursor movement
  - Quick formatting application
  - Virtual scrolling for large documents (if needed)
  - Lazy loading for complex content

- [ ] **Accessibility:** Implement ARIA, keyboard navigation
  - ARIA labels and roles
  - Keyboard navigation (all features accessible via keyboard)
  - Screen reader support
  - Focus management
  - WCAG 2.1 AA compliance

- [ ] **Polish:** Attention to detail in interactions and visual feedback
  - Familiar keyboard shortcuts (Ctrl+B, Ctrl+I, etc.)
  - Tooltips and help text
  - Keyboard shortcut hints
  - Formatting previews
  - Auto-save with visual indicators
  - Undo/redo with clear feedback
  - Drag-and-drop functionality
  - Pixel-perfect rendering

**Reference:** See `12_Pre_Implementation_Plan_Conversation.md` Section 2 for detailed UX quality analysis.

**Notes:**
- Tiptap JSON is the primary format for feature-rich editor
- Export/import formats (Markdown, HTML, DOCX) provide portability without compromising primary format
- Decision finalized in `12_Pre_Implementation_Plan_Conversation.md` Section 2
- Support for popular file types (DOCX, PDF, etc.) - future feature via export/import
- **IMPORTANT:** All implementation requirements above must be addressed to achieve target UX quality

---

## 9. Performance and Optimization

### 9.1 Performance Priorities

**Status:** ⏳ Pending Decision

**Considerations:**
- Initial load time
- Editor performance with large notes
- Search performance
- Calendar rendering with many entries
- Branch tree performance

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Performance should be considered from start
- But don't optimize prematurely
- Measure and optimize based on real usage

---

## 10. Security and Privacy

### 10.1 Security Considerations

**Status:** ⏳ Pending Decision

**Considerations:**
- Local file storage security
- Data encryption (if needed)
- System permissions (alarms, notifications)
- Privacy of user data

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- All data stored locally
- No cloud sync (unless added later)
- Consider encryption for sensitive notes

---

## 11. Accessibility

### 11.1 Accessibility Standards

**Status:** ⏳ Pending Decision

**Options from Planning:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Focus management

**Decision:** [To be determined]

**Rationale:** [To be added when decision is made]

**Notes:**
- Important for maintainable, professional application
- Can be added iteratively
- Start with basic accessibility

---

## 12. Implementation Research and Options

> **Note:** This section contains researched options with pros/cons for critical implementation decisions. These supplement the decisions already made in previous sections.

---

### 12.1 Database Schema Options

**Status:** ⏳ **RESEARCHED - OPTIONS PROVIDED**

**Context:** Hybrid storage (File System + SQLite) is already selected. This section provides schema design pattern options.

#### Option 1: Adjacency List Model (RECOMMENDED)

**Description:** Simple parent-child relationships using `parent_id` foreign key.

**Schema Pattern:**
```sql
CREATE TABLE notes (
    document_id TEXT PRIMARY KEY,
    parent_id TEXT,
    title TEXT,
    created_at DATETIME,
    modified_at DATETIME,
    file_path TEXT,
    FOREIGN KEY (parent_id) REFERENCES notes(document_id)
);

-- Query children
SELECT * FROM notes WHERE parent_id = ?;

-- Query ancestors (recursive CTE)
WITH RECURSIVE ancestors AS (
    SELECT * FROM notes WHERE document_id = ?
    UNION ALL
    SELECT n.* FROM notes n
    INNER JOIN ancestors a ON n.document_id = a.parent_id
)
SELECT * FROM ancestors;
```

**Pros:**
- ✅ Simple to understand and implement
- ✅ Easy to insert/move nodes (just update parent_id)
- ✅ Minimal storage overhead
- ✅ Standard SQL pattern, well-documented
- ✅ Good for moderate depth hierarchies (<10 levels)
- ✅ Works well with SQLite recursive CTEs

**Cons:**
- ❌ Querying all descendants requires recursive CTE (can be slower for deep trees)
- ❌ Finding depth requires recursive query
- ❌ Moving subtrees requires updating all children

**Use Case:** Recommended for most note-taking apps. Used by Obsidian, Notion, Joplin.

**Performance:** Good for <10,000 notes, <10 levels deep.

---

#### Option 2: Closure Table Model

**Description:** Stores all ancestor-descendant relationships in separate table.

**Schema Pattern:**
```sql
CREATE TABLE notes (
    document_id TEXT PRIMARY KEY,
    title TEXT,
    created_at DATETIME,
    modified_at DATETIME,
    file_path TEXT
);

CREATE TABLE note_closure (
    ancestor_id TEXT,
    descendant_id TEXT,
    depth INTEGER,
    PRIMARY KEY (ancestor_id, descendant_id),
    FOREIGN KEY (ancestor_id) REFERENCES notes(document_id),
    FOREIGN KEY (descendant_id) REFERENCES notes(document_id)
);
```

**Pros:**
- ✅ Very fast queries for descendants/ancestors (no recursion)
- ✅ Easy to find depth
- ✅ Good for complex queries (all descendants, all ancestors)
- ✅ Efficient for read-heavy workloads

**Cons:**
- ❌ More complex to maintain (must update closure table on every change)
- ❌ Higher storage overhead (stores all relationships)
- ❌ Slower inserts/moves (must update closure table)
- ❌ More complex code

**Use Case:** Best for read-heavy apps with complex hierarchy queries.

**Performance:** Excellent for queries, slower for writes.

---

#### Option 3: Nested Set Model

**Description:** Uses left/right boundaries to represent tree structure.

**Schema Pattern:**
```sql
CREATE TABLE notes (
    document_id TEXT PRIMARY KEY,
    title TEXT,
    left_bound INTEGER,
    right_bound INTEGER,
    created_at DATETIME,
    modified_at DATETIME,
    file_path TEXT
);
```

**Pros:**
- ✅ Very fast queries for subtrees (single range query)
- ✅ Easy to find all descendants
- ✅ Good for read-heavy workloads

**Cons:**
- ❌ Complex to maintain (must recalculate boundaries on changes)
- ❌ Slow inserts/moves (may require recalculating many nodes)
- ❌ Not intuitive to understand
- ❌ Can be fragile (boundary conflicts)

**Use Case:** Rarely used in modern apps. Not recommended for note-taking apps.

**Performance:** Fast reads, very slow writes.

---

#### Option 4: Materialized Path Model

**Description:** Stores full path from root to node (e.g., "/root/parent/child").

**Schema Pattern:**
```sql
CREATE TABLE notes (
    document_id TEXT PRIMARY KEY,
    title TEXT,
    path TEXT,  -- e.g., "/root/parent/child"
    created_at DATETIME,
    modified_at DATETIME,
    file_path TEXT
);
```

**Pros:**
- ✅ Very simple queries (LIKE queries on path)
- ✅ Easy to understand
- ✅ Good for finding siblings, ancestors
- ✅ No recursive queries needed

**Cons:**
- ❌ Path updates required when moving nodes
- ❌ Path length limits (though usually not an issue)
- ❌ LIKE queries can be slower than indexed lookups
- ❌ Moving subtrees requires updating all descendants' paths

**Use Case:** Good for file-system-like hierarchies. Used by some note apps.

**Performance:** Good for moderate hierarchies, path updates can be slow.

---

**Recommendation:** **Option 1 - Adjacency List Model**

**Rationale:**
- Simple and maintainable
- Good performance for typical note-taking use cases
- SQLite recursive CTEs handle queries efficiently
- Industry standard for note apps
- Easy to implement and debug
- Good balance of simplicity and performance

**Reference:** See `09_Project_Architecture.md` Section 3.2 for current schema design.

---

### 12.2 Tiptap Extensions for Word/Google Docs/Obsidian Parity

**Status:** ⏳ **RESEARCHED - COMPREHENSIVE LIST**

**Context:** App must meet or exceed aesthetic and functionality of Microsoft Word, Google Docs, and Obsidian. This requires comprehensive Tiptap extension coverage.

#### Core Formatting Extensions (REQUIRED)

**Basic Text Formatting:**
- `@tiptap/extension-bold` - Bold text
- `@tiptap/extension-italic` - Italic text
- `@tiptap/extension-underline` - Underline text
- `@tiptap/extension-strike` - Strikethrough text
- `@tiptap/extension-code` - Inline code
- `@tiptap/extension-subscript` - Subscript text
- `@tiptap/extension-superscript` - Superscript text
- `@tiptap/extension-highlight` - Text highlighting
- `@tiptap/extension-text-style` - Custom text styles

**Headings:**
- `@tiptap/extension-heading` - H1-H6 headings

**Lists:**
- `@tiptap/extension-bullet-list` - Bullet lists
- `@tiptap/extension-ordered-list` - Numbered lists (auto-incrementing)
- `@tiptap/extension-task-list` - Checkbox/task lists
- `@tiptap/extension-list-item` - List item support

**Alignment:**
- `@tiptap/extension-text-align` - Left, center, right, justify alignment

**Indentation:**
- `@tiptap/extension-indent` - Text indentation

---

#### Advanced Formatting Extensions (REQUIRED)

**Links:**
- `@tiptap/extension-link` - Hyperlinks (internal note links + external URLs)

**Images:**
- `@tiptap/extension-image` - Image insertion and display
- Custom image extension for:
  - Drag-and-drop placement
  - Resizing handles
  - Caption support
  - Alignment options

**Tables:**
- `@tiptap/extension-table` - Table creation
- `@tiptap/extension-table-row` - Table rows
- `@tiptap/extension-table-cell` - Table cells
- `@tiptap/extension-table-header` - Header cells
- Custom table extensions for:
  - Column/row resizing
  - Cell merging
  - Table styling

**Code Blocks:**
- `@tiptap/extension-code-block` - Code blocks with syntax highlighting
- Integration with syntax highlighter (Prism.js or highlight.js)

**Blockquotes:**
- `@tiptap/extension-blockquote` - Blockquote styling

**Horizontal Rules:**
- `@tiptap/extension-horizontal-rule` - Horizontal dividers

**Hard Breaks:**
- `@tiptap/extension-hard-break` - Line breaks

---

#### Advanced Features (REQUIRED for Parity)

**Marks (Text Decorations):**
- `@tiptap/extension-color` - Text color
- `@tiptap/extension-font-family` - Font family selection
- Custom mark extensions for:
  - Font size
  - Background color
  - Custom styling

**History:**
- `@tiptap/extension-history` - Undo/redo (REQUIRED)

**Focus:**
- `@tiptap/extension-focus` - Focus management

**Placeholder:**
- `@tiptap/extension-placeholder` - Placeholder text

**Dropcursor:**
- `@tiptap/extension-dropcursor` - Visual feedback on drag

**Gapcursor:**
- `@tiptap/extension-gapcursor` - Cursor between blocks

---

#### Custom Extensions Needed (REQUIRED for Project Features)

**Metadata Integration:**
- Custom node for inline metadata tags
- Custom node for document numbers
- Custom mark for metadata highlighting

**Branch Indicators:**
- Custom node for branch indicators
- Custom mark for branch-aware content

**Reminder Indicators:**
- Custom node for reminder indicators
- Integration with reminder system

**Hierarchical Note Links:**
- Custom link extension for internal note references
- Link preview on hover
- Link following

**Checkbox Lists (Document Editor):**
- Enhanced task list with:
  - Due dates
  - Priorities
  - Subtasks
  - Integration with Do/Due tab

---

#### Obsidian-Specific Features

**Wikilinks:**
- Custom extension for `[[note name]]` syntax
- Auto-completion
- Link creation on note creation

**Tags:**
- Custom extension for `#tag` syntax
- Tag autocomplete
- Tag search integration

**Callouts:**
- Custom node for callout blocks (info, warning, note, etc.)

**Math:**
- `@tiptap/extension-math` or custom extension for LaTeX math
- Inline and block math support

---

#### Google Docs/Word Parity Features

**Comments:**
- Custom extension for comments/suggestions
- Comment threads
- Resolve/reject comments

**Collaboration (Future):**
- `@tiptap/extension-collaboration` - Real-time collaboration
- Y.js integration for conflict resolution

**Track Changes:**
- Custom extension for change tracking
- Accept/reject changes
- Show/hide changes

**Find and Replace:**
- Custom extension for find/replace functionality
- Regex support
- Replace all

**Spell Check:**
- Integration with browser spell check API
- Custom dictionary support

**Grammar Check:**
- Integration with grammar checking service (future)

---

**Total Extensions Required:** ~40+ extensions (core + custom)

**Implementation Priority:**
1. **Phase 1 (MVP GUI):** Core formatting, headings, lists, links, images
2. **Phase 2 (Core Features):** Tables, code blocks, advanced formatting
3. **Phase 3 (Advanced):** Custom extensions for metadata, branches, reminders
4. **Phase 4 (Parity):** Comments, track changes, collaboration

**Reference:** See `12_Proposed_Selections_From_Project_Planning.md` Section 1.4 for Tiptap selection rationale.

---

### 12.3 TypeScript Interface Patterns

**Status:** ⏳ **RESEARCHED - OPTIONS PROVIDED**

**Context:** Need to define TypeScript interfaces for all domain models. Multiple patterns available.

#### Option 1: Domain-Driven Design (DDD) Pattern (RECOMMENDED)

**Description:** Separate interfaces by domain, use value objects and entities.

**Structure:**
```typescript
// Domain entities (have identity)
interface Note {
  documentId: string;  // Identity
  parentId: string | null;
  title: string;
  content: TiptapJSON;
  metadata: NoteMetadata;
  createdAt: Date;
  modifiedAt: Date;
}

// Value objects (no identity, immutable)
interface NoteMetadata {
  tags: string[];
  projects: string[];
  documentNumber: string;
}

// Domain services
interface NoteService {
  createNote(data: CreateNoteData): Promise<Note>;
  updateNote(id: string, data: UpdateNoteData): Promise<Note>;
  deleteNote(id: string): Promise<void>;
}

// Data transfer objects (DTOs)
interface CreateNoteData {
  title: string;
  parentId?: string | null;
  content?: TiptapJSON;
}

interface UpdateNoteData {
  title?: string;
  content?: TiptapJSON;
  metadata?: Partial<NoteMetadata>;
}
```

**Pros:**
- ✅ Clear separation of concerns
- ✅ Type safety throughout application
- ✅ Easy to understand domain model
- ✅ Good for complex business logic
- ✅ Supports validation at type level
- ✅ Clear boundaries between layers

**Cons:**
- ❌ More boilerplate code
- ❌ Can be overkill for simple models
- ❌ Requires discipline to maintain

**Use Case:** Recommended for maintainable, feature-packed codebase.

---

#### Option 2: Simple Interface Pattern

**Description:** Flat interfaces, minimal structure.

**Structure:**
```typescript
interface Note {
  documentId: string;
  parentId?: string;
  title: string;
  content: any;  // TiptapJSON
  tags?: string[];
  projects?: string[];
  createdAt: string;  // ISO string
  modifiedAt: string;
}
```

**Pros:**
- ✅ Simple and quick to implement
- ✅ Less boilerplate
- ✅ Easy to understand
- ✅ Good for prototyping

**Cons:**
- ❌ Less type safety (any types)
- ❌ No validation
- ❌ Can become messy as features grow
- ❌ Harder to maintain long-term

**Use Case:** Good for MVP/prototype, but will need refactoring.

---

#### Option 3: Branded Types Pattern

**Description:** Use branded types for IDs to prevent mixing.

**Structure:**
```typescript
type DocumentId = string & { readonly brand: unique symbol };
type TagId = number & { readonly brand: unique symbol };

interface Note {
  documentId: DocumentId;
  parentId: DocumentId | null;
  title: string;
  content: TiptapJSON;
}

function createNoteId(id: string): DocumentId {
  return id as DocumentId;
}
```

**Pros:**
- ✅ Prevents ID mixing bugs
- ✅ Type safety at compile time
- ✅ No runtime overhead
- ✅ Good for complex systems

**Cons:**
- ❌ More verbose
- ❌ Requires type assertions
- ❌ Can be confusing for beginners

**Use Case:** Good for large codebases with many ID types.

---

#### Option 4: Discriminated Unions Pattern

**Description:** Use discriminated unions for variant types.

**Structure:**
```typescript
type CalendarEvent = 
  | { type: 'one-time'; date: Date; }
  | { type: 'recurring'; pattern: RecurrencePattern; }
  | { type: 'all-day'; date: Date; };

type NoteContent = 
  | { type: 'tiptap'; content: TiptapJSON; }
  | { type: 'markdown'; content: string; }
  | { type: 'html'; content: string; };
```

**Pros:**
- ✅ Type-safe variant handling
- ✅ Exhaustive checking
- ✅ Clear type narrowing
- ✅ Good for polymorphic data

**Cons:**
- ❌ More complex
- ❌ Requires type guards
- ❌ Can be verbose

**Use Case:** Good for features with multiple variants (calendar events, content types).

---

**Recommendation:** **Option 1 - Domain-Driven Design Pattern** (with Option 4 for variants)

**Rationale:**
- Aligns with maintainable codebase priority
- Supports feature-packed application
- Clear separation of concerns
- Type safety throughout
- Easy to extend as features grow
- Use discriminated unions where appropriate (calendar events, content types)

**Core Interfaces Needed:**
- `Note`, `NoteMetadata`, `CreateNoteData`, `UpdateNoteData`
- `CalendarEvent`, `RecurrencePattern`, `CreateEventData`
- `TodoItem`, `CreateTodoData`, `UpdateTodoData`
- `Timer`, `Alarm`, `Reminder`
- `Branch`, `BranchPoint`, `CreateBranchData`
- `Version`, `VersionSnapshot`
- `Tag`, `Project`, `MetadataSearchResult`
- `TiptapJSON` (from Tiptap types)

---

### 12.4 Auto-Save Strategy Options

**Status:** ⏳ **RESEARCHED - OPTIONS PROVIDED**

**Context:** Need reliable auto-save with conflict resolution and user feedback.

#### Option 1: Debounced Auto-Save with Last-Write-Wins (RECOMMENDED)

**Description:** Debounce saves (500ms), use last-write-wins for conflicts.

**Implementation:**
```typescript
// Debounce: 500ms after last keystroke
const debouncedSave = useDebounce(
  (content: TiptapJSON) => saveNote(noteId, content),
  500
);

// Last-write-wins conflict resolution
async function saveNote(id: string, content: TiptapJSON) {
  const current = await getNote(id);
  const newVersion = {
    ...current,
    content,
    modifiedAt: new Date(),
    version: current.version + 1
  };
  await storage.saveNote(newVersion);
}
```

**Pros:**
- ✅ Simple to implement
- ✅ Good performance (debouncing reduces saves)
- ✅ Fast conflict resolution
- ✅ Standard pattern used by most editors
- ✅ Works well for single-user scenarios

**Cons:**
- ❌ Can lose changes if two instances edit simultaneously
- ❌ No merge capability
- ❌ User may not notice conflicts

**Use Case:** Recommended for single-user desktop app.

**Visual Feedback:**
- "Saving..." indicator during debounce
- "Saved" indicator after successful save
- "Error" indicator if save fails

---

#### Option 2: Operational Transform (OT)

**Description:** Transform operations to resolve conflicts.

**Implementation:**
```typescript
// Store operations, not content
interface Operation {
  type: 'insert' | 'delete' | 'format';
  position: number;
  content?: string;
  timestamp: number;
}

// Transform operations to resolve conflicts
function transform(op1: Operation, op2: Operation): Operation {
  // Complex transformation logic
}
```

**Pros:**
- ✅ Handles conflicts intelligently
- ✅ Preserves all changes when possible
- ✅ Good for collaboration (future)

**Cons:**
- ❌ Very complex to implement
- ❌ High overhead
- ❌ Overkill for single-user app
- ❌ Requires operation history storage

**Use Case:** Only needed for real-time collaboration (future feature).

---

#### Option 3: Version-Based Conflict Resolution

**Description:** Store versions, detect conflicts, prompt user.

**Implementation:**
```typescript
interface Note {
  documentId: string;
  content: TiptapJSON;
  version: number;  // Increment on each save
  modifiedAt: Date;
}

async function saveNote(id: string, content: TiptapJSON, expectedVersion: number) {
  const current = await getNote(id);
  if (current.version !== expectedVersion) {
    // Conflict detected - prompt user
    return handleConflict(current, content);
  }
  // No conflict - save normally
  await storage.saveNote({ ...current, content, version: current.version + 1 });
}
```

**Pros:**
- ✅ Detects conflicts reliably
- ✅ User can choose resolution
- ✅ Prevents accidental overwrites
- ✅ Good for multi-instance scenarios

**Cons:**
- ❌ More complex than last-write-wins
- ❌ Requires user interaction on conflict
- ❌ Slower than last-write-wins

**Use Case:** Good if user may have multiple app instances open.

---

#### Option 4: Hybrid: Debounce + Version Check

**Description:** Combine debouncing with version checking.

**Implementation:**
```typescript
// Debounce saves
const debouncedSave = useDebounce(saveNote, 500);

// Check version before save
async function saveNote(id: string, content: TiptapJSON) {
  const current = await getNote(id);
  const lastSaved = getLastSavedVersion(id);
  
  if (current.version !== lastSaved.version) {
    // Conflict - use last-write-wins but warn user
    showConflictWarning();
  }
  
  await storage.saveNote({ ...current, content, version: current.version + 1 });
  updateLastSavedVersion(id, current.version + 1);
}
```

**Pros:**
- ✅ Best of both worlds
- ✅ Fast (debouncing) + safe (version check)
- ✅ Warns user of conflicts
- ✅ Still uses last-write-wins for speed

**Cons:**
- ❌ More complex than pure last-write-wins
- ❌ Still loses changes on conflict (but warns)

**Use Case:** Recommended for production app with conflict awareness.

---

**Recommendation:** **Option 4 - Hybrid: Debounce + Version Check**

**Rationale:**
- Fast performance (debouncing)
- Conflict detection and warning
- Still uses last-write-wins for speed
- Good balance of performance and safety
- Can upgrade to OT later if collaboration needed

**Debounce Time:** 500ms (standard for rich text editors)

**Save Triggers:**
- Debounced after keystroke (500ms)
- Immediate on blur (user leaves editor)
- Immediate on app close
- Periodic backup (every 30 seconds if modified)

**Visual Feedback:**
- "Saving..." (during debounce)
- "Saved" (after successful save, fade after 2s)
- "Error" (if save fails, persistent until resolved)
- "Conflict detected" (warning if version mismatch)

---

### 12.5 Development Environment Setup Options

**Status:** ⏳ **RESEARCHED - OPTIONS PROVIDED**

**Context:** Tauri 2.0 requires Rust toolchain + Node.js. Need to document setup options.

#### Option 1: Official Tauri CLI Setup (RECOMMENDED)

**Description:** Use `create-tauri-app` CLI for initial setup.

**Setup Steps:**
```bash
# 1. Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 2. Install Node.js (v18+)
# Download from nodejs.org or use nvm

# 3. Install Tauri CLI
npm install -g @tauri-apps/cli

# 4. Create project
npm create tauri-app@latest

# 5. Install dependencies
cd my-app
npm install

# 6. Run development
npm run tauri dev
```

**Pros:**
- ✅ Official, well-documented
- ✅ Handles all configuration automatically
- ✅ Includes best practices
- ✅ Easy to get started
- ✅ Supports all platforms

**Cons:**
- ❌ Requires Rust knowledge for backend
- ❌ Larger initial setup

**Requirements:**
- Rust 1.70+ (via rustup)
- Node.js 18+ (LTS recommended)
- System dependencies:
  - Windows: Microsoft C++ Build Tools
  - macOS: Xcode Command Line Tools
  - Linux: build-essential, libwebkit2gtk-4.0-dev

---

#### Option 2: Manual Setup

**Description:** Manually configure Tauri project.

**Setup Steps:**
```bash
# 1. Create React app
npx create-react-app my-app --template typescript

# 2. Add Tauri dependencies
npm install @tauri-apps/api

# 3. Create src-tauri directory
# 4. Configure Cargo.toml, tauri.conf.json manually
```

**Pros:**
- ✅ Full control over configuration
- ✅ Can customize everything
- ✅ Good for learning

**Cons:**
- ❌ More complex
- ❌ Easy to misconfigure
- ❌ Not recommended for beginners

**Use Case:** Only if you need custom configuration not supported by CLI.

---

#### Option 3: Docker Setup (Advanced)

**Description:** Use Docker for consistent development environment.

**Setup:**
```dockerfile
FROM rust:latest
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
# ... Tauri setup
```

**Pros:**
- ✅ Consistent environment
- ✅ Easy to share with team
- ✅ Isolated dependencies

**Cons:**
- ❌ More complex setup
- ❌ Docker overhead
- ❌ May have issues with GUI apps

**Use Case:** Only for team environments or CI/CD.

---

**Recommendation:** **Option 1 - Official Tauri CLI Setup**

**Rationale:**
- Official and well-supported
- Handles all configuration
- Best practices included
- Easy to get started
- Good documentation

**Minimum Requirements:**
- **Rust:** 1.70+ (install via rustup)
- **Node.js:** 18+ LTS (install from nodejs.org)
- **System Dependencies:**
  - Windows: Microsoft C++ Build Tools (Visual Studio Build Tools)
  - macOS: Xcode Command Line Tools (`xcode-select --install`)
  - Linux: `build-essential`, `libwebkit2gtk-4.0-dev`, `libssl-dev`

**Verification:**
```bash
rustc --version  # Should be 1.70+
node --version   # Should be 18+
npm --version    # Should be 9+
tauri --version  # Should be 2.0+
```

---

### 12.6 Initial Project Structure Options

**Status:** ⏳ **RESEARCHED - OPTIONS PROVIDED**

**Context:** Need to decide initial project structure for breadcrumb development approach.

#### Option 1: Feature-Based Structure (RECOMMENDED)

**Description:** Organize by features, each feature is self-contained.

**Structure:**
```
src/
├── main/                    # Tauri main process (Rust)
│   ├── main.rs
│   ├── commands.rs
│   └── storage.rs
│
├── renderer/                # Frontend (React/TypeScript)
│   ├── features/           # Feature modules
│   │   ├── notes/
│   │   ├── calendar/
│   │   ├── todos/
│   │   ├── alarms/
│   │   └── metadata/
│   ├── shared/             # Shared code
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   ├── stores/             # Zustand stores
│   ├── contexts/           # React Context
│   ├── config/             # Configuration
│   └── App.tsx
│
├── tests/
└── assets/
```

**Pros:**
- ✅ Clear feature boundaries
- ✅ Easy to find code
- ✅ Supports breadcrumb approach (features are clear)
- ✅ Scalable (add features easily)
- ✅ Good for team development
- ✅ Aligns with architecture document

**Cons:**
- ❌ Some code duplication possible
- ❌ Requires discipline to keep shared code in shared/

**Use Case:** Recommended for feature-packed, maintainable codebase.

---

#### Option 2: Layer-Based Structure

**Description:** Organize by architectural layers.

**Structure:**
```
src/
├── presentation/    # React components
├── application/     # Services, business logic
├── domain/          # Models, types
└── infrastructure/  # Storage, external APIs
```

**Pros:**
- ✅ Clear separation of concerns
- ✅ Good for DDD approach
- ✅ Easy to understand architecture

**Cons:**
- ❌ Harder to find feature code
- ❌ Features spread across layers
- ❌ Less intuitive for breadcrumb approach
- ❌ Can become messy as features grow

**Use Case:** Good for simple apps, not recommended for feature-packed apps.

---

#### Option 3: Hybrid: Features + Layers

**Description:** Combine feature-based with layer-based.

**Structure:**
```
src/
├── features/
│   └── notes/
│       ├── components/     # Presentation
│       ├── services/       # Application
│       ├── types.ts        # Domain
│       └── storage/        # Infrastructure
└── shared/
    ├── components/
    ├── services/
    └── types/
```

**Pros:**
- ✅ Best of both worlds
- ✅ Clear features + clear layers
- ✅ Good for large codebases
- ✅ Supports breadcrumb approach

**Cons:**
- ❌ More complex structure
- ❌ More directories to navigate

**Use Case:** Good for large, complex applications.

---

**Recommendation:** **Option 1 - Feature-Based Structure**

**Rationale:**
- Aligns with architecture document (`09_Project_Architecture.md`)
- Supports breadcrumb development (features are clear units)
- Scalable for feature-packed app
- Easy to find code
- Good for maintainable codebase
- Each feature can have its own breadcrumbs

**Initial Structure to Create:**
1. **Tauri setup** (via CLI)
2. **Basic React structure** (App.tsx, main.tsx)
3. **Feature directories** (empty, with placeholder files)
4. **Shared directories** (components, services, utils, types)
5. **Store directories** (Zustand stores)
6. **Context directories** (React Context)
7. **Config files** (theme, settings)
8. **Comment directory** (`00_Comment_Directory.md`)

**Placeholder Files:**
- Create empty `.ts`/`.tsx` files for all planned features
- Add breadcrumb comments to each file
- Register comments in comment directory

---

### 12.7 Error Handling Strategy Options

**Status:** ⏳ **RESEARCHED - OPTIONS PROVIDED**

**Context:** Need consistent error handling across application layers.

#### Option 1: Result Type Pattern (RECOMMENDED)

**Description:** Use Result<T, E> type for error handling.

**Implementation:**
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function getNote(id: string): Promise<Result<Note, NoteError>> {
  try {
    const note = await storage.getNote(id);
    return { success: true, data: note };
  } catch (error) {
    return { success: false, error: new NoteError('Failed to load note', error) };
  }
}

// Usage
const result = await getNote(noteId);
if (result.success) {
  // Use result.data
} else {
  // Handle result.error
  showError(result.error.message);
}
```

**Pros:**
- ✅ Type-safe error handling
- ✅ Forces error handling (can't ignore)
- ✅ Clear error types
- ✅ Good for async operations
- ✅ No exceptions to catch

**Cons:**
- ❌ More verbose than try/catch
- ❌ Requires Result type implementation
- ❌ Can be boilerplate-heavy

**Use Case:** Recommended for service layer, storage layer.

---

#### Option 2: Custom Error Classes

**Description:** Create custom error classes for different error types.

**Implementation:**
```typescript
class NoteError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'NoteError';
  }
}

class StorageError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

// Usage
try {
  await saveNote(note);
} catch (error) {
  if (error instanceof StorageError) {
    // Handle storage error
  } else if (error instanceof NoteError) {
    // Handle note error
  }
}
```

**Pros:**
- ✅ Clear error types
- ✅ Can add context/metadata
- ✅ Easy to catch specific errors
- ✅ Standard JavaScript pattern

**Cons:**
- ❌ Requires try/catch everywhere
- ❌ Can be forgotten
- ❌ Exceptions can be thrown unexpectedly

**Use Case:** Good for application layer, can combine with Result type.

---

#### Option 3: Error Boundary Pattern (React)

**Description:** Use React Error Boundaries for UI errors.

**Implementation:**
```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

**Pros:**
- ✅ Catches React errors automatically
- ✅ Prevents app crashes
- ✅ Good for UI layer
- ✅ Can show user-friendly error UI

**Cons:**
- ❌ Only catches React errors
- ❌ Doesn't catch async errors
- ❌ Requires error boundaries in tree

**Use Case:** Required for React components, catches rendering errors.

---

#### Option 4: Global Error Handler

**Description:** Global error handler for uncaught errors.

**Implementation:**
```typescript
// Global error handler
window.addEventListener('error', (event) => {
  logError(event.error);
  showUserFriendlyError();
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason);
  showUserFriendlyError();
});

// Tauri error handler
import { app } from '@tauri-apps/api';
app.onError((error) => {
  logError(error);
});
```

**Pros:**
- ✅ Catches all unhandled errors
- ✅ Prevents app crashes
- ✅ Good for logging
- ✅ Safety net

**Cons:**
- ❌ Doesn't prevent errors
- ❌ Generic error messages
- ❌ Should be last resort

**Use Case:** Required as safety net, catches unexpected errors.

---

**Recommendation:** **Hybrid Approach - All Options**

**Rationale:**
- **Result Type:** Service layer, storage layer (type-safe, forces handling)
- **Custom Error Classes:** Application layer (clear error types)
- **Error Boundaries:** React components (catches UI errors)
- **Global Handler:** Safety net (catches unexpected errors)

**Error Categories:**
1. **User Errors:** Validation errors, invalid input (show user-friendly message)
2. **System Errors:** Storage failures, network errors (log + show generic message)
3. **Programming Errors:** Bugs, null references (log + show generic message + report)

**User-Facing Messages:**
- **User Errors:** "Please enter a valid title" (specific, actionable)
- **System Errors:** "Failed to save note. Please try again." (generic, retry option)
- **Programming Errors:** "An unexpected error occurred. The error has been logged." (generic, no technical details)

**Logging:**
- Log all errors with context
- Include stack traces for programming errors
- Include user actions leading to error
- Store in local log file (Tauri app data directory)

---

### 12.8 Feature Dependencies

**Status:** ✅ **ALREADY DOCUMENTED**

**Reference:** See `13_Feature_Implementation_Conversation.md` Section 4 and 5 for complete feature categorization and dependencies.

**Summary:**

**Core Standalone Tabs (Phase 1 - No Dependencies):**
1. Main Dashboard
2. Document Editor (Notes/Docs tab)
3. Calendar
4. To-Do List (Do/Due tab)
5. Alarm/Timer tab
6. Custom Metadata Association

**Build-Upon Features (Phase 2+ - Have Dependencies):**
- **Save, Open, and Edit Popular File Types** → Builds upon: Doc Editor, Calendar, Reminders
- **Branched Notes** → Builds upon: Notes (Doc Editor)
- **Non-Destructive Historical Timelines** → Builds upon: Notes (Doc Editor)
- **Hierarchical Notes** → Builds upon: Dashboard
- **To-Do Lists Within Notes** → Builds upon: Doc Editor (checkbox lists in documents)

**Note:** Feature dependencies are already fully documented. No additional research needed.

---

## 13. Implementation Decisions Summary

### 13.1 Recommended Selections from Research

Based on research and analysis, the following selections are recommended:

1. **Database Schema:** Adjacency List Model (Option 1) - Simple, maintainable, good performance
2. **Tiptap Extensions:** Comprehensive list (~40+ extensions) for Word/Google Docs/Obsidian parity
3. **TypeScript Interfaces:** Domain-Driven Design Pattern (Option 1) with Discriminated Unions for variants
4. **Auto-Save:** Hybrid Debounce + Version Check (Option 4) - Fast with conflict awareness
5. **Development Environment:** Official Tauri CLI Setup (Option 1) - Official, well-documented
6. **Project Structure:** Feature-Based Structure (Option 1) - Aligns with architecture, supports breadcrumbs
7. **Error Handling:** Hybrid Approach (All Options) - Result types + Custom errors + Error boundaries + Global handler
8. **Feature Dependencies:** Already documented in `13_Feature_Implementation_Conversation.md`

### 13.2 Next Steps

1. **Review Recommendations:** Review all research options and confirm selections
2. **Update Selections:** Mark selected options as ✅ SELECTED in this document
3. **Create Implementation Plan:** Use selections to create detailed implementation plan
4. **Begin Breadcrumb Development:** Create project structure with placeholder files and breadcrumb comments

---

## 14. Future Considerations

### 13.1 Recent Decisions

**Format:** Date | Decision | Rationale

- [Date] | [Decision] | [Rationale]
- [Date] | [Decision] | [Rationale]

---

### 13.2 Pending Decisions

**Format:** Decision | Priority | Blocking

- [Decision] | [Priority] | [Blocking?]
- [Decision] | [Priority] | [Blocking?]

---

## 14. Notes and Considerations

### 14.1 Key Constraints

- [Any constraints or limitations to consider]

---

### 14.2 Trade-offs

- [Any trade-offs between options]

---

### 14.3 Open Questions

- [Questions that need to be answered before decisions can be made]

---

**Document Status:** Active - Decisions in Progress  
**Last Updated:** 2024  
**Next Review:** Update as decisions are finalized