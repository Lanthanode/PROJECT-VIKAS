@echo off
setlocal EnableDelayedExpansion
title Railway Management System - DBMS Capstone Project

:: =====================================================================
::  STEP 0: LOCATE PROJECT ROOT & HANDLE UNEXTRACTED ZIP ARCHIVES
:: =====================================================================
cd /d "%~dp0"

:: 1. Check if package.json is in current directory
if exist "%CD%\package.json" goto ROOT_VERIFIED

:: 2. Check if package.json is in a nested subfolder (e.g. PROJECT-VIKAS-main or niggaVIKAS)
if exist "%CD%\PROJECT-VIKAS-main\package.json" (
    cd /d "%CD%\PROJECT-VIKAS-main"
    goto ROOT_VERIFIED
)
if exist "%CD%\niggaVIKAS\package.json" (
    cd /d "%CD%\niggaVIKAS"
    goto ROOT_VERIFIED
)
for /d %%D in ("%CD%\*") do (
    if exist "%%D\package.json" (
        cd /d "%%D"
        goto ROOT_VERIFIED
    )
)

:: 3. Check if package.json is in parent directory
if exist "%CD%\..\package.json" (
    cd /d "%CD%\.."
    goto ROOT_VERIFIED
)

:: 4. If package.json is STILL not found, user ran directly inside ZIP or Temp folder!
goto ZIP_DETECTED

:ZIP_DETECTED
mode con: cols=90 lines=32
color 0E
cls
echo ===============================================================================
echo            [AUTO-SETUP] UNEXTRACTED ZIP ARCHIVE DETECTED
echo ===============================================================================
echo.
echo  You launched this script directly from inside a ZIP file.
echo  Windows cannot run Node.js and Next.js from inside a compressed archive.
echo.
echo  Attempting to find your downloaded ZIP file and extract it automatically...
echo.

(
echo $down = @($env:USERPROFILE + '\Downloads', $env:USERPROFILE + '\Desktop', $env:USERPROFILE + '\OneDrive\Desktop', $env:USERPROFILE + '\OneDrive\Downloads')
echo $z = @(Get-ChildItem -Path $down -Filter '*VIKAS*.zip' -ErrorAction SilentlyContinue ^| Sort-Object LastWriteTime -Descending)
echo if ($z.Count -eq 0) { $z = @(Get-ChildItem -Path $down -Filter '*.zip' -ErrorAction SilentlyContinue ^| Where-Object { $_.Name -like '*project*' -or $_.Name -like '*railway*' } ^| Sort-Object LastWriteTime -Descending) }
echo if ($z.Count -gt 0) {
echo     $target = $env:USERPROFILE + '\Downloads\PROJECT-VIKAS'
echo     Write-Host '[AUTO-SETUP] Found downloaded ZIP: ' $z[0].FullName -ForegroundColor Cyan
echo     Write-Host '[AUTO-SETUP] Extracting project to ' $target ' ... Please wait...' -ForegroundColor Cyan
echo     Expand-Archive -LiteralPath $z[0].FullName -DestinationPath $target -Force
echo     $bat = @(Get-ChildItem -Path $target -Filter 'START_RAILWAY_SYSTEM.bat' -Recurse -ErrorAction SilentlyContinue ^| Select-Object -First 1)
echo     if ($bat.Count -gt 0) {
echo         Write-Host '[AUTO-SETUP] Extraction complete! Launching Railway System...' -ForegroundColor Green
echo         Start-Process -FilePath 'cmd.exe' -ArgumentList ('/c \"' + $bat[0].FullName + '\"')
echo         exit 0
echo     }
echo }
echo exit 1
) > "%TEMP%\vikas_extract.ps1"

powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP%\vikas_extract.ps1"
set EXTRACT_RESULT=%errorlevel%
del "%TEMP%\vikas_extract.ps1" 2>nul

if %EXTRACT_RESULT% equ 0 (
    echo.
    echo [AUTO-SETUP] Launched from extracted folder! You can close this window.
    timeout /t 3 /nobreak >nul
    exit /b 0
)

:: If auto-extract could not locate the zip, display crystal-clear 4-step instructions
color 0C
cls
echo ===============================================================================
echo                     [CRITICAL ACTION REQUIRED: EXTRACT ZIP]
echo ===============================================================================
echo.
echo  You are running directly inside the ZIP file without extracting!
echo  Windows temporarily isolated this file, so the rest of the project is missing.
echo.
echo  -----------------------------------------------------------------------------
echo   PLEASE FOLLOW THESE 4 SIMPLE STEPS:
echo  -----------------------------------------------------------------------------
echo   1. Close this window.
echo   2. Go to your 'Downloads' folder.
echo   3. RIGHT-CLICK on 'PROJECT-VIKAS-main.zip' and click "Extract All...".
echo   4. Click the "Extract" button.
echo   5. Open the newly extracted folder and double-click START_RAILWAY_SYSTEM.bat!
echo  -----------------------------------------------------------------------------
echo.
echo Press any key to exit...
pause >nul
exit /b 1

:ROOT_VERIFIED

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
echo   =   UPI: 8422936009@mbk                                      =
echo   =                                                             =
echo   ===============================================================
echo.
echo.

choice /C YN /M "Will you pay Anish Rs.400? (Y=Yes, N=No)"
if %errorlevel% equ 2 goto CHOSE_NO
goto CHOSE_YES

:CHOSE_YES
color 0A
cls
echo.
echo   ===============================================================
echo   =                                                             =
echo   =              PAYMENT ACCEPTED! GOOD BOY!                   =
echo   =                                                             =
echo   =        Anish says: "Smart choice! Setting QR code on       =
echo   =                     desktop so you can scan & pay..."      =
echo   =                                                             =
echo   =        UPI ID: 8422936009@mbk                              =
echo   =                                                             =
echo   ===============================================================
echo.
echo   [WALLPAPER] Setting payment QR code as your desktop wallpaper...
echo.
start "" /min powershell -ExecutionPolicy Bypass -File "%CD%\scripts\change_wallpaper.ps1" -ImagePath "%CD%\assets\qr_payment.jpg"
timeout /t 3 /nobreak >nul
goto START_APP

:CHOSE_NO
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
start "" /min powershell -ExecutionPolicy Bypass -File "%CD%\scripts\change_wallpaper.ps1" -ImagePath "%CD%\assets\wallpaper.jpg"
timeout /t 3 /nobreak >nul
goto START_APP

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

:: 1. Add common Node.js install paths to current session PATH
set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\node;%PATH%"

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0E
    echo [NOTICE] Node.js is not detected on this system.
    where winget >nul 2>nul
    if %errorlevel% equ 0 (
        echo [AUTO-SETUP] Windows Package Manager ^(winget^) detected!
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
if not exist "%CD%\node_modules" (
    echo [2/3] node_modules folder not found. Installing dependencies...
    echo First-time run setup in progress, please wait...
    call npm install
    if %errorlevel% neq 0 (
        color 0E
        echo [WARN] Standard npm install had an issue. Retrying with --legacy-peer-deps...
        call npm install --legacy-peer-deps
        if %errorlevel% neq 0 (
            color 0C
            echo [ERROR] npm install encountered an error.
            echo Please check your internet connection and try running 'npm install' manually.
            pause
            exit /b 1
        )
    )
) else (
    echo [2/3] Project dependencies verified.
)
echo.

:: 3. Free port 3000 if occupied by any previous hung process
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr /i LISTENING 2^>nul') do (
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
