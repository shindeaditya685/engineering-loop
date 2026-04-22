import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  normalizeContentFormat,
  toPlainText,
} from "@/lib/richText";
import { verifyCommunityAccess } from "@/lib/communityAccess";

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => String(tag).trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  return [];
}

function createSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function toMillis(value: unknown) {
  if (typeof value === "string") {
    return new Date(value).getTime() || 0;
  }

  return 0;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase() || "";
    const uid = searchParams.get("uid")?.trim() || "";
    let verifiedAuthorEmail = "";

    if (email && uid) {
      const access = await verifyCommunityAccess({
        authorUid: uid,
        authorEmail: email,
      });

      if (access.ok && access.user) {
        verifiedAuthorEmail = access.user.email;
      }
    }

    const snapshot = await getDocs(collection(db, "blog_posts"));
    let posts = snapshot.docs.map((entry) => ({
      id: entry.id,
      ...entry.data(),
    })) as Array<Record<string, unknown>>;

    posts = posts.filter((post) =>
      verifiedAuthorEmail
        ? post.status === "published" ||
          String(post.authorEmail || "").toLowerCase() === verifiedAuthorEmail
        : post.status === "published",
    );

    posts.sort((a, b) => {
      const left = toMillis(b.publishedAt || b.updatedAt || b.createdAt);
      const right = toMillis(a.publishedAt || a.updatedAt || a.createdAt);
      return left - right;
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Blog GET error:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    const content = String(body.content || "").trim();
    const contentFormat = normalizeContentFormat(body.contentFormat);
    const coverImageUrl = String(body.coverImageUrl || "").trim();
    const authorEmail = String(body.authorEmail || "").trim().toLowerCase();
    const access = await verifyCommunityAccess({
      authorUid: body.authorUid,
      authorEmail,
    });

    if (!access.ok || !access.user) {
      return NextResponse.json(
        { error: access.error || "Your account could not be verified." },
        { status: 403 },
      );
    }

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    const plainText = toPlainText(content, contentFormat);
    const excerpt =
      String(body.excerpt || "").trim() ||
      `${plainText.slice(0, 180)}${plainText.length > 180 ? "..." : ""}`;
    const now = new Date().toISOString();

    await addDoc(collection(db, "blog_posts"), {
      title,
      slug: `${createSlug(title)}-${Date.now()}`,
      excerpt,
      content,
      contentFormat,
      coverImageUrl,
      tags: normalizeTags(body.tags),
      authorName: access.user.name,
      authorEmail: access.user.email,
      authorUid: access.user.uid,
      status: "pending",
      featured: false,
      adminComment: "",
      createdAt: now,
      updatedAt: now,
      publishedAt: "",
    });

    return NextResponse.json({
      success: true,
      message: "Your article has been submitted for moderation.",
    });
  } catch (error) {
    console.error("Blog POST error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const authorEmail = String(body.authorEmail || "").trim().toLowerCase();

    if (!id || !authorEmail) {
      return NextResponse.json({ error: "Post id and author email are required." }, { status: 400 });
    }

    const access = await verifyCommunityAccess({
      authorUid: body.authorUid,
      authorEmail,
    });

    if (!access.ok || !access.user) {
      return NextResponse.json(
        { error: access.error || "Your account could not be verified." },
        { status: 403 },
      );
    }

    const postRef = doc(db, "blog_posts", id);
    const snapshot = await getDoc(postRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const existing = snapshot.data();
    if (String(existing.authorEmail || "").toLowerCase() !== access.user.email) {
      return NextResponse.json({ error: "You can only update your own posts." }, { status: 403 });
    }

    const title = String(body.title || existing.title || "").trim();
    const content = String(body.content || existing.content || "").trim();
    const contentFormat = normalizeContentFormat(
      body.contentFormat || existing.contentFormat,
    );
    const coverImageUrl = String(
      body.coverImageUrl ?? existing.coverImageUrl ?? "",
    ).trim();
    const plainText = toPlainText(content, contentFormat);
    const excerpt =
      String(body.excerpt || "").trim() ||
      `${plainText.slice(0, 180)}${plainText.length > 180 ? "..." : ""}`;

    await updateDoc(postRef, {
      title,
      slug: createSlug(title),
      excerpt,
      content,
      contentFormat,
      coverImageUrl,
      tags: normalizeTags(body.tags),
      status: existing.status === "published" ? "pending" : existing.status || "pending",
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Your article has been updated and sent for review.",
    });
  } catch (error) {
    console.error("Blog PUT error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const authorEmail = String(body.authorEmail || "").trim().toLowerCase();

    if (!id || !authorEmail) {
      return NextResponse.json({ error: "Post id and author email are required." }, { status: 400 });
    }

    const access = await verifyCommunityAccess({
      authorUid: body.authorUid,
      authorEmail,
    });

    if (!access.ok || !access.user) {
      return NextResponse.json(
        { error: access.error || "Your account could not be verified." },
        { status: 403 },
      );
    }

    const postRef = doc(db, "blog_posts", id);
    const snapshot = await getDoc(postRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    if (String(snapshot.data().authorEmail || "").toLowerCase() !== access.user.email) {
      return NextResponse.json({ error: "You can only delete your own posts." }, { status: 403 });
    }

    await deleteDoc(postRef);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
