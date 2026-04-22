"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code2,
  FileText,
  ImagePlus,
  Loader2,
  NotebookPen,
  PencilLine,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import BlogContent from "@/components/BlogContent";
import { useAuth } from "@/lib/auth";
import useAutoRefresh from "@/hooks/useAutoRefresh";
import {
  normalizeContentFormat,
  type ContentFormat,
  toPlainText,
} from "@/lib/richText";

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
  publishedAt?: string;
};

const emptyForm = {
  title: "",
  excerpt: "",
  tags: "",
  coverImageUrl: "",
  content: "",
  contentFormat: "markdown" as ContentFormat,
};

const statusStyles = {
  pending: "bg-amber-400/10 text-amber-400",
  published: "bg-green-400/10 text-green-400",
  rejected: "bg-red-400/10 text-red-400",
};

const formatNotes: Record<ContentFormat, string[]> = {
  markdown: [
    "# Heading / ## Section",
    "**bold** and *italic* emphasis",
    "- bullet lists and 1. numbered lists",
    "> blockquotes for takeaways",
    "[links](https://example.com) and ![images](https://...)",
  ],
  html: [
    "Use semantic tags like <h2>, <p>, <ul>, <blockquote>",
    "Inline event handlers and unsafe tags are stripped automatically",
    "Keep layouts simple and readable for students",
    "External links and images should use full https:// URLs",
    "Use the cover image field for the hero image",
  ],
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

export default function BlogPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");

  async function fetchPosts() {
    try {
      const search = user?.email && user.uid
        ? `?email=${encodeURIComponent(user.email)}&uid=${encodeURIComponent(user.uid)}`
        : "";
      const response = await fetch(`/api/blog${search}`, { cache: "no-store" });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          typeof data?.error === "string" ? data.error : "Failed to fetch blog posts",
        );
      }
      const nextPosts = Array.isArray(data) ? data : [];
      setPosts(nextPosts);

      if (!selectedPostId && nextPosts.length > 0) {
        const firstPublished = nextPosts.find(
          (post) => post.status === "published",
        );
        setSelectedPostId(firstPublished?.id || nextPosts[0]?.id || "");
      }
    } catch (error) {
      console.error("Blog page fetch error:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useAutoRefresh(fetchPosts);

  const myPosts = user?.email
    ? posts.filter(
        (post) => post.authorEmail?.toLowerCase() === user.email?.toLowerCase(),
      )
    : [];

  const publishedPosts = posts.filter((post) => post.status === "published");

  const selectedPost =
    publishedPosts.find((post) => post.id === selectedPostId) || publishedPosts[0];

  const previewExcerpt = useMemo(() => {
    if (form.excerpt.trim()) {
      return form.excerpt.trim();
    }

    const plainText = toPlainText(
      form.content,
      normalizeContentFormat(form.contentFormat),
    );
    return plainText
      ? `${plainText.slice(0, 180)}${plainText.length > 180 ? "..." : ""}`
      : "Your article summary will appear here.";
  }, [form.content, form.contentFormat, form.excerpt]);

  const previewTags = useMemo(
    () =>
      form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 8),
    [form.tags],
  );

  const startEditing = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title || "",
      excerpt: post.excerpt || "",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      coverImageUrl: post.coverImageUrl || "",
      content: post.content || "",
      contentFormat: normalizeContentFormat(post.contentFormat),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetComposer = () => {
    setEditingId("");
    setForm(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user?.email) {
      alert("Please log in to publish or manage blog posts.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/blog", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          ...form,
          authorEmail: user.email,
          authorUid: user.uid,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Failed to save the article");
      }

      resetComposer();
      await fetchPosts();
    } catch (error) {
      console.error("Blog save error:", error);
      alert(error instanceof Error ? error.message : "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.email || !confirm("Delete this article?")) {
      return;
    }

    try {
      const response = await fetch("/api/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          authorEmail: user.email,
          authorUid: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete article");
      }

      if (editingId === id) {
        resetComposer();
      }
      await fetchPosts();
    } catch (error) {
      console.error("Blog delete error:", error);
    }
  };

  return (
    <div>
      <section className="section-padding relative overflow-hidden">
        <div className="absolute right-1/4 top-20 h-[420px] w-[420px] rounded-full bg-accent-cyan/[0.04] blur-[120px]" />
        <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-accent-purple/[0.05] blur-[100px]" />
        <div className="container-max relative">
          <AnimatedSection className="mx-auto max-w-4xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-cyan">
              Community Blog
            </p>
            <h1 className="mb-6 font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
              Write something worth{" "}
              <span className="gradient-text">reading slowly</span>
            </h1>
            <p className="text-lg leading-relaxed text-gray-400">
              Turn your counseling lessons, mistakes, and admission wins into
              clean, readable articles. Compose in markdown or HTML, add a cover
              image, preview it live, and send it for moderation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding !pt-0">
        <div className="container-max space-y-8">
          <div className="grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
            <AnimatedSection direction="left">
              <div className="glass-card p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {editingId ? "Refine your article" : "Compose a new article"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Share practical advice students can actually use.
                    </p>
                  </div>
                  {editingId && (
                    <button
                      onClick={resetComposer}
                      className="btn-secondary !px-4 !py-2 text-sm"
                    >
                      New draft
                    </button>
                  )}
                </div>

                {user ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="label-text">Title</label>
                      <input
                        value={form.title}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        className="input-field"
                        placeholder="How I narrowed my CCMT choice list"
                        required
                      />
                    </div>

                    <div>
                      <label className="label-text">Cover image URL</label>
                      <input
                        value={form.coverImageUrl}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            coverImageUrl: event.target.value,
                          }))
                        }
                        className="input-field"
                        placeholder="https://images.example.com/my-cover.jpg"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Add a large image that makes your post feel like a real
                        article when people open it.
                      </p>
                    </div>

                    <div>
                      <label className="label-text">Writing format</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["markdown", "html"] as ContentFormat[]).map((format) => (
                          <button
                            key={format}
                            type="button"
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                contentFormat: format,
                              }))
                            }
                            className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                              form.contentFormat === format
                                ? "border-accent-cyan/30 bg-accent-cyan/[0.08] text-accent-cyan"
                                : "border-white/[0.08] bg-white/[0.02] text-gray-300"
                            }`}
                          >
                            <p className="flex items-center gap-2 text-sm font-semibold">
                              {format === "markdown" ? (
                                <NotebookPen className="h-4 w-4" />
                              ) : (
                                <Code2 className="h-4 w-4" />
                              )}
                              {format === "markdown" ? "Markdown" : "HTML"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {format === "markdown"
                                ? "Best for clean, fast writing."
                                : "Best if you want full control."}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label-text">Short summary</label>
                      <textarea
                        value={form.excerpt}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            excerpt: event.target.value,
                          }))
                        }
                        className="input-field min-h-[110px] resize-none"
                        placeholder="A 2-3 line summary that appears on the listing page."
                      />
                    </div>

                    <div>
                      <label className="label-text">Tags</label>
                      <input
                        value={form.tags}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            tags: event.target.value,
                          }))
                        }
                        className="input-field"
                        placeholder="CCMT, COAP, IIT, GATE"
                      />
                    </div>

                    <div>
                      <label className="label-text">
                        {form.contentFormat === "markdown"
                          ? "Markdown article body"
                          : "HTML article body"}
                      </label>
                      <textarea
                        value={form.content}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            content: event.target.value,
                          }))
                        }
                        className="input-field min-h-[300px] resize-none font-mono text-sm"
                        placeholder={
                          form.contentFormat === "markdown"
                            ? "# My counseling roadmap\n\nStart with your honest rank range..."
                            : "<h2>My counseling roadmap</h2><p>Start with your honest rank range...</p>"
                        }
                        required
                      />
                    </div>

                    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-cyan">
                        Writing cues
                      </p>
                      <div className="space-y-2">
                        {formatNotes[form.contentFormat].map((note) => (
                          <p key={note} className="text-sm text-gray-400">
                            {note}
                          </p>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary w-full text-sm"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : editingId ? (
                        <>
                          <PencilLine className="h-4 w-4" />
                          Update and resubmit
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Submit for moderation
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <p className="text-sm leading-relaxed text-gray-300">
                      Log in to write, preview, edit, and track your Engineering
                      Loop blog submissions.
                    </p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <Link href="/login" className="btn-secondary text-sm">
                        Log in
                      </Link>
                      <Link href="/signup" className="btn-primary text-sm">
                        Create account
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>

            <div className="space-y-6">
              <AnimatedSection direction="right" delay={0.06}>
                <div className="glass-card overflow-hidden">
                  <div className="border-b border-white/[0.06] px-6 py-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Sparkles className="h-4 w-4 text-accent-cyan" />
                      Live preview
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      This is roughly how your article will look to readers.
                    </p>
                  </div>

                  {form.coverImageUrl ? (
                    <div className="aspect-[16/7] overflow-hidden border-b border-white/[0.06] bg-dark-800">
                      <img
                        src={form.coverImageUrl}
                        alt={form.title || "Blog cover preview"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/7] items-center justify-center border-b border-white/[0.06] bg-gradient-to-br from-accent-cyan/[0.08] via-accent-blue/[0.04] to-accent-purple/[0.08]">
                      <div className="text-center">
                        <ImagePlus className="mx-auto h-10 w-10 text-accent-cyan/70" />
                        <p className="mt-3 text-sm text-gray-400">
                          Add a cover image URL to give your article a stronger
                          first impression.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6 px-6 py-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {(previewTags.length > 0 ? previewTags : ["student story"]).map(
                        (tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-accent-cyan/10 px-3 py-1 text-xs font-semibold text-accent-cyan"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>

                    <div>
                      <h3 className="font-display text-3xl font-bold text-white">
                        {form.title.trim() || "Your article title"}
                      </h3>
                      <p className="mt-3 text-sm text-gray-500">
                        By {user?.name || "Your name"} | {formatDate(new Date().toISOString())}
                      </p>
                      <p className="mt-4 max-w-3xl text-base leading-7 text-gray-400">
                        {previewExcerpt}
                      </p>
                    </div>

                    <div className="border-t border-white/[0.06] pt-6">
                      {form.content.trim() ? (
                        <BlogContent
                          content={form.content}
                          format={form.contentFormat}
                        />
                      ) : (
                        <div className="rounded-3xl border border-dashed border-white/[0.08] p-10 text-center">
                          <BookOpen className="mx-auto mb-4 h-10 w-10 text-gray-700" />
                          <p className="text-sm text-gray-500">
                            Start writing to see the rendered article preview here.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right" delay={0.1}>
                <div className="glass-card p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-accent-cyan" />
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Your submissions
                      </h2>
                      <p className="text-sm text-gray-500">
                        Track moderation status and update your drafts.
                      </p>
                    </div>
                  </div>

                  {!user ? (
                    <p className="text-sm text-gray-500">
                      Sign in to manage your drafts and see admin feedback.
                    </p>
                  ) : myPosts.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/[0.08] p-8 text-center">
                      <FileText className="mx-auto mb-4 h-10 w-10 text-gray-700" />
                      <p className="text-sm font-medium text-white">
                        No submissions yet
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Publish your first article to start building the site blog.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myPosts.map((post) => (
                        <div
                          key={post.id}
                          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                        >
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
                              <span className="rounded-full bg-accent-cyan/10 px-2.5 py-1 text-[11px] font-semibold text-accent-cyan">
                                Featured
                              </span>
                            )}
                            <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-gray-400">
                              {normalizeContentFormat(post.contentFormat)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Updated {formatDate(post.updatedAt || post.createdAt)}
                          </p>
                          {post.adminComment && (
                            <div className="mt-3 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-3">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-400">
                                Admin feedback
                              </p>
                              <p className="mt-1 text-sm text-gray-300">
                                {post.adminComment}
                              </p>
                            </div>
                          )}
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              onClick={() => startEditing(post)}
                              className="btn-secondary !px-4 !py-2 text-sm"
                            >
                              <PencilLine className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => void handleDelete(post.id)}
                              className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/15"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>

          <AnimatedSection>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
                  Published Articles
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-white">
                  Read what students are sharing
                </h2>
              </div>
              <Link
                href="/questions"
                className="hidden text-sm text-accent-cyan transition-colors hover:text-white sm:inline-flex sm:items-center sm:gap-2"
              >
                Visit Q&A
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="glass-card flex items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
            </div>
          ) : publishedPosts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-accent-cyan" />
              <h3 className="text-xl font-semibold text-white">
                No published articles yet
              </h3>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400">
                Once a student submission is approved by the admin team, it will
                appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="space-y-4">
                {publishedPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => setSelectedPostId(post.id)}
                    className={`glass-card-hover w-full overflow-hidden p-0 text-left ${
                      selectedPost?.id === post.id ? "border-accent-cyan/20" : ""
                    }`}
                  >
                    {post.coverImageUrl ? (
                      <div className="aspect-[16/9] overflow-hidden bg-dark-800">
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="p-5">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        {Array.isArray(post.tags) &&
                          post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-gray-400">
                          {normalizeContentFormat(post.contentFormat)}
                        </span>
                        {post.featured && (
                          <span className="rounded-full bg-accent-cyan/10 px-2.5 py-1 text-[11px] font-semibold text-accent-cyan">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-xl font-bold text-white">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray-400">
                        {post.excerpt}
                      </p>
                      <p className="mt-4 text-xs text-gray-500">
                        By {post.authorName} |{" "}
                        {formatDate(post.publishedAt || post.updatedAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {selectedPost ? (
                <article className="glass-card overflow-hidden">
                  {selectedPost.coverImageUrl ? (
                    <div className="aspect-[16/7] overflow-hidden bg-dark-800">
                      <img
                        src={selectedPost.coverImageUrl}
                        alt={selectedPost.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="space-y-6 p-6 lg:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      {Array.isArray(selectedPost.tags) &&
                        selectedPost.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-accent-cyan/10 px-3 py-1 text-xs font-semibold text-accent-cyan"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    <div>
                      <h2 className="font-display text-3xl font-bold text-white">
                        {selectedPost.title}
                      </h2>
                      <p className="mt-3 text-sm text-gray-500">
                        By {selectedPost.authorName} | Published{" "}
                        {formatDate(selectedPost.publishedAt || selectedPost.updatedAt)}
                      </p>
                      <p className="mt-4 max-w-3xl text-base leading-7 text-gray-400">
                        {selectedPost.excerpt}
                      </p>
                    </div>

                    <div className="border-t border-white/[0.06] pt-6">
                      <BlogContent
                        content={selectedPost.content}
                        format={selectedPost.contentFormat}
                      />
                    </div>
                  </div>
                </article>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
