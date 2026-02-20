/**
 * Navigation Context
 * 
 * Purpose: React Context for navigation state management.
 * Manages current tab/view state across the application.
 * 
 * Last Updated: 2024
 * Status: Foundation - Ready for customization
 */

// Comment 1005: Navigation Context - Navigation State Management
// This React Context manages navigation state (current tab/view) across the application.
// It provides navigation state and navigation functions to all components.
//
// Intended Interactions:
// - Used by: TabBar component (Comment 1004) for tab selection
// - Used by: MainLayout component (Comment 1003) for view switching
// - Used by: App.tsx (Comment 1006) for routing
//
// Logic Flow:
// 1. Context provider manages current tab/view state
// 2. Components can read current tab and navigate to different tabs
// 3. Navigation updates trigger view changes
// 4. State can be persisted in localStorage if needed
//
// Dependencies:
// - React Context API
// - React Router (for routing integration)
//
// Related Files:
// - src/renderer/shared/components/TabBar.tsx
// - src/renderer/shared/components/MainLayout.tsx
// - src/renderer/App.tsx
//
// Related Comments:
// - Comment 1003 (MainLayout.tsx - main layout component)
// - Comment 1004 (TabBar.tsx - tab navigation component)
// - Comment 1006 (App.tsx - app router setup)

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Tab = 'dashboard' | 'docs' | 'calendar' | 'todos' | 'alarms' | 'metadata' | 'social';

interface NavigationContextType {
  currentTab: Tab;
  navigateTo: (tab: Tab) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');

  const navigateTo = (tab: Tab) => {
    setCurrentTab(tab);
  };

  return (
    <NavigationContext.Provider value={{ currentTab, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
