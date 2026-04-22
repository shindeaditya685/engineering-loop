import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { chatWithGemini } from "@/lib/gemini";

type CutoffRecord = {
  college?: string;
  program?: string;
  category?: string;
  type?: string;
  year?: string | number;
  cutoff?: string | number;
  [key: string]: unknown;
};

type KnowledgeRecord = {
  topic?: string;
  keywords?: string;
  content?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

function expandCommonShortcuts(input: string) {
  const expansions: Record<string, string> = {
    cse: "computer science",
    ee: "electrical",
    me: "mechanical",
    ce: "civil",
    ch: "chemical",
    ec: "electronics",
    it: "information technology",
    ai: "artificial intelligence",
    ds: "data science",
    bhu: "(bhu)",
  };

  let expanded = input.toLowerCase();
  Object.entries(expansions).forEach(([abbr, full]) => {
    expanded = expanded.replace(new RegExp(`\\b${abbr}\\b`, "g"), full);
  });

  return expanded;
}

function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1);
}

function toContextDate(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  return "";
}

async function fetchCutoffContext(message: string) {
  try {
    const snapshot = await getDocs(query(collection(db, "cutoffs"), limit(5000)));
    const allRows = snapshot.docs.map((entry) => entry.data()) as CutoffRecord[];

    if (allRows.length === 0) {
      return "";
    }

    const searchWords = tokenize(message);
    const expandedWords = tokenize(expandCommonShortcuts(message));

    const scoredRows: CutoffRecord[] = allRows
      .map((row) => {
        const searchText = [
          row.college,
          row.program,
          row.category,
          row.type,
          row.year,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        let score = 0;
        searchWords.forEach((word) => {
          if (searchText.includes(word)) {
            score += 3;
          }
        });
        expandedWords.forEach((word) => {
          if (searchText.includes(word)) {
            score += 1;
          }
        });

        return { ...row, score };
      })
      .filter((row) => row.score > 0)
      .sort((left, right) => Number(right.score) - Number(left.score))
      .slice(0, 40);

    if (scoredRows.length === 0) {
      return "";
    }

    const grouped = new Map<string, CutoffRecord[]>();
    scoredRows.forEach((row) => {
      const key = `${row.college} - ${row.program} (${row.year || "N/A"})`;
      const currentRows = grouped.get(key) || [];
      currentRows.push(row);
      grouped.set(key, currentRows);
    });

    let context = "ENGINEERING LOOP CUTOFF DATA:\n\n";
    Array.from(grouped.entries())
      .slice(0, 8)
      .forEach(([key, rows]) => {
        context += `${key}:\n`;
        rows
          .sort((left, right) => Number(left.cutoff || 0) - Number(right.cutoff || 0))
          .forEach((row) => {
            context += `- ${row.category}: ${row.cutoff}\n`;
          });
        context += "\n";
      });

    return context;
  } catch (error) {
    console.error("Cutoff fetch error:", error);
    return "";
  }
}

async function fetchKnowledgeContext(message: string) {
  try {
    const snapshot = await getDocs(collection(db, "knowledge_base"));
    const allDocs = snapshot.docs.map((entry) => entry.data()) as KnowledgeRecord[];

    if (allDocs.length === 0) {
      return "";
    }

    const searchWords = tokenize(message);
    const scoredDocs: KnowledgeRecord[] = allDocs
      .map((entry) => {
        const searchText = [
          entry.topic,
          entry.keywords,
          entry.content,
          toContextDate(entry.updatedAt),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        let score = 0;
        searchWords.forEach((word) => {
          if (searchText.includes(word)) {
            score += 2;
          }
        });

        if (entry.topic && message.toLowerCase().includes(String(entry.topic).toLowerCase())) {
          score += 5;
        }

        if (entry.keywords) {
          String(entry.keywords)
            .split(",")
            .map((keyword) => keyword.trim().toLowerCase())
            .filter(Boolean)
            .forEach((keyword) => {
              if (message.toLowerCase().includes(keyword)) {
                score += 3;
              }
            });
        }

        return { ...entry, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((left, right) => Number(right.score) - Number(left.score))
      .slice(0, 6);

    if (scoredDocs.length === 0) {
      return "";
    }

    let context = "ENGINEERING LOOP KNOWLEDGE BASE:\n\n";
    scoredDocs.forEach((entry, index) => {
      context += `[${entry.topic || `Topic ${index + 1}`}]\n${entry.content}\n\n`;
    });

    return context;
  } catch (error) {
    console.error("Knowledge fetch error:", error);
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        reply: "Loopie is not configured yet because GEMINI_API_KEY is missing.",
      });
    }

    const [knowledgeContext, cutoffContext] = await Promise.all([
      fetchKnowledgeContext(message),
      fetchCutoffContext(message),
    ]);

    const databaseContext = [knowledgeContext, cutoffContext]
      .filter(Boolean)
      .join("\n");

    const reply = await chatWithGemini(message, history, databaseContext);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply:
        "Loopie could not read the Engineering Loop data right now. Please try again in a moment.",
    });
  }
}
