import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function getFirestoreErrorCode(error: unknown): string {
  return typeof error === "object" && error && "code" in error
    ? String(error.code)
    : "";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const q = query(
      collection(db, "document_verifications"),
      where("email", "==", email.toLowerCase()),
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs
      .map((d) => {
        const docData = d.data();
        return {
          id: d.id,
          name: docData.name,
          documentType: docData.documentType,
          fileName: docData.fileName,
          fileType: docData.fileType || "",
          fileSize: docData.fileSize || 0,
          fileData: docData.fileData || "",
          status: docData.status,
          adminComment: docData.adminComment || "",
          createdAt: docData.createdAt,
          reviewedAt: docData.reviewedAt || "",
        };
      })
      .sort((a, b) => {
        const aTime = new Date(String(a.createdAt || 0)).getTime();
        const bTime = new Date(String(b.createdAt || 0)).getTime();
        return bTime - aTime;
      });

    return NextResponse.json(data);
  } catch (error) {
    console.error("My documents error:", error);

    if (getFirestoreErrorCode(error) === "permission-denied") {
      return NextResponse.json(
        {
          error:
            "Your document records are not readable with the current Firestore rules.",
          code: "permission-denied",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch document records." },
      { status: 500 },
    );
  }
}
