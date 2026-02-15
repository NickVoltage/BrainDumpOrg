# Research Findings: Local File Saving

> **Note:** This document contains preliminary research findings only. It is NOT an implementation plan and should NOT be used as such. The information here serves as a starting point for understanding how similar features are typically implemented in existing applications.

**Research Date:** 2024  
**Research Scope:** Local File Saving (Item 2 from Research Agenda)

---

## 1. File System API Research

### 1.1 Electron File System APIs

**Overview:**
Electron provides access to Node.js file system APIs through the `fs` module, allowing full file system access in desktop applications.

**Key APIs:**

**fs Module (Node.js):**
- `fs.readFile()` / `fs.readFileSync()` - Read files
- `fs.writeFile()` / `fs.writeFileSync()` - Write files
- `fs.appendFile()` - Append to files
- `fs.mkdir()` / `fs.mkdirSync()` - Create directories
- `fs.readdir()` / `fs.readdirSync()` - Read directory contents
- `fs.stat()` / `fs.statSync()` - Get file/directory stats
- `fs.unlink()` / `fs.unlinkSync()` - Delete files
- `fs.rename()` / `fs.renameSync()` - Rename/move files
- `fs.watch()` / `fs.watchFile()` - Watch for file changes

**Dialog APIs (Electron):**
- `dialog.showOpenDialog()` - Open file dialog
- `dialog.showSaveDialog()` - Save file dialog
- `dialog.showMessageBox()` - Message dialogs

**IPC (Inter-Process Communication):**
- `ipcMain` - Main process handlers
- `ipcRenderer` - Renderer process communication
- Used to safely expose file operations to renderer process

**Pros:**
- ✅ Full file system access
- ✅ Mature and well-documented
- ✅ Cross-platform (Windows, macOS, Linux)
- ✅ Synchronous and asynchronous APIs
- ✅ File watching capabilities
- ✅ Large ecosystem and community

