# Changelog

## 2026-04-13

### Added
- **Tools page** in sidebar (between Search and Training) with two utilities:
  - **BF16 Converter** — convert safetensors from FP32/FP16 to BFloat16 (~50% size reduction)
  - **Model Merger** — merge two ACE-Step models with adjustable alpha blending
- `reinstall.bat` — clean reinstall preserving models, data, and output
- Sampler mode selection (Euler / Heun) in generation settings
- Changelog tab on News page (reads from CHANGELOG.md)

### Changed
- Training page redesigned from single-column to responsive 2-column grid layout
- `update.bat` now properly updates all Python dependencies (not just ace-step)

### Fixed
- TypeScript samplerMode type narrowing error
- `reinstall.bat` warns user to close app instead of killing all node processes
- `update.bat` checks node exists before running npm steps

## 2026-04-12

### Added
- **Video Studio** with full WYSIWYG editor:
  - Resolution selector + lyrics overlay with styling
  - WYSIWYG drag for ALL elements (visualizer, lyrics, text layers)
  - Selection frame (pink dashed border) on hover/drag
  - Full playback controls — timeline seekbar + volume slider
  - Visualizer scale slider + scroll-to-resize
  - 3 lyrics styles — Lines, Scroll (marquee), Karaoke (progressive fill)
  - Lyrics color settings — text color, bg color/opacity, highlight color
  - Lyrics timing offset slider (-3s to +3s) for sync
  - Default aspect ratio 1:1 (square), default lyrics style Karaoke
  - Local FFmpeg — no CDN dependency for video rendering
  - Server-side FFmpeg encoding with GPU acceleration (NVENC)
  - Chunked video encoding — frames sent in batches of 50
- **LRC toggle** (ON/OFF) under vocal language section (Simple + Custom modes)
- **Audio blocks** split into independent Reference + Cover slots
- Waveform visualization on Reference and Cover audio players
- Drag region selection on waveform for Repaint mode
- Hints under Cover/Repaint sliders explaining what they do
- Cover strength % and task type display in Sources section
- Repaint strength + region display in Sources section
- Separate AI buttons for lyrics — Generate (Wand2) + Enhance (Sparkles)
- Clear VRAM error message shown as red toast (8s duration)
- XL Merge SFT+Turbo community model (by jeankassio) with metadata and download
- Guidance range unlocked 0-20 for all models
- Triton, Python headers, Flash Attention added to `install.bat`
- Multilingual news page with links support
- Training page with Coming Soon placeholder

### Changed
- Default audio cover strength from 100% to 50%

### Fixed
- Persist BPM/Key/Duration/TimeSignature across generations
- Don't overwrite manual BPM/Key/Duration from AI suggestions
- Null safety for BPM/Key/Duration loaded from settings
- Sync LM settings only on first connect + after model switch
- Job status set to failed on queue processing error
- nano-vllm engine cleanup — atexit.unregister for proper GC
- LLM unload — free KV cache CUDA memory properly
- Skip DiT reload when only LM model changes
- VRAM management: unload LM before loading new DiT
- Flash Attention made optional with wheel dependency
- Model hot-swap: correct LLM init args, health check
- Force int8 quantization for FP32 XL models
- Cover/repaint mode — audio file handling for Gradio
- Isolate simple/custom mode params, fix TypeScript errors
- Audio cover strength slider step from 5% to 1%
- Detect incomplete model downloads and re-download automatically
- Merge model detection and download flow
- Lyrics overlay sync — used audio time instead of Date.now()
- Karaoke progress capped at 5s per line, hidden after fully sung
- Video export lyrics sync + smooth audio analysis
- npm audit — 0 vulnerabilities
- `install.bat` — hatchling, nano-vllm, deps ordering, FFmpeg, server deps, vite build

## 2026-04-11

### Added
- **ACE-Step 1.5 XL Studio** — portable AI music generation app (initial release)
- **Web UI**: Create, Library, Search, Training (placeholder), News pages
- **Simple and Custom** generation modes
- **Single terminal mode** — Express manages Python pipeline + serves frontend
- **Model hot-swap** via /v1/init Gradio API route
- **Video Studio** — resolution selector + lyrics overlay (early version)
- Audio upload in Simple mode with inline Cover/Repaint controls
- LM model selector (4B/1B) with auto-download
- vLLM backend selector with persistence
- Generation queue with concurrent job tracking
- Real-time generation progress via Gradio submit events
- Persist generation settings in database
- Multi-language support (EN, RU, ZH, JA, KO) — all strings i18n'd
- System monitoring widget (GPU/VRAM/RAM/CPU temp)
- Backend connection state indicator (backend off vs Gradio starting)
- Portable installation (embedded Python 3.12 + Node.js 22)
- Song library with playlists, likes, and search
- Right sidebar with song details — BPM/Key/Duration/Model display
- Reuse restores ALL generation params including seed/BPM/key
- Generation time (stopwatch icon) next to model badge
- Dark/light theme toggle
- User authentication system
- Resizable panels for create/songlist/details layout
- Embed ID3 tags in generated MP3 files
- Auto LRC generation and store timestamped lyrics
- Download LRC button in song details
- Generate lyrics from style when lyrics field is empty
- Undo buttons for lyrics and style fields
- Vocal/instrumental toggle switch
- Default model: `acestep-v15-xl-turbo-bf16`
- Auto-find free port if 3001 is busy (tries up to +10)
- `install.bat` — one-click setup with GPU selection (Pascal to Blackwell)
- `update.bat` — pull and rebuild
- `download_model.bat` — model downloader via huggingface-cli
- `run.bat` / `run-dev.bat` — production and development launchers

### Fixed
- Stabilize switch-model — retry port kill, wait until free
- Simple mode param isolation from Custom mode
- Inference steps clamped to model max
- Crash when sample.caption is not a string
- Resolve PYTHON_PATH to absolute path
- Prevent polling from overriding model selection during switch
- Block Simple mode generation when LLM is unavailable
- Prevent settings reset on generation
- Non-blocking connection banner instead of fullscreen spinner
