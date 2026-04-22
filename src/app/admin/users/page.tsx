"use client";

import { useMemo, useState } from "react";
import {
  Ban,
  Loader2,
  Search,
  ShieldCheck,
  ShieldX,
  Users,
} from "lucide-react";
import useAutoRefresh from "@/hooks/useAutoRefresh";
import type { UserData } from "@/lib/users";

function formatDate(value?: string | null) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [query, setQuery] = useState("");

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch users");
      }

      const nextUsers = Array.isArray(data) ? (data as UserData[]) : [];
      setUsers(nextUsers);
      setNotes(
        Object.fromEntries(
          nextUsers.map((user) => [user.uid, user.bannedReason || ""]),
        ),
      );
    } catch (error) {
      console.error("Admin users fetch error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useAutoRefresh(fetchUsers);

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return users;
    }

    return users.filter((user) =>
      [user.name, user.email, user.phone, user.gatePaper]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [query, users]);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.status !== "banned").length,
      banned: users.filter((user) => user.status === "banned").length,
      google: users.filter((user) => user.provider === "google").length,
    }),
    [users],
  );

  const updateUserStatus = async (uid: string, status: "active" | "banned") => {
    setWorkingId(uid);

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          status,
          bannedReason: notes[uid] || "",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update user");
      }

      await fetchUsers();
    } catch (error) {
      console.error("Admin user update error:", error);
      alert(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setWorkingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
          <Users className="h-6 w-6 text-accent-cyan" />
          User Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review student accounts, spot fake signups, and ban users who break community guidelines.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">Total users</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">Active</p>
          <p className="mt-2 font-display text-3xl font-bold text-green-400">{stats.active}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">Banned</p>
          <p className="mt-2 font-display text-3xl font-bold text-red-400">{stats.banned}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">Google users</p>
          <p className="mt-2 font-display text-3xl font-bold text-accent-cyan">{stats.google}</p>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="input-field pl-10 text-sm"
            placeholder="Search by name, email, phone, or paper"
          />
        </div>
      </div>

      {loading ? (
        <div className="glass-card flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="glass-card p-12 text-center text-sm text-gray-500">
          No users found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.uid} className="glass-card p-5">
              <div className="flex flex-col gap-5 xl:flex-row">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        user.status === "banned"
                          ? "bg-red-400/10 text-red-400"
                          : "bg-green-400/10 text-green-400"
                      }`}
                    >
                      {user.status === "banned" ? "Banned" : "Active"}
                    </span>
                    <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-gray-400">
                      {user.provider || "unknown"}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        user.emailVerified
                          ? "bg-accent-cyan/10 text-accent-cyan"
                          : "bg-amber-400/10 text-amber-400"
                      }`}
                    >
                      {user.emailVerified ? "Verified email" : "Unverified"}
                    </span>
                  </div>

                  <div className="grid gap-4 text-sm text-gray-400 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600">Email</p>
                      <p className="mt-1 break-all text-gray-300">{user.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600">Phone</p>
                      <p className="mt-1 text-gray-300">{user.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600">GATE paper</p>
                      <p className="mt-1 text-gray-300">{user.gatePaper || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600">Plan</p>
                      <p className="mt-1 text-gray-300">{user.plan || "free"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600">Created</p>
                      <p className="mt-1 text-gray-300">{formatDate(user.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600">Last login</p>
                      <p className="mt-1 text-gray-300">{formatDate(user.lastLoginAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full xl:max-w-sm">
                  <label className="label-text">Ban reason / moderation note</label>
                  <textarea
                    value={notes[user.uid] || ""}
                    onChange={(event) =>
                      setNotes((current) => ({
                        ...current,
                        [user.uid]: event.target.value,
                      }))
                    }
                    className="input-field min-h-[132px] resize-none"
                    placeholder="Explain why the account was banned or leave an internal moderation note."
                  />

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => void updateUserStatus(user.uid, "active")}
                      disabled={workingId === user.uid || user.status === "active"}
                      className="btn-secondary !w-full !justify-center !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Unban
                    </button>
                    <button
                      onClick={() => void updateUserStatus(user.uid, "banned")}
                      disabled={workingId === user.uid}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {workingId === user.uid ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : user.status === "banned" ? (
                        <ShieldX className="h-4 w-4" />
                      ) : (
                        <Ban className="h-4 w-4" />
                      )}
                      {user.status === "banned" ? "Update ban" : "Ban user"}
                    </button>
                  </div>

                  {user.status === "banned" && user.bannedAt && (
                    <p className="mt-3 text-xs text-red-300">
                      Banned on {formatDate(user.bannedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
