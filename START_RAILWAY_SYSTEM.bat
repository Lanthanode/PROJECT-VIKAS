@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title Railway Management System - DBMS Capstone Project

:: =====================================================================
::  PHASE 1 — GET HACKED IDIOT (1 second flash)
:: =====================================================================
mode con: cols=90 lines=40
color 0C
cls
echo.
echo.
echo   ===============================================================
echo   =                                                             =
echo   =     #####  ####### #######    #     #    #     #####  #  #  =
echo   =    #       #          #       #     #   # #   #       # #   =
echo   =    #  ###  #####      #       #######  #   #  #       ##    =
echo   =    #    #  #          #       #     # ####### #       # #   =
echo   =     #####  #######    #       #     # #     #  #####  #  #  =
echo   =                                                             =
echo   =  ######   ###  ######  ###  ###### ####### ###              =
echo   =    ##    #   #   ##   #   #   ##      #   ###              =
echo   =    ##    #   #   ##   #   #   ##      #    #               =
echo   =  ######  #####  #### #####    ##      #                    =
echo   =                                                             =
echo   ===============================================================
echo.
echo                    SURPRISE MOTHAF***A  !!
echo.
echo          Your system has been visited by ANISH VYAPARI
echo.
timeout /t 1 /nobreak >nul

:: =====================================================================
::  PHASE 2 — PAY ANISH 400
:: =====================================================================
cls
color 0E
echo.
echo.
echo   ===============================================================
echo   =                                                             =
echo   =         $$$   PAY ANISH Rs.400   $$$                       =
echo   =                                                             =
echo   =   To unlock the Railway Management System, please pay      =
echo   =   Anish Vyapari the amount of Rs. 400 via UPI / Cash.     =
echo   =                                                             =
echo   =   UPI: anish@vyapari                                       =
echo   =                                                             =
echo   ===============================================================
echo.
echo.

choice /C YN /M "Will you pay Anish Rs.400? (Y=Yes, N=No)"
if %errorlevel% equ 1 (
    :: User chose YES
    color 0A
    cls
    echo.
    echo   ===============================================================
    echo   =                                                             =
    echo   =              PAYMENT ACCEPTED! GOOD BOY!                   =
    echo   =                                                             =
    echo   =        Anish says: "Smart choice, ab chal project          =
    echo   =                     start karte hain..."                    =
    echo   =                                                             =
    echo   ===============================================================
    echo.
    timeout /t 2 /nobreak >nul
    goto START_APP
)

:: User chose NO — change wallpaper and show angry message
color 0C
cls
echo.
echo.
echo   ===============================================================
echo   =                                                             =
echo   =                  ANISH WILL BE ANGRY                       =
echo   =                                                             =
echo   =         "Tera wallpaper toh change ho gaya hai..."         =
echo   =         "Ab Rs.400 de de warna aur bura hoga!"            =
echo   =                                                             =
echo   ===============================================================
echo.
echo   [WALLPAPER] Changing your desktop wallpaper... enjoy the meme!
echo.
start "" /min powershell -ExecutionPolicy Bypass -File "%~dp0scripts\change_wallpaper.ps1" -ImagePath "%~dp0assets\wallpaper.jpg"
timeout /t 3 /nobreak >nul

:: =====================================================================
::  PHASE 3 — ACTUAL SYSTEM BOOT (works regardless of choice)
:: =====================================================================
:START_APP
cls
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
    color 0E
    echo [NOTICE] Node.js is not detected on this system.
    where winget >nul 2>nul
    if %errorlevel% equ 0 (
        echo [AUTO-SETUP] Windows Package Manager (winget) detected!
        echo Downloading and installing Node.js LTS automatically, please wait...
        winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
        echo.
        echo Node.js installation finished! Please re-run this script to start the application.
        pause
        exit /b 0
    )
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please download and install Node.js LTS from https://nodejs.org/
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
