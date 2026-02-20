/**
 * useContactList Hook
 * 
 * Purpose: React hook for contact list operations.
 * 
 * Last Updated: 2024
 * Status: Active - Complete hook implementation
 */

// Comment 404: useContactList Hook - Contact List Operations
// This hook provides React-friendly interface for contact list operations.
// Wraps contact-service.ts methods for listing and filtering contacts.
//
// Intended Interactions:
// - Used by: ContactList component
// - Uses: contact-service.ts (Comment 401) for business logic
//
// Related Comments:
// - Comment 401 (contact-service.ts - service used by this hook)

import { useState, useCallback, useEffect, useRef } from 'react';
import { contactService } from '../services/contact-service';
import { Contact, ContactFilter } from '../types';
import { Result } from '../../../shared/types/result.types';

export function useContactList(filter?: ContactFilter) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const filterRef = useRef(filter);

  // Update filter ref when filter changes
  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  const loadContacts = useCallback(async (newFilter?: ContactFilter) => {
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.getAllContacts(newFilter || filterRef.current);
      if (result.ok) {
        setContacts(result.value);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load contacts');
      setError(error);
      return { ok: false, error } as Result<Contact[], Error>;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load contacts on mount and when filter changes
  useEffect(() => {
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter?.searchQuery, filter?.tags?.join(','), filter?.hasPhoto]);

  return {
    contacts,
    loading,
    error,
    loadContacts,
  };
}

