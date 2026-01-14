# Gemini Agent Browser Extension

![License](https://img.shields.io/github/license/zahidoverflow/gemini-agent-browser-extension)
![CI](https://github.com/zahidoverflow/gemini-agent-browser-extension/actions/workflows/ci.yml/badge.svg)
![GitHub issues](https://img.shields.io/github/issues/zahidoverflow/gemini-agent-browser-extension)
![GitHub pull requests](https://img.shields.io/github/issues-pr/zahidoverflow/gemini-agent-browser-extension)
![GitHub top language](https://img.shields.io/github/languages/top/zahidoverflow/gemini-agent-browser-extension)
![GitHub last commit](https://img.shields.io/github/last-commit/zahidoverflow/gemini-agent-browser-extension)

A modern AI-powered browser assistant/agent extension built with React, Vite, and TypeScript (Manifest V3).

## Features

- **Sidebar Assistant**: Chat with an AI assistant (currently Mocked for MVP) alongside your browsing.
- **Page Context**: Automatically extracts page title, URL, headings, links, and selected text.
- **Action Engine**: Can perform actions on the page like highlighting elements, clicking buttons, and filling inputs.
- **Recorder**: Record your clicks and typing to create reusable macros (MVP).
- **Privacy First**: Local-first data storage. No data leaves your device unless configured.

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running in Development Mode

To run the build in watch mode:

```bash
npm run dev
```

### Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

## Installation

1. Open Chrome/Edge/Brave and navigate to `chrome://extensions`.
2. Enable **Developer Mode** (toggle in top right).
3. Click **Load Unpacked**.
4. Select the `dist/` folder from this project.

## Project Structure

- `src/background`: Service Worker logic.
- `src/content`: Content scripts (DOM interaction, Action Runner, Recorder).
- `src/ui`: React applications for Sidebar, Popup, and Options.
- `src/shared`: Shared types, utilities, and messaging infrastructure.
- `manifest`: Manifest V3 configuration files.
