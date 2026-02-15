/**
 * useTheme Hook
 * 
 * Purpose: React hook for theme operations.
 * 
 * Last Updated: 2024
 * Status: Placeholder - Ready for breadcrumb comments
 */

// Comment 010: useTheme Hook - React Hook for Theme Operations
// This hook provides a React interface for theme operations.
// Uses ThemeContext for theme state management.
//
// Related Comments:
// - Comment 010 (ThemeContext.tsx - theme context)

import { useThemeContext } from '../../contexts/ThemeContext';

export const useTheme = () => {
  return useThemeContext();
};
