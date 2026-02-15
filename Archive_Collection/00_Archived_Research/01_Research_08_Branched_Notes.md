# Research Findings: Branched Notes

> **Note:** This document contains preliminary research findings only. It is NOT an implementation plan and should NOT be used as such. The information here serves as a starting point for understanding how similar features are typically implemented in existing applications.

**Research Date:** 2024  
**Research Scope:** Branched Notes (Item 8 from Research Agenda)

---

## 1. AI Chatbot Conversation Branching Patterns

### 1.1 ChatGPT Branching Implementation

**Branching Concept:**
ChatGPT allows users to branch conversations at any point, creating alternative conversation paths while preserving the original thread.

**Key Features:**

**Branch Creation:**
- Click on any message to create branch
- Creates new conversation thread
- Preserves all previous context
- Independent exploration path

**Context Preservation:**
- Original conversation remains intact
- Branch inherits full history up to branch point
- No data loss
- Complete traceability

**Visual Indicators:**
- Branch points clearly marked
- Visual connection to parent
- Easy to identify branches
- Clear relationship display

**Navigation:**
- Switch between branches easily
- View branch relationships
- Compare branches
- Return to any branch

**Use Cases:**
- Explore different approaches
- Try alternative solutions
- Deep dive into specific topics
- Compare different responses

**Implementation Insights:**
- Each branch is independent conversation
- Shared history up to branch point
- Efficient storage of shared content
- Fast branch switching

---

### 1.2 Claude Branching Implementation

**Similar Pattern:**
Claude implements similar branching functionality with conversation threads.

**Key Features:**

**Thread-Based:**
- Conversations organized as threads
- Branch creates new thread
- Thread relationships tracked
- Easy thread navigation

**Context Inheritance:**
- Branches inherit parent context
- Full conversation history available
- Seamless context switching
- No information loss

**Visual Representation:**
- Thread tree visualization
- Branch indicators
- Relationship mapping
- Clear hierarchy

**Best Practices:**
- Clear branch naming
- Descriptive branch purposes
- Easy branch management
- Intuitive navigation

---

### 1.3 Branching Patterns for Note-Taking

**Application to Notes:**

**Content Branching:**
- Branch at any point in note
- Create alternative versions
- Explore different approaches
- Maintain original context

**Research Branching:**
- Branch for deep dives
- Explore tangents
- Maintain main thread
- Organize exploration

**Draft Branching:**
- Multiple draft versions
- Compare approaches
- Iterate independently
- Merge best ideas

**Learning Branching:**
- Branch for study paths
- Explore concepts deeply
- Maintain learning context
- Track understanding paths

**Key Differences from Chatbots:**
- Notes are persistent documents
- More complex content structure
- Rich text formatting
- Embedded media and widgets
- Metadata and tags

---

## 2. Tree/Graph Data Structures for Branch Management

### 2.1 Tree Data Structure

**Basic Tree Structure:**

**Node Representation:**
```javascript
class BranchNode {
  constructor(id, content, parentId = null) {
    this.id = id;
    this.content = content;
    this.parentId = parentId;
    this.children = [];
    this.metadata = {
      createdAt: new Date(),
      modifiedAt: new Date(),
      name: null,
      description: null
    };
  }
  
  addChild(child) {
    this.children.push(child);
    child.parentId = this.id;
  }
  
  getPath() {
    const path = [this];
    let current = this;
    while (current.parentId) {
      current = this.getNodeById(current.parentId);
      if (current) path.unshift(current);
    }
    return path;
  }
}
```

**Tree Operations:**
- Add branch
- Remove branch
- Find branch
- Traverse tree
- Get ancestors
- Get descendants

**Pros:**
- ✅ Simple structure
- ✅ Clear hierarchy
- ✅ Easy navigation
- ✅ Efficient queries

**Cons:**
- ⚠️ Single parent only
- ⚠️ No cross-branch links
- ⚠️ Limited relationships

---

### 2.2 Graph Data Structure

**Directed Acyclic Graph (DAG):**

**Node Representation:**
```javascript
class BranchGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }
  
  addNode(node) {
    this.nodes.set(node.id, node);
    this.edges.set(node.id, []);
  }
  
  addEdge(fromId, toId) {
    if (!this.edges.has(fromId)) {
      this.edges.set(fromId, []);
    }
    this.edges.get(fromId).push(toId);
  }
  
  getAncestors(nodeId) {
    const ancestors = [];
    const visited = new Set();
    
    const traverse = (id) => {
      if (visited.has(id)) return;
      visited.add(id);
      
      const node = this.nodes.get(id);
      if (node && node.parentIds) {
        node.parentIds.forEach(parentId => {
          ancestors.push(parentId);
          traverse(parentId);
        });
      }
    };
    
    traverse(nodeId);
    return ancestors;
  }
  
  getDescendants(nodeId) {
    const descendants = [];
    const children = this.edges.get(nodeId) || [];
    
    children.forEach(childId => {
      descendants.push(childId);
      descendants.push(...this.getDescendants(childId));
    });
    
    return descendants;
  }
}
```

**Graph Operations:**
- Add node
- Add edge
- Find paths
- Detect cycles
- Topological sort
- Merge detection

**Pros:**
- ✅ Multiple parents possible
- ✅ Complex relationships
- ✅ Merge support
- ✅ Flexible structure

**Cons:**
- ⚠️ More complex
- ⚠️ Cycle detection needed
- ⚠️ More storage

---

### 2.3 Hybrid Approach

**Tree with Merge Support:**

**Structure:**
- Primary tree structure
- Merge links as special edges
- Best of both worlds
- Practical for notes

**Implementation:**
```javascript
class HybridBranchStructure {
  constructor() {
    this.nodes = new Map();
    this.parentChild = new Map(); // Tree structure
    this.merges = new Map(); // Merge relationships
  }
  
  addBranch(branch, parentId) {
    this.nodes.set(branch.id, branch);
    
    // Add to tree
    if (!this.parentChild.has(parentId)) {
      this.parentChild.set(parentId, []);
    }
    this.parentChild.get(parentId).push(branch.id);
    branch.parentId = parentId;
  }
  
  addMerge(fromId, toId) {
    if (!this.merges.has(toId)) {
      this.merges.set(toId, []);
    }
    this.merges.get(toId).push(fromId);
  }
  
  getBranches(nodeId) {
    const branches = {
      children: this.parentChild.get(nodeId) || [],
      merged: this.merges.get(nodeId) || []
    };
    return branches;
  }
}
```

**Recommendation:**
Use tree structure with merge support for note branching - provides simplicity with merge capability.

---

## 3. Branch Creation Workflows

### 3.1 User Triggers for Branching

**Trigger Points:**

**Explicit Branch Action:**
- User clicks "Create Branch" button
- Menu option
- Keyboard shortcut
- Clear user intent

**Context Menu:**
- Right-click on content
- "Branch from here" option
- Contextual action
- Good UX

**Timeline Integration:**
- Branch from historical point
- Select version in timeline
- Create branch option
- Historical branching

**Automatic Suggestions:**
- Suggest branching opportunities
- Detect exploration points
- Recommend branches
- Optional feature

**Implementation:**
```javascript
class BranchCreation {
  createBranch(noteId, branchPoint, options = {}) {
    const note = this.getNote(noteId);
    const branchPointContent = this.getContentUpTo(note, branchPoint);
    
    const branch = {
      id: this.generateBranchId(),
      parentId: noteId,
      branchPoint: branchPoint,
      content: branchPointContent,
      metadata: {
        name: options.name || `Branch from ${branchPoint}`,
        description: options.description || '',
        createdAt: new Date(),
        purpose: options.purpose || 'exploration'
      }
    };
    
    this.saveBranch(branch);
    return branch;
  }
  
  createBranchFromHistory(noteId, versionId) {
    const version = this.getVersion(noteId, versionId);
    return this.createBranch(noteId, version.timestamp, {
      name: `Branch from version ${versionId}`,
      purpose: 'historical-exploration'
    });
  }
}
```

