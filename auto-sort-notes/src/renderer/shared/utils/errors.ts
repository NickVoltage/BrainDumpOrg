/**
 * Custom Error Classes
 * 
 * Purpose: Domain-specific error classes for better error handling and debugging.
 * Provides structured error information with context and error codes.
 * 
 * Last Updated: 2024
 * Status: Placeholder - Ready for implementation
 */

// Comment 005: Custom Error Classes
// This module defines custom error classes for different error types in the application.
// Each error class provides structured error information with context, error codes, and stack traces.
//
// Intended Interactions:
// - Used by: All service and storage modules for throwing domain-specific errors
// - Used by: Error handlers for categorizing and handling errors
// - Provides: Structured error information for debugging and user feedback
//
// Logic Flow:
// 1. Service/storage module encounters an error condition
// 2. Creates appropriate custom error class instance
// 3. Returns Result<T, CustomError> with error
// 4. Error handler processes error and provides user feedback
//
// Dependencies:
// - TypeScript class system
// - Error base class
//
// Related Files:
// - src/renderer/shared/types/result.types.ts (Result<T, E> type)
// - src/renderer/shared/utils/error-handler.ts (error handling)
// - All service files (note-service.ts, calendar-service.ts, etc.)
//
// Related Comments:
// - Comment 003 (result.types.ts - error handling)
// - Comment 007 (error-handler.ts - global error handler)
// - Comment 010 (note-service.ts - note operations with errors)

/**
 * Base error class for all application errors.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for note-related operations.
 */
export class NoteError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'NOTE_ERROR', context);
  }
}

/**
 * Error for storage-related operations (database, file system).
 */
export class StorageError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'STORAGE_ERROR', context);
  }
}

/**
 * Error for database operations.
 */
export class DatabaseError extends StorageError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, { ...context, type: 'database' });
    this.code = 'DATABASE_ERROR';
  }
}

/**
 * Error for file system operations.
 */
export class FileSystemError extends StorageError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, { ...context, type: 'filesystem' });
    this.code = 'FILESYSTEM_ERROR';
  }
}

/**
 * Error for validation failures.
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', context);
  }
}

/**
 * Error for service operations.
 */
export class ServiceError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'SERVICE_ERROR', context);
  }
}

/**
 * Error for Tauri IPC operations.
 */
export class TauriError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'TAURI_ERROR', context);
  }
}

/**
 * Error for file import/export operations.
 */
export class FileImportError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'FILE_IMPORT_ERROR', context);
  }
}

/**
 * Error for authentication/authorization operations.
 */
export class AuthError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'AUTH_ERROR', context);
  }
}

/**
 * Helper function to check if an error is an AppError.
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Helper function to convert unknown error to AppError.
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', { originalError: error.name });
  }
  
  return new AppError(String(error), 'UNKNOWN_ERROR', { originalError: error });
}

