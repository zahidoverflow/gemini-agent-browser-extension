# AGENT.md — Browser Agent Extension (Chromium) — Production Build Spec

You are the Antigravity IDE coding agent. Build a production-ready, futureproof Chromium-based browser extension: a modern AI-powered “browser assistant / browser agent” that helps users solve real tasks on the web (summarize pages, extract info, fill forms, automate repetitive steps) with a polished UX and safe-by-design automation.

## 0) Operating Rules (Non-Negotiable)
1. **User consent first:** Never perform actions that impersonate the user without explicit in-product confirmation. For any “high-impact” action (login, signup, purchases, posting, deleting, sending messages, submitting forms), require:
   - clear user confirmation (modal) showing the exact values + target domain
   - a final “Confirm & Execute” click
   - visible step-by-step log
2. **Credential safety:** Never store plaintext passwords. Use Chrome’s `storage.session` for ephemeral values during a run and/or ask the user to use a password manager. If “saved profiles” are needed, store only encrypted tokens and never passwords.
3. **No stealth:** No hidden automation, no bypassing CAPTCHAs, no evading site security controls, no exploiting vulnerabilities. Keep automation “assistive” and transparent.
4. **Store compliance:** Keep permissions minimal, provide privacy policy + data handling section, allow user data deletion, avoid scary permissions by default.
5. **Futureproof architecture:** Clean boundaries: UI ↔ background ↔ content scripts ↔ agent engine. Feature flags. Tests. Linting. Typed code.

If a user asks for something unsafe or ToS-violating, implement a safe alternative: “assist mode” that guides and drafts, but requires user to complete sensitive steps.

---

## 1) Product Vision (What we are building)
A browser extension that adds a **sidebar assistant** capable of:
- understanding the current page (DOM + visible text + metadata)
- answering questions about the page
- generating structured outputs (JSON/CSV/Markdown)
- performing **user-approved** multi-step workflows:
  - “fill this form using these details”
  - “draft a support ticket”
  - “extract table to CSV”
  - “compare product specs across tabs”
  - “summarize + highlight key risks”
  - “prepare an email reply”
- working across sites with robust selectors, retries, and clear logs

Think “modern assistant panel” with:
- **Chat**
- **Page Context**
- **Actions / Automations**
- **Memory (local, user-owned)**
- **History + Export**

---

## 2) Tech Stack & Repo Standards
### Language & Tooling
- TypeScript everywhere
- Vite + React for extension UI (sidebar/popup/options)
- Manifest V3
- ESLint + Prettier
- Vitest for unit tests
- Playwright (optional) for e2e extension tests (headful)
- Simple i18n ready (English first)
- Build outputs in `dist/`

### Folder layout (target)
AGENT.md
README.md
LICENSE
PRIVACY.md
SECURITY.md
CHANGELOG.md
package.json
tsconfig.json
vite.config.ts
manifest/
manifest.base.json
manifest.dev.json
manifest.prod.json
src/
background/
serviceWorker.ts
messageBus.ts
capabilities/
providers/
content/
contentScript.ts
dom/
recorder/
actions/
ui/
sidebar/
popup/
options/
components/
styles/
shared/
types/
schema/
utils/
storage/
telemetry/
tests/
scripts/


