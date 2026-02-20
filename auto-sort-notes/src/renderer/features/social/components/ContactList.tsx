/**
 * Contact List Component
 * 
 * Purpose: Displays list of contacts with photos and names.
 * 
 * Last Updated: 2024
 * Status: Active - Complete contact list
 */

// Comment 405: Contact List Component - Contact List Display
// This component displays a list of contacts with their photos and display names.
// Users can click on a contact to navigate to their detail page.
//
// Intended Interactions:
// - Used by: SocialHub component (Comment 409)
// - Uses: useContactList hook (Comment 404) for contact operations
// - Displays: Contact photos, names (or custom names), click to view details
//
// Related Comments:
// - Comment 404 (useContactList.ts - hook used by this component)
// - Comment 409 (SocialHub.tsx - parent component)

import { useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { User, Search, Plus, Upload } from 'lucide-react';
import { useContactList } from '../hooks/useContactList';
import { Contact, ContactFilter } from '../types';
import { clsx } from 'clsx';
import { ContactImportDialog } from './ContactImportDialog';
import { contactService } from '../services/contact-service';

interface ContactListProps {
  onSelectContact: (contact: Contact) => void;
  onNewContact: () => void;
  onImportContacts?: () => void;
}

export interface ContactListRef {
  refresh: () => void;
}

export const ContactList = forwardRef<ContactListRef, ContactListProps>(({ onSelectContact, onNewContact, onImportContacts }, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const filter = useMemo<ContactFilter>(() => ({ searchQuery }), [searchQuery]);
  const { contacts, loading, error, loadContacts } = useContactList(filter);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      loadContacts(filter);
    },
  }), [loadContacts, filter]);

  const getDisplayName = (contact: Contact): string => {
    if (contact.displayCustomName && contact.nickname) {
      return contact.nickname;
    }
    return `${contact.firstName} ${contact.lastName}`;
  };

  // Get contact type display text
  const getContactTypeDisplay = (contact: Contact): string[] => {
    if (!contact.contactType || !contact.contactTypeData) {
      return [];
    }

    const displayParts: string[] = [contact.contactType];
    const { categories } = contact.contactTypeData;

    // Build display from categories
    categories.forEach(category => {
      if (category.value) {
        if (category.isTextInput) {
          // Text input - show the value directly
          displayParts.push(category.value);
        } else {
          // Dropdown - find the label for the selected value
          const selectedValue = category.values?.find(v => v.id === category.value);
          if (selectedValue) {
            displayParts.push(selectedValue.label);
            
            // Add sub-value if selected
            if (category.subValue) {
              const selectedSubValue = selectedValue.subValues?.find(sv => sv.id === category.subValue);
              if (selectedSubValue) {
                displayParts.push(selectedSubValue.label);
              }
            }
          }
        }
      }
    });

    return displayParts;
  };

  // Format time period display
  const formatTimePeriod = (contact: Contact): string => {
    if (!contact.contactTypeData?.timePeriod) return '';
    const { start, end } = contact.contactTypeData.timePeriod;
    if (!start && !end) return '';
    return `${start || ''}${start && end ? ' - ' : ''}${end || ''}`;
  };

  if (loading) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-muted-foreground)' }}>
        Loading contacts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-error)' }}>
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search and New Contact */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-muted-foreground)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="flex-1 min-w-0 bg-transparent border-0 outline-none"
              style={{
                color: 'var(--color-foreground)',
              }}
            />
          </div>
        </div>
        <button
          onClick={() => setShowImportDialog(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-foreground)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
          }}
        >
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </button>
        <button
          onClick={onNewContact}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '1';
          }}
        >
          <Plus className="w-4 h-4" />
          <span>New Contact</span>
        </button>
      </div>

      {/* Contact List */}
      {contacts.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--color-muted-foreground)' }}>
          <User className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: 'var(--color-muted-foreground)' }} />
          <p className="text-lg mb-2">No contacts yet</p>
          <p className="text-sm">Click "New Contact" to add your first contact</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-auto">
          {contacts.map((contact) => {
            const typeDisplay = getContactTypeDisplay(contact);
            const timePeriod = formatTimePeriod(contact);
            const geographicArea = contact.contactTypeData?.geographicArea;

            return (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className="w-full flex items-center gap-4 p-3 rounded-lg border transition-colors text-left"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
                }}
              >
                {/* Photo - Standardized size */}
                <div className="flex-shrink-0">
                  {contact.photo ? (
                    <img
                      src={contact.photo}
                      alt={getDisplayName(contact)}
                      className="w-16 h-16 rounded-full object-cover border-2"
                      style={{ 
                        borderColor: 'var(--color-border)',
                        width: '64px',
                        height: '64px',
                        minWidth: '64px',
                        minHeight: '64px',
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-full flex items-center justify-center border-2"
                      style={{
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-muted)',
                        width: '64px',
                        height: '64px',
                        minWidth: '64px',
                        minHeight: '64px',
                      }}
                    >
                      <User className="w-8 h-8" style={{ color: 'var(--color-muted-foreground)' }} />
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate" style={{ color: 'var(--color-foreground)' }}>
                    {getDisplayName(contact)}
                  </div>
                  {typeDisplay.length > 0 && (
                    <div className="text-sm truncate" style={{ color: 'var(--color-muted-foreground)' }}>
                      {typeDisplay.join(', ')}
                    </div>
                  )}
                  {(geographicArea || timePeriod) && (
                    <div className="text-xs truncate" style={{ color: 'var(--color-muted-foreground)' }}>
                      {geographicArea && timePeriod 
                        ? `${geographicArea} - ${timePeriod}`
                        : geographicArea || timePeriod}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <ContactImportDialog
          onImport={async (contactsToImport) => {
            const result = await contactService.importContacts(contactsToImport);
            if (result.ok) {
              loadContacts(filter);
              if (onImportContacts) {
                onImportContacts();
              }
            } else {
              alert(`Error importing contacts: ${result.error.message}`);
            }
          }}
          onCancel={() => setShowImportDialog(false)}
          onClose={() => setShowImportDialog(false)}
        />
      )}
    </div>
  );
});

