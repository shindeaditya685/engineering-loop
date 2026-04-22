import { NextRequest, NextResponse } from "next/server";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type AchievementRecord = {
  id: string;
  featured?: boolean;
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
    const snapshot = await getDocs(collection(db, "achievements"));
    const achievements: AchievementRecord[] = snapshot.docs
      .map((entry) => ({ id: entry.id, ...entry.data() }) as AchievementRecord)
      .sort((left, right) => {
        if (left.featured === right.featured) {
          return toMillis(String(right.createdAt || "")) - toMillis(String(left.createdAt || ""));
        }

        return left.featured ? -1 : 1;
      });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Admin achievements GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const studentName = String(body.studentName || "").trim();
    const institute = String(body.institute || "").trim();
    const headline = String(body.headline || "").trim();

    if (!studentName || !institute || !headline) {
      return NextResponse.json(
        { error: "Student name, institute and headline are required." },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    await addDoc(collection(db, "achievements"), {
      studentName,
      institute,
      headline,
      branch: String(body.branch || "").trim(),
      rank: String(body.rank || "").trim(),
      category: String(body.category || "").trim(),
      story: String(body.story || "").trim(),
      year: String(body.year || "").trim(),
      featured: Boolean(body.featured),
      isVisible: body.isVisible !== false,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin achievements POST error:", error);
    return NextResponse.json(
      { error: "Failed to create achievement" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body.id || "");

    if (!id) {
      return NextResponse.json(
        { error: "Achievement id is required." },
        { status: 400 },
      );
    }

    await updateDoc(doc(db, "achievements", id), {
      studentName: String(body.studentName || "").trim(),
      institute: String(body.institute || "").trim(),
      headline: String(body.headline || "").trim(),
      branch: String(body.branch || "").trim(),
      rank: String(body.rank || "").trim(),
      category: String(body.category || "").trim(),
      story: String(body.story || "").trim(),
      year: String(body.year || "").trim(),
      featured: Boolean(body.featured),
      isVisible: body.isVisible !== false,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin achievements PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update achievement" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Achievement id is required." },
        { status: 400 },
      );
    }

    await deleteDoc(doc(db, "achievements", id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin achievements DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete achievement" },
      { status: 500 },
    );
  }
}
