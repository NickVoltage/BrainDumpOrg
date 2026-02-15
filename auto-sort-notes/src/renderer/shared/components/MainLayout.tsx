/**
 * Main Layout Component
 * 
 * Purpose: Main container layout for the entire application.
 * Includes navigation, content area, and sidebar if needed.
 * 
 * Last Updated: 2024
 * Status: Foundation - Ready for customization
 */

// Comment 1003: Main Layout Component - Application Container
// This component provides the main layout structure for the entire application.
// It includes the tab navigation, content area, and any sidebars.
//
// Intended Interactions:
// - Used by: App.tsx (Comment 1006) as the main container
// - Contains: TabBar (Comment 1004) for navigation
// - Contains: Content area for current view
// - Contains: ThemeToggle (Comment 1009) for theme switching
//
// Logic Flow:
// 1. Component renders TabBar at top
// 2. Renders content area based on current tab
// 3. Includes theme toggle and other global UI elements
// 4. Provides consistent layout structure
//
// Dependencies:
// - TabBar component (Comment 1004)
// - NavigationContext (Comment 1005) for current view
// - ThemeToggle component (Comment 1009)
//
// Related Files:
// - src/renderer/App.tsx
// - src/renderer/shared/components/TabBar.tsx
// - src/renderer/shared/components/ThemeToggle.tsx
//
// Related Comments:
// - Comment 1004 (TabBar.tsx - tab navigation)
// - Comment 1005 (NavigationContext.tsx - navigation context)
// - Comment 1006 (App.tsx - app router)
// - Comment 1009 (ThemeToggle.tsx - theme toggle)

import React, { ReactNode } from 'react';
import { TabBar } from './TabBar';
import { ThemeToggle } from './ThemeToggle';
import { useNavigation } from '../../contexts/NavigationContext';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { currentTab } = useNavigation();

  return (
    <div className="flex h-full w-full bg-background text-foreground overflow-hidden">
      {/* Vertical sidebar navigation */}
      <aside className="flex flex-col h-full w-16 border-r border-border bg-background overflow-visible flex-shrink-0">
        <div className="flex-1 flex flex-col justify-start min-h-0">
          <TabBar />
        </div>
        <div className="flex-shrink-0 p-1 border-t border-border">
          <ThemeToggle />
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 h-full overflow-auto min-w-0" data-tab={currentTab}>
        {children}
      </main>
    </div>
  );
}

