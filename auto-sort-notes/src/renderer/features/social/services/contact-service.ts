/**
 * Contact Service
 * 
 * Purpose: Business logic for contact operations.
 * 
 * Last Updated: 2024
 * Status: Active - Complete service implementation
 */

// Comment 401: Contact Service - Contact Business Logic
// This service handles all business logic for contact operations.
// Coordinates between presentation layer and storage layer.
//
// Intended Interactions:
// - Called by: ContactList, ContactDetail, ContactEditor components
// - Calls: contact-storage.ts (Comment 402) for data persistence
// - Provides: CRUD operations, filtering, sorting
//
// Logic Flow:
// 1. Component calls service method
// 2. Service validates input
// 3. Service calls storage layer
// 4. Service returns Result<T, E> to component
//
// Related Comments:
// - Comment 402 (contact-storage.ts - storage used by this service)

import { contactStorage } from '../storage/contact-storage';
import { Contact, ContactEntry, ContactFilter, ContactEntryType } from '../types';
import { Result } from '../../../shared/types/result.types';

export const contactService = {
  async createContact(
    firstName: string,
    lastName: string,
    photo?: string,
    nickname?: string,
    displayCustomName: boolean = false
  ): Promise<Result<Contact, Error>> {
    if (!firstName.trim() || !lastName.trim()) {
      return { ok: false, error: new Error('First name and last name are required.') };
    }

    return contactStorage.createContact({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      photo,
      nickname: nickname?.trim(),
      displayCustomName,
      quickViewFields: [],
      entries: [],
      tags: [],
    });
  },

  async getContact(id: string): Promise<Result<Contact | undefined, Error>> {
    return contactStorage.getContact(id);
  },

  async getAllContacts(filter?: ContactFilter): Promise<Result<Contact[], Error>> {
    const result = await contactStorage.getAllContacts();
    if (!result.ok) return result;

    let contacts = result.value;

    // Apply filters
    if (filter) {
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        contacts = contacts.filter(contact => {
          const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
          const displayName = contact.displayCustomName && contact.nickname
            ? contact.nickname.toLowerCase()
            : fullName;
          return displayName.includes(query) ||
                 fullName.includes(query) ||
                 contact.nickname?.toLowerCase().includes(query);
        });
      }

      if (filter.tags && filter.tags.length > 0) {
        contacts = contacts.filter(contact =>
          contact.tags?.some(tag => filter.tags!.includes(tag))
        );
      }

      if (filter.hasPhoto !== undefined) {
        contacts = contacts.filter(contact => (!!contact.photo) === filter.hasPhoto);
      }
    }

    // Sort by display name
    contacts.sort((a, b) => {
      const nameA = a.displayCustomName && a.nickname ? a.nickname : `${a.firstName} ${a.lastName}`;
      const nameB = b.displayCustomName && b.nickname ? b.nickname : `${b.firstName} ${b.lastName}`;
      return nameA.localeCompare(nameB);
    });

    return { ok: true, value: contacts };
  },

  async updateContact(id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>): Promise<Result<Contact, Error>> {
    return contactStorage.updateContact(id, updates);
  },

  async deleteContact(id: string): Promise<Result<void, Error>> {
    return contactStorage.deleteContact(id);
  },

  async addContactEntry(
    contactId: string,
    type: ContactEntryType,
    title: string,
    content: string,
    customDate?: Date
  ): Promise<Result<ContactEntry, Error>> {
    if (!title.trim() || !content.trim()) {
      return { ok: false, error: new Error('Title and content are required.') };
    }

    return contactStorage.addContactEntry(contactId, {
      type,
      title: title.trim(),
      content: content.trim(),
      dateEntered: new Date(),
      customDate,
    });
  },

  async updateContactEntry(
    contactId: string,
    entryId: string,
    updates: Partial<Omit<ContactEntry, 'id' | 'contactId' | 'createdAt'>>
  ): Promise<Result<ContactEntry, Error>> {
    return contactStorage.updateContactEntry(contactId, entryId, updates);
  },

  async deleteContactEntry(contactId: string, entryId: string): Promise<Result<void, Error>> {
    return contactStorage.deleteContactEntry(contactId, entryId);
  },

  // Get entries for a contact, sorted chronologically
  getContactEntries(contact: Contact, sortBy: 'dateEntered' | 'customDate' = 'customDate'): ContactEntry[] {
    const entries = [...contact.entries];
    
    entries.sort((a, b) => {
      const dateA = sortBy === 'customDate' && a.customDate ? a.customDate : a.dateEntered;
      const dateB = sortBy === 'customDate' && b.customDate ? b.customDate : b.dateEntered;
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });

    return entries;
  },

  // Get entries filtered by type
  getContactEntriesByType(contact: Contact, type: ContactEntryType): ContactEntry[] {
    return this.getContactEntries(contact).filter(entry => entry.type === type);
  },

  // Import multiple contacts
  async importContacts(contacts: Contact[]): Promise<Result<Contact[], Error>> {
    if (!contacts || contacts.length === 0) {
      return { ok: false, error: new Error('No contacts to import.') };
    }

    const importedContacts: Contact[] = [];
    const errors: Error[] = [];

    for (const contact of contacts) {
      // Validate required fields
      if (!contact.firstName?.trim() || !contact.lastName?.trim()) {
        errors.push(new Error(`Skipping contact: Missing first or last name`));
        continue;
      }

      // Create contact using storage layer directly
      const result = await contactStorage.createContact({
        firstName: contact.firstName.trim(),
        lastName: contact.lastName.trim(),
        middleName: contact.middleName,
        phoneticFirstName: contact.phoneticFirstName,
        phoneticMiddleName: contact.phoneticMiddleName,
        phoneticLastName: contact.phoneticLastName,
        namePrefix: contact.namePrefix,
        nameSuffix: contact.nameSuffix,
        nickname: contact.nickname,
        displayCustomName: contact.displayCustomName,
        photo: contact.photo,
        organizationName: contact.organizationName,
        organizationTitle: contact.organizationTitle,
        organizationDepartment: contact.organizationDepartment,
        birthday: contact.birthday,
        notes: contact.notes,
        labels: contact.labels,
        emails: contact.emails,
        phones: contact.phones,
        addresses: contact.addresses,
        relationships: contact.relationships,
        websites: contact.websites,
        events: contact.events,
        customFields: contact.customFields,
        quickViewFields: contact.quickViewFields || [],
        entries: contact.entries || [],
        tags: contact.tags || [],
      });

      if (result.ok && result.value) {
        importedContacts.push(result.value);
      } else {
        errors.push(result.error || new Error(`Failed to import ${contact.firstName} ${contact.lastName}`));
      }
    }

    if (importedContacts.length === 0 && errors.length > 0) {
      return { ok: false, error: new Error(`Failed to import contacts: ${errors[0].message}`) };
    }

    return { ok: true, value: importedContacts };
  },
};

