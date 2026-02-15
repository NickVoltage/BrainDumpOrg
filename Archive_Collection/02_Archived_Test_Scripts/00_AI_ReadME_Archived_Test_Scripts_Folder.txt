================================================================================
AI README: Archived Test Scripts Folder
================================================================================

PURPOSE:
--------
This folder stores test scripts and test files that are no longer actively
maintained but are kept for reference, patterns, or examples.

WHEN TO ARCHIVE DOCUMENTS HERE:
--------------------------------
Move test scripts to this folder when:

1. Test scripts have been replaced by newer versions
2. Tests are for features that have been removed or significantly changed
3. Test scripts are obsolete but contain useful patterns or examples
4. Tests are for deprecated functionality
5. Test files are no longer run as part of the test suite

WHAT GOES HERE:
---------------
- Obsolete test files (.test.ts, .spec.ts)
- Superseded test scripts
- Test files for removed features
- Historical test examples that are no longer run
- Test configurations that are no longer used

NAMING CONVENTION:
------------------
- Keep original filename
- Add date prefix if needed: YYYY-MM-DD_OriginalName.test.ts
- Consider adding reason prefix: OBSOLETE_, SUPERSEDED_, REMOVED_FEATURE_
- Example: 2024-02-12_OBSOLETE_note-service.test.ts

ARCHIVE WORKFLOW:
-----------------
1. Verify test is no longer needed for active development
2. Ensure replacement tests exist if functionality still exists
3. Move test file to this folder
4. Update test suite configuration if needed
5. Commit with descriptive message

IMPORTANT:
----------
- Do NOT archive tests for active features
- Ensure functionality is still tested if feature exists
- Keep archived tests for reference and pattern examples

REFERENCE:
----------
See 00_AI_ReadME_Project_Guidance_And_Rules.md Section 4.4 for general
archive folder guidelines.

================================================================================
Last Updated: 2024
================================================================================