**Best Practices:**
- Make branching easy
- Provide clear options
- Support multiple triggers
- Show branch point clearly

---

### 3.2 Branch Points

**Branch Point Types:**

**Content Position:**
- Branch at cursor position
- Branch at selection
- Branch at paragraph
- Branch at section

**Temporal Point:**
- Branch from timestamp
- Branch from version
- Branch from edit point
- Historical branching

**Semantic Point:**
- Branch at heading
- Branch at topic change
- Branch at section break
- Content-aware branching

**Implementation:**
```javascript
class BranchPoint {
  constructor(type, value) {
    this.type = type; // 'position', 'timestamp', 'version', 'semantic'
    this.value = value;
    this.metadata = {};
  }
  
  static fromCursor(editor) {
    const position = editor.getCursorPosition();
    return new BranchPoint('position', {
      line: position.line,
      column: position.column,
      offset: position.offset
    });
  }
  
  static fromSelection(editor) {
    const selection = editor.getSelection();
    return new BranchPoint('position', {
      start: selection.start,
      end: selection.end
    });
  }
  
  static fromVersion(versionId) {
    return new BranchPoint('version', versionId);
  }
  
  static fromTimestamp(timestamp) {
    return new BranchPoint('timestamp', timestamp);
  }
}
```

**Best Practices:**
- Support multiple branch point types
- Store branch point metadata
- Allow branch point editing
- Show branch point in UI

---

### 3.3 Context Inheritance

**Context Inheritance Strategies:**

**Full Context:**
- Copy all content up to branch point
- Complete context
- Independent branch
- More storage

**Reference Context:**
- Reference parent content
- Shared storage
- Efficient
- Dependency on parent

**Hybrid:**
- Copy essential context
- Reference shared content
- Balance efficiency and independence
- Practical approach

**Implementation:**
```javascript
class ContextInheritance {
  inheritContext(branch, parentNote, branchPoint) {
    // Full context inheritance
    if (branch.inheritanceMode === 'full') {
      branch.content = this.getContentUpTo(parentNote, branchPoint);
      branch.isIndependent = true;
    }
    
    // Reference context inheritance
    else if (branch.inheritanceMode === 'reference') {
      branch.contentRef = {
        parentId: parentNote.id,
        branchPoint: branchPoint
      };
      branch.isIndependent = false;
    }
    
    // Hybrid inheritance
    else {
      branch.content = this.getEssentialContent(parentNote, branchPoint);
      branch.contentRef = {
        parentId: parentNote.id,
        branchPoint: branchPoint,
        fullContext: true
      };
      branch.isIndependent = true;
    }
    
    return branch;
  }
  
  getContentUpTo(note, branchPoint) {
    // Get all content up to branch point
    if (branchPoint.type === 'position') {
      return note.content.substring(0, branchPoint.value.offset);
    } else if (branchPoint.type === 'timestamp') {
      const version = this.getVersionAt(note, branchPoint.value);
      return version.content;
    }
    return note.content;
  }
}
```

**Best Practices:**
- Provide inheritance options
- Default to full context
- Allow mode switching
- Ensure branch independence

---

## 4. Branch Navigation Interfaces

### 4.1 Switching Between Branches

**Navigation Methods:**

**Branch Selector:**
- Dropdown/select menu
- List of branches
- Quick switching
- Good for few branches

**Branch Sidebar:**
- Sidebar with branch tree
- Visual hierarchy
- Click to switch
- Good for many branches

**Branch Tabs:**
- Tab for each branch
- Familiar pattern
- Easy switching
- Good for active branches

**Keyboard Shortcuts:**
- Shortcuts for navigation
- Power user friendly
- Fast switching
- Good UX

**Implementation:**
```javascript
class BranchNavigation {
  constructor() {
    this.currentBranchId = null;
    this.branches = new Map();
  }
  
  switchToBranch(branchId) {
    const branch = this.branches.get(branchId);
    if (!branch) return;
    
    // Save current branch state
    if (this.currentBranchId) {
      this.saveBranchState(this.currentBranchId);
    }
    
    // Load branch
    this.currentBranchId = branchId;
    this.loadBranch(branch);
    
    // Update UI
    this.updateBranchIndicator(branch);
    this.updateNavigationUI();
  }
  
  getBranchList(noteId) {
    return Array.from(this.branches.values())
      .filter(b => b.parentId === noteId || b.id === noteId)
      .sort((a, b) => b.metadata.createdAt - a.metadata.createdAt);
  }
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        this.openBranchSelector();
      }
      
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowRight') {
        e.preventDefault();
        this.switchToNextBranch();
      }
      
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        this.switchToPreviousBranch();
      }
    });
  }
}
```

**Best Practices:**
- Provide multiple navigation methods
- Show current branch clearly
- Support keyboard shortcuts
- Remember branch state

---

### 4.2 Viewing Branch Relationships

**Relationship Visualization:**

**Tree View:**
- Hierarchical tree display
- Parent-child relationships
- Expand/collapse nodes
- Clear structure

**Graph View:**
- Graph visualization
- Node-link diagram
- Interactive exploration
- Complex relationships

**List View:**
- Flat list with indicators
- Simple display
- Easy to scan
- Good for overview

**Breadcrumb View:**
- Show branch path
- Navigate up hierarchy
- Context awareness
- Good for deep branches

**Implementation:**
```javascript
class BranchRelationshipView {
  renderTreeView(noteId) {
    const root = this.getRootBranch(noteId);
    return this.renderBranchNode(root, 0);
  }
  
  renderBranchNode(branch, depth) {
    const indent = '  '.repeat(depth);
    const isCurrent = branch.id === this.currentBranchId;
    const marker = isCurrent ? '●' : '○';
    
    let html = `${indent}${marker} ${branch.metadata.name || branch.id}\n`;
    
    const children = this.getChildBranches(branch.id);
    children.forEach(child => {
      html += this.renderBranchNode(child, depth + 1);
    });
    
    return html;
  }
  
  renderGraphView(noteId) {
    // Use graph visualization library (D3.js, vis.js, etc.)
    const graph = this.buildGraph(noteId);
    return this.renderGraph(graph);
  }
  
  buildGraph(noteId) {
    const nodes = [];
    const edges = [];
    
    const branches = this.getAllBranches(noteId);
    branches.forEach(branch => {
      nodes.push({
        id: branch.id,
        label: branch.metadata.name || branch.id,
        current: branch.id === this.currentBranchId
      });
      
      if (branch.parentId) {
        edges.push({
          from: branch.parentId,
          to: branch.id,
          type: 'parent'
        });
      }
      
      if (branch.mergedFrom) {
        branch.mergedFrom.forEach(mergedId => {
          edges.push({
            from: mergedId,
            to: branch.id,
            type: 'merge'
          });
        });
      }
    });
    
    return { nodes, edges };
  }
}
```

**Best Practices:**
- Support multiple view types
- Make relationships clear
- Highlight current branch
- Interactive exploration

---

### 4.3 Branch Indicators in UI

**Visual Indicators:**

**Branch Badge:**
- Badge showing branch name
- Current branch highlighted
- Click to switch
- Good visibility

**Branch Breadcrumb:**
- Breadcrumb showing path
- Click to navigate
- Context display
- Good for hierarchy

