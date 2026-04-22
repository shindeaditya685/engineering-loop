import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function toMillis(value: unknown) {
  if (typeof value === "string") {
    return new Date(value).getTime() || 0;
  }

  if (typeof value === "object" && value && "seconds" in value) {
    return Number((value as { seconds: number }).seconds) * 1000;
  }

  return 0;
}

function toIsoString(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && value && "seconds" in value) {
    return new Date(Number((value as { seconds: number }).seconds) * 1000).toISOString();
  }

  return "";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase() || "";

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const snapshot = await getDocs(
      query(collection(db, "bookings"), where("email", "==", email.toLowerCase())),
    );

    const bookings = snapshot.docs
      .map((entry) => {
        const data = entry.data();
        return {
          id: entry.id,
          ...data,
          createdAt: toIsoString(data.createdAt),
          updatedAt: toIsoString(data.updatedAt),
        };
      })
      .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("My bookings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
