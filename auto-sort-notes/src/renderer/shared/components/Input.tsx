/**
 * Input Component
 * 
 * Purpose: Shared reusable input component with label and error support.
 * 
 * Last Updated: 2024
 * Status: Foundation - Ready for customization
 */

// Comment 1015: Shared Input Component - Reusable Input
// This component provides a reusable input with label, error state, and theme-aware styling.
// It supports different input types and validation states.
//
// Intended Interactions:
// - Used by: All components that need form inputs
// - Provides: Consistent input styling across the application
// - Supports: Labels, error messages, disabled state, validation
//
// Logic Flow:
// 1. Component receives type, label, error, and other props
// 2. Renders label if provided
// 3. Renders input with appropriate styling
// 4. Displays error message if error prop is provided
// 5. Applies theme-aware styling
//
// Dependencies:
// - Tailwind CSS for styling
// - CSS Variables for theme-aware colors
// - clsx for conditional class names
//
// Related Files:
// - All component files using inputs
// - src/renderer/styles/variables.css (theme variables)
//
// Related Comments:
// - Comment 1010 (variables.css - theme variables)

import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium mb-1 text-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-input-foreground',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus-visible:ring-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