**Branch Status:**
- Indicator for branch status
- Modified, synced, etc.
- Visual feedback
- Good for awareness

**Color Coding:**
- Different colors per branch
- Visual distinction
- Quick identification
- Good for many branches

**Implementation:**
```javascript
class BranchIndicators {
  renderBranchBadge(branch) {
    const isCurrent = branch.id === this.currentBranchId;
    const badge = document.createElement('div');
    badge.className = `branch-badge ${isCurrent ? 'current' : ''}`;
    badge.textContent = branch.metadata.name || 'Main';
    badge.addEventListener('click', () => {
      this.switchToBranch(branch.id);
    });
    return badge;
  }
  
  renderBranchBreadcrumb(branch) {
    const path = this.getBranchPath(branch);
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'branch-breadcrumb';
    
    path.forEach((node, index) => {
      const item = document.createElement('span');
      item.textContent = node.metadata.name || node.id;
      if (index < path.length - 1) {
        item.textContent += ' / ';
      }
      item.addEventListener('click', () => {
        this.switchToBranch(node.id);
      });
      breadcrumb.appendChild(item);
    });
    
    return breadcrumb;
  }
  
  updateBranchStatus(branch) {
    const indicator = document.querySelector(`[data-branch-id="${branch.id}"]`);
    if (indicator) {
      const status = this.getBranchStatus(branch);
      indicator.className = `branch-status ${status}`;
      indicator.title = this.getStatusText(status);
    }
  }
}
```

**Best Practices:**
- Make indicators visible
- Show current branch clearly
- Provide interaction
- Update in real-time

---

## 5. Branch Metadata

### 5.1 Branch Names and Descriptions

**Metadata Fields:**

**Name:**
- User-defined name
- Default generated name
- Editable
- Displayed in UI

**Description:**
- Purpose of branch
- What to explore
- User notes
- Helpful context

**Purpose:**
- Exploration
- Alternative approach
- Deep dive
- Experiment

**Tags:**
- Categorize branches
- Filter branches
- Organize
- Search

**Implementation:**
```javascript
class BranchMetadata {
  constructor() {
    this.metadata = {
      name: null,
      description: null,
      purpose: null,
      tags: [],
      createdAt: new Date(),
      modifiedAt: new Date(),
      createdBy: null
    };
  }
  
  setName(name) {
    this.metadata.name = name;
    this.metadata.modifiedAt = new Date();
    this.save();
  }
  
  setDescription(description) {
    this.metadata.description = description;
    this.metadata.modifiedAt = new Date();
    this.save();
  }
  
  setPurpose(purpose) {
    this.metadata.purpose = purpose;
    this.metadata.modifiedAt = new Date();
    this.save();
  }
  
  addTag(tag) {
    if (!this.metadata.tags.includes(tag)) {
      this.metadata.tags.push(tag);
      this.metadata.modifiedAt = new Date();
      this.save();
    }
  }
  
  generateDefaultName(branchPoint) {
    const timestamp = new Date().toLocaleString();
    if (branchPoint.type === 'position') {
      return `Branch at line ${branchPoint.value.line}`;
    } else if (branchPoint.type === 'timestamp') {
      return `Branch from ${branchPoint.value}`;
    }
    return `Branch ${timestamp}`;
  }
}
```

**Best Practices:**
- Provide default names
- Allow easy editing
- Support descriptions
- Enable tagging

---

### 5.2 Creation Context

**Context Information:**

**Branch Point:**
- Where branch was created
- Position or timestamp
- Reference point
- Important for understanding

**Parent Context:**
- Parent branch/note
- Inherited content
- Relationship
- Traceability

**Creation Reason:**
- Why branch was created
- User intent
- Exploration goal
- Helpful for organization

**Snapshot:**
- Content at branch point
- Historical reference
- Comparison baseline
- Useful for merging

**Implementation:**
```javascript
class BranchContext {
  captureContext(branch, parentNote, branchPoint) {
    branch.context = {
      branchPoint: branchPoint,
      parentId: parentNote.id,
      parentName: parentNote.metadata.name,
      contentSnapshot: this.getContentSnapshot(parentNote, branchPoint),
      creationReason: branch.metadata.description,
      timestamp: new Date()
    };
    
    return branch;
  }
  
  getContentSnapshot(note, branchPoint) {
    if (branchPoint.type === 'position') {
      return note.content.substring(0, branchPoint.value.offset);
    } else if (branchPoint.type === 'timestamp') {
      const version = this.getVersionAt(note, branchPoint.value);
      return version.content;
    }
    return note.content;
  }
  
  displayContext(branch) {
    return {
      createdFrom: branch.context.parentName,
      at: this.formatBranchPoint(branch.context.branchPoint),
      when: branch.context.timestamp.toLocaleString(),
      reason: branch.context.creationReason
    };
  }
}
```

**Best Practices:**
- Capture full context
- Store branch point
- Preserve snapshots
- Display clearly

---

### 5.3 Timestamps and Tracking

**Temporal Metadata:**

**Creation Time:**
- When branch was created
- Timestamp
- Chronological order
- Useful for sorting

**Modification Time:**
- Last edit time
- Activity tracking
- Recent branches
- Useful for filtering

**Activity Tracking:**
- Edit frequency
- Last accessed
- Usage patterns
- Helpful for management

**Implementation:**
```javascript
class BranchTracking {
  trackCreation(branch) {
    branch.metadata.createdAt = new Date();
    branch.metadata.createdBy = this.getCurrentUser();
    this.save();
  }
  
  trackModification(branch) {
    branch.metadata.modifiedAt = new Date();
    branch.metadata.modifiedBy = this.getCurrentUser();
    this.save();
  }
  
  trackAccess(branch) {
    branch.metadata.lastAccessed = new Date();
    branch.metadata.accessCount = (branch.metadata.accessCount || 0) + 1;
    this.save();
  }
  
  getRecentBranches(limit = 10) {
    return this.getAllBranches()
      .sort((a, b) => {
        const aTime = a.metadata.lastAccessed || a.metadata.createdAt;
        const bTime = b.metadata.lastAccessed || b.metadata.createdAt;
        return bTime - aTime;
      })
      .slice(0, limit);
  }
  
  getActiveBranches(days = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return this.getAllBranches()
      .filter(branch => {
        const lastActive = branch.metadata.modifiedAt || branch.metadata.createdAt;
        return lastActive > cutoff;
      });
  }
}
```

**Best Practices:**
- Track all timestamps
- Update on changes
- Support filtering by time
- Provide activity insights

---

## 6. Storage Patterns for Branches

### 6.1 Efficient Storage of Shared Content

**Storage Strategies:**

**Content Deduplication:**
- Store shared content once
- Reference from branches
- Efficient storage
- More complex

**Delta Storage:**
- Store only differences
- Reconstruct from parent
- Very efficient
- Requires reconstruction

**Full Copy:**
- Each branch has full copy
- Simple
- Independent
- More storage

**Hybrid:**
- Copy essential content
- Reference shared content
- Balance efficiency and independence
- Practical approach

