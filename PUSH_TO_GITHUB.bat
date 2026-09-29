@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title GitHub Push - Railway Management System
color 0B

echo ===============================================================================
echo                GITHUB REPOSITORY PUSH: PROJECT-VIKAS
echo       Remote: https://github.com/Lanthanode/PROJECT-VIKAS.git
echo ===============================================================================
echo.

echo [1/2] Authenticating with GitHub...
echo If a browser window opens, please sign in and authorize Git Credential Manager.
echo.

"C:\Program Files\Git\mingw64\bin\git-credential-manager.exe" github login --web

echo.
echo [2/2] Pushing commits to branch 'main'...
echo.
git push -u origin main

if %errorlevel% equ 0 (
    color 0A
    echo.
    echo ===============================================================================
    echo [SUCCESS] Successfully pushed all files to GitHub:
    echo https://github.com/Lanthanode/PROJECT-VIKAS
    echo ===============================================================================
) else (
    color 0C
    echo.
    echo ===============================================================================
    echo [NOTICE] If browser OAuth did not finish, you can also authenticate
    echo or paste your GitHub Personal Access Token (PAT) below:
    echo ===============================================================================
    echo.
    git push -u origin main
)

echo.
echo Press any key to close this window...
pause >nul