**Cons:**
- ⚠️ Requires IPC for security (renderer process shouldn't directly access fs)
- ⚠️ Larger application size
- ⚠️ Higher memory usage
- ⚠️ Security considerations (need to validate file paths)

**Security Considerations:**
- Always validate file paths to prevent directory traversal
- Use IPC to restrict file system access
- Sanitize user input
- Be cautious with file permissions

**Documentation:**
- Node.js fs module: https://nodejs.org/api/fs.html
- Electron dialog: https://www.electronjs.org/docs/latest/api/dialog
- Electron IPC: https://www.electronjs.org/docs/latest/api/ipc-main

---

### 1.2 Tauri File System APIs

**Overview:**
Tauri provides a secure, Rust-based file system API with permission-based access control.

**Key APIs:**

**@tauri-apps/api/fs:**
- `readTextFile()` - Read text files
- `readBinaryFile()` - Read binary files
- `writeFile()` - Write files
- `writeTextFile()` - Write text files
- `appendFile()` - Append to files
- `removeFile()` - Delete files
- `rename()` - Rename/move files
- `exists()` - Check if file exists
- `readDir()` - Read directory contents
- `createDir()` - Create directories
- `removeDir()` - Remove directories
- `copyFile()` - Copy files

**Dialog APIs:**
- `@tauri-apps/api/dialog` - File dialogs
- `open()` - Open file dialog
- `save()` - Save file dialog

**Pros:**
- ✅ Smaller bundle size than Electron
- ✅ Better security model (permission-based)
- ✅ Better performance (Rust backend)
- ✅ Cross-platform
- ✅ Modern API design
- ✅ TypeScript support

**Cons:**
- ⚠️ Newer framework (smaller ecosystem)
- ⚠️ Requires Rust knowledge for advanced features
- ⚠️ Less documentation/examples than Electron
- ⚠️ Permission system adds complexity

**Security Model:**
- Permission-based file access
- Configure allowed paths in `tauri.conf.json`
- More secure by default than Electron

**Documentation:**
- Tauri fs API: https://tauri.app/api/js/fs/
- Tauri dialog: https://tauri.app/api/js/dialog/

---

### 1.3 Native Framework File System APIs

**Windows (Native):**
- Win32 API (C/C++)
- .NET System.IO (C#)
- UWP StorageFile/StorageFolder (UWP apps)

**macOS (Native):**
- Foundation framework (Objective-C/Swift)
- FileManager class
- NSFileManager APIs

**Linux (Native):**
- POSIX file operations (C/C++)
- GLib file operations (GTK)
- Standard C library file operations

**Considerations:**
- Platform-specific code required
- More complex development
- Better performance
- Native look and feel

**Recommendation:**
For a note app, Electron or Tauri is recommended over native frameworks for cross-platform development.

---

### 1.4 Browser File System APIs (Web Applications)

**File System Access API:**
- Modern browser API for file system access
- `window.showOpenFilePicker()` - Open file dialog
- `window.showSaveFilePicker()` - Save file dialog
- File handles for persistent access
- Limited browser support (Chrome, Edge)

**IndexedDB:**
- Browser database for large data storage
- Asynchronous API
- Good for structured data
- No direct file system access

**localStorage:**
- Simple key-value storage
- Limited size (~5-10MB)
- Synchronous API
- Good for small data

**File API:**
- `File` and `FileReader` objects
- Read files selected by user
- No write access (security limitation)

**Pros:**
- ✅ No installation required
- ✅ Cross-platform (browser-based)
- ✅ Modern APIs available

**Cons:**
- ⚠️ Limited file system access (security restrictions)
- ⚠️ Browser compatibility issues
- ⚠️ No direct file system writes (user must select files)
- ⚠️ Limited offline capabilities

**Recommendation:**
For a desktop note app, Electron or Tauri is preferred over browser APIs for full file system access.

---

### 1.5 Cross-Platform File System Compatibility

**Path Handling:**
- **Windows:** Uses backslashes (`\`), case-insensitive
- **macOS/Linux:** Uses forward slashes (`/`), case-sensitive
- Use path libraries to handle differences

**Path Libraries:**
- **Node.js:** `path` module (built-in)
  - `path.join()` - Join path segments
  - `path.resolve()` - Resolve absolute paths
  - `path.normalize()` - Normalize paths
  - `path.sep` - Platform-specific separator

- **JavaScript:** `path-browserify` (for browser)
- **Tauri:** Built-in path handling

**File Permissions:**
- **Windows:** File attributes, ACLs
- **macOS/Linux:** Unix permissions (read, write, execute)
- Handle permission errors gracefully

**Line Endings:**
- **Windows:** CRLF (`\r\n`)
- **Unix/macOS:** LF (`\n`)
- Consider when reading/writing text files

**Best Practices:**
- Always use path libraries (don't hardcode separators)
- Handle case sensitivity differences
- Test on all target platforms
- Handle permission errors gracefully
- Normalize paths before operations

---

### 1.6 File System Permissions and Security

**Security Considerations:**

**Path Validation:**
- Prevent directory traversal attacks
- Validate all file paths
- Restrict to allowed directories
- Sanitize user input

**Permission Checks:**
- Check file permissions before operations
- Handle permission errors gracefully
- Request elevated permissions when needed (with user consent)

**Sandboxing:**
- Electron: Use context isolation
- Tauri: Use permission system
- Restrict file system access to necessary paths only

**Best Practices:**
- Never trust user input
- Validate all file paths
- Use allowlists for allowed directories
- Implement proper error handling
- Log security-related events
- Keep dependencies updated

---

### 1.7 File System Performance Limitations

**Performance Considerations:**

**Large Files:**
- Reading/writing large files can block the UI
- Use streaming for large files
- Consider chunked reading/writing
- Show progress indicators

**Many Files:**
- Reading directory with many files can be slow
- Use pagination or lazy loading
- Cache file metadata
- Consider indexing

**Concurrent Operations:**
- Limit concurrent file operations
- Use queues for file operations
- Handle race conditions
- Implement proper locking

**Optimization Strategies:**
- Use asynchronous APIs
- Implement caching
- Batch operations when possible
- Use streaming for large files
- Monitor performance metrics

---

## 2. File Persistence Patterns

### 2.1 File Storage Strategies

**Single File Approach:**
- Store all notes in one file (JSON, SQLite, etc.)
- Simple to implement
- Easy backup (copy one file)
- Atomic operations possible

**Pros:**
- ✅ Simple structure
- ✅ Easy backup
- ✅ Atomic writes possible
- ✅ Less file system overhead

**Cons:**
- ⚠️ File can become large
- ⚠️ Risk of corruption affecting all data
- ⚠️ Slower with many notes
- ⚠️ Concurrent access issues

**Directory Structure Approach:**
- Each note in separate file
- Organized in folders
- Better for large numbers of notes
- Easier to manage individual notes

**Pros:**
- ✅ Better performance with many notes
- ✅ Isolated failures (one file corruption doesn't affect others)
- ✅ Easier to manage individual notes
- ✅ Better for version control

**Cons:**
- ⚠️ More complex structure
- ⚠️ More files to manage
- ⚠️ Backup more complex
- ⚠️ File system overhead

**Hybrid Approach:**
- Metadata in single file (index)
- Note content in separate files
- Best of both worlds

**Pros:**
- ✅ Fast metadata queries
- ✅ Isolated note storage
- ✅ Flexible structure

**Cons:**
- ⚠️ More complex implementation
- ⚠️ Need to keep index and files in sync

**Recommendation:**
For a note app, directory structure or hybrid approach is recommended for better performance and reliability.

---

### 2.2 Auto-Save Mechanisms and Intervals

**Auto-Save Strategies:**

**Time-Based Auto-Save:**
- Save after fixed time interval (e.g., every 30 seconds)
- Simple to implement
- May save unnecessarily

**Change-Based Auto-Save:**
- Save after user stops typing (debounce)
- More efficient
- Better user experience

**Event-Based Auto-Save:**
- Save on specific events (blur, window close, etc.)
- Reliable
- May miss unsaved changes

**Hybrid Approach:**
- Combine time-based and change-based
- Most reliable

**Implementation Patterns:**

**Debouncing:**
```javascript
// Save after user stops typing for 2 seconds
let saveTimeout;
function onContentChange() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveFile();
  }, 2000);
}
```

**Throttling:**
```javascript
// Save at most once per 5 seconds
let lastSave = 0;
function onContentChange() {
  const now = Date.now();
  if (now - lastSave > 5000) {
    saveFile();
    lastSave = now;
  }
}
```

**Recommended Intervals:**
- **Typing:** 2-5 seconds after last keystroke
- **Time-based:** 30-60 seconds
- **Window close:** Always save
- **Application close:** Always save

**Best Practices:**
- Show "saving..." indicator
- Show "saved" confirmation
- Handle save errors gracefully
- Save on critical events (close, minimize)
- Allow manual save option

---

### 2.3 Recovery Systems for Unsaved Changes

**Recovery Strategies:**

**Draft Storage:**
- Store unsaved changes in separate location
- Recover on application restart
- Clear after successful save

**Implementation:**
- Store in temporary file or IndexedDB
- Include timestamp and file reference
- Prompt user to recover on startup

**Session Storage:**
- Store current session state
- Recover on crash
- Include undo/redo history

**Checkpoint System:**
- Periodic checkpoints of document state
- Recover to last checkpoint
- More reliable than draft storage

**Implementation Approaches:**

**Temporary Files:**
- Save to `.tmp` or `.draft` files
- Clean up on successful save
- Recover on startup

**IndexedDB/LocalStorage:**
- Store in browser storage
- Persistent across sessions
- Easy to implement

**In-Memory Backup:**
- Keep copy in memory
- Recover from memory on crash
- Limited to current session

**Best Practices:**
- Store recovery data with timestamp
- Limit number of recovery files
- Clean up old recovery data
- Prompt user to recover on startup
- Show recovery options clearly
- Test recovery mechanisms

---

### 2.4 File Locking Mechanisms

**Locking Strategies:**

**File-Based Locking:**
- Create lock file (`.lock`) when file is open
- Check for lock file before opening
- Delete lock file on close

**Pros:**
- ✅ Simple to implement
- ✅ Works across processes
- ✅ Clear indication of locked file

**Cons:**
- ⚠️ Lock file may remain if app crashes
- ⚠️ Need cleanup mechanism
- ⚠️ Race conditions possible

**Process-Based Locking:**
- Track open files in application
- Prevent opening same file twice
- Release on close

**Pros:**
- ✅ No file system overhead
- ✅ Automatic cleanup
- ✅ Faster

**Cons:**
- ⚠️ Only works within same process
- ⚠️ Doesn't prevent other apps from accessing

**Database Locking:**
- Use database transactions
- Row-level locking
- More sophisticated

**Implementation:**
```javascript
// Simple file lock example
function acquireLock(filePath) {
  const lockPath = filePath + '.lock';
  if (fs.existsSync(lockPath)) {
    throw new Error('File is locked');
  }
  fs.writeFileSync(lockPath, process.pid.toString());
}

