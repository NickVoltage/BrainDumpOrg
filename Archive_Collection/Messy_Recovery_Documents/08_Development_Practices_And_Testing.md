# Development Practices and Testing

> **Note:** This document defines development practices, testing standards, and debugging workflows to ensure reliable, predictable results during development.

**Document Purpose:** Guide for consistent development practices, testing, and debugging.

**Related Documents:**
- `06_Project_Architecture.md` - Architecture patterns
- `07_Logic_Flow_Guidelines.md` - Logic flow patterns
- `03_Project_Planning.md` - Development approach

**Last Updated:** 2024  
**Status:** Active Guidelines

---

## 1. Development Practices

### 1.1 Standalone Development Approach

**Principle:** Test new features in isolation before integrating into main application.

**Workflow:**

```
New Feature Idea
    ↓
Create Standalone Test Window/App
    ↓
Implement Feature in Isolation
    ↓
Test Look/Functionality/Utility
    ↓
Satisfied with Results?
    ├─ Yes → Integrate into Main App
    │         ↓
    │      Test Integration
    │         ↓
    │      Issues Found?
    │      ├─ Yes → Debug Integration (know it's integration issue)
    │      └─ No → Feature Complete
    │
    └─ No → Iterate on Standalone Version
            ↓
         Repeat Testing
```

**Benefits:**
- Isolate fundamental issues from integration issues
- Test UI/UX independently
- Faster iteration (no need to load full app)
- Easier debugging (smaller codebase to analyze)
- Can prototype multiple approaches quickly

**Implementation:**

**Standalone Test Structure:**
```
src/renderer/test-windows/
├── feature-name-test/
│   ├── TestApp.tsx              # Minimal app wrapper
│   ├── FeatureTest.tsx          # Feature implementation
│   ├── test-data.ts             # Mock/test data
│   └── index.html               # Standalone HTML
```

**Example: Standalone Timer Test**
```typescript
// src/renderer/test-windows/timer-test/TestApp.tsx
import React from 'react';
import { TimerTest } from './TimerTest';

export function TimerTestApp() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Timer Feature Test</h1>
      <TimerTest />
    </div>
  );
}

// Minimal implementation to test timer functionality
// No dependencies on main app
// Can test UI, functionality, utility independently
```

**Integration Checklist:**
- [ ] Feature works in standalone window
- [ ] UI/UX is satisfactory
- [ ] Functionality meets requirements
- [ ] Performance is acceptable
- [ ] No fundamental issues found
- [ ] Ready for integration

---

### 1.2 Codebase Analysis Standards

**Principle:** Analyze codebase at sibling and parent levels before implementing changes to catch potential overrides, conflicts, and integration issues.

**Analysis Levels:**

```
Current File (Implementation)
    ↓
Sibling Files (Same Directory)
    ↓
Parent Directory (Feature/Module)
    ↓
Grandparent Directory (Layer/Shared)
    ↓
Root Level (App Structure)
```

**Analysis Checklist:**

**Before Implementation:**
- [ ] Check sibling files for similar functionality
- [ ] Check parent directory for patterns/conventions
- [ ] Check for existing implementations that might conflict
- [ ] Check for overrides or extensions of parent functionality
- [ ] Check shared utilities/services that might be affected
- [ ] Check state management stores that might conflict
- [ ] Check for naming conflicts
- [ ] Check for import/dependency conflicts

**During Implementation:**
- [ ] Verify no unintended overrides
- [ ] Verify no breaking changes to parent functionality
- [ ] Verify integration points are correct
- [ ] Verify state updates don't conflict

**After Implementation:**
- [ ] Test that parent functionality still works
- [ ] Test that sibling features still work
- [ ] Test integration points
- [ ] Verify no regressions

**Analysis Tools:**

**1. Dependency Analysis:**
```typescript
// Check what current file depends on
// Check what depends on current file
// Check for circular dependencies
```

**2. Override Detection:**
```typescript
// Check if function/class name already exists
// Check if props/interface conflicts
// Check if state key conflicts
```

