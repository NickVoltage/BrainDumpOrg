/**
 * Menu Bar Component
 * 
 * Purpose: Standard desktop application menu bar with dropdown menus.
 * Displays horizontal menu items (File, Edit, View, etc.) that open dropdown menus when clicked.
 * 
 * Last Updated: 2024
 * Status: Foundation - Ready for customization
 */

// Comment 1200: Menu Bar Component - Standard Desktop Menu Bar with Dropdowns
// This component provides a standard menu bar with text-based menu items that open dropdown menus.
// Each menu item can have sub-items, keyboard shortcuts, separators, and disabled states.
// Follows standard desktop application menu bar patterns (File, Edit, View, etc.).
//
// Intended Interactions:
// - Used by: All page components (Dashboard, NoteEditor, CalendarView, etc.)
// - Displays: Menu categories (File, Edit, View, etc.) with dropdown menus
// - Handles: Menu item clicks, keyboard navigation, dropdown opening/closing
//
// Logic Flow:
// 1. Component receives menu structure as props
// 2. Renders menu items horizontally
// 3. On menu item hover/click, opens dropdown menu
// 4. Dropdown displays sub-items with optional keyboard shortcuts
// 5. On sub-item click, calls handler and closes dropdown
// 6. Supports keyboard navigation (arrow keys, escape, enter)
//
// Dependencies:
// - React hooks (useState, useRef, useEffect) for dropdown state
//
// Related Files:
// - All page components that use menu bars
// - Toolbar component (for action buttons)
//
// Related Comments:
// - Comment 1201+ (specific menu items for each page)

import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export interface MenuSubItem {
  id: string;
  label: string;
  shortcut?: string; // e.g., "Ctrl+S"
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean; // If true, renders as a separator line
}

export interface MenuItem {
  id: string;
  label: string;
  items: MenuSubItem[];
}

interface MenuBarProps {
  items: MenuItem[];
  className?: string;
}

export function MenuBar({ items, className }: MenuBarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && openMenuId) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [openMenuId]);

  const handleMenuClick = (menuId: string) => {
    setOpenMenuId(openMenuId === menuId ? null : menuId);
  };

  const handleMenuHover = (menuId: string) => {
    // If a menu is already open, automatically switch to the hovered menu
    if (openMenuId !== null && openMenuId !== menuId) {
      setOpenMenuId(menuId);
    }
  };

  const handleSubItemClick = (subItem: MenuSubItem) => {
    if (!subItem.disabled && subItem.onClick) {
      subItem.onClick();
      setOpenMenuId(null);
    }
  };

  return (
    <div 
      className={clsx(
        'flex items-center gap-0 border-b border-border bg-background',
        className
      )}
    >
      {items.map((menuItem) => {
        const isOpen = openMenuId === menuItem.id;
        
        return (
          <div
            key={menuItem.id}
            ref={(el) => (menuRefs.current[menuItem.id] = el)}
            className="relative"
          >
            <button
              onClick={() => handleMenuClick(menuItem.id)}
              onMouseEnter={() => handleMenuHover(menuItem.id)}
              className={clsx(
                'px-3 py-1.5 text-sm text-foreground transition-colors',
                'hover:bg-muted/50',
                isOpen && 'bg-muted/50'
              )}
              aria-label={menuItem.label}
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              {menuItem.label}
            </button>
            
            {/* Dropdown Menu */}
            {isOpen && (
              <div
                className="absolute left-0 top-full min-w-[180px] bg-background border border-border shadow-lg z-50 py-1"
                role="menu"
              >
                {menuItem.items.map((subItem, index) => {
                  if (subItem.separator) {
                    return (
                      <div
                        key={`separator-${index}`}
                        className="h-px bg-border my-1 mx-1"
                        role="separator"
                      />
                    );
                  }
                  
                  return (
                    <button
                      key={subItem.id}
                      onClick={() => handleSubItemClick(subItem)}
                      disabled={subItem.disabled}
                      className={clsx(
                        'w-full flex items-center justify-between px-3 py-1.5 text-sm text-left transition-colors',
                        'hover:bg-muted/50 text-foreground',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        subItem.disabled && 'text-muted-foreground'
                      )}
                      role="menuitem"
                    >
                      <span>{subItem.label}</span>
                      {subItem.shortcut && (
                        <span className="text-xs text-muted-foreground ml-6">
                          {subItem.shortcut}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
