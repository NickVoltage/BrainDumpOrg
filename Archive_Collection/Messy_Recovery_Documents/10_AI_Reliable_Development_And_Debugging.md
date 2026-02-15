# AI Reliable Development and Debugging Guide

> **Note:** This document provides comprehensive guidance on getting AI to reliably create functional applications and effective strategies for debugging with AI assistance.

**Document Purpose:** Guide for maximizing AI reliability in code generation and debugging workflows.

**Related Documents:**
- `08_Development_Practices_And_Testing.md` - Testing standards
- `09_Development_Tips_And_Tricks.md` - Development tips
- `07_Logic_Flow_Guidelines.md` - Logic flow patterns

**Last Updated:** 2024  
**Status:** Active Guidelines

---

## 1. Getting AI to Reliably Create Functional Applications

### 1.1 Test-Driven Development (TDD) Approach

**Principle:** Write tests before implementation to define clear requirements and ensure code meets specifications.

**Red-Green-Refactor Cycle:**

```
1. Red Phase: Write failing tests
   ↓
2. Green Phase: Implement minimal code to pass tests
   ↓
3. Refactor Phase: Improve code while keeping tests green
   ↓
4. Repeat for next feature
```

**Why TDD Works with AI:**
- **Clear Requirements:** Tests define exactly what code should do
- **Verification:** Tests verify code works as expected
- **Documentation:** Tests serve as executable documentation
- **Confidence:** Passing tests confirm functionality

**Example Workflow:**

```typescript
// Step 1: Write failing test (Red)
describe('NoteService', () => {
  it('should create a note with required fields', async () => {
    const note = await noteService.createNote({
      title: 'Test Note',
      content: 'Test content'
    });
    
    expect(note.id).toBeDefined();
    expect(note.title).toBe('Test Note');
    expect(note.createdAt).toBeDefined();
  });
});

// Step 2: Implement minimal code (Green)
export const noteService = {
  async createNote(data: CreateNoteData): Promise<Note> {
    const note: Note = {
      id: generateId(),
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
    };
    await noteRepository.save(note);
    return note;
  }
};

// Step 3: Refactor (if needed)
// Improve code quality while keeping tests passing
```

---

### 1.2 Comprehensive Test Coverage Strategy

**Coverage-First Approach:**

AI should generate tests that cover:
- **Happy Path:** Normal operation scenarios
- **Error Handling:** Error conditions and edge cases
- **Boundary Conditions:** Edge values and limits
- **Integration Points:** Component interactions
- **Business Logic:** Core functionality

**Test Levels:**

**1. Unit Tests:**
- Test individual functions/services
- Fast execution (milliseconds)
- Isolated from external dependencies
- 100% reliable (failures indicate bugs)

**2. Integration Tests:**
- Test component interactions
- Test service-to-service communication
- Test data flow between layers
- Verify integration points

**3. End-to-End Tests:**
- Test complete user workflows
- Test full feature functionality
- Verify system behavior
- Catch integration issues

**Example: Comprehensive Test Suite**

```typescript
// Unit Test
describe('noteService.createNote', () => {
  it('should create note with valid data', async () => {
    // Happy path
  });
  
  it('should throw error for missing title', async () => {
    // Error handling
  });
  
  it('should generate unique ID', async () => {
    // Business logic
  });
});

// Integration Test
describe('NoteEditor Integration', () => {
  it('should save note when editor content changes', async () => {
    // Integration point
  });
});

// E2E Test
describe('Note Creation Workflow', () => {
  it('should create and display new note', async () => {
    // Full workflow
  });
});
```

---

### 1.3 Prompt Engineering for Reliable Code

**Effective Prompt Structure:**

**1. Provide Context:**
```
"I need to create a note service that:
- Creates notes with title and content
- Generates unique IDs
- Saves to SQLite database
- Returns created note object"
```

**2. Define Requirements as Tests:**
```
"Write tests first that verify:
- Note is created with all required fields
- ID is unique and generated
- Note is saved to database
- Created note is returned"
```

**3. Request Implementation:**
```
"Now implement the service to pass these tests"
```

**4. Request Verification:**
```
"Run the tests to verify implementation works"
```

**Prompt Best Practices:**

