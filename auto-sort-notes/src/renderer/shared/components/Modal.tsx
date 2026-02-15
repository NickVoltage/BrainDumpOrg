/**
 * Modal Component
 * 
 * Purpose: Shared reusable modal component with overlay and close functionality.
 * 
 * Last Updated: 2024
 * Status: Foundation - Ready for customization
 */

// Comment 1016: Shared Modal Component - Reusable Modal
// This component provides a reusable modal with overlay, close functionality, and theme-aware styling.
// It supports different sizes and can be controlled via open/onClose props.
//
// Intended Interactions:
// - Used by: All components that need modal dialogs
// - Provides: Consistent modal styling across the application
// - Supports: Overlay, close button, different sizes, keyboard escape
//
// Logic Flow:
// 1. Component receives open, onClose, title, and children props
// 2. Renders overlay when open
// 3. Renders modal content with title and close button
// 4. Handles escape key and overlay click to close
// 5. Applies theme-aware styling
//
// Dependencies:
// - Tailwind CSS for styling
// - CSS Variables for theme-aware colors
// - Lucide React icons (for close icon)
//
// Related Files:
// - All component files using modals
// - src/renderer/styles/variables.css (theme variables)
//
// Related Comments:
// - Comment 1010 (variables.css - theme variables)

import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div
        className={clsx(
          'relative z-50 w-full rounded-lg border border-border bg-background shadow-lg',
          sizes[size],
          'max-h-[90vh] overflow-auto'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || true) && (
          <div className="flex items-center justify-between border-b border-border p-4">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            <button
              onClick={onClose}
              className="rounded-md p-1 hover:bg-muted transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