**Implementation:**
```javascript
class BranchStorage {
  constructor() {
    this.contentStore = new Map(); // Shared content store
    this.branchStore = new Map(); // Branch metadata store
  }
  
  storeBranch(branch, parentNote) {
    // Extract shared content
    const sharedContent = this.extractSharedContent(branch, parentNote);
    const sharedId = this.storeSharedContent(sharedContent);
    
    // Store branch with reference
    branch.contentRef = sharedId;
    branch.delta = this.calculateDelta(branch, parentNote);
    
    this.branchStore.set(branch.id, branch);
  }
  
  loadBranch(branchId) {
    const branch = this.branchStore.get(branchId);
    if (!branch) return null;
    
    // Reconstruct content
    if (branch.contentRef) {
      const sharedContent = this.getSharedContent(branch.contentRef);
      branch.content = this.reconstructContent(sharedContent, branch.delta);
    }
    
    return branch;
  }
  
  extractSharedContent(branch, parentNote) {
    // Extract content up to branch point
    const branchPoint = branch.context.branchPoint;
    return this.getContentUpTo(parentNote, branchPoint);
  }
  
  calculateDelta(branch, parentNote) {
    // Calculate differences from parent
    const branchContent = branch.content;
    const parentContent = this.getContentUpTo(parentNote, branch.context.branchPoint);
    
    return this.computeDiff(parentContent, branchContent);
  }
}
```

**Best Practices:**
- Optimize storage efficiency
- Maintain branch independence
- Support fast loading
- Handle reconstruction

---

### 6.2 Delta Compression

**Delta Compression Techniques:**

**Text Diffs:**
- Store text differences
- Use diff algorithms
- Efficient for text
- Common approach

**Operation Logs:**
- Store edit operations
- Replay to reconstruct
- Very efficient
- More complex

**Chunk-Based:**
- Divide into chunks
- Store changed chunks
- Efficient for large content
- Good for binary

**Implementation:**
```javascript
class DeltaCompression {
  computeDiff(oldContent, newContent) {
    // Use diff algorithm (Myers, Hunt-Szymanski, etc.)
    const diff = this.diffAlgorithm.compute(oldContent, newContent);
    
    return {
      operations: diff.operations,
      metadata: {
        oldLength: oldContent.length,
        newLength: newContent.length,
        timestamp: new Date()
      }
    };
  }
  
  applyDelta(baseContent, delta) {
    let result = baseContent;
    let position = 0;
    
    delta.operations.forEach(op => {
      if (op.type === 'insert') {
        result = result.slice(0, position) + op.text + result.slice(position);
        position += op.text.length;
      } else if (op.type === 'delete') {
        result = result.slice(0, position) + result.slice(position + op.length);
      } else if (op.type === 'keep') {
        position += op.length;
      }
    });
    
    return result;
  }
  
  compressDelta(delta) {
    // Compress delta operations
    const compressed = {
      operations: this.optimizeOperations(delta.operations),
      metadata: delta.metadata
    };
    
    return compressed;
  }
}
```

**Best Practices:**
- Use efficient diff algorithms
- Compress deltas
- Optimize reconstruction
- Test performance

---

### 6.3 Reference-Based Storage

**Reference Patterns:**

**Content References:**
- Reference shared content
- Store only references
- Very efficient
- Dependency management

**Version References:**
- Reference versions
- Point to snapshots
- Efficient
- Version management

**Hybrid References:**
- Mix of references and content
- Flexible
- Practical
- Good balance

**Implementation:**
```javascript
class ReferenceStorage {
  storeWithReferences(branch, parentNote) {
    // Store branch with references
    branch.storage = {
      type: 'reference',
      contentRef: this.getContentReference(parentNote, branch.context.branchPoint),
      delta: this.computeDelta(parentNote, branch),
      metadata: branch.metadata
    };
    
    this.saveBranch(branch);
  }
  
  getContentReference(note, branchPoint) {
    // Create or get content reference
    const content = this.getContentUpTo(note, branchPoint);
    const hash = this.hashContent(content);
    
    if (!this.contentCache.has(hash)) {
      this.contentCache.set(hash, content);
    }
    
    return {
      hash: hash,
      length: content.length,
      timestamp: branchPoint.value
    };
  }
  
  loadWithReferences(branchId) {
    const branch = this.getBranch(branchId);
    if (!branch || branch.storage.type !== 'reference') {
      return branch;
    }
    
    // Load referenced content
    const baseContent = this.contentCache.get(branch.storage.contentRef.hash);
    
    // Apply delta
    branch.content = this.applyDelta(baseContent, branch.storage.delta);
    
    return branch;
  }
}
```

**Best Practices:**
- Use references efficiently
- Cache referenced content
- Handle missing references
- Optimize lookups

---

## 7. Merge Strategies

### 7.1 Combining Branches

**Merge Approaches:**

**Three-Way Merge:**
- Base (common ancestor)
- Source (branch to merge)
- Target (current branch)
- Standard approach

**Two-Way Merge:**
- Source and target
- Simpler
- Less accurate
- Good for simple cases

**Automatic Merge:**
- Auto-detect conflicts
- Auto-resolve simple cases
- User resolves conflicts
- Common pattern

**Manual Merge:**
- User selects changes
- Full control
- More work
- Good for complex cases

**Implementation:**
```javascript
class BranchMerge {
  merge(sourceBranchId, targetBranchId) {
    const source = this.getBranch(sourceBranchId);
    const target = this.getBranch(targetBranchId);
    const base = this.findCommonAncestor(source, target);
    
    // Three-way merge
    const mergeResult = this.threeWayMerge(
      base.content,
      source.content,
      target.content
    );
    
    if (mergeResult.conflicts.length > 0) {
      return {
        success: false,
        conflicts: mergeResult.conflicts,
        mergedContent: mergeResult.content
      };
    }
    
    // Apply merge
    target.content = mergeResult.content;
    target.mergedFrom = target.mergedFrom || [];
    target.mergedFrom.push(sourceBranchId);
    
    this.saveBranch(target);
    
    return {
      success: true,
      mergedContent: mergeResult.content
    };
  }
  
  threeWayMerge(base, source, target) {
    const baseLines = base.split('\n');
    const sourceLines = source.split('\n');
    const targetLines = target.split('\n');
    
    const conflicts = [];
    const merged = [];
    
    // Merge algorithm (simplified)
    let baseIdx = 0, sourceIdx = 0, targetIdx = 0;
    
    while (baseIdx < baseLines.length || sourceIdx < sourceLines.length || targetIdx < targetLines.length) {
      // Detect conflicts and merge
      // Implementation depends on merge algorithm
    }
    
    return {
      content: merged.join('\n'),
      conflicts: conflicts
    };
  }
}
```

**Best Practices:**
- Use three-way merge
- Detect conflicts accurately
- Provide merge UI
- Support manual resolution

---

### 7.2 Conflict Resolution

**Conflict Types:**

**Content Conflicts:**
- Same region modified differently
- Requires user decision
- Most common
- Standard resolution

**Structural Conflicts:**
- Different structure changes
- More complex
- Requires careful handling
- Less common

**Metadata Conflicts:**
- Conflicting metadata
- Easier to resolve
- Usually automatic
- Simple cases

**Resolution Strategies:**

**User Choice:**
- User selects resolution
- Full control
- Manual work
- Most accurate

**Automatic Resolution:**
- Auto-choose strategy
- Fast
- May be wrong
- Good for simple cases

**Interactive Resolution:**
- Side-by-side comparison
- User guides resolution
- Good balance
- Common approach

**Implementation:**
```javascript
class ConflictResolution {
  resolveConflict(conflict, resolution) {
    switch (resolution.strategy) {
      case 'source':
        return conflict.sourceContent;
      case 'target':
        return conflict.targetContent;
      case 'both':
        return conflict.sourceContent + '\n' + conflict.targetContent;
      case 'custom':
        return resolution.customContent;
      default:
        return conflict.baseContent;
    }
  }
  
  presentConflict(conflict) {
    return {
      base: conflict.baseContent,
      source: conflict.sourceContent,
      target: conflict.targetContent,
      location: conflict.location,
      context: conflict.context
    };
  }
  
  autoResolve(conflict) {
    // Simple auto-resolution
    if (conflict.sourceContent === conflict.targetContent) {
      return conflict.sourceContent;
    }
    
    // Prefer longer content
    if (conflict.sourceContent.length > conflict.targetContent.length) {
      return conflict.sourceContent;
    }
    
    return conflict.targetContent;
  }
}
```

**Best Practices:**
- Provide clear conflict UI
- Support multiple resolution strategies
- Allow custom resolution
- Document resolution choices

---

### 7.3 Selective Integration

**Selective Merge Features:**

**Choose Changes:**
- Select specific changes
- Granular control
- Precise merging
- Good for complex cases

**Change Preview:**
- Preview before merge
- See what will change
- Informed decisions
- Good UX

**Batch Selection:**
- Select multiple changes
- Efficient
- Less granular
- Good for many changes

**Implementation:**
```javascript
class SelectiveMerge {
  prepareMerge(sourceBranchId, targetBranchId) {
    const source = this.getBranch(sourceBranchId);
    const target = this.getBranch(targetBranchId);
    const base = this.findCommonAncestor(source, target);
    
    // Compute changes
    const sourceChanges = this.computeChanges(base, source);
    const targetChanges = this.computeChanges(base, target);
    
    // Identify conflicts
    const conflicts = this.identifyConflicts(sourceChanges, targetChanges);
    
    // Prepare merge preview
    return {
      sourceChanges: sourceChanges,
      targetChanges: targetChanges,
      conflicts: conflicts,
      preview: this.generatePreview(sourceChanges, targetChanges, conflicts)
    };
  }
  
  applySelectedChanges(targetBranchId, selectedChanges) {
    const target = this.getBranch(targetBranchId);
    
    selectedChanges.forEach(change => {
      if (change.type === 'insert') {
        target.content = this.insertAt(target.content, change.position, change.content);
      } else if (change.type === 'delete') {
        target.content = this.deleteAt(target.content, change.position, change.length);
      } else if (change.type === 'replace') {
        target.content = this.replaceAt(target.content, change.position, change.oldContent, change.newContent);
      }
    });
    
    this.saveBranch(target);
  }
  
  generatePreview(sourceChanges, targetChanges, conflicts) {
    // Generate visual preview of merge
    return {
      additions: sourceChanges.filter(c => c.type === 'insert'),
      deletions: sourceChanges.filter(c => c.type === 'delete'),
      modifications: sourceChanges.filter(c => c.type === 'replace'),
      conflicts: conflicts
    };
  }
}
```

**Best Practices:**
- Provide change preview
- Support granular selection
- Show change context
- Make selection easy

---

## 8. Visual Representation of Branch Relationships

### 8.1 Tree Views

**Tree View Features:**

**Hierarchical Display:**
- Parent-child relationships
- Clear hierarchy
- Expand/collapse
- Good for structure

**Interactive:**
- Click to navigate
- Expand/collapse nodes
- Drag to reorganize
- Good UX

**Visual Indicators:**
- Current branch highlighted
- Modified branches marked
- Merge points shown
- Clear status

**Implementation:**
```javascript
class BranchTreeView {
  renderTree(rootBranchId) {
    const root = this.getBranch(rootBranchId);
    const tree = this.buildTree(root);
    return this.renderTreeNode(tree, 0);
  }
  
  buildTree(branch) {
    const children = this.getChildBranches(branch.id);
    return {
      branch: branch,
      children: children.map(child => this.buildTree(child))
    };
  }
  
  renderTreeNode(node, depth) {
    const indent = '  '.repeat(depth);
    const isCurrent = node.branch.id === this.currentBranchId;
    const isModified = this.isModified(node.branch);
    
    let html = `<div class="tree-node ${isCurrent ? 'current' : ''} ${isModified ? 'modified' : ''}">`;
    html += `${indent}`;
    html += `<span class="node-icon">${this.getNodeIcon(node)}</span>`;
    html += `<span class="node-name" data-branch-id="${node.branch.id}">${node.branch.metadata.name}</span>`;
    html += `</div>`;
    
    if (node.expanded) {
      node.children.forEach(child => {
        html += this.renderTreeNode(child, depth + 1);
      });
    }
    
    return html;
  }
  
  getNodeIcon(node) {
    if (node.branch.id === this.currentBranchId) {
      return '●';
    }
    if (this.isModified(node.branch)) {
      return '✎';
    }
    if (node.children.length > 0) {
      return node.expanded ? '▼' : '▶';
    }
    return '○';
  }
}
```

**Best Practices:**
- Make hierarchy clear
- Support expand/collapse
- Highlight current branch
- Show branch status

---

### 8.2 Graph Visualizations

**Graph View Features:**

**Node-Link Diagram:**
- Visual graph representation
- Interactive nodes
- Draggable layout
- Good for relationships

**Force-Directed Layout:**
- Automatic layout
- Clustering
- Good visualization
- Common approach

**Interactive Exploration:**
- Click to navigate
- Zoom and pan
- Filter nodes
- Good UX

**Implementation:**
```javascript
class BranchGraphView {
  renderGraph(noteId) {
    const graph = this.buildGraph(noteId);
    
    // Use graph library (D3.js, vis.js, cytoscape.js, etc.)
    const svg = d3.select('#branch-graph')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    
    // Create force simulation
    const simulation = d3.forceSimulation(graph.nodes)
      .force('link', d3.forceLink(graph.links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2));
    
    // Render links
    const links = svg.append('g')
      .selectAll('line')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('stroke', d => d.type === 'merge' ? '#ff6b6b' : '#4ecdc4')
      .attr('stroke-width', 2);
    
    // Render nodes
    const nodes = svg.append('g')
      .selectAll('circle')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('r', 10)
      .attr('fill', d => d.current ? '#ffd93d' : '#6bcf7f')
      .call(this.drag(simulation));
    
    // Add labels
    const labels = svg.append('g')
      .selectAll('text')
      .data(graph.nodes)
      .enter()
      .append('text')
      .text(d => d.label)
      .attr('font-size', 12)
      .attr('dx', 15)
      .attr('dy', 4);
    
    // Update on simulation tick
    simulation.on('tick', () => {
      links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      nodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      
      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
  }
  
  buildGraph(noteId) {
    const nodes = [];
    const links = [];
    
    const branches = this.getAllBranches(noteId);
    branches.forEach(branch => {
      nodes.push({
        id: branch.id,
        label: branch.metadata.name || branch.id,
        current: branch.id === this.currentBranchId,
        modified: this.isModified(branch)
      });
      
      if (branch.parentId) {
        links.push({
          source: branch.parentId,
          target: branch.id,
          type: 'parent'
        });
      }
      
      if (branch.mergedFrom) {
        branch.mergedFrom.forEach(mergedId => {
          links.push({
            source: mergedId,
            target: branch.id,
            type: 'merge'
          });
        });
      }
    });
    
    return { nodes, links };
  }
}
```

**Best Practices:**
- Use appropriate graph library
- Support interactive exploration
- Provide zoom/pan
- Highlight important nodes

---

### 8.3 Branch Indicators in UI

**UI Indicators:**

**Branch Badge:**
- Current branch name
- Click to switch
- Prominent display
- Good visibility

**Branch Breadcrumb:**
- Show branch path
- Navigate hierarchy
- Context display
- Good for navigation

**Branch Status Icon:**
- Modified indicator
- Sync status
- Visual feedback
- Good for awareness

**Color Coding:**
- Different colors per branch
- Visual distinction
- Quick identification
- Good for organization

