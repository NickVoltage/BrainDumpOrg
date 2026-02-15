# Troubleshooting Guide

## First Launch - Compilation

**Question: Will all that compilation happen every time?**

**Answer:** No! The compilation you saw is a **one-time setup**:

- **First time:** Downloads and compiles all Rust dependencies (crates) - this is normal and expected
- **Subsequent launches:** Only recompiles if:
  - You change Rust code in `src-tauri/`
  - Dependencies are updated
  - You clean the build cache

**What you saw:**
- `Downloaded 268 crates` - First-time dependency download
- `Compiling...` - Building Rust code
- This takes 1-5 minutes the first time, but future launches are much faster (seconds)

**To speed up future launches:**
- The compiled code is cached in `target/debug/`
- Only changed code needs recompiling
- Development builds are faster than release builds

---

## Error: "The filename, directory name, or volume label syntax is incorrect" (Error 123)

**Cause:** This Windows error typically occurs due to:
1. Invalid app identifier in `tauri.conf.json` ✅ **FIXED**
2. Missing or invalid icon files ✅ **FIXED**
3. Path issues with spaces (less common with Tauri 2.x)

**Fixes Applied:**
- ✅ Updated app identifier from placeholder to valid format: `com.autosortnotes.app`
- ✅ Removed icon references (icons will be added later)

**If error persists:**
1. Check that the project path doesn't have unusual characters
2. Try running from a path without spaces (if possible)
3. Check Windows permissions for the project directory

---

## Common Issues

### Port Already in Use (1420)
**Solution:**
```bash
# Find and kill process using port 1420
netstat -ano | findstr :1420
taskkill /PID <process_id> /F
```

### Rust Not Found
**Solution:**
```bash
# Install Rust if not installed
# Visit: https://rustup.rs/
rustup --version
```

### Tauri CLI Not Found
**Solution:**
```bash
# Install Tauri CLI globally
npm install -g @tauri-apps/cli
tauri --version
```

### Build Cache Issues
**Solution:**
```bash
# Clean Rust build cache (if builds fail)
cd src-tauri
cargo clean
cd ..
npm run dev:tauri
```

---

## Performance Tips

### Faster Development Builds
- Development builds are unoptimized but faster to compile
- Release builds are optimized but slower to compile
- Use `tauri dev` for development (faster)
- Use `tauri build` for production (optimized)

### Reducing Compilation Time
- Only changed files are recompiled
- Rust's incremental compilation is very efficient
- First build is always the slowest

---

## Getting Help

If issues persist:
1. Check the terminal output for specific error messages
2. Verify all prerequisites are installed (Rust, Node.js, Tauri CLI)
3. Check that the project path is accessible
4. Try cleaning the build cache and rebuilding

