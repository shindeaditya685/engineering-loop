import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type AchievementRecord = {
  id: string;
  featured?: boolean;
  isVisible?: boolean;
  year?: string;
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
      .filter((entry) => entry.isVisible !== false)
      .sort((left, right) => {
        if (left.featured === right.featured) {
          const leftDate = toMillis(String(left.year || left.createdAt || ""));
          const rightDate = toMillis(String(right.year || right.createdAt || ""));
          return rightDate - leftDate;
        }

        return left.featured ? -1 : 1;
      });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Achievements GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 },
    );
  }
}
