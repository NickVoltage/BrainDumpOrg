/**
 * Contact Import Dialog Component
 * 
 * Purpose: Dialog for importing contacts from CSV files.
 * 
 * Last Updated: 2024
 * Status: Active - Contact import functionality
 */

import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { parseGoogleCSV } from '../services/contact-csv-service';
import { Contact } from '../types';

interface ContactImportDialogProps {
  onImport: (contacts: Contact[]) => void;
  onCancel: () => void;
  onClose: () => void;
}

export const ContactImportDialog = ({ onImport, onCancel, onClose }: ContactImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Contact[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
        setPreview(null);
        
        // Read and parse file for preview
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const csvContent = event.target?.result as string;
            const contacts = parseGoogleCSV(csvContent);
            setPreview(contacts);
            if (contacts.length === 0) {
              setError('No contacts found in CSV file.');
            }
          } catch (err) {
            setError(`Error parsing CSV: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setPreview(null);
          }
        };
        reader.onerror = () => {
          setError('Error reading file.');
          setPreview(null);
        };
        reader.readAsText(selectedFile);
      } else {
        setError('Please select a CSV file.');
        setFile(null);
        setPreview(null);
      }
    }
  };

  const handleImport = async () => {
    if (!file || !preview || preview.length === 0) {
      setError('Please select a valid CSV file with contacts.');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      onImport(preview);
      onClose();
    } catch (err) {
      setError(`Error importing contacts: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setImporting(false);
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCancelClick}>
      <div
        className="bg-background border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden m-4 flex flex-col"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
            Import Contacts
          </h2>
          <button
            onClick={handleCancelClick}
            className="p-1 rounded hover:bg-muted transition-colors"
            style={{ color: 'var(--color-foreground)' }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* File Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
              Select CSV File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csvFileInput"
            />
            <label
              htmlFor="csvFileInput"
              className="flex items-center gap-2 px-4 py-3 rounded border cursor-pointer transition-colors"
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
              <Upload className="w-5 h-5" />
              <span>{file ? file.name : 'Choose CSV file...'}</span>
            </label>
            {file && (
              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded border" style={{ borderColor: 'var(--color-error)', backgroundColor: 'var(--color-error)/10' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }} />
              <p className="text-sm" style={{ color: 'var(--color-error)' }}>
                {error}
              </p>
            </div>
          )}

          {/* Preview */}
          {preview && preview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  Found {preview.length} contact{preview.length !== 1 ? 's' : ''}
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto border rounded" style={{ borderColor: 'var(--color-border)' }}>
                <div className="p-3 space-y-2">
                  {preview.slice(0, 10).map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded"
                      style={{ backgroundColor: 'var(--color-muted)' }}
                    >
                      {contact.photo ? (
                        <img
                          src={contact.photo}
                          alt={`${contact.firstName} ${contact.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'var(--color-background)' }}
                        >
                          <FileText className="w-4 h-4" style={{ color: 'var(--color-muted-foreground)' }} />
                        </div>
                      )}
                      <span className="text-sm" style={{ color: 'var(--color-foreground)' }}>
                        {contact.firstName} {contact.lastName}
                        {contact.nickname && ` (${contact.nickname})`}
                      </span>
                    </div>
                  ))}
                  {preview.length > 10 && (
                    <p className="text-xs text-center pt-2" style={{ color: 'var(--color-muted-foreground)' }}>
                      ... and {preview.length - 10} more
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="p-3 rounded border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-muted)' }}>
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              <strong>Supported format:</strong> Google Contacts CSV format. The imported contacts will be added to your contact list.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t flex-shrink-0 p-4" style={{ borderColor: 'var(--color-border)' }}>
          <button
            type="button"
            onClick={handleCancelClick}
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
            onClick={handleImport}
            disabled={!file || !preview || preview.length === 0 || importing}
            className="px-4 py-2 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
              border: 'none',
            }}
          >
            <Upload className="w-4 h-4" />
            {importing ? 'Importing...' : `Import ${preview?.length || 0} Contact${(preview?.length || 0) !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

