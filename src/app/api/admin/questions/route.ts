import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

type QuestionRecord = {
  id: string;
  updatedAt?: string;
  createdAt?: string;
  [key: string]: unknown;
};

function toMillis(value: unknown) {
  if (typeof value === "string") {
    return new Date(value).getTime() || 0;
  }

  return 0;
}

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "questions"));
    const questions: QuestionRecord[] = snapshot.docs
      .map((entry) => ({ id: entry.id, ...entry.data() }) as QuestionRecord)
      .sort((a, b) => toMillis(b.updatedAt || b.createdAt) - toMillis(a.updatedAt || a.createdAt));

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Admin questions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body.id || "");

    if (!id) {
      return NextResponse.json({ error: "Question id is required." }, { status: 400 });
    }

    const questionRef = doc(db, "questions", id);

    if (body.answerId) {
      const snapshot = await getDoc(questionRef);
      if (!snapshot.exists()) {
        return NextResponse.json({ error: "Question not found." }, { status: 404 });
      }

      const data = snapshot.data();
      const answers = Array.isArray(data.answers) ? [...data.answers] : [];
      const nextAnswers = answers.map((answer) =>
        String(answer.id) === String(body.answerId)
          ? { ...answer, status: String(body.answerStatus || answer.status || "published") }
          : answer,
      );

      await updateDoc(questionRef, {
        answers: nextAnswers,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.status !== undefined) {
      updateData.status = String(body.status);
    }

    if (body.adminNote !== undefined) {
      updateData.adminNote = String(body.adminNote || "");
    }

    await updateDoc(questionRef, updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin questions PUT error:", error);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Question id is required." }, { status: 400 });
    }

    await deleteDoc(doc(db, "questions", id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin questions DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}
