@echo off
REM Auto-Sort Notes - Development Launcher (Batch)
REM 
REM Purpose: Launch the application in development mode for GUI customization
REM 
REM Usage: Double-click this file or run: launch-dev.bat

echo.
echo ========================================
echo   Auto-Sort Notes - Development Launcher
echo ========================================
echo.

REM Check if we're in the correct directory
if not exist "package.json" (
    echo Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error: Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo Starting Tauri development server...
echo.
echo The application window will open shortly.
echo Press Ctrl+C to stop the development server.
echo.

REM Launch Tauri in development mode
call npm run dev:tauri

pause

