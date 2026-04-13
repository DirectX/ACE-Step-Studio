# Changelog

## 2026-04-13

### Added
- **Tools page** with two model utilities:
  - **BF16 Converter** — convert safetensors from FP32/FP16 to BFloat16 (~50% size, minimal quality loss)
  - **Model Merger** — merge two ACE-Step models with adjustable alpha blending
- **Tools** nav item in sidebar (between Search and Training)
- `reinstall.bat` — clean reinstall script (deletes python/node/deps, keeps models/data/output)
- Sampler mode selection (Euler / Heun) in generation settings
- i18n keys for Tools page in all 5 languages

### Changed
- **Training page** redesigned from single-column to responsive 2-column grid layout
- `update.bat` now properly updates all Python dependencies (not just ace-step)
- `update.bat` upgrades pip and reinstalls nano-vllm on update

### Fixed
- TypeScript error in `App.tsx:958` (samplerMode type narrowing)

## 2026-04-12

### Added
- XL Merge SFT+Turbo model support with metadata and download
- Guidance range unlocked 0-20 for all models
- `download_model.bat` merge model entry

## 2026-04-11

### Added
- Initial release of ACE-Step Studio
- Web UI with Create, Library, Search, Training, News pages
- LoRA training pipeline (upload, edit, preprocess, train, export)
- Multi-language support (EN, RU, ZH, JA, KO)
- System monitoring widget (GPU/VRAM/RAM/CPU)
- Portable installation (Python embedded + Node.js)
