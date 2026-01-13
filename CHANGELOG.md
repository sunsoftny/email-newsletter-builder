# Changelog

All notable changes to this project will be documented in this file.

## [1.0.27] - 2026-01-13

### Added
- **Sample Templates**: Exported `SAMPLE_TEMPLATES` constant with "Welcome Email" and "Monthly Newsletter" presets to help developers get started quickly.
- **Demo Enhancement**: The demo app now pre-loads these sample templates if no local data is found.

## [1.0.26] - 2026-01-13

### Added
- **Testing Suite**: Added typically comprehensive testing infrastructure using **Vitest** and **React Testing Library**.
- **Unit Tests**: Added test coverage for `TemplateListModal`, `ImageGalleryModal`, and `SubjectLineModal` to ensure component stability and correct failure handling.

## [1.0.25] - 2026-01-13

### Fixed
- **Runtime Safety**: Added robust array checks for `templates`, `images`, and AI analysis results to prevent "map is not a function" crashes when APIs return invalid data.

## [Unreleased]

### Added
- **Form Support**: Added `inputType`, `placeholder`, and `required` properties to `EditorElement` content type definition (preparation for Form Input blocks).

## [1.0.24] - 2026-01-13

### Documentation
- **Data Structure**: Added detailed JSON schema documentation to `README.md` explaining the `EditorState` and `EditorElement` structure.

## [1.0.23] - 2026-01-13

### Added
- **AI Integration**: Introduced `AiFeatures` interface for backend-agnostic AI capabilities.
- **AI Text Assistant**: "✨ AI Magic" in Properties Panel to rewrite/fix text.
- **AI Image Generation**: "✨" button in image inputs to generate images from prompts.
- **Magic Layout Generator**: Build full newsletter layouts from text descriptions via `AiLayoutModal`.
- **Smart Subject Line Optimizer**: Analyze content and suggest subject lines via `SubjectLineModal` and `content-scraper` utility.
- **Developer Experience**: Added `src/lib/mock-ai.ts` for clean local development and demoing.
- **Documentation**: Added `CONTRIBUTING.md` and updated `README.md` with "AI Integration" guide.

### Fixed
- **Next.js App Router Support**: Resolved "Event handlers cannot be passed to Client Component props" error by marking `src/app/page.tsx` as a Client Component.
- **Type Definitions**: improved TypeScript interfaces for `EditorState` and `CanvasSettings`.
