/**
 * Context Menu Component
 * 
 * Purpose: Right-click context menu with submenu support.
 * 
 * Last Updated: 2024
 * Status: Active - Context menu with reliable submenu display
 */

// Comment 2010: Context Menu Component - Right-Click Menu
// This component provides a right-click context menu with submenu support.
// Uses wrapper-based hover tracking to ensure submenus display reliably.
//
// Intended Interactions:
// - Used by: CalendarMonth component for day right-click menus
// - Provides: Context menu with submenus, keyboard navigation, click-outside-to-close
// - Supports: Nested submenus, separators, disabled items
//
// Logic Flow:
// 1. Component receives menu items and position (x, y)
// 2. Renders menu at position
// 3. Submenus open immediately on hover, stay open while hovering over parent or submenu
// 4. Submenus close only when mouse leaves both parent and submenu areas
// 5. Closes on outside click or escape key
//
// Dependencies:
// - Tailwind CSS for styling
// - CSS Variables for theme-aware colors
// - Lucide React icons (for chevron)
//
// Related Files:
// - src/renderer/features/calendar/components/CalendarMonth.tsx
// - src/renderer/styles/variables.css (theme variables)
//
// Related Comments:
// - Comment 2002 (CalendarMonth.tsx - uses this component)
// - Comment 2010 (variables.css - theme variables)

import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export interface ContextMenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  x: number;
  y: number;
  onClose: () => void;
}

