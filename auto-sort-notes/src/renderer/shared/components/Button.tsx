/**
 * Button Component
 * 
 * Purpose: Shared reusable button component with variants.
 * 
 * Last Updated: 2024
 * Status: Foundation - Ready for customization
 */

// Comment 1014: Shared Button Component - Reusable Button
// This component provides a reusable button with variants and theme-aware styling.
// It supports different button styles (primary, secondary, etc.) and sizes.
//
// Intended Interactions:
// - Used by: All components that need buttons
// - Provides: Consistent button styling across the application
// - Supports: Variants, sizes, disabled state, loading state
//
// Logic Flow:
// 1. Component receives variant, size, and other props
// 2. Applies appropriate CSS classes based on variant and size
// 3. Handles click events and disabled state
// 4. Renders with theme-aware styling
//
// Dependencies:
// - Tailwind CSS for styling
// - CSS Variables for theme-aware colors
// - clsx for conditional class names
//
// Related Files:
// - All component files using buttons
// - src/renderer/styles/variables.css (theme variables)
//
// Related Comments:
// - Comment 1010 (variables.css - theme variables)

import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-error text-error-foreground hover:bg-error/90',
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="mr-2">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