**Be Specific:**
- ❌ "Create a note service"
- ✅ "Create a note service that saves to SQLite, generates UUIDs, and returns Note objects"

**Provide Examples:**
- Show expected input/output
- Include error cases
- Provide similar code patterns

**Request Tests First:**
- Ask AI to write tests before implementation
- Verify tests fail initially
- Then implement to pass tests

**Iterate Incrementally:**
- Start with minimal functionality
- Add features one at a time
- Test after each addition

---

### 1.4 Building Testable Code

**Design Principles:**

**1. Dependency Injection:**
```typescript
// ❌ Bad - Hard to test
class NoteService {
  private db = new Database(); // Hard dependency
}

// ✅ Good - Testable
class NoteService {
  constructor(private db: Database) {} // Injected dependency
}
```

**2. Parameterization:**
```typescript
// ❌ Bad - Hardcoded
function saveNote(note: Note) {
  const path = '/app/data/notes'; // Hardcoded
}

// ✅ Good - Configurable
function saveNote(note: Note, basePath: string = DEFAULT_PATH) {
  const path = basePath; // Configurable
}
```

**3. Pure Functions:**
```typescript
// ✅ Good - Pure, testable
function formatNoteTitle(title: string): string {
  return title.trim().toUpperCase();
}

// ❌ Bad - Side effects, hard to test
function formatNoteTitle(title: string): string {
  console.log('Formatting...'); // Side effect
  document.title = title; // Side effect
  return title.trim().toUpperCase();
}
```

**4. Logging for Debugging:**
```typescript
// ✅ Good - Logged activity
function createNote(data: CreateNoteData): Promise<Note> {
  logger.info('Creating note', { title: data.title });
  const note = await noteRepository.save(data);
  logger.info('Note created', { noteId: note.id });
  return note;
}
```

---

## 2. Debugging with AI

### 2.1 Systematic Debugging Approach

**Debugging Workflow:**

```
1. Reproduce the Issue
   ↓
2. Isolate the Problem
   ↓
3. Gather Information
   ↓
4. Form Hypothesis
   ↓
5. Test Hypothesis
   ↓
6. Fix and Verify
```

**Information to Provide AI:**

**1. Expected Behavior:**
```
"The note should save when I click the save button"
```

**2. Actual Behavior:**
```
"Nothing happens when I click save, no error message"
```

**3. Error Messages:**
```
"Error: Cannot read property 'save' of undefined"
```

**4. Relevant Code:**
```typescript
// Include relevant code snippets
const handleSave = async () => {
  await noteService.save(note); // Error occurs here
};
```

**5. Context:**
```
"This happens in the NoteEditor component when editing an existing note"
```

---

### 2.2 AI Debugging Strategies

**Strategy 1: Isolate the Problem**

**Ask AI to:**
- Identify where the error occurs
- Check related code paths
- Verify dependencies
- Check state management

**Example Prompt:**
```
"The save function isn't working. Here's the code:
[code snippet]

The error is: [error message]

Can you help identify what's wrong? Check:
1. Is noteService properly initialized?
2. Are dependencies correct?
3. Is the data format correct?
4. Are there any async/await issues?"
```

**Strategy 2: Systematic Code Analysis**

**Ask AI to:**
- Trace code execution path
- Check each step
- Verify data transformations
- Check integration points

**Example Prompt:**
```
"Trace through this code flow:
1. User clicks save button
2. handleSave is called
3. noteService.save is called
4. Data is persisted

At which step does it fail? What should I check at each step?"
```

**Strategy 3: Compare Working vs. Broken**

**Ask AI to:**
- Compare working code with broken code
- Identify differences
- Check for regressions
- Verify changes

**Example Prompt:**
```
"This code worked before:
[old code]

Now it's broken after this change:
[new code]

What changed that could cause the issue?"
```

---

### 2.3 Debugging Information Collection

**What to Collect:**

**1. Error Details:**
- Error message
- Stack trace
- Error type
- Error location

**2. State Information:**
- Component state
- Store state
- Props values
- Context values

**3. Execution Context:**
- When error occurs
- User actions leading to error
- Data involved
- Environment (dev/prod)

