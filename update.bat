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

REM Update ACE-Step Studio (includes ACE-Step-1.5 backend)
if exist ".git" (
    echo Updating ACE-Step Studio...
    git stash >nul 2>&1
    git pull
    git stash pop >nul 2>&1
)

REM Reinstall Python deps (in case ACE-Step-1.5 was updated)
if exist "python\python.exe" (
    echo Updating ACE-Step Python deps...
    python\python.exe -m pip install -e ACE-Step-1.5/ --no-warn-script-location
)

REM Update npm deps
set "PATH=%SCRIPT_DIR%node;%PATH%"
if exist "app\package.json" (
    echo Updating frontend dependencies...
    cd app
    call "%SCRIPT_DIR%node\npm.cmd" install
    cd "%SCRIPT_DIR%"
)
if exist "app\server\package.json" (
    echo Updating server dependencies...
    cd app\server
    call "%SCRIPT_DIR%node\npm.cmd" install
    cd "%SCRIPT_DIR%"
)

REM Rebuild frontend
if exist "app\vite.config.ts" (
    echo Rebuilding frontend...
    cd app
    call "%SCRIPT_DIR%node\npx.cmd" vite build
    cd "%SCRIPT_DIR%"
)

echo.
echo ========================================
echo   Update complete!
echo ========================================
pause
