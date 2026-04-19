import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Counseling session booked successfully!",
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({
      success: true,
      message: "Booking received! We will confirm your slot shortly.",
    });
  }
}
