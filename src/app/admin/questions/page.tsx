"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  HelpCircle,
  Loader2,
  MessageSquare,
  Trash2,
  XCircle,
} from "lucide-react";
import useAutoRefresh from "@/hooks/useAutoRefresh";

type QuestionAnswer = {
  id: string;
  body: string;
  authorName: string;
  authorEmail: string;
  status: "published" | "hidden";
  createdAt: string;
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

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");

  const stats = useMemo(
    () => ({
      total: questions.length,
      pending: questions.filter((question) => question.status === "pending").length,
      published: questions.filter((question) => question.status === "published").length,
    }),
    [questions],
  );

  useAutoRefresh(fetchQuestions);

  async function fetchQuestions() {
    try {
      const response = await fetch("/api/admin/questions", { cache: "no-store" });
      const data = await response.json();
      const nextQuestions = Array.isArray(data) ? data : [];
      setQuestions(nextQuestions);
      setNotes(
        Object.fromEntries(
          nextQuestions.map((question) => [question.id, question.adminNote || ""]),
        ),
      );
    } catch (error) {
      console.error("Admin questions fetch error:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  const moderateQuestion = async (
    id: string,
    updates: Partial<Pick<QuestionItem, "status" | "adminNote">>,
  ) => {
    setWorkingId(id);
    try {
      const response = await fetch("/api/admin/questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...updates,
          adminNote:
            updates.adminNote !== undefined ? updates.adminNote : notes[id] || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update question");
      }

      await fetchQuestions();
    } catch (error) {
      console.error("Admin question moderation error:", error);
    } finally {
      setWorkingId("");
    }
  };

  const moderateAnswer = async (
    questionId: string,
    answerId: string,
    answerStatus: "published" | "hidden",
  ) => {
    setWorkingId(questionId);
    try {
      const response = await fetch("/api/admin/questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: questionId,
          answerId,
          answerStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update answer");
      }

      await fetchQuestions();
    } catch (error) {
      console.error("Admin answer moderation error:", error);
    } finally {
      setWorkingId("");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question permanently?")) {
      return;
    }

    setWorkingId(id);
    try {
      await fetch(`/api/admin/questions?id=${id}`, { method: "DELETE" });
      await fetchQuestions();
    } catch (error) {
      console.error("Admin question delete error:", error);
    } finally {
      setWorkingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
          <HelpCircle className="h-6 w-6 text-accent-cyan" />
          Questions Moderation
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Moderate community questions, share notes, and hide low-quality answers.
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
      ) : questions.length === 0 ? (
        <div className="glass-card p-12 text-center text-sm text-gray-500">
          No questions found.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="glass-card p-5">
              <div className="flex flex-col gap-5 xl:flex-row">
                <div className="min-w-0 flex-1">
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
                    <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-gray-400">
                      {(question.answers || []).length} answers
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {question.authorName} | {question.authorEmail} | Updated{" "}
                    {formatDate(question.updatedAt || question.createdAt)}
                  </p>
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-300">
                    {question.body}
                  </p>

                  {(question.answers || []).length > 0 && (
                    <div className="mt-5 space-y-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-accent-cyan" />
                        <p className="text-sm font-semibold text-white">
                          Answers
                        </p>
                      </div>
                      {(question.answers || []).map((answer) => (
                        <div
                          key={answer.id}
                          className="rounded-2xl border border-white/[0.06] bg-dark-900/50 p-4"
                        >
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <p className="text-xs text-gray-500">
                              {answer.authorName} | {formatDate(answer.createdAt)}
                            </p>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                answer.status === "hidden"
                                  ? "bg-red-400/10 text-red-400"
                                  : "bg-green-400/10 text-green-400"
                              }`}
                            >
                              {answer.status}
                            </span>
                          </div>
                          <p className="whitespace-pre-line text-sm leading-7 text-gray-300">
                            {answer.body}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                void moderateAnswer(question.id, answer.id, "published")
                              }
                              className="btn-secondary !px-4 !py-2 text-sm"
                            >
                              Publish
                            </button>
                            <button
                              onClick={() =>
                                void moderateAnswer(question.id, answer.id, "hidden")
                              }
                              className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/15"
                            >
                              Hide answer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-full xl:max-w-sm">
                  <label className="label-text">Admin note</label>
                  <textarea
                    value={notes[question.id] || ""}
                    onChange={(event) =>
                      setNotes((current) => ({
                        ...current,
                        [question.id]: event.target.value,
                      }))
                    }
                    className="input-field min-h-[140px] resize-none"
                    placeholder="Guide the student or explain moderation feedback..."
                  />

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        void moderateQuestion(question.id, { status: "published" })
                      }
                      disabled={workingId === question.id}
                      className="btn-primary !w-full !justify-center !px-4 !py-2 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Publish
                    </button>
                    <button
                      onClick={() =>
                        void moderateQuestion(question.id, { status: "pending" })
                      }
                      disabled={workingId === question.id}
                      className="btn-secondary !w-full !justify-center !px-4 !py-2 text-sm"
                    >
                      Keep pending
                    </button>
                    <button
                      onClick={() =>
                        void moderateQuestion(question.id, { status: "hidden" })
                      }
                      disabled={workingId === question.id}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/15"
                    >
                      <XCircle className="h-4 w-4" />
                      Hide
                    </button>
                    <button
                      onClick={() =>
                        void moderateQuestion(question.id, {
                          adminNote: notes[question.id] || "",
                        })
                      }
                      disabled={workingId === question.id}
                      className="btn-secondary !w-full !justify-center !px-4 !py-2 text-sm"
                    >
                      Save note
                    </button>
                  </div>

                  <button
                    onClick={() => void handleDelete(question.id)}
                    disabled={workingId === question.id}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/15"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete question
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
