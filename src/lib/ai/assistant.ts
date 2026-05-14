import { openai, AI_MODELS, parseAIJson } from "./openai-client";

/**
 * AI Study Assistant Service
 *
 * Friendly study assistant personality.
 * Concise, calm, helpful, non-intrusive.
 */

const SYSTEM_PROMPT = `You are the LearnLoop AI Assistant, an expert tutor. 
Your tone is encouraging, concise, and highly educational. 
Always structure your answers clearly.`;

export async function generateQuiz(topic: string, difficulty: "beginner" | "intermediate" | "advanced") {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODELS.FAST,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Generate a 3-question multiple choice quiz about "${topic}" at a ${difficulty} level.
          Output ONLY valid JSON in this exact format:
          {
            "questions": [
              { "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "explanation": "..." }
            ]
          }`
        }
      ],
      response_format: { type: "json_object" },
    });

    const parsed = parseAIJson<{ questions: any[] }>(response.choices[0].message.content);
    return parsed || { questions: [] };
  } catch (error) {
    console.error("Quiz generation failed:", error);
    return { questions: [] };
  }
}

export async function summarizeSession(chatTranscript: string) {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODELS.FAST,
      messages: [
        { role: "system", content: "You are a highly efficient note-taker. Summarize the following study session transcript into 3 bullet points." },
        { role: "user", content: chatTranscript }
      ],
    });
    return { summary: response.choices[0].message.content || "" };
  } catch (error) {
    console.error("Session summary failed:", error);
    return { summary: "Failed to generate summary." };
  }
}

export async function explainConcept(concept: string, style: "simple" | "detailed") {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODELS.SMART,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Explain the concept of "${concept}". Make it ${style === "simple" ? "like I'm 5 years old, using analogies" : "comprehensive and academic, suitable for a college student"}.` }
      ],
    });
    return { explanation: response.choices[0].message.content || "" };
  } catch (error) {
    console.error("Explain concept failed:", error);
    return { explanation: "Failed to explain concept." };
  }
}

export async function improveExplanation(text: string) {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODELS.FAST,
      messages: [
        { role: "system", content: "You are an expert editor. Improve the following explanation to be more beginner-friendly, structured, and engaging. Do not add unnecessary fluff." },
        { role: "user", content: text }
      ],
    });
    return { improved: response.choices[0].message.content || text };
  } catch (error) {
    console.error("Improve explanation failed:", error);
    return { improved: text };
  }
}

export async function createStudyPlan(goal: string, timeframeDays: number) {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODELS.SMART,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Create a step-by-step study plan to achieve this goal: "${goal}" within ${timeframeDays} days. Format it as a markdown checklist, breaking down tasks day-by-day.` }
      ],
    });
    return { plan: response.choices[0].message.content || "" };
  } catch (error) {
    console.error("Create study plan failed:", error);
    return { plan: "Failed to generate study plan." };
  }
}
