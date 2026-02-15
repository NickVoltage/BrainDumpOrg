/**
 * Result Type for Error Handling
 * 
 * Purpose: Type-safe error handling using Result<T, E> pattern.
 * This provides a functional approach to error handling throughout the application.
 * 
 * Last Updated: 2024
 * Status: Placeholder - Ready for breadcrumb comments
 */

// Comment 003: Result<T, E> Type for Error Handling
// This type provides a functional approach to error handling, similar to Rust's Result type.
// It allows functions to return either a success value (Ok) or an error (Err) without throwing exceptions.
//
// Intended Interactions:
// - Used by: All service and storage modules throughout the application
// - Provides: Type-safe error handling without exceptions
// - Enables: Explicit error handling in all async operations
//
// Logic Flow:
// 1. Function returns Result<T, E> instead of throwing
// 2. Caller checks if result is Ok or Err
// 3. Handle success or error case explicitly
// 4. Chain operations using map, mapErr, andThen, etc.
//
// Dependencies:
// - TypeScript type system
// - No runtime dependencies
//
// Related Files:
// - All service files (note-service.ts, calendar-service.ts, etc.)
// - All storage files (note-file-storage.ts, note-database-storage.ts, etc.)
// - All hook files (useNote.ts, useCalendar.ts, etc.)
//
// Related Comments:
// - Comment 003 (All service files - error handling in services)
// - Comment 003 (All storage files - error handling in storage)
// - Comment 010 (note-service.ts - note operations with error handling)

export type Result<T, E> = 
  | { ok: true; value: T }
  | { ok: false; error: E };
