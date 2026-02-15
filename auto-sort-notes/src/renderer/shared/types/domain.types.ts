/**
 * Domain Model Types
 * 
 * Purpose: Core domain model type definitions using Domain-Driven Design (DDD) pattern.
 * Includes entities, value objects, and branded types for type safety.
 * 
 * Last Updated: 2024
 * Status: Placeholder - Ready for implementation
 */

// Comment 009: TypeScript Type Definitions
// This file defines core domain model types using Domain-Driven Design (DDD) pattern.
// Types are organized by domain and use branded types for IDs to prevent mixing.
//
// Intended Interactions:
// - Used by: All service and storage modules
// - Used by: All component and hook files
// - Provides: Type safety and domain modeling
//
// Logic Flow:
// 1. Domain types define the structure of business entities
// 2. Branded types ensure type safety for IDs
// 3. Discriminated unions handle variant types
// 4. Types are used throughout the application for consistency
//
// Dependencies:
// - TypeScript type system
// - No runtime dependencies
//
// Related Files:
// - src/renderer/shared/types/dto.types.ts (DTO types)
// - src/renderer/shared/types/tiptap.types.ts (Tiptap types)
// - All feature type files (notes/types.ts, calendar/types.ts, etc.)
//
// Related Comments:
// - Comment 010 (domain.types.ts - domain model types)
// - Comment 011 (dto.types.ts - DTO types)
// - Comment 020 (notes/types.ts - note-specific types)

// Comment 010: Domain Model Types
// This section defines core domain entities and value objects.
// Uses branded types for IDs to prevent accidental mixing of different ID types.

/**
 * Branded type for document IDs.
 * Format: {app_version}_{timestamp}
 * Example: "1.0.0_20241201143052"
 */
export type DocumentId = string & { readonly __brand: 'DocumentId' };

/**
 * Branded type for tag IDs.
 */
export type TagId = number & { readonly __brand: 'TagId' };

/**
 * Branded type for project IDs.
 */
export type ProjectId = number & { readonly __brand: 'ProjectId' };

/**
 * Branded type for reminder IDs.
 */
export type ReminderId = number & { readonly __brand: 'ReminderId' };

/**
 * Branded type for timer IDs.
 */
export type TimerId = number & { readonly __brand: 'TimerId' };

/**
 * Branded type for alarm IDs.
 */
export type AlarmId = number & { readonly __brand: 'AlarmId' };

/**
 * Branded type for calendar event IDs.
 */
export type CalendarEventId = number & { readonly __brand: 'CalendarEventId' };

/**
 * Branded type for todo IDs.
 */
export type TodoId = number & { readonly __brand: 'TodoId' };

/**
 * Branded type for branch IDs.
 */
export type BranchId = number & { readonly __brand: 'BranchId' };

/**
 * Branded type for version IDs.
 */
export type VersionId = number & { readonly __brand: 'VersionId' };

/**
 * Note entity - Core domain entity for notes.
 */
export interface Note {
  documentId: DocumentId;
  parentId: DocumentId | null;
  title: string;
  filePath: string;
  createdAt: Date;
  modifiedAt: Date;
}

/**
 * Tag entity - Metadata tag.
 */
export interface Tag {
  id: TagId;
  name: string;
  createdAt: Date;
}

/**
 * Project entity - Project/category metadata.
 */
export interface Project {
  id: ProjectId;
  name: string;
  createdAt: Date;
}

/**
 * Reminder entity - Reminder attached to notes or calendar events.
 */
export interface Reminder {
  id: ReminderId;
  noteId: DocumentId | null;
  title: string;
  description: string | null;
  dueDate: Date | null;
  doDate: Date | null;
  completed: boolean;
  createdAt: Date;
}

/**
 * Timer entity - Timer for countdown or count-up.
 */
export interface Timer {
  id: TimerId;
  noteId: DocumentId | null;
  name: string | null;
  duration: number | null; // Duration in seconds (for countdown)
  startedAt: Date | null;
  pausedAt: Date | null;
  elapsedSeconds: number;
  timerType: 'countdown' | 'countup';
  createdAt: Date;
}

/**
 * Alarm entity - Alarm for notifications.
 */
export interface Alarm {
  id: AlarmId;
  noteId: DocumentId | null;
  title: string;
  alarmTime: Date;
  recurring: string | null; // JSON string for recurrence pattern
  enabled: boolean;
  snoozeCount: number;
  lastTriggered: Date | null;
  createdAt: Date;
}

/**
 * Recurrence pattern for recurring events/alarms.
 */
export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every N days/weeks/months/years
  daysOfWeek?: number[]; // For weekly: [0=Sunday, 1=Monday, ...]
  dayOfMonth?: number; // For monthly: day of month (1-31)
  until?: Date; // End date for recurrence
  count?: number; // Number of occurrences
}

/**
 * Calendar event type - Discriminated union for event types.
 */
export type CalendarEventType = 
  | { type: 'one-time'; eventDate: Date; endDate?: Date }
  | { type: 'recurring'; eventDate: Date; endDate?: Date; recurrencePattern: RecurrencePattern }
  | { type: 'all-day'; eventDate: Date; endDate?: Date };

/**
 * Calendar event entity - Calendar event with discriminated union type.
 */
export interface CalendarEvent {
  id: CalendarEventId;
  title: string;
  description: string | null;
  eventType: CalendarEventType;
  location: string | null;
  reminderId: ReminderId | null;
  createdAt: Date;
}

/**
 * Todo priority levels.
 */
export type TodoPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Todo entity - To-do list item.
 */
export interface Todo {
  id: TodoId;
  title: string;
  description: string | null;
  dueDate: Date | null;
  doDate: Date | null;
  completed: boolean;
  priority: TodoPriority;
  noteId: DocumentId | null;
  createdAt: Date;
  completedAt: Date | null;
}

/**
 * Branch entity - Branch for branched notes feature.
 */
export interface Branch {
  id: BranchId;
  noteId: DocumentId;
  parentBranchId: BranchId | null;
  branchPoint: string | null; // Position in document
  branchName: string;
  description: string | null;
  createdAt: Date;
}

/**
 * Version snapshot type - Full snapshot or delta.
 */
export type SnapshotType = 'full' | 'delta';

/**
 * Version entity - Version snapshot for historical timelines.
 */
export interface Version {
  id: VersionId;
  noteId: DocumentId;
  versionNumber: number;
  contentSnapshot: string; // File path to snapshot
  snapshotType: SnapshotType;
  parentVersionId: VersionId | null;
  description: string | null;
  createdAt: Date;
}

/**
 * Helper function to create a DocumentId from a string.
 */
export function createDocumentId(id: string): DocumentId {
  return id as DocumentId;
}

/**
 * Helper function to create a TagId from a number.
 */
export function createTagId(id: number): TagId {
  return id as TagId;
}

/**
 * Helper function to create a ProjectId from a number.
 */
export function createProjectId(id: number): ProjectId {
  return id as ProjectId;
}

