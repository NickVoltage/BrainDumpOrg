/**
 * Tab Bar Component
 * 
 * Purpose: Navigation bar with tabs for different views.
 * 
 * Last Updated: 2024
 * Status: Foundation - Ready for customization
 */

// Comment 1004: Tab Bar Component - Tab Navigation
// This component provides a tab bar for navigating between different views.
// It displays tabs for: Dashboard, Docs, Calendar, Do/Due, Alarm/Timer, Metadata.
//
// Intended Interactions:
// - Uses: NavigationContext (Comment 1005) for navigation state
// - Displays: All available tabs with current tab highlighted
// - Handles: Tab click to navigate to different views
//
// Logic Flow:
// 1. Component uses useNavigation hook to get current tab and navigateTo function
// 2. Renders tabs for each view
// 3. Highlights current tab
// 4. On tab click, calls navigateTo to switch views
//
// Dependencies:
// - NavigationContext (Comment 1005) for navigation state
// - Lucide React icons (for tab icons)
//
// Related Files:
// - src/renderer/contexts/NavigationContext.tsx
// - src/renderer/shared/components/MainLayout.tsx
//
// Related Comments:
// - Comment 1003 (MainLayout.tsx - main layout)
// - Comment 1005 (NavigationContext.tsx - navigation context)

import { LayoutDashboard, FileText, Calendar, CheckSquare, Clock, Tag, User } from 'lucide-react';
import { useNavigation, Tab } from '../../contexts/NavigationContext';
import { clsx } from 'clsx';

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'docs', label: 'Docs', icon: FileText },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'todos', label: 'Do/Due', icon: CheckSquare },
  { id: 'alarms', label: 'Alarm/Timer', icon: Clock },
  { id: 'social', label: 'Social Hub', icon: User },
  { id: 'metadata', label: 'Metadata', icon: Tag },
];

export function TabBar() {
  const { currentTab, navigateTo } = useNavigation();

  return (
    <nav className="flex flex-col gap-1 p-1 w-full">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        
        return (
          <div key={tab.id} className="relative group">
            <button
              onClick={() => navigateTo(tab.id)}
              className="flex items-center justify-center w-full py-2.5 rounded-md transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--color-muted)' : 'transparent',
                color: isActive ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
                border: 'none',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-muted)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-foreground)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-muted-foreground)';
                }
              }}
              aria-label={`Navigate to ${tab.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon 
                className="w-5 h-5"
                style={{
                  color: isActive ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
                }}
              />
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
              {tab.label}
              {/* Tooltip arrow */}
              <div 
                className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-b-4 border-b-transparent"
                style={{ borderRightColor: 'var(--color-tooltip-background)' }}
              ></div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