function releaseLock(filePath) {
  const lockPath = filePath + '.lock';
  if (fs.existsSync(lockPath)) {
    fs.unlinkSync(lockPath);
  }
}
```

**Best Practices:**
- Implement timeout for locks
- Clean up stale locks
- Show lock status to user
- Allow force unlock option
- Handle lock errors gracefully

---

### 2.5 Conflict Resolution for Concurrent Access

**Conflict Scenarios:**

**Same File, Multiple Instances:**
- User opens same file in multiple windows
- Changes in one window conflict with another
- Need to detect and resolve conflicts

**External Modifications:**
- File modified outside application
- File changed by another process
- Need to detect external changes

**Resolution Strategies:**

**Last Write Wins:**
- Simple approach
- May lose changes
- Not ideal for user data

**Merge Conflicts:**
- Detect conflicting changes
- Show conflict resolution UI
- Let user choose resolution

**Operational Transform:**
- Transform operations to resolve conflicts
- Complex but powerful
- Used in collaborative editing

**Version-Based Resolution:**
- Track versions
- Merge based on version history
- More reliable

**Implementation Approaches:**

**File Watching:**
- Watch for external file changes
- Prompt user when detected
- Offer to reload or merge

**Change Detection:**
- Compare file content on save
- Detect if file changed externally
- Handle conflicts appropriately

**Best Practices:**
- Always detect conflicts
- Never silently overwrite user data
- Provide clear conflict resolution UI
- Keep backup before overwriting
- Log conflict events

---

### 2.6 File Corruption Detection and Prevention

**Corruption Causes:**
- Application crash during write
- System crash
- Disk errors
- Network issues (if syncing)
- Power loss

**Prevention Strategies:**

**Atomic Writes:**
- Write to temporary file first
- Rename to final file on success
- Ensures file is never partially written

**Implementation:**
```javascript
function atomicWrite(filePath, content) {
  const tempPath = filePath + '.tmp';
  fs.writeFileSync(tempPath, content);
  fs.renameSync(tempPath, filePath);
}
```

**Checksums:**
- Calculate checksum before write
- Store checksum with file
- Verify on read
- Detect corruption

**Backup Before Write:**
- Create backup before modifying
- Restore backup on corruption
- Keep multiple backups

**Transaction Logs:**
- Log all changes
- Replay log on recovery
- More complex but reliable

**Detection Methods:**

**File Validation:**
- Validate file format on read
- Check structure integrity
- Detect malformed data

**Checksum Verification:**
- Verify stored checksum
- Detect data corruption
- Automatic recovery if possible

**Best Practices:**
- Always use atomic writes
- Implement checksums
- Keep backups
- Validate on read
- Provide recovery mechanisms
- Test corruption scenarios

---

## 3. File Format Research

### 3.1 Plain Text Format

**Overview:**
Simple text files with no formatting or structure.

**Pros:**
- ✅ Universal compatibility
- ✅ Human-readable
- ✅ Easy to edit with any text editor
- ✅ Small file size
- ✅ Version control friendly
- ✅ No parsing required

**Cons:**
- ⚠️ No formatting support
- ⚠️ No metadata
- ⚠️ No structure
- ⚠️ Limited features

**Use Cases:**
- Simple notes
- Code snippets
- When maximum compatibility needed

**File Extension:**
- `.txt`

**Recommendation:**
Not suitable for full-featured note app with rich text and metadata.

---

### 3.2 Markdown Format

**Overview:**
Lightweight markup language for formatted text.

**Pros:**
- ✅ Human-readable
- ✅ Version control friendly
- ✅ Wide support
- ✅ Good for documentation
- ✅ Can be converted to HTML/PDF
- ✅ Supports formatting, links, images, code

**Cons:**
- ⚠️ Limited rich text features
- ⚠️ No embedded metadata (without frontmatter)
- ⚠️ Parsing required
- ⚠️ Some features not standardized

**Features:**
- Headings, bold, italic
- Lists, links, images
- Code blocks
- Tables
- Frontmatter for metadata (YAML)

**File Extension:**
- `.md`, `.markdown`

**Libraries:**
- `marked` - Markdown parser
- `markdown-it` - Markdown parser
- `remark` - Markdown processor
- `turndown` - HTML to Markdown

**Recommendation:**
Good option for note app, especially with frontmatter for metadata.

---

### 3.3 JSON Format

**Overview:**
Structured data format, easy to parse and generate.

**Pros:**
- ✅ Structured data
- ✅ Easy to parse
- ✅ Supports nested data
- ✅ Can include metadata
- ✅ Widely supported
- ✅ Good for programmatic access

**Cons:**
- ⚠️ Not human-readable for large files
- ⚠️ No comments (standard JSON)
- ⚠️ Verbose for simple content
- ⚠️ No formatting preservation (unless structured)

**Structure Example:**
```json
{
  "metadata": {
    "title": "Note Title",
    "created": "2024-01-01T00:00:00Z",
    "modified": "2024-01-02T00:00:00Z",
    "tags": ["tag1", "tag2"],
    "version": "1.0.0"
  },
  "content": {
    "type": "rich-text",
    "data": "..."
  }
}
```

**File Extension:**
- `.json`

**Libraries:**
- Built-in `JSON.parse()` / `JSON.stringify()`
- `json5` - JSON with comments
- `jsonc` - JSON with comments

**Recommendation:**
Excellent for structured note storage with metadata. Can store rich text as HTML or structured format.

---

### 3.4 Binary Format

**Overview:**
Proprietary binary format for efficient storage.

**Pros:**
- ✅ Compact file size
- ✅ Fast read/write
- ✅ Can include metadata
- ✅ Can be encrypted
- ✅ Proprietary format

**Cons:**
- ⚠️ Not human-readable
- ⚠️ Requires custom parser
- ⚠️ Not compatible with other tools
- ⚠️ More complex implementation
- ⚠️ Harder to debug

**Use Cases:**
- Large files
- Performance-critical applications
- Proprietary applications
- Encrypted storage

**Implementation:**
- Custom binary format
- Use libraries like `msgpack` or `protobuf`
- More complex than text formats

**Recommendation:**
Only if file size or performance is critical. Generally not recommended for note apps.

---

### 3.5 Hybrid Format Approaches

**Approach 1: JSON + Markdown**
- Metadata in JSON
- Content in Markdown
- Best of both worlds

**Structure:**
```
note.json - Metadata
note.md - Content
```

**Approach 2: JSON with HTML Content**
- Metadata in JSON structure
- Rich text content as HTML
- Single file

**Structure:**
```json
{
  "metadata": {...},
  "content": "<html>...</html>"
}
```

**Approach 3: Frontmatter + Content**
- YAML frontmatter for metadata
- Markdown or HTML content
- Single file

**Structure:**
```markdown
---
title: Note Title
tags: [tag1, tag2]
created: 2024-01-01
---

