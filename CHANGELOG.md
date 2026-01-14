# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-14

### Added
- **Sidebar Assistant**: Chat interface with AI (Mock Provider for MVP)
- **Page Context Engine**: Extracts page title, URL, headings, links, and selected text
- **Action Engine**: Execute DOM actions (highlight, click, type) via content script
- **Recorder**: Record user interactions (clicks, inputs) as reusable macros
- **Options Page**: Data management with "Clear All Data" functionality
- **Privacy-First Design**: All data stored locally, no external transmission
- **Typed Message Bus**: Zod-based runtime validation for extension messaging
- **Service Worker**: Background script for extension coordination
- **Content Script**: DOM manipulation and page analysis capabilities
- **Community Templates**: Issue templates, PR template, Code of Conduct
- **CI/CD**: GitHub Actions workflow for automated builds and linting
- **Documentation**: Comprehensive README, PRIVACY, SECURITY, CONTRIBUTING guides

### Technical
- Built with React 18, Vite 5, TypeScript 5
- Manifest V3 for modern extension architecture
- ESLint for code quality
- Icons: Custom SVG icons (16px, 48px, 128px)

[1.0.0]: https://github.com/zahidoverflow/gemini-agent-browser-extension/releases/tag/v1.0.0
