# ACE-Step Studio

[![Stars](https://img.shields.io/github/stars/timoncool/ACE-Step-Studio?style=social)](https://github.com/timoncool/ACE-Step-Studio/stargazers)
[![License](https://img.shields.io/github/license/timoncool/ACE-Step-Studio)](LICENSE)

Portable music generation studio powered by [ACE-Step 1.5 XL](https://github.com/ace-step/ACE-Step-1.5) (4B DiT). Full-featured UI with hot model switching, real-time GPU monitoring, 5-language interface, and one-click portable installation for Windows.

## Features

- **Single Terminal** — one `run.bat`, everything managed by Express (Python auto-spawned, auto-restarted on crash)
- **3 XL Models** — XL Turbo (8 steps, fast), XL SFT (50 steps, max quality), XL Turbo BF16 (compact, 7.5 GB)
- **Hot Model Switching** — change DiT/LM models without restart via in-process `/v1/init` API
- **Portable** — everything in one folder. Delete folder = uninstall. No system pollution
- **Generation Time Tracking** — stopwatch icon shows how long each track took to generate
- **System Monitor** — live GPU/VRAM/RAM/CPU stats in sidebar via nvidia-smi
- **Multi-language** — English, Russian, Chinese, Japanese, Korean (auto-detect)
- **Built-in Tools** — audio editor (AudioMass), stem extraction (Demucs), video generator
- **AI Enhance** — LLM-powered style enrichment for better genre accuracy
- **LAN Access** — use from any device on your network
- **Advanced Controls** — inference steps, CFG, shift, sampler, LM temperature, batch generation

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

- **Nerual Dreming** ([t.me/nerual_dreming](https://t.me/nerual_dreming)) — [neuro-cartel.com](https://neuro-cartel.com) | founder of [ArtGeneration.me](https://artgeneration.me)
- **Neiro-Soft** ([t.me/neuroport](https://t.me/neuroport)) — portable neural network builds

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
