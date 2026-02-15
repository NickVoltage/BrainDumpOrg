# Feature Implementation Conversation

> **Note:** This document captures the conversation and decisions made regarding feature implementation order and development approach. It serves as a record of how the implementation strategy was developed.

**Document Purpose:** Record feature implementation planning conversations, decisions, and clarifications.

**Related Documents:**
- `12_Pre_Implementation_Plan_Conversation.md` - Pre-implementation planning decisions
- `00_Dev_Niceities.md` - Development approaches and nice-to-haves
- `00_Codebase_Comments_Guidelines.md` - Comment numbering and bi-directional relationships
- `00_AI_ReadME_Project_Guidance_And_Rules.md` - Project guidance and rules

**Last Updated:** 2024  
**Status:** Active Conversation

---

## User Prompt Inspiring This Doc

```
The order of feature implementation should compliment the future goals in such a way that each subsequent feature is planned for and ready to implement.

This means that when we're creating the code structure/ files/ directory/ etc. 

- we can add placeholder comments for all the features (these comments should clarify how it's intended to interact with the rest of the code (full sibling / parent path and logic flow, dependencies and specific files that relate to that feature, etc.)

 - then, as we build in features, the conceptual implementation has already been figured out, the only remaining thing would essentially be adding the actual code that builds the feature and updating the comment to explain the same information as it did before, but to now reflect the current state of the feature's implementation, and how it's designed to work.

- Vital: it's extremely important that all comments are given a unique ["Comment" + number] designation.  We should also maintain a directory of all comments that are added to the codebase throughout development.  Each comment that's added to the codebase should have a number one digit higher than the highest existing comment.  I believe I already explained bi-directional comments, but it's worth clarifying again. (add this to the 00 AI ReadMe doc if it hasn't already been added) (important clarification... the comment directory will store the comment text, importantly including their unique number, and full file path (for easily locating the comment))

 * Important note: this has largely (so far) been information that's approapriate to add to the "00_Dev_Niceities.md" file (as it clearly outlines a preferred and structured way to build up the codebase and intended features of the application.


- as for specific order for feature implementation, it should follow common sense.  Essentials > leading to placeholder files > containing placeholder comments (again, placeholder comments function as a lean way to "bread crumb" how the code logic/ relationships/ execution/ dependencies will be structured) > GUI (with placeholders for future features) (+ plus customizations/ adjustments throughout development (the ongoing nature of GUI tweaks is why I've specifically outlined some Dev Niceities regarding it)) > core features (document creation (aka "notes"), ACCURATE calendar, to do list (Do/Due Tab) (desired feature addition: To Do lists will be a specific tab, but there will also be the seperate ability to create checkbox lists within the document creator (Doc Tab)), Alarm/ Timer tab, (and other desired features) etc. > once the "core" standalone tabs (which can be thought of as stand-alone mini apps) are created, the features that build upon them will be added.

An Example of this process might be...

GUI is created > main dashboard is default display > sections within the dashboard are sized and moved around with titles indicating what that area of the GUI is intended for > core features for that part of the application might be a way to open docs that are located on the computer > the document editor ("Docs" tab GUI is then worked on) > the document editor is created and launched/ navigated to via the placeholder GUI being replaced with the real thing > doc editor is tested to ensure accurate & error free rendering of existing files > ability to display images might not be present so it's added > the image might be shown in an area that doesn't match it's microsoft word/ google doc representation so that display issue is then fixed > ability to change font type might not work/ exist so that's added > ability to bold/ underline/ bullet-point/ checkbox list, auto-incrementing numbered lists/ etc. gets built-out > ability to import images and place them in custom locations is added > audio transcribe might be desired and planned for while adding a place holder > user wants to start using the Do/Due to do list app so they navigate there and build it out > etc. etc. etc.
```

---

## Decision Tracking

### 1. Comment Directory Location

**Status:** ✅ **CONFIRMED**

**Decision:** Comment directory will be its own `00_` document in the top level directory.

**Rationale:**
- Follows established guidelines for `00_` documents
- Allows for verbose information density
- Easy to locate and maintain
- Consistent with other permanent guidance documents

**Implementation:**
- File: `00_Comment_Directory.md` (top level directory)
- Contains: Comment text, unique number, full file path, related comment numbers

---

### 2. Feature Implementation Strategy

**Status:** ✅ **CLARIFIED**

**Core Principle:**
Feature implementation order should complement future goals so each subsequent feature is planned for and ready to implement.

**Key Strategy Elements:**

1. **Placeholder Comments for All Features:**
   - Add placeholder comments during initial code structure setup
   - Comments clarify intended interactions with rest of code
   - Include: full sibling/parent path, logic flow, dependencies, specific related files
   - As features are built, update comments to reflect actual implementation

