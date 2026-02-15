================================================================================
AI README: Development Journey Lessons Learned Folder
================================================================================

PURPOSE:
--------
This folder stores development journey documents for issues that are COMPLETELY
RESOLVED. These documents serve as lessons learned and reference material for
future development.

WHEN TO MOVE DOCUMENTS HERE:
----------------------------
Documents should ONLY be moved to this folder when:

1. The issue is TOTALLY FIXED (not just a workaround)
2. All related code has been updated
3. Tests pass and verify the fix
4. No remaining related issues exist
5. The solution is fully documented and understood

IMPORTANT RULES:
----------------

1. SIMILAR ISSUES = NEW DOCUMENTS
   - If a similar issue occurs, create a NEW development journey document
   - Do NOT add to existing resolved documents in this folder
   - Each issue gets its own document for clarity and searchability
   - Example: If "GUI Layout Issue #1" is resolved and archived here, and
     "GUI Layout Issue #2" occurs, create "00_Dev_Journey_GUI_Layout_2.md"
     as a new document, not an addition to the first one

2. STATUS TRACKING
   - Each document must clearly indicate its status in the header
   - Status should be "Resolved - Archived to Lessons Learned"
   - Include resolution date

3. DOCUMENT COMPLETENESS
   - Before moving here, ensure document includes:
     - Issue description
     - Debugging approaches used
     - Mistakes/inefficiencies encountered
     - Actual root cause
     - How root cause was discovered
     - Solution applied
     - Lessons learned

4. DIRECTORY UPDATES
   - When moving a document here, update:
     - 00_Development_Journey.md (main directory)
     - Move entry from "Active" to "Resolved" section
     - Add brief description of what the document covers

FOLDER STRUCTURE:
-----------------
Documents in this folder maintain their original naming:
- 00_Dev_Journey_[IssueName].md

No sub-folders or additional organization needed. Documents are listed in
the main 00_Development_Journey.md directory.

REFERENCE:
----------
See 00_Development_Journey.md for:
- Complete list of active and resolved journey documents
- Document creation guidelines
- Status tracking information
- Archive workflow

================================================================================
Last Updated: 2024
================================================================================
