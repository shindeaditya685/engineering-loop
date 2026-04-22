import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

type BlogRecord = {
  id: string;
  updatedAt?: string;
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
    const snapshot = await getDocs(collection(db, "blog_posts"));
    const posts: BlogRecord[] = snapshot.docs
      .map((entry) => ({ id: entry.id, ...entry.data() }) as BlogRecord)
      .sort((a, b) => toMillis(b.updatedAt || b.createdAt) - toMillis(a.updatedAt || a.createdAt));

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Admin blog GET error:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body.id || "");

    if (!id) {
      return NextResponse.json({ error: "Post id is required." }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.status !== undefined) {
      updateData.status = String(body.status);
      updateData.publishedAt =
        body.status === "published" ? new Date().toISOString() : "";
    }

    if (body.featured !== undefined) {
      updateData.featured = Boolean(body.featured);
    }

    if (body.adminComment !== undefined) {
      updateData.adminComment = String(body.adminComment || "");
    }

    await updateDoc(doc(db, "blog_posts", id), updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin blog PUT error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post id is required." }, { status: 400 });
    }

    await deleteDoc(doc(db, "blog_posts", id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin blog DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
