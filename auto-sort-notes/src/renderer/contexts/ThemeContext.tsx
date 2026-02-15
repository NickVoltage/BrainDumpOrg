/**
 * Theme Context
 * 
 * Purpose: React Context for theme state management.
 * Manages theme (light/dark) state across the application.
 * 
 * Last Updated: 2024
 * Status: Foundation - Ready for customization
 */

// Comment 1007: Theme Context - React Context for Theme Management
// This React Context manages theme state (light/dark mode) across the application.
// It provides theme state and toggle function to all components.
//
// Intended Interactions:
// - Used by: useTheme.ts hook (Comment 010) for theme operations
// - Used by: ThemeToggle component (Comment 1009) for theme switching
// - Updates: data-theme attribute on document root for CSS variable switching
//
// Logic Flow:
// 1. Context provider manages theme state (light/dark)
// 2. Theme state stored in localStorage for persistence
// 3. On mount, reads theme from localStorage or system preference
// 4. Updates data-theme attribute on document root
// 5. CSS variables update automatically based on data-theme attribute
//
// Dependencies:
// - React Context API
// - localStorage for theme persistence
// - CSS Variables (variables.css - Comment 1010)
//
// Related Files:
// - src/renderer/shared/hooks/useTheme.ts
// - src/renderer/shared/components/ThemeToggle.tsx
// - src/renderer/styles/variables.css
// - src/renderer/config/themes.ts
//
// Related Comments:
// - Comment 010 (useTheme.ts - hook that uses this context)
// - Comment 1008 (themes.ts - theme configuration)
// - Comment 1009 (ThemeToggle.tsx - theme toggle component)
// - Comment 1010 (variables.css - CSS variables)

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Get theme from localStorage or system preference
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // Update data-theme attribute on document root
    document.documentElement.setAttribute('data-theme', theme);
    // Store theme in localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
