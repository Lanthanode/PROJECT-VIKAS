@echo off
title Railway Management System - DBMS Capstone Project
color 0A

echo ===============================================================================
echo                RAILWAY MANAGEMENT SYSTEM - DBMS CAPSTONE
echo       Real-Life Scenario: Indian Railways Passenger Reservation
echo       Project Lead: Vikas Yadav | Indian Railways DBMS Capstone
echo ===============================================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] Node.js environment detected...
node -v

:: 2. Check if dependencies are installed
if not exist node_modules (
    echo [2/3] node_modules not found. Installing dependencies...
    call npm install
) else (
    echo [2/3] Project dependencies verified.
)

:: 3. Launch browser in 3 seconds in the background
echo [3/3] Starting Railway Management System on http://localhost:3000 ...
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

:: 4. Start Next.js server
echo.
echo ===============================================================================
echo  Application is running! Opening http://localhost:3000 in your browser...
echo  PostgreSQL Relational Engine: ACTIVE
echo  Press Ctrl + C in this window to stop the application.
echo ===============================================================================
echo.

call npm run dev
pause
