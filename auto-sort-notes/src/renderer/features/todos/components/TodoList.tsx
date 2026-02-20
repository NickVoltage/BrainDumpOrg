/**
 * Todo List Component
 * 
 * Purpose: Main to-do list display component for Do/Due tab.
 * Displays list of todos with filtering, sorting, and management.
 * 
 * Last Updated: 2024
 * Status: Placeholder - Ready for breadcrumb comments
 */

// Comment 202: Todo List Component - Main Todo List Display
// This component provides the main to-do list interface for the Do/Due tab.
// Displays todos with filtering by Do date, Due date, priority, and completion status.
//
// Intended Interactions:
// - Uses: src/renderer/features/todos/services/todo-service.ts (Comment 200)
// - Uses: src/renderer/features/todos/hooks/useTodoList.ts (Comment 205)
// - Uses: src/renderer/features/todos/components/TodoItem.tsx (Comment 203)
// - Uses: src/renderer/features/todos/components/TodoFilter.tsx (Comment 207)
// - Updates: src/renderer/stores/todo-store.ts (Zustand store)
//
// Logic Flow:
// 1. Component loads todos via useTodoList hook
// 2. Applies filters and sorting
// 3. Renders todo items
// 4. Handles todo operations (complete, delete, edit)
//
// Related Comments:
// - Comment 200 (todo-service.ts - service used by this component)
// - Comment 203 (TodoItem.tsx - individual todo item component)
// - Comment 205 (useTodoList.ts - hook used by this component)

import { useState } from 'react';
import { MenuBar } from '../../../shared/components/MenuBar';
import { Toolbar } from '../../../shared/components/Toolbar';
import { TodoItem } from './TodoItem';
import { TodoEditor } from './TodoEditor';
import { useTodoList } from '../hooks/useTodoList';
import { useTodo } from '../hooks/useTodo';
import type { TodoItem as TodoItemType, TodoFilter, TodoSort, TodoSortField, TodoSortOrder } from '../types';
import { Plus, Filter, ArrowUpDown, Search, Settings } from 'lucide-react';