Content here...
```

**Approach 4: SQLite Database**
- Structured database
- Notes as rows
- Metadata as columns
- Rich queries

**Pros:**
- ✅ Structured queries
- ✅ Efficient storage
- ✅ ACID transactions
- ✅ Good for many notes

**Cons:**
- ⚠️ More complex
- ⚠️ Requires SQLite library
- ⚠️ Not human-readable

**Recommendation:**
Hybrid approach (JSON + Markdown or Frontmatter) provides good balance of structure and readability.

---

### 3.6 Format Migration and Backward Compatibility

**Migration Strategies:**

**Version Field:**
- Include version in file format
- Detect old versions
- Migrate automatically

**Example:**
```json
{
  "version": "2.0.0",
  "metadata": {...},
  "content": {...}
}
```

**Migration Functions:**
- Write migration functions for each version
- Chain migrations (v1 → v2 → v3)
- Test thoroughly

**Backward Compatibility:**
- Support reading old formats
- Don't break old files
- Provide migration tools

**Best Practices:**
- Always include version
- Test migrations thoroughly
- Keep old format readers
- Provide migration documentation
- Backup before migration

---

### 3.7 Format Compression Options

**Compression Libraries:**

**gzip:**
- Standard compression
- Good compression ratio
- Widely supported

**brotli:**
- Better compression than gzip
- Modern browsers support
- Good for web

**lz4:**
- Fast compression
- Lower compression ratio
- Good for real-time

**When to Compress:**
- Large files
- Network transfer
- Storage optimization
- Not needed for small files

**Implementation:**
- Compress on save
- Decompress on load
- Transparent to user
- Consider performance impact

**Recommendation:**
Only compress if file size is a concern. For note apps, usually not necessary.

---

## 4. File Organization Research

### 4.1 Folder Structure Patterns for Note Applications

**Flat Structure:**
```
notes/
  note1.md
  note2.md
  note3.md
