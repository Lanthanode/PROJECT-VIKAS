@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title Railway Management System - DBMS Capstone Project
color 0A

echo ===============================================================================
echo                RAILWAY MANAGEMENT SYSTEM - DBMS CAPSTONE
echo       Real-Life Scenario: Indian Railways Passenger Reservation
echo       PostgreSQL Relational Engine - Next.js 15 Full-Stack System
echo ===============================================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [1/3] Node.js environment detected:
node -v
echo.

:: 2. Check if dependencies are installed
if not exist node_modules (
    echo [2/3] node_modules folder not found. Installing dependencies...
    echo First-time run setup in progress, please wait...
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] npm install encountered an error.
        pause
        exit /b 1
    )
) else (
    echo [2/3] Project dependencies verified.
)
echo.

:: 3. Free port 3000 if occupied by any previous hung process
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    echo [INFO] Freeing port 3000 from stale process PID %%a...
    taskkill /f /pid %%a >nul 2>nul
)

:: 4. Launch browser in 3 seconds in the background
echo [3/3] Starting Railway Management System on http://localhost:3000 ...
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

:: 5. Start Next.js server
echo ===============================================================================
echo  Application is running! Opening http://localhost:3000 in your browser...
echo  PostgreSQL Relational Engine: ACTIVE [Zero external DB install required]
echo  Press Ctrl + C in this window to stop the application.
echo ===============================================================================
echo.

call npm run dev
if %errorlevel% neq 0 (
    echo.
    echo [NOTE] Server exited with code %errorlevel%.
)
echo.
echo Press any key to close this window...
pause >nul
