"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Upload,
  XCircle,
} from "lucide-react";
import clsx from "clsx";
import AnimatedSection from "@/components/AnimatedSection";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import useAutoRefresh from "@/hooks/useAutoRefresh";

interface Submission {
  id: string;
  createdAt: string;
  adminComment: string;
  documentType: string;
  fileName: string;
  status: "pending" | "valid" | "invalid";
}

interface ApiReadResult {
  ok: boolean;
  data: unknown;
  error?: string;
}

const statusConfig = {
  pending: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    icon: Clock,
    label: "Pending Review",
  },
  valid: {
    color: "text-green-400",
    bg: "bg-green-400/10",
    icon: CheckCircle2,
    label: "Verified",
  },
  invalid: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    icon: XCircle,
    label: "Needs Attention",
  },
};

function formatDate(value: string) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function readJsonResponse(response: Response): Promise<ApiReadResult> {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return {
      ok: false,
      data: null,
      error: `Server returned ${response.status} with a non-JSON response.`,
    };
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      ok: false,
      data,
      error:
        typeof data?.error === "string"
          ? data.error
          : `Server returned ${response.status}.`,
    };
  }

  return {
    ok: true,
    data,
  };
}

function DocumentsContent() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchSubmissions() {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/documents/mine?email=${encodeURIComponent(user.email)}`,
        { cache: "no-store" },
      );
      const result = await readJsonResponse(response);

      if (result.ok) {
        setSubmissions(Array.isArray(result.data) ? result.data : []);
        setError("");
      } else {
        setSubmissions([]);
        setError(result.error || "Failed to fetch documents.");
      }
    } catch (error) {
      console.error("Documents fetch error:", error);
      setSubmissions([]);
      setError("Failed to fetch documents.");
    } finally {
      setLoading(false);
    }
  }

  useAutoRefresh(fetchSubmissions, { enabled: Boolean(user?.email) });

  return (
    <div className="section-padding relative">
      <div className="container-max relative space-y-6">
        <AnimatedSection>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent-cyan transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">
            Your documents
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Review every submission and check expert notes in one place.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  Submission history
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {submissions.length} submission(s) linked to {user?.email}
                </p>
              </div>
              <Link href="/document-verification" className="btn-secondary text-sm">
                <Upload className="w-4 h-4" />
                Upload more
              </Link>
            </div>

            {loading ? (
              <div className="py-10 text-center">
                <div className="w-8 h-8 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin mx-auto" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.08] p-10 text-center">
                <FileText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">
                  {error ? "Document history unavailable" : "No submissions yet"}
                </p>
                <p className="text-sm text-gray-500 mb-5">
                  {error
                    ? error
                    : "Upload your first document to start the verification process."}
                </p>
                <Link href="/document-verification" className="btn-primary text-sm">
                  Submit now
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((submission) => {
                  const status =
                    statusConfig[submission.status] || statusConfig.pending;
                  const StatusIcon = status.icon;

                  return (
                    <div key={submission.id} className="glass-card-hover p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-white">
                              {submission.documentType}
                            </p>
                            <span
                              className={clsx(
                                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                                status.bg,
                                status.color,
                              )}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {submission.fileName} • Submitted {formatDate(submission.createdAt)}
                          </p>
                          {submission.adminComment && (
                            <p className="mt-3 text-xs text-gray-400 border-l-2 border-accent-cyan/20 pl-3">
                              <span className="text-accent-cyan font-medium">
                                Expert note:
                              </span>{" "}
                              {submission.adminComment}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

export default function DashboardDocumentsPage() {
  return (
    <RequireAuth>
      <DocumentsContent />
    </RequireAuth>
  );
}
