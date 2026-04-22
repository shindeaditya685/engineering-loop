"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  MessageSquare,
  Upload,
  Video,
  XCircle,
} from "lucide-react";
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

interface Booking {
  id: string;
  createdAt?: string;
  plan: string;
  preferredDate: string;
  preferredTime: string;
  confirmedDate?: string;
  confirmedTime?: string;
  meetLink?: string;
  adminNote?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

interface ApiReadResult {
  ok: boolean;
  status: number;
  data: unknown;
  error?: string;
}

const documentStatusConfig = {
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

const bookingStatusConfig = {
  pending: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    label: "Pending",
  },
  confirmed: {
    color: "text-green-400",
    bg: "bg-green-400/10",
    label: "Confirmed",
  },
  completed: {
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10",
    label: "Completed",
  },
  cancelled: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    label: "Cancelled",
  },
};

function formatDate(value?: string) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function readJsonResponse(
  response: Response,
  fallbackMessage: string,
): Promise<ApiReadResult> {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return {
      ok: false,
      status: response.status,
      data: null,
      error: `${fallbackMessage} Server returned a non-JSON response.`,
    };
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      data,
      error:
        typeof data?.error === "string"
          ? data.error
          : `${fallbackMessage} Server returned ${response.status}.`,
    };
  }

  return {
    ok: true,
    status: response.status,
    data,
  };
}

