This is a pieced-together recovery document

# Codebase Comments Guidelines

> **Note:** This document defines the standards and conventions for code comments throughout the project. All developers and AI assistants must follow these guidelines.

**Document Purpose:** Establish consistent comment practices for improved code navigation, understanding, and maintenance.

**Last Updated:** 2024

---

## 1. Comment Numbering Convention

### 1.1 Purpose of Numbering

**Why Number Comments:**
- **Searchability:** Easy to find specific comments using search
- **Navigation:** Quick navigation between related code sections
- **Documentation:** Track and document code relationships
- **Maintenance:** Easier to update related comments
- **Understanding:** Better comprehension of code flow and relationships

**Key Principle:**
> Comments with the same number indicate related functionality or are part of the same logical flow across different files.

---

### 1.2 Numbering Format

**Format:**
- Three-digit numbers: `Comment 001`, `Comment 002`, `Comment 003`, etc.
- Sequential assignment (001, 002, 003...)
- Maximum: 999 comments
- Leading zeros required (001 not 1)

**Usage Pattern:**
```typescript
// Comment 001: [Brief title]
// [Detailed explanation]
// Related: Comment 002 (relationship), Comment 003 (relationship)
```

**Example:**
```typescript
// Comment 001: Branch creation entry point
// This function serves as the main entry point for creating new branches.
// It coordinates validation, storage, and UI updates.
// Related: Comment 001 (Branch validation), Comment 001 (Branch storage), Comment 001 (UI update)
export async function createBranch(
  noteId: string,
  branchPoint: BranchPoint
): Promise<Branch> {
  // Implementation
}
```

---

### 1.3 Number Assignment

**Assignment Rules:**
- Assign numbers sequentially as code is written
- Document in Comment Registry (see Section 4)
- Reuse numbers for related code (bi-directional relationships)
- Don't skip numbers unnecessarily
- Reserve numbers 001-099 for core/common functionality

**Assignment Process:**
1. Check Comment Registry for next available number
2. Assign number to comment
3. Update Comment Registry
4. Link to related comments if applicable

---

## 2. Bi-Directional Comment Relationships

### 2.1 Concept

**Shared Comment Numbers:**
- Same number = related functionality
- Different files can share the same number
- Indicates direct relationship or same logical flow
- Helps understand code flow across files

**When to Use Shared Numbers:**
- Code that calls each other
- Code that implements the same feature
- Code that processes the same data
- Code that are part of the same workflow

---

### 2.2 Relationship Types

**Caller-Callee Relationship:**
```typescript
// File: src/services/branch-service.ts

// Comment 010: Branch creation service method
// Main service method for creating branches. Validates input and delegates to storage.
// Related: Comment 010 (Storage implementation), Comment 010 (Validation logic)
export async function createBranch(
  noteId: string,
  branchPoint: BranchPoint
): Promise<Branch> {
  // Comment 010: Validate branch point
  // Ensures branch point is valid before proceeding.
  // Related: Comment 010 (Branch creation), Comment 010 (Error handling)
  await validateBranchPoint(noteId, branchPoint);
  
  // Comment 010: Store branch
  // Persists branch to storage after validation.
  // Related: Comment 010 (Branch creation), Comment 010 (Branch retrieval)
  return await storeBranch(noteId, branchPoint);
}
```

```typescript
// File: src/storage/branch-storage.ts

// Comment 010: Branch storage implementation
// Stores branch in database and file system. Called by branch service.
// Related: Comment 010 (Branch creation), Comment 010 (Branch retrieval)
export async function storeBranch(
  noteId: string,
  branchPoint: BranchPoint
): Promise<Branch> {
  // Implementation
}
```

**Same Feature Implementation:**
```typescript
// File: src/components/branch/BranchCreator.tsx

// Comment 010: Branch creation UI component
// User interface for creating branches. Calls branch service.
// Related: Comment 010 (Branch service), Comment 010 (Branch validation)
export function BranchCreator() {
  const handleCreate = async () => {
    // Comment 010: Call branch service
    // Invokes branch creation service method.
    // Related: Comment 010 (Branch service), Comment 010 (UI update)
    await branchService.createBranch(noteId, branchPoint);
  };
}
```

**Data Flow Relationship:**
```typescript
// File: src/services/branch-service.ts

// Comment 020: Branch data retrieval
// Retrieves branch data for display. Part of branch viewing workflow.
// Related: Comment 020 (Storage retrieval), Comment 020 (UI rendering)
export async function getBranch(branchId: string): Promise<Branch> {
  // Implementation
}
```

