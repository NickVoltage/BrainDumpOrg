# Git Workflow and Version Control

This document outlines the git workflow, branch strategy, and commit conventions for this project.

## Repository Information

- **GitHub Repository**: [BrainDumpOrg](https://github.com/NickVoltage/BrainDumpOrg.git)
- **Repository Name**: BrainDumpOrg (temporary name, app name TBD)
- **Initialized**: Project root directory

## Branch Strategy

### Main Branches

1. **`main`** - Stable, production-ready code
   - Contains tested, working code
   - Only updated via merges from `develop` or `feature/*` branches
   - Should always be in a deployable state

2. **`develop`** - Development integration branch
   - Main working branch for ongoing development
   - Contains work-in-progress features
   - Integration point for feature branches
   - Frequent commits allowed (as-you-go approach)

### Feature Branches

3. **`feature/feature-name`** - Individual feature development
   - Created from `develop` branch
   - Used for developing specific features
   - Examples:
     - `feature/document-editor`
     - `feature/toolbar-tooltips`
     - `feature/calendar-view`
   - Merged back to `develop` when complete

## Workflow

### Daily Development Workflow

1. **Start working** (you're on `develop` branch):
   ```bash
   git checkout develop
   git pull origin develop  # Get latest changes
   ```

2. **Make changes and commit frequently**:
   ```bash
   git add .
   git commit -m "[Component] Description with summary, references, and details"
   ```

3. **Push changes regularly**:
   ```bash
   git push origin develop
   ```

### Feature Development Workflow

1. **Create feature branch from develop**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/feature-name
   ```

2. **Work on feature, commit frequently**:
   ```bash
   # Make changes
   git add .
   git commit -m "[Feature Name] Description..."
   ```

3. **When feature is complete, merge to develop**:
   ```bash
   git checkout develop
   git pull origin develop
   git merge feature/feature-name
   git push origin develop
   ```

4. **Delete feature branch** (optional):
   ```bash
   git branch -d feature/feature-name
   git push origin --delete feature/feature-name
   ```

### Promoting to Main

When `develop` is stable and ready for production:

1. **Merge develop to main**:
   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```

2. **Return to develop**:
   ```bash
   git checkout develop
   ```

## Commit Message Format

All commits must follow the hybrid format with the following structure:

```
[Component/Feature Name] Brief Title

Summary:
- What changed
- Why it changed
- Impact of change

References:
- Comment 1200 (Component name)
- Implementation Plan 02, Step 2.3
- Feature: Menu Bar Navigation

Technical Details:
- Specific implementation notes if needed
- Any important technical considerations
```

### Commit Message Examples

**Example 1: Component Update**
```
[Menu Bar] Add hover navigation between menu items

Summary:
- Menu items now automatically switch when hovering while another menu is open
- Maintains all existing click, click-away, and Escape behaviors
- Improves UX by allowing easy menu navigation without clicking

References:
- Comment 1200 (MenuBar component)
- Implementation Plan 02 (GUI Foundation)

Technical Details:
- Added handleMenuHover function to detect hover on different menu items
- Added onMouseEnter handler to menu buttons
- When menu is open and user hovers different item, automatically switches
```

**Example 2: Feature Implementation**
```
[Toolbar] Implement border detection for tooltip positioning

Summary:
- Tooltips now dynamically position to avoid sidebar and window edges
- Arrow always points to button center regardless of tooltip offset
- Only applies offset when boundaries would be crossed

References:
- Comment 1100 (Toolbar component)
- Implementation Plan 02, Step 2.4

Technical Details:
- Calculate boundaries on window/sidebar resize (debounced 100ms)
- Use ResizeObserver for sidebar size changes
- Calculate minimum offset needed (2px padding from boundaries)
- Arrow position adjusts: calc(50% - offset) when offset right
```

**Example 3: Bug Fix**
```
[Toolbar] Fix tooltip arrow positioning

Summary:
- Fixed tooltip arrow not pointing to button center when tooltip is offset
- Removed excessive spacing between tooltip and vertical menu

References:
- Comment 1100 (Toolbar component)

Technical Details:
- Corrected arrow positioning calculation
- Arrow now uses calc(50% - offset) to maintain center alignment
```

## Commit Frequency

- **Commit after each logical change** on `develop` branch
- This allows easy identification of what broke if issues arise
- Each commit should represent a complete, working change (even if small)
- Don't batch unrelated changes into single commits

## What Gets Tracked

### Tracked:
- All source code (TypeScript, React, Rust/Tauri)
- All documentation files
- Configuration files (package.json, tsconfig.json, etc.)
- Implementation plans and development guides
- Archive collection (project history)
- Messy_Recovery_Documents (recovery history)
- `.vscode/` folder (IDE settings for consistency)

### Ignored (via `.gitignore`):
- `node_modules/` (dependencies)
- `dist/`, `build/`, `target/` (build outputs)
- `.env` files (environment variables)
- OS files (`.DS_Store`, `Thumbs.db`)
- Log files
- Temporary files
- Tauri build artifacts (`src-tauri/target/`)

## Common Git Commands

### Check Status
```bash
git status                    # See what's changed
git log --oneline -10         # See last 10 commits
git branch -a                 # See all branches
```

### Making Changes
```bash
git add .                     # Stage all changes
git add <file>                # Stage specific file
git commit -m "Message"       # Commit with message
git push origin <branch>      # Push to GitHub
```

### Branch Management
```bash
git checkout <branch>         # Switch to branch
git checkout -b <new-branch>  # Create and switch to new branch
git branch                    # List local branches
git branch -d <branch>        # Delete local branch
```

### Syncing with GitHub
```bash
git pull origin <branch>      # Get latest changes
git push origin <branch>      # Send changes to GitHub
git fetch origin              # Fetch updates without merging
```

## Best Practices

1. **Always pull before pushing** to avoid conflicts
2. **Commit frequently** with descriptive messages
3. **Reference breadcrumb comments** in commit messages where applicable
4. **Link to implementation plans** when working on planned features
5. **Include change summaries** - always explain what changed and why
6. **Test before committing** to main branch
7. **Use feature branches** for major features or experimental work
8. **Keep commits focused** - one logical change per commit

## Troubleshooting

### Merge Conflicts
If you encounter merge conflicts:
```bash
# Resolve conflicts in files
git add <resolved-files>
git commit -m "Resolve merge conflicts"
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```bash
git reset --hard HEAD~1
```

### See What Changed
```bash
git diff                     # See unstaged changes
git diff --staged            # See staged changes
git log -p                   # See commit with changes
```

## Initial Setup (Already Complete)

- ✅ Git initialized at project root
- ✅ `.gitignore` created with standard exclusions
- ✅ `main` and `develop` branches created
- ✅ Initial commit with all project files
- ✅ Connected to GitHub repository
- ✅ Both branches pushed to GitHub

## Next Steps

1. Continue working on `develop` branch
2. Commit changes as you go with detailed messages
3. Create feature branches for major features
4. Merge to `main` when features are stable and tested

---

**Last Updated**: 2024  
**Status**: Active workflow documentation

