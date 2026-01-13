# Changelog

All notable changes to this project will be documented in this file.

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