```typescript
// File: src/storage/branch-storage.ts

// Comment 020: Branch data storage retrieval
// Retrieves branch from persistent storage. Called by branch service.
// Related: Comment 020 (Branch service), Comment 020 (Data transformation)
export async function getBranchFromStorage(branchId: string): Promise<Branch> {
  // Implementation
}
```

```typescript
// File: src/components/branch/BranchViewer.tsx

// Comment 020: Branch display component
// Renders branch content to user. Uses branch service to fetch data.
// Related: Comment 020 (Branch service), Comment 020 (Content rendering)
export function BranchViewer({ branchId }: Props) {
  // Comment 020: Fetch branch data
  // Retrieves branch using service layer.
  // Related: Comment 020 (Branch service), Comment 020 (State management)
  const branch = await branchService.getBranch(branchId);
  
  // Comment 020: Render branch content
  // Displays branch content to user.
  // Related: Comment 020 (Data fetching), Comment 020 (Editor integration)
  return <Editor content={branch.content} />;
}
```

---

### 2.3 Relationship Documentation

**In Comment:**
- List related comment numbers
- Describe relationship type
- Reference file if helpful

**Format:**
```typescript
// Comment XXX: [Title]
// [Explanation]
// Related: Comment YYY ([relationship description]), Comment ZZZ ([relationship description])
```

**Example:**
```typescript
// Comment 015: Branch merge conflict detection
// Detects conflicts when merging branches. Analyzes content differences.
// Related: Comment 015 (Merge algorithm), Comment 015 (Conflict resolution UI), Comment 015 (Three-way merge)
```

---

## 3. Comment Format Standards

### 3.1 Required Elements

**Every numbered comment must include:**

1. **Comment Number:** `Comment XXX`
2. **Brief Title:** Short descriptive title
3. **Detailed Explanation:** What the code does, why it exists
4. **Related Comments:** List of related comment numbers with descriptions

**Format:**
```typescript
// Comment XXX: [Brief Title]
// [Detailed explanation of what this code does, why it exists, and how it works]
// Related: Comment YYY ([relationship description]), Comment ZZZ ([relationship description])
```

---

### 3.2 Optional Elements

**Additional information that can be included:**

- **Implementation Notes:** How it's implemented
- **Performance Considerations:** Performance implications
- **Known Limitations:** Current limitations or issues
- **Future Improvements:** Planned enhancements
- **Dependencies:** What this code depends on
- **Side Effects:** Any side effects

**Format:**
```typescript
// Comment XXX: [Title]
// [Main explanation]
// Related: Comment YYY, Comment ZZZ
// Performance: [Performance notes]
// TODO: [Future improvements]
// Known Issue: [Limitations]
```

**Example:**
```typescript
// Comment 025: Branch tree construction
// Constructs tree structure from flat branch list. Uses depth-first algorithm.
// Related: Comment 025 (Tree traversal), Comment 025 (Relationship mapping)
// Performance: O(n) time complexity where n is number of branches
// TODO: Consider caching tree structure for frequently accessed notes
// Known Issue: Performance degrades with >1000 branches
function buildBranchTree(branches: Branch[]): BranchTreeNode {
  // Implementation
}
```

---

### 3.3 Comment Placement

**Where to Place Comments:**

**Function/Method Level:**
- Before function definition
- Explains function purpose and behavior
- Documents parameters and return values

**Class Level:**
- Before class definition
- Explains class purpose and responsibility
- Documents class structure

**Complex Logic:**
- Before complex code blocks
- Explains algorithm or approach
- Documents decision rationale

**Critical Sections:**
- Before important operations
- Explains why it's critical
- Documents potential issues

**Example:**
```typescript
// Comment 030: Branch relationship tracker
// Tracks parent-child relationships between branches. Maintains tree structure.
// Related: Comment 030 (Tree building), Comment 030 (Relationship queries)
class BranchRelationshipTracker {
  // Comment 030: Find common ancestor
  // Finds the common ancestor of two branches for merge operations.
  // Related: Comment 030 (Merge algorithm), Comment 030 (Tree traversal)
  findCommonAncestor(branch1: Branch, branch2: Branch): Branch | null {
    // Implementation
  }
}
```

---

