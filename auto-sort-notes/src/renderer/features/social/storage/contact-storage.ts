/**
 * Contact Storage
 * 
 * Purpose: Storage operations for contacts using localStorage.
 * 
 * Last Updated: 2024
 * Status: Active - Complete storage implementation
 */

// Comment 402: Contact Storage - Contact Data Persistence
// This module handles localStorage operations for contact data.
// Provides CRUD operations for contacts and their entries.
//
// Intended Interactions:
// - Called by: contact-service.ts (Comment 401)
// - Stores: Contact data in localStorage
//
// Logic Flow:
// 1. Service calls storage method
// 2. Storage reads/writes to localStorage
// 3. Handles data serialization/deserialization
// 4. Returns Result<T, E> to service layer
//
// Related Comments:
// - Comment 401 (contact-service.ts - service that calls this)

import { Contact, ContactEntry } from '../types';
import { Result } from '../../../shared/types/result.types';

const CONTACTS_STORAGE_KEY = 'social_contacts';

function getContactsFromLocalStorage(): Contact[] {
  const data = localStorage.getItem(CONTACTS_STORAGE_KEY);
  if (!data) return [];
  
  return JSON.parse(data).map((contact: any) => {
    // Parse dates
    let birthday: Date | string | undefined = contact.birthday;
    if (birthday) {
      try {
        const date = new Date(birthday);
        if (!isNaN(date.getTime())) {
          birthday = date;
        }
      } catch {
        // Keep as string if invalid
      }
    }
    
    // Parse events
    const events = contact.events?.map((event: any) => {
      let value: Date | string = event.value;
      if (value) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            value = date;
          }
        } catch {
          // Keep as string if invalid
        }
      }
      return { ...event, value };
    });
    
    return {
      ...contact,
      photo: contact.photo || undefined,
      birthday,
      events,
      entries: (contact.entries || []).map((entry: any) => ({
        ...entry,
        dateEntered: new Date(entry.dateEntered),
        customDate: entry.customDate ? new Date(entry.customDate) : undefined,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
      })),
      createdAt: new Date(contact.createdAt),
      updatedAt: new Date(contact.updatedAt),
    };
  });
}

function saveContactsToLocalStorage(contacts: Contact[]): void {
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
}

export const contactStorage = {
  async createContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Contact, Error>> {
    try {
      const contacts = getContactsFromLocalStorage();
      const newContact: Contact = {
        id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...contact,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      contacts.push(newContact);
      saveContactsToLocalStorage(contacts);
      return { ok: true, value: newContact };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  async getContact(id: string): Promise<Result<Contact | undefined, Error>> {
    try {
      const contacts = getContactsFromLocalStorage();
      return { ok: true, value: contacts.find(c => c.id === id) };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  async getAllContacts(): Promise<Result<Contact[], Error>> {
    try {
      return { ok: true, value: getContactsFromLocalStorage() };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  async updateContact(id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>): Promise<Result<Contact, Error>> {
    try {
      let contacts = getContactsFromLocalStorage();
      const index = contacts.findIndex(c => c.id === id);
      if (index === -1) {
        return { ok: false, error: new Error('Contact not found') };
      }
      const updatedContact = { ...contacts[index], ...updates, updatedAt: new Date() };
      contacts[index] = updatedContact;
      saveContactsToLocalStorage(contacts);
      return { ok: true, value: updatedContact };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  async deleteContact(id: string): Promise<Result<void, Error>> {
    try {
      let contacts = getContactsFromLocalStorage();
      contacts = contacts.filter(c => c.id !== id);
      saveContactsToLocalStorage(contacts);
      return { ok: true, value: undefined };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  async addContactEntry(contactId: string, entry: Omit<ContactEntry, 'id' | 'contactId' | 'createdAt' | 'updatedAt'>): Promise<Result<ContactEntry, Error>> {
    try {
      let contacts = getContactsFromLocalStorage();
      const contactIndex = contacts.findIndex(c => c.id === contactId);
      if (contactIndex === -1) {
        return { ok: false, error: new Error('Contact not found') };
      }

      const newEntry: ContactEntry = {
        id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        contactId,
        ...entry,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      contacts[contactIndex].entries.push(newEntry);
      contacts[contactIndex].updatedAt = new Date();
      saveContactsToLocalStorage(contacts);
      return { ok: true, value: newEntry };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  async updateContactEntry(contactId: string, entryId: string, updates: Partial<Omit<ContactEntry, 'id' | 'contactId' | 'createdAt'>>): Promise<Result<ContactEntry, Error>> {
    try {
      let contacts = getContactsFromLocalStorage();
      const contactIndex = contacts.findIndex(c => c.id === contactId);
      if (contactIndex === -1) {
        return { ok: false, error: new Error('Contact not found') };
      }

      const entryIndex = contacts[contactIndex].entries.findIndex(e => e.id === entryId);
      if (entryIndex === -1) {
        return { ok: false, error: new Error('Entry not found') };
      }

      const updatedEntry = { ...contacts[contactIndex].entries[entryIndex], ...updates, updatedAt: new Date() };
      contacts[contactIndex].entries[entryIndex] = updatedEntry;
      contacts[contactIndex].updatedAt = new Date();
      saveContactsToLocalStorage(contacts);
      return { ok: true, value: updatedEntry };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  async deleteContactEntry(contactId: string, entryId: string): Promise<Result<void, Error>> {
    try {
      let contacts = getContactsFromLocalStorage();
      const contactIndex = contacts.findIndex(c => c.id === contactId);
      if (contactIndex === -1) {
        return { ok: false, error: new Error('Contact not found') };
      }

      contacts[contactIndex].entries = contacts[contactIndex].entries.filter(e => e.id !== entryId);
      contacts[contactIndex].updatedAt = new Date();
      saveContactsToLocalStorage(contacts);
      return { ok: true, value: undefined };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },
};