```

**Pros:**
- Simple
- Easy to navigate
- Good for small numbers of notes

**Cons:**
- Doesn't scale
- Hard to organize

**Hierarchical Structure:**
```
notes/
  project1/
    note1.md
    note2.md
  project2/
    note1.md
  archive/
    old-note.md
```

**Pros:**
- Better organization
- Scales well
- Familiar structure

**Cons:**
- More complex
- Need folder management

**Date-Based Structure:**
```
notes/
  2024/
    01/
      note-2024-01-15.md
    02/
      note-2024-02-20.md
```

**Pros:**
- Chronological organization
- Easy to find by date

**Cons:**
- Less flexible
- Hard to organize by topic

**Tag-Based Structure:**
```
notes/
  tag1/
    note1.md
    note2.md
  tag2/
    note1.md
```

**Pros:**
- Topic-based organization
- Flexible

**Cons:**
- Notes can be in multiple tags (need symlinks or copies)
- More complex

**Database + Files:**
```
data/
  index.json (or SQLite)
  files/
    note1.md
    note2.md
```

**Pros:**
- Fast queries
- Flexible organization
- Metadata separate from content

**Cons:**
- More complex
- Need to keep in sync

**Recommendation:**
Hybrid approach: Database/index for metadata, files for content, organized by date or project.

---

### 4.2 File Naming Conventions and Organization

**Naming Strategies:**

**UUID-Based:**
- `550e8400-e29b-41d4-a716-446655440000.md`
- Pros: Unique, no conflicts
- Cons: Not human-readable

**Timestamp-Based:**
- `20240115143000-note-title.md`
- Pros: Sortable, includes date
- Cons: Long filenames

**Title-Based:**
- `my-note-title.md`
- Pros: Human-readable
- Cons: Need to sanitize, may conflict

**Slug-Based:**
- `my-note-title-20240115.md`
- Pros: Human-readable, includes date
- Cons: Need slug generation

**Best Practices:**
- Sanitize filenames (remove special characters)
- Handle filename conflicts
- Keep filenames reasonable length
- Use consistent format
- Consider filesystem limitations

**Filename Sanitization:**
```javascript
function sanitizeFilename(name) {
  return name
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .substring(0, 100);
}
```

---

### 4.3 File Indexing and Search Capabilities

**Indexing Strategies:**

**In-Memory Index:**
- Load all metadata into memory
- Fast queries
- Limited by memory

**Database Index:**
- SQLite or similar
- Efficient queries
- Scales well

**File-Based Index:**
- JSON file with metadata
- Simple
- May become large

**Full-Text Search:**
- Index content for search
- Libraries: `lunr.js`, `flexsearch`, `fuse.js`
- Or use database with FTS

**Implementation:**
- Build index on startup
- Update index on file changes
- Search index for queries
- Return matching files

**Best Practices:**
- Index metadata (title, tags, etc.)
- Consider full-text search
- Update index incrementally
- Handle index corruption
- Provide search UI

---

### 4.4 File Categorization Systems

**Categorization Methods:**

**Folders:**
- Physical organization
- Simple
- Limited (one category per file)

**Tags:**
- Multiple tags per file
- Flexible
- Need tag management

**Projects:**
- Group related notes
- Hierarchical
- Good for organization

**Labels:**
- Similar to tags
- May have hierarchy
- Flexible

**Metadata Fields:**
- Custom fields
- Structured
- Queryable

**Best Practices:**
- Support multiple categorization methods
- Allow custom fields
- Provide filtering UI
- Make categorization easy

---

## 5. Backup and Versioning

### 5.1 Backup Strategies

**Automatic Backup:**
- Backup on save
- Backup on schedule
- Backup on close

**Manual Backup:**
- User-initiated
- Full control
- May be forgotten

**Cloud Sync as Backup:**
- Sync to cloud service
- Automatic
- Off-site backup

**Local Backup:**
- Copy to backup directory
- Keep multiple versions
- Quick restore

**Backup Locations:**
- Same directory (`.backup` folder)
- Separate directory
- External drive
- Cloud storage

**Backup Frequency:**
- Every save (may be too frequent)
- Every N saves
- Daily
- Weekly

**Best Practices:**
- Automatic backups
- Multiple backup locations
- Keep backup history
- Test restore process
- Compress old backups
- Clean up old backups

---

### 5.2 Versioning Systems and History Tracking

**Version Strategies:**

**Snapshot-Based:**
- Save full copy of each version
- Simple
- Uses more space

**Delta-Based:**
- Store only changes
- Efficient
- More complex

**Git-Like:**
- Use Git for versioning
- Powerful
- May be overkill

**Custom Versioning:**
- Track changes in metadata
- Store versions in separate files
- Custom implementation

**Version Storage:**
```
notes/
  note1.md
  .versions/
    note1/
      v1.md
      v2.md
      v3.md