## 4. Comment Registry

### 4.1 Registry Purpose

**Why Maintain a Registry:**
- Track all comment numbers
- Document comment locations
- Map relationships
- Prevent number conflicts
- Enable easy navigation

---

### 4.2 Registry Format

**Registry Structure:**
```markdown
# Comment Registry

## Comment 001
- **File:** src/services/branch-service.ts
- **Location:** createBranch() function
- **Purpose:** Branch creation entry point
- **Related:** Comment 001 (Storage), Comment 001 (Validation), Comment 001 (UI)
- **Description:** Main service method for creating branches

## Comment 002
- **File:** src/storage/branch-storage.ts
- **Location:** storeBranch() function
- **Purpose:** Branch persistence
- **Related:** Comment 001 (Service), Comment 002 (Database operations)
- **Description:** Stores branch in persistent storage
```

---

### 4.3 Registry Maintenance

**When to Update:**
- When adding new numbered comments
- When changing comment relationships
- When removing comments
- When moving code between files

**Update Process:**
1. Add entry when creating comment
2. Update relationships when linking comments
3. Remove entry when deleting code
4. Update location when moving code

**Registry Location:**
- File: `docs/Comment_Registry.md`
- Or: Embedded in `00_Codebase_Comments_Guidelines.md`
- Or: Generated from codebase (future automation)

---

## 5. Comment Search and Navigation

### 5.1 Search Strategies

**Search by Number:**
- Search: `Comment 001`
- Find all instances of specific comment
- Navigate related code

**Search by Keyword:**
- Search: `Comment *branch*`
- Find comments related to specific feature
- Discover related functionality

**Search by File:**
- Search within specific file
- Understand file's comment structure
- See relationships within file

**Search by Relationship:**
- Find all comments related to Comment 001
- Trace code flow
- Understand dependencies

---

### 5.2 Navigation Tools

**IDE Features:**
- Use IDE search (Ctrl+Shift+F / Cmd+Shift+F)
- Search for comment numbers
- Navigate to related files
- Use "Find in Files" functionality

**Documentation:**
- Comment Registry for overview
- Generated documentation
- Code maps

**Future Automation:**
- IDE plugins for comment navigation
- Documentation generation
- Visual relationship graphs

---

## 6. Best Practices

### 6.1 When to Use Numbered Comments

**Use Numbered Comments For:**
- ✅ Complex logic that needs explanation
- ✅ Code that relates to other code
- ✅ Important business logic
- ✅ Non-obvious implementations
- ✅ Critical operations
- ✅ Code that may be modified by others

**Don't Use Numbered Comments For:**
- ❌ Obvious code (self-documenting)
- ❌ Simple getters/setters
- ❌ Trivial operations
- ❌ Code that's self-explanatory

---

### 6.2 Comment Quality

**Good Comments:**
- Explain "why" not just "what"
- Provide context
- Document relationships
- Are accurate and current
- Are helpful to future developers

**Bad Comments:**
- Just repeat code
- Are outdated
- Don't explain relationships
- Are too verbose
- Don't add value

**Example - Good:**
```typescript
// Comment 040: Branch merge conflict resolution
// Resolves conflicts when merging branches by applying three-way merge algorithm.
// User is prompted to resolve conflicts that cannot be automatically resolved.
// Related: Comment 040 (Conflict detection), Comment 040 (Merge UI)
// Algorithm: Uses base, source, and target versions to identify conflicts
function resolveMergeConflicts(
  base: Branch,
  source: Branch,
  target: Branch
): MergeResult {
  // Implementation
}
```

**Example - Bad:**
```typescript
// Comment 040: Merge function
// This function merges branches
function resolveMergeConflicts(base, source, target) {
  // Implementation
}
```

---

### 6.3 Maintaining Comments

**Keep Comments Current:**
- Update when code changes
- Update relationships when structure changes
- Remove outdated comments
- Update registry when needed

**Review Process:**
- Review comments during code review
- Verify relationships are accurate
- Check that numbers are correct
- Ensure registry is updated

**Update Triggers:**
- Major refactoring
- Function signature changes
- Relationship changes
- Architecture changes

---

## 7. Examples

### 7.1 Simple Comment

```typescript
// Comment 050: Calculate branch similarity
// Calculates similarity score between two branches using Jaccard similarity.
// Used for suggesting related branches and merge detection.
// Related: Comment 050 (Similarity algorithm), Comment 050 (Branch comparison)
function calculateBranchSimilarity(branch1: Branch, branch2: Branch): number {
  // Implementation
}
```

