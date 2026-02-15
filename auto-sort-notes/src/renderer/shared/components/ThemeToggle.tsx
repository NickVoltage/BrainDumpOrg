/**
 * Theme Toggle Component
 * 
 * Purpose: Button component to toggle between light and dark themes.
 * 
 * Last Updated: 2024
 * Status: Foundation - Ready for customization
 */

// Comment 1009: Theme Toggle Component - Toggle Light/Dark Theme
// This component provides a button to toggle between light and dark themes.
// It displays the current theme and allows users to switch themes.
//
// Intended Interactions:
// - Uses: useTheme hook (Comment 010) for theme state and toggle function
// - Displays: Current theme indicator (icon or text)
// - Handles: Click event to toggle theme
//
// Logic Flow:
// 1. Component uses useTheme hook to get theme and toggleTheme function
// 2. Renders button with theme indicator
// 3. On click, calls toggleTheme to switch themes
// 4. Theme updates propagate via ThemeContext
//
// Dependencies:
// - useTheme hook (Comment 010)
// - Lucide React icons (for theme icons)
//
// Related Files:
// - src/renderer/shared/hooks/useTheme.ts
// - src/renderer/contexts/ThemeContext.tsx
//
// Related Comments:
// - Comment 010 (useTheme.ts - theme hook)
// - Comment 1007 (ThemeContext.tsx - theme context)

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative group">
      <button
        onClick={toggleTheme}
        className="w-full flex items-center justify-center py-2.5 rounded-md hover:bg-muted transition-colors"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </button>
      {/* Tooltip on hover - uses theme CSS variables */}
      <div 
        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm font-medium rounded-md shadow-xl opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap z-[100] border"
        style={{ 
          backgroundColor: 'var(--color-tooltip-background)',
          color: 'var(--color-tooltip-foreground)',
          borderColor: 'var(--color-border)'
        }}
      >
        Theme
        {/* Tooltip arrow */}
        <div 
          className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-b-4 border-b-transparent"
          style={{ borderRightColor: 'var(--color-tooltip-background)' }}
        ></div>
      </div>
    </div>
  );
}

