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

## Testing Locally (The Easiest Way)

1. **Build the extension**:
   ```bash
   npm run build
   ```
2. **Open Chrome/Edge extensions page**:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
3. **Enable Developer Mode** (toggle in the top right corner).
4. **Click "Load Unpacked"**.
5. **Select the `dist` folder** inside this project directory.
6. The extension is now active! You should see the icon in your toolbar.
   - *Tip: Pin it to your toolbar for easy access.*

## Publishing to Chrome Web Store

1. **Create the Zip Package**:
   Run the following command to build and zip the extension:
   ```bash
   npm run pack
   ```
   This will generate an `extension.zip` file in the project root.

2. **Register as a Developer**:
   - Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/dev/dashboard).
   - Sign in and pay the one-time $5 registration fee.

3. **Upload Your Item**:
   - Click **"New Item"**.
   - Upload the `extension.zip` file you created.

4. **Fill out the Listing**:
   - **Store Listing**: Add Description, Screenshots (1280x800), and Promotional Tiles.
   - **Privacy**: You must declare that you handle user input (Chat) and page content (Context).
     - *Justification*: "The extension analyzes the current page content and user input to provide AI assistance."
   - **Pricing**: Select "Free".

5. **Submit for Review**:
   - Once submitted, it usually takes 1-3 days for approval.

## Project Structure

- `src/background`: Service Worker logic.
- `src/content`: Content scripts (DOM interaction, Action Runner, Recorder).
- `src/ui`: React applications for Sidebar, Popup, and Options.
- `src/shared`: Shared types, utilities, and messaging infrastructure.
- `manifest`: Manifest V3 configuration files.
