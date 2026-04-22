import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "bookings"));
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
      .sort((left, right) => toMillis(right.createdAt) - toMillis(left.createdAt));

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Admin bookings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await deleteDoc(doc(db, "bookings", id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin bookings DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const status = String(body.status || "");
    const confirmedDate = String(body.confirmedDate || "").trim();
    const confirmedTime = String(body.confirmedTime || "").trim();
    const meetLink = String(body.meetLink || "").trim();
    const adminNote = String(body.adminNote || "").trim();

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    if (status === "confirmed" && (!confirmedDate || !confirmedTime || !meetLink)) {
      return NextResponse.json(
        {
          error: "Confirmed bookings require a confirmed date, confirmed time, and Google Meet link.",
        },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.status !== undefined) {
      updateData.status = status;
    }
    if (body.confirmedDate !== undefined) {
      updateData.confirmedDate = confirmedDate;
    }
    if (body.confirmedTime !== undefined) {
      updateData.confirmedTime = confirmedTime;
    }
    if (body.meetLink !== undefined) {
      updateData.meetLink = meetLink;
    }
    if (body.adminNote !== undefined) {
      updateData.adminNote = adminNote;
    }

    await updateDoc(doc(db, "bookings", id), updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin bookings PUT error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
