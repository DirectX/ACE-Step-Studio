# ACE-Step Studio

<div align="center">

**Suno at home. Local AI music generation studio — songs, vocals, lyrics, covers, music videos.**

[![Stars](https://img.shields.io/github/stars/timoncool/ACE-Step-Studio?style=social)](https://github.com/timoncool/ACE-Step-Studio/stargazers)
[![License](https://img.shields.io/github/license/timoncool/ACE-Step-Studio)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/timoncool/ACE-Step-Studio)](https://github.com/timoncool/ACE-Step-Studio/commits/master)

**[Русская версия](README_RU.md)**

![ACE-Step Studio](docs/screenshots/main-ui.png)

</div>

Create full songs with vocals, lyrics, covers, remixes and music videos — **100% local**, no cloud, no subscriptions, no internet required. One-click install on Windows, runs on any NVIDIA GPU with 12+ GB VRAM.

Built on [ACE-Step 1.5 XL](https://github.com/ace-step/ACE-Step-1.5) — the open-source 4B parameter DiT music generation model.

## Why ACE-Step Studio?

- **Free forever** — no API keys, no credits, no usage limits
- **Private** — your music never leaves your machine
- **Portable** — everything in one folder, copy to USB, delete = uninstall
- **One-click** — `install.bat` → `run.bat` → make music

## Features

### Music Generation
- **Full songs with vocals** — up to 8 minutes, any language, any genre
- **Simple & Custom modes** — describe what you want or fine-tune every parameter
- **3 XL Models** — XL Turbo (8 steps, fast), XL SFT (50 steps, max quality), XL Turbo BF16 (compact, 7.5 GB)
- **AI Lyrics & Style** — LLM generates lyrics and enriches style descriptions
- **Hot Model Switching** — change DiT/LM models without restart
- **Batch generation** — create multiple variations at once
- **ID3 tags** — MP3 files include title, artist, cover art, lyrics, BPM

### Cover & Remix
- **Cover mode** — transform existing audio into a new style while keeping the melody
- **Repaint mode** — regenerate specific sections of a song (region selection on waveform)
- **Reference audio** — use a reference track to guide the generation style
- **Audio strength control** — blend between source and generated audio

### Video Studio

![Video Studio](docs/screenshots/video-studio.png)

- **Music video generator** — NCS-style visualizers with 10 presets
- **Karaoke lyrics** — synchronized LRC subtitles with 3 styles (lines, scroll, karaoke fill)
- **WYSIWYG editor** — drag elements, scroll to resize, selection frames
- **Aspect ratios** — 16:9, 9:16 (Reels/TikTok), 1:1 (Instagram)
- **12 effects** — shake, glitch, VHS, CCTV, scanlines, bloom, film grain, strobe, vignette, hue shift, letterbox, pixelate
- **Background** — random, custom image, Pexels search, video backgrounds
- **Server-side rendering** — native ffmpeg with NVENC GPU acceleration

### Audio Tools
- **Audio editor** — trim, fade, effects (AudioMass)
- **Stem extraction** — separate vocals, drums, bass, other (Demucs)
- **LRC download** — export synchronized lyrics

### Interface
- **Single terminal** — one `run.bat`, Express manages Python/Gradio automatically
- **Portable** — everything in one folder, no system-wide installs
- **7 languages** — English, Russian, Chinese, Japanese, Korean + more
- **LAN access** — use from any device on your network (phone, tablet)
- **GPU monitoring** — live VRAM, RAM, CPU, temperature stats
- **Dark/Light theme**

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| GPU VRAM | 12 GB | 20+ GB |
| RAM | 16 GB | 32 GB |
| Disk | 30 GB | 60 GB (all models) |
| OS | Windows 10/11 | Windows 11 |
| GPU | RTX 3060+ | RTX 4090 |

## Quick Start

### 1. Clone

```bash
git clone https://github.com/timoncool/ACE-Step-Studio.git
cd ACE-Step-Studio
```

### 2. Install

```
install.bat
```

Select your GPU type (CUDA 12.8 / 12.6 / 12.4). Installs portable Python 3.12, PyTorch, Node.js 22, and all dependencies — nothing system-wide.

### 3. Run

```
run.bat
```

Browser opens automatically at http://localhost:3001. Models download on first run (~7.5 GB for default BF16 model).

## Launchers

| Script | Description |
|--------|-------------|
| `run.bat` | Standard launch — DiT + LM (0.6B PT), full features |
| `run-no-lm.bat` | Launch without LM — more VRAM for DiT, cover/repaint work, no AI lyrics/thinking |
| `run-dev.bat` | Dev mode — 3 terminals with Vite HMR |
| `install.bat` | One-click installer |
| `update.bat` | Update code + deps + rebuild frontend |
| `reinstall.bat` | Clean reinstall (preserves models and data) |
| `download_model.bat` | Pre-download models |

## Models

| Model | Size | Steps | Speed | Quality |
|-------|------|-------|-------|---------|
| XL Turbo BF16 | 7.5 GB | 8 | Fast | High |
| XL Turbo | 18.8 GB | 8 | Fast | Very High |
| XL SFT | 18.8 GB | 50 | Slow | Highest |
| XL Merge SFT+Turbo | 18.8 GB | 12 | Medium | Very High |

### LM Models (text/lyrics AI)

| Model | VRAM | Quality |
|-------|------|---------|
| 0.6B | ~0.5 GB | Basic |
| 1.7B | ~1.5 GB | Good |
| 4B | ~4 GB | Best |

LM backend: **PT** (PyTorch, lighter) or **vLLM** (faster inference, more VRAM).

## Architecture

```
ACE-Step-Studio/
├── app/              # React + Express frontend & backend
├── ACE-Step-1.5/     # Python ML pipeline
├── python/           # Portable Python 3.12 (created by install.bat)
├── node/             # Portable Node.js 22 (created by install.bat)
├── models/           # HuggingFace cache (created at runtime)
├── run.bat           # Standard launcher
├── run-no-lm.bat     # Launch without LM
├── install.bat       # One-click installer
├── update.bat        # Updater
└── CHANGELOG.md      # Version history
```

## Updating

```
update.bat
```

Pulls latest code, updates Python/Node deps, rebuilds frontend.

## Contributing

Contributions welcome! Here's how to help:

- **Report bugs** — [open an issue](https://github.com/timoncool/ACE-Step-Studio/issues)
- **Suggest features** — [start a discussion](https://github.com/timoncool/ACE-Step-Studio/issues)
- **Submit PRs** — see [AGENTS.md](AGENTS.md) for architecture, coding conventions, and pitfalls

Areas where help is especially needed:
- macOS / Linux support
- New visualizer presets for Video Studio
- Translations (i18n)
- LoRA training UI improvements
- Documentation & tutorials

## Other Portable Neural Networks

| Project | Description |
|---------|-------------|
| [Foundation Music Lab](https://github.com/timoncool/Foundation-Music-Lab) | Music generation + timeline editor |
| [VibeVoice ASR](https://github.com/timoncool/VibeVoice_ASR_portable_ru) | Speech recognition (ASR) |
| [LavaSR](https://github.com/timoncool/LavaSR_portable_ru) | Audio quality enhancement |
| [Qwen3-TTS](https://github.com/timoncool/Qwen3-TTS_portable_rus) | Text-to-speech by Qwen |
| [SuperCaption Qwen3-VL](https://github.com/timoncool/SuperCaption_Qwen3-VL) | Image captioning |
| [VideoSOS](https://github.com/timoncool/videosos) | AI video production |
| [RC Stable Audio Tools](https://github.com/timoncool/RC-stable-audio-tools-portable) | Music and audio generation |

## Authors

- **Nerual Dreming** — [Telegram](https://t.me/nerual_dreming) | [neuro-cartel.com](https://neuro-cartel.com) | [ArtGeneration.me](https://artgeneration.me)
- **Neiro-Soft** — [Telegram](https://t.me/neuroport) | portable neural network builds

## Acknowledgments

- **[ACE-Step Team](https://github.com/ace-step)** — open source ACE-Step 1.5 music generation model
- **[fspecii](https://github.com/fspecii/ace-step-ui)** — original ACE-Step UI
- [AudioMass](https://audiomass.co/) — browser audio editor
- [Demucs](https://github.com/facebookresearch/demucs) — stem extraction by Meta
- [Pexels](https://www.pexels.com/) — free stock photos/videos
- [Gradio](https://gradio.app/) — ML model serving
- [FFmpeg](https://ffmpeg.org/) — video encoding

---

<div align="center">

**If you find this useful, please give it a star!**

[![Star History Chart](https://api.star-history.com/svg?repos=timoncool/ACE-Step-Studio&type=Date)](https://star-history.com/#timoncool/ACE-Step-Studio&Date)

</div>