### Git/GitHub conventions
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`)
- Branches: `main` + feature branches
- GitHub Actions: lint + test + build on PR
- Use `gh` CLI to init repo, create issues, labels, milestones, releases.

---

## 3) Core Features (MVP → V1)
### MVP (must be complete)
1. **Sidebar assistant**
   - Toggle open/close
   - Chat UI with streaming-ready message model
   - “Use current page” context toggle
2. **Page capture + context**
   - Extract: title, URL, selected text, visible text, headings, links
   - Optional: user-selected DOM region capture (safe)
   - Token-limited summarization pipeline (local truncation)
3. **Action engine (safe automation)**
   - Actions are explicit, typed, and logged:
     - highlight elements
     - click (user-confirmed if risky)
     - type into input (user-confirmed if sensitive)
     - select dropdown
     - scroll into view
   - A “Plan → Preview → Execute” workflow:
     - Plan: steps + targets
     - Preview: show what will happen + ask confirm
     - Execute: run with retries + logs
4. **Recorder (user creates automations)**
   - Record clicks/types into a reusable “macro”
   - Save macro locally, run macro later (with confirmation)
5. **History + Export**
   - Save chats locally
   - Export chat/action logs to Markdown/JSON
6. **Options page**
   - Privacy controls (data retention, clear data)
   - Provider config (local mock by default)
   - Permission toggles

### V1 (strong, rating-worthy)
- Multi-tab awareness (list tabs, pick one as context)
- Snippet capture (user selects region)
- “Extract to table” + CSV export
- “Form fill assistant” that maps user profile fields to form fields with preview
- Domain allowlist per automation (“only run on example.com”)
- Keyboard shortcuts
- Onboarding tour
- UX polish: fast, minimal, modern

---

## 4) AI / Provider Abstraction (Important)
Implement a provider interface that supports:
- `generateText(prompt, context, options)`
- `streamText(...)` (stub if not implemented)
- `embed(text)` (optional)
- `classifyIntent(message)` (optional)

Default provider must be:
- **MockProvider** that returns deterministic responses (so the extension works without keys)
Also implement at least one real provider adapter as OPTIONAL:
- “OpenAI-compatible HTTP endpoint” adapter (base URL + API key + model)
But keep it modular and store-safe.

Do not hardcode secrets. All keys stored in extension storage, user-controlled.

---

## 5) Safety & Policy Layer (Build it in)
Implement:
- Risk classification for actions:
  - LOW: summarize, extract, highlight
  - MED: fill form fields without submit
  - HIGH: submit form, login, signup, purchase, post, delete
- HIGH actions require:
  - explicit confirmation
  - show exact domain + fields
  - “Dry run” preview
- A “Protected Mode” toggle:
  - default ON
  - disallows HIGH actions, only drafts and guides
- Clear audit log (what was read, what was clicked, what was typed)

---

## 6) Permissions (Keep minimal)
Start with minimal MV3 permissions:
- `storage`
- `activeTab`
- `scripting`
- `tabs` (only if needed for multi-tab features)
- Host permissions should be optional/just-in-time:
  - Use `activeTab` primarily
  - If persistent host permissions needed, request with clear UI reason

---

## 7) UX Requirements (Store-grade)
- Sidebar: clean layout, strong typography, responsive
- “Context chips” (URL, title, selection)
- “Actions” panel: steps list with statuses (pending/running/done/fail)
- “Explain” button: show why each step is needed
- “Stop” button: immediate cancel
- On errors: show actionable fixes (permissions missing, element not found)

---

## 8) Implementation Details (Engineering Plan)
### Messaging architecture
- Use a typed message bus between:
  - UI ↔ background service worker
  - background ↔ content scripts
- Central `shared/types` for message schemas
- Add runtime validation with zod (or similar) for messages

### Content script capabilities
- DOM query helper with robust selectors
- Element targeting:
  - CSS selector
  - fallback: text match + role/aria
  - fallback: XPath (optional)
- Action runner with retries and timeouts
- Highlight overlay for targeted element

### Recorder
- Capture:
  - click events (selector snapshot)
  - input events (field id/name/label)
- Normalize selectors for stability:
  - prefer data-testid, aria-label, name, stable attributes
- Allow user to edit recorded steps in UI

### Storage
- Local-first, user-owned:
  - chats
  - macros
  - settings
- Provide “Delete all data” button

### Telemetry (Optional)
Default OFF. If implemented:
- Only anonymous event counts
- No page content
- Clear opt-in

---

## 9) Deliverables Checklist (Must produce)
1. Working extension runnable in dev mode:
   - `pnpm install`
   - `pnpm dev` (watch build)
   - load unpacked from `dist/`
2. Production build:
   - `pnpm build`
3. Documentation:
   - README with install/dev/build steps
   - PRIVACY.md (data handling)
   - SECURITY.md (reporting issues)
4. GitHub Actions CI:
   - lint + test + build
5. Basic tests:
   - unit tests for selector engine + message bus validation
6. Polished UI:
   - sidebar, popup (quick toggle), options
7. A demo macro:
   - “Extract table to CSV” or “Summarize page + key bullets”

---

## 10) Workflow for You (Agent) — How to Execute
Follow this step-by-step:
1. **Scaffold**: initialize TS/React/Vite extension skeleton MV3.
2. **Build core plumbing**: manifest split + message bus + content script injection.
3. **Create sidebar UI**: minimal but polished.
4. **Implement page context extractor**: visible text + selection + metadata.
5. **Implement action engine**: typed actions + logs + confirm gates.
6. **Implement recorder**: record → save → replay.
7. **Implement provider abstraction** with MockProvider.
8. **Add options page** for settings & privacy.
9. **Hardening**: error handling, retries, permission prompts, performance.
10. **Docs + CI**: README/PRIVACY/SECURITY + GitHub Actions.

At each milestone, run lint/tests/build. Keep commits small and conventional.

---

## 11) GitHub Repo Setup (Use gh CLI)
When ready, do:
- `git init`
- `gh repo create <name> --public --source . --remote origin --push`
- Setup labels: `bug`, `enhancement`, `security`, `good first issue`
- Create milestones: `MVP`, `V1`
- Add issue templates under `.github/ISSUE_TEMPLATE/`
- Add CI workflow under `.github/workflows/ci.yml`

Also:
- Add a minimal website/landing in README with screenshots placeholders.
- Maintain CHANGELOG.md with Keep a Changelog format.

---

## 12) Constraints & Acceptance Criteria
### Acceptance Criteria (MVP)
- Sidebar opens on any page and can summarize current page via MockProvider.
- Recorder can record a simple flow and replay it with confirmation.
- Action log shows each step and final status.
- Settings page exists and can clear stored data.
- Build works reliably and produces dist for unpacked install.

### Quality
- Typescript strict mode
- No console spam in prod
- Clean permissions
- Fast sidebar load
- Works on Chromium-based browsers (Chrome/Brave/Edge)

---

## 13) Notes for “Signup/Login automation” requests
Implement only as **Assist Mode**:
- The assistant can **draft** values and **fill** fields,
- but must always require:
  - user review + confirmation
  - user manual completion for CAPTCHA/2FA
  - no storing passwords
- Provide a “Form Fill Profile” where user stores non-sensitive fields (name, address) locally.

---

## 14) Start Now
Begin by inspecting the current folder. If empty, scaffold the project.
Then implement the architecture above. Keep the code production-grade.
