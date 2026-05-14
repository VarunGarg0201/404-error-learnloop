import OpenAI from "openai";

/* ═══════════════════════════════════════════════════════════
   OpenAI Client Wrapper
   ─────────────────────────────────────────────────────────
   Centralized instance with rate limiting logic and default
   configurations for the LearnLoop AI layer.
   ═══════════════════════════════════════════════════════════ */

// Ensure this only runs on the server
if (typeof window !== "undefined") {
  throw new Error("OpenAI client must only be instantiated on the server.");
}

const apiKey = process.env.OPENAI_API_KEY;

export const openai = new OpenAI({
  apiKey: apiKey || "dummy_key_for_build",
});

export const AI_MODELS = {
  FAST: "gpt-4o-mini",
  SMART: "gpt-4o",
};

/**
 * Helper to parse JSON responses from OpenAI safely
 */
export function parseAIJson<T>(rawText: string | null): T | null {
  if (!rawText) return null;
  try {
    // Strip markdown code block wrappers if present
    const cleanText = rawText.replace(/^```json/i, "").replace(/```$/i, "").trim();
    return JSON.parse(cleanText) as T;
  } catch (error) {
    console.error("Failed to parse AI JSON response:", error);
    return null;
  }
}
