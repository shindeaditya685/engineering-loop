"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Loader2,
  PencilLine,
  Trash2,
  Video,
  X,
} from "lucide-react";
import useAutoRefresh from "@/hooks/useAutoRefresh";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  gateRank?: string;
  gatePaper?: string;
  category?: string;
  branchPreference?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  confirmedDate?: string;
  confirmedTime?: string;
  meetLink?: string;
  adminNote?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt?: string;
};

const statusConfig = {
  pending: { color: "text-amber-400", bg: "bg-amber-400/10", label: "Pending" },
  confirmed: { color: "text-green-400", bg: "bg-green-400/10", label: "Confirmed" },
  completed: { color: "text-accent-cyan", bg: "bg-accent-cyan/10", label: "Completed" },
  cancelled: { color: "text-red-400", bg: "bg-red-400/10", label: "Cancelled" },
};

function formatDateTime(value?: string) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [editing, setEditing] = useState<Booking | null>(null);
  const [form, setForm] = useState({
    status: "pending",
    confirmedDate: "",
    confirmedTime: "",
    meetLink: "",
    adminNote: "",
  });

  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((booking) => booking.status === "pending").length,
      confirmed: bookings.filter((booking) => booking.status === "confirmed").length,
    }),
    [bookings],
  );

  async function fetchBookings() {
    try {
      const response = await fetch("/api/admin/bookings", { cache: "no-store" });
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Admin bookings fetch error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useAutoRefresh(fetchBookings);

  const openEditor = (booking: Booking) => {
    setEditing(booking);
    setForm({
      status: booking.status || "pending",
      confirmedDate: booking.confirmedDate || "",
      confirmedTime: booking.confirmedTime || "",
      meetLink: booking.meetLink || "",
      adminNote: booking.adminNote || "",
    });
  };

  const closeEditor = () => {
    setEditing(null);
    setForm({
      status: "pending",
      confirmedDate: "",
      confirmedTime: "",
      meetLink: "",
      adminNote: "",
    });
  };

  const saveBooking = async () => {
    if (!editing) {
      return;
    }

    setWorkingId(editing.id);
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          ...form,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Failed to update booking");
      }

      closeEditor();
      await fetchBookings();
    } catch (error) {
      console.error("Admin bookings save error:", error);
      alert(error instanceof Error ? error.message : "Failed to update booking");
    } finally {
      setWorkingId("");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this booking?")) {
      return;
    }

    setWorkingId(id);
    try {
      await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
      if (editing?.id === id) {
        closeEditor();
      }
      await fetchBookings();
    } catch (error) {
      console.error("Admin bookings delete error:", error);
    } finally {
      setWorkingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
          <CalendarDays className="h-6 w-6 text-accent-blue" />
          Counseling Bookings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Confirm session timing, attach Google Meet links, and share notes with students.
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
          <p className="text-xs uppercase tracking-wide text-gray-500">Confirmed</p>
          <p className="mt-2 font-display text-3xl font-bold text-green-400">
            {stats.confirmed}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="glass-card flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card p-12 text-center text-sm text-gray-500">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const status =
              statusConfig[booking.status] || statusConfig.pending;

            return (
              <div key={booking.id} className="glass-card p-5">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {booking.name}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.bg} ${status.color}`}
                      >
                        {status.label}
                      </span>
                      <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-accent-purple">
                        {booking.plan || "Plan not set"}
                      </span>
                    </div>

                    <div className="grid gap-2 text-sm text-gray-400 md:grid-cols-2 xl:grid-cols-3">
                      <p>{booking.email}</p>
                      <p>{booking.phone || "Phone not provided"}</p>
                      <p>Booked {formatDateTime(booking.createdAt)}</p>
                      <p>
                        Preferred: {booking.preferredDate || "N/A"}
                        {booking.preferredTime ? ` at ${booking.preferredTime}` : ""}
                      </p>
                      <p>
                        Confirmed: {booking.confirmedDate || "Not set"}
                        {booking.confirmedTime ? ` at ${booking.confirmedTime}` : ""}
                      </p>
                      <p>
                        GATE: {booking.gatePaper || "-"}
                        {booking.gateRank ? ` | Rank ${booking.gateRank}` : ""}
                      </p>
                    </div>

                    {booking.adminNote && (
                      <div className="mt-4 rounded-2xl border border-accent-cyan/10 bg-accent-cyan/[0.05] p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-cyan">
                          Student note from admin
                        </p>
                        <p className="mt-1 text-sm text-gray-300">
                          {booking.adminNote}
                        </p>
                      </div>
                    )}

                    {booking.meetLink && (
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-400/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                        <Video className="h-3.5 w-3.5" />
                        Meet link attached
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 xl:w-[260px] xl:flex-col">
                    <button
                      onClick={() => openEditor(booking)}
                      className="btn-primary !px-4 !py-2 text-sm"
                    >
                      <PencilLine className="h-4 w-4" />
                      Manage booking
                    </button>
                    {booking.meetLink && (
                      <a
                        href={booking.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary !px-4 !py-2 text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open meet link
                      </a>
                    )}
                    <button
                      onClick={() => void handleDelete(booking.id)}
                      disabled={workingId === booking.id}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/15"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={closeEditor}
        >
          <div
            className="glass-card w-full max-w-2xl border border-white/[0.08] p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  Manage booking
                </h2>
                <p className="text-sm text-gray-500">
                  {editing.name} | {editing.email}
                </p>
              </div>
              <button
                onClick={closeEditor}
                className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-text">Status</label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, status: event.target.value }))
                  }
                  className="input-field"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="label-text">Requested slot</label>
                <div className="input-field flex items-center text-sm text-gray-400">
                  {editing.preferredDate || "N/A"}
                  {editing.preferredTime ? ` at ${editing.preferredTime}` : ""}
                </div>
              </div>
              <div>
                <label className="label-text">Confirmed date</label>
                <input
                  type="date"
                  value={form.confirmedDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      confirmedDate: event.target.value,
                    }))
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">Confirmed time</label>
                <input
                  type="text"
                  value={form.confirmedTime}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      confirmedTime: event.target.value,
                    }))
                  }
                  className="input-field"
                  placeholder="5:30 PM IST"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="label-text">Google Meet link</label>
              <input
                type="url"
                value={form.meetLink}
                onChange={(event) =>
                  setForm((current) => ({ ...current, meetLink: event.target.value }))
                }
                className="input-field"
                placeholder="https://meet.google.com/..."
              />
            </div>

            <div className="mt-4">
              <label className="label-text">Student-facing note</label>
              <textarea
                value={form.adminNote}
                onChange={(event) =>
                  setForm((current) => ({ ...current, adminNote: event.target.value }))
                }
                className="input-field min-h-[140px] resize-none"
                placeholder="Share what the student should prepare, expected agenda, or any follow-up instruction."
              />
            </div>

            <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-gray-400">
              If you set the booking to confirmed, add the confirmed date, time,
              and Google Meet link so the student can see them in the dashboard.
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button onClick={closeEditor} className="btn-secondary text-sm">
                Cancel
              </button>
              <button
                onClick={() => void saveBooking()}
                disabled={workingId === editing.id}
                className="btn-primary text-sm"
              >
                {workingId === editing.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Save booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
