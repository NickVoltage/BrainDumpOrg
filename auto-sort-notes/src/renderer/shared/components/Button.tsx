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
  
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-foreground)',
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--color-secondary-foreground)',
          border: 'none',
        };
      case 'outline':
        return {
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-foreground)',
          border: 'none',
        };
      case 'destructive':
        return {
          backgroundColor: 'var(--color-error)',
          color: 'var(--color-error-foreground)',
          border: 'none',
        };
      default:
        return {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-foreground)',
          border: 'none',
        };
    }
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8',
  };

  const variantStyles = getVariantStyles(variant);

  return (
    <button
      className={clsx(
        baseStyles,
        sizes[size],
        className
      )}
      style={variantStyles}
      disabled={disabled || isLoading}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          if (variant === 'primary') {
            (e.currentTarget as HTMLElement).style.opacity = '0.9';
          } else if (variant === 'secondary') {
            (e.currentTarget as HTMLElement).style.opacity = '0.8';
          } else if (variant === 'outline') {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent)';
            (e.currentTarget as HTMLElement).style.color = 'var(--color-accent-foreground)';
          } else if (variant === 'ghost') {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent)';
            (e.currentTarget as HTMLElement).style.color = 'var(--color-accent-foreground)';
          } else if (variant === 'destructive') {
            (e.currentTarget as HTMLElement).style.opacity = '0.9';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          Object.assign((e.currentTarget as HTMLElement).style, variantStyles);
          if (variant === 'primary' || variant === 'secondary' || variant === 'destructive') {
            (e.currentTarget as HTMLElement).style.opacity = '1';
          }
        }
      }}
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
