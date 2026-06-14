<div align="center">
  <img src="website/assets/logo.png" width="84" height="84" alt="My Prompt Sucks Logo" />
  <h1>My Prompt Sucks</h1>
  <p><em>Instantly optimize poorly structured AI prompts inline using the Gemini API and a single keyboard shortcut.</em></p>

  <p>
    <a href="https://github.com/seffhunnn/my-prompt-sucks/releases"><img src="https://img.shields.io/badge/Chrome_Extension-v1.0.4-yellow?style=flat-square&logo=google-chrome&logoColor=white&color=ffb800" alt="Chrome Extension" /></a>
    <img src="https://img.shields.io/badge/Manifest-V3-black?style=flat-square&logo=google-chrome&logoColor=white&color=222222" alt="Manifest V3" />
    <img src="https://img.shields.io/badge/Privacy-100%25_Local-green?style=flat-square&logo=shield&logoColor=white&color=00c853" alt="Privacy First" />
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square&color=ea4335" alt="License" /></a>
    <a href="https://github.com/sponsors/seffhunnn"><img src="https://img.shields.io/badge/Sponsor-seffhunnn-pink?style=flat-square&logo=github-sponsors&logoColor=white&color=db61a2" alt="Sponsor" /></a>
  </p>

  <p>
    <a href="https://github.com/seffhunnn"><img src="https://img.shields.io/badge/GitHub-seffhunnn-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub Profile" /></a>
    <a href="https://linkedin.com/in/seffhunnn"><img src="https://img.shields.io/badge/LinkedIn-Saif_Ansari-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn Profile" /></a>
  </p>
</div>

---

Let's be honest: your AI prompts probably suck. 

You write things like *"write login page code"* or *"make article funny"*, and then wonder why the AI responds with generic, boring boilerplate. 

**My Prompt Sucks** is a minimal, ultra-lightweight Chrome extension that intercepts your draft prompt inline, refactors it into a structured, professional, and context-rich system prompt via the Gemini API, and inserts it back into your textbox. No prompt engineering PhD required.

---

## ⚡ The Workflow

1. **Write**: Type a rough draft prompt in any supported AI chatbox.
2. **Trigger**: Hit the keyboard shortcut.
3. **Refactor**: Watch the extension instantly restructure your draft inline.
4. **Send**: Hit Enter and get a high-quality, high-performance response.

### Keyboard Shortcuts

| Platform | Shortcut Keycaps |
| :--- | :--- |
| **Windows / Linux** | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>E</kbd> |
| **macOS** | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>E</kbd> |

---

## 🌐 Supported Hosts

Intelligently targets editor inputs across the industry's leading chat models:

* **[ChatGPT](https://chatgpt.com)**
* **[Anthropic Claude](https://claude.ai)**
* **[Google Gemini](https://gemini.google.com)**
* **[Perplexity AI](https://www.perplexity.ai)**

*Note: The extension targets inputs dynamically at the DOM layer, preventing React or Svelte virtual DOM bindings from breaking during injection.*

---

## 📦 Project Structure

A clean, modular layout separating the Chrome extension from the marketing website:

```
my-prompt-sucks/
├── extension/          # Chrome extension package (packaged in GitHub Releases)
│   ├── manifest.json   # Extension configuration (Manifest V3)
│   ├── background.js   # Background service worker (API execution & shortcut bindings)
│   ├── content.js      # Scoped DOM injector & input interceptor
│   ├── popup.html      # Connection key configuration panel
│   └── icons/          # Extension graphics
└── website/            # Marketing & landing website (deployed separately)
    ├── index.html      # High-end landing page
    ├── style.css       # Custom cinematic CSS variables
    ├── script.js       # Dynamic release parsing & particle canvas
    └── assets/         # Visual media & screenshots
```

---

## 🔧 Installation Guide

Deploy the extension locally in under 2 minutes:

1. **Download Build**: Go to **[Releases](../../releases/latest)**, download `my-prompt-sucks-v1.0.2.zip`, and extract it.
2. **Open Extensions**: Open Google Chrome and navigate to `chrome://extensions/`.
3. **Developer Mode**: Toggle **Developer mode** **ON** in the top-right corner.
4. **Load Unpacked**: Click **Load unpacked** in the top-left and select the extracted `my-prompt-sucks/` folder.
5. **Link API Key**:
   - Get a free API connection key from **[Google AI Studio](https://aistudio.google.com/apikey)**.
   - Click the extension icon in your Chrome toolbar, paste your key, and click **Save Connection**.

---

## 🛡️ Privacy Architecture

Built for developers who value security and data privacy:

* **Zero Backend Servers**: Prompts are dispatched directly from your browser to Google's Gemini API endpoints.
* **100% Local Storage**: Your API credentials are saved only inside Chrome's local sandboxed storage (`chrome.storage.local`).
* **Strict Scoping**: The extension remains fully inert on all other pages. Permissions are strictly scoped to the four target AI domains.

---

## 🛠️ Tech Stack

* **Vanilla JavaScript** — Zero framework bloated builds or translation latency.
* **Manifest V3** — Standardized background service worker lifecycle.
* **Gemini API** — Intercepts prompts via `gemini-2.5-flash` for instant, context-aware instructions.

---

## 📈 Roadmap

- [ ] Add POE, Grok, and Microsoft Copilot host configurations
- [ ] Add an inline floating trigger button inside chat boxes
- [ ] Incorporate custom output presets (e.g. Concise, Code-focused, Creative)

---

## 💖 Support the Project

Built with caffeine and bad prompts. If this tool saves you time, feel free to fuel my energy:

* **Sponsor Project**: [GitHub Sponsors](https://github.com/sponsors/seffhunnn)
* **LinkedIn**: [Connect on LinkedIn](https://linkedin.com/in/seffhunnn)

---

## 📄 License

This project is source-visible but proprietary.

* **Allowed**: You are welcome to view the code, download it, fork it, and modify it for **personal use only**.
* **Restricted**: Redistribution, reuploading, hosting public forks/clones, publishing modifications, and any commercial use are strictly prohibited without the author's explicit written permission.

For details, inspect the **[LICENSE](LICENSE)** file.
