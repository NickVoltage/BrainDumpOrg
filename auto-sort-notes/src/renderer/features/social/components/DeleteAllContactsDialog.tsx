/**
 * Delete All Contacts Confirmation Dialog
 * 
 * Purpose: Confirmation dialog for deleting all contacts.
 * 
 * Last Updated: 2024
 * Status: Active - Delete all contacts confirmation
 */

import { AlertTriangle, X } from 'lucide-react';

interface DeleteAllContactsDialogProps {
  contactCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export const DeleteAllContactsDialog = ({ contactCount, onConfirm, onCancel, onClose }: DeleteAllContactsDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
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
        className="bg-background border border-border rounded-lg shadow-xl w-full max-w-md m-4"
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
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" style={{ color: 'var(--color-error)' }} />
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Delete All Contacts
            </h2>
          </div>
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
        <div className="p-6 space-y-4">
          <p className="text-sm" style={{ color: 'var(--color-foreground)' }}>
            Are you sure you want to delete all {contactCount} contact{contactCount !== 1 ? 's' : ''}? This action cannot be undone.
          </p>
          <div className="p-3 rounded border" style={{ 
            borderColor: 'var(--color-error)', 
            backgroundColor: 'var(--color-error)/10' 
          }}>
            <p className="text-xs font-medium" style={{ color: 'var(--color-error)' }}>
              Warning: All contact data will be permanently deleted, including photos, notes, and entries.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-end gap-2 pt-4 border-t p-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
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
            onClick={handleConfirm}
            className="px-4 py-2 rounded transition-colors"
            style={{
              backgroundColor: 'var(--color-error)',
              color: 'var(--color-error-foreground)',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '1';
            }}
          >
            Delete All
          </button>
        </div>
      </div>
    </div>
  );
};
