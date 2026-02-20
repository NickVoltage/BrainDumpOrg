/**
 * App Component
 * 
 * Purpose: Main application component with routing and layout.
 * 
 * Last Updated: 2024
 * Status: Foundation - Ready for customization
 */

// Comment 1006: App Router Setup - Main Application Component
// This component sets up React Router and renders the main layout with placeholder views.
// It defines routes for each tab and renders the appropriate component.
//
// Intended Interactions:
// - Uses: React Router for routing
// - Uses: MainLayout (Comment 1003) for layout structure
// - Renders: Placeholder components for each tab
//
// Logic Flow:
// 1. Component sets up React Router with routes
// 2. Each route corresponds to a tab (dashboard, docs, calendar, etc.)
// 3. Renders MainLayout with current route's component
// 4. Navigation updates trigger route changes
//
// Dependencies:
// - React Router for routing
// - MainLayout component (Comment 1003)
// - NavigationContext (Comment 1005) for navigation state
// - Placeholder components for each tab
//
// Related Files:
// - src/renderer/shared/components/MainLayout.tsx
// - src/renderer/contexts/NavigationContext.tsx
// - Placeholder components for each feature
//
// Related Comments:
// - Comment 1003 (MainLayout.tsx - main layout)
// - Comment 1005 (NavigationContext.tsx - navigation context)

import { MainLayout } from './shared/components/MainLayout';
import { useNavigation } from './contexts/NavigationContext';
import { Dashboard } from './features/dashboard/components/Dashboard';
import { NoteEditor } from './features/notes/components/NoteEditor';
import { CalendarView } from './features/calendar/components/CalendarView';
import { TodoList } from './features/todos/components/TodoList';
import { AlarmTimerTab } from './features/alarms/components/AlarmTimerTab';
import { SocialHub } from './features/social/components/SocialHub';
import { MetadataManager } from './features/metadata/components/MetadataManager';

// Comment 1006: App Router Setup - Main Application Component
// This component sets up the main application view based on the current tab.
// It uses NavigationContext to determine which view to render.
//
// Intended Interactions:
// - Uses: NavigationContext (Comment 1005) for current tab state
// - Uses: MainLayout (Comment 1003) for layout structure
// - Renders: Placeholder components for each tab
//
// Logic Flow:
// 1. Component reads currentTab from NavigationContext
// 2. Renders appropriate component based on currentTab
// 3. TabBar updates currentTab when user clicks tabs
// 4. View updates automatically
//
// Dependencies:
// - MainLayout component (Comment 1003)
// - NavigationContext (Comment 1005) for navigation state
// - Placeholder components for each feature
//
// Related Files:
// - src/renderer/shared/components/MainLayout.tsx
// - src/renderer/contexts/NavigationContext.tsx
// - src/renderer/shared/components/TabBar.tsx
// - Placeholder components for each feature
//
// Related Comments:
// - Comment 1003 (MainLayout.tsx - main layout)
// - Comment 1004 (TabBar.tsx - tab navigation)
// - Comment 1005 (NavigationContext.tsx - navigation context)

function AppContent() {
  const { currentTab } = useNavigation();

  // Render appropriate component based on current tab
  // Each component now includes its own menu bar and layout
  switch (currentTab) {
    case 'dashboard':
      return <Dashboard />;
    case 'docs':
      return <NoteEditor />;
    case 'calendar':
      return <CalendarView />;
    case 'todos':
      return <TodoList />;
    case 'alarms':
      return <AlarmTimerTab />;
    case 'social':
      return <SocialHub />;
    case 'metadata':
      return <MetadataManager />;
    default:
      return <Dashboard />;
  }
}

function App() {
  return (
    <MainLayout>
      <AppContent />
    </MainLayout>
  );
}

export default App;