export const TodoList = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItemType | undefined>(undefined);
  const [filter, setFilter] = useState<TodoFilter>({ status: 'all' });
  const [sort, setSort] = useState<TodoSort>({ field: 'dueDate', order: 'asc' });
  const [showCompleted, setShowCompleted] = useState(true);

  const { todos, loading, error, refresh } = useTodoList(
    showCompleted ? filter : { ...filter, status: 'incomplete' },
    sort
  );
  const { deleteTodo, toggleComplete } = useTodo();

  const handleNewTodo = () => {
    setEditingTodo(undefined);
    setShowEditor(true);
  };

  const handleEditTodo = (todo: TodoItemType) => {
    setEditingTodo(todo);
    setShowEditor(true);
  };

  const handleDeleteTodo = async (id: string) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      await deleteTodo(id);
      refresh();
    }
  };

  const handleToggleComplete = async (id: string) => {
    await toggleComplete(id);
    refresh();
  };

  const handleSaveTodo = () => {
    setShowEditor(false);
    setEditingTodo(undefined);
    refresh();
  };

  // Comment 1280: Todo List Menu Bar - File Menu
  // File menu dropdown with todo operations
  // - New Todo: Creates new todo item (Comment 1281)
  // - Import Todos: Imports todos from external file (Comment 1282)
  // - Export Todos: Exports todos to external file (Comment 1283)
  
  // Comment 1281: Todo List Menu Bar - File > New Todo
  // Opens todo editor dialog to create a new todo with title, description, Do date, Due date, priority.
  // Related: todo-service.ts createTodo, TodoEditor component
  
  // Comment 1282: Todo List Menu Bar - File > Import Todos
  // Imports todos from external file format.
  // Related: file-import-service.ts
  
  // Comment 1283: Todo List Menu Bar - File > Export Todos
  // Exports todos to external file format.
  // Related: file-export-service.ts
  
  // Comment 1284: Todo List Menu Bar - Edit Menu
  // Edit menu dropdown with todo editing operations
  // - Edit Todo: Edits selected todo (Comment 1285)
  // - Delete Todo: Deletes selected todo (Comment 1286)
  // - Mark Complete: Marks selected todos as complete (Comment 1287)
  // - Mark Incomplete: Marks selected todos as incomplete (Comment 1288)
  
  // Comment 1285: Todo List Menu Bar - Edit > Edit Todo
  // Opens todo editor dialog to edit selected todo.
  // Related: todo-service.ts updateTodo, TodoEditor component
  
  // Comment 1286: Todo List Menu Bar - Edit > Delete Todo
  // Deletes the selected todo item.
  // Related: todo-service.ts deleteTodo
  
  // Comment 1287: Todo List Menu Bar - Edit > Mark Complete
  // Marks selected todos as completed.
  // Related: todo-service.ts markComplete
  
  // Comment 1288: Todo List Menu Bar - Edit > Mark Incomplete
  // Marks selected todos as incomplete.
  // Related: todo-service.ts markIncomplete
  
  // Comment 1289: Todo List Menu Bar - View Menu
  // View menu dropdown with display options
  // - Show Completed: Toggles display of completed todos (Comment 1290)
  // - Show Incomplete: Toggles display of incomplete todos (Comment 1291)
  // - Group By: Groups todos by category (Comment 1292)
  
  // Comment 1290: Todo List Menu Bar - View > Show Completed
  // Shows/hides completed todos in the list.
  // Related: todo-service.ts filterTodos
  
  // Comment 1291: Todo List Menu Bar - View > Show Incomplete
  // Shows/hides incomplete todos in the list.
  // Related: todo-service.ts filterTodos
  
  // Comment 1292: Todo List Menu Bar - View > Group By
  // Groups todos by Do date, Due date, priority, or project.
  // Related: todo-service.ts groupTodos
  
  // Comment 1293: Todo List Menu Bar - Tools Menu
  // Tools menu dropdown with utility functions
  // - Filter: Opens filter options (Comment 1294)
  // - Sort: Opens sort options (Comment 1295)
  // - Search: Opens search interface (Comment 1296)
  
  // Comment 1294: Todo List Menu Bar - Tools > Filter
  // Opens filter panel to filter todos by Do date, Due date, priority, completion status.
  // Related: TodoFilter component, todo-service.ts filterTodos
  
  // Comment 1295: Todo List Menu Bar - Tools > Sort
  // Opens sort menu to change how todos are ordered (by Do date, Due date, priority, etc.).
  // Related: todo-service.ts sortTodos
  
  // Comment 1296: Todo List Menu Bar - Tools > Search
  // Opens search dialog to find todos by title, description, tags, etc.
  // Related: TodoSearch component, search-service.ts
  
  // Comment 1297: Todo List Menu Bar - Settings Menu
  // Settings menu dropdown
  // - Todo Settings: Opens todo list settings (Comment 1298)
  // - Default Filters: Sets default filter preferences (Comment 1299)
  
  // Comment 1298: Todo List Menu Bar - Settings > Todo Settings
  // Opens settings dialog for customizing todo list behavior and preferences.
  // Related: Settings component, config/settings.ts
  
  // Comment 1299: Todo List Menu Bar - Settings > Default Filters
  // Sets default filter preferences for the todo list.
  // Related: config/settings.ts, todo preferences

  const menuItems = [
    {
      id: 'file',
      label: 'File',
      items: [
        {
          id: 'new-todo',
          label: 'New Todo...',
          shortcut: 'Ctrl+N',
          onClick: handleNewTodo,
        },
        { id: 'separator-1', separator: true },
        {
          id: 'import',
          label: 'Import Todos...',
          onClick: () => {
            // TODO: Implement import todos (Comment 1282)
            console.log('Import Todos - placeholder');
          },
        },
        {
          id: 'export',
          label: 'Export Todos...',
          onClick: () => {
            // TODO: Implement export todos (Comment 1283)
            console.log('Export Todos - placeholder');
          },
        },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        {
          id: 'edit-todo',
          label: 'Edit Todo...',
          shortcut: 'Ctrl+E',
          onClick: () => {
            // Comment 1285: Edit Todo - Opens editor for selected todo
            // Note: Requires todo selection - will be implemented with selection state
            if (editingTodo) {
              handleEditTodo(editingTodo);
            }
          },
          disabled: !editingTodo,
        },
        {
          id: 'delete-todo',
          label: 'Delete Todo',
          shortcut: 'Delete',
          onClick: () => {
            // Comment 1286: Delete Todo - Deletes selected todo
            // Note: Requires todo selection - will be implemented with selection state
            if (editingTodo) {
              handleDeleteTodo(editingTodo.id);
            }
          },
          disabled: !editingTodo,
        },
        { id: 'separator-1', separator: true },
        {
          id: 'mark-complete',
          label: 'Mark Complete',
          shortcut: 'Ctrl+Enter',
          onClick: () => {
            // Comment 1287: Mark Complete - Marks selected todos as completed
            // Note: Requires todo selection - will be implemented with selection state
            if (editingTodo) {
              handleToggleComplete(editingTodo.id);
            }
          },
          disabled: !editingTodo,
        },
        {
          id: 'mark-incomplete',
          label: 'Mark Incomplete',
          onClick: () => {
            // Comment 1288: Mark Incomplete - Marks selected todos as incomplete
            // Note: Requires todo selection - will be implemented with selection state
            if (editingTodo) {
              handleToggleComplete(editingTodo.id);
            }
          },
          disabled: !editingTodo,
        },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        {
          id: 'show-completed',
          label: 'Show Completed',
          onClick: () => setShowCompleted(!showCompleted),
        },
        {
          id: 'show-incomplete',
          label: 'Show Incomplete',
          onClick: () => {
            // TODO: Implement show incomplete (Comment 1291)
            console.log('Show Incomplete - placeholder');
          },
        },
        { id: 'separator-1', separator: true },
        {
          id: 'group-by',
          label: 'Group By',
          onClick: () => {
            // TODO: Implement group by (Comment 1292)
            console.log('Group By - placeholder');
          },
        },
      ],
    },
    {
      id: 'tools',
      label: 'Tools',
      items: [
        {
          id: 'filter',
          label: 'Filter...',
          onClick: () => {
            // TODO: Implement filter (Comment 1294)
            console.log('Filter - placeholder');
          },
        },
        {
          id: 'sort',
          label: 'Sort...',
          onClick: () => {
            // TODO: Implement sort (Comment 1295)
            console.log('Sort - placeholder');
          },
        },
        {
          id: 'search',
          label: 'Search...',
          shortcut: 'Ctrl+F',
          onClick: () => {
            // TODO: Implement search (Comment 1296)
            console.log('Search - placeholder');
          },
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      items: [
        {
          id: 'todo-settings',
          label: 'Todo Settings...',
          onClick: () => {
            // TODO: Implement todo settings (Comment 1298)
            console.log('Todo Settings - placeholder');
          },
        },
        {
          id: 'default-filters',
          label: 'Default Filters...',
          onClick: () => {
            // TODO: Implement default filters (Comment 1299)
            console.log('Default Filters - placeholder');
          },
        },
      ],
    },
  ];

  // Toolbar items (quick action buttons)
  const toolbarItems = [
    {
      id: 'new-todo',
      label: 'New Todo',
      icon: Plus,
      variant: 'default' as const,
      onClick: handleNewTodo,
    },
    {
      id: 'filter',
      label: 'Filter',
      icon: Filter,
      onClick: () => {
        // TODO: Implement filter (Comment 1294)
        console.log('Filter clicked - placeholder');
      },
    },
    {
      id: 'sort',
      label: 'Sort',
      icon: ArrowUpDown,
      onClick: () => {
        // TODO: Implement sort (Comment 1295)
        console.log('Sort clicked - placeholder');
      },
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      onClick: () => {
        // TODO: Implement search (Comment 1296)
        console.log('Search clicked - placeholder');
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onClick: () => {
        // TODO: Implement settings (Comment 1298)
        console.log('Settings clicked - placeholder');
      },
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <MenuBar items={menuItems} />
      <Toolbar items={toolbarItems} />
      <div className="flex-1 p-6 overflow-auto" style={{ paddingRight: '16px' }}>
        {/* Filter and Sort Controls */}
        <div className="mb-4 flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="w-4 h-4"
            />
            <span style={{ color: 'var(--color-foreground)' }}>Show Completed</span>
          </label>
          <select
            value={filter.status || 'all'}
            onChange={(e) => setFilter({ ...filter, status: e.target.value as TodoFilter['status'] })}
            className="px-3 py-1.5 rounded border text-sm"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          >
            <option value="all">All Status</option>
            <option value="incomplete">Incomplete</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filter.priority || 'all'}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value as TodoFilter['priority'] })}
            className="px-3 py-1.5 rounded border text-sm"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select
            value={`${sort.field}-${sort.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSort({ field: field as TodoSortField, order: order as TodoSortOrder });
            }}
            className="px-3 py-1.5 rounded border text-sm"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          >
            <option value="dueDate-asc">Due Date (Ascending)</option>
            <option value="dueDate-desc">Due Date (Descending)</option>
            <option value="doDate-asc">Do Date (Ascending)</option>
            <option value="doDate-desc">Do Date (Descending)</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="priority-asc">Priority (Low to High)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="createdAt-desc">Created (Newest)</option>
            <option value="createdAt-asc">Created (Oldest)</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8" style={{ color: 'var(--color-muted-foreground)' }}>
            Loading todos...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8 text-red-600 dark:text-red-400">
            Error: {error.message}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && todos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg mb-2" style={{ color: 'var(--color-muted-foreground)' }}>
              No todos found
            </p>
            <p className="text-sm mb-4" style={{ color: 'var(--color-muted-foreground)' }}>
              Create your first todo to get started
            </p>
            <button
              onClick={handleNewTodo}
              className="px-4 py-2 rounded transition-colors"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
                border: 'none',
              }}
            >
              New Todo
            </button>
          </div>
        )}

        {/* Todo List */}
        {!loading && !error && todos.length > 0 && (
          <div className="space-y-2">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Todo Editor Modal */}
      {showEditor && (
        <TodoEditor
          todo={editingTodo}
          onSave={handleSaveTodo}
          onClose={() => {
            setShowEditor(false);
            setEditingTodo(undefined);
          }}
        />
      )}
    </div>
  );
};