2. **Comment Numbering System:**
   - All comments must have unique "Comment" + number designation
   - Maintain directory of all comments throughout development
   - Each new comment: number = highest existing comment + 1
   - Comment directory stores: comment text, unique number, full file path
   - Bi-directional comments: shared numbers for related code across files

3. **Development Approach:**
   - This strategy is a "Development Nicety" (belongs in `00_Dev_Niceities.md`)
   - Enables structured, planned codebase growth
   - Reduces refactoring by planning ahead

**Documentation Requirements:**
- Add comment directory guidance to `00_AI_ReadME_Project_Guidance_And_Rules.md` (if not already present)
- Add placeholder comment strategy to `00_Dev_Niceities.md`
- Update `00_Codebase_Comments_Guidelines.md` with comment directory requirements

---

### 3. Feature Implementation Order

**Status:** ✅ **CLARIFIED**

**Implementation Sequence (Common Sense Approach):**

1. **Essentials:**
   - Project setup
   - Basic code structure
   - File/directory organization

2. **Placeholder Files & Comments:**
   - Create placeholder files for all planned features
   - Add placeholder comments explaining:
     - How feature will interact with codebase
     - Full sibling/parent paths
     - Logic flow
     - Dependencies
     - Related files
   - Comments serve as "breadcrumbs" for future implementation

3. **GUI (with Placeholders for Future Features):**
   - Create GUI framework
   - Main dashboard as default display
   - Sections sized and positioned with titles indicating intended purpose
   - Placeholder areas for future features
   - Ongoing GUI customizations/adjustments throughout development

4. **Core Features (Standalone Tabs/Mini-Apps):**
   - **Main Dashboard** (default "home" page - app opens to this)
   - Document creation ("Notes" / "Docs" tab)
   - ACCURATE calendar
   - To-do list ("Do/Due" tab)
   - Alarm/Timer tab
   - Other core desired features

5. **Features That Build Upon Core:**
   - Once core standalone tabs are created
   - Add features that extend/enhance core functionality
   - Build upon established foundation

**Important Feature Clarifications:**

**To-Do Lists:**
- **Separate Tab:** "Do/Due" tab - dedicated to-do list application
- **Within Documents:** Checkbox lists can be created within document creator ("Doc" tab)
- Two distinct implementations of to-do functionality

**Core Tabs as Standalone Mini-Apps:**
- Each core tab (Dashboard, Docs, Calendar, Do/Due, Alarm/Timer) functions as standalone mini-application
- Can be developed and tested independently
- Integration happens after core functionality is established

---

### 4. All 12 Project Desires - Categorization

**Status:** ✅ **CLARIFIED**

**CORE FEATURES (Standalone Tabs - Confirmed):**
- ✅ Main Dashboard (default home page)
- ✅ Document creation (Notes/Docs tab)
- ✅ Calendar
- ✅ To-do list (Do/Due tab)
- ✅ Alarm/Timer tab

**ALL 12 PROJECT DESIRES - FINAL CATEGORIZATION:**

1. **Full-Featured Text Editor**
   - ✅ **CORE** - Standalone Tab (Document Editor)

2. **Local File Saving**
   - ✅ **CORE** - Standalone Tab

3. **Reminders Attached to Note Files**
   - ✅ **CORE** - Standalone Tab
   - **Clarification:** Reminders are attached to note files AND the calendar. They have enough utility and versatility to warrant custom code and logic. The same tab responsible for alarms and timers can house the "main" display for this app, though it will appear in the calendar tab in some way and the doc editor in some way (respectively).

4. **Save, Open, and Edit Popular File Types**
   - ✅ **Builds Upon:** Several features in concept (doc editor tab, calendar tab, reminders, etc.)
   - **Note:** Saving data is a pretty standard thing to include in apps, it's a basic consideration to make for any feature that requires saving data. This is more of a reminder to include logic that was planned for and gracefully and reliably handles data management, rather than being intended as a stand-alone app.

5. **Custom Metadata Association**
   - ✅ **CORE** - Standalone Feature
   - **Clarification:** This builds upon the doc editor mainly, but has utility in adding custom logic specifically designed and purposed for features that may utilize metadata (e.g., adding metadata to notes, calendar events/routines/tasks, reminders). It's a core feature/idea to the user experience, and may require bespoke integration per feature. It should be built in a way that can be easily applied to other aspects of the app. It deserves a unified way of searching across all metadata sources - like a singular place all metadata is captured so that a large-scale search can be conducted across all fields/apps/whatever for keywords/dates/topics/tags. This would be built as an accessible feature that's designed according to the environment it's found within (e.g., for one tab it might be a menu option in a right-click menu, in another it might be an "advanced search" bar, in another it might be a standalone tab).

