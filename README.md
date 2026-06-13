# My Prompt Sucks 🙂

<p align="center">
  <img src="icons/logo.png" alt="My Prompt Sucks Logo" width="128" height="128">
</p>

Let’s be honest: your AI prompts probably suck. 

You write things like *"write a code for login"* or *"make article funny"*, and then wonder why the AI responds with generic, boring garbage. 

**My Prompt Sucks** is a minimal, lightweight Chrome extension that intercepts your draft prompt, refactors it into a structured, professional, and AI-optimized format via the Gemini API, and replaces it inline. No prompt engineering PhD required.

---

## The Workflow

1. Type a terrible draft prompt on any supported AI chatbox.
2. Press the shortcut.
3. Watch the extension improve it inline.
4. Hit enter. Get a better response.

### Keyboard Shortcuts
* **Windows/Linux**: `Ctrl` + `Shift` + `E`
* **macOS**: `Command` + `Shift` + `E`

---

## Supported Platforms

* [ChatGPT](https://chatgpt.com)
* [Claude](https://claude.ai)
* [Gemini](https://gemini.google.com)
* [Perplexity](https://www.perplexity.ai)

*Note: The extension uses site configurations to locate the editor fields, which allows it to cleanly inject text without breaking React state bindings.*

---

## Installation

Since this is a lightweight developer utility, you load it directly into Chrome:

1. **Download the code**: Go to the **Releases** section on the right side of this page and download the latest ZIP file (or click the green **Code** button at the top of the repository page and select **Download ZIP**), then extract it on your computer.
2. **Open Extensions page**: Open Google Chrome and navigate to `chrome://extensions/`.
3. **Developer Mode**: Toggle **Developer mode** in the top right corner.
4. **Load Unpacked**: Click **Load unpacked** in the top left and select the project folder.
5. **Add API Key**: 
   - Click the extensions puzzle icon in your toolbar and select **My Prompt Sucks**.
   - Paste your Gemini API key (you can get a free key from [Google AI Studio](https://aistudio.google.com/)).
   - Click **Save Key** and run a quick **Test** to make sure it's active.

---

## Privacy First 🛡️

I built this for us, so privacy is built-in:
* **Local Storage**: Your Gemini API key is stored in your browser (`chrome.storage.local`).
* **No Tracking**: This never collects, logs, or looks at your prompts. 
* **Scoped Execution**: The extension is restricted in the manifest to *only* run on the four supported AI websites. It stays completely inactive on other domains.

---

## Tech Stack

* **Vanilla JavaScript** (no complex frameworks or build steps)
* **Manifest V3** Chrome Extension APIs
* **Gemini API** (`gemini-2.5-flash` via secure background workers)

---

## Support

Built with caffeine and bad prompts. If this tool saves you time, feel free to support the developer:

* **Sponsor the project**: [GitHub Sponsors](https://github.com/sponsors/seffhunnn)

---

## Roadmap

- [ ] Support additional platforms (Grok, Copilot, Poe)
- [ ] Add an inline floating trigger button next to prompt fields
- [ ] Support custom output "tones" (e.g. Creative, Concise, Code-focused)

---

## License

This project is source-visible but proprietary. 

* **Allowed**: You are welcome to view the code, download it for personal use, and learn from it.
* **Restricted**: Redistribution, reuploading, public forks/clones, modification for distribution, and commercial use are strictly prohibited without the author's explicit written permission.

For details, see the [LICENSE](LICENSE) file. Please contact the author before redistributing or commercially using this project.
