# ACE-Step Studio

[![Stars](https://img.shields.io/github/stars/timoncool/ACE-Step-Studio?style=social)](https://github.com/timoncool/ACE-Step-Studio/stargazers)
[![License](https://img.shields.io/github/license/timoncool/ACE-Step-Studio)](LICENSE)

**[Русская версия](README_RU.md)**

Portable AI music generation studio. Create songs with vocals, lyrics, and music videos — all running locally on your GPU. No cloud, no subscriptions, no internet required.

Built on [ACE-Step 1.5 XL](https://github.com/ace-step/ACE-Step-1.5) (4B DiT model) with a full-featured web interface.

## Features

### Music Generation
- **Full songs with vocals** — up to 8 minutes, any language, any genre
- **Simple & Custom modes** — describe what you want or fine-tune every parameter
- **3 XL Models** — XL Turbo (8 steps, fast), XL SFT (50 steps, max quality), XL Turbo BF16 (compact, 7.5 GB)
- **AI Lyrics & Style** — LLM generates lyrics and enriches style descriptions
- **Hot Model Switching** — change DiT/LM models without restart
- **Batch generation** — create multiple variations at once
- **ID3 tags** — MP3 files include title, artist, cover art, lyrics, BPM

### Video Studio
- **Music video generator** — NCS-style visualizers with 10 presets
- **Karaoke lyrics** — synchronized LRC subtitles with 3 styles (lines, scroll, karaoke fill)
- **WYSIWYG editor** — drag elements, scroll to resize, selection frames
- **Aspect ratios** — 16:9, 9:16 (Reels/TikTok), 1:1 (Instagram)
- **Effects** — shake, glitch, VHS, scanlines, bloom, film grain, and more
- **Server-side rendering** — native ffmpeg.exe with NVENC GPU acceleration

### Audio Tools
- **Audio editor** — trim, fade, effects (AudioMass)
- **Stem extraction** — separate vocals, drums, bass, other (Demucs)
- **Cover & Remix** — transform existing audio with new styles
- **Audio repainting** — regenerate specific sections

### Interface
- **Single terminal** — one `run.bat`, Express manages Python/Gradio
- **Portable** — everything in one folder, delete = uninstall
- **5 languages** — English, Russian, Chinese, Japanese, Korean
- **LAN access** — use from any device on your network
- **GPU monitoring** — live VRAM/RAM/CPU stats
- **Generation time tracking** — per-song stopwatch
- **LRC download** — export synchronized lyrics for Apple Music

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

Select your GPU type. Installs Python 3.12, PyTorch, Node.js 22, and all dependencies.

### 3. Run

```
run.bat
```

Single terminal — Express + Gradio pipeline in one window. Browser opens automatically when models are loaded. UI at http://localhost:3001 (auto-finds free port if busy).

Models download automatically on first run (~7.5 GB for default BF16 model). To pre-download or add other models, use `download_model.bat`.

For development with Vite HMR: `run-dev.bat` (3 terminals, frontend at http://localhost:3000).

## Models

| Model | Size | Steps | CFG | Speed | Quality |
|-------|------|-------|-----|-------|---------|
| XL Turbo | 18.8 GB | 8 | No | Fast | Very High |
| XL SFT | 18.8 GB | 50 | Yes | Slow | Highest |
| XL Turbo BF16 | 7.5 GB | 8 | No | Fast | High |

## Architecture

```
ACE-Step-Studio/
├── app/              # React + Express frontend & backend
├── ACE-Step-1.5/     # Python ML pipeline (included in repo)
├── python/           # Portable Python 3.12 (created by install.bat)
├── node/             # Portable Node.js 22 (created by install.bat)
├── models/           # HuggingFace cache (created at runtime)
├── install.bat       # One-click installer
├── run.bat           # Single-terminal launcher (Express manages Python)
├── run-dev.bat       # Dev mode (3 terminals with Vite HMR)
├── AGENTS.md         # Agent/contributor guidelines
├── update.bat        # Update wrapper + deps
└── download_model.bat # Model downloader
```

## Updating

```
update.bat
```

Updates both ACE-Step Studio wrapper and ACE-Step 1.5 core, then refreshes dependencies.

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

## Contributing

See [AGENTS.md](AGENTS.md) for architecture details, coding conventions, and pitfalls to avoid.

## Authors

- **Nerual Dreming** — [Telegram channel](https://t.me/nerual_dreming) | [neuro-cartel.com](https://neuro-cartel.com) | founder of [ArtGeneration.me](https://artgeneration.me)
- **Neiro-Soft** — [Telegram channel](https://t.me/neuroport) | portable neural network builds

## Acknowledgments

- **[ACE-Step Team](https://github.com/ace-step)** — for the open source ACE-Step 1.5 music generation model
- **[fspecii](https://github.com/fspecii/ace-step-ui)** — original ACE-Step UI that this project is built upon
- [AudioMass](https://audiomass.co/) — browser-based audio editor
- [Demucs](https://github.com/facebookresearch/demucs) by Meta Research — stem extraction model
- [Pexels](https://www.pexels.com/) — free stock photos and videos for music video backgrounds
- [Gradio](https://gradio.app/) — ML model serving framework
- [FFmpeg](https://ffmpeg.org/) — video encoding

---

> **If this project is useful, give it a star!** It helps others discover it.

## Star History

<a href="https://www.star-history.com/?repos=timoncool%2FACE-Step-Studio&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/image?repos=timoncool/ACE-Step-Studio&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/image?repos=timoncool/ACE-Step-Studio&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/image?repos=timoncool/ACE-Step-Studio&type=date&legend=top-left" />
 </picture>
</a>
