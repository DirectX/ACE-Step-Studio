# Changelog

## 2026-04-13

### Added
- **Tools page** with two model utilities in sidebar (between Search and Training):
  - **BF16 Converter** — convert safetensors from FP32/FP16 to BFloat16 (~50% size reduction)
  - **Model Merger** — merge two ACE-Step models with adjustable alpha blending
- `reinstall.bat` — clean reinstall preserving models, data, and output
- Sampler mode selection (Euler / Heun) in generation settings
- Changelog tab on News page
- i18n keys for Tools page in all 5 languages

### Changed
- Training page redesigned from single-column to responsive 2-column grid layout
- `update.bat` now properly updates all Python dependencies

### Fixed
- TypeScript samplerMode type narrowing error

## 2026-04-12

### Added
- XL Merge SFT+Turbo community model (by jeankassio) with metadata and download
- Guidance range unlocked 0-20 for all models

### Fixed
- Merge model detection and download flow
- modelDescMerge i18n key across 5 languages

## 2026-04-11

### Added
- Drag region selection on waveform for Repaint mode
- Hints under Cover/Repaint sliders explaining what they do
- Cover strength % and task type display in Sources section
- Repaint strength + region display in Sources section
- Reference and Cover as two independent audio blocks
- Waveform visualization on audio players

### Changed
- Default audio cover strength from 100% to 50%

### Fixed
- Persist BPM/Key/Duration/TimeSignature across generations
- Don't overwrite manual BPM/Key/Duration from AI suggestions
- Null safety for settings loaded from database
- npm audit — 0 vulnerabilities

## 2026-04-10

### Added
- LRC ON/OFF toggle under vocal language section (Simple + Custom modes)
- Clear VRAM error message shown as red toast (8s duration)
- News page with multilingual content and links support

### Changed
- Audio blocks split into independent Reference + Cover slots

### Fixed
- Sync LM settings only on first connect + after model switch
- Job status set to failed on queue processing error
- nano-vllm engine cleanup — atexit.unregister for proper GC
- LLM unload uses direct exit() call to free KV cache CUDA memory
- Skip DiT reload when only LM model changes
- VRAM management: unload LM before loading new DiT
- Flash Attention made optional with wheel dependency

## 2026-04-09

### Added
- Model hot-swap via /v1/init Gradio API route with --enable-api
- Persist generation settings in database
- Real-time generation progress via Gradio submit events
- Backend connection state indicator (backend off vs Gradio starting)
- vLLM backend selector with persistence

### Fixed
- Model hot-swap: correct LLM init args, VRAM management, health check
- Force int8 quantization for FP32 XL models
- Prevent settings reset on generation
- Detect incomplete model downloads and re-download automatically
- Cover/repaint mode — audio file handling for Gradio
- Isolate simple/custom mode params, fix TypeScript errors
- Default audio cover strength step from 5% to 1%

## 2026-04-08

### Added
- ACE-Step 1.5 XL Studio — portable AI music generation app
- Web UI: Create, Library, Search, Training (placeholder), News
- Simple and Custom generation modes
- Audio upload in Simple mode with inline Cover/Repaint controls
- LM model selector (4B/1B) with auto-download
- Generation queue with concurrent job tracking
- Multi-language support (EN, RU, ZH, JA, KO)
- System monitoring widget (GPU/VRAM/RAM/CPU temp)
- Portable installation (embedded Python 3.12 + Node.js 22)
- Song library with playlists, likes, and search
- Right sidebar with song details and Sources info
- Dark/light theme toggle
- User authentication system
- `install.bat` — one-click setup with GPU selection
- `update.bat` — pull and rebuild
- `download_model.bat` — model downloader via huggingface-cli
- `run.bat` / `run-dev.bat` — production and development launchers