**3. Integration Point Analysis:**
```typescript
// Check service calls
// Check store updates
// Check context usage
// Check component composition
```

**Example: Analyzing Before Adding Timer Feature**

```
1. Check sibling features (notes, alarms)
   - Do they have similar patterns?
   - Any shared utilities?
   - Any naming conflicts?

2. Check parent directory (features/)
   - What's the standard structure?
   - What patterns are used?
   - Any shared services?

3. Check shared resources
   - Does timer-service conflict with existing services?
   - Does timer-store conflict with existing stores?
   - Any shared utilities needed?

4. Check root level
   - How do features integrate into main app?
   - Any app-level state that might conflict?
   - Any routing/navigation considerations?
```

---

### 1.3 Change Impact Analysis

**Principle:** Analyze impact of changes at multiple levels before implementing.

**Impact Analysis Levels:**

```
1. File Level
   - What does this file do?
   - What depends on this file?
   - What will break if this changes?

2. Feature Level
   - How does this affect the feature?
   - What other features depend on this?
   - What integration points exist?

3. Application Level
   - How does this affect the app?
   - What user flows are affected?
   - What performance implications?

4. Architecture Level
   - Does this follow architecture patterns?
   - Does this maintain layer separation?
   - Does this maintain feature independence?
```

**Impact Analysis Checklist:**

**Before Making Changes:**
- [ ] Identify all files that will be modified
- [ ] Identify all files that depend on modified files
- [ ] Identify all features that might be affected
- [ ] Identify all integration points
- [ ] Identify potential breaking changes
- [ ] Plan rollback strategy

**During Changes:**
- [ ] Make changes incrementally
- [ ] Test after each change
- [ ] Verify no regressions
- [ ] Document changes

**After Changes:**
- [ ] Test all affected features
- [ ] Test integration points
- [ ] Verify no breaking changes
- [ ] Update documentation

---

## 2. Testing Standards

### 2.1 Testing Philosophy

**Principle:** Test before and after changes to ensure predictable results and catch regressions early.

**Testing Approach:**
- **Before Changes:** Establish baseline (what works now)
- **During Changes:** Test incrementally
- **After Changes:** Verify everything still works
- **Integration:** Test feature integration
- **Regression:** Test that nothing broke

---

### 2.2 Test Creation Standards

**Test Types:**

**1. Unit Tests:**
- Test individual functions/services
- Test business logic
- Test data transformations
- **When:** For services, utilities, business logic

**2. Component Tests:**
- Test component rendering
- Test user interactions
- Test props/state handling
- **When:** For UI components

**3. Integration Tests:**
- Test feature integration
- Test service interactions
- Test state management
- **When:** For feature integration, cross-feature communication

**4. Standalone Tests:**
- Test feature in isolation
- Test UI/UX independently
- Test functionality independently
- **When:** Before integrating new features

**5. Regression Tests:**
- Test existing functionality
- Test that changes didn't break anything
- **When:** After any changes

---

### 2.3 Test Structure

**Test File Organization:**

```
src/
├── features/
│   └── notes/
│       ├── components/
│       │   ├── NoteEditor.tsx
│       │   └── NoteEditor.test.tsx      # Component tests
│       ├── services/
│       │   ├── note-service.ts
│       │   └── note-service.test.ts    # Service tests
│       └── __tests__/
│           └── integration.test.ts     # Integration tests
│
├── shared/
│   └── utils/
│       ├── date-utils.ts
│       └── date-utils.test.ts          # Utility tests
│
└── tests/
    ├── unit/                           # Unit tests
    ├── integration/                    # Integration tests
    └── e2e/                           # End-to-end tests
```

---

### 2.4 Test Creation Workflow

**Before Implementation:**
1. **Write Test for Current State (Baseline)**
   - Test what currently works
   - Establish baseline behavior
   - Document expected behavior

2. **Write Test for Desired State**
   - Test what should work after changes
   - Document new expected behavior
   - Tests will fail initially (expected)