---

### 7.2 Comment with Relationships

```typescript
// Comment 060: Branch tree visualization
// Renders branch tree as interactive graph. Uses D3.js for layout.
// Related: Comment 060 (Tree data structure), Comment 060 (Graph rendering), Comment 060 (User interactions)
// Performance: Optimized for trees with <500 nodes
// TODO: Add virtualization for large trees
function renderBranchTree(tree: BranchTree): void {
  // Implementation
}
```

---

### 7.3 Cross-File Relationship

**File 1:**
```typescript
// File: src/services/branch-service.ts

// Comment 070: Branch creation workflow
// Orchestrates the complete branch creation process including validation,
// storage, and UI updates. Main entry point for branch creation feature.
// Related: Comment 070 (Validation), Comment 070 (Storage), Comment 070 (UI update)
export async function createBranch(
  noteId: string,
  branchPoint: BranchPoint
): Promise<Branch> {
  // Implementation
}
```

**File 2:**
```typescript
// File: src/storage/branch-storage.ts

// Comment 070: Branch storage operation
// Persists branch to database and file system. Part of branch creation workflow.
// Related: Comment 070 (Branch service), Comment 070 (Database schema)
export async function storeBranch(branch: Branch): Promise<void> {
  // Implementation
}
```

**File 3:**
```typescript
// File: src/components/branch/BranchCreator.tsx

// Comment 070: Branch creation UI
// User interface for creating branches. Initiates branch creation workflow.
// Related: Comment 070 (Branch service), Comment 070 (Form validation)
export function BranchCreator() {
  // Implementation
}
```

---

## 8. Comment Registry Template

### 8.1 Registry Entry Template

```markdown
## Comment XXX
- **File:** [file path]
- **Location:** [function/class/method name]
- **Purpose:** [Brief purpose description]
- **Related:** Comment YYY ([relationship]), Comment ZZZ ([relationship])
- **Description:** [Detailed description]
- **Last Updated:** [Date]
```

---

### 8.2 Registry Organization

**Organization Options:**

**By Number:**
- Sequential by comment number
- Easy to find specific comment
- Good for reference

**By Feature:**
- Grouped by feature/domain
- Easy to see feature relationships
- Good for understanding features

**By File:**
- Grouped by file
- Easy to see file's comments
- Good for file-level understanding

**Recommended:**
- Primary: By number (for reference)
- Secondary: By feature (for understanding)
- Index: By file (for navigation)

---

## 9. Enforcement and Tools

### 9.1 Code Review Checklist

**When Reviewing Code:**
- [ ] New numbered comments follow format
- [ ] Comment numbers are documented in registry
- [ ] Relationships are accurately described
- [ ] Comments explain "why" not just "what"
- [ ] Related comments use shared numbers appropriately
- [ ] Registry is updated

---

### 9.2 Future Automation

**Potential Tools:**
- Linter rules for comment format
- Registry generation from codebase
- Relationship validation
- Navigation tools
- Documentation generation

**IDE Plugins:**
- Comment number autocomplete
- Relationship navigation
- Registry integration
- Visual relationship graphs

---

## 10. Summary

### 10.1 Key Principles

1. **Numbered Comments:** Use three-digit format (Comment 001, Comment 002, etc.)
2. **Shared Numbers:** Use same number for related code across files
3. **Document Relationships:** Always list related comment numbers
4. **Maintain Registry:** Keep comment registry up to date
5. **Explain Why:** Comments should explain "why" not just "what"

### 10.2 Benefits

- **Easy Navigation:** Find related code quickly
- **Better Understanding:** Understand code flow and relationships
- **Improved Maintenance:** Easier to update related code
- **Documentation:** Comments serve as living documentation
- **Onboarding:** New developers understand code faster

---

## 11. References

### 11.1 Related Documents

- `00_AI_ReadME_Project_Guidance_And_Rules.md` - Central project guidance
- `03_Project_Planning.md` - Project planning and structure
- `02_Dev_Best_Practices_Research.md` - Development best practices

### 11.2 External Resources

- Code documentation best practices
- Comment standards in software development
- Documentation-driven development

---

**Document Status:** Active Guidelines  
**Last Updated:** 2024  
**Maintained By:** Development Team

Update 1:
