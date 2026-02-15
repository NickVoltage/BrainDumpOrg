# AI ReadME: Project Guidance and Rules

> **Note:** This document serves as the central guidance document for AI assistants and developers working on this project. It provides quick reference to project standards, conventions, and guidance documents.

**Document Purpose:** Central hub for all project guidance, rules, and conventions.

**Last Updated:** 2024  
**Maintained By:** Development Team

---

## 1. Project Overview

### 1.1 Project Description

**Project Name:** Note-Taking Application

**Project Goals:**
- Full-featured rich text editor (Google Docs-like)
- Local file saving and management
- Reminders and calendar integration
- Support for popular file types (DOCX, PDF, etc.)
- Custom metadata association (tags, projects, document numbers)
- To-do lists within notes
- Branched notes (explore alternatives without losing context)
- Non-destructive historical timelines
- Modern, customizable GUI

**Development Philosophy:**
- User feedback-driven development
- Modular, maintainable architecture
- High-quality code documentation
- Incremental, iterative improvement
- Accessibility-first design

---

### 1.2 Project Status

**Current Phase:** Planning and Research Complete, Ready for Development

**Research Documents:**
- All feature research documents completed (01_Research_*.md)
- Development best practices documented (02_Dev_Best_Practices_Research.md)
- Project planning complete (03_Project_Planning.md)

**Next Steps:**
- Set up development environment
- Initialize project structure
- Begin Phase 1: Foundation development

---

## 2. Development Rules and Standards

### 2.1 Core Development Rules

**Code Quality:**
- All code must be typed (TypeScript)
- Follow single responsibility principle
- Write self-documenting code
- Add comprehensive comments
- Write tests for critical functionality

**File Standards:**
- Every file must have header comment (see Section 3.1)
- Follow naming conventions (see 03_Project_Planning.md)
- Organize imports properly
- Export appropriately

**Comment Standards:**
- Use numbered comments for complex logic (see 00_Codebase_Comments_Guidelines.md)
- Document relationships between code
- Explain "why" not just "what"
- Keep comments current

**Documentation:**
- Update file headers when code changes fundamentally
- Maintain comment registry
- Keep guidance documents current
- Document architecture decisions

---

### 2.2 Code Organization

**Structure:**
- Component-based architecture
- Layered architecture (Presentation, Application, Domain, Infrastructure)
- Service-oriented design
- Modular components

**File Organization:**
- Follow project structure (see 03_Project_Planning.md)
- Group related files together
- Use consistent naming
- Maintain clear hierarchy

---

### 2.3 Development Workflow

**Process:**
1. Plan feature/change
2. Create/update files with proper headers
3. Implement with numbered comments
4. Write tests
5. Update documentation
6. Code review
7. Merge

**File Creation:**
- Always add file header comment
- List related files
- Document code hierarchy
- Explain logic flow

**Code Modification:**
- Review file header
- Update if purpose/flow changes
- Add/update numbered comments
- Update comment registry
- Update tests

---

## 3. Documentation Standards

### 3.1 File Header Comments

**Required for Every File:**

Every source file must begin with a comprehensive header comment including:

1. **File Purpose:** Clear description of what the file does
2. **Related Files:** List of files this file depends on or relates to
3. **Code Hierarchy:** Summary of code structure within the file
4. **Logic Flow:** High-level explanation of execution flow
5. **Maintenance Note:** Reminder to update when fundamental changes occur

**Template:**
See `03_Project_Planning.md` Section 3.1 for complete template and examples.

**Key Requirement:**
⚠️ File headers must be updated when fundamental changes are made to:
- File purpose or responsibility
- Related file relationships
- Code hierarchy or structure
- Logic flow or execution paths

---

### 3.2 Comment Numbering System

**Numbered Comments:**
- Use format: `Comment 001`, `Comment 002`, etc.
- Three-digit numbers (001-999)
- Shared numbers for related code across files
- Document relationships

**Bi-Directional Relationships:**
- Same number = related functionality
- Different files can share numbers
- Indicates code flow and dependencies
- Helps navigation and understanding

**Guidelines:**
See `00_Codebase_Comments_Guidelines.md` for complete guidelines, examples, and best practices.

---

### 3.3 Comment Registry

**Purpose:**
- Track all comment numbers
- Document comment locations
- Map relationships
- Enable navigation

**Maintenance:**
- Update when adding comments
- Update when changing relationships
- Keep current and accurate

**Location:**
- Documented in `00_Codebase_Comments_Guidelines.md`
- Comment directory will be its own `00_Comment_Directory.md` document in the top level directory
- Allows for verbose information density

---

## 4. Project Guidance Documents

### 4.1 Guidance Documents Overview

All project guidance documents use the `00_` prefix for easy identification and sorting.

**Core Guidance Documents:**

1. **00_AI_ReadME_Project_Guidance_And_Rules.md** (This Document)
   - **Purpose:** Central hub for all project guidance
   - **Contains:** Project overview, development rules, links to all guidance docs
   - **Audience:** AI assistants, developers, new team members
   - **Maintenance:** Update when new guidance documents are added or rules change

2. **00_Codebase_Comments_Guidelines.md**
   - **Purpose:** Defines comment numbering conventions and bi-directional relationships
   - **Contains:** Comment format, numbering system, relationship patterns, registry
   - **Audience:** All developers writing code
   - **Maintenance:** Update when comment standards evolve

3. **00_Project_Desires.md**
   - **Purpose:** Documents all desired features and goals for the project
   - **Contains:** Feature checklist, research findings links, feature descriptions
   - **Audience:** Project stakeholders, developers, AI assistants
   - **Maintenance:** Update when new features are added or requirements change

4. **00_Dev_Niceities.md**
   - **Purpose:** Development approaches, patterns, and quality-of-life improvements
   - **Contains:** Content type system, GUI development patterns, development niceities
   - **Audience:** All developers
   - **Status:** Living Document

5. **00_Development_Journey.md**
   - **Purpose:** Directory/index of all development journey documentation tracking issue resolution and lessons learned
   - **Contains:** List of active and resolved journey documents, creation guidelines, archive workflow
   - **Audience:** All developers, AI assistants
   - **Status:** Active Directory

6. **00_Dev_Journey_Template.md**
   - **Purpose:** Template for creating individual development journey documents
   - **Contains:** Structure for documenting issues, debugging approaches, root causes, solutions
   - **Audience:** All developers documenting debugging experiences
   - **Status:** Template

**Planning Documents:**

7. **01_Project_Research_Agenda.md**
   - **Purpose:** Outlines research tasks needed for project planning
   - **Contains:** Research checklist, methodology, decision criteria
   - **Audience:** Research phase, planning phase
   - **Status:** Research complete

8. **01_Research_*.md** (Multiple Documents)
   - **Purpose:** Research findings for each feature area
   - **Contains:** Implementation approaches, best practices, recommendations
   - **Audience:** Developers implementing features
   - **Status:** All research documents completed

9. **02_Dev_Best_Practices_Research.md**
   - **Purpose:** Development best practices and methodologies
   - **Contains:** Modular architecture, documentation, planning, prototyping, GUI customization
   - **Audience:** All developers
   - **Status:** Complete

10. **03_Project_Planning.md**
    - **Purpose:** Technical planning including tech stack, architecture, and standards
    - **Contains:** Technology decisions, project structure, documentation standards
    - **Audience:** All developers, project managers
    - **Status:** Complete

11. **04_Proposed_Selections_From_Project_Planning.md**
    - **Purpose:** Technology selections and architectural decisions
    - **Contains:** Framework choices, content format decisions, styling solutions, implementation requirements
    - **Audience:** All developers
    - **Status:** Active Decision Tracking

12. **05_Projected_Issues_And_Research.md**
    - **Purpose:** Projected technical issues and researched solutions
    - **Contains:** Critical and moderate challenges, solutions with pros/cons, recommendations
    - **Audience:** All developers
    - **Status:** Complete

**Architecture Documents:**

13. **06_Project_Architecture.md**
    - **Purpose:** Consolidated architecture documentation and implementation guide
    - **Contains:** Architecture overview, project structure, data architecture, integration patterns
    - **Audience:** All developers
    - **Status:** Complete

14. **07_Logic_Flow_Guidelines.md**
    - **Purpose:** Guidelines for logic flow within the application
    - **Contains:** Core principles, standard patterns, feature integration, decision guidelines
    - **Audience:** All developers
    - **Status:** Complete

**Development Documents:**

15. **08_Development_Practices_And_Testing.md**
    - **Purpose:** Development practices, testing standards, and debugging workflows
    - **Contains:** Standalone development approach, codebase analysis, testing standards, debugging workflows
    - **Audience:** All developers
    - **Status:** Complete

16. **09_Development_Tips_And_Tricks.md**
    - **Purpose:** Practical tips, tricks, and optimizations for development productivity
    - **Contains:** AI-assisted development tips, React/TypeScript tips, Tauri tips, performance optimization, debugging tips, productivity tips
    - **Audience:** All developers
    - **Status:** Living Document

17. **10_AI_Reliable_Development_And_Debugging.md**
    - **Purpose:** Guide for getting AI to reliably create functional applications and effective debugging strategies
    - **Contains:** TDD approach, test coverage strategies, prompt engineering, debugging workflows, error analysis
    - **Audience:** All developers, AI assistants
    - **Status:** Active Guidelines

**Pre-Implementation Documents:**

18. **11_Pre_Implementation_Gap_Analysis.md**
    - **Purpose:** Identifies gaps in planning before implementation begins
    - **Contains:** Pending decisions, missing information, questions to answer
    - **Audience:** Project managers, developers
    - **Status:** Active Analysis

19. **12_Pre_Implementation_Plan_Conversation.md**
    - **Purpose:** Records pre-implementation planning conversations, decisions, and clarifications
    - **Contains:** Decision tracking, research findings, confirmed selections, rationale
    - **Audience:** All developers, project managers
    - **Status:** Active Conversation - Documents final decisions before implementation

20. **13_Feature_Implementation_Conversation.md**
    - **Purpose:** Records feature implementation planning conversations, decisions, and clarifications
    - **Contains:** Feature categorization, implementation order, development workflow integration
    - **Audience:** All developers
    - **Status:** Active Conversation

**Additional Guidance Documents (To Be Created As Needed):**

21. **00_Architecture_Decisions.md** (Future)
    - **Purpose:** Document significant architecture decisions and rationale
    - **When to Create:** When major architecture decisions are made

22. **00_Coding_Standards.md** (Future)
    - **Purpose:** Detailed coding style and standards
    - **When to Create:** When specific style guidelines are needed

23. **00_Testing_Guidelines.md** (Future)
    - **Purpose:** Testing requirements, patterns, and best practices
    - **When to Create:** When testing standards are established

24. **00_Git_Workflow.md** (Future)
    - **Purpose:** Version control workflow and conventions
    - **When to Create:** When team workflow is established

25. **00_Deployment_Process.md** (Future)
    - **Purpose:** Deployment procedures and requirements
    - **When to Create:** When deployment process is defined

---

### 4.2 Document Relationships

**Document Hierarchy:**
```
00_AI_ReadME_Project_Guidance_And_Rules.md (This Document)
├── Points to all 00_* guidance documents
├── References 01_* research documents
├── References 02_* best practices
└── References 03_* planning documents

00_Codebase_Comments_Guidelines.md
├── Referenced by: 00_AI_ReadME, 03_Project_Planning
└── Used by: All code files

00_Project_Desires.md
├── Referenced by: 00_AI_ReadME, 01_Research_Agenda
└── Links to: 01_Research_* documents

03_Project_Planning.md
├── References: 00_Codebase_Comments_Guidelines, 00_AI_ReadME
├── Defines: Tech stack, architecture, file structure
└── Used by: All developers
```

---

### 4.3 Development Journey Documentation System

**Purpose:** Track debugging experiences, issue resolution, and lessons learned throughout development.

**Main Directory:** `00_Development_Journey.md`
- Serves as index/directory of all development journey documents
- Lists active (unresolved) and resolved journey documents
- Provides guidelines for creating and managing journey documents

**Individual Journey Documents:** `00_Dev_Journey_[IssueName].md`
- Document specific debugging issues and resolutions
- Located in top-level directory when active
- Moved to `00_Development_Journey_Lessons_Learned/` when resolved

**When to Create a Journey Document:**
- Significant issue requiring investigation
- Issue is not immediately obvious
- Debugging process reveals interesting patterns or mistakes
- Resolution would benefit future development
- Similar issues have occurred (create separate document for each)

**Document Status Requirements:**
Each journey document must clearly indicate status in the header:
- 🔴 **Unresolved and Active** - Issue is still being worked on
- 🟡 **Resolved - Pending Archive** - Issue is fixed but not yet moved
- 🟢 **Resolved - Archived to Lessons Learned** - Issue is resolved and archived

**Moving to Lessons Learned:**
Documents are moved to `00_Development_Journey_Lessons_Learned/` folder ONLY when:
- Issue is **totally fixed** (not just workaround)
- All related code is updated
- Tests pass and verify the fix
- No remaining related issues
- Solution is documented and understood

**Important Rule:** Similar issues should be documented as **new journey documents**, not added to existing resolved documents. Each issue gets its own document for clarity and searchability.

**Document Structure:**
Each journey document should include:
- Issue description
- Initial investigation
- Debugging approaches used
- Mistakes and inefficiencies encountered
- Root cause discovery process
- Actual root cause
- Solution applied
- Lessons learned

**Reference:** See `00_Development_Journey.md` for complete guidelines and `00_Development_Journey_Lessons_Learned/00_AI_ReadME_Development_Journey_Folder.txt` for archive folder rules.

---

### 4.4 Archive Folders

The project maintains archive folders to organize historical documents that are no longer actively used but are kept for reference.

**Archive Folder Structure:**

Each archive folder contains a `00_AI_ReadME_[FolderName].txt` file with specific guidance for that folder. See individual README files for detailed rules.

1. **00_Archived_Project_Setup/**
   - **Purpose:** Store documents created during initial project conceptualization and planning phase (pre-crystallized decision aid docs)
   - **When to Archive:**
     - Project has moved from planning/conceptualization to active development
     - Documents are "pre-crystallized" - they helped make decisions but those decisions are now finalized
     - Documents are no longer actively referenced during development
     - Research/planning phase is complete and implementation has begun
   - **What Goes Here:**
     - All "01_*" documents (eventually, as they become less relevant to active development)
     - Other pre-crystallized decision aid documents from initial planning phase
     - Research documents that informed initial decisions but are no longer actively referenced
     - Planning documents from the conceptualization phase
   - **Exclusions:** "00_*" documents are NOT included (they are permanent, maintained documents)
   - **Naming:** Keep original filename (documents maintain their original "01_*" prefix)
   - **Reference:** See `00_AI_ReadMe_Project_Setup.txt` in folder for detailed guidance

2. **00_Archived_Research/**
   - **Purpose:** Store research documents that are no longer actively referenced
   - **When to Archive:**
     - Research has been incorporated into implementation plans
     - Research findings are documented in active planning documents
     - Research is superseded by newer findings
     - Feature research is complete and implementation has begun
   - **What Goes Here:**
     - Completed research documents (01_Research_*.md) after implementation begins
     - Superseded research findings
     - Historical research that informed decisions but is no longer actively used
     - Research documents for features that were deprioritized or cancelled
   - **Naming:** Keep original filename, add date prefix if needed: YYYY-MM-DD_OriginalName.md
   - **Reference:** See `00_AI_ReadME_Archived_Research_Folder.txt` in folder for detailed guidance

3. **01_Archived_Implementation_Plans/**
   - **Purpose:** Store implementation plans that have been completed or superseded
   - **When to Archive:**
     - Implementation plan has been fully executed
     - Plan has been superseded by a new plan
     - Feature implementation is complete
     - Plan is no longer relevant to current development
   - **What Goes Here:**
     - Completed implementation plans
     - Superseded planning documents
     - Historical architecture decisions that have been implemented
     - Plans for features that were deprioritized or cancelled
   - **Naming:** Keep original filename, add date prefix and status if needed: YYYY-MM-DD_COMPLETED_OriginalName.md
   - **Reference:** See `00_AI_ReadME_Archived_Implementation_Plans_Folder.txt` in folder for detailed guidance

4. **02_Archived_Test_Scripts/**
   - **Purpose:** Store test scripts and test files that are no longer actively maintained
   - **When to Archive:**
     - Test scripts have been replaced by newer versions
     - Tests are for features that have been removed or significantly changed
     - Test scripts are obsolete but contain useful patterns or examples
     - Tests are for deprecated functionality
   - **What Goes Here:**
     - Obsolete test files (.test.ts, .spec.ts)
     - Superseded test scripts
     - Test files for removed features
     - Historical test examples that are no longer run
   - **Naming:** Keep original filename, add date prefix and reason if needed: YYYY-MM-DD_OBSOLETE_OriginalName.test.ts
   - **Reference:** See `00_AI_ReadME_Archived_Test_Scripts_Folder.txt` in folder for detailed guidance

5. **03_Archived_Changelogs_And_Debugging_Reports/**
   - **Purpose:** Store completed changelogs and resolved debugging reports
   - **When to Archive:**
     - Changelog entries for released versions
     - Debugging reports for resolved issues
     - Issue analysis documents for closed issues
     - Historical debugging sessions that are no longer relevant
   - **What Goes Here:**
     - Changelog entries for past releases
     - Completed debugging reports
     - Resolved issue documentation
     - Historical bug analysis
     - Closed issue reports
   - **Naming:** Use descriptive names:
     - Changelogs: CHANGELOG_v1.0.0.md
     - Debugging: DEBUG_YYYY-MM-DD_IssueName.md
     - Issues: ISSUE_#123_Description.md
   - **Reference:** See `00_AI_ReadME_Archived_Changelogs_Folder.txt` in folder for detailed guidance
   - **Note:** Development journey documents go in `00_Development_Journey_Lessons_Learned/`, not here

**Archive Management Guidelines:**

- **Review Before Archiving:** Ensure documents are truly no longer needed for active development
- **Maintain References:** Update references in active documents when archiving related materials
- **Preserve History:** Keep archived documents for historical reference and learning
- **Regular Cleanup:** Periodically review archive folders to ensure organization
- **Document Decisions:** Note why documents were archived in commit messages or documentation

**Archive Workflow:**

1. Identify document to archive
2. Verify it's no longer needed for active development
3. Move to appropriate archive folder
4. Update any references in active documents
5. Commit with descriptive message about archival

---

### 4.5 GUI-First Development Workflow (CRITICAL)

⚠️ **IMPORTANT:** This workflow is a core development principle and must be followed for all feature development.

**Workflow Steps:**
1. **Dial in Customized GUI** - Establish base GUI framework, content type system, theme
2. **Add Pages/Tabs/Windows/Menus** - Add new UI containers
3. **Customize GUI of Additions** - Apply content types, customize layout
4. **Add Features/Functionality** - Implement business logic
5. **Customize GUI for Features** - Refine UI for new features

**Integration with Feature Development:**
- Each feature follows the GUI-first workflow
- Features are added with their GUI, then refined
- Content types enable rapid GUI iteration
- GUI customization is prioritized alongside functionality

**Rationale:**
- Enables rapid visual iteration and feedback
- Supports user-driven development approach
- Ensures GUI is considered from the start
- Allows testing of look/functionality/utility before full integration

**Reference Documents:**
- `00_Dev_Niceities.md` - Content type system and GUI development patterns
- `12_Pre_Implementation_Plan_Conversation.md` - Decision tracking and workflow details
- `03_Project_Planning.md` Section 0 - Development priorities

---

## 5. Quick Reference

### 5.1 Common Tasks

**Creating a New File:**
1. Add file header comment (see 03_Project_Planning.md Section 3.1)
2. List related files
3. Document code hierarchy
4. Explain logic flow
5. Add maintenance note
6. Follow naming conventions

**Adding Numbered Comments:**
1. Check Comment Registry for next number
2. Use format: `Comment XXX: [Title]`
3. Explain what and why
4. List related comments
5. Update Comment Registry

**Updating File Header:**
1. Review current header
2. Update if purpose/flow changed
3. Update related files list
4. Update code hierarchy
5. Update logic flow description

**Linking Related Code:**
1. Use same comment number
2. Document relationship in comment
3. Update Comment Registry
4. Ensure bi-directional links

---

### 5.2 Key Conventions

**File Naming:**
- Components: `PascalCase.tsx`
- Services: `kebab-case.ts`
- Utilities: `kebab-case.ts`
- Types: `kebab-case.types.ts`

**Comment Format:**
- `Comment XXX: [Title]`
- Three-digit numbers
- Shared numbers for related code

**Import Order:**
1. External libraries
2. Internal services
3. Internal components
4. Internal utilities
5. Types
6. Styles

**Code Organization:**
- One component per file
- Group related code
- Clear separation of concerns
- Modular design

---

### 5.3 Important Reminders

**Always:**
- ✅ Add file header to new files
- ✅ Use numbered comments for complex logic
- ✅ Document relationships between code
- ✅ Update documentation when code changes
- ✅ Follow naming conventions
- ✅ Write self-documenting code

**Never:**
- ❌ Skip file headers
- ❌ Use outdated comment numbers
- ❌ Forget to update Comment Registry
- ❌ Leave outdated documentation
- ❌ Break naming conventions
- ❌ Write code without comments for complex logic

---

## 6. Technology Stack

### 6.1 Primary Stack

**Framework:** Tauri (recommended) or Electron (fallback)
**Frontend:** React + TypeScript
**Editor:** Tiptap
**Storage:** SQLite (metadata) + File System (content)
**State:** Zustand or Jotai
**Search:** lunr.js or flexsearch
**Testing:** Vitest + React Testing Library

**Full Details:** See `03_Project_Planning.md` Section 1

---

### 6.2 Architecture

**Pattern:** Component-based, Layered, Service-oriented
**Structure:** See `03_Project_Planning.md` Section 2
**Principles:** Separation of concerns, Single responsibility, Dependency injection

---

## 7. Development Phases

### 7.1 Phase 1: Foundation
- Project setup
- Basic structure
- Core components
- Basic features

### 7.2 Phase 2: Core Features
- Rich text editor
- Metadata system
- Tag management
- Basic search

### 7.3 Phase 3: Advanced Features
- Branch system
- Historical timelines
- Task lists
- Calendar integration

**Full Roadmap:** See `03_Project_Planning.md` Section 8

---

## 8. Getting Started

### 8.1 For New Developers

**Read These First:**
1. This document (00_AI_ReadME_Project_Guidance_And_Rules.md)
2. `03_Project_Planning.md` - Project structure and standards
3. `00_Codebase_Comments_Guidelines.md` - Comment conventions
4. `02_Dev_Best_Practices_Research.md` - Development practices

**Then:**
- Review `00_Project_Desires.md` for feature overview
- Review relevant `01_Research_*.md` documents for features you'll work on
- Set up development environment
- Review existing code structure

---

### 8.2 For AI Assistants

**Key Guidelines:**
- Always add file headers to new files
- Use numbered comments for complex logic
- Follow comment numbering conventions
- Update documentation when making changes
- Reference this document for standards
- Check related guidance documents

**When Creating Code:**
1. Add comprehensive file header
2. Use TypeScript types
3. Add numbered comments for complex logic
4. Document relationships
5. Follow naming conventions
6. Write self-documenting code

**When Modifying Code:**
1. Review file header
2. Update if needed
3. Add/update numbered comments
4. Update Comment Registry
5. Maintain relationships

---

## 9. Maintenance

### 9.1 Document Maintenance

**This Document:**
- Update when new guidance documents are created
- Update when rules change
- Keep links current
- Review quarterly

**Other Guidance Documents:**
- Update when standards evolve
- Keep examples current
- Maintain accuracy
- Review regularly

---

### 9.2 Code Documentation Maintenance

**File Headers:**
- Update when purpose/flow changes
- Keep related files list current
- Maintain accuracy
- Review during code review

**Numbered Comments:**
- Update when code changes
- Maintain relationships
- Keep registry current
- Verify accuracy

---

## 10. References and Links

### 10.1 Project Documents

**Guidance Documents:**
- `00_Codebase_Comments_Guidelines.md` - Comment standards
- `00_Project_Desires.md` - Project goals and features
- `00_Dev_Niceities.md` - Development approaches and patterns
- `00_Development_Journey.md` - Development journey directory

**Planning Documents:**
- `03_Project_Planning.md` - Technical planning
- `02_Dev_Best_Practices_Research.md` - Development practices
- `04_Proposed_Selections_From_Project_Planning.md` - Technology decisions
- `05_Projected_Issues_And_Research.md` - Projected issues and solutions

**Architecture Documents:**
- `06_Project_Architecture.md` - Architecture documentation
- `07_Logic_Flow_Guidelines.md` - Logic flow guidelines

**Development Documents:**
- `08_Development_Practices_And_Testing.md` - Development practices and testing
- `09_Development_Tips_And_Tricks.md` - Development tips and tricks
- `10_AI_Reliable_Development_And_Debugging.md` - AI development and debugging guide

**Pre-Implementation Documents:**
- `11_Pre_Implementation_Gap_Analysis.md` - Gap analysis
- `12_Pre_Implementation_Plan_Conversation.md` - Pre-implementation decisions
- `13_Feature_Implementation_Conversation.md` - Feature implementation planning

**Research Documents:**
- `01_Project_Research_Agenda.md` - Research tasks
- `01_Research_*.md` - Feature research findings

---

### 10.2 External Resources

**Technology:**
- Tauri: https://tauri.app/
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/
- Tiptap: https://tiptap.dev/

**Standards:**
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- Git: https://git-scm.com/

---

## 11. Contact and Support

### 11.1 Questions

**For Development Questions:**
- Review relevant guidance documents
- Check code examples
- Review similar implementations
- Consult team

**For Standards Questions:**
- Review this document
- Check specific guidance documents
- Review examples in codebase
- Consult team lead

---

## 12. Document History

### 12.1 Version History

**Version 1.0 (2024):**
- Initial creation
- Core guidance established
- Links to all guidance documents
- Development rules defined
- Archive folder system established
- Development Journey system established
- GUI-First Development Workflow documented

---

**Document Status:** Active Guidance  
**Last Updated:** 2024  
**Next Review:** Quarterly or when major changes occur

