/**
 * Contact Export Dialog Component
 * 
 * Purpose: Dialog for exporting contacts to standard formats (vCard).
 * Allows users to select which fields to include and edit information before export.
 * 
 * Last Updated: 2024
 * Status: Active - Complete export dialog
 */

// Comment 411: Contact Export Dialog - Contact Export Interface
// This component provides a dialog for exporting contacts to standard formats.
// Users can select which fields to include and edit information before export.
//
// Intended Interactions:
// - Used by: ContactDetail component (Comment 406)
// - Allows: Field selection, information editing, vCard export
//
// Related Comments:
// - Comment 406 (ContactDetail.tsx - parent component)
// - Comment 412 (contact-export-service.ts - export service)

import { useState, useEffect } from 'react';
import { X, Save, Download } from 'lucide-react';
import { Contact, QuickViewField } from '../types';

interface ContactExportDialogProps {
  contact: Contact;
  onExport: (exportData: ContactExportData, format: 'vcard' | 'csv') => void;
  onCancel: () => void;
  onClose: () => void;
}

export interface ContactExportData {
  firstName: string;
  lastName: string;
  nickname?: string;
  photo?: string;
  email?: string;
  phone?: string;
  organization?: string;
  title?: string;
  website?: string;
  address?: string;
  notes?: string;
  birthday?: Date;
  [key: string]: any; // Allow additional custom fields
}

interface ExportField {
  id: string;
  label: string;
  value: any;
  type: 'text' | 'date' | 'textarea' | 'url' | 'email' | 'phone';
  included: boolean;
}

export const ContactExportDialog = ({ contact, onExport, onCancel, onClose }: ContactExportDialogProps) => {
  const [fields, setFields] = useState<ExportField[]>([]);
  const [fileFormat, setFileFormat] = useState<'vcard' | 'csv'>('vcard');

  useEffect(() => {
    // Initialize fields from contact data
    const initialFields: ExportField[] = [
      { id: 'firstName', label: 'First Name', value: contact.firstName, type: 'text', included: true },
      { id: 'lastName', label: 'Last Name', value: contact.lastName, type: 'text', included: true },
      { id: 'nickname', label: 'Nickname', value: contact.nickname || '', type: 'text', included: !!contact.nickname },
      { id: 'photo', label: 'Photo', value: contact.photo || '', type: 'url', included: !!contact.photo },
      { id: 'email', label: 'Email', value: '', type: 'email', included: false },
      { id: 'phone', label: 'Phone', value: '', type: 'phone', included: false },
      { id: 'organization', label: 'Organization', value: '', type: 'text', included: false },
      { id: 'title', label: 'Title', value: '', type: 'text', included: false },
      { id: 'website', label: 'Website', value: '', type: 'url', included: false },
      { id: 'address', label: 'Address', value: '', type: 'textarea', included: false },
      { id: 'notes', label: 'Notes', value: '', type: 'textarea', included: false },
      { id: 'birthday', label: 'Birthday', value: '', type: 'date', included: false },
    ];

    // Populate from quick-view fields if available
    contact.quickViewFields.forEach((field) => {
      const existingField = initialFields.find(f => f.id === field.fieldId);
      if (existingField) {
        existingField.value = field.value instanceof Date 
          ? formatDateForInput(field.value) 
          : (field.value?.toString() || '');
        existingField.included = true;
      } else {
        // Add custom field
        initialFields.push({
          id: field.fieldId,
          label: field.label,
          value: field.value instanceof Date 
            ? formatDateForInput(field.value) 
            : (field.value?.toString() || ''),
          type: field.value instanceof Date ? 'date' : 'text',
          included: true,
        });
      }
    });

    setFields(initialFields);
  }, [contact]);

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleFieldToggle = (fieldId: string) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, included: !field.included } : field
    ));
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, value } : field
    ));
  };

  const handleExport = () => {
    const exportData: ContactExportData = {};
    
    fields.forEach(field => {
      if (field.included && field.value) {
        if (field.type === 'date') {
          exportData[field.id] = new Date(field.value);
        } else {
          exportData[field.id] = field.value;
        }
      }
    });

    onExport(exportData, fileFormat);
    onClose();
  };

  const includedFields = fields.filter(f => f.included);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div
        className="bg-background border border-border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto m-4"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Create {fileFormat === 'vcard' ? 'vCard' : 'CSV'} for this contact
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
              Use the checkboxes to add/ remove information fields that will be added to this contact file, or edit the information in the contact file without editing the locally saved version.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded hover:bg-muted transition-colors"
            style={{ color: 'var(--color-foreground)' }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-foreground)' }}>
            Export Format
          </label>
          <select
            value={fileFormat}
            onChange={(e) => setFileFormat(e.target.value as 'vcard' | 'csv')}
            className="px-3 py-2 rounded border"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          >
            <option value="vcard">vCard (.vcf)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
        </div>

        {/* Fields List */}
        <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
          {fields.map((field) => (
            <div key={field.id} className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={field.included}
                onChange={() => handleFieldToggle(field.id)}
                className="mt-1 w-4 h-4"
              />
              <div className="flex-1">
                <label className="text-sm font-medium block mb-1" style={{ color: 'var(--color-foreground)' }}>
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={field.value || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    disabled={!field.included}
                    rows={3}
                    className="w-full px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)',
                    }}
                  />
                ) : (
                  <input
                    type={field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : field.type === 'phone' ? 'tel' : 'text'}
                    value={field.value || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    disabled={!field.included}
                    className="w-full px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)',
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 pb-4 px-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded transition-colors"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-foreground)',
              border: '1px solid var(--color-border)',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={includedFields.length === 0}
            className="px-4 py-2 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
              border: 'none',
            }}
          >
            <Download className="w-4 h-4" />
            Export {fileFormat === 'vcard' ? 'vCard' : 'CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};

