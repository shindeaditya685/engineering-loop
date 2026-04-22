import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

type QuestionAnswer = {
  id: string;
  body: string;
  authorName: string;
  authorEmail: string;
  authorUid: string;
  createdAt: string;
  status: "published" | "hidden";
};

type QuestionRecord = {
  id: string;
  status?: string;
  authorEmail?: string;
  answers?: QuestionAnswer[];
  updatedAt?: string;
  createdAt?: string;
  [key: string]: unknown;
};

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 8);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  return [];
}

function toMillis(value: unknown) {
  if (typeof value === "string") {
    return new Date(value).getTime() || 0;
  }

  return 0;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase() || "";

    const snapshot = await getDocs(collection(db, "questions"));
    let questions: QuestionRecord[] = snapshot.docs.map((entry) => ({
      id: entry.id,
      ...entry.data(),
    })) as QuestionRecord[];

    const filteredQuestions = questions
      .filter((question) =>
        email
          ? question.status === "published" ||
            String(question.authorEmail || "").toLowerCase() === email
          : question.status === "published",
      )
      .map((question) => ({
        ...question,
        answers: Array.isArray(question.answers)
          ? (question.answers as QuestionAnswer[]).filter(
              (answer) => answer.status !== "hidden",
            )
          : [],
      })) as QuestionRecord[];

    filteredQuestions.sort(
      (a, b) => toMillis(b.updatedAt || b.createdAt) - toMillis(a.updatedAt || a.createdAt),
    );
    questions = filteredQuestions;

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Questions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = String(body.action || "question");

    if (action === "answer") {
      const id = String(body.id || "");
      const answerBody = String(body.body || "").trim();
      const authorName = String(body.authorName || "").trim();
      const authorEmail = String(body.authorEmail || "").trim().toLowerCase();

      if (!id || !answerBody || !authorName || !authorEmail) {
        return NextResponse.json({ error: "Question id, answer body, author name and email are required." }, { status: 400 });
      }

      const questionRef = doc(db, "questions", id);
      const snapshot = await getDoc(questionRef);

      if (!snapshot.exists()) {
        return NextResponse.json({ error: "Question not found." }, { status: 404 });
      }

      const data = snapshot.data();
      const answers = Array.isArray(data.answers) ? [...data.answers] : [];
      answers.push({
        id: `${Date.now()}`,
        body: answerBody,
        authorName,
        authorEmail,
        authorUid: String(body.authorUid || ""),
        createdAt: new Date().toISOString(),
        status: "published",
      });

      await updateDoc(questionRef, {
        answers,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Your answer has been posted.",
      });
    }

    const title = String(body.title || "").trim();
    const questionBody = String(body.body || "").trim();
    const authorName = String(body.authorName || "").trim();
    const authorEmail = String(body.authorEmail || "").trim().toLowerCase();

    if (!title || !questionBody || !authorName || !authorEmail) {
      return NextResponse.json({ error: "Title, question, author name and email are required." }, { status: 400 });
    }

    const now = new Date().toISOString();
    await addDoc(collection(db, "questions"), {
      title,
      body: questionBody,
      tags: normalizeTags(body.tags),
      authorName,
      authorEmail,
      authorUid: String(body.authorUid || ""),
      status: "pending",
      adminNote: "",
      answers: [],
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      message: "Your question has been submitted for moderation.",
    });
  } catch (error) {
    console.error("Questions POST error:", error);
    return NextResponse.json({ error: "Failed to save question" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const authorEmail = String(body.authorEmail || "").trim().toLowerCase();

    if (!id || !authorEmail) {
      return NextResponse.json({ error: "Question id and author email are required." }, { status: 400 });
    }

    const questionRef = doc(db, "questions", id);
    const snapshot = await getDoc(questionRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    const existing = snapshot.data();
    if (String(existing.authorEmail || "").toLowerCase() !== authorEmail) {
      return NextResponse.json({ error: "You can only edit your own question." }, { status: 403 });
    }

    await updateDoc(questionRef, {
      title: String(body.title || existing.title || "").trim(),
      body: String(body.body || existing.body || "").trim(),
      tags: normalizeTags(body.tags),
      status: existing.status === "published" ? "pending" : existing.status || "pending",
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Your question has been updated and sent for review.",
    });
  } catch (error) {
    console.error("Questions PUT error:", error);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const authorEmail = String(body.authorEmail || "").trim().toLowerCase();

    if (!id || !authorEmail) {
      return NextResponse.json({ error: "Question id and author email are required." }, { status: 400 });
    }

    const questionRef = doc(db, "questions", id);
    const snapshot = await getDoc(questionRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    if (String(snapshot.data().authorEmail || "").toLowerCase() !== authorEmail) {
      return NextResponse.json({ error: "You can only delete your own question." }, { status: 403 });
    }

    await deleteDoc(questionRef);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Questions DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}
