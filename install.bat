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

REM === Download helper — tries curl, then certutil, then powershell ===
REM Usage: call :download URL OUTFILE
goto :skip_download_func
:download
set "_URL=%~1"
set "_OUT=%~2"
where curl >nul 2>&1 && (
    curl -L --progress-bar -o "%_OUT%" "%_URL%" && exit /b 0
)
where certutil >nul 2>&1 && (
    certutil -urlcache -split -f "%_URL%" "%_OUT%" >nul 2>&1 && exit /b 0
)
where powershell >nul 2>&1 && (
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%_URL%' -OutFile '%_OUT%'" 2>nul && exit /b 0
)
echo ERROR: Cannot download files. Install curl, certutil, or powershell.
exit /b 1
:skip_download_func

REM === Get 7-Zip standalone if not present ===
if not exist "tools\7za.exe" (
    echo [0/6] Downloading 7-Zip...
    if not exist "tools" mkdir tools
    call :download "https://www.7-zip.org/a/7za920.zip" "downloads\7za.zip"
    if not errorlevel 1 (
        REM Bootstrap: extract 7za.zip using tar or powershell
        where tar >nul 2>&1 && (
            tar -xf "downloads\7za.zip" -C "tools" 2>nul
            goto :7za_done
        )
        where powershell >nul 2>&1 && (
            powershell -Command "Expand-Archive -Path 'downloads\7za.zip' -DestinationPath 'tools' -Force" 2>nul
            goto :7za_done
        )
    )
    echo WARNING: Could not install 7-Zip.
)
:7za_done

REM === Unzip helper — tries 7za, then tar, then powershell ===
goto :skip_unzip_func
:unzip
set "_ZIP=%~1"
set "_DEST=%~2"
if not exist "%_DEST%" mkdir "%_DEST%"
if exist "%SCRIPT_DIR%tools\7za.exe" (
    "%SCRIPT_DIR%tools\7za.exe" x "%_ZIP%" -o"%_DEST%" -y >nul 2>&1 && exit /b 0
)
where tar >nul 2>&1 && (
    tar -xf "%_ZIP%" -C "%_DEST%" 2>nul && exit /b 0
)
where powershell >nul 2>&1 && (
    powershell -Command "Expand-Archive -Path '%_ZIP%' -DestinationPath '%_DEST%' -Force" 2>nul && exit /b 0
)
echo ERROR: Cannot extract archives.
exit /b 1
:skip_unzip_func

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
    call :download "https://www.python.org/ftp/python/3.12.9/python-3.12.9-embed-amd64.zip" "downloads\python.zip"
    if errorlevel 1 ( echo Failed to download Python! & pause & exit /b 1 )
    call :unzip "downloads\python.zip" "python"

    REM Patch _pth for site-packages (order matters!)
    cd python
    if exist "python312._pth" (
        echo python312.zip> python312._pth
        echo .>> python312._pth
        echo Lib\site-packages>> python312._pth
        echo ..\Lib\site-packages>> python312._pth
        echo import site>> python312._pth
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
    call :download "https://bootstrap.pypa.io/get-pip.py" "downloads\get-pip.py"
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
python\python.exe -m pip install hatchling editables --no-warn-script-location
REM Install ACE-Step without deps (torch version conflict with pyproject.toml)
python\python.exe -m pip install -e ACE-Step-1.5/ --no-deps --no-warn-script-location
REM Install remaining deps manually (without torch/torchvision/torchaudio — already installed)
python\python.exe -m pip install "transformers>=4.51.0,<4.58.0" diffusers gradio==6.2.0 matplotlib scipy soundfile loguru einops accelerate fastapi diskcache "uvicorn[standard]" numba vector-quantize-pytorch torchcodec "torchao>=0.16.0,<0.17.0" toml peft modelscope tensorboard typer-slim hf_transfer --no-warn-script-location
REM Install nano-vllm (local LM inference engine)
python\python.exe -m pip install -e ACE-Step-1.5/acestep/third_parts/nano-vllm/ --no-warn-script-location

REM ============================================================
REM  Step 6: Node.js
REM ============================================================
if exist "node\node.exe" (
    echo [OK] Node.js already installed
) else (
    echo [5/6] Downloading Node.js 22 LTS...
    if not exist "node" mkdir node
    call :download "https://nodejs.org/dist/v22.18.0/node-v22.18.0-win-x64.zip" "downloads\node.zip"
    if errorlevel 1 ( echo Failed to download Node.js! & pause & exit /b 1 )
    call :unzip "downloads\node.zip" "downloads\node-extract"
    REM Move contents from nested folder to node/
    for /d %%D in ("downloads\node-extract\node-*") do (
        xcopy "%%D\*" "node\" /E /Y /Q >nul 2>&1
    )
    if exist "downloads\node-extract" rmdir /s /q "downloads\node-extract"
    echo [OK] Node.js 22 LTS installed
)

REM ============================================================
REM  Step 7: npm dependencies
REM ============================================================
echo [6/7] Installing npm dependencies...
set "PATH=%SCRIPT_DIR%node;%PATH%"
REM Use portable node for npm

REM Frontend deps
echo   Installing frontend deps...
cd /d "%SCRIPT_DIR%"
cd app
call "%SCRIPT_DIR%node\npm.cmd" install

REM Server deps (better-sqlite3, tsx, node-id3, etc.)
echo   Installing server deps...
cd /d "%SCRIPT_DIR%"
cd app\server
call "%SCRIPT_DIR%node\npm.cmd" install

REM ============================================================
REM  Step 8: Build frontend
REM ============================================================
echo [7/7] Building frontend...
cd /d "%SCRIPT_DIR%"
cd app
call "%SCRIPT_DIR%node\npx.cmd" vite build

REM ============================================================
REM  Step 9: FFmpeg (for video rendering)
REM ============================================================
if not exist "ffmpeg\ffmpeg.exe" (
    echo Downloading FFmpeg...
    if not exist "ffmpeg" mkdir ffmpeg
    call :download "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip" "downloads\ffmpeg.zip"
    if not errorlevel 1 (
        call :unzip "downloads\ffmpeg.zip" "downloads\ffmpeg-extract"
        for /d %%D in ("downloads\ffmpeg-extract\ffmpeg-*") do (
            copy "%%D\bin\ffmpeg.exe" "ffmpeg\ffmpeg.exe" >nul 2>&1
            copy "%%D\bin\ffprobe.exe" "ffmpeg\ffprobe.exe" >nul 2>&1
        )
        if exist "downloads\ffmpeg-extract" rmdir /s /q "downloads\ffmpeg-extract"
        echo [OK] FFmpeg installed
    ) else (
        echo WARNING: Could not download FFmpeg. Video rendering will not work.
    )
)

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