**Implementation:**
```javascript
class BranchUIIndicators {
  renderBranchBadge(branch) {
    const badge = document.createElement('div');
    badge.className = 'branch-badge';
    badge.innerHTML = `
      <span class="branch-name">${branch.metadata.name || 'Main'}</span>
      <span class="branch-icon">${this.getBranchIcon(branch)}</span>
    `;
    
    badge.addEventListener('click', () => {
      this.openBranchSelector();
    });
    
    return badge;
  }
  
  renderBranchBreadcrumb(branch) {
    const path = this.getBranchPath(branch);
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'branch-breadcrumb';
    breadcrumb.setAttribute('aria-label', 'Branch navigation');
    
    path.forEach((node, index) => {
      const item = document.createElement('a');
      item.href = '#';
      item.textContent = node.metadata.name || node.id;
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchToBranch(node.id);
      });
      
      breadcrumb.appendChild(item);
      
      if (index < path.length - 1) {
        const separator = document.createElement('span');
        separator.textContent = ' / ';
        separator.className = 'separator';
        breadcrumb.appendChild(separator);
      }
    });
    
    return breadcrumb;
  }
  
  updateBranchStatus(branch) {
    const indicator = document.querySelector(`[data-branch-id="${branch.id}"]`);
    if (indicator) {
      const status = this.getBranchStatus(branch);
      indicator.className = `branch-status ${status}`;
      indicator.setAttribute('title', this.getStatusText(status));
      
      // Add status icon
      const icon = indicator.querySelector('.status-icon');
      if (icon) {
        icon.textContent = this.getStatusIcon(status);
      }
    }
  }
  
  getBranchStatus(branch) {
    if (this.isModified(branch)) return 'modified';
    if (this.isSynced(branch)) return 'synced';
    if (this.isCurrent(branch)) return 'current';
    return 'normal';
  }
}
```

**Best Practices:**
- Make indicators visible
- Show current branch clearly
- Provide interaction
- Update in real-time

---

## 9. Branch Search and Filtering

### 9.1 Finding Branches by Name

**Search Features:**

**Text Search:**
- Search branch names
- Simple matching
- Fast
- Good for basic needs

**Fuzzy Search:**
- Handle typos
- Flexible matching
- Better UX
- More complex

**Prefix Search:**
- Match from start
- Fast
- Good for autocomplete
- Common pattern

**Implementation:**
```javascript
class BranchSearch {
  searchByName(query, branches) {
    const queryLower = query.toLowerCase();
    
    return branches.filter(branch => {
      const name = (branch.metadata.name || branch.id).toLowerCase();
      
      // Exact match
      if (name === queryLower) return true;
      
      // Contains match
      if (name.includes(queryLower)) return true;
      
      // Prefix match
      if (name.startsWith(queryLower)) return true;
      
      // Fuzzy match (simplified)
      if (this.fuzzyMatch(name, queryLower)) return true;
      
      return false;
    });
  }
  
  fuzzyMatch(text, query) {
    // Simple fuzzy matching
    let textIndex = 0;
    let queryIndex = 0;
    
    while (textIndex < text.length && queryIndex < query.length) {
      if (text[textIndex] === query[queryIndex]) {
        queryIndex++;
      }
      textIndex++;
    }
    
    return queryIndex === query.length;
  }
  
  searchByDescription(query, branches) {
    const queryLower = query.toLowerCase();
    
    return branches.filter(branch => {
      const description = (branch.metadata.description || '').toLowerCase();
      return description.includes(queryLower);
    });
  }
}
```

**Best Practices:**
- Support multiple search types
- Provide search suggestions
- Highlight matches
- Show search results count

---

### 9.2 Filtering by Date

**Date Filtering:**

**Creation Date:**
- Filter by creation date
- Date range
- Recent branches
- Useful for organization

**Modification Date:**
- Filter by last modified
- Active branches
- Recent activity
- Useful for finding work

**Date Range:**
- Start and end date
- Flexible filtering
- Good for queries
- Common pattern

**Implementation:**
```javascript
class BranchDateFilter {
  filterByCreationDate(branches, startDate, endDate) {
    return branches.filter(branch => {
      const created = new Date(branch.metadata.createdAt);
      return created >= startDate && created <= endDate;
    });
  }
  
  filterByModificationDate(branches, startDate, endDate) {
    return branches.filter(branch => {
      const modified = new Date(branch.metadata.modifiedAt || branch.metadata.createdAt);
      return modified >= startDate && modified <= endDate;
    });
  }
  
  getRecentBranches(branches, days = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return branches.filter(branch => {
      const modified = new Date(branch.metadata.modifiedAt || branch.metadata.createdAt);
      return modified >= cutoff;
    });
  }
  
  getBranchesByPeriod(branches, period) {
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return branches;
    }
    
    return this.filterByModificationDate(branches, startDate, now);
  }
}
```

**Best Practices:**
- Support date ranges
- Provide quick filters
- Show date in UI
- Support relative dates

---

### 9.3 Filtering by Content

**Content Filtering:**

**Text Search:**
- Search branch content
- Full-text search
- Find relevant branches
- Useful for discovery

**Tag Filtering:**
- Filter by tags
- Categorize branches
- Organize
- Good for management

**Metadata Filtering:**
- Filter by purpose
- Filter by status
- Custom filters
- Flexible

**Implementation:**
```javascript
class BranchContentFilter {
  filterByContent(branches, query) {
    const queryLower = query.toLowerCase();
    
    return branches.filter(branch => {
      const content = (branch.content || '').toLowerCase();
      return content.includes(queryLower);
    });
  }
  
  filterByTags(branches, tags) {
    return branches.filter(branch => {
      const branchTags = branch.metadata.tags || [];
      return tags.every(tag => branchTags.includes(tag));
    });
  }
  
  filterByPurpose(branches, purpose) {
    return branches.filter(branch => {
      return branch.metadata.purpose === purpose;
    });
  }
  
  filterByStatus(branches, status) {
    return branches.filter(branch => {
      if (status === 'modified') return this.isModified(branch);
      if (status === 'current') return this.isCurrent(branch);
      if (status === 'merged') return branch.mergedFrom && branch.mergedFrom.length > 0;
      return true;
    });
  }
  
  combineFilters(branches, filters) {
    let result = branches;
    
    if (filters.name) {
      result = this.searchByName(filters.name, result);
    }
    
    if (filters.content) {
      result = this.filterByContent(result, filters.content);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      result = this.filterByTags(result, filters.tags);
    }
    
    if (filters.purpose) {
      result = this.filterByPurpose(result, filters.purpose);
    }
    
    if (filters.status) {
      result = this.filterByStatus(result, filters.status);
    }
    
    if (filters.dateRange) {
      result = this.filterByModificationDate(result, filters.dateRange.start, filters.dateRange.end);
    }
    
    return result;
  }
}
```

**Best Practices:**
- Support multiple filters
- Allow filter combinations
- Provide quick filters
- Show filter results count

---

## 10. Branch Comparison

### 10.1 Viewing Differences Between Branches

**Diff Visualization:**

**Side-by-Side:**
- Two columns
- Compare directly
- Clear differences
- Common pattern

**Unified Diff:**
- Single view
- Inline changes
- Compact
- Good for code

**Inline Changes:**
- Changes highlighted
- Context preserved
- Easy to read
- Good for text

