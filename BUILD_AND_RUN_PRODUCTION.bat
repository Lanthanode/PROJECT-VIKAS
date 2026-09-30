@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title Railway Management System - Production Build and Runner
color 0B

echo ===============================================================================
echo                RAILWAY MANAGEMENT SYSTEM - PRODUCTION LAUNCHER
echo       PostgreSQL Relational Engine - Optimized Production Server
echo ===============================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0E
    echo [NOTICE] Node.js is not detected on this system.
    where winget >nul 2>nul
    if %errorlevel% equ 0 (
        echo [AUTO-SETUP] Windows Package Manager (winget) detected!
        echo Downloading and installing Node.js LTS automatically, please wait...
        winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
        echo.
        echo Node.js installation finished! Please re-run this script to build and start.
        pause
        exit /b 0
    )
    color 0C
    echo [ERROR] Node.js is required!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

if not exist node_modules (
    echo [Setup] node_modules not found. Auto-installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Dependency installation failed!
        pause
        exit /b 1
    )
)

echo [1/3] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Production build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Freeing port 3000 if occupied...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    taskkill /f /pid %%a >nul 2>nul
)

echo [3/3] Starting production server on http://localhost:3000 ...
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

echo ===============================================================================
echo  Application is running in production mode at http://localhost:3000
echo  Press Ctrl + C to stop the server.
echo ===============================================================================
echo.

call npm run start
if %errorlevel% neq 0 (
    echo.
    echo [NOTE] Server stopped or exited with code %errorlevel%.
)
echo.
echo Press any key to close this window...
pause >nul