**4. Logs:**
- Console logs
- Application logs
- Network requests
- Performance metrics

**Example Debugging Report:**

```markdown
## Issue: Note Save Fails

**Expected:** Note saves when save button clicked
**Actual:** No response, no error message

**Error Details:**
- No error in console
- Network tab shows no request
- Component state unchanged

**Code:**
```typescript
const handleSave = async () => {
  await noteService.save(note);
};
```

**State:**
- note: { id: '123', title: 'Test', content: '...' }
- noteService: undefined (suspected issue)

**Steps to Reproduce:**
1. Open note editor
2. Edit note content
3. Click save button
4. Nothing happens

**Hypothesis:**
noteService is not properly initialized or imported
```

---

### 2.4 AI-Assisted Error Analysis

**Prompt Structure for Error Analysis:**

**1. Provide Error Context:**
```
"I'm getting this error: [error message]
It happens when: [when it occurs]
The relevant code is: [code snippet]"
```

**2. Ask for Analysis:**
```
"Can you:
1. Explain what this error means?
2. Identify the likely cause?
3. Suggest how to fix it?
4. Provide a code fix?"
```

**3. Request Verification:**
```
"After fixing, what should I test to verify it works?"
```

**Common Error Patterns:**

**1. Undefined/Null Errors:**
```typescript
// Error: Cannot read property 'save' of undefined
// Cause: Service not initialized
// Fix: Check initialization, imports, dependency injection
```

**2. Async/Await Issues:**
```typescript
// Error: Promise not handled
// Cause: Missing await or .catch()
// Fix: Add proper async/await handling
```

**3. Type Errors:**
```typescript
// Error: Type mismatch
// Cause: Incorrect type definition or usage
// Fix: Check types, add type guards
```

**4. State Update Issues:**
```typescript
// Error: State not updating
// Cause: Incorrect state update pattern
// Fix: Use proper state update methods
```

---

### 2.5 Iterative Debugging Process

**Step-by-Step Process:**

**1. Reproduce Consistently:**
- Ensure you can reproduce the issue
- Document exact steps
- Note any variations

**2. Minimize Scope:**
- Isolate to smallest possible code
- Remove unrelated code
- Focus on specific functionality

**3. Test Hypotheses:**
- Form hypothesis about cause
- Test hypothesis with code changes
- Verify or refine hypothesis

**4. Fix and Verify:**
- Implement fix
- Run tests
- Verify issue resolved
- Check for regressions

**Example Iterative Process:**

```
Issue: Note not saving

Hypothesis 1: Service not initialized
Test: Check service initialization
Result: Service is initialized
→ Hypothesis rejected

Hypothesis 2: Async issue
Test: Add await, check promise handling
Result: Still not working
→ Hypothesis rejected

Hypothesis 3: Data format issue
Test: Check data format, add validation
Result: Data format incorrect
→ Hypothesis confirmed
Fix: Correct data format
Verify: Test save function
Result: Issue resolved
```

---

## 3. Reliable Code Generation Patterns

### 3.1 Incremental Development

**Principle:** Build features incrementally, testing at each step.

**Workflow:**

```
1. Start with minimal implementation
   ↓
2. Test and verify
   ↓
3. Add next feature
   ↓
4. Test and verify
   ↓
5. Repeat
```

**Example:**

```typescript
// Step 1: Minimal implementation
export const noteService = {
  createNote: async (data: CreateNoteData) => {
    return { id: '1', ...data };
  }
};

// Step 2: Add ID generation
export const noteService = {
  createNote: async (data: CreateNoteData) => {
    const id = generateId();
    return { id, ...data };
  }
};

// Step 3: Add persistence
export const noteService = {
  createNote: async (data: CreateNoteData) => {
    const id = generateId();
    const note = { id, ...data };
    await noteRepository.save(note);
    return note;
  }
};
```

---

### 3.2 Validation and Error Handling

**Always Validate Input:**

```typescript
export const noteService = {
  createNote: async (data: CreateNoteData): Promise<Note> => {
    // Validate input
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    
    if (data.title.length > 100) {
      throw new Error('Title must be less than 100 characters');
    }
    
    // Proceed with creation
    const note = await noteRepository.save(data);
    return note;
  }
};
```

