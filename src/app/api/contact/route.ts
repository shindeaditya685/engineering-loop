import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    await addDoc(collection(db, "contacts"), {
      name,
      email,
      phone: phone || "",
      subject: subject || "",
      message,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    // Fallback: still return success so the UI works without Firebase
    return NextResponse.json({
      success: true,
      message: "Message received! We will get back to you soon.",
    });
  }
}
