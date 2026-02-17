/**
 * Note Selector Component
 * 
 * Purpose: Searchable dropdown/selector for selecting notes.
 * Used in reminder creation to optionally associate a reminder with a note.
 * 
 * Last Updated: 2024
 * Status: Active - Works with placeholder note service
 */

import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface Note {
  id: string;
  title: string;
}

interface NoteSelectorProps {
  value?: string; // Selected note ID
  onChange: (noteId: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const NoteSelector = ({ value, onChange, placeholder = 'Search for a note...', disabled = false }: NoteSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // TODO: Replace with actual note service call when notes feature is implemented
  // For now, this is a placeholder that returns empty results
  const fetchNotes = async (query: string) => {
    setLoading(true);
    try {
      // Placeholder: When notes feature is implemented, call:
      // const result = await noteService.searchNotes({ searchQuery: query });
      // if (result.ok) {
      //   setNotes(result.value);
      // }
      
      // For now, return empty array
      setNotes([]);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Load selected note when value changes
  useEffect(() => {
    if (value) {
      // TODO: When notes feature is implemented, fetch the note by ID:
      // const result = await noteService.getNote(value);
      // if (result.ok) {
      //   setSelectedNote(result.value);
      // }
      
      // For now, create a placeholder note object
      setSelectedNote({ id: value, title: `Note ${value}` });
    } else {
      setSelectedNote(null);
    }
  }, [value]);

  // Search when query changes
  useEffect(() => {
    if (isOpen && searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        fetchNotes(searchQuery);
      }, 300); // Debounce search
      return () => clearTimeout(timeoutId);
    } else if (isOpen) {
      // Load all notes when dropdown opens with no query
      fetchNotes('');
    }
  }, [searchQuery, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    onChange(note.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNote(null);
    onChange(undefined);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus search input when opening
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Selected Note Display / Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={clsx(
          'w-full flex items-center justify-between gap-2 px-3 py-2 rounded border transition-colors',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: disabled ? 'var(--color-muted)' : 'var(--color-background)',
          color: 'var(--color-foreground)',
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
          }
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedNote ? (
            <>
              <FileText className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
              <span className="truncate" style={{ color: 'var(--color-foreground)' }}>
                {selectedNote.title}
              </span>
            </>
          ) : (
            <span className="text-left" style={{ color: 'var(--color-muted-foreground)' }}>
              {placeholder}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {selectedNote && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-muted transition-colors"
              style={{ color: 'var(--color-foreground)' }}
              aria-label="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown
            className={clsx('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
            style={{ color: 'var(--color-muted-foreground)' }}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          className="absolute z-50 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-hidden"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-background)',
          }}
        >
          {/* Search Input */}
          <div className="p-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-muted-foreground)' }} />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="flex-1 min-w-0 bg-transparent border-0 outline-none"
                style={{
                  color: 'var(--color-foreground)',
                }}
              />
            </div>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto max-h-48">
            {loading ? (
              <div className="p-4 text-center" style={{ color: 'var(--color-muted-foreground)' }}>
                Loading notes...
              </div>
            ) : notes.length === 0 ? (
              <div className="p-4 text-center" style={{ color: 'var(--color-muted-foreground)' }}>
                {searchQuery ? 'No notes found' : 'No notes available'}
              </div>
            ) : (
              <div className="py-1">
                {notes.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => handleSelectNote(note)}
                    className={clsx(
                      'w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted transition-colors',
                      selectedNote?.id === note.id && 'bg-primary/10'
                    )}
                    style={{
                      backgroundColor: selectedNote?.id === note.id ? 'var(--color-primary)' : 'transparent',
                      color: selectedNote?.id === note.id ? 'var(--color-primary-foreground)' : 'var(--color-foreground)',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedNote?.id !== note.id) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedNote?.id !== note.id) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                    <span className="truncate">{note.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

