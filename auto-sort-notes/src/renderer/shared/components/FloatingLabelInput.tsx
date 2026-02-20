/**
 * Floating Label Input Component
 * 
 * Purpose: Material Design-style floating label input component.
 * Label starts inside input, animates to border line on focus (creating a break), stays at border if value exists.
 * 
 * Last Updated: 2024
 * Status: Active - Complete floating label implementation
 */

// Comment 1016: Floating Label Input Component - Material Design Input
// This component implements the Google Contacts-style floating label pattern.
// Label starts inside input field, animates to border line on focus (creating a break), and stays at border if value exists.
//
// Intended Interactions:
// - Used by: All form components that need modern, clean input styling
// - Provides: Floating label animation, border break pattern, focus states, theme-aware styling
//
// Logic Flow:
// 1. Component tracks focus state and input value
// 2. Label position determined by focus or value presence
// 3. CSS transitions animate label movement
// 4. Label positioned ON the border line when active (creating a break)
//
// Dependencies:
// - React for state management
// - Tailwind CSS for styling
// - CSS Variables for theme-aware colors
//
// Related Files:
// - All form components using inputs
// - src/renderer/styles/variables.css (theme variables)
// - 00_Design_Standards_Icon_Text_Overlap_Prevention.md (design standards)

import React, { InputHTMLAttributes, TextareaHTMLAttributes, useState, useRef, useEffect, forwardRef } from 'react';
import { clsx } from 'clsx';

interface FloatingLabelInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

