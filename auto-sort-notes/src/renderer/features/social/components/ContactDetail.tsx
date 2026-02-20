/**
 * Contact Detail Component
 * 
 * Purpose: Displays detailed information about a contact with quick-view and tabs.
 * 
 * Last Updated: 2024
 * Status: Active - Complete contact detail view
 */

// Comment 406: Contact Detail Component - Contact Information Display
// This component displays a contact's detailed information with:
// - Quick-view section (customizable fields with photo)
// - Tabbed interface for different information categories
// - Chronological entry display
//
// Intended Interactions:
// - Used by: SocialHub component (Comment 409)
// - Uses: useContact hook (Comment 403) for contact operations
// - Displays: Contact photo, quick-view fields, tabbed entries
//
// Related Comments:
// - Comment 403 (useContact.ts - hook used by this component)
// - Comment 409 (SocialHub.tsx - parent component)

import { useState, useEffect } from 'react';
import { Edit, User, Calendar, Briefcase, MessageSquare, Plus, FileText, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useContact } from '../hooks/useContact';
import { Contact, ContactEntryType, ContactEntry } from '../types';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { contactService } from '../services/contact-service';
import { EntryEditor } from './EntryEditor';
import { ContactExportDialog, ContactExportData } from './ContactExportDialog';
import { contactExportService } from '../services/contact-export-service';

interface ContactDetailProps {
  contactId: string;
  onBack: () => void;
  onEdit: (contact: Contact) => void;
  onContactUpdated?: (contact: Contact) => void;
}

type TabType = 'general' | 'social' | 'education' | 'interaction';

