/**
 * Social Hub Component
 * 
 * Purpose: Main component for Social Hub feature.
 * Manages contact list and contact detail views.
 * 
 * Last Updated: 2024
 * Status: Active - Complete Social Hub implementation
 */

// Comment 409: Social Hub Component - Main Social Hub Interface
// This component provides the main interface for the Social Hub feature.
// Displays contact list and manages navigation to contact detail pages.
//
// Intended Interactions:
// - Uses: ContactList component (Comment 405)
// - Uses: ContactDetail component (Comment 406)
// - Uses: ContactEditor component (Comment 407)
// - Main component for Social Hub feature
//
// Related Comments:
// - Comment 405 (ContactList.tsx - contact list component)
// - Comment 406 (ContactDetail.tsx - contact detail component)
// - Comment 407 (ContactEditor.tsx - contact editor component)

import { useState, useRef, useEffect } from 'react';
import { MenuBar } from '../../../shared/components/MenuBar';
import { ContactList, ContactListRef } from './ContactList';
import { ContactDetail } from './ContactDetail';
import { ContactEditor } from './ContactEditor';
import { ContactImportDialog } from './ContactImportDialog';
import { DeleteAllContactsDialog } from './DeleteAllContactsDialog';
import { Contact } from '../types';
import { contactService } from '../services/contact-service';

type ViewType = 'list' | 'detail';

export const SocialHub = () => {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
  const [showContactEditor, setShowContactEditor] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [contactCount, setContactCount] = useState(0);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);
  const [contactReloadKey, setContactReloadKey] = useState(0);
  const contactListRef = useRef<ContactListRef | null>(null);

  // Get contact count for delete all dialog
  useEffect(() => {
    const updateContactCount = async () => {
      const result = await contactService.getAllContacts();
      if (result.ok) {
        setContactCount(result.value.length);
      }
    };
    updateContactCount();
  }, [showDeleteAllDialog, showImportDialog, showContactEditor]);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedContact(undefined);
  };

  const handleNewContact = () => {
    setEditingContact(undefined);
    setShowContactEditor(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowContactEditor(true);
  };

  const handleSaveContact = (contact: Contact) => {
    setShowContactEditor(false);
    setEditingContact(undefined);
    // If we're viewing this contact, update it and trigger reload
    if (selectedContact?.id === contact.id) {
      setSelectedContact(contact);
      setContactReloadKey(prev => prev + 1); // Force ContactDetail to reload
    }
    // Refresh contact list if available
    if (contactListRef.current) {
      contactListRef.current.refresh();
    }
    // Update contact count
    contactService.getAllContacts().then(result => {
      if (result.ok) {
        setContactCount(result.value.length);
      }
    });
  };

  const handleImportContacts = () => {
    setShowImportDialog(true);
  };

  const handleImportComplete = () => {
    setShowImportDialog(false);
    // Refresh contact list if available
    if (contactListRef.current) {
      contactListRef.current.refresh();
    }
    // Update contact count
    contactService.getAllContacts().then(result => {
      if (result.ok) {
        setContactCount(result.value.length);
      }
    });
  };

  const handleDeleteAllContacts = async () => {
    const result = await contactService.deleteAllContacts();
    if (result.ok) {
      // Clear selected contact if viewing one
      setSelectedContact(undefined);
      setCurrentView('list');
      // Refresh contact list
      if (contactListRef.current) {
        contactListRef.current.refresh();
      }
      // Update contact count
      setContactCount(0);
    } else {
      alert(`Error deleting contacts: ${result.error.message}`);
    }
  };

  // Menu Bar Items
  const menuItems = [
    {
      id: 'file',
      label: 'File',
      items: [
        {
          id: 'new-contact',
          label: 'New Contact...',
          shortcut: 'Ctrl+N',
          onClick: handleNewContact,
        },
        {
          id: 'import-contacts',
          label: 'Import Contacts...',
          shortcut: 'Ctrl+I',
          onClick: handleImportContacts,
        },
        {
          id: 'separator-1',
          label: '',
          separator: true,
        },
        {
          id: 'delete-all-contacts',
          label: 'Delete All Contacts...',
          onClick: () => setShowDeleteAllDialog(true),
        },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        {
          id: 'edit-contact',
          label: 'Edit Contact...',
          shortcut: 'Ctrl+E',
          onClick: () => {
            if (selectedContact) {
              handleEditContact(selectedContact);
            }
          },
          disabled: !selectedContact,
        },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        {
          id: 'back-to-list',
          label: 'Back to List',
          onClick: handleBackToList,
          disabled: currentView === 'list',
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <MenuBar items={menuItems} />
      <div className="flex-1 p-6 overflow-auto" style={{ paddingRight: '16px' }}>
        {currentView === 'list' ? (
          <ContactList
            ref={contactListRef}
            onSelectContact={handleSelectContact}
            onNewContact={handleNewContact}
          />
        ) : selectedContact ? (
          <ContactDetail
            key={`${selectedContact.id}-${contactReloadKey}`}
            contactId={selectedContact.id}
            onBack={handleBackToList}
            onEdit={handleEditContact}
            onContactUpdated={(updatedContact) => {
              setSelectedContact(updatedContact);
            }}
          />
        ) : null}
      </div>

      {/* Contact Editor Modal */}
      {showContactEditor && (
        <ContactEditor
          contact={editingContact}
          onSave={handleSaveContact}
          onCancel={() => {
            setShowContactEditor(false);
            setEditingContact(undefined);
          }}
          onClose={() => {
            setShowContactEditor(false);
            setEditingContact(undefined);
          }}
        />
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <ContactImportDialog
          onImport={async (contactsToImport) => {
            const result = await contactService.importContacts(contactsToImport);
            if (result.ok) {
              handleImportComplete();
              // Refresh contact list if available
              if (contactListRef.current) {
                contactListRef.current.refresh();
              }
            } else {
              alert(`Error importing contacts: ${result.error.message}`);
            }
          }}
          onCancel={handleImportComplete}
          onClose={handleImportComplete}
        />
      )}

      {/* Delete All Contacts Dialog */}
      {showDeleteAllDialog && (
        <DeleteAllContactsDialog
          contactCount={contactCount}
          onConfirm={handleDeleteAllContacts}
          onCancel={() => setShowDeleteAllDialog(false)}
          onClose={() => setShowDeleteAllDialog(false)}
        />
      )}
    </div>
  );
};