function DashboardContent() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [documentsError, setDocumentsError] = useState("");
  const [bookingsError, setBookingsError] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchDashboardData() {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      const [documentsResponse, bookingsResponse] = await Promise.all([
        fetch(`/api/documents/mine?email=${encodeURIComponent(user.email)}`, {
          cache: "no-store",
        }),
        fetch(`/api/bookings/mine?email=${encodeURIComponent(user.email)}`, {
          cache: "no-store",
        }),
      ]);

      const [documentsResult, bookingsResult] = await Promise.all([
        readJsonResponse(documentsResponse, "Failed to fetch documents."),
        readJsonResponse(bookingsResponse, "Failed to fetch bookings."),
      ]);

      if (documentsResult.ok) {
        setSubmissions(Array.isArray(documentsResult.data) ? documentsResult.data : []);
        setDocumentsError("");
      } else {
        setSubmissions([]);
        setDocumentsError(documentsResult.error || "Failed to fetch documents.");
      }

      if (bookingsResult.ok) {
        setBookings(Array.isArray(bookingsResult.data) ? bookingsResult.data : []);
        setBookingsError("");
      } else {
        setBookings([]);
        setBookingsError(bookingsResult.error || "Failed to fetch bookings.");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setSubmissions([]);
      setBookings([]);
      setDocumentsError("Failed to load dashboard data.");
      setBookingsError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useAutoRefresh(fetchDashboardData, { enabled: Boolean(user?.email) });

  const documentStats = useMemo(
    () => ({
      total: submissions.length,
      valid: submissions.filter((item) => item.status === "valid").length,
      pending: submissions.filter((item) => item.status === "pending").length,
      invalid: submissions.filter((item) => item.status === "invalid").length,
    }),
    [submissions],
  );

  const bookingStats = useMemo(
    () => ({
      total: bookings.length,
      confirmed: bookings.filter((booking) => booking.status === "confirmed").length,
      pending: bookings.filter((booking) => booking.status === "pending").length,
    }),
    [bookings],
  );

  return (
    <div className="section-padding relative">
      <div className="absolute left-1/3 top-20 h-[500px] w-[500px] rounded-full bg-accent-cyan/[0.04] blur-[120px]" />
      <div className="container-max relative space-y-8">
        <AnimatedSection>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-cyan">
            Student Dashboard
          </p>
          <h1 className="mb-3 font-display text-3xl font-bold sm:text-4xl">
            Welcome back,{" "}
            <span className="gradient-text">{user?.name || "Student"}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-sm text-gray-400">
              {user?.email}
            </span>
            <span className="rounded-lg bg-accent-purple/10 px-3 py-1.5 text-xs font-semibold text-accent-purple">
              {(user?.plan || "free").toUpperCase()} plan
            </span>
            {user?.gatePaper && (
              <span className="rounded-lg bg-accent-blue/10 px-3 py-1.5 text-xs font-semibold text-accent-blue">
                GATE {user.gatePaper}
              </span>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="glass-card p-5 text-center">
              <FileText className="mx-auto mb-2 h-6 w-6 text-accent-cyan" />
              <p className="font-display text-2xl font-bold text-white">
                {documentStats.total}
              </p>
              <p className="text-xs text-gray-500">Total documents</p>
            </div>
            <div className="glass-card p-5 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-green-400" />
              <p className="font-display text-2xl font-bold text-green-400">
                {documentStats.valid}
              </p>
              <p className="text-xs text-gray-500">Verified</p>
            </div>
            <div className="glass-card p-5 text-center">
              <CalendarDays className="mx-auto mb-2 h-6 w-6 text-accent-purple" />
              <p className="font-display text-2xl font-bold text-accent-purple">
                {bookingStats.total}
              </p>
              <p className="text-xs text-gray-500">Bookings</p>
            </div>
            <div className="glass-card p-5 text-center">
              <Video className="mx-auto mb-2 h-6 w-6 text-accent-blue" />
              <p className="font-display text-2xl font-bold text-accent-blue">
                {bookingStats.confirmed}
              </p>
              <p className="text-xs text-gray-500">Confirmed sessions</p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.16}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Link href="/document-verification" className="glass-card-hover p-5 group">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-cyan/10 transition-colors group-hover:bg-accent-cyan/20">
                <Upload className="h-5 w-5 text-accent-cyan" />
              </div>
              <p className="text-sm font-semibold text-white transition-colors group-hover:text-accent-cyan">
                Upload documents
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Submit files for verification and track review updates.
              </p>
            </Link>

            <Link href="/book-counseling" className="glass-card-hover p-5 group">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-purple/10 transition-colors group-hover:bg-accent-purple/20">
                <GraduationCap className="h-5 w-5 text-accent-purple" />
              </div>
              <p className="text-sm font-semibold text-white transition-colors group-hover:text-accent-purple">
                Book counseling
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Reserve a 1-on-1 session for rank, branch, and institute strategy.
              </p>
            </Link>

            <Link href="/dashboard/bookings" className="glass-card-hover p-5 group">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-blue/10 transition-colors group-hover:bg-accent-blue/20">
                <CalendarDays className="h-5 w-5 text-accent-blue" />
              </div>
              <p className="text-sm font-semibold text-white transition-colors group-hover:text-accent-blue">
                View bookings
              </p>
              <p className="mt-1 text-xs text-gray-500">
                See confirmed time slots, meet links, and admin session notes.
              </p>
            </Link>

            <button
              onClick={() => {
                const chatButton = document.querySelector(
                  '[aria-label="Chat with Loopie"]',
                ) as HTMLElement | null;
                chatButton?.click();
              }}
              className="glass-card-hover p-5 text-left group"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-blue/10 transition-colors group-hover:bg-accent-blue/20">
                <MessageSquare className="h-5 w-5 text-accent-blue" />
              </div>
              <p className="text-sm font-semibold text-white transition-colors group-hover:text-accent-blue">
                Ask Loopie
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Get answers from the Engineering Loop knowledge base and cutoff data.
              </p>
            </button>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.24}>
          <div className="glass-card p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  Counseling bookings
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Track your session confirmations and meeting links.
                </p>
              </div>
              <Link
                href="/dashboard/bookings"
                className="hidden items-center gap-2 text-sm text-accent-cyan transition-colors hover:text-white sm:inline-flex"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="py-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent-cyan/30 border-t-accent-cyan" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.08] p-10 text-center">
                <CalendarDays className="mx-auto mb-4 h-12 w-12 text-gray-700" />
                <p className="mb-2 font-medium text-white">No bookings yet</p>
                <p className="mb-5 text-sm text-gray-500">
                  {bookingsError
                    ? bookingsError
                    : "Book a session and the final schedule with Google Meet link will appear here after admin confirmation."}
                </p>
                <Link href="/book-counseling" className="btn-secondary text-sm">
                  Book counseling
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking) => {
                  const status =
                    bookingStatusConfig[booking.status] || bookingStatusConfig.pending;

                  return (
                    <div key={booking.id} className="glass-card-hover p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-white">
                              {booking.plan || "Counseling session"}
                            </p>
                            <span
                              className={clsx(
                                "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                                status.bg,
                                status.color,
                              )}
                            >
                              {status.label}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Requested {booking.preferredDate || "N/A"}
                            {booking.preferredTime ? ` at ${booking.preferredTime}` : ""}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Confirmed{" "}
                            {booking.confirmedDate
                              ? `${booking.confirmedDate} at ${booking.confirmedTime || "TBD"}`
                              : "awaiting admin confirmation"}
                          </p>
                          {booking.adminNote && (
                            <p className="mt-3 border-l-2 border-accent-cyan/20 pl-3 text-xs text-gray-400">
                              <span className="font-medium text-accent-cyan">
                                Session note:
                              </span>{" "}
                              {booking.adminNote}
                            </p>
                          )}
                        </div>

                        {booking.meetLink ? (
                          <a
                            href={booking.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary text-sm"
                          >
                            Join meet
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-xs text-gray-500">
                            Meet link pending
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.32}>
          <div className="glass-card p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  Recent document activity
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your latest submission status and expert notes.
                </p>
              </div>
              <Link
                href="/dashboard/documents"
                className="hidden items-center gap-2 text-sm text-accent-cyan transition-colors hover:text-white sm:inline-flex"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="py-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent-cyan/30 border-t-accent-cyan" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.08] p-10 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-700" />
                <p className="mb-2 font-medium text-white">
                  {documentsError ? "Documents unavailable right now" : "No documents submitted yet"}
                </p>
                <p className="mb-5 text-sm text-gray-500">
                  {documentsError
                    ? documentsError
                    : "Upload your scorecard, certificates, and other documents to get them reviewed before counseling."}
                </p>
                <Link href="/document-verification" className="btn-secondary text-sm">
                  Submit documents
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.slice(0, 5).map((submission) => {
                  const status =
                    documentStatusConfig[submission.status] ||
                    documentStatusConfig.pending;
                  const StatusIcon = status.icon;

                  return (
                    <div key={submission.id} className="glass-card-hover p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {submission.fileName} | Submitted {formatDate(submission.createdAt)}
                          </p>
                          {submission.adminComment && (
                            <p className="mt-3 border-l-2 border-accent-cyan/20 pl-3 text-xs text-gray-400">
                              <span className="font-medium text-accent-cyan">
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

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
