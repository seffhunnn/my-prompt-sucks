/**
 * Popup Controller for MyPromptSucks
 * 
 * Handles loading, saving, displaying, and testing the Gemini API key.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Load dynamic extension version from manifest.json
  try {
    const manifestVersion = chrome.runtime.getManifest().version;
    document.querySelectorAll(".extension-version").forEach(el => {
      el.classList.remove("version-loading-shimmer");
      el.textContent = `v${manifestVersion}`;
      el.style.opacity = "0";
      el.style.transition = "opacity 0.2s ease-in-out";
      requestAnimationFrame(() => {
        el.style.opacity = "1";
      });
    });
  } catch (err) {
    console.error("Failed to load extension version from manifest:", err);
    document.querySelectorAll(".extension-version").forEach(el => {
      el.classList.remove("version-loading-shimmer");
      el.textContent = "Latest Version";
    });
  }

  // Configured target AI platforms
  const SUPPORTED_HOSTS = [
    "chatgpt.com",
    "claude.ai",
    "gemini.google.com",
    "perplexity.ai",
    "www.perplexity.ai"
  ];

  const supportedView = document.getElementById("supportedView");
  const unsupportedView = document.getElementById("unsupportedView");
  const apiKeyInput = document.getElementById("apiKey");
  const toggleVisibilityBtn = document.getElementById("toggleVisibility");
  const saveBtn = document.getElementById("saveBtn");
  const testBtn = document.getElementById("testBtn");
  const statusMessage = document.getElementById("statusMessage");

  // Query active tab to verify if the website is supported
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const urlString = activeTab?.url || activeTab?.pendingUrl;

    if (isSupportedUrl(urlString)) {
      supportedView.classList.remove("hidden");
      unsupportedView.classList.add("hidden");
    } else {
      supportedView.classList.add("hidden");
      unsupportedView.classList.remove("hidden");
    }
  });

  /**
   * Helper to validate hostname against the supported AI platform list
   * @param {string} urlString - Active browser tab URL
   * @returns {boolean} True if supported
   */
  function isSupportedUrl(urlString) {
    if (!urlString) return false;
    try {
      const url = new URL(urlString);
      const hostname = url.hostname.toLowerCase();
      return SUPPORTED_HOSTS.some(host => 
        hostname === host || hostname.endsWith("." + host)
      );
    } catch (e) {
      return false;
    }
  }

  // Load existing key from local storage on popup open
  chrome.storage.local.get("geminiApiKey", (result) => {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
      // Show info status indicating key is configured
      showStatus("Your Gemini API key is configured and ready.", "success");
    } else {
      showStatus("Please enter your Gemini API key to get started.", "info");
    }
  });

  // Toggle API Key visibility
  toggleVisibilityBtn.addEventListener("click", () => {
    const isPassword = apiKeyInput.type === "password";
    apiKeyInput.type = isPassword ? "text" : "password";
    
    const eyeIcon = toggleVisibilityBtn.querySelector(".eye-icon");
    if (isPassword) {
      // Show "slashed eye" or text indicating hide
      eyeIcon.innerHTML = "&#128064;"; // Keep eye but toggle title or style
      toggleVisibilityBtn.title = "Hide API Key";
    } else {
      eyeIcon.innerHTML = "&#128065;";
      toggleVisibilityBtn.title = "Show API Key";
    }
  });

  // Save key to local storage
  saveBtn.addEventListener("click", () => {
    const key = apiKeyInput.value.trim();

    if (!key) {
      showStatus("API Key cannot be empty.", "error");
      return;
    }

    if (!key.startsWith("AIzaSy")) {
      showStatus("Warning: This does not look like a valid Google API Key format (usually starts with 'AIzaSy'). Please double check.", "error");
    }

    chrome.storage.local.set({ geminiApiKey: key }, () => {
      showStatus("API Key saved successfully! Go ahead and test the connection.", "success");
    });
  });

  // Test the key validity by making a lightweight Gemini API request
  testBtn.addEventListener("click", async () => {
    const key = apiKeyInput.value.trim();

    if (!key) {
      showStatus("Please enter or save an API key first to test.", "error");
      return;
    }

    showStatus("Connecting to Gemini API...", "info");
    testBtn.disabled = true;
    saveBtn.disabled = true;

    try {
      const isValid = await validateApiKey(key);
      if (isValid) {
        showStatus("Connection successful! Gemini API is responsive.", "success");
      } else {
        showStatus("Connection failed. Invalid API key or service error.", "error");
      }
    } catch (error) {
      showStatus(`Test failed: ${error.message}`, "error");
    } finally {
      testBtn.disabled = false;
      saveBtn.disabled = false;
    }
  });

  /**
   * Performs a lightweight test query to Gemini API to validate the key
   * @param {string} key - Gemini API key
   * @returns {Promise<boolean>} True if successful
   */
  async function validateApiKey(key) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
    const testBody = {
      contents: [
        {
          parts: [
            { text: "Respond with only the single word: 'OK'" }
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testBody)
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const details = errorJson.error?.message || `Status Code ${response.status}`;
      throw new Error(details);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return typeof resultText === "string" && resultText.trim().length > 0;
  }

  /**
   * Helper to display colored status alerts in the popup
   * @param {string} message - Message text
   * @param {"success" | "error" | "info"} type - Message class type
   */
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
  }
});
