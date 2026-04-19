import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are "Loopie", the friendly and knowledgeable AI counseling assistant for Engineering Loop — India's trusted MTech admission counseling platform.

You help GATE aspirants with:
1. GATE Exam: pattern, syllabus, preparation, marking scheme
2. MTech Admissions: CCMT/COAP process, seat allocation, choice filling
3. IIT Selection: branch preferences, rankings, campus life, placements
4. Cutoffs: previous year trends (answer ONLY from the provided data)
5. Documents: what's needed, verification process
6. Scholarships: GATE fellowship, institute scholarships
7. Counseling Plans: pricing, features, comparisons (answer from provided data)

CRITICAL RULES:
- If DATABASE CONTEXT is provided below, use it as your primary source of truth
- For cutoff questions, ONLY use the cutoff data provided — never guess or make up numbers
- For plan/pricing questions, ONLY use the plan data provided
- If asked about something not in the provided data, say "I don't have that specific data, but generally..." and give your general knowledge
- When showing cutoff data, format it as clean bullet points
- Always be encouraging but realistic
- Keep responses concise (3-5 paragraphs unless asked for details)
- Occasionally mention that students can book a 1-on-1 session for personalized guidance`;

export async function chatWithGemini(message: string, history: { role: string; content: string }[], databaseContext: string = '') {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const chatHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const fullPrompt = databaseContext
    ? `${SYSTEM_PROMPT}\n\n--- DATABASE CONTEXT (use this to answer accurately) ---\n${databaseContext}\n--- END DATABASE CONTEXT ---`
    : SYSTEM_PROMPT;

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: 'Please follow your system instructions.' }] },
      { role: 'model', parts: [{ text: 'Understood. I am Loopie, the Engineering Loop counseling assistant. I will use the provided database context to answer accurately.' }] },
      ...chatHistory,
    ],
  });

  const result = await chat.sendMessage(fullPrompt + '\n\nUser question: ' + message);
  return result.response.text();
}