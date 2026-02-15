# Development Journey Directory

> **Note:** This document serves as a directory/index of all development journey documentation, tracking both active issues and resolved lessons learned.

**Document Purpose:** Central index for all development journey documentation, tracking issue resolution progress and lessons learned.

**Last Updated:** 2024  
**Status:** Active Directory

---

## 1. Purpose of Development Journey Documentation

Development journey documents capture the complete story of debugging issues, including:
- **Reported Issues:** What problem was encountered
- **Debugging Approaches:** Methods used to investigate
- **Mistakes/Inefficiencies:** What went wrong in the debugging process
- **Root Cause:** What actually caused the issue
- **Discovery Process:** How the root cause was found
- **Solution:** How the issue was fixed
- **Lessons Learned:** What to do differently next time

**Why Document This:**
- Learn from debugging experiences
- Avoid repeating mistakes
- Share knowledge with team
- Build debugging expertise
- Create reference for similar issues

---

## 2. Active Development Journey Documents

**Location:** Top-level project directory (alongside this file)

**Status:** These documents track issues that are **unresolved and active** or **recently resolved** (not yet moved to Lessons Learned folder).

### Active Documents:

*No active journey documents yet. New documents will be listed here as issues are documented.*

**Format:** `00_Dev_Journey_[IssueName].md`

**Example:**
- `00_Dev_Journey_GUI_Layout.md` - Issue with GUI layout rendering
- `00_Dev_Journey_Note_Save_Failure.md` - Issue with note saving functionality
- `00_Dev_Journey_Timer_Integration.md` - Issue with timer feature integration

---

## 3. Resolved Development Journey Documents

**Location:** `00_Development_Journey_Lessons_Learned/` folder

**Status:** These documents track issues that are **completely resolved** and have been moved to the Lessons Learned folder for reference.

### Resolved Documents:

*No resolved journey documents yet. Documents will be moved here after issues are totally fixed.*

**Note:** Similar issues should be documented as new journey documents, not added to existing resolved documents. Each issue gets its own document.

---

## 4. Document Naming Convention

**Active Documents:**
- Format: `00_Dev_Journey_[IssueName].md`
- Examples:
  - `00_Dev_Journey_GUI_Layout.md`
  - `00_Dev_Journey_Note_Save_Failure.md`
  - `00_Dev_Journey_Timer_Integration.md`

**Resolved Documents:**
- Same naming convention
- Moved to `00_Development_Journey_Lessons_Learned/` folder
- Status updated to "Resolved" in document

---

## 5. When to Create a New Development Journey Document

**Create a new document when:**
- A significant issue is encountered that requires debugging
- The issue is not immediately obvious or requires investigation
- The debugging process reveals interesting patterns or mistakes
- The issue resolution would benefit future development
- Similar issues have occurred before (document each separately)

**Do NOT create a document for:**
- Trivial issues resolved immediately
- Simple typos or syntax errors
- Issues with obvious solutions
- Issues already documented in similar journey docs (create new doc instead)

---

## 6. Document Status Tracking

Each development journey document must clearly indicate its status in the document header:

**Active/Unresolved:**
```markdown
**Status:** 🔴 Unresolved and Active
```

**Resolved (Not Yet Moved):**
```markdown
**Status:** 🟡 Resolved - Pending Archive
```

**Resolved (Archived):**
```markdown
**Status:** 🟢 Resolved - Archived to Lessons Learned
```

---

## 7. Moving Documents to Lessons Learned

**When to Move:**
- Issue is **totally fixed** (not just workaround)
- All related code is updated
- Tests pass and verify the fix
- No remaining related issues
- Solution is documented and understood

**Process:**
1. Update document status to "Resolved - Archived"
2. Add final summary/lessons learned section
3. Move document to `00_Development_Journey_Lessons_Learned/` folder
4. Update this directory to move entry from "Active" to "Resolved"
5. Commit with message indicating resolution

**Important:** Similar issues should be documented as **new journey documents**, not added to existing resolved documents. Each issue gets its own document for clarity and searchability.

---

## 8. Document Structure Template

Each development journey document should follow the structure defined in `00_Dev_Journey_Template.md`.

**Template Location:** `00_Dev_Journey_Template.md`

**Key Sections:**
1. Issue Description
2. Initial Investigation
3. Debugging Approaches
4. Mistakes and Inefficiencies
5. Root Cause Discovery
6. Actual Root Cause
7. Solution
8. Lessons Learned
9. Prevention
10. Related Issues
11. Summary

**Status Indicators:**
- 🔴 Unresolved and Active
- 🟡 Resolved - Pending Archive
- 🟢 Resolved - Archived to Lessons Learned

**Note:** Copy the template file and rename it to `00_Dev_Journey_[IssueName].md` when creating a new journey document.

**Example Structure:**
```markdown
# Development Journey: [Issue Name]

**Status:** [Unresolved/Resolved]
**Date Started:** YYYY-MM-DD
**Date Resolved:** YYYY-MM-DD (if resolved)

## 1. Issue Description
[What problem was encountered]

## 2. Initial Investigation
[First approaches to understand the issue]

## 3. Debugging Approaches
[Methods used to investigate]

## 4. Mistakes and Inefficiencies
[What went wrong in debugging process]

## 5. Root Cause Discovery
[How the actual root cause was found]

## 6. Actual Root Cause
[What actually caused the issue]

## 7. Solution
[How the issue was fixed]

## 8. Lessons Learned
[What to do differently next time]

## 9. Related Documents
[Links to related journey docs, if any]
```

---

## 9. Quick Reference

**Create New Document:**
- Use format: `00_Dev_Journey_[IssueName].md`
- Add to "Active Documents" section above
- Set status to "Unresolved and Active"
- Use `00_Dev_Journey_Template.md` as starting point

**Resolve Issue:**
- Update document status
- Add resolution details
- Move to "Resolved Documents" section (still in top-level)

**Archive Document:**
- Verify issue is totally fixed
- Move to `00_Development_Journey_Lessons_Learned/` folder
- Update this directory
- Remove from active list

**Similar Issue:**
- Create new journey document
- Reference related documents
- Do NOT add to existing resolved document

---

**Document Status:** Active Directory  
**Last Updated:** 2024  
**Maintenance:** Update when new journey documents are created or resolved