6. **To-Do Lists Within Notes**
   - ✅ **CORE** - Standalone Tab ("Do-Due List")
   - **Note:** Separate from checkbox lists within documents - this is a dedicated standalone tab

7. **Branched Notes**
   - ✅ **Builds Upon:** Notes (Doc Editor)

8. **Non-Destructive Historical Timelines**
   - ✅ **Builds Upon:** Notes (Doc Editor)

9. **Modern GUI and Features**
   - ✅ **Design Principle** - Not a standalone tab or app
   - **Note:** A "modern GUI" is not a standalone tab or app - it's a design principle

10. **Hierarchical Notes**
    - ✅ **Builds Upon:** Dashboard
    - **Clarification:** Builds upon the dashboard as a way to organize the notes/docs stored/displayed there

11. **Timer**
    - ✅ **Part of:** Alarm/Timer tab (already confirmed as core)

12. **Alarm**
    - ✅ **Part of:** Alarm/Timer tab (already confirmed as core)

---

### 5. Structured Feature Implementation Order

**Status:** ✅ **READY FOR DOCUMENTATION**

**Core Standalone Tabs (Phase 1):**
1. Main Dashboard (default home page)
2. Full-Featured Text Editor (Document Editor tab)
3. Local File Saving
4. Reminders (Alarm/Timer tab - main display)
5. Calendar
6. To-Do List (Do/Due tab)
7. Custom Metadata Association (centralized metadata manager)

**Build-Upon Features (Phase 2+):**
- Save, Open, and Edit Popular File Types (builds upon doc editor, calendar, reminders)
- Branched Notes (builds upon doc editor)
- Non-Destructive Historical Timelines (builds upon doc editor)
- Hierarchical Notes (builds upon dashboard)
- To-Do Lists Within Notes (checkbox lists within documents - builds upon doc editor)

**Design Principles (Ongoing):**
- Modern GUI and Features (applied throughout all development)

---

## Implementation Requirements

### 1. Comment Directory System

**Status:** ✅ **CONFIRMED**

**Requirements:**
- Maintain directory of all comments in codebase
- Each entry includes:
  - Comment text (full content)
  - Unique number (Comment 001, Comment 002, etc.)
  - Full file path (for easy location)
  - Related comment numbers (for bi-directional relationships)

**Implementation:**
- File: `00_Comment_Directory.md` (top level directory)
- Update directory when adding new comments
- Ensure numbering follows sequential pattern (highest + 1)
- Link related comments via shared numbers

**Documentation:**
- ✅ Added to `00_Codebase_Comments_Guidelines.md`
- ✅ Added to `00_AI_ReadME_Project_Guidance_And_Rules.md`
- Reference in `00_Dev_Niceities.md`

---

### 2. Placeholder Comment Strategy

**Status:** ⏳ **NEEDS DOCUMENTATION**

**Requirements:**
- Add placeholder comments during initial code structure setup
- Comments explain intended feature implementation
- Include: interactions, paths, logic flow, dependencies, related files
- Update comments as features are implemented

**Documentation:**
- Add to `00_Dev_Niceities.md`
- Create template/example for placeholder comments
- Define standard format for placeholder comment structure

---

### 3. Feature Implementation Order Documentation

**Status:** ✅ **READY FOR DOCUMENTATION**

**Requirements:**
- Document final feature implementation order (see Section 5 above)
- Map all 12 project desires to implementation phases
- Define dependencies between features
- Create implementation roadmap

**Next Steps:**
- Document in appropriate planning document
- Create implementation checklist
- Integrate with GUI-first development workflow

---

## Next Steps

1. **Documentation Updates:**
   - [x] Add comment directory guidance to `00_AI_ReadME_Project_Guidance_And_Rules.md`
   - [ ] Add placeholder comment strategy to `00_Dev_Niceities.md`
   - [ ] Update `00_Codebase_Comments_Guidelines.md` with comment directory requirements
   - [ ] Create comment directory file/structure

2. **Implementation Planning:**
   - [x] Finalize feature categorization
   - [ ] Create detailed feature implementation order document
   - [ ] Map project desires to implementation phases
   - [ ] Create implementation roadmap
   - [ ] Define milestones and checkpoints
   - [ ] Integrate with GUI-first development workflow

3. **Feature Dependencies:**
   - [x] Document which features are core vs build-upon
   - [ ] Create dependency graph
   - [ ] Document integration points

---

**Document Status:** Active Conversation  
**Last Updated:** 2024  
**Next Action:** Update documentation with finalized feature categorization, create implementation roadmap

