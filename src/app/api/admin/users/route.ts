import { NextRequest, NextResponse } from "next/server";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeUserProfile } from "@/lib/users";

function toMillis(value: string | null) {
  return value ? new Date(value).getTime() || 0 : 0;
}

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const users = snapshot.docs
      .map((entry) =>
        normalizeUserProfile({
          uid: entry.id,
          ...entry.data(),
        }),
      )
      .sort(
        (left, right) =>
          toMillis(right.lastLoginAt || right.createdAt) -
          toMillis(left.lastLoginAt || left.createdAt),
      );

    return NextResponse.json(users);
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const uid = String(body.uid || "").trim();
    const status = String(body.status || "").trim().toLowerCase();
    const bannedReason = String(body.bannedReason || "").trim();

    if (!uid || !["active", "banned"].includes(status)) {
      return NextResponse.json(
        { error: "Valid user id and status are required." },
        { status: 400 },
      );
    }

    await updateDoc(doc(db, "users", uid), {
      status,
      bannedReason: status === "banned" ? bannedReason : "",
      bannedAt: status === "banned" ? new Date().toISOString() : "",
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin users PUT error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
