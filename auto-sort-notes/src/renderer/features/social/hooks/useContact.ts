/**
 * useContact Hook
 * 
 * Purpose: React hook for individual contact operations.
 * 
 * Last Updated: 2024
 * Status: Active - Complete hook implementation
 */

// Comment 403: useContact Hook - Contact Operations
// This hook provides React-friendly interface for contact operations.
// Wraps contact-service.ts methods with React state management.
//
// Intended Interactions:
// - Used by: ContactDetail, ContactEditor components
// - Uses: contact-service.ts (Comment 401) for business logic
//
// Related Comments:
// - Comment 401 (contact-service.ts - service used by this hook)

import { useState, useCallback } from 'react';
import { contactService } from '../services/contact-service';
import { Contact, ContactEntry, ContactEntryType } from '../types';
import { Result } from '../../../shared/types/result.types';

export function useContact(initialContactId?: string) {
  const [contact, setContact] = useState<Contact | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadContact = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.getContact(id);
      if (result.ok) {
        setContact(result.value);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load contact');
      setError(error);
      return { ok: false, error } as Result<Contact | undefined, Error>;
    } finally {
      setLoading(false);
    }
  }, []);

  const createContact = useCallback(async (
    firstName: string,
    lastName: string,
    photo?: string,
    nickname?: string,
    displayCustomName: boolean = false
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.createContact(firstName, lastName, photo, nickname, displayCustomName);
      if (result.ok) {
        setContact(result.value);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create contact');
      setError(error);
      return { ok: false, error } as Result<Contact, Error>;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContact = useCallback(async (updates: Partial<Omit<Contact, 'id' | 'createdAt'>>) => {
    if (!contact) {
      setError(new Error('No contact selected for update.'));
      return { ok: false, error: new Error('No contact selected for update.') } as Result<Contact, Error>;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.updateContact(contact.id, updates);
      if (result.ok) {
        setContact(result.value);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update contact');
      setError(error);
      return { ok: false, error } as Result<Contact, Error>;
    } finally {
      setLoading(false);
    }
  }, [contact]);

  const deleteContact = useCallback(async () => {
    if (!contact) {
      setError(new Error('No contact selected for deletion.'));
      return { ok: false, error: new Error('No contact selected for deletion.') } as Result<void, Error>;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.deleteContact(contact.id);
      if (result.ok) {
        setContact(undefined);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete contact');
      setError(error);
      return { ok: false, error } as Result<void, Error>;
    } finally {
      setLoading(false);
    }
  }, [contact]);

  const addEntry = useCallback(async (
    type: ContactEntryType,
    title: string,
    content: string,
    customDate?: Date
  ) => {
    if (!contact) {
      setError(new Error('No contact selected.'));
      return { ok: false, error: new Error('No contact selected.') } as Result<ContactEntry, Error>;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.addContactEntry(contact.id, type, title, content, customDate);
      if (result.ok) {
        // Reload contact to get updated entries
        await loadContact(contact.id);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add entry');
      setError(error);
      return { ok: false, error } as Result<ContactEntry, Error>;
    } finally {
      setLoading(false);
    }
  }, [contact, loadContact]);

  const updateEntry = useCallback(async (
    entryId: string,
    updates: Partial<Omit<ContactEntry, 'id' | 'contactId' | 'createdAt'>>
  ) => {
    if (!contact) {
      setError(new Error('No contact selected.'));
      return { ok: false, error: new Error('No contact selected.') } as Result<ContactEntry, Error>;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.updateContactEntry(contact.id, entryId, updates);
      if (result.ok) {
        // Reload contact to get updated entries
        await loadContact(contact.id);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update entry');
      setError(error);
      return { ok: false, error } as Result<ContactEntry, Error>;
    } finally {
      setLoading(false);
    }
  }, [contact, loadContact]);

  const deleteEntry = useCallback(async (entryId: string) => {
    if (!contact) {
      setError(new Error('No contact selected.'));
      return { ok: false, error: new Error('No contact selected.') } as Result<void, Error>;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.deleteContactEntry(contact.id, entryId);
      if (result.ok) {
        // Reload contact to get updated entries
        await loadContact(contact.id);
      } else {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete entry');
      setError(error);
      return { ok: false, error } as Result<void, Error>;
    } finally {
      setLoading(false);
    }
  }, [contact, loadContact]);

  return {
    contact,
    loading,
    error,
    loadContact,
    createContact,
    updateContact,
    deleteContact,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}