**Handle Errors Gracefully:**

```typescript
export const noteService = {
  createNote: async (data: CreateNoteData): Promise<Note> => {
    try {
      // Validate
      validateNoteData(data);
      
      // Create
      const note = await noteRepository.save(data);
      return note;
    } catch (error) {
      // Log error
      logger.error('Failed to create note', { error, data });
      
      // Re-throw with context
      throw new Error(`Failed to create note: ${error.message}`);
    }
  }
};
```

---

### 3.3 Code Review Checklist

**Before Asking AI to Generate Code:**

- [ ] Requirements clearly defined
- [ ] Tests written (or requested)
- [ ] Context provided (related code, patterns)
- [ ] Examples provided (if applicable)
- [ ] Error cases considered
- [ ] Integration points identified

**After AI Generates Code:**

- [ ] Code compiles
- [ ] Tests pass
- [ ] Error handling present
- [ ] Input validation present
- [ ] Logging added (if needed)
- [ ] Follows project patterns
- [ ] Documentation updated

---

## 4. Common Pitfalls and Solutions

### 4.1 AI Generation Pitfalls

**Pitfall 1: Vague Requirements**
- **Problem:** AI generates code that doesn't meet needs
- **Solution:** Provide specific requirements, examples, and tests

**Pitfall 2: Missing Error Handling**
- **Problem:** Code fails silently or crashes
- **Solution:** Request error handling, validation, and logging

**Pitfall 3: Integration Issues**
- **Problem:** Code works in isolation but fails in app
- **Solution:** Test in context, provide integration requirements

**Pitfall 4: Over-Complexity**
- **Problem:** AI generates overly complex solutions
- **Solution:** Request simple, minimal implementations first

---

### 4.2 Debugging Pitfalls

**Pitfall 1: Insufficient Information**
- **Problem:** Can't debug without context
- **Solution:** Provide error details, code, state, steps to reproduce

**Pitfall 2: Wrong Hypothesis**
- **Problem:** Fixing wrong thing
- **Solution:** Test hypotheses systematically, verify each step

**Pitfall 3: Not Isolating Problem**
- **Problem:** Too much code to analyze
- **Solution:** Isolate to smallest reproducible case

**Pitfall 4: Not Verifying Fix**
- **Problem:** Fix doesn't actually work
- **Solution:** Test fix thoroughly, check for regressions

---

## 5. Best Practices Summary

### 5.1 For Reliable Code Generation

1. **Write Tests First:** Define requirements as tests
2. **Be Specific:** Provide clear, detailed requirements
3. **Provide Context:** Include related code and patterns
4. **Iterate Incrementally:** Build features step by step
5. **Validate Input:** Always validate and handle errors
6. **Test Thoroughly:** Verify code works as expected
7. **Review Code:** Check for patterns, errors, completeness

---

### 5.2 For Effective Debugging

1. **Reproduce Consistently:** Ensure issue is reproducible
2. **Gather Information:** Collect error details, state, logs
3. **Isolate Problem:** Narrow down to smallest case
4. **Form Hypotheses:** Systematically test hypotheses
5. **Fix and Verify:** Implement fix and verify it works
6. **Check Regressions:** Ensure fix doesn't break other things
7. **Document Solution:** Document issue and fix for future reference

---

## 6. Quick Reference

### 6.1 Code Generation Prompt Template

```
I need to implement [feature/functionality].

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Context:
- Related code: [code snippet or file reference]
- Similar pattern: [example]
- Integration points: [where it connects]

Please:
1. Write tests first that verify the requirements
2. Implement the code to pass the tests
3. Include error handling and validation
4. Follow project patterns (see [reference])
```

---

### 6.2 Debugging Prompt Template

```
I'm experiencing an issue:

Expected: [what should happen]
Actual: [what actually happens]
Error: [error message if any]

Code:
[relevant code snippet]

Context:
- When it occurs: [when]
- Steps to reproduce: [steps]
- State: [relevant state]

Can you help:
1. Identify the likely cause?
2. Suggest a fix?
3. Provide code to verify the fix?
```

---

**Document Status:** Active Guidelines  
**Last Updated:** 2024  
**Maintenance:** Update as new patterns and practices are discovered
