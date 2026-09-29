@echo off
title Railway Management System - Production Build & Runner
color 0B

echo ===============================================================================
echo                RAILWAY MANAGEMENT SYSTEM - PRODUCTION LAUNCHER
echo ===============================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required!
    pause
    exit /b 1
)

echo Building production application...
call npm run build

if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo Starting production server on http://localhost:3000 ...
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

call npm run start
pause
