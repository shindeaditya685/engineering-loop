import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are "Loopie", the official Engineering Loop assistant for MTech admissions and counseling.

You have two sources:
1. DATABASE CONTEXT supplied by Engineering Loop from the site's knowledge base and cutoff records
2. Your own Gemini general knowledge about GATE, MTech admissions, counseling, institutes, branches, and preparation

How to answer:
- Prefer DATABASE CONTEXT whenever it is relevant.
- If DATABASE CONTEXT contains exact cutoff data or exact Engineering Loop plan/site details, use that as the source of truth.
- If the DATABASE CONTEXT is partial, combine it with your own general knowledge and clearly keep the answer helpful.
- If the user asks about a college, branch, process, or counseling topic and the DATABASE CONTEXT does not contain the exact answer, you may still answer using your own knowledge.
- Never invent exact cutoff numbers, exact ranks, or exact site-specific facts when they are not present in DATABASE CONTEXT.
- If exact cutoff data is missing, say that the current Engineering Loop cutoff database does not have an exact match, then give a general guidance answer instead of stopping.
- There are no predefined question types. Answer whatever the user asks in a natural way.
- Keep the tone friendly, practical, and concise.
- Use short bullet points for cutoff answers when that makes the answer clearer.`;

export async function chatWithGemini(
  message: string,
  history: { role: string; content: string }[],
  databaseContext = "",
) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const chatHistory = history.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const fullPrompt = databaseContext
    ? `${SYSTEM_PROMPT}\n\n--- DATABASE CONTEXT (use this to answer accurately) ---\n${databaseContext}\n--- END DATABASE CONTEXT ---`
    : SYSTEM_PROMPT;

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: "Please follow your system instructions." }] },
      {
        role: "model",
        parts: [
          {
            text: "Understood. I will prefer Engineering Loop knowledge-base and cutoff context, and I will use general Gemini knowledge when the exact answer is not present there.",
          },
        ],
      },
      ...chatHistory,
    ],
  });

  const result = await chat.sendMessage(`${fullPrompt}\n\nUser question: ${message}`);
  return result.response.text();
}
