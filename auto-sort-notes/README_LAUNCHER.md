# Application Launcher - Development Mode

## Quick Start

To launch the application in development mode for GUI customization:

### Windows (PowerShell)
```powershell
.\launch-dev.ps1
```

### Windows (Command Prompt / Batch)
Double-click `launch-dev.bat` or run:
```cmd
launch-dev.bat
```

### Manual Launch
```bash
npm run dev:tauri
```

## What Happens

1. **Dependencies Check**: Automatically installs npm dependencies if needed
2. **Development Server**: Starts Vite dev server (frontend)
3. **Tauri App**: Opens the Tauri application window
4. **Hot Reload**: Changes to code will automatically reload in the app

## Current Application State

The application currently has:
- ✅ Complete GUI foundation (navigation, theme system, shared components)
- ✅ Placeholder views for all 6 tabs:
  - Dashboard
  - Document Editor (Notes/Docs)
  - Calendar
  - To-Do List (Do/Due)
  - Alarm/Timer
  - Custom Metadata Association
- ✅ Theme system (light/dark mode toggle)
- ✅ Tab navigation
- ✅ Error handling

## GUI Customization

You can now customize:
- **Colors**: Edit `src/renderer/styles/variables.css` (CSS variables)
- **Layouts**: Edit component files in `src/renderer/shared/components/`
- **Tab Views**: Edit placeholder components in `src/renderer/features/*/components/`
- **Theme**: Customize theme in `src/renderer/config/themes.ts`

## Stopping the Application

Press `Ctrl+C` in the terminal to stop the development server and close the application.

## Troubleshooting

### Port Already in Use
If port 1420 is already in use, you may need to:
1. Close any other instances of the app
2. Check for other processes using the port

### Build Errors
If you encounter build errors:
1. Make sure all dependencies are installed: `npm install`
2. Check that Rust is installed: `rustc --version`
3. Check that Tauri CLI is installed: `tauri --version`

### Application Won't Open
1. Check the terminal for error messages
2. Verify Tauri configuration in `src-tauri/tauri.conf.json`
3. Make sure the Vite dev server starts successfully