**During Implementation:**
3. **Run Tests Frequently**
   - Run tests after each small change
   - Verify tests pass as implementation progresses
   - Fix issues immediately

**After Implementation:**
4. **Run Full Test Suite**
   - All unit tests pass
   - All integration tests pass
   - All regression tests pass
   - No new failures

---

### 2.5 Test Examples

**Example 1: Service Test (Before/After)**

```typescript
// note-service.test.ts

describe('NoteService', () => {
  // Baseline test (before changes)
  it('should load existing note', async () => {
    const note = await noteService.loadNote('existing-id');
    expect(note).toBeDefined();
    expect(note.title).toBe('Test Note');
  });
  
  // New functionality test (after changes)
  it('should create note with parent', async () => {
    const parent = await noteService.createNote({ title: 'Parent' });
    const child = await noteService.createChildNote(parent.id, {
      title: 'Child',
    });
    
    expect(child.parentId).toBe(parent.id);
    expect(child.documentId).toBeDefined();
  });
});
```

**Example 2: Component Test (Before/After)**

```typescript
// NoteEditor.test.tsx

describe('NoteEditor', () => {
  // Baseline test
  it('should render note content', () => {
    const { getByText } = render(
      <NoteEditor noteId="test-id" />
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });
  
  // New functionality test
  it('should show timer when note has timer', () => {
    const note = { id: 'test-id', timerId: 'timer-1' };
    const { getByTestId } = render(
      <NoteEditor note={note} />
    );
    expect(getByTestId('timer-display')).toBeInTheDocument();
  });
});
```

---

### 2.6 Regression Testing

**Principle:** Test existing functionality after changes to ensure nothing broke.

**Regression Test Checklist:**

**After Any Change:**
- [ ] All existing unit tests pass
- [ ] All existing integration tests pass
- [ ] Manual testing of affected features
- [ ] Manual testing of related features
- [ ] Check for console errors
- [ ] Check for performance regressions

**Regression Test Areas:**

**Critical Paths:**
- Note creation/editing/deletion
- File save/load
- Hierarchical note operations
- State management updates
- Storage operations

**Integration Points:**
- Feature-to-feature communication
- Service-to-service calls
- Store updates
- Context updates

---

## 3. Standalone Testing Workflow

### 3.1 Creating Standalone Test

**Steps:**

1. **Create Test Directory**
   ```
   src/renderer/test-windows/feature-name-test/
   ```

2. **Create Minimal App Wrapper**
   ```typescript
   // TestApp.tsx
   import React from 'react';
   import { FeatureTest } from './FeatureTest';
   
   export function TestApp() {
     return (
       <div className="test-app">
         <FeatureTest />
       </div>
     );
   }
   ```

3. **Implement Feature (Isolated)**
   - No dependencies on main app
   - Use mock data if needed
   - Focus on feature only

4. **Test Independently**
   - Test UI/UX
   - Test functionality
   - Test utility
   - Iterate as needed

5. **Document Findings**
   - What works
   - What doesn't work
   - What needs improvement
   - Integration considerations

---

### 3.2 Standalone Test Template

```typescript
// FeatureTest.tsx
import React, { useState } from 'react';

/**
 * Standalone test for [Feature Name]
 * 
 * Purpose: Test feature in isolation before integration
 * 
 * Test Areas:
 * - UI/UX
 * - Functionality
 * - Utility
 * - Performance
 * 
 * Integration Notes:
 * - [Notes about integration considerations]
 */
export function FeatureTest() {
  const [testState, setTestState] = useState(initialState);
  
  // Feature implementation (isolated)
  
  return (
    <div>
      {/* Feature UI */}
    </div>
  );
}
```

---

### 3.3 Integration Testing Workflow

**After Standalone Testing:**

```
Standalone Test Passes
    ↓
Create Integration Branch
    ↓
Integrate Feature into Main App
    ↓
Run Integration Tests
    ↓
Issues Found?
    ├─ Yes → Debug Integration
    │         ↓
    │      Is it integration issue?
    │      ├─ Yes → Fix integration
    │      │         ↓
    │      │      Test again
    │      │
    │      └─ No → Return to standalone
    │                (fundamental issue)
    │
    └─ No → Feature Complete
```

