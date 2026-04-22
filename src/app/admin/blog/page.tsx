"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  FileText,
  ImagePlus,
  Loader2,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import useAutoRefresh from "@/hooks/useAutoRefresh";
import BlogContent from "@/components/BlogContent";
import { normalizeContentFormat, type ContentFormat } from "@/lib/richText";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  contentFormat?: ContentFormat;
  coverImageUrl?: string;
  tags?: string[];
  authorName: string;
  authorEmail: string;
  status: "pending" | "published" | "rejected";
  adminComment?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const statusStyles = {
  pending: "bg-amber-400/10 text-amber-400",
  published: "bg-green-400/10 text-green-400",
  rejected: "bg-red-400/10 text-red-400",
};

function formatDate(value?: string) {
  if (!value) {
    return "Just now";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");

  const stats = useMemo(
    () => ({
      total: posts.length,
      pending: posts.filter((post) => post.status === "pending").length,
      published: posts.filter((post) => post.status === "published").length,
    }),
    [posts],
  );

  async function fetchPosts() {
    try {
      const response = await fetch("/api/admin/blog", { cache: "no-store" });
      const data = await response.json();
      const nextPosts = Array.isArray(data) ? data : [];
      setPosts(nextPosts);
      setNotes(
        Object.fromEntries(
          nextPosts.map((post) => [post.id, post.adminComment || ""]),
        ),
      );
    } catch (error) {
      console.error("Admin blog fetch error:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useAutoRefresh(fetchPosts);

  const moderate = async (
    id: string,
    updates: Partial<Pick<BlogPost, "status" | "featured" | "adminComment">>,
  ) => {
    setWorkingId(id);
    try {
      const response = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...updates,
          adminComment:
            updates.adminComment !== undefined ? updates.adminComment : notes[id] || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update blog post");
      }

      await fetchPosts();
    } catch (error) {
      console.error("Admin blog moderation error:", error);
    } finally {
      setWorkingId("");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article permanently?")) {
      return;
    }

    setWorkingId(id);
    try {
      await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      await fetchPosts();
    } catch (error) {
      console.error("Admin blog delete error:", error);
    } finally {
      setWorkingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
          <FileText className="h-6 w-6 text-accent-cyan" />
          Blog Moderation
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review community articles, add feedback, and decide what gets published.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">Total</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">
            {stats.total}
          </p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">Pending</p>
          <p className="mt-2 font-display text-3xl font-bold text-amber-400">
            {stats.pending}
          </p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">Published</p>
          <p className="mt-2 font-display text-3xl font-bold text-green-400">
            {stats.published}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="glass-card flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-card p-12 text-center text-sm text-gray-500">
          No blog submissions found.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="glass-card p-5">
              <div className="flex flex-col gap-5 xl:flex-row">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-white">
                      {post.title}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        statusStyles[post.status] || statusStyles.pending
                      }`}
                    >
                      {post.status}
                    </span>
                    {post.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-cyan/10 px-2.5 py-1 text-[11px] font-semibold text-accent-cyan">
                        <Sparkles className="h-3.5 w-3.5" />
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {post.authorName} | {post.authorEmail} | Updated{" "}
                    {formatDate(post.updatedAt || post.createdAt)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-gray-400">
                      {normalizeContentFormat(post.contentFormat)}
                    </span>
                    {post.coverImageUrl ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-gray-400">
                        <ImagePlus className="h-3.5 w-3.5" />
                        Cover image
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-gray-300">
                    {post.excerpt}
                  </p>
                  {post.coverImageUrl ? (
                    <div className="mt-4 aspect-[16/7] overflow-hidden rounded-3xl border border-white/[0.06] bg-dark-900">
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <BlogContent content={post.content} format={post.contentFormat} />
                  </div>
                </div>

                <div className="w-full xl:max-w-sm">
                  <label className="label-text">Admin feedback</label>
                  <textarea
                    value={notes[post.id] || ""}
                    onChange={(event) =>
                      setNotes((current) => ({
                        ...current,
                        [post.id]: event.target.value,
                      }))
                    }
                    className="input-field min-h-[140px] resize-none"
                    placeholder="Add moderation notes for the student..."
                  />

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        void moderate(post.id, { status: "published" })
                      }
                      disabled={workingId === post.id}
                      className="btn-primary !w-full !justify-center !px-4 !py-2 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Publish
                    </button>
                    <button
                      onClick={() =>
                        void moderate(post.id, { status: "pending" })
                      }
                      disabled={workingId === post.id}
                      className="btn-secondary !w-full !justify-center !px-4 !py-2 text-sm"
                    >
                      Keep pending
                    </button>
                    <button
                      onClick={() =>
                        void moderate(post.id, { status: "rejected" })
                      }
                      disabled={workingId === post.id}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/15"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        void moderate(post.id, { featured: !post.featured })
                      }
                      disabled={workingId === post.id}
                      className="btn-secondary !w-full !justify-center !px-4 !py-2 text-sm"
                    >
                      <Sparkles className="h-4 w-4" />
                      {post.featured ? "Unfeature" : "Feature"}
                    </button>
                  </div>

                  <button
                    onClick={() => void handleDelete(post.id)}
                    disabled={workingId === post.id}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/15"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete article
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