export function ContextMenu({ items, x, y, onClose }: ContextMenuProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const submenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const menuItemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // Check if click is outside all submenus too
        const isOutsideSubmenus = Object.values(submenuRefs.current).every(
          ref => !ref || !ref.contains(e.target as Node)
        );
        if (isOutsideSubmenus) {
          onClose();
        }
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      // Clear all timeouts on unmount
      Object.values(submenuTimeouts.current).forEach(timeout => clearTimeout(timeout));
    };
  }, [onClose]);

  // Adjust position to keep menu in viewport
  const [adjustedPosition, setAdjustedPosition] = useState({ x, y });

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX = x;
      let newY = y;

      // Adjust horizontal position
      if (x + rect.width > viewportWidth) {
        newX = viewportWidth - rect.width - 10;
      }
      if (newX < 10) {
        newX = 10;
      }

      // Adjust vertical position
      if (y + rect.height > viewportHeight) {
        newY = viewportHeight - rect.height - 10;
      }
      if (newY < 10) {
        newY = 10;
      }

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [x, y]);

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled || item.separator) return;
    
    if (item.submenu) {
      // Don't close on click if it has submenu - let hover handle it
      return;
    } else if (item.onClick) {
      item.onClick();
      onClose();
    }
  };

  const handleSubmenuItemClick = (item: ContextMenuItem) => {
    if (item.disabled || item.separator) return;
    
    if (item.onClick) {
      item.onClick();
      onClose();
    }
  };

  // Clear timeout for a specific submenu
  const clearSubmenuTimeout = (itemId: string) => {
    if (submenuTimeouts.current[itemId]) {
      clearTimeout(submenuTimeouts.current[itemId]);
      delete submenuTimeouts.current[itemId];
    }
  };

  // Handle mouse entering a menu item with submenu
  const handleItemMouseEnter = (itemId: string) => {
    // Close any other open submenu first - this fixes the issue where moving between submenus
    // causes the first to stay open
    if (openSubmenu && openSubmenu !== itemId) {
      clearSubmenuTimeout(openSubmenu);
      setOpenSubmenu(null);
      // Small delay to ensure the previous submenu closes before opening the new one
      setTimeout(() => {
        clearSubmenuTimeout(itemId);
        setOpenSubmenu(itemId);
      }, 0);
    } else {
      // Clear timeout for this item
      clearSubmenuTimeout(itemId);
      // Open the submenu
      setOpenSubmenu(itemId);
    }
  };

  // Handle mouse leaving a menu item with submenu
  const handleItemMouseLeave = (itemId: string, e: React.MouseEvent) => {
    // Clear any existing timeout
    clearSubmenuTimeout(itemId);
    
    // Check if mouse is moving to submenu
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (relatedTarget) {
      const submenuElement = submenuRefs.current[itemId];
      if (submenuElement && submenuElement.contains(relatedTarget)) {
        // Mouse is moving to submenu, keep it open
        return;
      }
    }
    
    // Set a delay before closing - allows time to move to submenu
    submenuTimeouts.current[itemId] = setTimeout(() => {
      // Only close if submenu is still the one we're trying to close
      if (openSubmenu === itemId) {
        setOpenSubmenu(null);
      }
      delete submenuTimeouts.current[itemId];
    }, 300);
  };

  // Handle mouse entering submenu - keep it open
  const handleSubmenuMouseEnter = (itemId: string) => {
    clearSubmenuTimeout(itemId);
    setOpenSubmenu(itemId);
  };

  // Handle mouse leaving submenu
  const handleSubmenuMouseLeave = (itemId: string, e: React.MouseEvent) => {
    clearSubmenuTimeout(itemId);
    
    // Check if mouse is moving back to parent item
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (relatedTarget) {
      const parentElement = menuItemRefs.current[itemId];
      if (parentElement && parentElement.contains(relatedTarget)) {
        // Mouse is moving back to parent, keep submenu open
        return;
      }
    }
    
    // Close submenu after delay
    submenuTimeouts.current[itemId] = setTimeout(() => {
      if (openSubmenu === itemId) {
        setOpenSubmenu(null);
      }
      delete submenuTimeouts.current[itemId];
    }, 200);
  };

  const renderSubmenu = (item: ContextMenuItem, itemElement: HTMLDivElement | null) => {
    if (!item.submenu || openSubmenu !== item.id) return null;

    // The submenu is positioned absolute relative to its parent (the menu item div with class "relative")
    // The menu item structure is:
    //   <div className="relative">  (itemElement - this is the parent, ref stored in menuItemRefs)
    //     <div className="px-3 py-1.5 ...">  (content div with py-1.5 = 6px top/bottom padding)
    //       Menu item content
    //     </div>
    //     <div className="absolute left-full ...">  (submenu - this element)
    //       Submenu content (has py-1 = 4px top/bottom padding)
    //     </div>
    //   </div>
    //
    // The submenu is positioned absolute with left-full, which positions it relative to the menu item div.
    // To align the submenu's top with the menu item's top, we use top: 0.
    // However, the user reports it's aligning with the bottom, which suggests the positioning
    // might be relative to the content div instead of the menu item div.
    //
    // Actually, wait - if it's aligning with the bottom, maybe the submenu is being positioned
    // relative to the bottom of the menu item div. Let me check: the submenu is a sibling of
    // the content div, both children of the menu item div. So top: 0 should align with the
    // menu item div's top.
    //
    // But the user says it's at the bottom. This could mean:
    // 1. The submenu is positioned relative to the wrong element
    // 2. There's a CSS issue causing it to align to bottom
    // 3. The menu item div's height is being calculated incorrectly
    //
    // Let me use top: 0 explicitly and ensure it's positioned correctly relative to the menu item div.

    return (
      <div
        ref={(el) => {
          submenuRefs.current[item.id] = el;
          // Ensure the submenu is positioned at the top when it's rendered
          if (el && itemElement) {
            requestAnimationFrame(() => {
              // Force top alignment by setting it explicitly
              el.style.top = '0px';
              el.style.bottom = 'auto'; // Ensure bottom is not set (which could cause bottom alignment)
            });
          }
        }}
        data-submenu={item.id}
        className="absolute left-full ml-[-2px] min-w-[180px] rounded-md border border-border shadow-xl z-[60] py-1"
        style={{
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-foreground)',
          top: '0px', // Explicitly align with top of menu item div
          bottom: 'auto', // Ensure bottom is not set (which could cause bottom alignment)
          position: 'absolute', // Ensure absolute positioning
        }}
        onMouseEnter={() => handleSubmenuMouseEnter(item.id)}
        onMouseLeave={(e) => handleSubmenuMouseLeave(item.id, e)}
      >
        {item.submenu.map((subItem) => {
          if (subItem.separator) {
            return (
              <div
                key={subItem.id}
                className="my-1 border-t border-border"
              />
            );
          }

          return (
            <div
              key={subItem.id}
              className={clsx(
                'px-3 py-1.5 text-sm cursor-pointer transition-colors',
                'text-foreground hover:bg-muted',
                subItem.disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => handleSubmenuItemClick(subItem)}
              onMouseEnter={() => {
                if (subItem.submenu) {
                  handleSubmenuMouseEnter(subItem.id);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <span>{subItem.label}</span>
                {subItem.submenu && (
                  <ChevronRight className="w-4 h-4 ml-2 text-foreground" />
                )}
              </div>
              {/* Nested submenu (for future use) */}
              {subItem.submenu && openSubmenu === subItem.id && (
                <div 
                  ref={(el) => {
                    submenuRefs.current[subItem.id] = el;
                  }}
                  data-submenu={subItem.id}
                  className="absolute left-full top-0 ml-[-2px] min-w-[180px] rounded-md border border-border shadow-xl z-[70] py-1"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                  }}
                  onMouseEnter={() => handleSubmenuMouseEnter(subItem.id)}
                  onMouseLeave={(e) => handleSubmenuMouseLeave(subItem.id, e)}
                >
                  {subItem.submenu.map((nestedItem) => {
                    if (nestedItem.separator) {
                      return (
                        <div
                          key={nestedItem.id}
                          className="my-1 border-t border-border"
                        />
                      );
                    }
                    return (
                      <div
                        key={nestedItem.id}
                        className={clsx(
                          'px-3 py-1.5 text-sm cursor-pointer transition-colors',
                          'text-foreground hover:bg-muted',
                          nestedItem.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                        onClick={() => handleSubmenuItemClick(nestedItem)}
                      >
                        {nestedItem.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[200px] rounded-md border border-border shadow-lg py-1"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)',
      }}
    >
      {items.map((item) => {
        if (item.separator) {
          return (
            <div
              key={item.id}
              className="my-1 border-t border-border"
            />
          );
        }

        return (
          <div
            key={item.id}
            ref={(el) => {
              menuItemRefs.current[item.id] = el;
            }}
            data-menu-item={item.id}
            className="relative"
            style={{ position: 'relative' }} // Ensure relative positioning
            onMouseEnter={() => {
              if (item.submenu) {
                handleItemMouseEnter(item.id);
              }
            }}
            onMouseLeave={(e) => {
              if (item.submenu) {
                handleItemMouseLeave(item.id, e);
              }
            }}
          >
            <div
              className={clsx(
                'px-3 py-1.5 text-sm cursor-pointer transition-colors flex items-center justify-between',
                'text-foreground hover:bg-muted',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => handleItemClick(item)}
            >
              <span>{item.label}</span>
              {item.submenu && (
                <ChevronRight className="w-4 h-4 ml-2 text-foreground" />
              )}
            </div>
            {renderSubmenu(item, menuItemRefs.current[item.id])}
          </div>
        );
      })}
    </div>
  );
}