**Integration Test Checklist:**
- [ ] Feature integrates without errors
- [ ] No conflicts with existing features
- [ ] State management works correctly
- [ ] Storage operations work correctly
- [ ] UI integrates seamlessly
- [ ] No performance issues
- [ ] No regressions in other features

---

## 4. Debugging Workflow

### 4.1 Debugging Strategy

**Principle:** Use systematic approach to isolate and fix issues.

**Debugging Levels:**

```
1. Isolated Level (Standalone)
   - Test feature in isolation
   - Identify fundamental issues
   - Fix basic problems

2. Integration Level (Main App)
   - Test feature in main app
   - Identify integration issues
   - Fix integration problems

3. System Level (Full App)
   - Test full application
   - Identify system-wide issues
   - Fix system problems
```

---

### 4.2 Debugging Workflow

**When Code Stops Working:**

```
Issue Detected
    ↓
Isolate the Problem
    ├─ Standalone test still works?
    │  ├─ Yes → Integration issue
    │  │         ↓
    │  │      Check integration points
    │  │      - Service calls
    │  │      - State updates
    │  │      - Component composition
    │  │      - Store conflicts
    │  │
    │  └─ No → Fundamental issue
    │            ↓
    │         Return to standalone
    │         Fix fundamental problem
    │
    └─ Analyze Codebase Hierarchy
          ↓
      Check Sibling Files
          ↓
      Check Parent Directory
          ↓
      Check Shared Resources
          ↓
      Identify Conflict/Override
          ↓
      Fix Issue
```

---

### 4.3 Codebase Hierarchy Analysis

**Analysis Process:**

**Step 1: Current File Analysis**
```typescript
// What does this file do?
// What are its dependencies?
// What depends on it?
```

**Step 2: Sibling File Analysis**
```typescript
// Check files in same directory
// - Similar functionality?
// - Naming conflicts?
// - Shared dependencies?
// - Override potential?
```

**Step 3: Parent Directory Analysis**
```typescript
// Check parent directory
// - What patterns are used?
// - What conventions exist?
// - What shared resources?
// - What integration points?
```

**Step 4: Grandparent/Shared Analysis**
```typescript
// Check shared resources
// - Services
// - Stores
// - Utilities
// - Types
// - Components
```

**Step 5: Root Level Analysis**
```typescript
// Check app structure
// - How features integrate?
// - App-level state?
// - Routing?
// - Configuration?
```

**Example: Debugging GUI Update Issue**

```
Problem: GUI update not working
    ↓
1. Check current component
   - Is component rendering?
   - Are props correct?
   - Is state updating?
    ↓
2. Check sibling components
   - Are other components working?
   - Any conflicts?
   - Shared state issues?
    ↓
3. Check parent feature
   - Is feature working?
   - Service issues?
   - Store issues?
    ↓
4. Check shared resources
   - Theme system working?
   - CSS variables working?
   - Shared components working?
    ↓
5. Check app level
   - App rendering?
   - Routing working?
   - Global state working?
    ↓
Identify Issue Level
    ↓
Fix at Appropriate Level
```

---

### 4.4 Common Debugging Scenarios

**Scenario 1: Feature Works Standalone, Breaks in Main App**

**Debugging Steps:**
1. Check integration points
   - Service calls
   - Store updates
   - Context usage
2. Check for conflicts
   - Naming conflicts
   - State key conflicts
   - Import conflicts
3. Check dependencies
   - Missing dependencies
   - Version conflicts
   - Circular dependencies
4. Check parent functionality
   - Parent feature still works?
   - Sibling features still work?

**Solution Pattern:**
```typescript
// Isolate integration point
// Test each integration separately
// Identify which integration causes issue
// Fix that specific integration
```

---

**Scenario 2: GUI Update Not Reflecting**

