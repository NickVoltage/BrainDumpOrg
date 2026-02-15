/**
 * Tiptap Types
 * 
 * Purpose: TypeScript types for Tiptap rich text editor.
 * Defines the JSON structure used for storing note content.
 * 
 * Last Updated: 2024
 * Status: Placeholder - Ready for implementation
 */

// Comment 012: Tiptap Types
// This file defines TypeScript types for Tiptap rich text editor JSON format.
// Tiptap JSON is the content format used for storing note content.
//
// Intended Interactions:
// - Used by: Note editor components (NoteEditor.tsx)
// - Used by: Note file storage (note-file-storage.ts)
// - Used by: File import/export services
// - Provides: Type safety for Tiptap JSON content
//
// Logic Flow:
// 1. User edits content in Tiptap editor
// 2. Editor generates Tiptap JSON
// 3. JSON is stored in file system
// 4. JSON is loaded and rendered in editor
//
// Dependencies:
// - Tiptap library types (when installed)
// - TypeScript type system
//
// Related Files:
// - src/renderer/features/notes/components/NoteEditor.tsx (Tiptap editor)
// - src/renderer/features/notes/storage/note-file-storage.ts (content storage)
// - src/renderer/features/file-import/services/* (file conversion to Tiptap JSON)
//
// Related Comments:
// - Comment 013 (NoteEditor.tsx - Tiptap editor component)
// - Comment 011 (note-file-storage.ts - Tiptap JSON storage)
// - Comment 800 (file-import-service.ts - file conversion)

/**
 * Tiptap JSON content type.
 * This is the format used for storing note content in the file system.
 * 
 * Structure:
 * {
 *   type: "doc",
 *   content: [
 *     {
 *       type: "paragraph",
 *       content: [...]
 *     }
 *   ]
 * }
 */
export type TiptapJSON = {
  type: string;
  content?: TiptapJSON[];
  attrs?: Record<string, unknown>;
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
  text?: string;
};

/**
 * Tiptap editor extensions configuration.
 */
export interface TiptapExtensions {
  // Placeholder for Tiptap extension configuration
  // Will be defined when Tiptap is integrated
}

/**
 * Tiptap editor state.
 */
export interface TiptapEditorState {
  content: TiptapJSON | null;
  isDirty: boolean;
  lastSaved: Date | null;
}