interface FloatingLabelTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder'> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, helperText, icon, className, containerClassName, value, onFocus, onBlur, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputId] = useState(() => id || `floating-input-${Math.random().toString(36).substr(2, 9)}`);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const refCallback = useRef(ref);
    
    // Keep ref callback up to date without causing re-renders
    React.useEffect(() => {
      refCallback.current = ref;
    }, [ref]);
    
    const hasValue = value !== undefined && value !== null && String(value).trim() !== '';
    const isActive = isFocused || hasValue;

    // Stable callback ref - never changes, preventing input recreation
    const setRefs = React.useCallback((node: HTMLInputElement | null) => {
      inputRef.current = node;
      const currentRef = refCallback.current;
      if (typeof currentRef === 'function') {
        currentRef(node);
      } else if (currentRef) {
        currentRef.current = node;
      }
    }, []); // Empty deps - this callback never changes

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };
    
    // Calculate border color - use useMemo to prevent unnecessary recalculations
    const borderColor = React.useMemo(() => {
      return error 
        ? '#ef4444' 
        : (isFocused || isActive ? '#396cd8' : '#e5e7eb');
    }, [error, isFocused, isActive]);

    return (
      <div className={clsx('relative w-full mb-4', containerClassName)}>
        {/* Input Container with Border - Using div with pseudo-elements for border break */}
        <div
          ref={containerRef}
          className="relative rounded transition-all duration-200"
          style={{
            border: `1px solid ${borderColor}`,
            borderColor: borderColor,
            borderStyle: 'solid',
            borderWidth: '1px',
            outline: 'none',
            backgroundColor: 'var(--color-background)',
            minHeight: '40px',
          }}
        >
          {/* Label - Positioned on border line when active (only covers border line, not input area) */}
          {isActive && (
            <div
              className="absolute top-0 left-0 text-xs font-medium pointer-events-none"
              style={{
                color: error ? 'var(--color-error)' : 'var(--color-primary)',
                left: icon ? '36px' : '12px',
                paddingLeft: '4px',
                paddingRight: '4px',
                backgroundColor: 'var(--color-background)',
                transform: 'translateY(-50%)',
                zIndex: 1,
                lineHeight: '1.2',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </div>
          )}

          {/* Input Container - Flexbox layout with gap to prevent icon/text overlap, vertically centered */}
          <div 
            className={clsx(
              'flex items-center',
              icon ? 'gap-2 pl-3 pr-3' : 'px-3'
            )}
            style={{ 
              minHeight: '40px',
              paddingTop: isActive ? '10px' : '8px',
              paddingBottom: isActive ? '10px' : '8px',
            }}
          >
            {/* Icon (if provided) - Flexbox item with flex-shrink-0 to prevent overlap */}
            {icon && (
              <div className="flex-shrink-0" style={{ color: 'var(--color-muted-foreground)' }}>
                {icon}
              </div>
            )}
            
            {/* Input Field - Flexbox item that takes remaining space, vertically centered */}
            <input
              ref={setRefs}
              id={inputId}
              value={value ?? ''}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="flex-1 min-w-0 bg-transparent border-0 outline-none transition-all duration-200"
              style={{
                color: 'var(--color-foreground)',
                padding: '0',
                margin: '0',
                lineHeight: '1.5',
              }}
              {...props}
            />
          </div>

          {/* Floating Label - Shows when inactive (inside field) */}
          {!isActive && (
            <label
              htmlFor={inputId}
              className={clsx(
                'absolute pointer-events-none transition-all duration-200',
                'top-1/2 -translate-y-1/2 text-base',
                error ? 'text-error' : 'text-muted-foreground'
              )}
              style={{
                color: 'var(--color-muted-foreground)',
                transform: 'translateY(-50%) scale(1)',
                transformOrigin: 'left center',
                // Position label after icon with proper spacing (icon 16px + gap-2 8px + container pl-3 12px = 36px)
                left: icon ? '36px' : '12px',
              }}
            >
              {label}
            </label>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-1 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';

export const FloatingLabelTextarea = forwardRef<HTMLTextAreaElement, FloatingLabelTextareaProps>(
  ({ label, error, helperText, icon, className, containerClassName, value, onFocus, onBlur, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputId] = useState(() => id || `floating-textarea-${Math.random().toString(36).substr(2, 9)}`);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const hasValue = value !== undefined && value !== null && String(value).trim() !== '';
    const isActive = isFocused || hasValue;

    // Combine refs
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(textareaRef.current);
      } else if (ref) {
        ref.current = textareaRef.current;
      }
    }, [ref]);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={clsx('relative w-full mb-4', containerClassName)}>
        {/* Textarea Container with Border - Using fieldset for border break */}
        <fieldset
          className={clsx(
            'floating-label-fieldset relative rounded transition-all duration-200',
            'focus-within:ring-2',
            error 
              ? 'focus-within:ring-error' 
              : 'focus-within:ring-primary',
            isActive && 'pt-2',
            isActive && !error && 'fieldset-active',
            isFocused && !error && 'fieldset-focused'
          )}
          style={{
            // Use direct hex colors to eliminate CSS variable resolution issues
            border: `1px solid ${error 
              ? '#ef4444' 
              : (isFocused || isActive ? '#396cd8' : '#e5e7eb')}`,
            borderStyle: 'solid',
            borderWidth: '1px',
            backgroundColor: 'var(--color-background)',
            paddingBottom: isActive ? '8px' : '0',
            paddingLeft: '0',
            paddingRight: '0',
            margin: '0',
          } as React.CSSProperties}
        >
          {/* Legend/Label - Creates the "break" in the border when active */}
          {isActive && (
            <legend
              className="text-xs font-medium"
              style={{
                color: error ? 'var(--color-error)' : 'var(--color-primary)',
                marginLeft: icon ? '36px' : '12px',
                paddingLeft: '4px',
                paddingRight: '4px',
                backgroundColor: 'var(--color-background)',
                border: 'none',
                display: 'block',
              }}
            >
              {label}
            </legend>
          )}

          {/* Textarea Container - Flexbox layout with gap to prevent icon/text overlap */}
          <div className={clsx(
            'flex items-start',
            icon ? 'gap-2 pl-3 pr-3' : 'px-3'
          )}>
            {/* Icon (if provided) - Flexbox item with flex-shrink-0 to prevent overlap */}
            {icon && (
              <div className="flex-shrink-0 mt-3" style={{ color: 'var(--color-muted-foreground)' }}>
                {icon}
              </div>
            )}
            
            {/* Textarea Field - Flexbox item that takes remaining space */}
            <textarea
              ref={textareaRef}
              id={inputId}
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={clsx(
                'flex-1 min-w-0 bg-transparent border-0 outline-none transition-all duration-200 resize-y',
                isActive ? 'pt-2 pb-2' : 'py-3'
              )}
              style={{
                color: 'var(--color-foreground)',
              }}
              {...props}
            />
          </div>

          {/* Floating Label - Shows when inactive (inside field) */}
          {!isActive && (
            <label
              htmlFor={inputId}
              className={clsx(
                'absolute pointer-events-none transition-all duration-200',
                'top-3 text-base',
                error ? 'text-error' : 'text-muted-foreground'
              )}
              style={{
                color: 'var(--color-muted-foreground)',
                transform: 'scale(1)',
                transformOrigin: 'left center',
                // Position label after icon with proper spacing (icon 16px + gap-2 8px + container pl-3 12px = 36px)
                left: icon ? '36px' : '12px',
              }}
            >
              {label}
            </label>
          )}
        </fieldset>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-1 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FloatingLabelTextarea.displayName = 'FloatingLabelTextarea';

export { FloatingLabelInput };
