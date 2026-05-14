import { openai, AI_MODELS, parseAIJson } from "./openai-client";

/* ═══════════════════════════════════════════════════════════
   Dashboard AI Personalization
   ─────────────────────────────────────────────────────────
   Generates personalized greetings and daily study insights.
   ═══════════════════════════════════════════════════════════ */

export async function generateDailyInsight(userName: string, recentTopics: string[]) {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODELS.FAST,
      messages: [
        { 
          role: "system", 
          content: "You are the LearnLoop dashboard assistant. Your goal is to provide a very short, highly encouraging, and specific daily greeting based on what the user is studying. Output ONLY valid JSON." 
        },
        { 
          role: "user", 
          content: `Generate a daily insight for ${userName} who has recently been studying: ${recentTopics.join(", ")}.
          Output format:
          {
            "greeting": "A short engaging welcome message (max 8 words)",
            "tip": "A specific, actionable study tip relating to their topics (max 2 sentences)"
          }` 
        }
      ],
      response_format: { type: "json_object" },
    });

    const parsed = parseAIJson<{ greeting: string; tip: string }>(response.choices[0].message.content);
    return parsed || { greeting: `Welcome back, ${userName}!`, tip: "Keep up the great work today." };
  } catch (error) {
    console.error("Failed to generate daily insight:", error);
    return { greeting: `Welcome back, ${userName}!`, tip: "Ready to continue your learning journey?" };
  }
}
