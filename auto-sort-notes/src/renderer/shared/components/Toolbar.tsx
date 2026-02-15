/**
 * Toolbar Component (Action Bar)
 * 
 * Purpose: Horizontal toolbar with action buttons for quick access to common actions.
 * This is a button bar, not a menu bar. For menu bars with dropdowns, see MenuBar component.
 * 
 * Last Updated: 2024
 * Status: Foundation - Ready for customization
 */

// Comment 1100: Toolbar Component - Page-Level Action Button Bar
// This component provides a horizontal toolbar with action buttons for each page.
// Each page can define its own toolbar items with labels, icons, and click handlers.
// Note: This is a toolbar/action bar, not a menu bar. Menu bars have dropdown menus.
//
// Intended Interactions:
// - Used by: All page components (Dashboard, NoteEditor, CalendarView, etc.)
// - Displays: Page-specific action buttons
// - Handles: Button clicks (currently placeholders)
//
// Logic Flow:
// 1. Component receives toolbar items as props
// 2. Renders buttons in a horizontal bar
// 3. Each button has a label and optional icon
// 4. On click, calls the provided handler (placeholder for now)
//
// Dependencies:
// - Lucide React icons (for button icons)
//
// Related Files:
// - All page components that use toolbars
// - MenuBar component (for proper menu bars with dropdowns)
//
// Related Comments:
// - Comment 1101+ (specific toolbar items for each page)

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { clsx } from 'clsx';

export interface ToolbarItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
}

interface ToolbarProps {
  items: ToolbarItem[];
  className?: string;
}

interface Boundaries {
  left: number;
  right: number;
}

interface TooltipPosition {
  transform: string;
  arrowLeft: string;
}

// Individual toolbar button component
function ToolbarButton({ 
  item, 
  boundaries 
}: { 
  item: ToolbarItem; 
  boundaries: Boundaries;
}) {
  const Icon = item.icon;
  const variant = item.variant || 'default';
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    transform: 'translateX(-50%)',
    arrowLeft: '50%'
  });

  // Calculate tooltip position for this button
  const calculateTooltipPosition = useCallback(() => {
    if (!buttonRef.current || !tooltipRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const buttonCenter = buttonRect.left + buttonRect.width / 2;
    const tooltipWidth = tooltipRect.width || 0;
    const tooltipHalfWidth = tooltipWidth / 2;
    const padding = 2; // 2px padding from boundaries

    // Check if tooltip would overlap left boundary
    const wouldOverlapLeft = buttonCenter - tooltipHalfWidth < boundaries.left;
    // Check if tooltip would overlap right boundary
    const wouldOverlapRight = buttonCenter + tooltipHalfWidth > boundaries.right;

    if (wouldOverlapLeft) {
      // Calculate minimum offset needed to clear left boundary
      const overlap = boundaries.left - (buttonCenter - tooltipHalfWidth);
      const offset = overlap + padding;
      
      setTooltipPosition({
        transform: `translateX(calc(-50% + ${offset}px))`,
        arrowLeft: `calc(50% - ${offset}px)`
      });
    } else if (wouldOverlapRight) {
      // Calculate minimum offset needed to clear right boundary
      const overlap = (buttonCenter + tooltipHalfWidth) - boundaries.right;
      const offset = overlap + padding;
      
      setTooltipPosition({
        transform: `translateX(calc(-50% - ${offset}px))`,
        arrowLeft: `calc(50% + ${offset}px)`
      });
    } else {
      // Center if no overlap
      setTooltipPosition({
        transform: 'translateX(-50%)',
        arrowLeft: '50%'
      });
    }
  }, [boundaries]);

  // Calculate tooltip position on hover
  const handleMouseEnter = () => {
    // Use requestAnimationFrame to ensure tooltip is rendered and measurable
    requestAnimationFrame(() => {
      calculateTooltipPosition();
    });
  };

  return (
    <div className="relative group">
      <button
        ref={buttonRef}
        onClick={item.onClick}
        onMouseEnter={handleMouseEnter}
        disabled={item.disabled}
        className={clsx(
          'flex items-center justify-center w-8 h-8 rounded transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          variant === 'ghost' && 'hover:bg-muted text-muted-foreground hover:text-foreground',
          variant === 'default' && 'hover:bg-muted text-foreground'
        )}
        aria-label={item.label}
      >
        {Icon && <Icon className="w-4 h-4" />}
      </button>
      {/* Tooltip on hover - dynamically positioned based on boundaries */}
      <div 
        ref={tooltipRef}
        className="absolute left-1/2 top-full mt-2 px-3 py-1.5 text-sm font-medium rounded-md shadow-xl opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap z-[100] border"
        style={{ 
          backgroundColor: 'var(--color-tooltip-background)',
          color: 'var(--color-tooltip-foreground)',
          borderColor: 'var(--color-border)',
          transform: tooltipPosition.transform
        }}
      >
        {item.label}
        {/* Tooltip arrow pointing up - always centered with button */}
        <div 
          className="absolute bottom-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4"
          style={{ 
            borderBottomColor: 'var(--color-tooltip-background)',
            left: tooltipPosition.arrowLeft,
            transform: 'translateX(-50%)'
          }}
        ></div>
      </div>
    </div>
  );
}

export function Toolbar({ items, className }: ToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const boundariesRef = useRef<Boundaries>({ left: 0, right: 0 });
  const sidebarObserverRef = useRef<ResizeObserver | null>(null);
  const [boundaries, setBoundaries] = useState<Boundaries>({ left: 0, right: 0 });

  // Calculate boundaries - only when window or sidebar size changes
  const calculateBoundaries = useCallback(() => {
    // Find sidebar element (the aside element in MainLayout)
    const sidebar = document.querySelector('aside');
    const sidebarWidth = sidebar ? sidebar.getBoundingClientRect().width : 64; // Default to 64px (w-16)
    
    const windowWidth = window.innerWidth;
    const padding = 2; // 2px padding from edges
    
    const leftBoundary = sidebarWidth + padding;
    const rightBoundary = windowWidth - padding;

    const newBoundaries = { left: leftBoundary, right: rightBoundary };
    
    // Only update if boundaries actually changed
    if (
      boundariesRef.current.left !== newBoundaries.left ||
      boundariesRef.current.right !== newBoundaries.right
    ) {
      boundariesRef.current = newBoundaries;
      setBoundaries(newBoundaries);
    }
  }, []);

  // Initialize boundaries on mount
  useEffect(() => {
    calculateBoundaries();
  }, [calculateBoundaries]);

  // Recalculate on window resize (debounced)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        calculateBoundaries();
      }, 100); // 100ms debounce
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [calculateBoundaries]);

  // Observe sidebar for size changes (future-proof for resizable sidebar)
  useEffect(() => {
    const sidebar = document.querySelector('aside');
    if (!sidebar) return;

    sidebarObserverRef.current = new ResizeObserver(() => {
      calculateBoundaries();
    });

    sidebarObserverRef.current.observe(sidebar);

    return () => {
      if (sidebarObserverRef.current) {
        sidebarObserverRef.current.disconnect();
      }
    };
  }, [calculateBoundaries]);

  return (
    <div 
      ref={toolbarRef}
      className={clsx(
        'flex items-center gap-1 px-2 py-1.5 border-b border-border bg-background',
        className
      )}
    >
      {items.map((item) => (
        <ToolbarButton key={item.id} item={item} boundaries={boundaries} />
      ))}
    </div>
  );
}
