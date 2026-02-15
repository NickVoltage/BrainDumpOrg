# Auto-Sort Notes - Development Launcher
# 
# Purpose: Launch the application in development mode for GUI customization
# 
# Usage: .\launch-dev.ps1
# Or: Right-click and "Run with PowerShell"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Auto-Sort Notes - Development Launcher" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to install dependencies." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Starting Tauri development server...`n" -ForegroundColor Green
Write-Host "The application window will open shortly." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the development server.`n" -ForegroundColor Gray

# Launch Tauri in development mode
npm run dev:tauri

