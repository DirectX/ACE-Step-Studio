@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   ACE-Step Studio - Install
echo ========================================

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"
set "TEMP=%SCRIPT_DIR%temp"
set "TMP=%SCRIPT_DIR%temp"

REM === Create directories ===
if not exist "downloads" mkdir downloads
if not exist "temp" mkdir temp
if not exist "models" mkdir models
if not exist "cache" mkdir cache
if not exist "app\data" mkdir "app\data"
if not exist "app\server\public\audio" mkdir "app\server\public\audio"

REM ============================================================
REM  Step 1: GPU Selection
REM ============================================================
echo.
echo Select your GPU:
echo.
echo   1. NVIDIA GTX 10xx (Pascal)
echo   2. NVIDIA RTX 20xx (Turing)
echo   3. NVIDIA RTX 30xx (Ampere)
echo   4. NVIDIA RTX 40xx (Ada Lovelace)
echo   5. NVIDIA RTX 50xx (Blackwell)
echo   6. CPU only (no GPU)
echo.
set /p GPU_CHOICE="Enter number (1-6): "

if "%GPU_CHOICE%"=="1" goto :gpu_10xx
if "%GPU_CHOICE%"=="2" goto :gpu_20xx
if "%GPU_CHOICE%"=="3" goto :gpu_30xx
if "%GPU_CHOICE%"=="4" goto :gpu_40xx
if "%GPU_CHOICE%"=="5" goto :gpu_50xx
if "%GPU_CHOICE%"=="6" goto :gpu_cpu
echo Invalid choice!
pause
exit /b 1

:gpu_10xx
set "CUDA_VERSION=cu118"
set "CUDA_NAME=CUDA 11.8 (GTX 10xx)"
set "TORCH_VERSION=2.7.1"
set "TORCHAUDIO_VERSION=2.7.1"
goto :gpu_done

:gpu_20xx
set "CUDA_VERSION=cu126"
set "CUDA_NAME=CUDA 12.6 (RTX 20xx)"
set "TORCH_VERSION=2.7.1"
set "TORCHAUDIO_VERSION=2.7.1"
goto :gpu_done

:gpu_30xx
set "CUDA_VERSION=cu126"
set "CUDA_NAME=CUDA 12.6 (RTX 30xx)"
set "TORCH_VERSION=2.7.1"
set "TORCHAUDIO_VERSION=2.7.1"
goto :gpu_done

:gpu_40xx
set "CUDA_VERSION=cu128"
set "CUDA_NAME=CUDA 12.8 (RTX 40xx)"
set "TORCH_VERSION=2.7.1"
set "TORCHAUDIO_VERSION=2.7.1"
goto :gpu_done

:gpu_50xx
set "CUDA_VERSION=cu128"
set "CUDA_NAME=CUDA 12.8 (RTX 50xx)"
set "TORCH_VERSION=2.7.1"
set "TORCHAUDIO_VERSION=2.7.1"
goto :gpu_done

:gpu_cpu
set "CUDA_VERSION=cpu"
set "CUDA_NAME=CPU only"
set "TORCH_VERSION=2.7.1"
set "TORCHAUDIO_VERSION=2.7.1"
goto :gpu_done

:gpu_done
echo.
echo Selected: %CUDA_NAME%
echo.

REM ============================================================
REM  Step 2: Python 3.12 Embedded
REM ============================================================
if exist "python\python.exe" (
    echo [OK] Python already installed
) else (
    echo [1/6] Downloading Python 3.12.9...
    if not exist "python" mkdir python
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.12.9/python-3.12.9-embed-amd64.zip' -OutFile 'downloads\python.zip'}"
    powershell -Command "& {Expand-Archive -Path 'downloads\python.zip' -DestinationPath 'python' -Force}"

    REM Patch _pth for site-packages
    cd python
    if exist "python312._pth" (
        echo import site> python312._pth
        echo.>> python312._pth
        echo python312.zip>> python312._pth
        echo .>> python312._pth
        echo ..\Lib\site-packages>> python312._pth
    )
    cd ..
    echo [OK] Python 3.12.9 installed
)

REM ============================================================
REM  Step 3: pip
REM ============================================================
if exist "python\Scripts\pip.exe" (
    echo [OK] pip already installed
) else (
    echo [2/6] Installing pip...
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://bootstrap.pypa.io/get-pip.py' -OutFile 'downloads\get-pip.py'}"
    python\python.exe downloads\get-pip.py --no-warn-script-location
)
python\python.exe -m pip install --upgrade pip --no-warn-script-location

REM ============================================================
REM  Step 4: PyTorch
REM ============================================================
echo [3/6] Installing PyTorch %TORCH_VERSION% (%CUDA_NAME%)...
python\python.exe -m pip install torch==%TORCH_VERSION% torchaudio==%TORCHAUDIO_VERSION% --index-url https://download.pytorch.org/whl/%CUDA_VERSION% --no-warn-script-location

REM ============================================================
REM  Step 5: ACE-Step dependencies
REM ============================================================
echo [4/6] Installing ACE-Step dependencies...
python\python.exe -m pip install -e ACE-Step-1.5/ --no-warn-script-location
python\python.exe -m pip install hf_transfer --no-warn-script-location

REM ============================================================
REM  Step 6: Node.js
REM ============================================================
if exist "node\node.exe" (
    echo [OK] Node.js already installed
) else (
    echo [5/6] Downloading Node.js 24...
    if not exist "node" mkdir node
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v24.11.0/node-v24.11.0-win-x64.zip' -OutFile 'downloads\node.zip'}"
    powershell -Command "& {Expand-Archive -Path 'downloads\node.zip' -DestinationPath 'downloads\node-extract' -Force}"
    powershell -Command "& {Get-ChildItem 'downloads\node-extract\node-*\*' | Move-Item -Destination 'node' -Force}"
    if exist "downloads\node-extract" rmdir /s /q "downloads\node-extract"
    echo [OK] Node.js 24 installed
)

REM ============================================================
REM  Step 7: npm dependencies
REM ============================================================
echo [6/6] Installing npm dependencies...
set "PATH=%SCRIPT_DIR%node;%PATH%"
REM Force native modules to build for portable node, not system node
for /f "tokens=*" %%v in ('"%SCRIPT_DIR%node\node.exe" -v') do set "NODE_VER=%%v"
set "NODE_VER=%NODE_VER:~1%"
set "npm_config_target=%NODE_VER%"
set "npm_config_target_arch=x64"
set "npm_config_runtime=node"
cd app
"%SCRIPT_DIR%node\npm.cmd" install
cd "%SCRIPT_DIR%"

REM ============================================================
REM  Save GPU config
REM ============================================================
echo %CUDA_VERSION%> cuda_version.txt

echo.
echo ========================================
echo   Installation complete!
echo.
echo   To download models: download_model.bat
echo   To start: run.bat
echo ========================================
pause
