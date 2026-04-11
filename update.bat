@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo ========================================
echo   ACE-Step Studio - Update
echo ========================================

where git >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git not found! https://git-scm.com/downloads
    pause
    exit /b 1
)

REM Update Studio wrapper
if exist ".git" (
    echo Updating ACE-Step Studio...
    git pull
)

REM Update ACE-Step 1.5
if exist "ACE-Step-1.5\.git" (
    echo Updating ACE-Step 1.5...
    cd ACE-Step-1.5
    git pull
    cd "%SCRIPT_DIR%"
    echo Updating ACE-Step Python deps...
    python\python.exe -m pip install -e ACE-Step-1.5/ --no-warn-script-location
)

REM Update npm deps
if exist "app\package.json" (
    echo Updating npm dependencies...
    set "PATH=%SCRIPT_DIR%node;%PATH%"
    cd app
    "%SCRIPT_DIR%node\npm.cmd" install
    cd "%SCRIPT_DIR%"
)

echo.
echo ========================================
echo   Update complete!
echo ========================================
pause
