/**
 * Content Script for MyPromptSucks Chrome Extension
 * 
 * Dynamically detects active AI platforms, extracts text from editor fields
 * (supporting both contenteditable and textarea), and replaces it with
 * the enhanced version from the Gemini API.
 */

// Scalable Platform Configuration
const SITE_CONFIGS = [
  {
    name: "ChatGPT",
    hosts: ["chatgpt.com"],
    // Order of preference for prompt editor selectors
    selectors: ["#prompt-textarea", "div[contenteditable='true']", "textarea"]
  },
  {
    name: "Claude",
    hosts: ["claude.ai"],
    selectors: ["div[contenteditable='true']", "div[role='textbox']", "textarea"]
  },
  {
    name: "Gemini",
    hosts: ["gemini.google.com"],
    selectors: ["div[contenteditable='true']", "div[role='textbox']", "textarea"]
  },
  {
    name: "Perplexity",
    hosts: ["perplexity.ai", "www.perplexity.ai"],
    selectors: ["textarea", "div[contenteditable='true']"]
  }
];

// Inject unified styles for loaders, badges, and toasts across all platforms
const styleElement = document.createElement("style");
styleElement.textContent = `
  /* Pulsing visual feedback for active inputs */
  .myprompt-loading {
    opacity: 0.65 !important;
    animation: myprompt-pulse 1.5s ease-in-out infinite !important;
    pointer-events: none !important;
    cursor: wait !important;
  }

  @keyframes myprompt-pulse {
    0% { filter: brightness(1); }
    50% { filter: brightness(0.85); box-shadow: 0 0 10px rgba(147, 51, 234, 0.3); }
    100% { filter: brightness(1); }
  }

  /* Elegant floating notification badges */
  .myprompt-badge {
    position: absolute;
    bottom: 100%;
    right: 16px;
    margin-bottom: 8px;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: myprompt-slide-in 0.2s ease-out;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .myprompt-badge-error {
    background-color: #fca5a5;
    color: #991b1b;
    border: 1px solid #fee2e2;
  }

  .myprompt-badge-success {
    background-color: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .myprompt-badge-info {
    background-color: #e0f2fe;
    color: #075985;
    border: 1px solid #bae6fd;
  }

  @keyframes myprompt-slide-in {
    from { transform: translateY(8px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(styleElement);

// Listen to keyboard shortcuts on the target page
document.addEventListener("keydown", handleKeydown, true);

/**
 * Monitors keydown events and triggers the prompt enhancer on supported inputs
 * @param {KeyboardEvent} event 
 */
function handleKeydown(event) {
  // Trigger on Ctrl + Shift + E or Cmd + Shift + E
  const isShortcutPressed = 
    (event.ctrlKey || event.metaKey) && 
    event.shiftKey && 
    event.key.toLowerCase() === "e";

  if (!isShortcutPressed) return;

  // 1. Verify that the platform matches the site configuration list
  const siteConfig = getCurrentSiteConfig();
  if (!siteConfig) {
    showGlobalToast("This AI platform is not supported by MyPromptSucks.", "error");
    return;
  }

  // 2. Query and retrieve the active prompt input
  const activeEl = getActivePromptInput();
  if (!activeEl) {
    showGlobalToast("Could not locate the prompt input field. Please focus the input area and try again.", "info");
    return;
  }

  // 3. Extract the prompt text
  const originalText = getPromptText(activeEl);
  if (!originalText || originalText.trim() === "") {
    showFloatingBadge(activeEl, "Type a draft prompt first before enhancing! ✍️", "info", 3000);
    return;
  }

  // Prevent default keystroke event propagation
  event.preventDefault();
  event.stopPropagation();

  // 4. Trigger enhancement workflow
  enhancePromptProcess(activeEl, originalText);
}

/**
 * Finds the Site Config mapping the current location hostname
 * @returns {object|null} Matches from SITE_CONFIGS
 */
function getCurrentSiteConfig() {
  const hostname = window.location.hostname;
  return SITE_CONFIGS.find(config => 
    config.hosts.some(host => hostname === host || hostname.endsWith("." + host))
  );
}

/**
 * Dynamic selector to locate the correct prompt input area
 * @returns {HTMLElement|null} The targeted input element
 */
function getActivePromptInput() {
  const config = getCurrentSiteConfig();
  if (!config) return null;

  // A. Check if the currently focused element matches our selectors list
  const activeEl = document.activeElement;
  if (activeEl) {
    for (const selector of config.selectors) {
      if (activeEl.matches(selector)) {
        return activeEl;
      }
    }
  }

  // B. Fallback: Find the first visible element matching the selectors
  for (const selector of config.selectors) {
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
      if (el.offsetWidth > 0 || el.offsetHeight > 0) {
        return el;
      }
    }
  }

  return null;
}

/**
 * Reusable utility to read prompt text from contenteditables or inputs
 * @param {HTMLElement} element - The target input
 * @returns {string} Sanitized string value
 */
function getPromptText(element) {
  if (!element) return "";
  const isContentEditable = element.getAttribute("contenteditable") === "true";
  return isContentEditable ? element.innerText : element.value;
}

/**
 * Reusable utility to write prompt text while keeping React/framework bindings synced
 * @param {HTMLElement} element - Target input
 * @param {string} text - Replaced prompt value
 */
function setPromptText(element, text) {
  if (!element) return;
  element.focus();

  const isContentEditable = element.getAttribute("contenteditable") === "true";

  if (isContentEditable) {
    try {
      // Focus and select all content inside the editable container
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      // Replace selected range with document.execCommand, triggering React internal bindings
      const success = document.execCommand("insertText", false, text);
      if (!success) {
        throw new Error("execCommand insertText returned false");
      }
    } catch (e) {
      console.warn("execCommand failed, falling back to innerText mapping:", e);
      element.innerText = text;
      // Manually trigger events for React component state
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
    }
  } else {
    // Normal textareas or inputs
    element.value = text;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

/**
 * Calls background service worker and coordinates the UI transitions
 * @param {HTMLElement} element - Input element
 * @param {string} originalText - User's draft prompt
 */
function enhancePromptProcess(element, originalText) {
  element.classList.add("myprompt-loading");
  
  // Create dynamic status loading badge
  const loadingBadge = showFloatingBadge(element, "⚡ Improving prompt...", "info");

  chrome.runtime.sendMessage(
    { action: "enhancePrompt", prompt: originalText },
    (response) => {
      // Safely cleanup loaders
      element.classList.remove("myprompt-loading");
      if (loadingBadge) loadingBadge.remove();

      if (chrome.runtime.lastError) {
        console.error("MyPromptSucks message failed:", chrome.runtime.lastError);
        showFloatingBadge(element, "Connection error: Please refresh the page.", "error", 4000);
        return;
      }

      if (response && response.success) {
        // Replace with the improved text
        setPromptText(element, response.enhancedPrompt);
        showFloatingBadge(element, "✨ Prompt improved!", "success", 2000);
      } else {
        // Handle explicit backend errors (e.g., missing API key, API limits)
        const errorMsg = response?.error || "Failed to connect to Gemini API.";
        showFloatingBadge(element, `Error: ${errorMsg}`, "error", 6000);
      }
    }
  );
}

/**
 * Shows an context-sensitive warning/info badge relative to the editor field
 * @param {HTMLElement} relativeElement - Element to position above
 * @param {string} message - Message text
 * @param {string} type - "error" | "success" | "info"
 * @param {number} [duration] - Expiry in ms
 * @returns {HTMLDivElement} Created element reference
 */
function showFloatingBadge(relativeElement, message, type, duration = 0) {
  const parent = relativeElement.parentElement;
  if (!parent) return null;

  if (getComputedStyle(parent).position === "static") {
    parent.style.position = "relative";
  }

  // Clear previous badges to avoid overlaps
  const existingBadges = parent.querySelectorAll(".myprompt-badge");
  existingBadges.forEach(b => b.remove());

  const badge = document.createElement("div");
  badge.className = `myprompt-badge myprompt-badge-${type}`;
  badge.textContent = message;

  parent.appendChild(badge);

  if (duration > 0) {
    setTimeout(() => {
      if (badge && badge.parentNode) {
        badge.remove();
      }
    }, duration);
  }

  return badge;
}

/**
 * Global fallback toast to inform users when a platform input is missing
 * @param {string} message - Warning message
 * @param {string} type - Toast type class
 * @param {number} duration - Time before hiding
 */
function showGlobalToast(message, type, duration = 4000) {
  let toastContainer = document.getElementById("myprompt-global-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "myprompt-global-toast-container";
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `myprompt-badge myprompt-badge-${type}`;
  toast.style.cssText = `
    position: static;
    margin-bottom: 0;
    pointer-events: auto;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 8px;
  `;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
    if (toastContainer.children.length === 0) {
      toastContainer.remove();
    }
  }, duration);
}
