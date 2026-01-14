# Testing Guide

This document contains comprehensive testing procedures for the Gemini Agent Browser Extension.

## Prerequisites
1. Chrome/Edge browser
2. Extension built (`npm run build` completed successfully)
3. `dist` folder populated

## Installation Test
1. Open `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select `dist` folder
5. ✅ Extension should appear in toolbar

## Core Functionality Tests

### 1. Service Worker
**Test**: Verify background script loads
- Open `chrome://extensions`
- Click **Service Worker** under extension
- ✅ Console should show: "Gemini Agent Service Worker loaded"

### 2. Content Script Injection
**Test**: Verify content script loads on web pages
- Navigate to any website (e.g., https://example.com)
- Open DevTools Console
- ✅ Should see: "Gemini Agent Content Script loaded"

### 3. Sidebar Panel
**Test**: Open sidebar
- Click extension icon in toolbar
- ✅ Sidebar should open on the right side
- ✅ Should see "Gemini Agent" header
- ✅ Chat interface should be visible

### 4. Message Bus - PING
**Test**: Send PING message
- In sidebar DevTools console, run:
  ```javascript
  chrome.runtime.sendMessage({ type: 'PING', payload: {} }, console.log)
  ```
- ✅ Should receive: `{ status: 'ok' }`

### 5. Page Context Extraction
**Test**: Analyze current page
- Open sidebar on any webpage
- Click "Context" button
- ✅ Page title and URL should appear in blue banner
- Open DevTools and check `analyzePage()` response
- ✅ Should include: title, url, headings, links, content

### 6. Text Selection
**Test**: Select text and analyze
- Select some text on the page
- Click "Context" button in sidebar
- ✅ Selection should be captured in response

### 7. Action Engine - Highlight
**Test**: Highlight an element
- In tab DevTools console:
  ```javascript
  chrome.runtime.sendMessage({
    type: 'EXECUTE_ACTION',
    payload: { action: { type: 'highlight', selector: 'h1' } }
  }, console.log)
  ```
- ✅ First `h1` should get red border and pink background for 2 seconds
- ✅ Should receive: `{ success: true }`

### 8. Action Engine - Click
**Test**: Click an element (use with caution)
- Find a safe clickable element
- Send EXECUTE_ACTION with type: 'click'
- ✅ Element should be clicked

### 9. Recorder
**Test**: Record interactions
- Open sidebar
- Click "Rec" button (should turn red)
- Click somewhere on the page
- Type in an input field
- Open background DevTools
- ✅ Should see RECORD_ACTION messages logged
- Click "Stop" to end recording

### 10. Chat Interface
**Test**: Send a chat message
- Type a message in sidebar input
- Click Send
- ✅ User message should appear
- ✅ Mock AI response should appear after typing animation

### 11. Options Page
**Test**: Open and test options
- Right-click extension icon → Options
- ✅ Options page should open in new tab
- ✅ Should see "Clear All Data" button
- Click "Clear All Data" and confirm
- ✅ Should show success message

## Error Scenarios

### 1. Invalid Selector
**Test**: Execute action with invalid selector
```javascript
chrome.runtime.sendMessage({
  type: 'EXECUTE_ACTION',
  payload: { action: { type: 'highlight', selector: '#does-not-exist' } }
}, console.log)
```
- ✅ Should receive: `{ success: false, error: "Element not found: #does-not-exist" }`

### 2. Missing Value for Type Action
**Test**: Send type action without value
```javascript
chrome.runtime.sendMessage({
  type: 'EXECUTE_ACTION',
  payload: { action: { type: 'type', selector: 'input' } }
}, console.log)
```
- ✅ Should receive error about missing value

## Performance Tests

### 1. Build Size
- Check `extension.zip` size
- ✅ Should be < 500KB

### 2. Memory Usage
- Open Chrome Task Manager (`Shift + Esc`)
- Find extension processes
- ✅ Memory usage should be < 50MB for normal operation

## Acceptance Criteria
- [ ] All core functionality tests pass
- [ ] No console errors in normal operation
- [ ] Extension icons render correctly (16, 48, 128)
- [ ] Sidebar loads within 1 second
- [ ] All messages validate correctly (Zod schemas)
- [ ] Options page functional
- [ ] Recorder captures events
- [ ] Mock AI responds to chat