**Debugging Steps:**
1. Check component state
   - Is state updating?
   - Is re-render triggered?
2. Check parent component
   - Are props updating?
   - Is parent re-rendering?
3. Check store/context
   - Is store updating?
   - Is context updating?
4. Check CSS/styling
   - Are styles applied?
   - CSS conflicts?
   - Theme issues?

**Solution Pattern:**
```typescript
// Add console logs at each level
// Identify where update stops
// Fix at that level
```

---

**Scenario 3: Override Not Working**

**Debugging Steps:**
1. Check file order
   - Import order
   - Load order
2. Check parent implementation
   - What does parent do?
   - How can it be overridden?
3. Check sibling files
   - Other overrides?
   - Conflicts?
4. Check architecture
   - Is override at right level?
   - Should use different pattern?

**Solution Pattern:**
```typescript
// Understand parent implementation
// Use correct override mechanism
// Test override in isolation
// Integrate carefully
```

---

## 5. Implementation Checklist

### 5.1 Before Starting Implementation

**Pre-Implementation Checklist:**
- [ ] Analyzed codebase hierarchy (sibling, parent, shared)
- [ ] Identified potential conflicts/overrides
- [ ] Created standalone test (if new feature)
- [ ] Written baseline tests (what works now)
- [ ] Written target tests (what should work)
- [ ] Planned integration points
- [ ] Documented approach

---

### 5.2 During Implementation

**Implementation Checklist:**
- [ ] Implementing incrementally
- [ ] Testing after each change
- [ ] Running tests frequently
- [ ] Checking for regressions
- [ ] Documenting changes
- [ ] Following architecture patterns
- [ ] Following logic flow patterns

---

### 5.3 After Implementation

**Post-Implementation Checklist:**
- [ ] All tests pass (unit, integration, regression)
- [ ] Standalone test still works (if applicable)
- [ ] Integration test passes
- [ ] No console errors
- [ ] No performance regressions
- [ ] Parent functionality still works
- [ ] Sibling features still work
- [ ] Documentation updated
- [ ] Code reviewed (if applicable)

---

## 6. Testing Tools and Setup

### 6.1 Testing Framework

**Recommended:**
- **Vitest** - Unit tests
- **React Testing Library** - Component tests
- **Playwright** - E2E tests (optional, later)

**Setup:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
  },
});
```

---

### 6.2 Test Utilities

**Common Test Utilities:**
```typescript
// src/tests/utils/test-helpers.ts

// Mock storage
export function createMockStorage() {
  return {
    save: vi.fn(),
    load: vi.fn(),
    delete: vi.fn(),
  };
}

// Mock service
export function createMockService() {
  return {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
}

// Test data factories
export function createTestNote(overrides = {}) {
  return {
    documentId: 'test-id',
    title: 'Test Note',
    content: '',
    ...overrides,
  };
}
```

---

## 7. Code Review Checklist

### 7.1 Self-Review Before Commit

**Checklist:**
- [ ] Code follows architecture patterns
- [ ] Code follows logic flow patterns
- [ ] Tests written and passing
- [ ] No console errors
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Code analyzed for conflicts
- [ ] Integration tested

---

## 8. Summary

**Key Practices:**
1. **Standalone Testing:** Test features in isolation first
2. **Codebase Analysis:** Check sibling/parent levels before changes
3. **Test Before/After:** Establish baseline, test changes
4. **Systematic Debugging:** Isolate issues at appropriate levels
5. **Incremental Implementation:** Small changes, frequent testing

**Benefits:**
- Catch issues early
- Isolate problems quickly
- Prevent integration issues
- Maintain predictable results
- Faster debugging

**Workflow:**
1. Analyze codebase hierarchy
2. Create standalone test (if new feature)
3. Write baseline tests
4. Implement incrementally
5. Test frequently
6. Integrate carefully
7. Test integration
8. Verify no regressions

---

**Document Status:** Active Guidelines  
**Last Updated:** 2024  
**Flexibility:** Practices and workflows, adapt as needed
