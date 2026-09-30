@echo off
setlocal
title Railway Management System - Production Build and Runner
color 0B

:: Locate project root & handle nested folders
cd /d "%~dp0"
if exist "package.json" goto ROOT_FOUND
if exist "PROJECT-VIKAS-main\package.json" cd /d "PROJECT-VIKAS-main"
if exist "package.json" goto ROOT_FOUND
if exist "PROJECT-VIKAS\package.json" cd /d "PROJECT-VIKAS"
if exist "package.json" goto ROOT_FOUND
if exist "niggaVIKAS\package.json" cd /d "niggaVIKAS"
if exist "package.json" goto ROOT_FOUND
if exist "..\package.json" cd /d ".."
if exist "package.json" goto ROOT_FOUND

color 0C
echo [ERROR] package.json not found! Please make sure you have extracted the ZIP file completely.
pause
exit /b 1

:ROOT_FOUND

echo ===============================================================================
echo                RAILWAY MANAGEMENT SYSTEM - PRODUCTION LAUNCHER
echo       PostgreSQL Relational Engine - Optimized Production Server
echo ===============================================================================
echo.

set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\node;%PATH%"

where node >nul 2>nul
if %errorlevel% equ 0 goto NODE_OK

color 0E
echo [NOTICE] Node.js is not detected in current PATH.
where winget >nul 2>nul
if %errorlevel% neq 0 goto NODE_MISSING

echo [AUTO-SETUP] Installing Node.js LTS via Windows Package Manager, please wait...
winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\node;%PATH%"

where node >nul 2>nul
if %errorlevel% equ 0 goto NODE_OK

:NODE_MISSING
color 0C
echo [ERROR] Node.js is required!
echo Please install Node.js from https://nodejs.org/
echo.
pause
exit /b 1

:NODE_OK

if exist "%CD%\node_modules" goto DEPS_OK

echo [Setup] node_modules not found. Auto-installing dependencies...
call npm install
if %errorlevel% equ 0 goto DEPS_OK

echo [WARN] Retrying with --legacy-peer-deps...
call npm install --legacy-peer-deps
if %errorlevel% equ 0 goto DEPS_OK

color 0C
echo [ERROR] Dependency installation failed!
pause
exit /b 1

:DEPS_OK

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
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr /i LISTENING 2^>nul') do (
    taskkill /f /pid %%a >nul 2>nul
)

echo [3/3] Starting production server on http://localhost:3000 ...
start "" cmd /c "ping -n 3 127.0.0.1 >nul && start http://localhost:3000"

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
pause
