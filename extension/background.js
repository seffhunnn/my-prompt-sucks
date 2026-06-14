/**
 * Background Service Worker for MyPromptSucks Chrome Extension
 * 
 * This script runs in the background and acts as a secure network proxy.
 * Since page content scripts can be blocked by Content Security Policies (CSP)
 * of the target website, we handle all Gemini API fetches here.
 */

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enhancePrompt") {
    // We must return true to notify Chrome that the response will be sent asynchronously
    enhanceUserPrompt(request.prompt)
      .then((enhancedText) => {
        sendResponse({ success: true, enhancedPrompt: enhancedText });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; 
  }
});

/**
 * Calls the Gemini API to enhance a user's prompt
 * @param {string} originalPrompt - The prompt entered by the user
 * @returns {Promise<string>} The professionally enhanced prompt
 */
async function enhanceUserPrompt(originalPrompt) {
  // 1. Retrieve the saved API key from chrome local storage
  const storage = await chrome.storage.local.get("geminiApiKey");
  const apiKey = storage.geminiApiKey;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error("Gemini API key is not configured. Please click the extension icon and enter a valid API key.");
  }

  // 2. Prepare the request URL and body for Gemini 2.5 Flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const systemInstruction = 
    "You are an expert prompt engineer. Your job is to rewrite the user's input prompt to make it clear, detailed, and optimized for an AI language model. " +
    "Keep the user's original core topic and intent, but add clear sections, context, output format requirements, or constraints where appropriate. " +
    "CRITICAL: Return ONLY the rewritten prompt. Do not include any introductory or concluding remarks, conversational text, or Markdown code blocks like ```markdown.";

  const requestBody = {
    contents: [
      {
        parts: [
          { text: originalPrompt }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        { text: systemInstruction }
      ]
    }
  };

  // 3. Make the network request
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
      throw new Error(`Gemini API Error: ${errorMessage}`);
    }

    const data = await response.json();
    
    // 4. Extract the response text
    const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!enhancedText) {
      throw new Error("Failed to get a valid response structure from the Gemini API.");
    }

    return enhancedText.trim();
  } catch (error) {
    console.error("Enhancement failed:", error);
    // If it's a network/fetch error, provide a friendlier message
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Network error. Please check your internet connection and verify that your Gemini API key is valid.");
    }
    throw error;
  }
}
