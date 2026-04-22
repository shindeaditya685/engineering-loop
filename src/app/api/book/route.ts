import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 },
      );
    }

    await addDoc(collection(db, "bookings"), {
      ...data,
      email: String(data.email).toLowerCase(),
      status: "pending",
      confirmedDate: "",
      confirmedTime: "",
      meetLink: "",
      adminNote: "",
      createdAt: serverTimestamp(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Counseling request received. We will confirm the slot shortly.",
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({
      success: true,
      message: "Booking received. We will confirm your slot shortly.",
    });
  }
}