**Implementation:**
```javascript
class BranchComparison {
  compareBranches(branch1Id, branch2Id) {
    const branch1 = this.getBranch(branch1Id);
    const branch2 = this.getBranch(branch2Id);
    
    const diff = this.computeDiff(branch1.content, branch2.content);
    
    return {
      branch1: branch1,
      branch2: branch2,
      diff: diff,
      statistics: this.computeStatistics(diff)
    };
  }
  
  renderSideBySide(comparison) {
    const container = document.createElement('div');
    container.className = 'branch-comparison side-by-side';
    
    const left = document.createElement('div');
    left.className = 'comparison-left';
    left.innerHTML = this.renderDiff(comparison.diff, 'left');
    
    const right = document.createElement('div');
    right.className = 'comparison-right';
    right.innerHTML = this.renderDiff(comparison.diff, 'right');
    
    container.appendChild(left);
    container.appendChild(right);
    
    return container;
  }
  
  renderUnified(comparison) {
    const container = document.createElement('div');
    container.className = 'branch-comparison unified';
    
    comparison.diff.operations.forEach(op => {
      const line = document.createElement('div');
      line.className = `diff-line ${op.type}`;
      
      if (op.type === 'insert') {
        line.className += ' added';
        line.textContent = '+' + op.text;
      } else if (op.type === 'delete') {
        line.className += ' removed';
        line.textContent = '-' + op.text;
      } else {
        line.className += ' unchanged';
        line.textContent = ' ' + op.text;
      }
      
      container.appendChild(line);
    });
    
    return container;
  }
  
  computeStatistics(diff) {
    let added = 0;
    let removed = 0;
    let unchanged = 0;
    
    diff.operations.forEach(op => {
      if (op.type === 'insert') added += op.length;
      else if (op.type === 'delete') removed += op.length;
      else unchanged += op.length;
    });
    
    return {
      added,
      removed,
      unchanged,
      total: added + removed + unchanged,
      similarity: unchanged / (added + removed + unchanged)
    };
  }
}
```

**Best Practices:**
- Support multiple view types
- Highlight differences clearly
- Show statistics
- Provide navigation

---

### 10.2 Side-by-Side Comparison

**Side-by-Side Features:**

**Synchronized Scrolling:**
- Scroll together
- Aligned content
- Easy comparison
- Good UX

**Change Highlighting:**
- Highlight differences
- Color coding
- Clear indication
- Good visibility

**Navigation:**
- Jump to next change
- Jump to previous change
- Quick navigation
- Efficient

**Implementation:**
```javascript
class SideBySideComparison {
  renderComparison(branch1, branch2) {
    const diff = this.computeDiff(branch1.content, branch2.content);
    const aligned = this.alignContent(diff);
    
    const container = document.createElement('div');
    container.className = 'side-by-side-comparison';
    
    const left = this.renderColumn(aligned, 'left', branch1);
    const right = this.renderColumn(aligned, 'right', branch2);
    
    container.appendChild(left);
    container.appendChild(right);
    
    // Synchronize scrolling
    this.synchronizeScrolling(left, right);
    
    return container;
  }
  
  alignContent(diff) {
    // Align content for side-by-side display
    const aligned = [];
    let leftIndex = 0;
    let rightIndex = 0;
    
    diff.operations.forEach(op => {
      if (op.type === 'unchanged') {
        aligned.push({
          left: op.text,
          right: op.text,
          type: 'unchanged'
        });
        leftIndex += op.length;
        rightIndex += op.length;
      } else if (op.type === 'delete') {
        aligned.push({
          left: op.text,
          right: null,
          type: 'delete'
        });
        leftIndex += op.length;
      } else if (op.type === 'insert') {
        aligned.push({
          left: null,
          right: op.text,
          type: 'insert'
        });
        rightIndex += op.length;
      }
    });
    
    return aligned;
  }
  
  synchronizeScrolling(left, right) {
    left.addEventListener('scroll', () => {
      right.scrollTop = left.scrollTop;
    });
    
    right.addEventListener('scroll', () => {
      left.scrollTop = right.scrollTop;
    });
  }
  
  navigateToChange(direction) {
    const changes = this.getAllChanges();
    const currentIndex = this.getCurrentChangeIndex();
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % changes.length;
    } else {
      newIndex = (currentIndex - 1 + changes.length) % changes.length;
    }
    
    this.scrollToChange(changes[newIndex]);
  }
}
```

**Best Practices:**
- Synchronize scrolling
- Highlight differences clearly
- Support navigation
- Provide statistics

---

## 11. Branch Lifecycle

### 11.1 Creating Branches

**Creation Process:**

**User Initiation:**
- User triggers creation
- Select branch point
- Provide metadata
- Confirm creation

**Automatic Setup:**
- Create branch structure
- Inherit context
- Set up metadata
- Initialize storage

**Validation:**
- Validate branch point
- Check permissions
- Verify storage
- Ensure success

**Implementation:**
```javascript
class BranchCreation {
  async createBranch(noteId, branchPoint, options = {}) {
    // Validate
    if (!this.validateBranchPoint(noteId, branchPoint)) {
      throw new Error('Invalid branch point');
    }
    
    // Get parent note
    const parentNote = await this.getNote(noteId);
    
    // Create branch
    const branch = {
      id: this.generateBranchId(),
      parentId: noteId,
      branchPoint: branchPoint,
      content: await this.getContentUpTo(parentNote, branchPoint),
      metadata: {
        name: options.name || this.generateDefaultName(branchPoint),
        description: options.description || '',
        purpose: options.purpose || 'exploration',
        tags: options.tags || [],
        createdAt: new Date(),
        createdBy: this.getCurrentUser()
      },
      context: await this.captureContext(parentNote, branchPoint)
    };
    
    // Store branch
    await this.storeBranch(branch);
    
    // Update parent
    await this.addChildBranch(noteId, branch.id);
    
    return branch;
  }
  
  validateBranchPoint(noteId, branchPoint) {
    // Validate branch point is valid for note
    if (branchPoint.type === 'position') {
      const note = this.getNote(noteId);
      return branchPoint.value.offset >= 0 && branchPoint.value.offset <= note.content.length;
    } else if (branchPoint.type === 'timestamp') {
      return this.versionExists(noteId, branchPoint.value);
    }
    return false;
  }
  
  generateBranchId() {
    return `branch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  generateDefaultName(branchPoint) {
    const timestamp = new Date().toLocaleString();
    if (branchPoint.type === 'position') {
      return `Branch at line ${branchPoint.value.line}`;
    } else if (branchPoint.type === 'timestamp') {
      return `Branch from ${branchPoint.value}`;
    }
    return `Branch ${timestamp}`;
  }
}
```

**Best Practices:**
- Validate inputs
- Provide defaults
- Capture context
- Handle errors

---

### 11.2 Renaming Branches

**Rename Process:**

**User Action:**
- User initiates rename
- Edit name
- Validate new name
- Save changes

**Validation:**
- Check name uniqueness
- Validate format
- Ensure permissions
- Handle conflicts

**Implementation:**
```javascript
class BranchRename {
  async renameBranch(branchId, newName) {
    // Validate
    if (!this.validateBranchName(newName)) {
      throw new Error('Invalid branch name');
    }
    
    // Check uniqueness
    if (await this.nameExists(branchId, newName)) {
      throw new Error('Branch name already exists');
    }
    
    // Get branch
    const branch = await this.getBranch(branchId);
    
    // Update name
    branch.metadata.name = newName;
    branch.metadata.modifiedAt = new Date();
    
    // Save
    await this.saveBranch(branch);
    
    // Update UI
    this.updateBranchIndicator(branch);
    
    return branch;
  }
  
  validateBranchName(name) {
    // Validate name format
    if (!name || name.trim().length === 0) {
      return false;
    }
    if (name.length > 100) {
      return false;
    }
    // Add more validation rules
    return true;
  }
  
