/**
 * Data Transfer Object (DTO) Types
 * 
 * Purpose: DTO types for data transfer between layers.
 * Used for creating and updating entities without exposing full domain models.
 * 
 * Last Updated: 2024
 * Status: Placeholder - Ready for implementation
 */

// Comment 011: DTO Types
// This file defines Data Transfer Object (DTO) types for creating and updating entities.
// DTOs are used to transfer data between layers without exposing full domain models.
//
// Intended Interactions:
// - Used by: Service layer for accepting input data
// - Used by: Component layer for form data
// - Provides: Type-safe data transfer without exposing domain internals
//
// Logic Flow:
// 1. Component/service receives DTO data
// 2. DTO is validated
// 3. DTO is converted to domain entity
// 4. Domain entity is persisted
//
// Dependencies:
// - TypeScript type system
// - Domain types (domain.types.ts)
//
// Related Files:
// - src/renderer/shared/types/domain.types.ts (domain entities)
// - All service files (note-service.ts, calendar-service.ts, etc.)
//
// Related Comments:
// - Comment 010 (domain.types.ts - domain model types)
// - Comment 010 (note-service.ts - note operations with DTOs)

import type {
  DocumentId,
  TagId,
  ProjectId,
  ReminderId,
  CalendarEventId,
  TodoId,
  BranchId,
  RecurrencePattern,
  TodoPriority
} from './domain.types';

/**
 * DTO for creating a note.
 */
export interface CreateNoteData {
  title: string;
  parentId?: DocumentId | null;
  content?: unknown; // Tiptap JSON
}

/**
 * DTO for updating note metadata.
 */
export interface UpdateNoteMetadataData {
  title?: string;
  parentId?: DocumentId | null;
}

/**
 * DTO for updating note content.
 */
export interface UpdateNoteContentData {
  content: unknown; // Tiptap JSON
}

/**
 * DTO for creating a tag.
 */
export interface CreateTagData {
  name: string;
}

/**
 * DTO for updating a tag.
 */
export interface UpdateTagData {
  name?: string;
}

/**
 * DTO for creating a project.
 */
export interface CreateProjectData {
  name: string;
}

/**
 * DTO for updating a project.
 */
export interface UpdateProjectData {
  name?: string;
}

/**
 * DTO for creating a reminder.
 */
export interface CreateReminderData {
  noteId?: DocumentId | null;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  doDate?: Date | null;
}

/**
 * DTO for updating a reminder.
 */
export interface UpdateReminderData {
  title?: string;
  description?: string | null;
  dueDate?: Date | null;
  doDate?: Date | null;
  completed?: boolean;
}

/**
 * DTO for creating a timer.
 */
export interface CreateTimerData {
  noteId?: DocumentId | null;
  name?: string | null;
  duration?: number | null;
  timerType?: 'countdown' | 'countup';
}

/**
 * DTO for updating a timer.
 */
export interface UpdateTimerData {
  name?: string | null;
  duration?: number | null;
  startedAt?: Date | null;
  pausedAt?: Date | null;
  elapsedSeconds?: number;
}

/**
 * DTO for creating an alarm.
 */
export interface CreateAlarmData {
  noteId?: DocumentId | null;
  title: string;
  alarmTime: Date;
  recurring?: RecurrencePattern | null;
  enabled?: boolean;
}

/**
 * DTO for updating an alarm.
 */
export interface UpdateAlarmData {
  title?: string;
  alarmTime?: Date;
  recurring?: RecurrencePattern | null;
  enabled?: boolean;
}

/**
 * DTO for creating a calendar event.
 */
export interface CreateCalendarEventData {
  title: string;
  description?: string | null;
  eventDate: Date;
  endDate?: Date | null;
  eventType: 'one-time' | 'recurring' | 'all-day';
  recurrencePattern?: RecurrencePattern;
  location?: string | null;
  reminderId?: ReminderId | null;
}

/**
 * DTO for updating a calendar event.
 */
export interface UpdateCalendarEventData {
  title?: string;
  description?: string | null;
  eventDate?: Date;
  endDate?: Date | null;
  eventType?: 'one-time' | 'recurring' | 'all-day';
  recurrencePattern?: RecurrencePattern;
  location?: string | null;
  reminderId?: ReminderId | null;
}

/**
 * DTO for creating a todo.
 */
export interface CreateTodoData {
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  doDate?: Date | null;
  priority?: TodoPriority;
  noteId?: DocumentId | null;
}

/**
 * DTO for updating a todo.
 */
export interface UpdateTodoData {
  title?: string;
  description?: string | null;
  dueDate?: Date | null;
  doDate?: Date | null;
  completed?: boolean;
  priority?: TodoPriority;
}

/**
 * DTO for creating a branch.
 */
export interface CreateBranchData {
  noteId: DocumentId;
  parentBranchId?: BranchId | null;
  branchPoint?: string | null;
  branchName: string;
  description?: string | null;
}

/**
 * DTO for updating a branch.
 */
export interface UpdateBranchData {
  branchName?: string;
  description?: string | null;
}

/**
 * DTO for creating a version.
 */
export interface CreateVersionData {
  noteId: DocumentId;
  contentSnapshot: string;
  snapshotType?: 'full' | 'delta';
  parentVersionId?: number | null;
  description?: string | null;
}

