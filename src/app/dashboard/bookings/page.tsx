"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  MessageSquare,
  Video,
  XCircle,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import useAutoRefresh from "@/hooks/useAutoRefresh";

type Booking = {
  id: string;
  plan: string;
  preferredDate: string;
  preferredTime: string;
  confirmedDate?: string;
  confirmedTime?: string;
  meetLink?: string;
  adminNote?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt?: string;
};

const statusConfig = {
  pending: {
    label: "Pending",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-green-400",
    bg: "bg-green-400/10",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-400/10",
    icon: XCircle,
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

async function readJsonOrThrow(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    if (contentType.includes("application/json")) {
      const data = await response.json().catch(() => null);
      throw new Error(
        typeof data?.error === "string" ? data.error : "Failed to fetch bookings.",
      );
    }

    throw new Error(`Failed to fetch bookings. Server returned ${response.status}.`);
  }

  if (!contentType.includes("application/json")) {
    throw new Error("Bookings endpoint returned a non-JSON response.");
  }

  return response.json();
}

function BookingsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBookings() {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/bookings/mine?email=${encodeURIComponent(user.email)}`,
        { cache: "no-store" },
      );
      const data = await readJsonOrThrow(response);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Dashboard bookings fetch error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useAutoRefresh(fetchBookings, { enabled: Boolean(user?.email) });

  const stats = useMemo(
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
            Counseling Sessions
          </p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Your booking timeline
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
            Once the admin team confirms your slot, the final date, time, Google
            Meet link, and note will appear here.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <div className="glass-card p-5 text-center">
              <CalendarDays className="mx-auto mb-2 h-6 w-6 text-accent-cyan" />
              <p className="font-display text-2xl font-bold text-white">
                {stats.total}
              </p>
              <p className="text-xs text-gray-500">Total bookings</p>
            </div>
            <div className="glass-card p-5 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-green-400" />
              <p className="font-display text-2xl font-bold text-green-400">
                {stats.confirmed}
              </p>
              <p className="text-xs text-gray-500">Confirmed slots</p>
            </div>
            <div className="glass-card p-5 text-center col-span-2 lg:col-span-1">
              <Clock className="mx-auto mb-2 h-6 w-6 text-amber-400" />
              <p className="font-display text-2xl font-bold text-amber-400">
                {stats.pending}
              </p>
              <p className="text-xs text-gray-500">Awaiting confirmation</p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.16}>
          {loading ? (
            <div className="glass-card flex items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <CalendarDays className="mx-auto mb-4 h-12 w-12 text-accent-cyan" />
              <h2 className="text-xl font-semibold text-white">
                No counseling bookings yet
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">
                Book a counseling session to reserve a slot and receive a Google
                Meet link once the admin confirms it.
              </p>
              <Link href="/book-counseling" className="btn-primary mt-6 text-sm">
                Book counseling
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const status =
                  statusConfig[booking.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <div key={booking.id} className="glass-card p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <p className="font-display text-2xl font-bold text-white">
                            {booking.plan || "Counseling session"}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.bg} ${status.color}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {status.label}
                          </span>
                        </div>

                        <div className="grid gap-3 text-sm text-gray-400 sm:grid-cols-2">
                          <p>
                            <span className="text-gray-500">Requested:</span>{" "}
                            {booking.preferredDate || "N/A"}
                            {booking.preferredTime ? ` at ${booking.preferredTime}` : ""}
                          </p>
                          <p>
                            <span className="text-gray-500">Booked on:</span>{" "}
                            {formatDate(booking.createdAt)}
                          </p>
                          <p>
                            <span className="text-gray-500">Confirmed:</span>{" "}
                            {booking.confirmedDate
                              ? `${booking.confirmedDate} at ${booking.confirmedTime || "TBD"}`
                              : "Not confirmed yet"}
                          </p>
                        </div>

                        {booking.adminNote && (
                          <div className="mt-4 rounded-2xl border border-accent-cyan/10 bg-accent-cyan/[0.05] p-4">
                            <p className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-accent-cyan">
                              <MessageSquare className="h-3.5 w-3.5" />
                              Admin note
                            </p>
                            <p className="text-sm leading-relaxed text-gray-300">
                              {booking.adminNote}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="w-full lg:max-w-xs">
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                          <div className="mb-3 flex items-center gap-2 text-white">
                            <Video className="h-4 w-4 text-accent-cyan" />
                            <p className="text-sm font-semibold">Google Meet</p>
                          </div>
                          {booking.meetLink ? (
                            <>
                              <p className="text-sm leading-relaxed text-gray-400">
                                This meeting link is live for your confirmed slot.
                              </p>
                              <a
                                href={booking.meetLink}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-primary mt-4 w-full text-sm"
                              >
                                Join Google Meet
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">
                              The admin team will add the Google Meet link here
                              after confirming your slot.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}

export default function DashboardBookingsPage() {
  return (
    <RequireAuth>
      <BookingsContent />
    </RequireAuth>
  );
}