```

**Version Metadata:**
- Version number
- Timestamp
- Author (if applicable)
- Change description
- Checksum

**Best Practices:**
- Limit number of versions
- Compress old versions
- Provide version browser UI
- Allow version comparison
- Restore from version

---

### 5.3 File Recovery Mechanisms

**Recovery Methods:**

**Backup Restoration:**
- Restore from backup
- Simple
- May lose recent changes

**Version Restoration:**
- Restore from version history
- More granular
- Better control

**Auto-Recovery:**
- Recover from crash
- Automatic
- Limited to session

**Corruption Recovery:**
- Detect corruption
- Restore from backup
- Rebuild from log

**Best Practices:**
- Multiple recovery options
- Clear recovery UI
- Test recovery process
- Log recovery events
- Prevent data loss

---

### 5.4 Backup Storage Locations and Management

**Storage Options:**
- Local directory
- External drive
- Network drive
- Cloud storage (Dropbox, Google Drive, etc.)

**Management:**
- Limit backup size
- Clean up old backups
- Compress backups
- Organize by date
- Monitor backup health

**Best Practices:**
- Multiple backup locations
- Regular backup verification
- Automated cleanup
- Backup size limits
- Clear backup organization

---

## 6. Security and Privacy

### 6.1 File Encryption Options

**Encryption Libraries:**

**crypto-js:**
- JavaScript encryption library
- AES encryption
- Easy to use
- Client-side only

**Node.js crypto:**
- Built-in Node.js module
- Various algorithms
- Good performance
- Server-side or Electron

**Web Crypto API:**
- Browser API
- Modern
- Good performance
- Limited algorithms

**libsodium:**
- Modern cryptography library
- Many algorithms
- Well-audited
- Requires bindings

**Encryption Algorithms:**
- **AES-256:** Industry standard, secure
- **ChaCha20:** Modern, fast
- **XChaCha20:** Extended nonce

**Implementation:**
- Encrypt on save
- Decrypt on load
- Store encryption key securely
- Use authenticated encryption (AEAD)

**Best Practices:**
- Use strong algorithms (AES-256)
- Secure key storage
- Use authenticated encryption
- Handle encryption errors
- Provide key recovery option

---

### 6.2 Encryption Libraries and Algorithms

**Recommended Libraries:**

**Node.js crypto (Electron):**
- Built-in, no dependencies
- AES-256-GCM (authenticated)
- Good performance
- Well-tested

**crypto-js (Browser/Electron):**
- Easy to use
- AES encryption
- Large bundle size
- Less secure than native crypto

**tweetnacl-js:**
- Modern cryptography
- Small bundle
- Good performance
- Well-audited

**Algorithm Recommendations:**
- **AES-256-GCM:** For file encryption
- **Argon2:** For password hashing
- **PBKDF2:** For key derivation

**Key Management:**
- Derive key from password
- Use key derivation function (PBKDF2, Argon2)
- Store salt securely
- Never store plain password

---

### 6.3 Password Protection Mechanisms

**Password-Based Encryption:**
- User enters password
- Derive encryption key from password
- Encrypt files with key
- Decrypt with password

**Implementation:**
```javascript
// Simplified example
function encryptWithPassword(data, password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  // ... encryption logic
}
```

**Password Hashing:**
- Hash passwords before storage
- Use strong hash (Argon2, bcrypt)
- Never store plain passwords
- Use salt

**Best Practices:**
- Strong password requirements
- Password strength indicator
- Secure password storage
- Password recovery mechanism
- Never log passwords

---

### 6.4 Secure Deletion of Sensitive Files

**Secure Deletion Methods:**

**Overwrite:**
- Overwrite file with random data
- Multiple passes (optional, usually unnecessary)
- Delete file

**Shredding:**
- Overwrite multiple times
- More secure (though often unnecessary on SSDs)
- Slower

**Implementation:**
```javascript
function secureDelete(filePath, passes = 3) {
  const fileSize = fs.statSync(filePath).size;
  for (let i = 0; i < passes; i++) {
    const randomData = crypto.randomBytes(fileSize);
    fs.writeFileSync(filePath, randomData);
  }
  fs.unlinkSync(filePath);
}
```

**Note on SSDs:**
- SSDs use wear leveling
- Overwriting may not actually overwrite
- Encryption + delete is often sufficient
- Physical destruction for maximum security

**Best Practices:**
- Overwrite before delete
- Clear from memory
- Clear clipboard
- Clear temp files
- Consider encryption instead

---

### 6.5 Privacy Implications of Local Storage

**Privacy Considerations:**
- Files stored locally
- May be accessible to other apps
- May be backed up automatically (macOS Time Machine, etc.)
- May be indexed by OS search

**Mitigation:**
- Encrypt sensitive files
- Store in user-controlled location
- Clear temp files
- Secure file permissions
- Inform users about backups

**Best Practices:**
- Encrypt sensitive data
- Store in user directory
- Set appropriate file permissions
- Clear temporary data
- Provide privacy options
- Document privacy implications

---

## 7. Summary and Recommendations

### 7.1 Recommended Approach

**For Desktop Application (Electron/Tauri):**

**File System:**
- Use Electron `fs` module or Tauri `fs` API
- Implement IPC for security (Electron)
- Use permission system (Tauri)

**Storage Strategy:**
- **Hybrid approach:** Database/index for metadata, files for content
- **Format:** JSON for metadata, Markdown or HTML for content
- **Structure:** Organized by date or project in folders

**Persistence:**
- Auto-save with debouncing (2-5 seconds)
- Draft recovery system
- Atomic writes for safety

**Backup:**
- Automatic local backups
- Version history (last 10-20 versions)
- Optional cloud sync

**Security:**
- Optional file encryption (AES-256)
- Password protection if encryption enabled
- Secure key storage

### 7.2 Implementation Priority

**Phase 1 (MVP):**
- Basic file save/load
- Auto-save with debouncing
- Simple file organization
- Basic backup

**Phase 2 (Enhanced):**
- Version history
- Draft recovery
- File indexing
- Advanced organization

**Phase 3 (Advanced):**
- Encryption
- Cloud sync
- Advanced search
- Conflict resolution

### 7.3 Technical Stack Recommendations

**File System:**
- **Electron:** Node.js `fs` module + IPC
- **Tauri:** Tauri `fs` API
- **Path handling:** Node.js `path` module or Tauri path utilities

**Storage:**
- **Format:** JSON (metadata) + Markdown/HTML (content)
- **Database:** SQLite for metadata/index (optional)
- **Search:** `lunr.js` or `flexsearch` for full-text search

**Encryption:**
- **Node.js crypto** (Electron) or **Web Crypto API** (Tauri)
- **Algorithm:** AES-256-GCM
- **Key derivation:** PBKDF2 or Argon2

### 7.4 Key Considerations

1. **Performance:** Use async APIs, implement caching, optimize for large numbers of files
2. **Reliability:** Atomic writes, checksums, backups, recovery mechanisms
3. **Security:** Validate paths, encrypt sensitive data, secure key storage
4. **User Experience:** Auto-save, recovery prompts, clear error messages
5. **Compatibility:** Handle cross-platform differences, test on all platforms
6. **Scalability:** Design for growth, efficient indexing, optimize queries

### 7.5 Next Steps

1. Choose framework (Electron or Tauri)
2. Design file structure and format
3. Implement basic save/load
4. Add auto-save
5. Implement backup system
6. Add version history
7. Add encryption (if needed)
8. Performance optimization
9. Testing and refinement

---

## 8. References and Resources

### 8.1 Documentation Links

- **Electron File System:** https://www.electronjs.org/docs/latest/api/dialog
- **Node.js fs Module:** https://nodejs.org/api/fs.html
- **Tauri fs API:** https://tauri.app/api/js/fs/
- **Web File System Access API:** https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
- **Node.js crypto:** https://nodejs.org/api/crypto.html

### 8.2 Additional Resources

- **SQLite:** https://www.sqlite.org/
- **IndexedDB API:** https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- **Markdown Guide:** https://www.markdownguide.org/
- **JSON Specification:** https://www.json.org/

### 8.3 Research Notes

- Research conducted through documentation review and best practices analysis
- Information current as of 2024
- Implementation details may vary based on chosen framework
- Security practices should be reviewed with security experts
- Performance characteristics should be tested with actual data

---

**Document Status:** Research Complete  
**Last Updated:** 2024  
**Next Action:** Review findings and proceed with implementation planning

