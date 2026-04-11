# ACE-Step Studio

[![Stars](https://img.shields.io/github/stars/timoncool/ACE-Step-Studio?style=social)](https://github.com/timoncool/ACE-Step-Studio/stargazers)
[![License](https://img.shields.io/github/license/timoncool/ACE-Step-Studio)](LICENSE)

Portable music generation studio powered by [ACE-Step 1.5 XL](https://github.com/ace-step/ACE-Step-1.5) (4B DiT). Full-featured UI with model switching, real-time GPU monitoring, Russian/English/Chinese/Japanese/Korean interface, and one-click portable installation for Windows.

## Features

- **3 XL Models**: XL Turbo (8 steps, fast), XL SFT (50 steps, max quality), XL Turbo BF16 (compact, 7.5 GB)
- **Portable**: Everything in one folder. Delete folder = uninstall. No system pollution
- **Model Management**: Auto-download, switch models on the fly, real status indicators
- **System Monitor**: Live GPU/VRAM/RAM/CPU stats in sidebar via nvidia-smi
- **Multi-language**: Russian, English, Chinese, Japanese, Korean (auto-detect)
- **AI Enhance**: LLM-powered style enrichment for better genre accuracy
- **Advanced Controls**: Inference steps, CFG, shift, sampler, LM temperature, batch generation

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

### 3. Download Models

```
download_model.bat
```

Choose XL Turbo (18.8 GB) for fast generation or XL SFT (18.8 GB) for max quality. XL Turbo BF16 (7.5 GB) if low on VRAM.

### 4. Run

```
run.bat
```

Opens UI at http://localhost:3000. Three services start: Gradio pipeline (8001), Express backend (3001), Vite frontend (3000).

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
├── run.bat           # Launcher (3 services)
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
