import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const gateYear = formData.get("gateYear") as string;
    const documentType = formData.get("documentType") as string;
    const file = formData.get("file") as File;

    if (!name || !email || !documentType || !file) {
      return NextResponse.json(
        { error: "Name, email, document type and file are required" },
        { status: 400 },
      );
    }

    if (file.size > 500000) {
      return NextResponse.json(
        { error: "File too large. Maximum 500KB allowed." },
        { status: 400 },
      );
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPEG, WEBP images and PDF files are allowed." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    await addDoc(collection(db, "document_verifications"), {
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      gateYear: gateYear || "",
      documentType,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileData: "data:" + file.type + ";base64," + base64,
      status: "pending",
      adminComment: "",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Document submitted successfully!",
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const q = query(
      collection(db, "document_verifications"),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => {
      const docData = d.data();
      return {
        id: d.id,
        name: docData.name,
        email: docData.email,
        phone: docData.phone || "",
        gateYear: docData.gateYear || "",
        documentType: docData.documentType,
        fileName: docData.fileName,
        fileType: docData.fileType,
        fileSize: docData.fileSize,
        fileData: docData.fileData || "",
        status: docData.status,
        adminComment: docData.adminComment || "",
        createdAt: docData.createdAt,
      };
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Documents GET error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status, adminComment } = await req.json();
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updateData: Record<string, any> = {
      reviewedAt: new Date().toISOString(),
    };
    if (status) updateData.status = status;
    if (adminComment !== undefined) updateData.adminComment = adminComment;

    await updateDoc(doc(db, "document_verifications", id), updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Document PUT error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    await deleteDoc(doc(db, "document_verifications", id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Document DELETE error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