  async nameExists(branchId, name) {
    const branch = await this.getBranch(branchId);
    const siblings = await this.getSiblingBranches(branch.parentId);
    
    return siblings.some(sibling => 
      sibling.id !== branchId && 
      sibling.metadata.name === name
    );
  }
}
```

**Best Practices:**
- Validate names
- Check uniqueness
- Update UI
- Handle errors

---

### 11.3 Deleting Branches

**Deletion Process:**

**User Confirmation:**
- Confirm deletion
- Warn about consequences
- Explain what will be deleted
- Require explicit confirmation

**Cascade Handling:**
- Handle child branches
- Option to delete children
- Or orphan children
- User choice

**Cleanup:**
- Remove branch data
- Clean up storage
- Update references
- Maintain integrity

**Implementation:**
```javascript
class BranchDeletion {
  async deleteBranch(branchId, options = {}) {
    const branch = await this.getBranch(branchId);
    
    // Check for children
    const children = await this.getChildBranches(branchId);
    if (children.length > 0 && !options.deleteChildren) {
      throw new Error('Branch has children. Delete children first or use deleteChildren option.');
    }
    
    // Delete children if requested
    if (options.deleteChildren) {
      for (const child of children) {
        await this.deleteBranch(child.id, { deleteChildren: true });
      }
    } else {
      // Orphan children
      for (const child of children) {
        child.parentId = branch.parentId;
        await this.saveBranch(child);
      }
    }
    
    // Remove from parent
    await this.removeChildBranch(branch.parentId, branchId);
    
    // Delete branch data
    await this.deleteBranchData(branchId);
    
    // Clean up storage
    await this.cleanupBranchStorage(branch);
    
    return true;
  }
  
  async deleteBranchData(branchId) {
    // Delete branch from store
    await this.branchStore.delete(branchId);
    
    // Delete associated data
    await this.deleteBranchContent(branchId);
    await this.deleteBranchMetadata(branchId);
  }
  
  async cleanupBranchStorage(branch) {
    // Clean up unused content references
    if (branch.contentRef) {
      const refCount = await this.getContentReferenceCount(branch.contentRef);
      if (refCount === 0) {
        await this.deleteSharedContent(branch.contentRef);
      }
    }
  }
  
  confirmDeletion(branch) {
    const message = `Delete branch "${branch.metadata.name}"?`;
    const details = this.getDeletionDetails(branch);
    return this.showConfirmationDialog(message, details);
  }
  
  getDeletionDetails(branch) {
    const children = this.getChildBranches(branch.id);
    let details = 'This will delete the branch and all its content.';
    
    if (children.length > 0) {
      details += `\n\nThis branch has ${children.length} child branch(es).`;
      details += '\nYou can choose to delete them or move them to the parent.';
    }
    
    return details;
  }
}
```

**Best Practices:**
- Require confirmation
- Handle children properly
- Clean up storage
- Maintain integrity

---

### 11.4 Branch Organization

**Organization Features:**

**Grouping:**
- Group related branches
- Organize by purpose
- Categorize
- Better management

**Sorting:**
- Sort by name
- Sort by date
- Sort by activity
- Custom sorting

**Filtering:**
- Filter by criteria
- Find branches
- Organize view
- Better navigation

**Implementation:**
```javascript
class BranchOrganization {
  groupBranches(branches, groupBy) {
    const groups = new Map();
    
    branches.forEach(branch => {
      const key = this.getGroupKey(branch, groupBy);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(branch);
    });
    
    return Array.from(groups.entries()).map(([key, items]) => ({
      key,
      branches: items
    }));
  }
  
  getGroupKey(branch, groupBy) {
    switch (groupBy) {
      case 'purpose':
        return branch.metadata.purpose || 'other';
      case 'date':
        return this.formatDateGroup(branch.metadata.createdAt);
      case 'parent':
        return branch.parentId || 'root';
      case 'tag':
        return branch.metadata.tags[0] || 'untagged';
      default:
        return 'all';
    }
  }
  
  sortBranches(branches, sortBy, direction = 'asc') {
    const sorted = [...branches];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = (a.metadata.name || a.id).localeCompare(b.metadata.name || b.id);
          break;
        case 'date':
          comparison = new Date(a.metadata.createdAt) - new Date(b.metadata.createdAt);
          break;
        case 'modified':
          comparison = new Date(a.metadata.modifiedAt || a.metadata.createdAt) - 
                      new Date(b.metadata.modifiedAt || b.metadata.createdAt);
          break;
        case 'activity':
          comparison = (a.metadata.accessCount || 0) - (b.metadata.accessCount || 0);
          break;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }
}
```

**Best Practices:**
- Support multiple grouping options
- Allow custom sorting
- Provide filtering
- Save preferences

---

## 12. Summary and Recommendations

### 12.1 Recommended Approach

**Data Structure:**
- **Tree structure** with merge support for branch relationships
- **Reference-based storage** for efficient content sharing
- **Delta compression** for storage optimization

**Branch Creation:**
- Support branching from any point (content position, timestamp, version)
- Full context inheritance by default
- Clear branch point indication

**Navigation:**
- Multiple navigation methods (selector, sidebar, tabs)
- Visual branch relationship display (tree view, graph view)
- Clear branch indicators in UI

**Storage:**
- Hybrid approach: copy essential content, reference shared content
- Delta compression for changes
- Efficient storage of branches

**Merge:**
- Three-way merge for combining branches
- Interactive conflict resolution
- Selective merge support

### 12.2 Implementation Priority

**Phase 1 (MVP):**
- Basic branch creation
- Simple tree structure
- Branch switching
- Basic storage

**Phase 2 (Enhanced):**
- Branch metadata
- Visual relationship display
- Branch search and filtering
- Basic merge support

**Phase 3 (Advanced):**
- Advanced merge strategies
- Branch comparison
- Graph visualization
- Storage optimization

### 12.3 Technical Stack Recommendations

**Data Structures:**
- **Tree structure** for branch relationships
- **Graph library** (D3.js, vis.js) for visualization
- **Diff library** (diff-match-patch) for comparisons

**Storage:**
- **Content-addressable storage** for shared content
- **Delta compression** for changes
- **Reference-based** storage pattern

**UI Components:**
- **Tree view** component for hierarchy
- **Graph visualization** for relationships
- **Diff viewer** for comparisons

### 12.4 Key Considerations

1. **Branch Independence:** Each branch must maintain full editing capability
2. **Context Preservation:** Branches should inherit and display parent context
3. **Storage Efficiency:** Implement efficient storage to handle many branches
4. **Navigation:** Intuitive interface for switching and understanding relationships
5. **Merge Support:** Robust merge strategies with conflict resolution
6. **Performance:** Efficient rendering and storage for large branch trees

### 12.5 Next Steps

1. Design branch data structure
2. Implement branch creation
3. Build branch navigation UI
4. Implement branch storage
5. Add branch metadata management
6. Implement merge functionality
7. Add branch comparison
8. Performance optimization
9. Testing and refinement

---

## 13. References and Resources

### 13.1 Documentation Links

- **Git Branching:** https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell
- **D3.js:** https://d3js.org/
- **vis.js:** https://visjs.org/
- **diff-match-patch:** https://github.com/google/diff-match-patch

### 13.2 Additional Resources

- **ChatGPT Branching:** Study ChatGPT's conversation branching interface
- **Claude Threading:** Study Claude's thread-based conversation model
- **Version Control Systems:** Git, Mercurial branching patterns

### 13.3 Research Notes

- Research conducted through documentation review and pattern analysis
- Information current as of 2024
- Branching patterns inspired by AI chatbot interfaces
- Storage patterns based on version control systems
- UI patterns based on successful note-taking applications

---

**Document Status:** Research Complete  
**Last Updated:** 2024  
**Next Action:** Review findings and proceed with implementation planning