export const ContactDetail = ({ contactId, onBack, onEdit, onContactUpdated }: ContactDetailProps) => {
  const { contact, loading, error, loadContact, addEntry, updateEntry, deleteEntry } = useContact();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [showEntryEditor, setShowEntryEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ContactEntry | undefined>(undefined);
  const [isQuickViewExpanded, setIsQuickViewExpanded] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  useEffect(() => {
    if (contactId) {
      loadContact(contactId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  // Notify parent when contact is loaded/updated (only when contact data actually changes)
  useEffect(() => {
    if (contact && onContactUpdated) {
      onContactUpdated(contact);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact?.id, contact?.updatedAt?.getTime()]);

  if (loading) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-muted-foreground)' }}>
        Loading contact...
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-error)' }}>
        {error ? `Error: ${error.message}` : 'Contact not found'}
      </div>
    );
  }

  const getDisplayName = (): string => {
    if (contact.displayCustomName && contact.nickname) {
      return contact.nickname;
    }
    return `${contact.firstName} ${contact.lastName}`;
  };

  const getEntriesForTab = () => {
    if (activeTab === 'general') {
      return contactService.getContactEntries(contact);
    }
    return contactService.getContactEntriesByType(contact, activeTab as ContactEntryType);
  };

  const entries = getEntriesForTab();

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'general', label: 'General', icon: User },
    { id: 'social', label: 'Social', icon: MessageSquare },
    { id: 'education', label: 'EDU & Exp.', icon: Briefcase },
    { id: 'interaction', label: 'Interaction Journal', icon: Calendar },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Quick-View Section */}
      <div className="border rounded-lg p-6 mb-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
        <div className="flex items-start gap-6">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="transition-colors cursor-pointer text-lg leading-none flex items-center bg-transparent border-none outline-none flex-shrink-0"
            style={{ 
              padding: '4px 24px 4px 0',
              margin: 0,
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              color: 'var(--color-foreground)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '1';
            }}
            aria-label="Back to contacts"
          >
            &lt;
          </button>

          {/* Photo - Sized to match collapsed quick-view height (120px max-height + padding) */}
          <div className="flex-shrink-0" style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '0px' }}>
            {contact.photo ? (
              <img
                src={contact.photo}
                alt={getDisplayName()}
                className="rounded-full object-cover border-2"
                style={{ 
                  borderColor: 'var(--color-border)',
                  width: isQuickViewExpanded ? '96px' : '120px',
                  height: isQuickViewExpanded ? '96px' : '120px',
                  minWidth: isQuickViewExpanded ? '96px' : '120px',
                  minHeight: isQuickViewExpanded ? '96px' : '120px',
                }}
              />
            ) : (
              <div
                className="rounded-full flex items-center justify-center border-2"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-muted)',
                  width: isQuickViewExpanded ? '96px' : '120px',
                  height: isQuickViewExpanded ? '96px' : '120px',
                  minWidth: isQuickViewExpanded ? '96px' : '120px',
                  minHeight: isQuickViewExpanded ? '96px' : '120px',
                }}
              >
                <User className={isQuickViewExpanded ? 'w-12 h-12' : 'w-16 h-16'} style={{ color: 'var(--color-muted-foreground)' }} />
              </div>
            )}
          </div>

          {/* Quick-View Fields */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
                {getDisplayName()}
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowExportDialog(true)}
                  className="relative group flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors"
                  style={{ color: 'var(--color-primary)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                  title="You'll be prompted to add/ remove details before the export is created for total control over what's shared"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => onEdit(contact)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors"
                  style={{ color: 'var(--color-primary)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
            {contact.quickViewFields.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                No quick-view fields configured. Edit this contact to add fields to quick-view.
              </p>
            ) : (
              <>
                <div className={clsx('grid grid-cols-2 gap-4', !isQuickViewExpanded && 'overflow-hidden')} style={!isQuickViewExpanded ? { maxHeight: '120px' } : {}}>
                  {contact.quickViewFields
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((field) => (
                      <div key={field.fieldId}>
                        <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-muted-foreground)' }}>
                          {field.label}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--color-foreground)' }}>
                          {field.value instanceof Date
                            ? format(field.value, 'PPP')
                            : field.value?.toString() || '—'}
                        </div>
                      </div>
                    ))}
                </div>
                {contact.quickViewFields.length > 2 && (
                  <button
                    onClick={() => setIsQuickViewExpanded(!isQuickViewExpanded)}
                    className="flex items-center gap-1 mt-4 text-sm transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '1';
                    }}
                  >
                    {isQuickViewExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span>Show less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>Show more</span>
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-t transition-colors',
                isActive && 'border-t-2 border-l border-r'
              )}
              style={{
                backgroundColor: isActive ? 'var(--color-background)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                borderColor: isActive ? 'var(--color-border)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-foreground)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-muted-foreground)';
                }
              }}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
            Entries
          </h2>
          <button
            onClick={() => {
              setEditingEntry(undefined);
              setShowEntryEditor(true);
            }}
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
            <span>Add Entry</span>
          </button>
        </div>
        {entries.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--color-muted-foreground)' }}>
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No entries yet</p>
            <p className="text-sm mt-2">Add entries to track information about this contact</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="border rounded-lg p-4"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold" style={{ color: 'var(--color-foreground)' }}>
                      {entry.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                      <span>Entered: {format(entry.dateEntered, 'PPP')}</span>
                      {entry.customDate && (
                        <span>Date: {format(entry.customDate, 'PPP')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingEntry(entry);
                        setShowEntryEditor(true);
                      }}
                      className="p-1.5 rounded hover:bg-muted transition-colors"
                      style={{ color: 'var(--color-foreground)' }}
                      aria-label="Edit entry"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm mt-2" style={{ color: 'var(--color-foreground)' }}>
                  {entry.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Entry Editor Modal */}
      {showEntryEditor && (
        <EntryEditor
          entry={editingEntry}
          entryType={activeTab === 'general' ? undefined : (activeTab as ContactEntryType)}
          onSave={async (entryData) => {
            if (editingEntry) {
              const result = await updateEntry(editingEntry.id, entryData);
              if (result.ok) {
                setShowEntryEditor(false);
                setEditingEntry(undefined);
              }
            } else {
              const result = await addEntry(
                entryData.type,
                entryData.title,
                entryData.content,
                entryData.customDate
              );
              if (result.ok) {
                setShowEntryEditor(false);
                setEditingEntry(undefined);
              }
            }
          }}
          onCancel={() => {
            setShowEntryEditor(false);
            setEditingEntry(undefined);
          }}
          onClose={() => {
            setShowEntryEditor(false);
            setEditingEntry(undefined);
          }}
        />
      )}

      {/* Export Dialog */}
      {showExportDialog && contact && (
        <ContactExportDialog
          contact={contact}
          onExport={async (exportData: ContactExportData, format: 'vcard' | 'csv') => {
            const content = format === 'vcard' 
              ? contactExportService.generateVCard(exportData)
              : contactExportService.generateCSV(exportData);
            const filename = `${exportData.firstName || 'Contact'}_${exportData.lastName || 'Export'}.${format === 'vcard' ? 'vcf' : 'csv'}`;
            const mimeType = format === 'vcard' ? 'text/vcard' : 'text/csv';
            await contactExportService.downloadContactFile(content, filename, mimeType);
          }}
          onCancel={() => setShowExportDialog(false)}
          onClose={() => setShowExportDialog(false)}
        />
      )}
    </div>
  );
};

