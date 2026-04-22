"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  HelpCircle,
  Loader2,
  MessageSquare,
  PencilLine,
  Plus,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/lib/auth";
import useAutoRefresh from "@/hooks/useAutoRefresh";

type QuestionAnswer = {
  id: string;
  body: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  status: "published" | "hidden";
};

type QuestionItem = {
  id: string;
  title: string;
  body: string;
  tags?: string[];
  authorName: string;
  authorEmail: string;
  status: "pending" | "published" | "hidden";
  adminNote?: string;
  answers?: QuestionAnswer[];
  createdAt?: string;
  updatedAt?: string;
};

const emptyForm = {
  title: "",
  body: "",
  tags: "",
};

const statusStyles = {
  pending: "bg-amber-400/10 text-amber-400",
  published: "bg-green-400/10 text-green-400",
  hidden: "bg-red-400/10 text-red-400",
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

export default function QuestionsPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [answeringId, setAnsweringId] = useState("");

  async function fetchQuestions() {
    try {
      const search = user?.email && user.uid
        ? `?email=${encodeURIComponent(user.email)}&uid=${encodeURIComponent(user.uid)}`
        : "";
      const response = await fetch(`/api/questions${search}`, { cache: "no-store" });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          typeof data?.error === "string" ? data.error : "Failed to fetch questions",
        );
      }
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Questions page fetch error:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  useAutoRefresh(fetchQuestions);

  const myQuestions = user?.email
    ? questions.filter(
        (question) =>
          question.authorEmail?.toLowerCase() === user.email?.toLowerCase(),
      )
    : [];

  const filteredQuestions = (() => {
    const lower = query.trim().toLowerCase();
    if (!lower) {
      return questions.filter((question) => question.status === "published");
    }

    return questions.filter((question) => {
      if (question.status !== "published") {
        return false;
      }

      const haystack = [
        question.title,
        question.body,
        ...(question.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(lower);
    });
  })();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user?.email) {
      alert("Please log in to ask or manage questions.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/questions", {
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
        throw new Error(data?.error || "Failed to save question");
      }

      setForm(emptyForm);
      setEditingId("");
      await fetchQuestions();
    } catch (error) {
      console.error("Questions save error:", error);
      alert(error instanceof Error ? error.message : "Failed to save question");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (question: QuestionItem) => {
    setEditingId(question.id);
    setForm({
      title: question.title || "",
      body: question.body || "",
      tags: Array.isArray(question.tags) ? question.tags.join(", ") : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!user?.email || !confirm("Delete this question?")) {
      return;
    }

    try {
      const response = await fetch("/api/questions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          authorEmail: user.email,
          authorUid: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }

      if (editingId === id) {
        setForm(emptyForm);
        setEditingId("");
      }
      await fetchQuestions();
    } catch (error) {
      console.error("Question delete error:", error);
    }
  };

  const handleAnswer = async (questionId: string) => {
    if (!user?.email) {
      alert("Please log in to answer questions.");
      return;
    }

    const body = (answerDrafts[questionId] || "").trim();
    if (!body) {
      return;
    }

    setAnsweringId(questionId);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "answer",
          id: questionId,
          body,
          authorEmail: user.email,
          authorUid: user.uid,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Failed to submit answer");
      }

      setAnswerDrafts((current) => ({ ...current, [questionId]: "" }));
      await fetchQuestions();
    } catch (error) {
      console.error("Question answer error:", error);
      alert(error instanceof Error ? error.message : "Failed to submit answer");
    } finally {
      setAnsweringId("");
    }
  };

  return (
    <div>
      <section className="section-padding relative">
        <div className="absolute left-1/4 top-20 h-[420px] w-[420px] rounded-full bg-accent-purple/[0.04] blur-[120px]" />
        <div className="container-max relative">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-cyan">
              Community Q&A
            </p>
            <h1 className="mb-6 font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
              Ask and answer{" "}
              <span className="gradient-text">real admission questions</span>
            </h1>
            <p className="text-lg leading-relaxed text-gray-400">
              Students can post doubts, share practical answers, and build a
              reusable question bank for future applicants.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding !pt-0">
        <div className="container-max space-y-8">
          <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
            <AnimatedSection direction="left">
              <div className="glass-card p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {editingId ? "Update question" : "Ask a question"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Submissions are reviewed before they appear publicly.
                    </p>
                  </div>
                  {editingId && (
                    <button
                      onClick={() => {
                        setEditingId("");
                        setForm(emptyForm);
                      }}
                      className="btn-secondary !px-4 !py-2 text-sm"
                    >
                      New question
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
                          setForm((current) => ({ ...current, title: event.target.value }))
                        }
                        className="input-field"
                        placeholder="Can I keep old IITs above new IIT CSE options?"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-text">Details</label>
                      <textarea
                        value={form.body}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, body: event.target.value }))
                        }
                        className="input-field min-h-[220px] resize-none"
                        placeholder="Add rank, paper, category, target branches, or the exact decision you are struggling with."
                        required
                      />
                    </div>
                    <div>
                      <label className="label-text">Tags</label>
                      <input
                        value={form.tags}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, tags: event.target.value }))
                        }
                        className="input-field"
                        placeholder="CCMT, COAP, cutoff, IIT"
                      />
                    </div>
                    <button type="submit" disabled={saving} className="btn-primary w-full text-sm">
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
                          Submit question
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <p className="text-sm leading-relaxed text-gray-300">
                      Sign in to ask new questions, post answers, and manage your
                      own discussion threads.
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

            <AnimatedSection direction="right" delay={0.08}>
              <div className="glass-card p-6">
                <div className="mb-5 flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-accent-cyan" />
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Your question threads
                    </h2>
                    <p className="text-sm text-gray-500">
                      Track moderation notes and update your posts.
                    </p>
                  </div>
                </div>

                {!user ? (
                  <p className="text-sm text-gray-500">
                    Sign in to manage your discussion history.
                  </p>
                ) : myQuestions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/[0.08] p-8 text-center">
                    <HelpCircle className="mx-auto mb-4 h-10 w-10 text-gray-700" />
                    <p className="text-sm font-medium text-white">
                      No questions posted yet
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Your pending, published, and hidden threads will show up here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myQuestions.map((question) => (
                      <div key={question.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-white">
                            {question.title}
                          </p>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              statusStyles[question.status] || statusStyles.pending
                            }`}
                          >
                            {question.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Updated {formatDate(question.updatedAt || question.createdAt)}
                        </p>
                        {question.adminNote && (
                          <div className="mt-3 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-3">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-400">
                              Admin note
                            </p>
                            <p className="mt-1 text-sm text-gray-300">
                              {question.adminNote}
                            </p>
                          </div>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => startEditing(question)}
                            className="btn-secondary !px-4 !py-2 text-sm"
                          >
                            <PencilLine className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => void handleDelete(question.id)}
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

          <AnimatedSection>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
                  Published Questions
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-white">
                  Browse the active question bank
                </h2>
              </div>
              <div className="relative max-w-md flex-1 sm:max-w-sm">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="input-field pl-10 text-sm"
                  placeholder="Search questions..."
                />
              </div>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="glass-card flex items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <HelpCircle className="mx-auto mb-4 h-12 w-12 text-accent-cyan" />
              <h3 className="text-xl font-semibold text-white">
                No matching questions
              </h3>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400">
                Try a broader search or be the first to ask a new question.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredQuestions.map((question) => (
                <AnimatedSection key={question.id}>
                  <div className="glass-card p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          {Array.isArray(question.tags) &&
                            question.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-gray-400"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        <h3 className="font-display text-2xl font-bold text-white">
                          {question.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Asked by {question.authorName} | Updated{" "}
                          {formatDate(question.updatedAt || question.createdAt)}
                        </p>
                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-300">
                          {question.body}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-center">
                        <p className="font-display text-2xl font-bold text-accent-cyan">
                          {question.answers?.length || 0}
                        </p>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Answers
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {(question.answers || []).map((answer) => (
                        <div
                          key={answer.id}
                          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                        >
                          <p className="whitespace-pre-line text-sm leading-7 text-gray-300">
                            {answer.body}
                          </p>
                          <p className="mt-3 text-xs text-gray-500">
                            {answer.authorName} | {formatDate(answer.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      {user ? (
                        <>
                          <label className="label-text">Add your answer</label>
                          <textarea
                            value={answerDrafts[question.id] || ""}
                            onChange={(event) =>
                              setAnswerDrafts((current) => ({
                                ...current,
                                [question.id]: event.target.value,
                              }))
                            }
                            className="input-field min-h-[120px] resize-none"
                            placeholder="Share a practical answer or a useful perspective for this student."
                          />
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => void handleAnswer(question.id)}
                              disabled={answeringId === question.id}
                              className="btn-primary text-sm"
                            >
                              {answeringId === question.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Posting...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4" />
                                  Post answer
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm text-gray-400">
                            Log in to answer this question and join the discussion.
                          </p>
                          <Link href="/login" className="btn-secondary text-sm">
                            Log in
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          <AnimatedSection>
            <div className="glass-card p-6 text-center sm:p-8">
              <h3 className="font-display text-2xl font-bold text-white">
                Need a faster expert answer?
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
                Use Loopie for knowledge-base answers or book a counseling session
                when the decision is personal and time-sensitive.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    const chatButton = document.querySelector(
                      '[aria-label="Chat with Loopie"]',
                    ) as HTMLElement | null;
                    chatButton?.click();
                  }}
                  className="btn-secondary text-sm"
                >
                  Open Loopie
                </button>
                <Link href="/book-counseling" className="btn-primary text-sm">
                  Book counseling
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
